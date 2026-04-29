# Clausify

> **Know what you're signing.**

Clausify is a web platform that automatically analyzes Terms & Conditions (T&C), extracts key clauses, and assigns a risk score - so users can understand what they're agreeing to before they click "Accept".

It is the web platform component of a three-part system built during a hackathon and rebuilt properly as a solo project:

- **Chrome Extension** - detects and analyzes T&Cs in real time while browsing
- **Backend API** - NLP extraction, scoring engine, and data storage
- **Web Platform (this repo)** - consultation, visualization, and user preferences

---

## Features

### v1 (current)

- **Dashboard** - overview of analyzed sites, score distribution, recent activity
- **Sites list** - browse all analyzed sites with filtering, sorting, and search
- **Site detail** - full clause breakdown by category, score breakdown, severity levels
- **Compare** - side-by-side comparison of 2–3 sites by clause type and global score
- **Tags** - organize sites with custom color-coded tags, AND/OR filtering
- **Version history** - timeline of T&C changes for a site, diff between versions
- **Settings** - tag management and account settings
- **Authentication** - optional login; core features work anonymously, preferences require an account

### v2 (planned)

- Chrome extension
- PDF export
- Version diff viewer

---

## Scoring System

Clausify uses a **0–100 risk score** where higher means more risky.

| Score    | Rating    | Color |
| -------- | --------- | ----- |
| 0 – 30   | Safe      | Green |
| 31 – 65  | Moderate  | Amber |
| 66 – 100 | High risk | Red   |

Scores are calculated by the backend based on detected clause types and their severity.

---

## Clause Types

| Key             | Description                          |
| --------------- | ------------------------------------ |
| `personal_data` | Collection and use of personal data  |
| `third_party`   | Resale or sharing with third parties |
| `abusive`       | Potentially abusive clauses          |
| `retention`     | Data retention period                |
| `recourse`      | Rights of recourse and withdrawal    |

Each clause has a severity level: `high` (concerning), `medium` (monitor), or `low` (standard).

---

## Tech Stack

| Category     | Technology                   |
| ------------ | ---------------------------- |
| Framework    | React 19 + TypeScript        |
| Build tool   | Vite                         |
| Styling      | Tailwind CSS v4              |
| Routing      | React Router DOM v7          |
| Server state | TanStack Query (React Query) |
| Global state | Zustand                      |
| HTTP client  | Native fetch API             |
| Icons        | Lucide React                 |

---

## Project Structure

```
clausify/
├── public/
│   └── favicon.svg
├── src/
│   ├── components/
│   │   ├── layout/
│   │   │   ├── AppShell.tsx       # Main layout wrapper
│   │   │   ├── Sidebar.tsx        # Collapsible sidebar (desktop)
│   │   │   ├── Topbar.tsx         # Top bar with theme toggle and auth
│   │   │   └── BottomNav.tsx      # Bottom navigation (mobile)
│   │   └── ui/
│   │       ├── LoginModal.tsx     # Auth modal (login + register)
│   │       ├── PageLoader.tsx     # Loading state for lazy routes
│   │       └── TagPopover.tsx     # Tag assignment popover
│   ├── hooks/
│   │   ├── useSites.ts            # All TanStack Query hooks
│   │   └── useTheme.ts            # Theme hook
│   ├── lib/
│   │   ├── api.ts                 # Native fetch client + all API calls
│   │   ├── constants.ts           # Query keys, routes, page size, options
│   │   └── utils.ts               # Formatters, clause/severity labels
│   ├── pages/
│   │   ├── compare/
│   │   │   └── ComparePage.tsx
│   │   ├── dashboard/
│   │   │   └── DashboardPage.tsx
│   │   ├── settings/
│   │   │   └── SettingsPage.tsx
│   │   └── sites/
│   │       ├── SiteDetailPage.tsx
│   │       ├── SiteHistoryPage.tsx
│   │       └── SitesListPage.tsx
│   ├── stores/
│   │   ├── authStore.ts           # Auth state (Zustand)
│   │   ├── themeContext.ts        # Theme context
│   │   └── theme.tsx              # Theme provider
│   ├── types/
│   │   └── index.ts               # All TypeScript types matching API
│   ├── App.tsx
│   ├── index.css                  # Tailwind v4 + design tokens
│   ├── main.tsx
│   └── router.tsx                 # Routes with lazy loading
├── .env.local
├── .gitignore
├── index.html
├── package.json
├── tsconfig.json
├── tsconfig.app.json
├── tsconfig.node.json
└── vite.config.ts
```

