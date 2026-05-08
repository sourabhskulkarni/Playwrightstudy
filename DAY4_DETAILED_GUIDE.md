# Day 4: Detailed Trainer Guide - Database Testing & Framework Creation

## Learning Objectives
By the end of Day 4, your team will understand:
- What database testing is
- How to write SQL queries in tests
- How to set up test databases
- How to integrate UI, API, and DB testing
- How to create reusable frameworks
- Framework best practices

---

## Part 1: Database Testing Fundamentals

### Why Test Databases?

**Scenario:**
```
User books a flight via UI:
1. User fills form (booking page works) ✓
2. API processes booking (API works) ✓
3. Database should save: customer info, booking details, payment info

Problem: What if database doesn't save correctly?
- Booking shows as "confirmed" on screen but isn't actually saved
- Customer info saves but booking details don't
- Data gets corrupted or lost
```

**Solution:** Test the database directly!

### What Can Go Wrong?

```
1. Data not saved at all
2. Data saved incorrectly (wrong values)
3. Data partially saved (some fields missing)
4. Data integrity violated (foreign key issues)
5. Duplicate records created
6. Old data not updated
7. Records not deleted when expected
```

### What We Test in Database

```
1. CRUD Operations
   - Create: Does new record insert correctly?
   - Read: Can we retrieve the record?
   - Update: Does update change the right fields?
   - Delete: Does record actually get removed?

2. Data Integrity
   - Are values in correct format?
   - Are required fields always filled?
   - Are numeric ranges valid?

3. Relationships
   - Foreign keys work correctly?
   - Parent-child relationships valid?

4. Performance
   - Can we retrieve 1000 records quickly?
   - Do queries execute in reasonable time?
```

---

## Part 2: Database Setup for Testing

### SQLite - Perfect for Testing

**Why SQLite?**
- Lightweight, no installation needed
- Stores in file or memory
- Perfect for testing
- Same SQL as production databases

**Other Options:**
- `sqlite3` - File/in-memory database (what we use)
- `pg` - PostgreSQL client
- `mysql2` - MySQL client
- `mongodb` - NoSQL database

### Installation

```bash
npm install --save-dev sqlite3 @types/sqlite3
```

### Creating Test Database

```typescript
import sqlite3 from 'sqlite3';

class DatabaseHelper {
  private db: sqlite3.Database;

  constructor(dbPath: string = ':memory:') {
    // ':memory:' = database in RAM (fresh for each test)
    // './test.db' = database in file (persists)
    this.db = new sqlite3.Database(dbPath);
    this.initTables();
  }

  private initTables() {
    // Create tables that match production structure
    const createUsersTable = `
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        phone TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `;

    this.db.run(createUsersTable);
  }

  async close() {
    return new Promise((resolve, reject) => {
      this.db.close((err) => {
        if (err) reject(err);
        else resolve(true);
      });
    });
  }
}
```

---

## Part 3: SQL Operations in Tests

### INSERT - Creating Records

```typescript
async insertUser(user: { name: string; email: string; phone: string }) {
  const sql = 'INSERT INTO users (name, email, phone) VALUES (?, ?, ?)';
  
  return new Promise((resolve, reject) => {
    this.db.run(sql, [user.name, user.email, user.phone], function(err) {
      if (err) reject(err);
      else resolve(this.lastID);  // Returns ID of inserted record
    });
  });
}

// Using it:
test('create user', async () => {
  const db = new DatabaseHelper();
  const userId = await db.insertUser({
    name: 'John Doe',
    email: 'john@example.com',
    phone: '9876543210'
  });
  
  expect(userId).toBeGreaterThan(0);  // Should have an ID
  await db.close();
});
```

**SQL Breakdown:**
```sql
INSERT INTO users           -- Add record to users table
  (name, email, phone)      -- These columns
  VALUES (?, ?, ?)          -- With these values
```

The `?` are placeholders to prevent SQL injection (security feature).

### SELECT - Reading Records

```typescript
async getUserByEmail(email: string) {
  const sql = 'SELECT * FROM users WHERE email = ?';
  
  return new Promise((resolve, reject) => {
    this.db.get(sql, [email], (err, row) => {
      if (err) reject(err);
      else resolve(row);  // Returns the record or undefined
    });
  });
}

// Using it:
test('read user', async () => {
  const db = new DatabaseHelper();
  
  // First insert
  await db.insertUser({
    name: 'John Doe',
    email: 'john@example.com',
    phone: '9876543210'
  });
  
  // Then retrieve
  const user = await db.getUserByEmail('john@example.com');
  
  expect(user).toBeTruthy();
  expect(user.name).toBe('John Doe');
  expect(user.email).toBe('john@example.com');
  
  await db.close();
});
```

