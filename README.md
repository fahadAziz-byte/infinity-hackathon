# NovaWorks CRM - AI Meeting to Project CRM

The Infinity Hack '26 &bull; Simplified Student Challenge Pack MVP

---

## Team
- **Team name:** Infinity Builders
- **Four members and responsibilities:**
  - **M1 (Frontend / UI Developer):** Application interface, dashboard screens, quick demo switcher, responsive design.
  - **M2 (Backend Developer):** Express API logic, SQLite schema & migrations, authentication & RBAC middleware.
  - **M3 (AI / Integration Developer):** LLM prompt engineering, structured JSON extraction, meeting timeline correction logic, validation pipeline.
  - **M4 (Product & Full-Stack Developer):** End-to-end integration, automated test suites, seeder script, documentation.
- **Repository:** https://github.com/fahadAziz-byte/infinity-hackathon.git

---

## What Works
- **Seeded Login & Authentication:** 10 pre-configured accounts (1 Admin, 3 Managers, 6 Agents) authenticated using bcrypt and JWT sessions. Zero manual signup needed.
- **Admin Transcript Automation:** Single-click AI processing converts raw 60-minute meeting transcripts into 3 client projects and 12 developer tasks atomically.
- **Meeting Timeline Correction & Trap Handling:**
  - Automatically captures revised UrbanCart project deadline (**20 October 2026**, not 18 Oct).
  - Captures revised UrbanCart integration task deadline (**19 October 2026**, not 17 Oct).
  - Captures revised QuickServe integration task estimate (**10 hours**, not 8 hours).
  - Assigns HelpDeskPro evaluation task to **Maryam (DEV06)** (not Zain).
  - Rejects excluded scopes (payment gateway, stock integration, live maps, driver tracking, ticketing APIs).
  - Ignores external non-employees (e.g. Kamran).
- **Strict Role-Based Access Control (RBAC):**
  - **Admin:** Sees all projects & tasks, transcript automation console, and project reset action.
  - **Managers:** Can only view and fetch projects where they are assigned manager (`managerId == currentUser.id`).
  - **Agents:** Can only view projects containing their tasks, and **strictly their own tasks** within that project. Other agents' tasks cannot be queried or viewed.
- **Persistence:** Local SQLite database with transactional all-or-nothing saves (`better-sqlite3`). Data persists across page reloads.
- **Reset Capability:** Admin can reset projects and tasks without deleting seeded users for repeat testing.

---

## Technology Stack
- **Frontend:** React 18, Vite 6, Tailwind CSS v4, Lucide Icons, TypeScript
- **Backend:** Node.js v22, Express 4, TypeScript, tsx, Better-SQLite3, Zod, bcryptjs, jsonwebtoken
- **Database:** SQLite (embedded via `better-sqlite3` with foreign keys & WAL mode enabled)
- **AI:** OpenRouter / OpenAI compatible LLM API (default: `meta-llama/llama-3.3-70b-instruct:free` or `google/gemini-2.0-flash-exp:free`) with resilient high-fidelity fallback parser
- **Authentication/session approach:** Stateless JWT Bearer token authentication stored in client localStorage and verified via backend middleware on every request.

---

- **Live application:** [Your Vercel URL will go here]
- **Backend API:** https://infinity-hackathon.onrender.com
- **Database:** Hosted PostgreSQL on Neon.tech (Aiven/Neon cloud compatible)
- **Demo video:** [accessible recording URL]

---

## Requirements
- Node.js: `v18.0.0` or higher (tested on `v22.21.1`)
- npm: `v9.0.0` or higher
- SQLite3 (handled natively by `better-sqlite3`, no external database server install needed)
- Optional AI API Key: OpenRouter API key (app runs with dynamic fallback parser if key is omitted)

---

## Run Locally

### 1. Clone this repository and enter its directory:
```bash
git clone https://github.com/your-username/novaworks-crm.git
cd novaworks-crm
```

### 2. Install dependencies:
Install server and client dependencies:
```bash
# In the server folder:
cd server
npm install

# In the client folder:
cd ../client
npm install

# Return to root:
cd ..
```

### 3. Configure environment variables:
Copy `.env.example` inside the `server/` directory:
```bash
# Windows PowerShell / CMD:
copy server\.env.example server\.env

# Or Linux / macOS:
cp server/.env.example server/.env
```
*(Optional: set your `AI_API_KEY` in `server/.env` if using an external OpenRouter or OpenAI model).*

### 4. Seed all ten demo users:
Run the seeder script from the `server` directory (idempotent, safe to run multiple times):
```bash
cd server
npm run seed
cd ..
```

### 5. Start Backend and Frontend:

**Terminal 1 (Backend):**
```bash
cd server
npm run dev
```
*Backend runs on: `http://localhost:5000`*

**Terminal 2 (Frontend):**
```bash
cd client
npm run dev
```
*Frontend runs on: `http://localhost:3000`*

Open **`http://localhost:3000`** in your browser.

---

## Environment Variables

Configured in `server/.env`:

| Variable | Purpose | Where configured |
| :--- | :--- | :--- |
| `PORT` | Backend server port (defaults to 5000) | `server/.env` |
| `JWT_SECRET` | Session signing secret key | `server/.env` |
| `AI_BASE_URL` | Base endpoint for LLM completion API | `server/.env` |
| `AI_API_KEY` | Credential for AI provider (e.g. OpenRouter key) | `server/.env` |
| `AI_MODEL` | AI model name (e.g. `meta-llama/llama-3.3-70b-instruct:free`) | `server/.env` |

---

## Demo Login Accounts

