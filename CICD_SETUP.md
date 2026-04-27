# CI/CD Setup Guide — CampusTouch Frontend

This guide explains the CI/CD pipeline, how to enable it, and how to switch deployment targets.

---

## Pipeline Overview

```
┌────────────────────────────────────────────────────────────┐
│                  GitHub Actions Workflow                   │
│                  .github/workflows/ci-cd.yml               │
├────────────────────────────────────────────────────────────┤
│                                                            │
│  Trigger: push / PR → main or master                       │
│                                                            │
│  ┌──────────────────────────────────────┐                  │
│  │  JOB 1 — CI  (runs on EVERY event)  │                  │
│  │                                      │                  │
│  │  1. Checkout code                    │                  │
│  │  2. Setup Node.js 20 (with cache)    │                  │
│  │  3. npm ci  (clean install)          │                  │
│  │  4. npm run lint  (ESLint)           │                  │
│  │  5. npm run build  (Vite prod build) │                  │
│  │  6. Upload dist/ as Pages artefact   │                  │
│  └────────────────┬─────────────────────┘                  │
│                   │  needs: ci                             │
│                   │  if: push to main (not PR)             │
│                   ▼                                        │
│  ┌──────────────────────────────────────┐                  │
│  │  JOB 2 — CD  (deploy to GH Pages)   │                  │
│  │                                      │                  │
│  │  1. actions/deploy-pages@v4          │                  │
│  │     → Publishes dist/ to gh-pages    │                  │
│  └──────────────────────────────────────┘                  │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

---

## Option A — GitHub Pages (Default, already configured)

### One-time GitHub settings

1. Open your repo on GitHub.
2. **Settings** → **Pages** (left sidebar).
3. Under **Build and deployment** → **Source** → choose **GitHub Actions**.
4. Click **Save**.

### Update the README badge

In `README.md`, replace both placeholders:
```
<YOUR_GITHUB_USERNAME>  →  your actual GitHub username
<YOUR_REPO_NAME>        →  campus_touch_frontedn  (or whatever your repo is named)
```

### What gets deployed?

- Every `push` to `main` triggers lint + build + deploy.
- Pull requests only trigger lint + build (no deploy) — so you catch errors before merging.
- The live URL will be: `https://<username>.github.io/<repo-name>/`

---

## Option B — Vercel (zero-config)

Vercel auto-detects Vite. No workflow changes needed.

1. Go to [vercel.com](https://vercel.com) and import your GitHub repo.
2. Framework preset: **Vite** (auto-detected).
3. Root directory: `campus_app`.
4. Build command: `npm run build`.
5. Output directory: `dist`.
6. Every push to `main` will auto-deploy.

> You can keep the GitHub Actions CI job (lint + build) and let Vercel handle deployment — they work side-by-side.

---

## Option C — Netlify

1. Go to [app.netlify.com](https://app.netlify.com) → **Add new site** → **Import from Git**.
2. Base directory: `campus_app`.
3. Build command: `npm run build`.
4. Publish directory: `campus_app/dist`.
5. Every push to `main` auto-deploys.

---

## Option D — Custom Server / VPS (via SSH)

Add this job to the workflow after the `ci` job:

```yaml
deploy-vps:
  name: 🖥️ Deploy to VPS
  needs: ci
  runs-on: ubuntu-latest
  if: github.event_name != 'pull_request'
  steps:
    - name: Download build artefact
      uses: actions/download-artifact@v4
      with:
        name: github-pages
        path: dist

    - name: Copy to server via SCP
      uses: appleboy/scp-action@v0.1.7
      with:
        host: ${{ secrets.VPS_HOST }}
        username: ${{ secrets.VPS_USER }}
        key: ${{ secrets.VPS_SSH_KEY }}
        source: dist/*
        target: /var/www/campustouch
```

Add `VPS_HOST`, `VPS_USER`, `VPS_SSH_KEY` in **Settings → Secrets and variables → Actions**.

---

## Secrets & Environment Variables

| Name | Where to set | Purpose |
|---|---|---|
| `VITE_BASE_URL` | GitHub Actions env or repo variable | Vite base path |
| `VPS_HOST` | Repo → Settings → Secrets | VPS IP (Option D) |
| `VPS_USER` | Repo → Settings → Secrets | SSH username (Option D) |
| `VPS_SSH_KEY` | Repo → Settings → Secrets | Private SSH key (Option D) |

---

## Workflow Triggers Summary

| Event | CI Job | Deploy Job |
|---|---|---|
| `push` to `main` | ✅ runs | ✅ runs |
| `pull_request` to `main` | ✅ runs | ❌ skipped |
| Manual `workflow_dispatch` | ✅ runs | ✅ runs |

---

## Checking Pipeline Status

- Go to your repo → **Actions** tab.
- Each run shows the CI and Deploy jobs with live logs.
- The README badge reflects the latest `main` branch status automatically.
