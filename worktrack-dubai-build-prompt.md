# WorkTrack Dubai — MVP Build Prompt

## The Brief

Build a full-stack MVP web application called **WorkTrack Dubai** for a Dubai-based company: a premium activity- and task-tracking platform with two experiences. The **User side** lets each person log in, complete a short profile (name, place, country, gender, mobile number, etc.), then manage a personal to-do list — add, edit, complete, delete — with everything reflected live on a personal dashboard. The **Admin side** lets management see every registered user, drill into any one person's profile, tasks, and progress, view aggregate charts across the whole team, and export the current view as a PDF or Excel report. Every figure on every screen must be computed from a real database through a real API — nothing in the interface is hardcoded or sample data. The product must read as premium and Dubai-appropriate, bilingual in English and Arabic with full right-to-left support, and confident enough to demo to a client without apology.

> **Decisions made here so the rest of this spec is definite, not open-ended — swap any of them freely:**
> - **Database: MySQL + Prisma**, not MongoDB. The admin dashboard's charts and reports are relational by nature (group by country, aggregate completion by date range), and Prisma gives type-safe queries and migrations for free. MySQL is also the most widely supported engine across budget hosting providers, which helps for a quick MVP deploy.
> - **Second language: Arabic, full RTL** — matches the toggle already in your reference mockup and is the obvious choice for a Dubai audience.
> - **Auth: short-lived JWT access token + httpOnly refresh-token cookie**, not server sessions — keeps the API stateless and pairs cleanly with a separate React frontend.
> - **Avatar storage: Cloudinary** — least setup for an MVP; S3 is a drop-in alternative later.

---

## 1. Tech Stack

**Frontend** — React 18 + Vite · React Router · TanStack Query for *every* piece of server data (this is what makes "dynamic by default" structural rather than a discipline you have to remember) · Context API for auth/session and language state · React Hook Form + Zod for forms and validation · Tailwind CSS with the custom palette below (no off-the-shelf component kit that fights the theme) · Recharts for admin charts · Framer Motion, used sparingly · react-i18next + i18next for translation · Axios with an interceptor that attaches the access token and retries once via the refresh endpoint on a 401 · lucide-react for icons.

**Backend** — Node.js + Express · MySQL + Prisma ORM · bcrypt for password hashing, jsonwebtoken for JWTs · Zod for request validation · Multer + Cloudinary for avatar uploads · exceljs for Excel export and a headless-Chrome (Puppeteer) route for PDF export — both built from the same live query, never a separate "report" data source · dotenv for config.

**Dev tooling** — ESLint + Prettier on both projects · a `seed.js` script (dev-only) that populates the database with realistic sample users and tasks for demos. This is the *only* place anything resembling demo data should exist, and it never ships to production.

---

## 2. Design System — "Midnight & Gold"

A deliberately quiet dark theme with one warm accent, rather than the generic "AI dashboard" look (near-black background, single neon accent). Restraint everywhere, boldness spent in exactly one place — see *Signature element* below.

### Color tokens

| Token | Hex | Use |
|---|---|---|
| Midnight | `#0A0E1C` | Page background, sidebar |
| Surface | `#131A2C` | Cards, panels, table rows |
| Surface Raised | `#1B2438` | Modals, dropdowns, popovers |
| Gold | `#C9A227` | Wordmark, active nav state, primary buttons, focus rings |
| Gold Soft | `#E8C766` | Hover glow, chart highlight, progress fill |
| Cream | `#F3EFE6` | Primary text on dark surfaces |
| Slate | `#8B93A7` | Secondary text, eyebrow labels, captions |
| Emerald | `#34D399` | Completed / success state |
| Rose | `#F2697A` | Overdue / destructive state |

Keep gold for *accents and emphasis only* — never as a body-text color at small sizes; contrast against Midnight is too low for comfortable reading.

### Typography

| Role | Typeface | Where |
|---|---|---|
| Display (EN) | Cormorant Garamond | Wordmark, page greetings ("Good evening, Ahmed"), large stat numbers |
| UI / Body (EN) | Plus Jakarta Sans | Navigation, buttons, forms, table text |
| UI / Body (AR) | IBM Plex Sans Arabic | All Arabic text — one face for both display and body roles, so the language stays calm and legible at UI sizes |

Stat numbers use tabular figures so digits don't jitter when they update live.

### Layout & spacing