**SQL Breakdown:**
```sql
SELECT *                    -- Get all columns
FROM users                  -- From users table
WHERE email = ?            -- Where email matches the value provided
```

### UPDATE - Modifying Records

```typescript
async updateUserPhone(email: string, newPhone: string) {
  const sql = 'UPDATE users SET phone = ? WHERE email = ?';
  
  return new Promise((resolve, reject) => {
    this.db.run(sql, [newPhone, email], function(err) {
      if (err) reject(err);
      else resolve(this.changes);  // Returns number of rows updated
    });
  });
}

// Using it:
test('update user', async () => {
  const db = new DatabaseHelper();
  
  // Insert user
  await db.insertUser({
    name: 'John Doe',
    email: 'john@example.com',
    phone: '9876543210'
  });
  
  // Update phone
  const changed = await db.updateUserPhone('john@example.com', '8765432109');
  
  expect(changed).toBe(1);  // One row was updated
  
  // Verify update
  const user = await db.getUserByEmail('john@example.com');
  expect(user.phone).toBe('8765432109');  // Phone changed
  
  await db.close();
});
```

**SQL Breakdown:**
```sql
UPDATE users                -- Update users table
SET phone = ?               -- Set phone column to this value
WHERE email = ?            -- For the record with this email
```

### DELETE - Removing Records

```typescript
async deleteUser(email: string) {
  const sql = 'DELETE FROM users WHERE email = ?';
  
  return new Promise((resolve, reject) => {
    this.db.run(sql, [email], function(err) {
      if (err) reject(err);
      else resolve(this.changes);  // Returns number of rows deleted
    });
  });
}

// Using it:
test('delete user', async () => {
  const db = new DatabaseHelper();
  
  // Insert user
  await db.insertUser({
    name: 'John Doe',
    email: 'john@example.com',
    phone: '9876543210'
  });
  
  // Delete user
  const deleted = await db.deleteUser('john@example.com');
  
  expect(deleted).toBe(1);  // One row was deleted
  
  // Verify deletion
  const user = await db.getUserByEmail('john@example.com');
  expect(user).toBeUndefined();  // Record no longer exists
  
  await db.close();
});
```

---

## Part 4: Complex Database Operations

### Relationships - Foreign Keys

```typescript
// Create tables with relationships
private initTables() {
  const createUsersTable = `
    CREATE TABLE users (
      id INTEGER PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL
    )
  `;

  const createBookingsTable = `
    CREATE TABLE bookings (
      id INTEGER PRIMARY KEY,
      user_id INTEGER NOT NULL,
      flight_id TEXT NOT NULL,
      status TEXT DEFAULT 'pending',
      FOREIGN KEY (user_id) REFERENCES users(id)
    )
  `;

  this.db.run(createUsersTable);
  this.db.run(createBookingsTable);
}

// Insert related data
async createUserWithBooking(user: any, booking: any) {
  // 1. Insert user
  const userId = await this.insertUser(user);
  
  // 2. Insert booking (references user)
  const sql = 'INSERT INTO bookings (user_id, flight_id, status) VALUES (?, ?, ?)';
  
  return new Promise((resolve, reject) => {
    this.db.run(sql, [userId, booking.flight_id, booking.status], function(err) {
      if (err) reject(err);
      else resolve({ userId, bookingId: this.lastID });
    });
  });
}
```

**What is Foreign Key?**
```
Foreign Key = Link to another table
Ensures data integrity:
- Can't create booking for non-existent user
- Can't delete user if they have bookings
```

### Transactions - All or Nothing

```typescript
async transferBooking(fromUserId: number, toUserId: number, bookingId: number) {
  return new Promise((resolve, reject) => {
    this.db.serialize(() => {
      // Start transaction
      this.db.run('BEGIN TRANSACTION');
      
      try {
        // Update booking owner
        this.db.run(
          'UPDATE bookings SET user_id = ? WHERE id = ?',
          [toUserId, bookingId],
          function(err) {
            if (err) throw err;
          }
        );
        
        // Commit if all goes well
        this.db.run('COMMIT', (err) => {
          if (err) reject(err);
          else resolve(true);
        });
      } catch (error) {
        // Rollback if anything fails
        this.db.run('ROLLBACK');
        reject(error);
      }
    });
  });
}
```

