# CONTRIBUTING_GUIDE.md

# Git Commands & Workflow Guide for SDETs (Day-to-Day Usage)

> This document explains the standard Git workflow followed by the automation team for code contribution, conflict resolution, branch management, and Pull Request (PR) process.

> All team members should follow these steps before pushing automation framework changes.

## Why This Guide?

As an SDET/QA Automation Engineer, Git is used daily for:

* Pulling latest framework changes
* Creating feature/fix branches
* Working safely without breaking main branch
* Resolving merge conflicts
* Raising Pull Requests (PRs)
* Collaborating with multiple automation engineers
* Maintaining clean commit history

This guide covers the practical Git workflow followed in most companies.

---

# 1. Initial Repository Setup

## Clone Existing Repository

```bash
git clone <repo-url>
```

Example:

```bash
git clone https://github.com/company/project.git
```

Move into project:

```bash
cd project
```

---

# 2. Check Current Branch

```bash
git branch
```

Example output:

```bash
* main
```

`*` indicates your current branch.

---

# 3. Always Pull Latest Code Before Starting Work

This is one of the MOST IMPORTANT practices.

Before starting any work:

## Switch to Main

```bash
git checkout main
```

## Pull Latest Changes

```bash
git pull origin main
```

Why?

* Other team members may have pushed changes
* Latest framework updates are required
* Prevents huge merge conflicts later

---

# 4. Create Your Own Working Branch

Never work directly on `main`.

## Create Feature Branch

```bash
git checkout -b feature/login-module
```

## Create Fix Branch

```bash
git checkout -b fix/booking-flow
```

## Create Refactor Branch

```bash
git checkout -b refactor/framework-cleanup
```

---

# 5. Verify Current Branch

```bash
git branch
```

Example:

```bash
* fix/booking-flow
  main
```

---

# 6. Do Your Code Changes

Examples:

* Add Playwright tests
* Modify framework utilities
* Update locators
* Improve reporting
* Add API mocks
* Fix flaky tests

---

# 7. Check Changed Files

```bash
git status
```

This shows:

* Modified files
* New files
* Deleted files
* Staged vs unstaged changes

---

# 8. Add Files to Staging

## Add All Files

```bash
git add .
```

## Add Specific File

```bash
git add tests/login.spec.ts
```

---

# 9. Commit Changes

## Good Commit Message Examples

```bash
git commit -m "Added login automation tests"
```

```bash
git commit -m "Fixed booking flow synchronization issue"
```

```bash
git commit -m "Improved Playwright retry logic"
```

Avoid bad commit messages like:

* update
* fix
* changes
* final

---

# 10. Push Branch to Remote Repository

## First Push

```bash
git push -u origin fix/booking-flow
```

## Future Pushes

```bash
git push
```

---

# 11. Daily Real-Time Team Workflow (Very Important)

## Scenario

You are working on:

```text
fix/booking-flow
```

Meanwhile another engineer pushes code into:

```text
main
```

Before continuing your work, you should sync latest main changes.

---

# 12. Pull Latest Main Into Your Branch

## Step 1 — Save Your Work

Commit your local changes first:

```bash
git add .
git commit -m "WIP booking flow updates"
```

---

## Step 2 — Switch to Main

```bash
git checkout main
```

---

## Step 3 — Pull Latest Main

```bash
git pull origin main
```

Now your local main has latest team code.

---

## Step 4 — Switch Back to Your Branch

```bash
git checkout fix/booking-flow
```

---

## Step 5 — Merge Latest Main Into Your Branch

```bash
git merge main
```

Alternative (preferred in some companies):

```bash
git rebase main
```

---

# 13. Resolve Merge Conflicts

Sometimes Git shows conflict like:

```text
CONFLICT (content): Merge conflict in booking.spec.ts
```

Open conflicted file.

You will see:

```text
<<<<<<< HEAD
Your code
=======
Team code
>>>>>>> main
```

Fix manually.