Fixed left sidebar (collapses to a bottom nav under 768px) + main content area, matching your reference mockup. One spacing scale throughout (4px increments: 4/8/12/16/24/32/48), one radius scale (8px controls, 16px cards, full-round pills for badges and the language toggle), one shadow style (soft, low-opacity black, never a hard drop shadow).

### The signature element

A faint geometric line pattern inspired by mashrabiya latticework — gold linework at roughly 6% opacity. Used in exactly two places: as a background texture on the login screen, and as a thin decorative strip across the Admin Overview header. Nowhere else. This is what makes the theme feel specifically Dubai rather than generically "dark and gold," and it stays special by staying rare.

### Motion

One orchestrated moment, not scattered effects: stat numbers count up from zero on first load, progress bars fill with an eased animation, cards lift 2px with a barely-visible gold-tinted shadow on hover, and focus states get a soft gold ring (doubles as an accessibility win). Respect `prefers-reduced-motion` and turn all of this off for users who ask for it.

### Voice & microcopy

Buttons name the action, not the mechanism: "Save changes," "Add task," "Mark done" — never "Submit." The vocabulary stays consistent end-to-end: a "Save changes" button produces a "Changes saved" toast, not "Update successful." Empty states invite action in the product's own voice — "Nothing on your list yet. Add your first task to get started," not "No data." Errors state what happened and how to fix it, without apologizing — "That mobile number doesn't look right. Use the format +971 5X XXX XXXX."

---

## 3. Localization — English / Arabic (RTL)

- **Library:** react-i18next + i18next, resources split by namespace per locale folder (`locales/en/*.json`, `locales/ar/*.json`).
- **Toggle:** the EN / عربي pill switch top-right, exactly as in the reference mockup. Switching is instant — no page reload.
- **RTL mechanics:** set `dir="rtl"` and `lang="ar"` on the `<html>` element when Arabic is active, and use CSS logical properties (`margin-inline-start`, `padding-inline-end`, etc.) instead of left/right everywhere, so the sidebar, cards, and text alignment all flip correctly without one-off overrides.
- **What mirrors and what doesn't:** directional elements flip (chevrons, the sidebar's side, progress-bar fill direction); non-directional elements stay put (checkmarks, the wordmark, the avatar circle).
- **Numerals:** keep Western numerals (0–9) even in Arabic mode — standard practice across UAE government and business apps, and one less thing to get wrong.
- **Dates:** localize through `Intl.DateTimeFormat` so the same date renders in either language's convention.
- **Persistence:** store the chosen language in `localStorage` for guests, and in the user's profile (`preferredLanguage`) once logged in, so the choice follows them across devices.
- **Font swap:** IBM Plex Sans Arabic loads only when Arabic is active, on the same color and spacing tokens, so the two languages feel like one product wearing two outfits, not two different apps.

---

## 4. Features

**Authentication & roles** — Register, login, logout, JWT access + refresh tokens, two roles (`user`, `admin`) enforced both in route guards on the frontend and middleware on the backend. Passwords hashed with bcrypt, never stored or logged in plain text.

**Onboarding & profile** — A short guided setup right after first login: name, city/place, country (real country list), gender, mobile number with country code, optional avatar, optional bio. The Profile page afterward reads and writes this same data live through the API — no separate "preview" copy that can drift out of sync.

**Tasks** — Create, edit, delete, toggle complete/incomplete. Fields: title, description, priority (High/Medium/Low), due date, category, status. List view supports search, filtering (status/priority/category/date range), and sorting. Completed tasks render strikethrough with a checkmark, matching your reference mockup. Overdue is computed by comparing `dueDate` to *now*, never stored as a fixed flag.

**User dashboard** — Live greeting with the real current date and the logged-in user's name; stat cards (Total, Completed, Overdue) computed by a backend aggregate query on every load; a "Today's tasks" progress bar reflecting the real ratio of done-to-total tasks due today.

**Activity log** — Every meaningful action (login, task created/updated/completed/deleted, profile updated) is recorded with a timestamp and shown on a personal Activity tab.

**Admin dashboard** — Platform-wide stats (total users, total tasks, active users today, overall completion rate), a searchable/filterable/paginated users table, a per-user detail view (profile + their tasks + their activity, read-only), and charts (completion trend, status breakdown, active-users trend) all driven by the same live aggregate queries as the stat cards. Export the current filtered view as PDF or Excel, generated at click-time from live data.

**Settings** — Change password, language preference; notification preferences can wait for a later phase.

---