**Why Transactions Matter:**
```
Scenario: Transferring booking between users
Step 1: Remove from user 1 ✓
Step 2: Add to user 2 ✗ (Database error!)

Without transaction: Booking lost!
With transaction: All or nothing - reverts to original state
```

### Aggregate Functions

```typescript
async getUserBookingCount(userId: number): Promise<number> {
  const sql = 'SELECT COUNT(*) as count FROM bookings WHERE user_id = ?';
  
  return new Promise((resolve, reject) => {
    this.db.get(sql, [userId], (err, row: any) => {
      if (err) reject(err);
      else resolve(row.count);
    });
  });
}

async getTotalBookingValue(userId: number): Promise<number> {
  const sql = 'SELECT SUM(price) as total FROM bookings WHERE user_id = ?';
  
  return new Promise((resolve, reject) => {
    this.db.get(sql, [userId], (err, row: any) => {
      if (err) reject(err);
      else resolve(row.total || 0);
    });
  });
}

// Using it:
test('verify booking statistics', async () => {
  const db = new DatabaseHelper();
  
  // Create user  
  const userId = await db.insertUser(...);
  
  // Create multiple bookings
  await db.insertBooking({ user_id: userId, ... });
  await db.insertBooking({ user_id: userId, ... });
  
  // Check counts
  const count = await db.getUserBookingCount(userId);
  expect(count).toBe(2);
  
  const total = await db.getTotalBookingValue(userId);
  expect(total).toBeGreaterThan(0);
  
  await db.close();
});
```

---

## Part 5: Integrating UI, API, and DB Testing

### The Complete E2E Flow

```
User Interface (UI)
    ↓
API Server
    ↓
Database

Test should verify all layers!
```

### Example: Complete Booking Flow

```typescript
test('complete booking with UI, API, and DB validation', async ({ page }) => {
  // SETUP
  const db = new DatabaseHelper();
  const api = new ApiClient();
  const home = new HomePage(page);
  const booking = new BookingPage(page);
  
  // ===== UI LAYER =====
  // User navigates and searches
  await home.navigate();
  await home.selectFromCity('Delhi');
  await home.selectToCity('Mumbai');
  await home.clickSearch();
  
  // ===== API LAYER =====
  // Verify API returned flights
  const flights = await api.searchFlights('DEL', 'BOM', '2024-12-01');
  expect(flights.total).toBeGreaterThan(0);
  
  // ===== UI LAYER =====
  // User books flight
  await booking.selectFareType('regular');
  await booking.enterPassengerDetails({
    name: 'John Doe',
    email: 'john@example.com',
    phone: '9876543210'
  });
  
  // ===== API LAYER =====
  // Verify booking created via API
  const bookingResult = await api.createBooking(
    flights.flights[0].id,
    [{ name: 'John Doe', email: 'john@example.com' }]
  );
  
  // ===== DB LAYER =====
  // Verify data saved in database
  const dbUser = await db.getUserByEmail('john@example.com');
  expect(dbUser).toBeTruthy();
  expect(dbUser.name).toBe('John Doe');
  
  const dbBookings = await db.getBookingsByUserId((dbUser as any).id);
  expect(dbBookings.length).toBeGreaterThan(0);
  expect((dbBookings as any)[0].status).toBe('pending');
  
  // ===== CLEANUP =====
  await api.dispose();
  await db.close();
});
```

**What This Test Verifies:**
1. ✓ UI works (can navigate, fill form, see results)
2. ✓ API works (returns correct flights, creates booking)
3. ✓ Database works (saves user and booking correctly)
4. ✓ Data flows correctly through all layers

---

## Part 6: Test Data Management

### Fixture Approach - Predefined Data

```typescript
// fixtures/testData.ts
export const testData = {
  validUser: {
    name: 'John Doe',
    email: 'john@example.com',
    phone: '9876543210'
  },
  
  invalidUser: {
    name: '',  // Missing name
    email: 'invalid',  // Invalid email
    phone: '123'  // Too short
  },
  
  flights: {
    delhi_mumbai: {
      from: 'DEL',
      to: 'BOM',
      date: '2024-12-01'
    }
  }
};

// Using it in tests:
test('book with valid user', async () => {
  const db = new DatabaseHelper();
  await db.insertUser(testData.validUser);
  // ...
});
```

