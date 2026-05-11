# CI/CD Schedule Update - May 11, 2026

**Updated By:** Sourabh Kulkarni - SDET Architect  
**Framework:** Playwright & Cucumber Integration with Hooks Pattern  
**Status:** ✅ ACTIVE AND CONFIGURED

---

## 📋 Current CI/CD Configuration

### 1. **Pull Request Tests** (Runs on Every PR)
**Trigger:** When developer raises a pull request  
**Frequency:** Every PR to `main` or `master` branch  
**File:** `.github/workflows/playwright.yml`  
**What Runs:** 
- Install dependencies
- Install Playwright browsers
- Run Playwright tests (with Cucumber integration)
- Upload test report as artifact

```yaml
on:
  push:
    branches: [ main, master ]
  pull_request:
    branches: [ main, master ]
```

**Status:** ✅ **ACTIVE** - Tests run automatically on every PR

---

### 2. **Scheduled Weekly Tests** (Updated - Now Runs Wednesday Only)
**Trigger:** Automatic schedule - **Every Wednesday at 2:00 AM UTC**  
**Frequency:** Once per week  
**File:** `.github/workflows/scheduled-tests.yml`  
**What Runs:**
- Install dependencies
- Install Playwright browsers
- Run Cucumber tests through `npx playwright test`
- Upload test report
- Create GitHub issue if tests fail

```yaml
on:
  schedule:
    - cron: '0 2 * * 3'      # Every Wednesday at 2:00 AM UTC
  workflow_dispatch:         # Can also trigger manually
```

**Previous Schedule:** Daily at 2 AM + Monday at 6 AM  
**New Schedule:** **Wednesday at 2 AM UTC only** ✅ **UPDATED**

**Status:** ✅ **CONFIGURED** - Runs once weekly on Wednesday

---

### 3. **Performance Tests** (K6 Load/Stress/Spike Tests)
**Trigger:** When files in `performance/` or test config changes + on PR  
**Frequency:** When performance files updated + manual trigger available  
**File:** `.github/workflows/performance-tests.yml`  
**What Runs:**
- Install K6 performance testing tool
- Run K6 load test
- Run K6 stress test
- Run K6 spike test
- Run K6 idempotency test
- Create GitHub issue if performance tests fail

**Status:** ✅ **ACTIVE** - Runs on demand and when performance files change

---

### 4. **Test Notifications** (Alert System)
**Trigger:** When any test workflow fails  
**File:** `.github/workflows/notifications.yml`  
**What Happens:**
- Creates GitHub issue with failure details
- Includes run ID, branch, and failure summary
- Provides link to full test results

**Status:** ✅ **ACTIVE** - Automatic alerts on failures

---

## 🎯 Testing Schedule Summary

| Trigger                | Frequency          | What Runs             | File                     |
| ---------------------- | ------------------ | --------------------- | ------------------------ |
| **PR Raised**          | Every PR           | Playwright + Cucumber | `.playwright.yml`        |
| **Weekly Schedule**    | Wednesday 2 AM UTC | Full test suite       | `.scheduled-tests.yml`   |
| **Performance Update** | On file change     | K6 tests              | `.performance-tests.yml` |
| **Test Failure**       | On any failure     | GitHub issue creation | `.notifications.yml`     |

---

## 📅 Cron Schedule Reference

**Every Wednesday at 2:00 AM UTC:**
```
0 2 * * 3
│ │ │ │ │
│ │ │ │ └─ Day of week (0=Sunday, 3=Wednesday, 6=Saturday)
│ │ │ └─── Month (*)
│ │ └───── Day of month (*)
│ └─────── Hour (0-23)
└───────── Minute (0-59)
```

---

## 🔧 How It Works End-to-End

### Scenario 1: Developer Raises PR
```
Developer opens PR to main branch
    ↓
GitHub detects PR trigger
    ↓
Runs: .github/workflows/playwright.yml
    ↓
- Installs dependencies (npm ci)
- Installs Playwright browsers
- Runs: npx playwright test (Cucumber integration)
- Uploads playwright-report/ as artifact
    ↓
Result: Pass/Fail shown on PR
    ↓
Developer can merge only if tests pass ✅
```

### Scenario 2: Weekly Automatic Run
```
Every Wednesday at 2:00 AM UTC (scheduled)
    ↓
GitHub detects schedule trigger
    ↓
Runs: .github/workflows/scheduled-tests.yml
    ↓
- Installs dependencies (npm ci)
- Installs Playwright browsers
- Runs: npx playwright test (Cucumber integration)
- Uploads playwright-report-scheduled/ as artifact
    ↓
If any test fails:
- Creates GitHub issue with alert
- Includes links to test results
    ↓
Team is notified automatically 📧
```

### Scenario 3: Performance Issues
```
Performance files updated OR PR triggered
    ↓
GitHub detects change
    ↓
Runs: .github/workflows/performance-tests.yml
    ↓
K6 Performance Suite:
- Load test (gradual increase to 100 users)
- Stress test (find breaking point)
- Spike test (sudden traffic spike)
- Idempotency test (state consistency)
    ↓
If any test fails:
- Creates GitHub issue
- Team reviews performance metrics
```

---

## 📊 Cucumber Integration with Hooks

### Current Test Execution Flow

