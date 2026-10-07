# 🎬 NovaWorks CRM — Live Manual Testing Script
**The Infinity Hack '26 | AI Project Manager MVP**

Follow this exact step-by-step walkthrough during your demo with judges. It covers all 8 challenge verification steps, proves that AI extraction works dynamically, and demonstrates strict Role-Based Access Control (RBAC).

---

## ⚡ Step 0: Start the Application

Open two terminal windows:

### Terminal 1 (Backend Server)
```bash
npm run dev:server
```
> ✅ Server starts on: `http://localhost:5000`

### Terminal 2 (Frontend Client)
```bash
npm run dev:client
```
> ✅ Frontend opens on: `http://localhost:3000`

Open your browser to: **`http://localhost:3000`**

---

## 🧪 Step 1: Login as Admin & Verify Clean Directory
1. On the login screen, notice the **1-Click Judge Quick Login** toolbar.
2. Click the **Admin** button (auto-fills `admin@novaworks.example` / `Demo123!` and signs in).
3. In the top navigation bar, click **"Team Directory"**:
   - Point out to judges that **all 10 employees** are seeded:
     - 1 Admin
     - 3 Project Managers: Ayesha (Web), Bilal (Mobile), Hina (AI)
     - 6 Developer Agents: Ali, Hamza, Sara, Usman, Zain, Maryam
   - Close the Directory modal.

---

## 🚀 Step 2: Test 1 — Official Meeting Transcript (Handling the Traps)

1. Under the **AI Transcript Automation** panel, click **"Official Handout"**.
   - Notice the textarea automatically populates with the 60-minute meeting planning transcript.
2. Click **"Create from Transcript"**.
   - Observe the button changes to `"Analyzing & Extracting..."` with a spinner.
   - Accidental double-clicks are disabled while processing.
3. Once completed, a green success banner appears:
   > *"Successfully created 3 projects and 12 tasks from the meeting transcript!"*
4. Point out the **3 created project cards** to the judges:
   - **UrbanCart Website** (Client: UrbanCart Clothing, Manager: Ayesha Khan, 4 Tasks, 40 Hours)
   - **QuickServe Mobile App** (Client: QuickServe Services, Manager: Bilal Ahmed, 4 Tasks, 46 Hours)
   - **HelpDeskPro AI Assistant** (Client: HelpDeskPro Solutions, Manager: Hina Malik, 4 Tasks, 38 Hours)

---

## 🎯 Step 3: Verify the 4 Challenge Traps with Judges

### Trap 1 & 2: UrbanCart Final Revision
1. Click the **UrbanCart Website** card.
2. Show the judges:
   - **Project Delivery Deadline:** Shows **`2026-10-20`** (✅ Solved Trap: Did NOT use the rejected initial 18 Oct date).
   - **Website integration and testing:** Shows Due **`2026-10-19`** (✅ Solved Trap: Did NOT use the initial 17 Oct date).
   - **Product catalog UI:** Due `2026-10-12` (12h, Ali).
   - **Demo cart UI:** Due `2026-10-15` (8h, Ali).
   - **Product and cart APIs:** Due `2026-10-14` (14h, Hamza).
   - **Rejected features check:** Note that payment gateway and inventory sync were **excluded** as agreed in dialogue.
3. Close the modal.

### Trap 3: QuickServe Integration Hours
1. Click the **QuickServe Mobile App** card.
2. Show the judges:
   - **Mobile integration and testing (Usman):** Effort is **`10h`** (✅ Solved Trap: Captured revised 10h agreement, not initial 8h).
   - **Total effort:** **46 Hours**.
3. Close the modal.

### Trap 4: HelpDeskPro Evaluation Owner & Kamran
1. Click the **HelpDeskPro AI Assistant** card.
2. Show the judges:
   - **Assistant evaluation and testing:** Assigned to **`Maryam Asif`** (✅ Solved Trap: Did NOT assign to Zain).
   - **Non-employee check:** "Kamran" was mentioned in the dialogue but was **never added** to the project because he is not in the directory.
3. Close the modal.

---

## 🔒 Step 4: Verify Role-Based Access Control (RBAC)

### A. Test Manager View (Ayesha Khan)
1. Click **Logout** (red icon in top right).
2. On the login screen, click **"Ayesha (Web)"**.
3. Point out to judges:
   - Ayesha sees **ONLY her project**: **UrbanCart Website**.
   - Projects managed by Bilal (QuickServe) and Hina (HelpDeskPro) are **hidden and inaccessible**.
   - The "AI Transcript Automation" panel is completely hidden from Managers.

### B. Test Agent View (Ali Raza)
1. Click **Logout**.
2. Click **"Ali (FullStack)"**.
3. Point out to judges:
   - Ali lands directly on his **"My Tasks"** workstation.
   - Shows **only his 3 assigned UrbanCart tasks** (Catalog UI, Demo Cart UI, Website Integration = 26 Hours total).
   - Hamza's 14h backend task is **completely hidden**.
   - Click the **"Related Projects"** tab: only UrbanCart Website is visible.
   - Click UrbanCart Website: inside the project modal, only Ali's tasks appear.

### C. Test Cross-Project Agent View (Hamza Shah)
1. Click **Logout**.
2. Click **"Hamza (FullStack)"**.
3. Point out to judges:
   - Hamza sees tasks spanning **two separate projects**:
     1. UrbanCart Website: *Product and cart APIs* (14h, Due 14 Oct)
     2. QuickServe Mobile App: *Booking and account APIs* (16h, Due 16 Oct)
   - Total Allocated Effort: **30 Hours**.

---

## 🔄 Step 5: Test Persistence Across Refresh
1. While logged in as Hamza, press **`F5`** (Browser Refresh).
2. Show the judges:
   - Session remains logged in.
   - All tasks and project relations reload instantly from SQLite (`crm.db`).

---

## 🤖 Step 6: Test Dynamic AI Extraction (The Organizer Changed-Input Test)

Judges will want to confirm that the app is genuinely extracting values and not just returning hardcoded mock data.

1. Log out, then log back in as **Admin**.
2. Click the red **"Reset Records"** button and confirm.
   - Notice the project list is now empty (proving reset works without deleting seeded users).
3. Click the button: **"Modified Test (12h, 23 Oct)"**.
   - Point out to judges that in this modified transcript, Usman's QuickServe integration task was changed to **12 hours** and **23 October**.
4. Click **"Create from Transcript"**.
5. Once processed:
   - Open **QuickServe Mobile App**.
   - Show the judges:
     - Task **"Mobile integration and testing"** now reflects **`12h`** and deadline **`2026-10-23`**!
     - Total project hours increased from 46h to **48h**!
   - This proves the AI parser is 100% dynamic!

---

## 🏆 Summary Checklist for Judges

| Feature | Verified |
| :--- | :---: |
| Seeded 10 demo accounts without manual signup | ✅ |
| Admin pastes transcript & creates 3 projects / 12 tasks atomically | ✅ |
| Captured revised UrbanCart deadline (20 Oct) and integration date (19 Oct) | ✅ |
| Captured revised QuickServe integration hours (10h) | ✅ |
| Captured revised HelpDeskPro testing owner (Maryam) | ✅ |
| Excluded rejected scopes (payment, inventory, maps, tickets) | ✅ |
| Filtered out external non-employees (Kamran) | ✅ |
| Manager view restricted to assigned projects | ✅ |
| Agent view restricted to assigned tasks | ✅ |
| Full persistence across browser refresh | ✅ |
| Responsive to modified inputs (12h, 23 Oct) | ✅ |