All 10 accounts share the sample password: **`Demo123!`**.
The login screen also provides a **1-Click Quick Demo Login** toolbar for immediate testing.

| Role | Name | Demo email | Password |
| :--- | :--- | :--- | :--- |
| **Admin** | Admin | `admin@novaworks.example` | `Demo123!` |
| **Manager** | Ayesha Khan | `ayesha@novaworks.example` | `Demo123!` |
| **Manager** | Bilal Ahmed | `bilal@novaworks.example` | `Demo123!` |
| **Manager** | Hina Malik | `hina@novaworks.example` | `Demo123!` |
| **Agent** | Ali Raza | `ali@novaworks.example` | `Demo123!` |
| **Agent** | Hamza Shah | `hamza@novaworks.example` | `Demo123!` |
| **Agent** | Sara Noor | `sara@novaworks.example` | `Demo123!` |
| **Agent** | Usman Tariq | `usman@novaworks.example` | `Demo123!` |
| **Agent** | Zain Abbas | `zain@novaworks.example` | `Demo123!` |
| **Agent** | Maryam Asif | `maryam@novaworks.example` | `Demo123!` |

---

## How Judges Can Test

1. **Log in as Admin:**
   - Go to `http://localhost:3000`.
   - Click the **"Admin"** quick-login button (or sign in with `admin@novaworks.example` / `Demo123!`).
2. **Create from Transcript:**
   - In the "AI Transcript Automation" panel, click the button **"Official Handout"** to insert the official 60-minute planning transcript.
   - Click **"Create from Transcript"**.
   - Notice the loading state and duplicate-click prevention.
   - Expect exactly **3 projects** and **12 tasks** created.
3. **Verify Project 1 (UrbanCart Website):**
   - Click on the **UrbanCart Website** card:
     - Manager: **Ayesha Khan**
     - Project Deadline: **20 October 2026** (verifying trap: not 18 Oct)
     - 4 Tasks totaling **40 hours**
     - Task "Website integration and testing": Due **19 October 2026** (verifying trap: not 17 Oct)
4. **Log in as Ayesha (Manager):**
   - Log out, then click **"Ayesha (Web)"** on the login screen.
   - Only her assigned project (**UrbanCart Website**) is displayed. Projects managed by Bilal or Hina are not visible.
5. **Log in as Ali (Agent):**
   - Log out, then click **"Ali (FullStack)"**.
   - Only his **3 assigned UrbanCart tasks** appear in the "My Tasks" queue (12h Catalog, 8h Cart UI, 6h Integration).
   - Hamza's 14h API task is completely hidden.
6. **Log in as Hamza (Agent):**
   - Log out, then click **"Hamza (FullStack)"**.
   - Hamza's **2 API tasks** span across both **UrbanCart Website** and **QuickServe Mobile App**.
7. **Test Role-Based API Protection:**
   - Direct requests to `/api/projects/proj-2` using Ayesha's token or Ali's token return `403 Forbidden`.
8. **Verify Persistence:**
   - Refresh the browser (F5) on any screen: projects and assigned tasks remain saved.
9. **Test Modified Transcript (Dynamic AI Conversion Test):**
   - Log back in as Admin.
   - Click **"Reset Records"** to clear the previous demo run.
   - Click **"Modified Test (12h, 23 Oct)"** button.
   - Click **"Create from Transcript"**.
   - Verify that QuickServe's "Mobile integration and testing" task reflects **12 hours** and deadline **2026-10-23**, proving genuine dynamic extraction.

---

## Automated Test Verification

Two complete automated test suites are provided to verify the implementation:

1. **Auth & RBAC Test Suite:**
   ```bash
   cd server
   npm run test:auth
   ```
   *Asserts 401 on bad password, validates Admin/Manager/Agent JWTs, proves data isolation, verifies 403 on unauthorized project access, and checks non-admin reset blocking.*

2. **AI & Transcript Trap Verification Suite:**
   ```bash
   cd server
   npm run test:ai
   ```
   *Asserts creation of exactly 3 projects and 12 tasks, verifies all 4 challenge traps (UrbanCart deadline Oct 20, Integration date Oct 19, QuickServe hours 10h, HelpDeskPro testing owner Maryam), and verifies dynamic changed-input test (12h, Oct 23).*

---

## Deployment Details
- **Deployment status:** Local only (can be deployed to Vercel/Render/Railway)
- **Frontend host:** Local / Vercel
- **Backend host:** Local / Node.js
- **Database:** Local SQLite (`crm.db`) / Aiven PostgreSQL compatible
- **Deployed branch/commit:** `main`

---

## Known Limitations
- Fictional email format: Accounts are identifiers only; no outgoing SMTP server is connected.
- Single workspace: Multi-tenant organizational isolation is outside the scope of this hackathon MVP.

---

## Submission Summary
- **Source repository:** [YOUR_GITHUB_REPOSITORY_URL]
- **Live link or local demo video:** [YOUR_DEMO_VIDEO_OR_LIVE_URL]
- **Setup and seed commands:** `npm run seed` in `server/`
- **Demo login accounts:** 10 accounts confirmed working with password `Demo123!`
- **Features completed:**
  - [x] Seeded 10 demo accounts (Admin, 3 Managers, 6 Agents)
  - [x] JWT authentication and session persistence
  - [x] Admin transcript parsing with AI + resilient parser
  - [x] 3 projects and 12 tasks created atomically
  - [x] All 4 meeting corrections/traps handled
  - [x] Manager project-scoped dashboard
  - [x] Agent personal task queue ("My Tasks")
  - [x] Team directory modal
  - [x] Role-Based Access Control enforced at the API route layer
  - [x] Dynamic changed-input test support
  - [x] Project reset capability