---

## Design System

### Theme

- Light mode by default, dark mode toggle
- Persisted in `localStorage`
- Respects system preference on first visit

### Navigation

- **Desktop + Tablet** (≥768px) - collapsible sidebar (full or icon-only)
- **Mobile** (<768px) - bottom navigation bar

### Typography

- **Display** - Syne (headings, logo)
- **Body** - DM Sans (UI text)
- **Mono** - JetBrains Mono (code, scores)

### Colors

| Token              | Value            | Usage                      |
| ------------------ | ---------------- | -------------------------- |
| `--color-primary`  | Purple `#534AB7` | Brand, active states, CTAs |
| `--color-safe`     | Green `#1D9E75`  | Low risk scores            |
| `--color-moderate` | Amber `#EF9F27`  | Medium risk scores         |
| `--color-high`     | Red `#E24B4A`    | High risk scores           |

---

## Getting Started

### Prerequisites

- Node.js 20.x
- Yarn 1.22+

### Installation

```bash
# Clone the repository
git clone hhttps://github.com/freescout/clausify.git
cd clausify

# Install dependencies
yarn install

# Start development server
yarn dev
```

### Environment variables

Create a `.env.local` file at the root:

```env
VITE_API_URL=http://localhost:3000
```

### Git workflow

Solo feature-branch workflow - one branch per feature, committed after completion, merged to `main`.

---

## API Contract

The web platform communicates with the backend via REST API.

### Endpoints used

| Method   | Endpoint                         | Description                                                |
| -------- | -------------------------------- | ---------------------------------------------------------- |
| `GET`    | `/api/sites`                     | List all analyzed sites                                    |
| `GET`    | `/api/sites/:domain/history`     | Site detail with full clause breakdown and version history |
| `GET`    | `/api/sites/:domain/history/:id` | Specific version detail                                    |
| `POST`   | `/api/analyze`                   | Submit a URL for analysis                                  |
| `POST`   | `/api/auth/login`                | Login with email + password                                |
| `POST`   | `/api/auth/register`             | Register a new account                                     |
| `GET`    | `/api/tags`                      | List user tags                                             |
| `POST`   | `/api/tags`                      | Create a tag                                               |
| `PATCH`  | `/api/tags/:id`                  | Update a tag                                               |
| `DELETE` | `/api/tags/:id`                  | Delete a tag                                               |
| `POST`   | `/api/tags/:id/sites/:siteId`    | Assign tag to site                                         |
| `DELETE` | `/api/tags/:id/sites/:siteId`    | Remove tag from site                                       |

---

## Roadmap

### v1

- [x] Project scaffold
- [x] Design system & tokens
- [x] Layout components (Sidebar, Topbar, BottomNav)
- [x] TypeScript types
- [x] Native fetch API client
- [x] Theme toggle (light/dark) with persistence
- [x] Router with lazy loading
- [x] Auth (login/register modal, Zustand store)
- [x] Dashboard page
- [x] Sites list (grid / list / group views, filtering, sorting, pagination)
- [x] Site detail page
- [x] Version history page
- [x] Compare page (multi-site, side-by-side)
- [x] Tags (create, assign, filter, AND/OR operator)
- [x] Settings page

### v2

- [ ] Chrome extension
- [ ] PDF export
- [ ] Version diff viewer
- [ ] Deploy

---

## License

MIT
