# How to Publish This Website with GitHub Actions

This guide walks you through publishing the A11y-Demo site to **GitHub Pages** using the GitHub Action already in this repo.

---

## What You Need

- A **GitHub account**
- This project pushed to a **GitHub repository** (e.g. `A11y-Demo`)
- The repo on your machine connected to GitHub (e.g. `origin`)

---

## Step 1: Push the Workflow to GitHub

If you haven’t pushed the workflow file yet:

1. Open **PowerShell** or **Command Prompt**.
2. Go to the project folder:
   ```powershell
   cd c:\Users\TURGUT\A11y-Demo
   ```
3. Stage and commit the workflow:
   ```powershell
   git add .github/workflows/deploy-pages.yml
   git commit -m "Add GitHub Actions workflow for GitHub Pages"
   ```
4. Push to GitHub:
   ```powershell
   git push origin main
   ```
   - If your default branch is `master`, use: `git push origin master`  
   - If the remote doesn’t exist yet, create the repo on GitHub first, then run:
     ```powershell
     git remote add origin https://github.com/YOUR_USERNAME/A11y-Demo.git
     git push -u origin main
     ```

---

## Step 2: Enable GitHub Pages (Source: GitHub Actions)

1. Open your repo in the browser:  
   `https://github.com/YOUR_USERNAME/A11y-Demo`
2. Click **Settings** (top menu of the repo).
3. In the left sidebar, under **“Code and automation”**, click **Pages**.
4. Under **“Build and deployment”**:
   - **Source**: choose **“GitHub Actions”** (not “Deploy from a branch”).
5. You don’t need to pick a branch or folder; the workflow will deploy the site.  
6. (Optional) Under **“Custom domain”** you can add your own domain later.

---

## Step 3: Allow the Workflow to Deploy (Permissions)

1. In the same repo, go to **Settings** → **Actions** → **General**.
2. Scroll to **“Workflow permissions”**.
3. Select **“Read and write permissions”** so the workflow can deploy to Pages.
4. Click **Save** if the button is there.

---

## Step 4: Run the Deployment

**Option A – Push to trigger the workflow**

- Push any new commit to the branch the workflow uses (e.g. `main`):
  ```powershell
  git add .
  git commit -m "Update site"
  git push origin main
  ```
- The **“Deploy to GitHub Pages”** workflow will run automatically.

**Option B – Run the workflow manually (no new commit)**

1. In the repo, open the **Actions** tab.
2. In the left sidebar, click **“Deploy to GitHub Pages”**.
3. Click **“Run workflow”** (top right).
4. Leave the branch as-is (e.g. `main`) and click the green **“Run workflow”**.
5. Wait until the run turns green (✓).

---

## Step 5: Check the Workflow Run

1. In **Actions**, click the latest **“Deploy to GitHub Pages”** run.
2. Click the **“deploy”** job (or the only job).
3. You should see steps like:
   - Checkout
   - Setup Pages
   - Upload artifact
   - Deploy to GitHub Pages  
   All should be green. If one is red, click it to see the error.

---

## Step 6: Open Your Published Site

1. Go back to **Settings** → **Pages**.
2. At the top you’ll see a green box: **“Your site is live at …”** with a URL like:
   ```text
   https://YOUR_USERNAME.github.io/A11y-Demo/
   ```
3. Open that URL in your browser. You should see your A11y-Demo site (product page, checkout modal, etc.).

**Note:** The first deployment can take 1–2 minutes. If you get 404, wait a bit and refresh, or run the workflow again from the Actions tab.

---

## If Something Goes Wrong

### Workflow fails with “Resource not accessible by integration” or permission errors

- In **Settings** → **Actions** → **General**, set **Workflow permissions** to **“Read and write permissions”** and save.
- Run the **“Deploy to GitHub Pages”** workflow again from the **Actions** tab.

### Workflow fails with “github_pages” environment not found

- In **Settings** → **Pages**, make sure **Source** is **“GitHub Actions”** (not “Deploy from a branch”).
- Save and run the workflow again. GitHub creates the `github_pages` environment when Pages is set to Actions.

### Site returns 404

- Wait 1–2 minutes after the first successful run.
- Confirm in **Settings** → **Pages** that it says **“Your site is live at …”**.
- Open the exact URL: `https://YOUR_USERNAME.github.io/A11y-Demo/` (with the trailing slash and correct repo name).

### You don’t see “Deploy to GitHub Pages” in the Actions list

- Ensure `.github/workflows/deploy-pages.yml` is in the repo and pushed to the branch you’re viewing.
- Refresh the Actions page; the workflow name comes from the `name` field in that file.

### You use a different default branch (e.g. `master`)

- Edit `.github/workflows/deploy-pages.yml` and change:
  ```yaml
  on:
    push:
      branches: [main]
  ```
  to:
  ```yaml
  on:
    push:
      branches: [master]
  ```
- Push the change. The workflow will then run on pushes to `master`.

---

## Summary Checklist

- [ ] Repo is on GitHub and workflow file is pushed (`.github/workflows/deploy-pages.yml`).
- [ ] **Settings → Pages**: Source = **GitHub Actions**.
- [ ] **Settings → Actions → General**: Workflow permissions = **Read and write**.
- [ ] **Actions** tab: “Deploy to GitHub Pages” run completed successfully (green).
- [ ] **Settings → Pages**: “Your site is live at …” shows your URL.
- [ ] Opened `https://YOUR_USERNAME.github.io/A11y-Demo/` and the site loads.

After that, every push to `main` (or your configured branch) will redeploy the site automatically.
