# GitHub Setup - Quick Reference Guide

## 📋 For Future Reference - Copy & Paste Ready

---

## Your Account Details
- **GitHub Username:** sourabhskulkarni
- **Repository Name:** PlaywrightStudy
- **Repository URL:** https://github.com/sourabhskulkarni/PlaywrightStudy
- **Visibility:** Public (recommended for training) or Private

---

## ⚡ Quick Setup (Copy & Paste)

### Step 1: Create Repository on GitHub
Visit: https://github.com/new

Fill:
- **Repository name:** PlaywrightStudy
- **Description:** Complete Playwright Testing Training - Days 1-5 with CI/CD, K6, and JMeter
- **Visibility:** Public OR Private
- **Initialize:** Leave unchecked (we'll push existing code)
- Click **Create repository**

---

### Step 2: Open PowerShell in Your Project

```powershell
cd d:\PlaywrightStudy
```

---

### Step 3: Configure Git (first time only)

```powershell
git config --global user.name "Sourabh Kulkarni"
git config --global user.email "your.email@example.com"
```

---

### Step 4: Add GitHub as Remote

```powershell
git remote add origin https://github.com/sourabhskulkarni/PlaywrightStudy.git
git branch -M main
```

---

### Step 5: Commit and Push

```powershell
git add .
git commit -m "Initial commit: Complete Playwright training (Days 1-5) with CI/CD automation"
git push -u origin main
```

**Note:** You may be prompted for authentication. Use GitHub CLI or personal access token.

---

## ✅ Verify Setup

1. Go to: https://github.com/sourabhskulkarni/PlaywrightStudy
2. Should see all your files
3. Go to **Actions** tab
4. See your workflows: Playwright Tests, Scheduled Tests, Performance Tests, Notifications

---

## 🤖 Workflows You Have

| Workflow | File | Trigger | Frequency |
|----------|------|---------|-----------|
| Playwright Tests | `playwright.yml` | Push or PR | Immediate |
| Scheduled Tests | `scheduled-tests.yml` | Cron schedule | Daily 2 AM UTC, Monday 6 AM UTC |
| Performance Tests | `performance-tests.yml` | Code changes | On demand or code change |
| Notifications | `notifications.yml` | Other workflows complete | Automatic |

---

## 🔧 Test Your CI/CD (After Initial Push)

```powershell
# Make a test commit
echo "# Testing CI/CD" >> test-trigger.txt
git add test-trigger.txt
git commit -m "Test CI/CD workflow trigger"
git push
```

Then go to: https://github.com/sourabhskulkarni/PlaywrightStudy/actions

Watch your workflow run! 🚀

---

## 📊 Free GitHub Actions Limit

| Repo Type | Free Limit | Details |
|-----------|-----------|---------|
| Public | ∞ Unlimited | Perfect for learning |
| Private | 2,000 min/month | Includes 500 MB storage |

For training, both are **completely free**!

---

## 🚨 Common Issues

**Issue:** "fatal: Authentication failed"  
**Fix:**
```powershell
gh auth login
# Choose GitHub.com → HTTPS → Authenticate in browser
```

**Issue:** Workflow doesn't run  
**Check:**
1. Branch is named "main"
2. Files are in `.github/workflows/`
3. YAML syntax is correct (no tab characters, only spaces)

**Issue:** "Repository not found"  
**Check:**
1. GitHub URL is correct: https://github.com/sourabhskulkarni/PlaywrightStudy
2. Repository is created on GitHub
3. You're logged in to correct GitHub account

---

## 📚 Important URLs

- **Your GitHub Repo:** https://github.com/sourabhskulkarni/PlaywrightStudy
- **GitHub New Repo:** https://github.com/new
- **GitHub Authentication:** https://github.com/settings/tokens
- **GitHub Actions Dashboard:** https://github.com/sourabhskulkarni/PlaywrightStudy/actions
- **GitHub Secrets/Variables:** https://github.com/sourabhskulkarni/PlaywrightStudy/settings/secrets/actions
- **Cron Helper:** https://crontab.guru

---

## 🔄 Regular Workflow

### For New Features/Tests:

```powershell
# Create feature branch
git checkout -b feature/booking-tests

# Make changes
# ... edit files ...

# Commit
git add .
git commit -m "Add booking flow tests"

# Push
git push origin feature/booking-tests

# On GitHub: Open Pull Request → Tests run automatically → Review → Merge
```

### For Bug Fixes:

```powershell
# Create fix branch
git checkout -b fix/login-issue

# Make changes
# ... edit files ...

# Commit
git add .
git commit -m "Fix login test timing issue"

# Push
git push origin fix/login-issue

# On GitHub: Open Pull Request → Tests run → Merge to main
```

---

## 🎯 Next Time You Need This

If you need to reference this setup in the future:
1. Open this file: `GITHUB_SETUP_QUICK_GUIDE.md`
2. Follow the quick setup steps
3. All commands are copy & paste ready

---

## 📖 Detailed Guide

For detailed explanations and troubleshooting:
- Open: `DAY5_DETAILED_GUIDE.md`
- Go to: Parts 12-18 "Complete GitHub Repository Setup"
- Find: Explanations, best practices, advanced configuration

---

**Last Updated:** May 8, 2026  
**For:** sourabhskulkarni  
**Project:** PlaywrightStudy Training
