# Clausify

> **Know what you're signing.**

Clausify is a web platform that automatically analyzes Terms & Conditions (T&C), extracts key clauses, and assigns a risk score — so users can understand what they're agreeing to before they click "Accept".

It is the web platform component of a three-part system built during a hackathon and rebuilt properly as a solo project:

- **Chrome Extension** — detects and analyzes T&Cs in real time while browsing
- **Backend API** — NLP extraction, scoring engine, and data storage
- **Web Platform (this repo)** — consultation, visualization, and user preferences

---

## Features

### v1 (current)

- **Dashboard** — overview of analyzed sites, score distribution, recent activity
- **Sites list** — browse all analyzed sites with filtering, sorting, and search
- **Site detail** — full clause breakdown by category, score breakdown, severity levels
- **Version history** — timeline of T&C changes for a site, diff between versions
- **Settings** — clause priority preferences, visibility toggles, account management
- **Authentication** — optional login; core features work anonymously, preferences require an account

### v2 (planned)

- Multi-site comparator — compare 2–3 sites side by side
- Tags & grouping — organize sites with custom tags
- PDF export — export analysis as a PDF report

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

| Category      | Technology                   |
| ------------- | ---------------------------- |
| Framework     | React 19 + TypeScript        |
| Build tool    | Vite                         |
| Styling       | Tailwind CSS v4              |
| Routing       | React Router DOM v7          |
| Server state  | TanStack Query (React Query) |
| Global state  | Zustand                      |
| Forms         | React Hook Form + Zod        |
| HTTP client   | Axios                        |
| Charts        | Recharts                     |
| Icons         | Lucide React                 |
| UI primitives | Radix UI                     |

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
│   │   │   ├── Sidebar.tsx        # Collapsible sidebar (desktop/tablet)
│   │   │   ├── Topbar.tsx         # Top bar with theme toggle
│   │   │   └── BottomNav.tsx      # Bottom navigation (mobile)
│   │   └── ui/
│   │       ├── Button.tsx         # Button primitive
│   │       ├── Badge.tsx          # Badge, RatingBadge, SeverityBadge
│   │       ├── Card.tsx           # Card, CardHeader, CardContent
│   │       ├── ScoreBar.tsx       # Progress bar + score + label
│   │       └── PageLoader.tsx     # Loading state for lazy routes
│   ├── lib/
│   │   ├── api.ts                 # Axios instance + all API calls
│   │   ├── constants.ts           # Score bands, query keys, routes
│   │   └── utils.ts               # cn(), score helpers, formatters
│   ├── pages/
│   │   ├── auth/
│   │   │   └── LoginPage.tsx
│   │   ├── dashboard/
│   │   │   └── DashboardPage.tsx
│   │   ├── settings/
│   │   │   └── SettingsPage.tsx
│   │   └── sites/
│   │       ├── SiteDetailPage.tsx
│   │       ├── SiteHistoryPage.tsx
│   │       └── SitesListPage.tsx
│   ├── stores/
│   │   └── theme.tsx              # Light/dark theme with persistence
│   ├── types/
│   │   └── index.ts               # All TypeScript types matching API spec
│   ├── App.tsx
│   ├── index.css                  # Tailwind v4 + design tokens
│   ├── main.tsx
│   └── router.tsx                 # All routes with lazy loading
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

- **Desktop** (≥1024px) — collapsible sidebar (full or icon-only)
- **Tablet** (768–1023px) — icon-only sidebar
- **Mobile** (<768px) — bottom navigation bar

### Typography

- **Display** — Syne (headings, logo)
- **Body** — DM Sans (UI text)
- **Mono** — JetBrains Mono (code, scores)

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
git clone https://github.com/YOUR_USERNAME/clausify.git
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

---

## API Contract

The web platform communicates with the backend via REST API.

### Endpoints

| Method | Endpoint                     | Description                            |
| ------ | ---------------------------- | -------------------------------------- |
| `POST` | `/analyze`                   | Submit T&C text or URL for analysis    |
| `GET`  | `/sites`                     | List all analyzed sites                |
| `GET`  | `/sites/:id`                 | Site detail with full clause breakdown |
| `GET`  | `/sites/:id/history`         | Version history for a site             |
| `GET`  | `/sites/:id/compare?v1=&v2=` | Diff between two versions              |
| `GET`  | `/dashboard`                 | Dashboard stats and recent activity    |
| `POST` | `/auth/login`                | Login with email + password            |
| `POST` | `/auth/register`             | Register a new account                 |
| `GET`  | `/auth/me`                   | Get current user                       |
| `GET`  | `/preferences`               | Get user preferences                   |
| `PUT`  | `/preferences`               | Update user preferences                |

### Response format

```json
{
  "site": "exemple.com",
  "analyzed_at": "2026-03-23T10:30:00Z",
  "clauses": [
    {
      "type": "personal_data",
      "content": "Clause text...",
      "severity": "high",
      "score_impact": -15
    }
  ],
  "global_score": 72,
  "rating": "red"
}
```

---

## Roadmap

- [x] Project scaffold
- [x] Design system & tokens
- [x] Layout components
- [x] UI primitives
- [x] TypeScript types
- [x] API client
- [ ] Theme toggle (light/dark)
- [ ] Router + AppShell
- [ ] Dashboard page
- [ ] Sites list page
- [ ] Site detail page
- [ ] Version history page
- [ ] Settings page
- [ ] Login / Register page
- [ ] v2: Multi-site comparator
- [ ] v2: Tags & grouping
- [ ] v2: PDF export

---

## License

MIT
