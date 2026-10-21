# AhirMilap Admin Panel — Matrimonial Management SaaS

A standalone, professional administration dashboard for the **AhirMilap** Matrimonial Matchmaking platform.

Built with **React**, **Vite**, **SCSS**, and **React Router**, following modern SaaS design aesthetics and strictly aligned with the authentic AhirMilap community brand identity.

---

## 🚀 Quick Start

### 1. Navigate to the Admin Panel directory
```bash
cd admin-panel
```

### 2. Install dependencies (if not already installed)
```bash
npm install
```

### 3. Start development server
```bash
npm run dev
```
Open **`http://localhost:5173`** (or the port indicated in your terminal, e.g. `http://localhost:5174`) in your browser.

---

## 🔐 Administrator Access

This build uses demo-only authentication. Any valid-looking email and password with at least four characters is accepted, and a new browser session is automatically signed in. Do not use this build with real administrator accounts or production data. Replace the client-side authentication and local storage with server-side authentication and authorization before production use.

---

## 📁 Key Features & Modules

### 1. Admin Authentication
* Split brand panel with AhirMilap logo, value propositions, and trust badges
* Demo-only email/password form with show/hide password toggle and "Remember workstation"
* Client-side route guards (not a security boundary)

### 2. Executive Dashboard
* **7 Core KPI Cards**: Total Registered, New Registrations, Active Profiles, Pending Verification, Verified Profiles, Grooms (Male), Brides (Female)
* **Registration Trends Chart**: Interactive Daily, Weekly, and Monthly breakdown
* **Gender Ratio Visualization**: Real-time male/female balance with progress indicators
* **Recent Registrations**: Quick-review table with direct verification toggles and profile links
* **Quick Actions**: Add user, review pending queue, export CSV

### 3. User Management & Data Table
* **Registered Profiles Table**: Columns for Photo, Name & ID, Age/Gender, City & Native Place, Career, Registration Date, Verification Status, and Account Status
* **Search**: Real-time search across Name, Mobile (`+91`), Profile ID (`AM-2026-xxx`), City, and Native place
* **Multi-Filter System**: Filter by Gender, City, Marital Status, Verification Status, Account Status, and Sorting (Newest, Oldest, Name A-Z, Age)
* **Quick Filter Tabs**: All Profiles, Pending Verification, Verified, Active, and Inactive
* **Pagination**: 10 / 25 / 50 items per page with page jump controls
* **CSV Export**: Export filtered or all profiles with full details to `.csv`

### 4. User Profile Details
* **Profile Header**: Avatar, verification badge, active status, quick actions (Verify/Unverify, Activate/Deactivate, Edit, Delete)
* **Tabbed Information Architecture**:
  * **Overview**: Profile summary & partner expectations
  * **Personal & Contact**: Mobile, email, current city, native place, DOB, age, height, marital status
  * **Family Background**: Father's name, mother's name, siblings details
  * **Education & Career**: Qualification, occupation, employer, annual income range
  * **Partner Preferences**: Detailed expectations and criteria
  * **Verification & Notes**: Internal administrative notes, audit timestamps
* **Profile Photo Management Modal**: View high-resolution photo, upload new image, or set URL

### 5. Profile Editing & Registration Form
* Reuses the exact form structure from the main AhirMilap registration form (`RegisterPage.module.scss`):
  * Personal Details
  * Family Background
  * Education & Profession
  * Basic Lifestyle
  * Partner Preferences
  * Administrative verification & status fields

### 6. System Settings & Profile
* Verification policies (Strict Ahir community rules, mandatory ID checks)
* Matchmaking Desk helpline and office details
* Database tools (Export complete database JSON backup, Restore 30 default mock profiles)
* Administrator Profile & Security credentials update

---

## 🎨 Design System

* **Brand Colors**:
  * Primary Burgundy: `#7E1D2B`
  * Light Burgundy: `#9B2C3B`
  * Warm Gold Accent: `#D4AF37`
  * Dark Sidebar: `#1A1318`
  * Neutral App Background: `#F7F5F6`
  * Surface Cards: `#FFFFFF`
* **Styling**: SCSS Modular Architecture (`_variables.scss`, `_mixins.scss`, `_responsive.scss`, `main.scss`)
* **Responsive Layouts**: Desktop (1920px, 1440px, 1280px), Tablet (1024px, 768px), and Mobile (430px, 390px, 375px) with off-canvas sidebar drawer and responsive card layouts.

---

## 📦 Static Build and Publishing

Run `npm install` and `npm run build`. The deployable static files are generated in `dist/`; the `AhirMilap-Admin-publish.zip` archive contains those files at its root. Upload the contents of `dist/` (or extract the archive) to a static web host configured to serve `index.html` for unknown paths so React Router routes work when loaded directly.

This package is a demo preview, not a production-secure admin system. Authentication is simulated in the browser, profile edits are stored in browser local storage, and registration list operations use the configured API. Do not expose sensitive data or enable real administrative operations until server-side access control and production API configuration are in place.