## 5. Data Rules — Nothing Is Hardcoded

- Every number, list, and chart on every screen comes from a real API call. No arrays of "sample tasks" or "sample users" living inside a React component.
- `seed.js` populating the *dev database* with realistic sample data is fine — that's a database seed, not UI data. The interface itself reads from the API whether the database holds 0 rows or 10,000.
- A brand-new user with zero tasks sees a real, honest empty state — never someone else's demo tasks.
- Reference/lookup data (country list, country dial codes) is fine to ship as static JSON — it's factual reference data, not fake content, and doesn't change.
- Every dashboard stat is computed via a backend aggregate query (Prisma `count`/`groupBy`), never calculated from a fixed number sitting in the frontend.
- The avatar-initials fallback (like "AK" in your mockup) is generated from the logged-in user's real name, not a fixed placeholder.
- The date/time shown in the dashboard greeting is the real current date/time of the session — not a frozen string.

---

## 6. Database Schema

**User** — `id`, `fullName`, `email` (unique), `passwordHash`, `role` (`user` | `admin`), `mobile`, `countryCode`, `country`, `gender`, `city`, `avatarUrl`, `preferredLanguage` (`en` | `ar`), `isActive`, `createdAt`, `updatedAt`.
Relations: has many Task, ActivityLog, RefreshToken.

**Task** — `id`, `userId` (FK), `title`, `description`, `status` (`pending` | `done`), `priority` (`high` | `medium` | `low`), `category`, `dueDate`, `completedAt`, `createdAt`, `updatedAt`.
Relations: belongs to one User.

**ActivityLog** — `id`, `userId` (FK), `action` (`login` | `task_created` | `task_updated` | `task_completed` | `task_deleted` | `profile_updated`), `metadata` (JSON — e.g. which task), `createdAt`.
Relations: belongs to one User.

**RefreshToken** — `id`, `userId` (FK), `tokenHash`, `expiresAt`, `createdAt`.
Relations: belongs to one User.

---

## 7. API Surface

#### Auth
| Method | Path | Purpose |
|---|---|---|
| POST | /api/auth/register | Create account (role defaults to `user`) |
| POST | /api/auth/login | Verify credentials, issue access + refresh token |
| POST | /api/auth/refresh | Exchange a valid refresh token for a new access token |
| POST | /api/auth/logout | Revoke the refresh token |

#### Profile
| Method | Path | Purpose |
|---|---|---|
| GET | /api/me | Fetch the logged-in user's full profile |
| PUT | /api/me | Update profile fields |
| POST | /api/me/avatar | Upload/replace avatar image |
| PUT | /api/me/language | Persist the user's chosen language |

#### Tasks
| Method | Path | Purpose |
|---|---|---|
| GET | /api/tasks | List tasks — `status`, `priority`, `category`, `search`, `sort`, `page` query params |
| POST | /api/tasks | Create a task |
| PUT | /api/tasks/:id | Edit a task's fields |
| PATCH | /api/tasks/:id/status | Toggle pending ↔ done |
| DELETE | /api/tasks/:id | Delete a task |

#### Dashboard & Activity
| Method | Path | Purpose |
|---|---|---|
| GET | /api/dashboard/summary | Live counts: total, completed, overdue, today's progress |
| GET | /api/activity | The logged-in user's own activity log, paginated |

#### Admin — role `admin` only
| Method | Path | Purpose |
|---|---|---|
| GET | /api/admin/users | Paginated, searchable, filterable list of every user |
| GET | /api/admin/users/:id | One user's full profile, tasks, and activity |
| PATCH | /api/admin/users/:id/status | Activate or deactivate a user |
| GET | /api/admin/stats | Aggregate data for charts: completion trend, status breakdown, active users |
| GET | /api/admin/export | Generate the current filtered view as `?format=pdf` or `?format=xlsx` |

---

## 8. Frontend Folder Structure