### Factory Approach - Generate Data

```typescript
// factories/userFactory.ts
export function createUser(overrides = {}) {
  return {
    name: 'John Doe',
    email: `user-${Date.now()}@example.com`,  // Unique email
    phone: '9876543210',
    ...overrides  // Allow customization
  };
}

// Using it:
test('create multiple unique users', async () => {
  const db = new DatabaseHelper();
  
  await db.insertUser(createUser());
  await db.insertUser(createUser({ name: 'Jane Doe' }));
  await db.insertUser(createUser({ phone: '1111111111' }));
  
  // Each has unique email, but can customize other fields
});
```

### Test Data Cleanup

```typescript
test('cleanup after test', async () => {
  const db = new DatabaseHelper(':memory:');  // Fresh DB for this test
  
  try {
    // Test code here
    const userId = await db.insertUser({ name: 'Test', email: 'test@ex.com', phone: '123' });
    expect(userId).toBeGreaterThan(0);
  } finally {
    // Cleanup happens automatically when DB closes
    await db.close();
  }
});

// Or explicitly delete:
test('explicit cleanup', async () => {
  const db = new DatabaseHelper();
  
  try {
    // Test code
    const userId = await db.insertUser(...);
    
    // Explicit cleanup
    await db.deleteUser('test@example.com');
  } finally {
    await db.close();
  }
});
```

---

## Part 7: Framework Architecture

### Complete Framework Structure

```
PlaywrightStudy/
├── src/
│   ├── pages/                    ← Page Objects
│   │   ├── BasePage.ts
│   │   ├── HomePage.ts
│   │   ├── BookingPage.ts
│   │   └── ResultsPage.ts
│   │
│   ├── api/                      ← API Clients
│   │   ├── ApiClient.ts
│   │   ├── FlightsAPI.ts
│   │   └── BookingAPI.ts
│   │
│   ├── database/                 ← Database Helpers
│   │   ├── DatabaseHelper.ts
│   │   └── Migrations.ts
│   │
│   ├── fixtures/                 ← Test Data
│   │   ├── testData.ts
│   │   └── constants.ts
│   │
│   └── utils/                    ← Utility Functions
│       ├── logger.ts
│       ├── config.ts
│       └── helpers.ts
│
├── tests/
│   ├── ui/                       ← UI Tests
│   │   ├── home.spec.ts
│   │   ├── booking.spec.ts
│   │   └── search.spec.ts
│   │
│   ├── api/                      ← API Tests
│   │   ├── flights.spec.ts
│   │   └── booking.spec.ts
│   │
│   ├── e2e/                      ← End-to-End Tests
│   │   ├── complete-booking.spec.ts
│   │   └── round-trip.spec.ts
│   │
│   └── db/                       ← Database Tests
│       ├── users.spec.ts
│       └── bookings.spec.ts
│
├── playwright.config.ts
├── tsconfig.json
└── package.json
```

### Benefits of This Structure

```
1. Separation of Concerns
   - Each folder has specific responsibility
   - Easy to find code

2. Reusability
   - Page objects used by many tests
   - API clients used by UI and E2E tests
   - Fixtures used by all tests

3. Maintainability
   - Change pages in one place
   - Change API endpoints in one place
   - Update test data once

4. Scalability
   - Easy to add new pages, APIs, or tests
   - Works for 10 or 1000 tests
```

---

## Part 8: Best Practices

### 1. Test Naming Convention

```typescript
// ❌ Bad
test('test1', async () => {})

// ✓ Good - Describes the behavior
test('should complete booking when user enters valid details', async () => {})

// ✓ Better - Given/When/Then structure
test('Given user is on booking page, When they enter valid details and click submit, Then booking should be created', async () => {})
```

### 2. Single Responsibility

```typescript
// ❌ Test does too much
test('complete workflow', async ({ page }) => {
  // Navigate
  // Search
  // Book
  // Verify
  // Cancel
  // Create new booking
  // ... 15 more things
});

// ✓ Each test does one thing
test('user can search for flights', async ({ page }) => {
  const home = new HomePage(page);
  await home.navigate();
  await home.search('DEL', 'BOM');
  // Only testing search
});

test('user can complete booking', async ({ page }) => {
  // Only testing booking
});
```

