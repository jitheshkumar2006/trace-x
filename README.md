# TRACE-X — AI Evidence Intelligence System for Missing & Vulnerable Persons

> **"Don't just search the evidence. Find the evidence you're missing."**
>
> An uncertainty-aware investigation intelligence platform built for Smart India Hackathon 2026 Problem Statement **PSS2: Smart System for Missing and Vulnerable Persons**.

---

## 🌟 Key Features & Paradigm

TRACE-X replaces conventional blind searching with an **Information-Value-Driven Continuous Loop**:

1. **Uncertainty-Aware Gap Analysis**: Automatically highlights time-location windows where evidence is missing (e.g. `10:18 AM → 10:31 AM`, 68% Uncertainty).
2. **Next Best Evidence Engine**: Ranks missing evidence sources by expected uncertainty reduction percentage and hypothesis distinction power.
3. **Multi-Hypothesis Network Graph**: Interactive custom SVG graph maintaining competing movement hypotheses concurrently (Hypotheses A, B, and C).
4. **Negative Evidence Detection**: Analyzes camera coverage gaps when an expected sighting is missing.
5. **Role-Based Access Portal**: 4 security tiers — Police / Investigator, NGO Partner, Verified Volunteer, and Family Portal.
6. **Search Priority Map**: Interactive Leaflet map displaying candidate search zones (🔴 High, 🟠 Medium, 🟡 Low) and trajectory paths.
7. **Strict Safety Safeguards**: All AI leads strictly labeled as `"Potential Lead — Human Verification Required"`. Locations labeled as `"Candidate Search Zones"`.

---

## 🚀 Quick Start

### 1. Prerequisites
- Node.js v18 or higher
- npm or yarn

### 2. Installation
```bash
# Clone or navigate to the project root
cd trace-x

# Install dependencies
npm install
```

### 3. Running Locally (Development Mode)
```bash
# Start Vite development server bound to all network interfaces
npm run dev -- --host
```
- **Local Browser**: [http://localhost:5173](http://localhost:5173)
- **Local Network (Wi-Fi / LAN)**: `http://<YOUR_IP_ADDRESS>:5173` (e.g., `http://192.168.31.30:5173`)

### 4. Building for Production
```bash
# Type check and build production bundle
npm run build
```

---

## 📂 Project Structure

```text
trace-x/
├── public/                  # Favicon & SVG assets
├── src/
│   ├── components/
│   │   └── layout/          # AppLayout, Sidebar (12 navigation routes), TopBar
│   ├── data/                # Pre-loaded demo case (TRX-2026-001) & initial graph/gap data
│   ├── pages/               # All 13 core views
│   │   ├── LoginPage.tsx              # 4-Role authentication portal
│   │   ├── DashboardPage.tsx          # Statistics & Evidence DNA bars
│   │   ├── ActiveCasesPage.tsx        # Case list & Visual Identity Profiles
│   │   ├── CreateCasePage.tsx          # Case registration & AI profile extraction
│   │   ├── EvidenceInboxPage.tsx      # 5 source tabs & 7-step AI analysis sequence
│   │   ├── EvidenceGraphPage.tsx      # HERO SCREEN — Directed network matrix
│   │   ├── InvestigationGapsPage.tsx  # "WHAT DON'T WE KNOW?" & Negative Evidence
│   │   ├── NextBestEvidencePage.tsx   # "WHAT SHOULD INVESTIGATOR FIND NEXT?" engine
│   │   ├── SearchPriorityMapPage.tsx  # Leaflet map with candidate search zones
│   │   ├── CitizenReportsPage.tsx     # Public anonymous sighting portal
│   │   ├── AuditLogPage.tsx           # Immutable security audit trail
│   │   ├── PrivacyPage.tsx            # Data minimization & encryption matrix
│   │   └── SettingsPage.tsx           # Prototype simulation controls
│   ├── store/
│   │   └── useStore.ts      # Zustand global state & CCTV-014 investigation flow
│   ├── types/
│   │   └── index.ts         # All TypeScript interfaces (14 data models)
│   ├── App.tsx              # React Router configuration
│   ├── index.css            # Custom Emergency Intelligence Design System
│   └── main.tsx             # React DOM entry point
├── package.json
├── tsconfig.json
└── vite.config.ts
```

---

## 🎬 3-Minute Hackathon Demo Flow

1. **Login**: Select **Police / Investigator** role.
2. **Dashboard**: Observe baseline **Case Certainty: 61%** for case `TRX-2026-001` (Arjun Krishnan).
3. **Evidence Graph**: View the network graph showing the `???` node between **10:18 AM** and **10:31 AM**.
4. **Investigation Gaps**: View `"WHAT DON'T WE KNOW?"` highlighting the critical gap between Parry's Corner and Koyambedu Market (68% uncertainty).
5. **Next Best Evidence**: Open `"WHAT SHOULD THE INVESTIGATOR FIND NEXT?"`.
   - Top Recommendation: **🔴 CCTV-014 (Market Entrance)** — Evidence Value Score: **92%** | Expected Uncertainty Reduction: **31%**.
6. **Investigate Action**: Click **`[ INVESTIGATE THIS EVIDENCE ]`**.
   - Watch the animated processing sequence.
   - Observe **Case Certainty jump from 61% → 84%**.
   - Hypothesis A confidence increases from **61% → 82%** while Hypothesis B weakens to **14%**.
7. **Search Priority Map**: View **Zone B (Koyambedu Market)** jump to **91% Probability (High Priority 🔴)**.
8. **Audit Log**: View timestamped audit trail recording the investigation action.

---

## 🛠️ Stack & Dependencies
- **React 18** + **TypeScript** + **Vite 6**
- **Tailwind CSS v4**
- **Zustand** (Global state management)
- **Leaflet** + **React-Leaflet** (Map container & spatial priority circles)
- **Framer Motion** (Animations & smooth transitions)
- **Lucide React** (Icons)

---

## 📄 License
Created for Smart India Hackathon 2026 (Problem Statement: PSS2).
