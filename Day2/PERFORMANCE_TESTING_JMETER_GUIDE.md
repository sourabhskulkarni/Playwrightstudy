# JMeter Performance Testing - Complete Beginner's Guide

## Welcome to JMeter! 📊

**JMeter** is the professional-grade performance testing tool for complex scenarios. It's used by enterprise companies worldwide.

---

## Part 1: K6 vs JMeter - When to Use What?

### Quick Comparison:

| Aspect | K6 | JMeter |
|--------|----|----|
| **Learning Curve** | Easy (JavaScript) | Steeper (GUI + concepts) |
| **Best For** | Simple to medium tests | Complex scenarios |
| **Language** | JavaScript | GUI or XML |
| **Setup Time** | Minutes | Hours |
| **Cloud Integration** | Built-in | Manual |
| **Test Types** | Load, Stress, Spike | Everything + advanced |
| **Reporting** | Good | Excellent |
| **Enterprise Support** | Yes | Yes (Apache) |
| **Scalability** | Good | Excellent |

### Decision Tree:

```
Start with simple test?
├─ YES → Use K6 (faster to learn)
└─ NO → Use JMeter (more power)

Need GUI?
├─ YES → Use JMeter
└─ NO → Use K6

Testing complex business flows?
├─ YES → Use JMeter
└─ NO → K6 is fine

Need distributed load from 50+ machines?
├─ YES → Use JMeter
└─ NO → K6 Cloud or JMeter local

New to performance testing?
├─ YES → Start with K6, graduate to JMeter
└─ NO → Use JMeter directly
```

**Our Recommendation:** Learn both!
- **K6:** For quick API tests and CI/CD integration
- **JMeter:** For complex scenarios and enterprise testing

---

## Part 2: What is JMeter?

### Simple Definition:

**JMeter** is a powerful tool that simulates hundreds/thousands of users and generates detailed performance reports.

### Real-Life Analogy:

```
K6: Like a health checkup
├─ Quick test
├─ Basic findings
└─ Done in minutes

JMeter: Like a comprehensive medical exam
├─ Detailed testing
├─ Multiple measurements
├─ Various scenarios
└─ Detailed diagnosis
```

### JMeter Components:

```
┌────────────────────────────────────────┐
│  JMeter (GUI)                          │
├────────────────────────────────────────┤
│  ├─ Test Plan (main container)         │
│  │  ├─ Thread Group (users)            │
│  │  │  ├─ HTTP Sampler (requests)      │
│  │  │  ├─ Assertions (checks)          │
│  │  │  └─ Listeners (reports)          │
│  │  │                                  │
│  │  ├─ Config Elements                 │
│  │  │  ├─ HTTP Request Defaults        │
│  │  │  ├─ Cookie Manager               │
│  │  │  └─ Headers Manager              │
│  │  │                                  │
│  │  └─ Preprocessors/Postprocessors    │
│  │     ├─ Extract data from responses  │
│  │     └─ Execute logic                │
│  └─ Listeners (reports & graphs)       │
│     ├─ View Results Tree               │
│     ├─ Aggregate Report                │
│     ├─ Graph Results                   │
│     └─ Summary Report                  │
└────────────────────────────────────────┘
```

---

## Part 3: Installing JMeter

### For Windows:

**Option 1: Direct Download (Recommended)**
```
1. Go to: https://jmeter.apache.org/download_jmeter.cgi
2. Download: apache-jmeter-5.5.zip
3. Extract to a folder (e.g., C:\tools\jmeter)
4. Add to PATH (optional, for command line)
5. Run: jmeter.bat (in bin folder)
```

**Option 2: Using Chocolatey**
```bash
choco install jmeter
jmeter
```

### For Mac:

**Using Homebrew:**
```bash
brew install jmeter

# Run JMeter
jmeter
```

### For Linux:

**Ubuntu/Debian:**
```bash
sudo apt-get install jmeter

# Run JMeter
jmeter
```

### Verify Installation:

```bash
# Check version
jmeter --version

# Should show: apache-jmeter-5.5 (or your version)
```

### JMeter Directory Structure:

```
apache-jmeter-5.5/
├── bin/
│   ├── jmeter.bat          (Windows)
│   ├── jmeter.sh           (Linux/Mac)
│   └── jmeter              (Linux/Mac script)
├── lib/
│   └── (All JAR files needed)
├── docs/
│   └── (Help documentation)
└── extras/
    └── (Optional plugins)
```

---

## Part 4: JMeter GUI Overview

### Starting JMeter:

**Windows:**
```bash
# Double-click jmeter.bat
# OR in terminal:
jmeter.bat
```

**Mac/Linux:**
```bash
jmeter
```

### Main GUI Components:

```
┌──────────────────────────────────────────────┐
│  JMeter 5.5 - Apache JMeter                 │
├──────────────────────────────────────────────┤
│  File Edit View Options Tools Help          │  ← Menu Bar
├──────────────────────────────────────────────┤
│  [New] [Open] [Save] [Run] [Stop]          │  ← Toolbar
├──────────────────────────────────────────────┤
│ Test Plan                      │ Main Pane  │
│ ├─ Thread Group               │           │
│ │  ├─ HTTP Sampler           │ (configs) │
│ │  └─ Assertions             │           │
│ └─ Listeners                 │           │
│   └─ View Results Tree       │           │
│ ↑                             │           │
│ Left Pane (Test Tree)         │           │
└──────────────────────────────────────────────┘
```

### Left Pane Functions:

- **Add Elements:** Right-click → Add
- **Edit Elements:** Click and configure in main pane
- **Delete Elements:** Right-click → Delete
- **Enable/Disable:** Right-click → Toggle on/off

### Main Pane:

Shows configuration for selected element (HTTP Sampler, Assertions, etc.)

### View Menus:

```
View → Show/Hide
├─ Tree (test structure)
├─ Request (HTTP configuration)
├─ Response (sample response)
└─ Samplers (requests made)
```

---

## Part 5: Creating Your First JMeter Test Plan

### Step 1: Create Test Plan

1. Open JMeter
2. Right-click "Test Plan" → Add → Threads (Users) → Thread Group
3. Configure Thread Group:
   - Number of Threads: 10 (10 users)
   - Ramp-up: 10 (start over 10 seconds)
   - Loop Count: 5 (each user makes 5 requests)

### Step 2: Add HTTP Request Sampler

1. Right-click Thread Group → Add → Sampler → HTTP Request
2. Configure:
   - Server Name: `api.makemytrip.com`
   - Protocol: `https`
   - Path: `/flights`
   - Method: `GET`

### Step 3: Add Assertions

1. Right-click HTTP Sampler → Add → Assertions → Response Assertion
2. Configure:
   - Response Code: 200

### Step 4: Add Listeners (Results)

1. Right-click Test Plan → Add → Listener → View Results Tree
2. Right-click Test Plan → Add → Listener → Aggregate Report
3. Right-click Test Plan → Add → Listener → Graph Results

### Step 5: Run Test

1. Click Run → Start (or Ctrl + Enter)
2. Watch results in View Results Tree
3. See summary in Aggregate Report

---

## Part 6: Key JMeter Concepts

### Concept 1: Thread Group (Users)

**What:** Represents virtual users.

```
Thread Group:
├─ Number of Threads: 50     (50 virtual users)
├─ Ramp-up (seconds): 60     (start over 60 seconds)
└─ Loop Count: 10            (each user makes 10 requests)

Timeline:
t=0s:   User 1 starts
t=1.2s: User 2 starts (50 users ÷ 60 seconds)
t=2.4s: User 3 starts
...
t=60s:  User 50 starts
(all 50 users running simultaneously!)

Each user loops 10 times, so:
Total Requests = 50 users × 10 loops = 500 requests
```

### Concept 2: Sampler (Requests)

**What:** Represents a single HTTP request.

```
HTTP Sampler Types:
├─ HTTP Request        (normal request)
├─ FTP Request          (FTP file transfer)
├─ SMTP Request         (email)
└─ JDBC Request         (database)

Common Settings:
├─ Protocol: http/https
├─ Server Name: api.makemytrip.com
├─ Port: 443
├─ Method: GET/POST/PUT/DELETE
├─ Path: /flights
└─ Parameters: from=DEL&to=BOM
```

