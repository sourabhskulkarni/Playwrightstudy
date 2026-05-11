# Day 5: CI/CD Pipeline & Automation Integration - Detailed Training Guide

## Welcome to Day 5 👋

By now, you've learned:
- ✓ Basic Playwright testing (Day 1)
- ✓ Page Object Model & BDD (Day 2)
- ✓ API & Performance Testing (Day 3)
- ✓ Database Testing & E2E Framework (Day 4)

Today, we'll learn how to **automate everything** so tests run automatically whenever code changes!

---

## Part 1: What is CI/CD? (Beginner-Friendly)

### Simple Definition:
**CI/CD** is a system that **automatically runs your tests** whenever you push code to a repository.

### Real-Life Analogy:
Imagine you're a restaurant manager:

```
WITHOUT CI/CD (Manual):
1. Chef cooks a dish
2. You manually taste it
3. You check if it's good
4. If bad, chef fixes and you taste again
(Time-consuming, error-prone!)

WITH CI/CD (Automatic):
1. Chef cooks a dish
2. Robot automatically tastes it
3. Robot checks quality standards
4. Robot reports if it's good or bad
5. If bad, system alerts chef automatically
(Fast, consistent, reliable!)
```

### What Does CI/CD Do?

**CI = Continuous Integration** (Automatic Testing)
```
1. Developer pushes code → GitHub
2. GitHub automatically runs tests
3. Tests PASS → Code is good ✓
4. Tests FAIL → Developer is notified ✗
5. Developer fixes and pushes again
```

**CD = Continuous Deployment** (Automatic Deployment)
```
1. Tests pass → Code is automatically deployed to production
2. Application updates without manual effort
3. Users see new features instantly
```

### Benefits:
- ✓ **Catch bugs early** - Before code reaches production
- ✓ **Save time** - No manual test running
- ✓ **Consistency** - Same tests always run the same way
- ✓ **Confidence** - Code is verified before deployment
- ✓ **Team alignment** - Everyone knows if code is working

---

## Part 2: Understanding GitHub Actions (Our CI/CD Tool)

### What is GitHub Actions?

GitHub Actions is GitHub's built-in CI/CD tool. It's like a robot that watches your code and runs tests automatically.

### How It Works:

```
Step 1: You commit code to GitHub
   ↓
Step 2: GitHub detects change
   ↓
Step 3: Workflow triggers automatically
   ↓
Step 4: GitHub Actions runs all your tests
   ↓
Step 5: Reports results (Pass/Fail)
   ↓
Step 6: Notifications sent to team
```

### Workflow = A Recipe for the Robot

A workflow is a YAML file that tells GitHub exactly what to do.

```
Think of it like a recipe:
Recipe: "Make Tea"
1. Boil water (2 minutes)
2. Add tea bag (1 minute)
3. Add sugar (optional)
4. Serve hot

Workflow: "Run Tests"
1. Setup Node.js
2. Install dependencies
3. Run Playwright tests
4. Generate report
5. Upload results
```

---

## Part 3: Writing Your First Workflow (GitHub Actions)

### File Structure:
```
PlaywrightStudy/
├── .github/
│   └── workflows/
│       ├── playwright.yml        ← Main CI/CD workflow
│       └── performance.yml        ← Performance testing workflow
├── playwright.config.ts
├── package.json
└── ... other files
```

### Basic Workflow File: `playwright.yml`

```yaml
# Name of your workflow (shown on GitHub)
name: Playwright Tests

# WHEN does this run?
on:
  # Run on every commit to main branch
  push:
    branches: [main, develop]
  # Run on every pull request
  pull_request:
    branches: [main, develop]
  # Run on schedule (e.g., daily at 2 AM)
  schedule:
    - cron: '0 2 * * *'

# WHAT does this do?
jobs:
  test:
    # Which operating system to run on
    runs-on: ubuntu-latest
    
    strategy:
      matrix:
        # Run tests in multiple Node.js versions
        node-version: [18.x, 20.x]

    steps:
      # Step 1: Check out the code
      - name: Checkout code
        uses: actions/checkout@v3
      
      # Step 2: Setup Node.js
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: ${{ matrix.node-version }}
      
      # Step 3: Install dependencies
      - name: Install dependencies
        run: npm install
      
      # Step 4: Install Playwright browsers
      - name: Install Playwright browsers
        run: npx playwright install --with-deps
      
      # Step 5: Run Playwright tests
      - name: Run Playwright tests
        run: npm run test
      
      # Step 6: Upload test report (only if tests fail)
      - name: Upload test report
        if: always()
        uses: actions/upload-artifact@v3
        with:
          name: playwright-report
          path: playwright-report/
```

