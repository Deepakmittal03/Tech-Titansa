# peNgo – Smart Retail Command Center

> **Enterprise B2B Retail SaaS & Self-Checkout Command Platform**  
> Built for Indian & Global Retail Chains with zero-friction cashierless checkouts, RFID/QR turnstile clearance, real-time telemetry, and heuristic fraud detection.

---

## 🌟 Executive Summary

**peNgo** reimagines high-throughput physical retail by eliminating checkout lines:
1. **Shoppers** use the peNgo mobile app to scan barcodes, view dynamic item totals with GST breakdown, redeem coupons, and pay through Razorpay/UPI.
2. Upon payment, the cloud backend mints a single-use cryptographic **Exit Pass QR**.
3. **Retail Operators** manage operations through the **peNgo Command Center**, tracking live telemetry, inventory depletion, shelf replenishment, and security clearance at store exit gates.

---

## 🚀 Key Modules & Capabilities

| Module | Route | Highlights |
|---|---|---|
| **Executive Overview** | `/dashboard` | Real-time KPIs, 8 analytical charts (Revenue, Category Pie, Velocity, Peak Hours, Multi-Store Comparison), recent orders & security watchlist. |
| **Smart Exit Verification** | `/exit-verification` | **Signature Feature**: Server-side single-use cryptographic pass validation. Live gate camera/laser simulator, green unlatch screen vs duplicate/tampered exit denial. |
| **Product Catalog** | `/products` | Add/Edit/Delete SKUs, EAN barcode uniqueness verification, MRP/Selling price/GST slab, dynamic QR pass generator, CSV bulk export. |
| **Category Taxonomy** | `/categories` | Department aisle structuring, shelf capacities, SKU counts and inventory valuations. |
| **Inventory & Warehouse** | `/inventory` | Real-time stock counts, status indicators (Healthy / Low Stock / Out of Stock), stock adjustment audit modal (In/Out/Damaged), inter-store transfers. |
| **Orders & Checkout** | `/orders` | Order lifecycle (Created → Payment Pending → Paid → Exit Verification → Completed), item breakdowns, digital tax invoices (printable & PDF export), and refunds. |
| **Customer CRM** | `/customers` | Shopper profiles, lifetime spending, average basket value, loyalty points and tier segmentation (VIP / Regular / New). |
| **Coupons & Campaigns** | `/coupons` | Percentage and flat discounts (e.g. `PENGO20`, `WELCOME50`), minimum cart values, maximum caps, redemption counters and validity windows. |
| **Financial Settlements** | `/payments` | UPI/Card/Wallet transactions, Razorpay gateway webhook verification, automated settlement reconciliation, and GST tax collection summaries. |
| **AI Business Intelligence** | `/ai-insights` | Predictive demand forecasting, slow-moving SKU detection, stockout danger warnings, and co-purchase basket affinity graph. |
| **Fraud & Security** | `/fraud-detection` | Detection of duplicate QR scans, rapid cart alterations prior to payment, barcode spoofing, and supervisor audit workflow. |
| **Multi-Store Management** | `/stores` | Multi-outlet administration across Delhi, Gurugram, Bengaluru and Mumbai. Instant context switcher in sidebar. |
| **Reports & Compliance** | `/reports` | Exportable Daily Sales, GST Tax Remittances, Inventory Audits, and Exit Pass logs in CSV and PDF. |
| **Notification Center** | `/notifications` | Live operational alerts for low stock triggers, duplicate pass presentations, and gateway settlements. |
| **System Settings** | `/settings` | Role-Based Access Control (RBAC) permission matrix, Razorpay keys, turnstile automation policies. |

---

## 🛠️ Technology Stack

- **Framework**: Next.js 16 (App Router, Turbopack, React 19)
- **Styling**: Tailwind CSS v4, custom peNgo brand tokens (`#DC2626` red, `#0F172A` deep navy)
- **UI Components**: Class-Variance-Authority (CVA), Sonner Toast notifications, custom modal and table primitives
- **Icons**: Lucide React
- **Analytics & Data Viz**: Recharts (Responsive Area, Bar, Pie, Multi-Line, and Grouped Bar charts)
- **QR Generation**: QRCode SVG/Canvas generator
- **PDF Generation**: jsPDF + jsPDF-AutoTable
- **State Management**: Zustand with persistent storage
- **Database / Cloud**: Supabase PostgreSQL + Stored Procedure (`supabase/schema.sql`)
- **Universal Data Layer**: Hybrid Data Store operating in-memory / LocalStorage out-of-the-box, syncing seamlessly to Supabase PostgreSQL when credentials are provided.

---

## ⚡ Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Run the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to access the console.

### 3. Production Build & Verification
```bash
npm run build
npm run start
```

---

## 🔑 Demo Access & Roles

The login page at `/login` includes a **1-Click Role Switcher** designed for judges, evaluators and demonstrations:

1. **Super Admin**: Full administrative authority over all outlets, settings, and staff.
2. **Store Owner**: Complete catalog, financial, order and multi-store insight.
3. **Store Manager**: Day-to-day catalog, customer and inventory operations.
4. **Inventory Manager**: Warehouse receipts, batch tracking, threshold alerts.
5. **Cashier / Exit Staff**: Dedicated gate scanner mode for customer QR pass validation.
6. **Business Analyst**: Financial reporting, AI demand forecasting, and GMV trends.

---

## 🔄 End-to-End Hackathon Demonstration Workflow

1. **Catalog Registration**:
   - Go to `/products` → Click **Add New SKU**.
   - Enter name, barcode (e.g. `8901234567890`), price (₹115), and GST slab (18%).
   - Click the QR icon to view the instant mobile-scannable pass.
2. **Real-Time Inventory**:
   - Go to `/inventory` to observe real-time batch numbers, healthy vs low stock indicators, and perform stock adjustments.
3. **Self-Checkout Simulation**:
   - Go to `/orders` to view customer mobile checkout orders transitioning through the lifecycle: `Created` → `Paid` → `Exit Verification`.
   - Click **Invoice** to view or export the official branded GST tax invoice as PDF.
4. **Smart Exit Gate Verification**:
   - Go to `/exit-verification`.
   - Click the **Unused Valid Pass (Order #9842)** test button → Click **Verify Pass**.
   - Watch the **Green Verified Screen** appear: gate turnstile unlatches, order marked as `Completed`, and inventory atomically decremented.
   - Click the **Already Used Pass (Order #9841)** test button → Watch the **Red Alert Screen** appear: repeated exit denied, security alert automatically routed to `/fraud-detection`.
5. **AI Intelligence & Reports**:
   - Visit `/ai-insights` to run neural inference for weekend demand forecasting.
   - Visit `/reports` to download audit-ready CSV spreadsheets and PDF reports.

---

## 🗄️ Database Schema & Supabase Setup

The complete PostgreSQL migration script is provided in `supabase/schema.sql`:
- 12 Relational Tables with Foreign Keys, Check Constraints, and Indexes.
- Stored Procedure `verify_and_burn_exit_pass(qr_token, staff_name)` providing ACID-transaction-safe single-use token burning and atomic stock deduction.
- Row-Level Security (RLS) policies for store-level multi-tenant isolation.