### Concept 3: Configuration Elements

```
├─ HTTP Request Defaults    (common settings for all requests)
├─ Cookie Manager            (handles cookies)
├─ Header Manager            (custom headers)
├─ User Defined Variables    (store values)
└─ Cache Manager             (cache responses)
```

### Concept 4: Assertions (Checks)

```
Response Assertion:
├─ Response Code: 200           (status should be 200)
├─ Response Body: "flights"     (should contain "flights")
├─ Response Headers             (check specific headers)
└─ Response Time: < 500         (should be fast)
```

### Concept 5: Listeners (Reports)

```
View Results Tree
├─ Shows individual request/response
├─ Useful for debugging
└─ Shows failures immediately

Aggregate Report
├─ Summary statistics
├─ Average response time
├─ Min/Max/Median
└─ Error percentage

Graph Results
├─ Visual performance graph
├─ Response time over time
└─ X-axis: time, Y-axis: ms

Summary Report
├─ Minimal report
├─ Fast rendering
└─ Good for large tests
```

---

## Part 7: Creating Real Test Scenarios

### Example 1: Flight Search Test

**Test Steps:**
1. Open makemytrip.com
2. Enter "Delhi" in From field
3. Enter "Mumbai" in To field
4. Select a date
5. Click Search
6. Assert search results appear

**JMeter Setup:**

1. Create Thread Group (50 users)
2. Configure HTTP Request Default (Server: makemytrip.com)
3. Add First HTTP Request
   - Path: `/`
   - Assertions: Response Code = 200

4. Add Extract Regular Expression (get form token from response)
   - Variable: `token`
   - Expression: `<input.*name="token".*value="([^"]+)"`

5. Add Second HTTP Request (search)
   - Method: POST
   - Path: `/search`
   - Parameters:
     - from: `Delhi`
     - to: `Mumbai`
     - date: `2025-12-01`
     - token: `${token}`
   - Assertions: 
     - Response Code = 200
     - Body: `flights` (results appear)

---

### Example 2: API Test with Authentication

**Setup:**

1. **Thread Group:** 20 users, 20 second ramp-up, loop 3 times
2. **HTTP Request Default:**
   - Server: `api.makemytrip.com`
   - Port: `443`
   - Protocol: `https`

3. **Header Manager:** (Right-click Thread Group → Add → Config Element → HTTP Header Manager)
   ```
   Add Headers:
   ├─ Authorization: Bearer ${API_TOKEN}
   ├─ Content-Type: application/json
   └─ User-Agent: JMeter-Test/1.0
   ```

4. **HTTP Request - Login**
   ```
   Method: POST
   Path: /auth/login
   Body: 
   {
     "email": "user@example.com",
     "password": "password123"
   }
   ```

5. **Regular Expression Extractor** (extract token from login response)
   ```
   Variable Name: API_TOKEN
   Regular Expression: "token":"([^"]+)"
   Match Number: 1
   ```

6. **HTTP Request - Search Flights**
   ```
   Method: GET
   Path: /flights?from=DEL&to=BOM
   (Uses ${API_TOKEN} from header manager)
   ```

7. **Response Assertion**
   ```
   ├─ Response Code: 200
   ├─ Response Body: "flights"
   └─ Response Time: < 500
   ```

8. **Listeners**
   ```
   Add all three:
   ├─ View Results Tree (debug)
   ├─ Aggregate Report (summary)
   └─ Graph Results (visualization)
   ```

---

## Part 8: Advanced JMeter Features

### Feature 1: CSV Data Set Config (Test Different Cities)

**File:** `cities.csv`
```csv
from,to
DEL,BOM
BOM,AGR
JAI,DEL
AGR,JAI
```

**In JMeter:**
1. Right-click Thread Group → Add → Config Element → CSV Data Set Config
2. Configure:
   - File Name: `cities.csv`
   - Variables: `from,to`
   - Delimiter: `,`

3. Use in HTTP Request:
   ```
   Path: /search?from=${from}&to=${to}
   ```

**Result:** Each user gets different city pairs from CSV!

### Feature 2: If Controller (Conditional Logic)