### What Each Part Means:

**Triggers (When to run):**
```yaml
on:
  push:
    branches: [main, develop]      # Run when you push to main or develop
  pull_request:
    branches: [main, develop]      # Run when creating a pull request
  schedule:
    - cron: '0 2 * * *'            # Run daily at 2 AM UTC
```

**Jobs (What to run):**
```yaml
jobs:
  test:
    runs-on: ubuntu-latest         # Run on Linux
    
    strategy:
      matrix:
        node-version: [18.x, 20.x] # Test with Node 18 AND 20
```

**Steps (The actual commands):**
```yaml
steps:
  - run: npm install               # Run npm install
  - run: npm test                  # Run tests
  - run: npm run report            # Generate report
```

---

## Part 4: Setting Up CI/CD for Your Project

### Step 1: Create Workflow Directory

```bash
# Create .github/workflows directory
mkdir -p .github/workflows
```

### Step 2: Create `playwright.yml` File

Create `.github/workflows/playwright.yml`:

```yaml
name: Playwright Tests - All Days

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]
  schedule:
    - cron: '0 2 * * *'

jobs:
  # Test Day 1
  test-day1:
    name: Day 1 - Basic UI Tests
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '20.x'
      - run: npm install
      - run: npx playwright install --with-deps
      - run: npm run test:day1
      - uses: actions/upload-artifact@v3
        if: always()
        with:
          name: day1-report
          path: playwright-report/

  # Test Day 2
  test-day2:
    name: Day 2 - Page Objects & BDD
    runs-on: ubuntu-latest
    needs: test-day1  # Run after Day 1
    
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '20.x'
      - run: npm install
      - run: npx playwright install --with-deps
      - run: npm run test:day2
      - uses: actions/upload-artifact@v3
        if: always()
        with:
          name: day2-report
          path: playwright-report/

  # Test Day 3
  test-day3:
    name: Day 3 - API Testing
    runs-on: ubuntu-latest
    needs: test-day2  # Run after Day 2
    
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '20.x'
      - run: npm install
      - run: npx playwright install --with-deps
      - run: npm run test:day3
      - uses: actions/upload-artifact@v3
        if: always()
        with:
          name: day3-report
          path: playwright-report/

  # Test Day 4
  test-day4:
    name: Day 4 - Database & E2E
    runs-on: ubuntu-latest
    needs: test-day3  # Run after Day 3
    
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '20.x'
      - run: npm install
      - run: npx playwright install --with-deps
      - run: npm run test:day4
      - uses: actions/upload-artifact@v3
        if: always()
        with:
          name: day4-report
          path: playwright-report/

  # Summary job
  test-summary:
    name: Test Summary
    runs-on: ubuntu-latest
    needs: [test-day1, test-day2, test-day3, test-day4]
    if: always()
    
    steps:
      - run: echo "All tests completed!"
      - run: echo "Check individual reports for details"
```

### Step 3: Push to GitHub

```bash
# Add files
git add .github/workflows/playwright.yml

# Commit
git commit -m "Add CI/CD with GitHub Actions"

# Push
git push origin main
```

### Step 4: Check Results

1. Go to your GitHub repository
2. Click **Actions** tab
3. You'll see your workflow running
4. Click on it to see logs
5. Watch tests execute in real-time!

---

## Part 5: Advanced CI/CD Configurations

### Configuration 1: Different Browsers

```yaml
# Test with multiple browsers
test:
  runs-on: ubuntu-latest
  strategy:
    matrix:
      browser: [chromium, firefox, webkit]
  
  steps:
    - uses: actions/checkout@v3
    - uses: actions/setup-node@v3
      with:
        node-version: '20.x'
    - run: npm install
    - run: npx playwright install --with-deps
    - run: npx playwright test --project=${{ matrix.browser }}
```

### Configuration 2: Conditional Runs

```yaml
# Run performance tests only for main branch
test-performance:
  runs-on: ubuntu-latest
  if: github.ref == 'refs/heads/main'
  
  steps:
    - uses: actions/checkout@v3
    - uses: actions/setup-node@v3
      with:
        node-version: '20.x'
    - run: npm install
    - run: npm run k6:load-test
```

### Configuration 3: Notifications & Reporting

