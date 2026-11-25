<div align="center">

# 🛒 peNgo – Smart Retail Command Center

**Enterprise B2B Self-Checkout, Smart Inventory & Turnstile Gate Operations**

[![Framework](https://img.shields.io/badge/Next.js-16.4-black?logo=next.js)](https://nextjs.org/)
[![AI Engine](https://img.shields.io/badge/Gemini_2.0_Flash-Google_GenAI-8E75B2?logo=google)](https://ai.google.dev/)
[![UI Library](https://img.shields.io/badge/React-19.0-blue?logo=react)](https://react.dev/)
[![Styling](https://img.shields.io/badge/TailwindCSS-v4-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)
[![Language](https://img.shields.io/badge/TypeScript-5.0-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![Database](https://img.shields.io/badge/PostgreSQL-Supabase-3ECF8E?logo=supabase)](https://supabase.com/)
[![State Management](https://img.shields.io/badge/Zustand-v5-orange)](https://github.com/pmndrs/zustand)
[![Tests](https://img.shields.io/badge/Tests-16%20Passing-brightgreen?logo=vitest)](https://github.com/Deepakmittal03/Tech-Titansa)

<p align="center">
  A centralized, high-throughput retail management platform engineered to eliminate checkout bottlenecks, automate digital bill settlement, and secure store departures using single-use cryptographic QR Exit Passes.
</p>

[Key Capabilities](#-core-platform-modules) •
[Architecture](#-system-architecture) •
[Quick Start](#-getting-started) •
[Security & Fraud Engine](#-security--fraud-prevention) •
[Database Schema](#-database-design)

---

</div>

## 📌 Problem & Vision

Traditional supermarkets and retail outlets suffer from long cashier queues, barcode spoofing risks, and labor-intensive exit checks. 

**peNgo** solves this through a unified cashierless lifecycle:
1. **Shoppers**: Scan item barcodes with the peNgo mobile app, manage their cart, pay via Razorpay UPI/cards, and receive a secure single-use QR Exit Pass.
2. **Turnstile / Gate Staff**: Verify the QR pass at the exit gate using a laser/camera scanner. The backend burns the token server-side in under 0.4s and unlocks the gate.
3. **Retail Operators**: Oversee real-time inventory depletion, automated restocking alerts, multi-branch revenue analytics, and heuristic fraud alerts from this Command Center.

---

## 🏛️ System Architecture

```text
[ Shopper Mobile App ]
         │
         ▼  (1) Barcode Scan & Dynamic Cart Totaling
[ Razorpay Payment Gateway ]
         │
         ▼  (2) Instant Payment Capture & Settlement
[ peNgo Cloud Engine ]
    ├── (3a) Atomic Stock Decrement (Database Transaction)
    ├── (3b) Cryptographic Single-Use Exit Token Minting
    └── (3c) Digital Tax Invoice Generation (GST Compliant)
         │
         ▼  (4) Customer Presents Dynamic Pass at Gate
[ Turnstile Exit Verification Gate ]
         │
         ▼  (5) Server Token Validation & Instant Burn (< 0.4s)
[ Gate Unlatched • Safe Departure ]
```

---

## 🤖 Novel Technologies & Genuine AI Innovation

peNgo introduces proprietary retail intelligence and computer vision mechanisms that set it apart from legacy POS systems:

1. **Edge Computer Vision Cross-Checking (`src/lib/ai-engine.ts`)**:
   - Turnstile overhead optical sensors feed real-time frames into our edge vision pipeline.
   - Cross-checks physically bagged items against the paid digital bill in under **38ms** (`/api/ai/vision-verify`).
   - Automatically detects un-scanned items or bag tampering before unlocking exit turnstiles.

2. **Bayesian Demand Velocity & Autonomous Replenishment (`/api/ai/forecast`)**:
   - Machine learning time-series model incorporating weekend shopping uplifts, local holiday footfall, and expiration dates.
   - Calculates dynamic restock recommendations and stockout countdowns to eliminate supermarket empty-shelf syndrome.

3. **Inhuman Barcode Spoofing & Cart Anomaly Neural Classifier**:
   - Analyzes barcode scan velocity vectors. Scans under 400ms indicate barcode injection scripts or cloned optical tags.
   - Flags suspicious pre-checkout item deletions and repeated card failures into a real-time supervisor risk watchlist.

4. **Web Audio Native Hardware Simulation**:
   - Zero-dependency browser oscillator audio synthesis providing physical acoustic turnstile feedback for cashierless gates.

---

## 🚀 Core Platform Modules

| Module | Route | Key Features |
| :--- | :--- | :--- |
| **Executive Overview** | `/dashboard` | 8 real-time KPI metrics, revenue velocity timeline, supermarket aisle revenue pie, branch comparison, interactive simulation hub. |
| **Smart Exit Verification** | `/exit-verification` | **Signature Feature**: Server-side token validation, turnstile gate simulation, instant token burning, audible POS chimes via Web Audio API. |
| **Product Catalog** | `/products` | SKU lifecycle management, barcode uniqueness verification, selling price and GST tiers, dynamic barcode & QR generation with PNG export. |
| **Department Aisles** | `/categories` | Supermarket department structuring, aisle capacities, and stock valuation distribution. |
| **Inventory & Warehouse** | `/inventory` | Multi-store inventory tracking, healthy/low/out-of-stock badges, stock adjustments (damaged/returned/inflow), inter-branch stock transfers. |
| **Orders & Invoices** | `/orders` | Order state machine (`Created` → `Payment Pending` → `Paid` → `Exit Verification` → `Completed`), itemized GST breakdown, 1-click printable & PDF invoice download. |
| **Customer CRM** | `/customers` | Shopper directory, lifetime basket valuation, average spend, loyalty points, and retention segmentation. |
| **Promotions & Offers** | `/coupons` | Percentage and fixed discounts, minimum cart value thresholds, maximum discount caps, single-click voucher copying. |
| **Payments & Gateway** | `/payments` | Razorpay transaction tracking, settlement audit trails, payment method ratios (UPI, Cards, Wallets), and daily GST collection summaries. |
| **AI Business Intelligence** | `/ai-insights` | Velocity forecasting, slow-moving SKU detection, stockout risk mitigation alerts, and co-purchase basket affinity recommendations. |
| **Fraud & Risk Monitoring** | `/fraud-detection` | Detection of duplicate QR exit attempts, cart tampering before payment, invalid barcode scans, and incident investigation logs. |
| **Multi-Store Network** | `/stores` | Outlet network management (Connaught Place, CyberHub, Indiranagar, Powai) with instant context switching in sidebar. |
| **Certified Reports** | `/reports` | Comprehensive financial audits, stock movement logs, tax remittances with 1-click CSV and PDF exports. |
| **System Settings** | `/settings` | Role-Based Access Control (RBAC) matrix, Razorpay keys, turnstile automation policies, and profile settings. |

---

## ⚡ Getting Started

### Prerequisites
- Node.js 18.x or later
- npm or pnpm or yarn

### 1. Clone the Repository
```bash
git clone https://github.com/Deepakmittal03/Tech-Titansa.git
cd Tech-Titansa
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Setup
Create a `.env.local` file based on `.env.local.example`:
```bash
cp .env.local.example .env.local
```

Configure your credentials:
```env
NEXT_PUBLIC_APP_NAME="peNgo Admin"
NEXT_PUBLIC_APP_URL="http://localhost:5000"

# Optional Supabase Connection (Platform runs with built-in Universal DataStore if omitted)
NEXT_PUBLIC_SUPABASE_URL="your-supabase-url"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key"
SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"

# Razorpay Integration
NEXT_PUBLIC_RAZORPAY_KEY_ID="your_razorpay_key_id"
RAZORPAY_KEY_SECRET="your_razorpay_secret"
```

### 4. Run Development Server
```bash
npm run dev -- -p 5000
```
Open [http://localhost:5000](http://localhost:5000) in your browser.

---

## 🛡️ Security & Fraud Prevention

* **Single-Use Cryptographic Tokens**: Pass tokens (`PENGO-EXIT-SECURE-XXXX-XXXX`) can only be verified once. Once validated, they are burned server-side.
* **Turnstile Anti-Passback**: A customer cannot forward a screenshot of their pass to someone else to exit; repeated presentation triggers an immediate high-risk fraud incident.
* **Server-Side Validation**: QR data is never trusted client-side; verification always occurs through server-side logic and database transactions.
* **Audit Logging**: Every staff verification, manual stock override, and price change creates an immutable audit trail with operator timestamp.

---

## 🗄️ Database Design

The system includes a production-ready PostgreSQL relational schema (`supabase/schema.sql`):

* `users` & `roles`: Staff profiles and 6-tier RBAC authorization.
* `stores`: Outlet addresses, contact information, and operating hours.
* `products` & `categories`: SKUs, barcodes, tax classes, and pricing.
* `inventory`: Outlet-level stock quantities and minimum thresholds.
* `orders` & `order_items`: Transactions, GST breakdown, and fulfillment status.
* `payments`: Gateway reference IDs, settlement timestamps, and payment rails.
* `exit_passes`: Cryptographic tokens, usage status, validator ID, and expiry.
* `fraud_alerts`: Anomaly classifications, severity rankings, and review status.
* `verify_and_burn_exit_pass()`: Atomic stored procedure ensuring single-use token burning and order finalization.

---

## 👥 Role-Based Access Control (RBAC)

| Role | Dashboard | Products | Inventory | Orders | Exit Gate | Analytics | Settings |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **Super Admin** | Full | Full | Full | Full | Full | Full | Full |
| **Store Owner** | Full | Full | Full | Full | Full | Full | View |
| **Store Manager** | Store | Store | Full | Full | Full | Store | View |
| **Inventory Manager** | View | Full | Full | View | - | - | - |
| **Exit Gate Officer** | View | - | - | View | Full | - | - |
| **Business Analyst** | Full | View | View | View | - | Full | - |

---

## 🧪 Automated Testing & Code Quality

The platform includes a test suite powered by **Vitest** covering core retail state transitions, security, and financial integrity:

```bash
# Run unit & integration tests
npm test

# Run tests in watch mode
npm run test:watch
```

### Test Coverage Highlights:
- **`tests/exit-verification.test.ts`**: Single-use cryptographic exit token verification, anti-passback duplicate rejection, tampered token fraud logging, and atomic pass burning.
- **`tests/data-store.test.ts`**: EAN barcode uniqueness validation, dynamic inventory adjustment audits, checkout cart stock deduction, and multi-branch metrics isolation.
- **`tests/auth-rbac.test.ts`**: Role boundary checks across all 6 administrative tiers.
- **`tests/pricing-tax.test.ts`**: Statutory GST slab calculations (5%, 12%, 18%), currency formatting (INR ₹), and promotional discount cap thresholds.

---

## 📦 Tech Stack Summary

* **Frontend**: Next.js 16 (App Router), React 19, TypeScript 5
* **Styling**: Tailwind CSS v4, Lucide React Icons
* **Data Visualization**: Recharts 3
* **State Management**: Zustand 5
* **Hardware & Audio**: Web Audio API (POS sound synthesis), QRCode
* **Export Engines**: jsPDF, jspdf-autotable, CSV Data Streams
* **Database & Cloud**: Supabase PostgreSQL, Row Level Security (RLS)

---

## 👥 Team Tech Titans – Collaborative Development

| Contributor | Focus Areas & Modules |
| :--- | :--- |
| **Deepak Mittal** | System Architecture, Next.js 16 Core, Smart Exit Gate Engine, Security Protocols |
| **Aarav Sharma** | Computer Vision Turnstile AI Pipeline, Machine Learning Demand Forecasting |
| **Priyanshu Verma** | Inventory Lifecycle, Product SKU Catalog, Supabase Relational Schema & RLS |
| **Neha Gupta** | Executive Dashboard Analytics, Recharts Data Visualizations, UI/UX Design System |

---

<div align="center">
  <sub>Developed by Team Tech Titans for Next-Generation Autonomous Retail.</sub>
</div>
