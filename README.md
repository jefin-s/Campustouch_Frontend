# CampusTouch — Frontend

[![CI / CD](https://github.com/<YOUR_GITHUB_USERNAME>/<YOUR_REPO_NAME>/actions/workflows/ci-cd.yml/badge.svg)](https://github.com/<YOUR_GITHUB_USERNAME>/<YOUR_REPO_NAME>/actions/workflows/ci-cd.yml)

A modern College ERP frontend built with **React 19 + Vite**, featuring role-based dashboards for Admins, Staff, and Students.

---

## 🚀 Tech Stack

| Layer | Technology |
|---|---|
| UI Framework | React 19 |
| Build Tool | Vite 8 |
| Routing | React Router DOM v7 |
| HTTP Client | Axios |
| Icons | Lucide React |
| Animation | Framer Motion |

---

## 🏁 Getting Started

```bash
# 1. Install dependencies
cd campus_app
npm install

# 2. Copy environment template
cp .env.example .env.local
# Edit .env.local with your values

# 3. Start development server
npm run dev
```

---

## 🛠️ Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start local dev server (HMR enabled) |
| `npm run build` | Production build → `dist/` |
| `npm run lint` | ESLint code quality check |
| `npm run preview` | Preview production build locally |

---

## ⚙️ CI/CD Pipeline

This project uses **GitHub Actions** for automated CI/CD.

### Workflow: `.github/workflows/ci-cd.yml`

```
Push / PR to main
       │
       ▼
┌─────────────────────────┐
│   JOB 1: CI             │
│  ✔ Install dependencies │
│  ✔ ESLint lint check    │
│  ✔ Vite production build│
└────────────┬────────────┘
             │  (only on push to main, not PRs)
             ▼
┌─────────────────────────┐
│   JOB 2: CD             │
│  🚀 Deploy → GitHub Pages│
└─────────────────────────┘
```

### Enabling GitHub Pages (one-time setup)

1. Go to your repository on GitHub
2. **Settings** → **Pages**
3. Under **Source**, select **GitHub Actions**
4. Push to `main` — the workflow will deploy automatically

### Deploying to a custom domain / Vercel / Netlify

See [`CICD_SETUP.md`](./CICD_SETUP.md) for detailed instructions.

---

## 📁 Project Structure

```
campus_app/
├── public/
├── src/
│   ├── components/       # Shared UI components
│   ├── context/          # React context (Auth, etc.)
│   ├── features/
│   │   ├── admin/        # Admin management modules
│   │   ├── auth/         # Login, Register, Google OAuth
│   │   ├── dashboard/    # Role-based dashboards
│   │   ├── staff/        # Staff features
│   │   └── student/      # Student features
│   └── services/         # Axios API service layer
├── .env.example          # Environment variable template
├── vite.config.js
└── package.json
```

---

## 🔐 Environment Variables

Copy `.env.example` → `.env.local` and set:

| Variable | Description | Default |
|---|---|---|
| `VITE_BASE_URL` | Router base path | `/` |

> ⚠️ Never commit `.env.local` — it is gitignored.