Then:

```bash
git add .
```

If merge:

```bash
git commit -m "Resolved merge conflict"
```

If rebase:

```bash
git rebase --continue
```

---

# 14. Run Tests Before Pushing

Very important for SDETs.

Example:

```bash
npx playwright test
```

Or:

```bash
npm run regression
```

Ensure:

* Build passes
* Tests pass
* No lint issues
* No broken framework

---

# 15. Push Updated Branch

```bash
git push
```

If using rebase:

```bash
git push --force-with-lease
```

Never use plain `--force` carelessly.

---

# 16. Raise Pull Request (PR)

On GitHub:

* Open repository
* Click "Compare & Pull Request"
* Add PR title
* Add PR description
* Select reviewers
* Create PR

---

# 17. Typical PR Description Example

```text
Summary:
- Fixed booking flow synchronization issue
- Added retry handling
- Improved locator stability

Validation:
- Regression executed successfully
- Cross-browser verified
```

---

# 18. After PR Approval

Usually:

* Reviewer approves
* CI pipeline passes
* Branch merged into main

---

# 19. Pull Latest Main After Merge

```bash
git checkout main
```

```bash
git pull origin main
```

---

# 20. Delete Old Branch (Optional)

## Delete Local Branch

```bash
git branch -d fix/booking-flow
```

## Delete Remote Branch

```bash
git push origin --delete fix/booking-flow
```

---

# 21. Most Important Git Commands Cheat Sheet

| Purpose          | Command                        |
| ---------------- | ------------------------------ |
| Check branch     | git branch                     |
| Check status     | git status                     |
| Pull latest code | git pull origin main           |
| Create branch    | git checkout -b branch-name    |
| Switch branch    | git checkout branch-name       |
| Add files        | git add .                      |
| Commit           | git commit -m "message"        |
| Push first time  | git push -u origin branch-name |
| Push later       | git push                       |
| Merge main       | git merge main                 |
| Rebase main      | git rebase main                |
| Resolve rebase   | git rebase --continue          |
| Delete branch    | git branch -d branch-name      |
| View commits     | git log --oneline              |

---

# 22. Recommended Branch Naming for SDETs

## Features

```text
feature/playwright-reporting
feature/mcp-integration
feature/ai-healing
```

## Fixes

```text
fix/login-timeout
fix/api-token-handling
fix/flaky-test
```

## Refactor

```text
refactor/framework-cleanup
```

---

# 23. Git Best Practices for Automation Engineers

## DO

* Pull latest code daily
* Commit small meaningful changes
* Use proper commit messages
* Run tests before push
* Raise PR instead of direct main push
* Keep branches focused
* Resolve conflicts carefully

## DON'T

* Push directly to main
* Commit node_modules
* Commit secrets/tokens
* Use force push carelessly
* Keep long-running stale branches

---

# 24. Important .gitignore for Playwright

```gitignore
node_modules/
playwright-report/
test-results/
blob-report/
coverage/
.env
*.log
.vscode/
```

---

# 25. Real Industry Workflow Summary

```text
1. Pull latest main
2. Create your branch
3. Do code changes
4. Add + commit
5. Pull latest main again if needed
6. Merge/rebase main into branch
7. Resolve conflicts
8. Run tests
9. Push branch
10. Raise PR
11. Review + approval
12. Merge to main
13. Pull updated main
```

---

# 26. Advanced Topics You Can Learn Next

* Git rebase vs merge
* Interactive rebase
* Cherry-pick
* Squash commits
* Git stash
* Git tags
* GitHub Actions CI/CD
* Branch protection rules
* Code owners
* PR templates
* Release branching strategy

---

# 27. Recommended Professional Workflow for Your Automation Framework

```text
main
 ├── feature/mcp-security
 ├── feature/playwright-pom
 ├── feature/ai-retry-engine
 ├── feature/reporting
 ├── fix/booking-flow
 └── refactor/framework-cleanup
```

