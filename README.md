# My Resume Gateway

This repository hosts a clean, modern gateway page for accessing my curriculum vitae / resume. 

Built with modern HTML, CSS (vanilla, using fluid layouts, custom fonts, glassmorphism design, and hardware-accelerated animations), and hosted using GitHub Pages.

## How to Deploy to GitHub Pages

If you want to host this on GitHub Pages:

1. **Initialize Git & Commit Files**:
   Open a terminal in the `MY-RESUME` folder and run:
   ```bash
   git init
   git add index.html README.md
   git commit -m "Initial commit - Add resume gateway page"
   ```

2. **Create a GitHub Repository**:
   Go to GitHub and create a new repository (e.g., named `my-resume`). Do not add a README, license, or `.gitignore` since we already have them.

3. **Link and Push**:
   Add the remote repository as origin and push to the default branch (e.g., `main` or `master`):
   ```bash
   git branch -M main
   git remote add origin https://github.com/YOUR_GITHUB_USERNAME/my-resume.git
   git push -u origin main
   ```

4. **Enable GitHub Pages**:
   - Go to your repository settings on GitHub.
   - On the left sidebar, click **Pages**.
   - Under **Build and deployment** -> **Source**, select **Deploy from a branch**.
   - Under **Branch**, select `main` (or `master`) and `/ (root)`.
   - Click **Save**.

Your resume gateway will be live in a few minutes at:
`https://YOUR_GITHUB_USERNAME.github.io/my-resume/`