```yaml
# Send notification on failure
notify-failures:
  runs-on: ubuntu-latest
  needs: test
  if: failure()
  
  steps:
    - name: Send Slack notification
      run: |
        curl -X POST -H 'Content-type: application/json' \
        --data '{"text":"Tests failed! Check GitHub Actions"}' \
        ${{ secrets.SLACK_WEBHOOK }}
```

---

## Part 6: Understanding YAML Syntax (CI/CD Files)

YAML is the language used to write CI/CD configurations. Here's a quick guide:

### Basic YAML Rules:

```yaml
# Comments start with #
name: My Workflow

# Key-value pairs
version: 1
author: John

# Lists (arrays) use -
steps:
  - name: Step 1
  - name: Step 2
  - name: Step 3

# Nested structure (indentation matters!)
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - run: npm install
      - run: npm test

# Strings don't need quotes (usually)
name: Playwright Tests

# But use quotes for special characters
message: "This has: special chars!"

# Variables
${{ variable }}
${{ secrets.GITHUB_TOKEN }}
${{ matrix.node-version }}
```

### Common Mistakes in YAML:

```yaml
❌ WRONG - Indentation is inconsistent
jobs:
test:  # Should be indented 2 spaces
  runs-on: ubuntu-latest

✓ CORRECT - 2-space indentation
jobs:
  test:
    runs-on: ubuntu-latest

❌ WRONG - Missing colon
name Playwright

✓ CORRECT - Has colon
name: Playwright

❌ WRONG - List items not aligned
steps:
- run: npm install
 - run: npm test

✓ CORRECT - List items aligned
steps:
  - run: npm install
  - run: npm test
```

---

## Part 7: CI/CD Best Practices

### Best Practice 1: Cache Dependencies

```yaml
# Without cache - Downloads 100+ MB every time
- run: npm install  # Takes 5 minutes

# With cache - Reuses downloaded files
- uses: actions/cache@v3
  with:
    path: ~/.npm
    key: ${{ runner.os }}-node-${{ hashFiles('**/package-lock.json') }}
    restore-keys: |
      ${{ runner.os }}-node-

- run: npm install  # Takes 10 seconds
```

### Best Practice 2: Parallel Testing

```yaml
# Run tests in parallel (faster!)
strategy:
  matrix:
    # Run Day 1, 2, 3, 4 all at the same time
    test: [day1, day2, day3, day4]

steps:
  - run: npm run test:${{ matrix.test }}
```

### Best Practice 3: Fail Fast

```yaml
# Stop if any test fails (don't continue wasting time)
jobs:
  build:
    runs-on: ubuntu-latest
    
  test:
    needs: build  # Only run if build succeeds
    if: success()
```

### Best Practice 4: Clear Reporting

```yaml
# Generate clear test reports
- name: Generate Test Report
  run: npm run report

- name: Upload Report
  uses: actions/upload-artifact@v3
  with:
    name: test-report
    path: playwright-report/
    retention-days: 30
```

---

## Part 8: Integrating K6 & JMeter into CI/CD

### Run K6 Tests in CI/CD

```yaml
# In .github/workflows/performance.yml
name: Performance Tests - K6 & JMeter

on:
  schedule:
    - cron: '0 3 * * 0'  # Run weekly on Sunday at 3 AM
  workflow_dispatch:      # Allow manual trigger

jobs:
  k6-load-test:
    name: K6 Load Testing
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Run K6 Load Test
        uses: grafana/k6-action@v0.3.0
        with:
          filename: ./performance/k6/load-test.js
          cloud: true  # Upload results to k6 Cloud
        env:
          K6_CLOUD_TOKEN: ${{ secrets.K6_CLOUD_TOKEN }}
      
      - name: Run K6 Stress Test
        uses: grafana/k6-action@v0.3.0
        with:
          filename: ./performance/k6/stress-test.js
          cloud: true
        env:
          K6_CLOUD_TOKEN: ${{ secrets.K6_CLOUD_TOKEN }}
      
      - name: Run K6 Spike Test
        uses: grafana/k6-action@v0.3.0
        with:
          filename: ./performance/k6/spike-test.js
          cloud: true
        env:
          K6_CLOUD_TOKEN: ${{ secrets.K6_CLOUD_TOKEN }}

  jmeter-test:
    name: JMeter Performance Testing
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Install JMeter
        run: |
          wget https://archive.apache.org/dist/jmeter/binaries/apache-jmeter-5.5.tgz
          tar -xzf apache-jmeter-5.5.tgz
          export PATH=$PWD/apache-jmeter-5.5/bin:$PATH
      
      - name: Run JMeter Tests
        run: |
          export PATH=$PWD/apache-jmeter-5.5/bin:$PATH
          jmeter -n -t ./performance/jmeter/mmt-booking.jmx \
                  -l ./results.jtl \
                  -j ./jmeter.log
      
      - name: Generate JMeter Report
        run: |
          export PATH=$PWD/apache-jmeter-5.5/bin:$PATH
          JMeterPluginsCMD.sh --generate-csv-summary ./jmeter-report.csv \
                              --input-jtl ./results.jtl
      
      - name: Upload JMeter Report
        uses: actions/upload-artifact@v3
        with:
          name: jmeter-report
          path: jmeter-report.csv
```