```
Thread Group:
├─ HTTP Request (login)
├─ Regular Expression Extractor (get token)
├─ If Controller: "${token}" != ""
│  └─ HTTP Request (search flights)    (only if token exists)
└─ Listeners
```

### Feature 3: Counter (Sequential IDs)

```
├─ Counter (name: userID)
│  ├─ Starting Value: 1
│  └─ Increment: 1
├─ HTTP Request
│  └─ Path: /user/${userID}    (1, 2, 3, 4...)
└─ Listeners
```

### Feature 4: Timers (Think Time)

```
├─ HTTP Request (search)
├─ Constant Timer (1000ms = 1 second think time)
├─ HTTP Request (book)
├─ Constant Timer (500ms)
├─ HTTP Request (confirm)
└─ Random Timer (500-1500ms = random think time)
```

---

## Part 9: JMeter CLI (Command Line)

### Running Tests Without GUI (Better Performance):

```bash
# Simple run
jmeter -n -t test.jmx -l results.jtl

# Explanation:
# -n           = non-GUI mode (faster!)
# -t           = test plan file
# -l           = log results file

# Generate report
jmeter -n -t test.jmx -l results.jtl -j jmeter.log

# Explanation:
# -j           = JMeter log file
```

### Parameters:

```bash
# -n           Non-GUI mode (required for CI/CD)
# -t           Test plan file (.jmx)
# -l           Results file (jtl format)
# -j           Log file
# -g           Generate HTML report
# -e           Generate HTML report (newer)
# -o           Output folder for report
# -D           Java system properties (-Dkey=value)
# -J           JMeter properties (-Jkey=value)
```

### Full Command Example:

```bash
jmeter \
  -n \
  -t performance/jmeter/booking-test.jmx \
  -l results/booking-results.jtl \
  -j results/jmeter.log \
  -e \
  -o results/html-report/

# This will:
# 1. Run non-GUI
# 2. Load booking-test.jmx
# 3. Save results to .jtl file
# 4. Generate HTML report in results/html-report/
# 5. Open in browser automatically
```

---

## Part 10: JMeter Performance Results Interpretation

### Aggregate Report Columns:

```
┌─────────┬────┬────┬────┬────┬──────┬───────────┐
│ Label   │ #  │ Avg│Min │Max │Std   │Error %    │
├─────────┼────┼────┼────┼────┼──────┼───────────┤
│ Search  │ 500│ 245│ 120│ 890│ 145  │ 0.00%     │
│ Book    │ 500│ 560│ 200│1200│ 290  │ 2.50%     │
│ Confirm │ 487│ 340│ 150│ 950│ 175  │ 2.60%     │
└─────────┴────┴────┴────┴────┴──────┴───────────┘

Explanation:
├─ Label: Request name
├─ #: Number of requests (500 requests)
├─ Avg: Average response time (245ms)
├─ Min: Fastest request (120ms)
├─ Max: Slowest request (890ms)
├─ Std: Standard deviation (variation)
└─ Error %: Failure percentage (0% = perfect)
```

### Response Time Analysis:

```
Response Time: 245ms (average) ← Is this good?

Depends on:
├─ Type of request
│  ├─ Simple search: < 200ms ✓ (this is slow)
│  └─ Complex booking: < 500ms ✓ (this is good)
├─ Number of users
│ ├─ 50 users: might be fast
│  └─ 1000 users: will be slower
└─ What's acceptable
   ├─ Marketing sites: < 500ms
   ├─ E-commerce: < 300ms
   └─ Banking: < 100ms
```

### Error Rate Analysis:

```
Error %:
├─ 0.00% = Perfect!
├─ 0.01-0.05% = Acceptable
├─ 0.05-0.10% = Needs investigation
├─ 0.10-1.00% = Problems found
└─ > 1.00% = Serious issues

In our example:
├─ Search: 0.00% errors ✓ Perfect
├─ Book: 2.50% errors ✗ 2.5 out of 100 fail
└─ Confirm: 2.60% errors ✗ Similar issue
```

---

## Part 11: Distributed Testing (Master-Slave)

**Problem:** Single machine can only simulate ~1000 concurrent users.

**Solution:** Use multiple machines!