### 3. DRY Principle (Don't Repeat Yourself)

```typescript
// ❌ Repeated setup
test('test 1', async ({ page }) => {
  const home = new HomePage(page);
  await home.navigate();
  await home.fillForm();
  // Test code
});

test('test 2', async ({ page }) => {
  const home = new HomePage(page);
  await home.navigate();
  await home.fillForm();
  // Test code
});

// ✓ Shared setup
test.beforeEach(async ({ page }) => {
  const home = new HomePage(page);
  await home.navigate();
  await home.fillForm();
});

test('test 1', async ({ page }) => {
  // Setup already done
  // Just test logic
});

test('test 2', async ({ page }) => {
  // Setup already done
  // Just test logic
});
```

### 4. Error Handling

```typescript
// ❌ Ignoring errors
test('search', async ({ page }) => {
  await page.locator('.modal-close').click();  // Might not exist!
  await home.search();
});

// ✓ Proper error handling
test('search', async ({ page }) => {
  try {
    const closeBtn = page.locator('.modal-close');
    if (await closeBtn.isVisible({ timeout: 2000 })) {
      await closeBtn.click();
    }
  } catch (e) {
    console.log('No modal popup');
  }
  
  await home.search();
});
```

### 5. Assertions

```typescript
// ❌ Weak assertions
test('search works', async ({ page }) => {
  await home.search();
  expect(true).toBe(true);  // Doesn't test anything!
});

// ✓ Strong assertions
test('search works', async ({ page }) => {
  await home.search();
  
  // Multiple specific assertions
  const results = page.locator('.flight-results');
  await expect(results).toBeVisible();
  
  const count = await page.locator('.flight-item').count();
  expect(count).toBeGreaterThan(0);
  
  const price = await page.locator('.price').first().textContent();
  expect(price).toMatch(/[0-9]+/);
});
```

---

## Part 9: Running Complete Framework Tests

### Run by Category

```bash
# Run all UI tests
npm test -- tests/ui/

# Run all API tests
npm test -- tests/api/

# Run all E2E tests
npm test -- tests/e2e/

# Run all DB tests
npm test -- tests/db/

# Run specific test file
npm test -- tests/ui/home.spec.ts

# Run with specific browser
npm test -- --project=chromium

# Run in debug mode
npm test -- --debug

# Run with UI
npm test -- --ui
```

### Understanding Test Reports

```
Test Report shows:
- Which tests passed/failed
- Time taken for each test
- Screenshots/videos (if enabled)
- Error messages
- Test trace (what happened)
```

---

## Exercises for Day 4

### Exercise 1: Create DatabaseHelper
Implement:
- Insert user
- Get user by email
- Update user phone
- Delete user
- Get user bookings count

### Exercise 2: Create API Client
Implement:
- Search flights
- Create booking
- Get booking details
- Get user profile

### Exercise 3: Create Complete Test
Write test that:
1. Creates user via DB
2. Searches flights via API
3. Creates booking via API
4. Verifies booking in DB
5. Navigates to UI and verifies display

### Exercise 4: Framework Setup
Create folder structure:
```
src/
├── pages/
├── api/
├── database/
├── fixtures/
└── utils/
```

---

## Summary of Day 4

**Key Concepts:**
1. **Database Testing** - Verify data persistence
2. **SQL Operations** - CRUD operations
3. **Data Integrity** - Relationships, constraints
4. **Transactions** - All or nothing operations
5. **E2E Integration** - UI + API + DB
6. **Framework Architecture** - Scalable, maintainable structure

**Best Practices:**
- Test all layers (UI, API, DB)
- DRY principle - no repetition
- Single responsibility - one test = one thing
- Proper error handling
- Strong, specific assertions
- Organized folder structure

**For 9-Year Experienced Developer:**
With this framework architecture, you can:
- Mentor junior developers
- Design test strategies
- Make architectural decisions
- Optimize framework performance
- Lead testing initiatives

You're now ready to be an **SDET Architect**! 🏗️

---

## Additional Resources

### TypeScript & Playwright Docs
- [Playwright Documentation](https://playwright.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)

### Interview Preparation
See [InterviewPrep/README.md](InterviewPrep/README.md) for 20 common SDET interview questions