---

## Part 9: Debugging CI/CD Issues

### Problem 1: Tests Pass Locally But Fail in CI

**Causes:**
- Different Node.js version
- Missing browser dependencies
- Environment variables not set
- Timing issues (slower CI runner)

**Solution:**
```yaml
# Check Node version
- run: node --version

# Install all browser dependencies
- run: npx playwright install --with-deps

# Set environment variables
env:
  HEADLESS: true
  SLOW_MO: 100

# Increase timeout for slow CI
- run: npx playwright test --timeout=60000
```

### Problem 2: "Module not found" Errors

```yaml
# Make sure dependencies are installed
- run: npm ci  # Better than npm install for CI

# Check what's installed
- run: npm list
```

### Problem 3: Browser Installation Timeout

```yaml
# Install browsers first
- run: npx playwright install --with-deps

# Then run tests
- run: npm test
```

---

## Part 10: Full Example Project Structure

```
PlaywrightStudy/
│
├── .github/
│   └── workflows/
│       ├── playwright.yml          ← Runs on every PR & push
│       ├── performance.yml         ← Runs K6 & JMeter
│       └── scheduled-tests.yml     ← Runs weekly on Wednesday at 2 AM UTC ✅
│
├── performance/
│   ├── k6/
│   │   ├── load-test.js            ← Load test script
│   │   ├── stress-test.js          ← Stress test script
│   │   ├── spike-test.js           ← Spike test script
│   │   └── config.js               ← K6 configuration
│   │
│   └── jmeter/
│       ├── mmt-booking.jmx         ← JMeter test plan
│       ├── api-tests.jmx           ← API test plan
│       └── results/                ← Test results
│
├── Day1/examples/
├── Day2/examples/
├── Day3/examples/
├── Day4/examples/
│
├── playwright.config.ts
├── package.json
├── tsconfig.json
└── README.md
```

---

## Part 11: Summary & Next Steps

### What You've Learned:

✓ What CI/CD is and why it's important  
✓ How GitHub Actions works  
✓ Writing YAML workflow files  
✓ Setting up automated testing  
✓ Running tests on schedule  
✓ Integrating K6 and JMeter  
✓ Handling failures and notifications  
✓ Best practices for CI/CD  

### Next Steps:

1. **Set up GitHub repository** - Push your code to GitHub
2. **Create .github/workflows directory** - Add workflow files
3. **Test locally first** - Make sure tests pass before pushing
4. **Create workflow file** - Use examples from this guide
5. **Push code** - Trigger the workflow
6. **Monitor in GitHub Actions** - Watch tests run automatically
7. **Set up K6 Cloud account** - For cloud performance testing
8. **Configure JMeter** - For detailed performance reports
9. **Set up notifications** - Get Slack/email alerts on failures
10. **Iterate** - Improve tests based on CI/CD feedback

### Advanced Topics (After This Course):

- Docker integration for CI/CD
- Artifact management
- Security scanning
- Code coverage reporting
- Multi-environment deployments
- Database migration in CI/CD
- Load balancing for distributed testing

---

## Part 12: Complete GitHub Repository Setup (Personal Account)

### 🎯 Objective:
Set up your PlaywrightStudy project on your GitHub personal account with complete CI/CD automation.