```
Master (Controller)
├─ Controls test
├─ Aggregates results
└─ Shows final report

Slave 1 (Generator)        Slave 2 (Generator)        Slave 3 (Generator)
├─ 500 users                ├─ 500 users                ├─ 500 users
└─ 250 requests/sec         └─ 250 requests/sec         └─ 250 requests/sec

Total: 1500 users, 750 requests/sec!
```

**Setup:**

1. Configure Master (jmeter.properties)
   ```
   # server.rmi.port=4000
   ```

2. Start Slaves
   ```bash
   jmeter-slave.sh
   # Starts listening for master
   ```

3. Connect Master to Slaves (GUI)
   ```
   Run → Remote Start All
   # Or: Run → Remote Stop All
   ```

---

## Part 12: JMeter Project Structure

```
PlaywrightStudy/
├── performance/
│   ├── jmeter/
│   │   ├── test-plans/
│   │   │   ├── booking-flow.jmx         ← Test plan XML
│   │   │   ├── api-load-test.jmx
│   │   │   ├── stress-test.jmx
│   │   │   └── spike-test.jmx
│   │   │
│   │   ├── data/
│   │   │   ├── cities.csv               ← Test data
│   │   │   ├── users.csv
│   │   │   └── dates.csv
│   │   │
│   │   ├── scripts/
│   │   │   ├── run-load-test.sh         ← Execution scripts
│   │   │   ├── run-stress-test.sh
│   │   │   └── generate-report.sh
│   │   │
│   │   └── results/
│   │       ├── booking-results.jtl      ← Results
│   │       ├── html-report/             ← HTML reports
│   │       ├── graphs/
│   │       └── benchmarks.md            ← Baseline targets
│   │
│   └── reports/
│       └── performance-analysis.md
│
├── .github/
│   └── workflows/
│       └── performance.yml              ← CI/CD integration
│
└── package.json
```

---

## Part 13: Integration with CI/CD

### Creating `run-jmeter.sh`:

```bash
#!/bin/bash

# Variables
TEST_PLAN="./performance/jmeter/booking-flow.jmx"
RESULTS="./performance/results/results.jtl"
LOG="./performance/results/jmeter.log"
REPORT="./performance/results/html-report"

# Run JMeter non-GUI
echo "Running JMeter test..."
jmeter -n -t $TEST_PLAN -l $RESULTS -j $LOG -e -o $REPORT

# Check for errors
if [ -f "$RESULTS" ]; then
  echo "Test completed. Results: $RESULTS"
  echo "Report: $REPORT/index.html"
else
  echo "Test failed! No results file."
  exit 1
fi
```

### GitHub Actions Integration:

```yaml
# .github/workflows/jmeter.yml
name: JMeter Performance Tests

on:
  schedule:
    - cron: '0 3 * * 0'  # Weekly
  workflow_dispatch:

jobs:
  jmeter-test:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Install JMeter
        run: |
          sudo apt-get update
          sudo apt-get install -y jmeter
      
      - name: Run JMeter Tests
        run: bash performance/jmeter/scripts/run-jmeter.sh
      
      - name: Upload Results
        uses: actions/upload-artifact@v3
        if: always()
        with:
          name: jmeter-report
          path: performance/results/html-report/
```

---

## Part 14: Best Practices

### Best Practice 1: Realistic Scenarios

```
❌ BAD - Unrealistic test
├─ 10,000 users
├─ No think time
├─ No data variation
└─ All hitting GET /status

✓ GOOD - Realistic test
├─ 100 users
├─ Varied think time (1-5 seconds)
├─ Different cities from CSV
└─ Real user journey (search → book → confirm)
```

### Best Practice 2: Warm-up Thread

```
Thread Group 1: Warm-up
├─ 5 users
├─ 5 second ramp-up
├─ Loop 5 times
└─ Purpose: Prime database connections

(Wait 30 seconds)

Thread Group 2: Actual Test
├─ 100 users
├─ 60 second ramp-up
├─ Loop 10 times
└─ Measure from here
```

### Best Practice 3: Baseline & Targets