```
worktrack-dubai-web/
├── public/
│   └── favicon.svg
├── src/
│   ├── assets/
│   │   ├── images/
│   │   └── patterns/              # mashrabiya-inspired SVG motif
│   ├── components/
│   │   ├── ui/                    # Button, Card, Badge, Avatar, Modal, Skeleton, EmptyState, Toast
│   │   ├── layout/                # Sidebar, Topbar, DashboardShell, AuthShell
│   │   ├── tasks/                 # TaskCard, TaskList, TaskForm, TaskFilters
│   │   ├── dashboard/              # StatCard, ProgressBar, ActivityFeed
│   │   ├── admin/                  # UsersTable, UserDetailDrawer, StatsCharts, ExportMenu
│   │   └── language/                # LanguageToggle
│   ├── pages/
│   │   ├── auth/                     # LoginPage, RegisterPage, OnboardingPage
│   │   ├── user/                      # DashboardPage, ProfilePage, TasksPage, ActivityPage, SettingsPage
│   │   └── admin/                      # AdminOverviewPage, AdminUsersPage, AdminUserDetailPage
│   ├── context/                          # AuthContext, LanguageContext
│   ├── hooks/                              # useAuth, useTasks, useDashboardStats, useAdminUsers
│   ├── services/                            # apiClient.js, authService.js, taskService.js, userService.js, adminService.js
│   ├── locales/
│   │   ├── en/                                # common.json, auth.json, dashboard.json, tasks.json, admin.json
│   │   └── ar/                                 # mirrored files
│   ├── routes/                                  # AppRouter.jsx, ProtectedRoute.jsx, AdminRoute.jsx
│   ├── styles/                                    # tokens.css, globals.css
│   ├── utils/                                      # formatDate.js, validators.js, constants.js
│   ├── i18n.js
│   ├── App.jsx
│   └── main.jsx
├── .env.example
├── tailwind.config.js
├── vite.config.js
└── package.json
```

---

## 9. Backend Folder Structure

```
worktrack-dubai-api/
├── prisma/
│   ├── schema.prisma
│   └── seed.js                     # dev-only realistic sample data
├── src/
│   ├── config/                       # env.js, db.js, cloudinary.js
│   ├── controllers/                    # auth, user, task, dashboard, activity, admin, export
│   ├── routes/                          # mirrors controllers, one router per domain
│   ├── middlewares/                       # authGuard.js, roleGuard.js, errorHandler.js, validateRequest.js, uploadAvatar.js
│   ├── services/                            # business logic per domain, called by controllers
│   ├── validators/                            # Zod schemas per domain
│   ├── utils/                                   # jwt.js, hash.js, asyncHandler.js, logger.js
│   ├── app.js
│   └── server.js
├── .env.example
└── package.json
```

---

## 10. UI/UX Quality Bar

- **Loading:** skeleton placeholders shaped like the final layout — never a blank screen, never a lone spinner.
- **Empty & error states:** real and specific, per the voice guidance above — never lorem-ipsum or fake placeholder content.
- **Responsiveness:** verified at 375px, 768px, 1024px, and 1440px; sidebar becomes a bottom nav or drawer below 768px.
- **Accessibility:** visible gold focus rings, correct heading hierarchy, labels tied to inputs, and color never carries meaning alone — status pills pair a color with text (and ideally an icon).
- **Performance:** paginate or virtualize the admin users table and long task lists; debounce search inputs.
- **Consistency:** one spacing scale, one radius scale, one shadow style — no one-off values anywhere in the app.

---

## 11. Build Order

1. Repo setup — Prisma schema + migrations, base Express server, base React app with routing and theme tokens wired in.
2. Auth — register/login API and UI, JWT handling, protected routes.
3. Profile — onboarding flow, profile API and UI, avatar upload.
4. Tasks — full CRUD API and UI, filters and search.
5. User dashboard — aggregate-stats endpoint, dashboard UI with live stat cards and progress bar.
6. Activity log — logging in the service layer, Activity tab UI.
7. Admin dashboard — users list, stats, and user-detail endpoints; admin UI and charts.
8. Export — PDF and Excel generation endpoints, export button in the admin UI.
9. Localization — translation files, language toggle, RTL handling end to end.
10. Polish — loading/empty/error states everywhere, responsive pass, accessibility pass, motion pass.

---

## 12. Definition of Done

- [ ] A new user can register, log in, and is guided through profile setup before reaching the dashboard.
- [ ] Every dashboard number changes correctly when you add, complete, or delete a task — no refresh-and-hope.
- [ ] Admin can see every registered user, open any one of them, and view their real tasks and activity.
- [ ] Admin can export the current view as both PDF and Excel, and the file matches what's on screen.
- [ ] Switching to Arabic flips the layout to RTL correctly, with no leftover English fragments.
- [ ] The app is fully usable on a 375px-wide phone screen.
- [ ] Every list, button, and form has a real loading, empty, and error state.
- [ ] Refreshing the page mid-session keeps the user logged in.