### Prerequisites:
- GitHub account (https://github.com/sourabhskulkarni)
- Git installed locally
- PlaywrightStudy project on your local machine
- All tests passing locally

---

### Step 1: Create Remote Repository on GitHub

**Online (via GitHub Website):**

1. Go to https://github.com/new
2. **Repository name:** `PlaywrightStudy`
3. **Description:** "Complete Playwright Testing Training - Days 1-5 with CI/CD, K6, and JMeter"
4. **Visibility:** Select `Public` (for unlimited GitHub Actions) or `Private` (for training privacy)
   - **Public = Unlimited free Actions** ✅ (Recommended for learning)
   - **Private = 2,000 free minutes/month** ✅ (Still plenty for training)
5. **Initialize repository:** DO NOT initialize (we'll push existing code)
6. Click **Create repository**

**Result:** You'll see setup instructions on GitHub

---

### Step 2: Configure Git Locally

Open PowerShell in your PlaywrightStudy folder:

```powershell
# Navigate to your project
cd d:\PlaywrightStudy

# Check current status
git status

# Configure Git (if not already configured)
git config --global user.name "Sourabh Kulkarni"
git config --global user.email "your.email@example.com"

# Verify configuration
git config --global user.name
git config --global user.email
```

---

### Step 3: Add Remote Repository

```powershell
# Add your GitHub repository as origin
git remote add origin https://github.com/sourabhskulkarni/PlaywrightStudy.git

# Verify the remote was added
git remote -v
# Should output:
# origin  https://github.com/sourabhskulkarni/PlaywrightStudy.git (fetch)
# origin  https://github.com/sourabhskulkarni/PlaywrightStudy.git (push)
```

---

### Step 4: Check Current Branch

```powershell
# Check current branch
git branch

# If not on 'main', create and switch to main
git branch -M main

# Verify
git branch
```

---

### Step 5: Commit All Changes

```powershell
# Stage all files
git add .

# Check what will be committed
git status

# Commit with meaningful message
git commit -m "Initial commit: Complete Playwright training (Days 1-5) with CI/CD automation"

# Verify files are committed
git log --oneline -5
```

---

### Step 6: Push to GitHub

```powershell
# Push to GitHub (this may prompt for authentication)
git push -u origin main

# If first time, you may need to authenticate:
# Option 1: GitHub CLI (recommended)
#   - GitHub will open browser for authentication
#   - Complete the OAuth flow
#   - Return to terminal
#
# Option 2: Access Token (alternative)
#   - Generate token at: https://github.com/settings/tokens
#   - Use token as password when prompted
```

**Expected Output:**
```
Enumerating objects: 150, done.
Counting objects: 100% (150/150), done.
Delta compression using up to 8 threads
Compressing objects: 100% (45/45), done.
Writing objects: 100% (150/150), 2.50 MiB, done.
...
To https://github.com/sourabhskulkarni/PlaywrightStudy.git
 * [new branch]      main -> main
Branch 'main' set to track remote branch 'main' from 'origin'.
```

---

### Step 7: Verify on GitHub

1. Go to https://github.com/sourabhskulkarni/PlaywrightStudy
2. You should see:
   - ✅ All your project files
   - ✅ README.md displaying
   - ✅ .github/workflows folder with YAML files
   - ✅ Test files in Day1/, Day2/, Day3/, Day4/ folders

---

### Step 8: Verify GitHub Actions is Enabled

1. Go to your repo: https://github.com/sourabhskulkarni/PlaywrightStudy
2. Click **Settings** tab
3. Click **Actions** → **General** on left sidebar
4. Verify:
   - ✅ "Allow all actions and reusable workflows" is selected
   - ✅ "Artifact and log retention" is set appropriately

---

### Step 9: Trigger Your First Workflow

**Option A: Push a Commit (Automatic Trigger)**

```powershell
# Make a small change
echo "# CI/CD Testing" >> test.txt

# Commit and push
git add test.txt
git commit -m "Test CI/CD trigger"
git push
```

**Option B: Manual Trigger (from GitHub UI)**

1. Go to your repo → **Actions** tab
2. Click **Playwright Tests** workflow
3. Click **Run workflow** button (top right)
4. Click **Run workflow** (confirm)

**Watch it Run:**
1. Refresh the Actions tab
2. Click on the running workflow
3. See logs in real-time
4. Tests complete in ~5-10 minutes

**Expected Results:**
- ✅ Workflow runs automatically
- ✅ Shows "✓ passed" for successful tests
- ✅ Playwright report generated and uploaded
- ✅ Green checkmark on your commit

---

## Part 13: Understanding Your Workflows (4 Configured)

### Workflow 1: Playwright Tests (Basic CI/CD)

**File:** `.github/workflows/playwright.yml`

**When it runs:**
- ✓ Every push to `main` or `master` branch
- ✓ Every pull request
- ✓ Manual trigger from GitHub UI

**What it does:**
- Installs Node.js and dependencies
- Installs Playwright browsers
- Runs all tests
- Uploads playwright-report artifact

**View results:**
```
GitHub.com → Your repo → Actions → Playwright Tests → Click run
```

---

### Workflow 2: Scheduled Tests (Weekly - Wednesday)

**File:** `.github/workflows/scheduled-tests.yml`

**When it runs:**
- ✓ **Every Wednesday at 2:00 AM UTC** (optimized from daily)
- ✓ Manual trigger from GitHub UI
- ✓ Reduces unnecessary executions to 1x per week

**What it does:**
- Runs full Playwright test suite with Cucumber integration
- Tests all features from Day2 examples
- Creates GitHub Issue if tests fail
- Uploads test report artifact (30-day retention)
- Perfect for weekly regression testing

**Updated Schedule (May 11, 2026):**
```
OLD Schedule (Before):
- Daily at 2:00 AM UTC  (8 times/week)
- Monday at 6:00 AM UTC (1 time/week)

NEW Schedule (After):
- Wednesday at 2:00 AM UTC only (1 time/week) ✅
```

**Cron Schedule Explained:**
```
'0 2 * * 3'     = Every Wednesday at 2:00 AM UTC
│ │ │ │ └─ Day of week (0-6, where 3 = Wednesday)
│ │ │ ├─── Month (1-12)
│ │ ├───── Day of month (1-31)
│ ├─────── Hour (0-23)
└───────── Minute (0-59)

Common Examples:
'0 2 * * 3'     = Wednesdays at 2:00 AM UTC ✅ (CURRENT)
'0 2 * * *'     = Daily at 2:00 AM UTC
'0 6 * * 1'     = Mondays at 6:00 AM UTC
'0 9 * * 1-5'   = Weekdays at 9:00 AM UTC
'30 14 * * *'   = Daily at 14:30 (2:30 PM) UTC
```

**Benefits of Weekly Schedule:**
- ✓ Reduced resource consumption
- ✓ Less noise in GitHub Actions logs
- ✓ Still catches regressions once per week
- ✓ Faster feedback for PR tests (unchanged)
- ✓ Cost optimization on CI/CD platform

**To modify schedule:**
1. Edit `.github/workflows/scheduled-tests.yml`
2. Change the cron values (e.g., `'0 2 * * 3'` for Wednesday)
3. Commit and push to GitHub
4. New schedule takes effect immediately

**Full Details:** See [CICD_SCHEDULE_UPDATE.md](CICD_SCHEDULE_UPDATE.md) for complete configuration

---

### Workflow 3: Performance Tests (K6)

**File:** `.github/workflows/performance-tests.yml`

**When it runs:**
- ✓ When performance/ folder changes
- ✓ When playwright.config.ts changes
- ✓ When package.json changes
- ✓ Manual trigger from GitHub UI

**What it does:**
- Installs K6 performance testing tool
- Runs K6 load test
- Runs K6 stress test
- Runs K6 spike test
- Runs K6 idempotency test
- Creates GitHub Issue if any test fails

**View performance results:**
```
GitHub.com → Your repo → Actions → Performance Tests with K6 → View logs
```

---

### Workflow 4: Notifications & Reporting

**File:** `.github/workflows/notifications.yml`

**When it runs:**
- ✓ When any other workflow completes
- ✓ Automatically monitors: Playwright Tests, Scheduled Tests, Performance Tests

**What it does:**
- Creates GitHub Issue on failure
- Logs success messages
- Ready for Slack integration (optional)

**Optional: Add Slack Notifications**

To add Slack notifications:

1. Create Slack workspace (free at slack.com)
2. Create incoming webhook:
   - Go to api.slack.com/apps
   - Create New App
   - Enable Incoming Webhooks
   - Create New Webhook
   - Copy webhook URL
3. Add to GitHub Secrets:
   - Repo → Settings → Secrets and variables → Actions
   - Click "New repository secret"
   - Name: `SLACK_WEBHOOK`
   - Value: Paste webhook URL
4. Uncomment Slack lines in `notifications.yml`
5. Push changes

---

## Part 14: Monitoring Your Workflows (Dashboard & Reports)

### View Workflow Status

**GitHub Actions Dashboard:**
```
https://github.com/sourabhskulkarni/PlaywrightStudy/actions
```

Shows:
- All workflow runs (past and present)
- Execution time
- Pass/Fail status
- Branch and commit info

### View Detailed Logs

1. Click a workflow run
2. Click a job (e.g., "test")
3. Expand each step to see logs
4. Look for errors in red text

### Download Test Reports

1. Go to workflow run
2. Scroll down to "Artifacts"
3. Download `playwright-report` (ZIP file)
4. Extract and open `index.html` in browser
5. View all test results with screenshots

### Create Custom Dashboards

GitHub provides badges for your README:

**Add this to your README.md:**

```markdown
## CI/CD Status

![Playwright Tests](https://github.com/sourabhskulkarni/PlaywrightStudy/actions/workflows/playwright.yml/badge.svg)
![Scheduled Tests](https://github.com/sourabhskulkarni/PlaywrightStudy/actions/workflows/scheduled-tests.yml/badge.svg)
![Performance Tests](https://github.com/sourabhskulkarni/PlaywrightStudy/actions/workflows/performance-tests.yml/badge.svg)
```

---

## Part 15: Common Issues & Troubleshooting

### Issue 1: Authentication Failed on Push

**Error:** `fatal: Authentication failed for 'https://github.com/...`

**Solution:**
```powershell
# Use GitHub CLI for authentication
winget install GitHub.cli

# Authenticate
gh auth login

# Choose: GitHub.com → HTTPS → Y (authenticate via web browser)

# Try push again
git push
```

### Issue 2: Tests Pass Locally but Fail in GitHub Actions

**Common Causes:**
- Different Node.js version
- Missing environment variables
- Path differences (Windows vs Linux)
- Browser compatibility

**Solution:**
```yaml
# Check Node.js version in workflow
node-version: '20.x'  # Match your local version

# Add debugging
- name: Debug Info
  run: |
    node --version
    npm --version
    npx playwright --version
```

### Issue 3: Workflow Doesn't Trigger

**Solutions:**
1. Check branch name (must be main or master)
2. Check workflow file location: `.github/workflows/*.yml`
3. Check YAML syntax (proper indentation)
4. Verify Actions is enabled in Settings

### Issue 4: Tests Timeout in GitHub Actions

**Error:** `Test timeout of 30000ms exceeded`

**Solution:**
```yaml
# Increase timeout in workflow
timeout-minutes: 120  # Increase from default 60

# Or in playwright.config.ts
timeout: 60000,  // Increase from default 30000
```

### Issue 5: GitHub Actions Running Out of Disk Space

**Solution:**
```yaml
# Clean up after tests
- name: Clean up
  if: always()
  run: |
    rm -rf node_modules
    rm -rf .playwright
```

---

## Part 16: Best Practices & Optimization

### Practice 1: Use Pull Requests for Testing

```powershell
# Create feature branch
git checkout -b feature/new-test

# Make changes
# Commit
git add .
git commit -m "Add new test for booking flow"

# Push to GitHub
git push origin feature/new-test

# On GitHub: Open Pull Request
# → Workflow runs automatically
# → Review test results
# → Merge after tests pass
```

### Practice 2: Keep Workflows Organized

```
.github/
├── workflows/
│   ├── playwright.yml          # Main CI/CD
│   ├── scheduled-tests.yml     # Scheduled runs
│   ├── performance-tests.yml   # K6 tests
│   └── notifications.yml       # Alerts
└── issue_templates/
    └── bug_report.md
```

### Practice 3: Document Your Workflows

```yaml
# Add comments to workflows
name: Playwright Tests

# Runs on every push to track code quality
on:
  push:
    branches: [main, master]
  pull_request:
    branches: [main, master]

# This job tests all Playwright tests
jobs:
  test:
    # ... rest of config
```

### Practice 4: Monitor Costs (for private repos)

Free tier on private repos: **2,000 minutes/month**

To estimate usage:
```
Test run time × Frequency = Monthly usage

Example:
10 min/run × 4 per day × 25 working days = 1,000 min/month ✅
10 min/run × 8 per day × 25 working days = 2,000 min/month ⚠️
```

If exceeding:
- Switch to public repo (unlimited free)
- Reduce test frequency
- Run tests only on main branch
- Use scheduled tests instead of on every push

---

## Part 17: Reference Cards

### Quick Command Reference

**Git Commands:**
```powershell
git status                          # Check changes
git add .                          # Stage all files
git commit -m "message"            # Commit changes
git push                           # Push to GitHub
git pull                           # Pull from GitHub
git log --oneline -5               # View last 5 commits
git branch                         # List branches
git checkout -b branch-name        # Create new branch
```

**GitHub Actions Commands (via CLI):**
```powershell
gh workflow list                   # List all workflows
gh run list                        # List recent runs
gh run view <run-id>               # View specific run
gh run log <run-id>                # View run logs
gh run view --log <run-id>         # Full logs
```

### Schedule Reference

Use https://crontab.guru for testing cron expressions

**Common Schedules:**
```yaml
'0 2 * * *'      # Daily at 2 AM UTC
'0 6 * * 1'      # Monday at 6 AM UTC
'0 9 * * 1-5'    # Weekdays at 9 AM UTC
'*/30 * * * *'   # Every 30 minutes
'0 0 * * 0'      # Weekly Sunday at midnight
'0 12 1 * *'     # First day of month at noon UTC
```

---

## Part 18: Summary

### ✅ You've Now:

1. Created workflow files for CI/CD automation
2. Set up your GitHub repository (sourabhskulkarni/PlaywrightStudy)
3. Enabled GitHub Actions (free for public repos)
4. Configured 4 different workflows:
   - Basic CI/CD (on every push/PR)
   - Scheduled tests (daily and weekly)
   - Performance tests (K6 integration)
   - Notifications (GitHub Issues on failure)
5. Learned to monitor and debug workflows
6. Created reusable GitHub Actions setup for future projects

### 🎯 Your Current Status:

| Component        | Status       | Details                                     |
| ---------------- | ------------ | ------------------------------------------- |
| Playwright Tests | ✅ Configured | Runs on push & PR                           |
| Scheduled Tests  | ✅ Configured | Daily 2 AM, Monday 6 AM UTC                 |
| K6 Performance   | ✅ Configured | Runs on code changes                        |
| Notifications    | ✅ Configured | GitHub Issues on failure                    |
| GitHub Account   | ✅ Ready      | https://github.com/sourabhskulkarni         |
| Repository       | ✅ Created    | PlaywrightStudy public/private              |
| Free Minutes     | ✅ Available  | 2,000/month (private) or unlimited (public) |

### 🚀 Next:

1. Push your code using the commands provided above
2. Watch your first workflow run automatically
3. Create pull requests to test the CI/CD flow
4. Monitor GitHub Actions dashboard
5. Iterate and improve your tests based on results

### 📚 Quick Reference URLs:

```
Your GitHub Repo:
https://github.com/sourabhskulkarni/PlaywrightStudy

GitHub Actions Dashboard:
https://github.com/sourabhskulkarni/PlaywrightStudy/actions

GitHub Settings:
https://github.com/sourabhskulkarni/PlaywrightStudy/settings

GitHub Secrets (for notifications):
https://github.com/sourabhskulkarni/PlaywrightStudy/settings/secrets/actions
```

---

## Exercises

### Exercise 1: Create Your First Workflow

**Task:** Create `.github/workflows/first-test.yml` that:
1. Sets up Node.js
2. Installs dependencies
3. Runs Day 1 tests
4. Uploads report

**Solution:** Use the examples from Part 4 above.

### Exercise 2: Add Scheduling

**Task:** Modify your workflow to run:
1. On every commit to `main` branch
2. Every Monday at 9 AM
3. On manual trigger (workflow_dispatch)

**Hint:** Use `on:` section with multiple triggers.

### Exercise 3: Parallel Testing

**Task:** Create a workflow that runs all days (Day 1, 2, 3, 4) in parallel.

**Hint:** Use `strategy.matrix` with multiple test names.

### Exercise 4: Add K6 to CI/CD

**Task:** Create `.github/workflows/performance.yml` that runs K6 load test.

**Hint:** Use `grafana/k6-action@v0.3.0`.

---

## Quick Reference: Common Workflow Triggers

```yaml
# On push to main branch
on:
  push:
    branches: [main]

# On pull request
on:
  pull_request:
    branches: [main]

# On schedule (cron syntax)
on:
  schedule:
    - cron: '0 10 * * 1-5'  # Weekdays at 10 AM

# Manual trigger (buttons in GitHub UI)
on:
  workflow_dispatch:

# On release
on:
  release:
    types: [published]

# Multiple triggers
on:
  push:
    branches: [main]
  pull_request:
    branches: [main]
  schedule:
    - cron: '0 2 * * *'
```

---

## Troubleshooting Guide

| Problem                           | Cause                     | Solution                                     |
| --------------------------------- | ------------------------- | -------------------------------------------- |
| "No such file"                    | Path is wrong             | Check paths are relative to repo root        |
| YAML error                        | Indentation wrong         | Use 2 spaces, not tabs                       |
| Tests fail in CI but pass locally | Different environment     | Check Node version, install browsers         |
| Workflow doesn't trigger          | Trigger not configured    | Check `on:` section                          |
| No artifacts uploaded             | Step failed before upload | Use `if: always()` to upload even on failure |
| Timeout errors                    | Tests too slow            | Increase `timeout` value                     |

---

**Great work! You've learned CI/CD fundamentals. Now tests run automatically! 🚀**