```
Baseline (current performance):
├─ Average response time: 250ms
├─ Error rate: 0.1%
├─ P95 (95% of requests): 450ms
└─ Max concurrent users: 500

Targets (goals):
├─ Average response time: < 300ms (allow 20% degradation)
├─ Error rate: < 0.5% (allow 5x)
├─ P95: < 600ms
└─ Max concurrent users: 1000 (double)
```

### Best Practice 4: Save Test Plans

```bash
# Always save as version-controlled files
git add performance/jmeter/booking-flow.jmx
git commit -m "Add booking flow load test"

# Track changes to test plans
# This lets you see what changed:
git diff performance/jmeter/booking-flow.jmx
```

---

## Part 15: Troubleshooting JMeter

| Problem | Cause | Solution |
|---------|-------|----------|
| "Connection refused" | Server not running | Check server is up |
| "Read timeout" | Server too slow | Increase timeout value |
| "Out of memory" | Too many VUs | Use distributed testing |
| "No responses" | Wrong hostname | Check server name |
| "SSL errors" | Certificate issue | Accept untrusted certs in Options |
| "All requests failed" | Network issue | Check firewall |
| "Results file empty" | Test didn't run | Check error logs |

---

## Part 16: Summary & Next Steps

### What You've Learned:

✓ JMeter vs K6 comparison  
✓ Installing JMeter  
✓ GUI components and navigation  
✓ Creating test plans  
✓ Thread Groups and users  
✓ HTTP Samplers (requests)  
✓ Assertions (checks)  
✓ Listeners (reports)  
✓ Advanced features (CSV, timers, extractors)  
✓ CLI mode for CI/CD  
✓ Interpreting results  
✓ Distributed testing  
✓ Best practices  

### Next Steps:

1. **Install JMeter** - Part 3 above
2. **Create first test** - Record with built-in Proxy
3. **Run locally** - Using GUI
4. **Add assertions** - Verify correctness
5. **Configure multiple users** - Increase thread count
6. **Extract data** - Study Regular Expression Extractor
7. **Run in CLI** - jmeter -n -t...
8. **Generate reports** - HTML reporting
9. **Distribute testing** - Master-slave setup
10. **Integrate with CI/CD** - GitHub Actions

### JMeter Learning Path:

```
Week 1: GUI Basics
├─ Open JMeter
├─ Create simple HTTP test
├─ Add assertions
└─ Run and view results

Week 2: Advanced Features
├─ CSV data sets
├─ Regular expression extractors
├─ Timers and think time
└─ Complex user journeys

Week 3: CLI & Automation
├─ Run in non-GUI mode
├─ Generate HTML reports
├─ Distributed testing
└─ CI/CD integration

Week 4: Mastery
├─ Performance tuning
├─ Custom plugins
├─ Enterprise scenarios
└─ Training the team
```

---

## Exercises

### Exercise 1: Create Login Test

**Task:** Create JMeter test that:
1. Makes POST request to /api/login
2. Extracts token from response
3. Uses token in next request
4. Asserts success

### Exercise 2: CSV Data Test

**Task:** Create CSV with 5 different user accounts
- Test logging in with each
- Verify unique session for each

### Exercise 3: Distributed Test

**Task:** Set up master-slave testing
1. Start slave on second machine
2. Connect from master
3. Run test across both

### Exercise 4: Compare K6 and JMeter

**Task:** Create same test in both K6 and JMeter
- Compare results
- Compare ease of use
- Compare report quality

---

## Quick Command Reference

### Start JMeter:
```bash
jmeter              # GUI mode
jmeter -n -t test.jmx -l results.jtl  # CLI mode
```

### Generate Report:
```bash
jmeter -g results.jtl -o html-report/
```

### Distributed:
```bash
jmeter-slave        # Start slave
# Then in master GUI: Run → Remote Start All
```

### Common Options:
```
-n    Non-GUI mode
-t    Test plan file
-l    Results log file
-j    JMeter log file
-g    Generate report
-e    Generate HTML dashboard
-o    Report output folder
-J    Property (JMeter)
-D    Property (Java)
-s    Run as slave
-R    Remote hosts
-H    Proxy host
-P    Proxy port
```

---

**Congratulations! You now understand JMeter! 🎉**

**Next: Integrate K6 and JMeter into your CI/CD pipeline (see DAY5_DETAILED_GUIDE.md)**