```
GitHub Action triggers
    ↓
npm ci (install dependencies)
    ↓
npx playwright install --with-deps
    ↓
npx playwright test (Runs Cucumber tests)
    ↓
Test Execution:
  1. Loads hooks.ts fixtures
  2. Initializes custom fixtures:
     - pageObjects (HomePage, BookingPage)
     - testData (lazy-loaded TestDataBuilder)
  3. Executes feature files from: Day2/examples/features/
  4. Steps run from: Day2/examples/steps/**/*.steps.ts
  5. Global beforeAll/afterAll/beforeEach/afterEach hooks execute
  6. Auto-screenshot on failure
  7. Auto-logging throughout
    ↓
Reports generated (playwright-report/)
    ↓
Results uploaded as artifact
    ↓
Issue created if any test failed
```

### Key Cucumber Configuration

**File:** `cucumber.js`
```javascript
// Paths configured for:
paths: './Day2/examples/features/**/*.feature'

// Requires hooks and step definitions:
require: [
  './Day2/examples/steps/hooks.ts',
  './Day2/examples/steps/**/*.steps.ts'
]

// Reporters:
- progress-bar (console output)
- HTML report
- JSON report
```

---

## 🔐 Security & Best Practices

✅ **Environment Variables**
- Sensitive data (API keys, passwords) stored in GitHub Secrets
- Referenced in workflows via `${{ secrets.VARIABLE_NAME }}`

✅ **Branch Protection**
- Tests must pass before merge to main/master
- Configure in GitHub → Settings → Branch Protection

✅ **Test Isolation**
- Each test run uses fresh browser context
- Test data generated on-demand (no shared state)
- Auto-cleanup after each test (beforeEach/afterEach)

✅ **Report Artifacts**
- All test reports stored for 30 days
- Accessible from GitHub Actions → Workflow → Artifacts
- Can be downloaded for analysis

---

## 📝 Manual Trigger Option

You can manually trigger any workflow from GitHub UI:

**Steps:**
1. Go to GitHub repo → Actions tab
2. Select workflow (e.g., "Scheduled Playwright Tests")
3. Click "Run workflow" button
4. Choose branch (main/master)
5. Click "Run workflow"

**Available for Manual Trigger:**
- ✅ Playwright Tests
- ✅ Scheduled Playwright Tests
- ✅ Performance Tests
- ✅ All notifications

---

## 📧 Test Result Notifications

### How You Get Notified:

1. **GitHub UI**
   - Check Actions tab for workflow status
   - Green checkmark = All tests passed ✅
   - Red X = Tests failed ❌

2. **GitHub Issues** (Automatic for failures)
   - Issue created with title: "⚠️ Scheduled Tests Failed - [Date]"
   - Includes run ID, commit hash, and direct link to results

3. **Pull Request Comments**
   - Test status appears on PR page
   - Required to pass before merge (if branch protection enabled)

4. **Optional Slack/Discord** (Can be configured)
   - Currently configured for GitHub Issues
   - Can integrate Slack webhook for real-time notifications

---

## 🚀 Verification Steps

### Check that scheduling is working:

```bash
# Check github workflows status
git log --oneline -n 10

# View workflow runs in GitHub
# Settings → Actions → Workflows → "Scheduled Playwright Tests"
```

### Check that PR testing works:

```bash
# Create a test PR
git checkout -b test-branch
# Make a change
git push origin test-branch
# Open PR on GitHub

# Workflow should start automatically!
# You'll see status on PR page
```

### Check that Cucumber tests are running:

```bash
# In local environment
npx cucumber-js

# Should output:
# Scenario: Verify user is on homepage
# ✓ When user navigates to home page
# ✓ And user closes any popups
# ✓ Then verify user is on home page
```

---

## 📚 Related Documentation

- **Detailed Guide:** [Day5/DAY5_DETAILED_GUIDE.md](Day5/DAY5_DETAILED_GUIDE.md)
- **Hooks Framework:** [Day2/examples/steps/HOOKS_REFACTORING_GUIDE.md](Day2/examples/steps/HOOKS_REFACTORING_GUIDE.md)
- **BDD Testing:** [Day2/README.md](Day2/README.md)
- **Performance Testing:** [Day3/PERFORMANCE_TESTING_K6_GUIDE.md](Day3/PERFORMANCE_TESTING_K6_GUIDE.md)

---

## ✅ Summary: What Changed

| Item                 | Before                   | After                   | Status                          |
| -------------------- | ------------------------ | ----------------------- | ------------------------------- |
| PR Testing           | ✅ Configured             | ✅ Configured            | **No change - Already working** |
| Schedule             | Daily + Monday           | **Wednesday only**      | **✅ UPDATED**                   |
| Test Frequency       | 8x/week (2/day + Monday) | **1x/week (Wednesday)** | **✅ OPTIMIZED**                 |
| Cucumber Integration | ✅ Running                | ✅ Running               | **No change - Already working** |
| Performance Tests    | ✅ Running                | ✅ Running               | **No change - Already working** |
| Notifications        | ✅ Enabled                | ✅ Enabled               | **No change - Already working** |

---

**Framework Status:** 🟢 **PRODUCTION-READY**  
**All Workflows:** 🟢 **ACTIVE AND OPTIMIZED**  
**Last Updated:** May 11, 2026  
**Updated By:** Sourabh Kulkarni - SDET Architect

