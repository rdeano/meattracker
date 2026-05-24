# Karne ni Nanay 🥩

Daily operations management system for a carabao meat vendor. Replaces a physical notebook with a mobile-friendly web app for tracking capital, sales, purchases, freezer stock, and producing a daily reconciliation and profit summary.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Language | PHP 8.3 |
| Framework | Laravel 11 |
| Frontend | React 18 + Inertia.js |
| UI Library | MUI v6 |
| Database | MySQL 8 |
| Auth | Laravel Breeze |
| Build Tool | Vite |

---

## Features

- **Dashboard** — Full day overview with quick-add for every transaction type; date-navigable
- **Timbang Carabao** — Log carabao purchases by weight and price/kg
- **Hango** — Record purchases from market vendors with itemized cut breakdown
- **Collectibles** — Credit sales to suki customers with optional auto-sync to their tab
- **Cash Sales** — Walk-in / cash-on-the-spot sales with itemized cuts
- **Entrails Sales** — Track liver, kidney, tripe and other by-products (cash or credit)
- **Cash Received** — Record debt payments and other cash collections
- **Cash Out** — Log expenses and disbursements
- **Freezer In / Out** — Track stock entering and leaving the freezer by cut
- **Freezer Stock** — Running balance per cut with peso value; view individual entries or totals
- **Daily Summary** — Reconciliation balance and net profit/loss for any date
- **Suki Ledger** — Per-customer debt notebook with charge entries, payments, and running balance
- **Suppliers / Cuts / Settings** — Master data management

---

## Business Logic

### Daily Reconciliation (Balance)
```
+ Timbang total (carabao purchases)
+ Cash received
+ Hango total (market purchases)
+ Freezer out value
─────────────────────────────────
- Collectibles total (credit sales)
- Freezer in value
- Cash sales total
- Cash out total
= BALANCE  (should equal physical cash on hand)
```

### Daily Profit
```
+ Cash sales total
+ Collectibles total  (earned today, collected later)
+ Entrails sales total  (zero-cost by-products = pure profit)
─────────────────────────────────
- Timbang total
- Hango total
- Cash out total
= NET GAIN / LOSS
```

### Suki Tab Balance
```
SUM(tab entries) − SUM(payments) = BALANCE OWED
```

### Freezer Stock (per cut)
```
SUM(freezer_in.weight_kg) − SUM(freezer_out.weight_kg) = CURRENT STOCK
```

---

## Local Development

### Requirements
- PHP 8.3+
- Composer
- Node.js 20+
- MySQL 8

### Setup

```bash
# Clone and install dependencies
composer install
npm install

# Configure environment
cp .env.example .env
php artisan key:generate

# Set DB credentials in .env, then migrate and seed
php artisan migrate --seed

# Build frontend
npm run build

# Or run Vite dev server
npm run dev
```

### Running the App

With [Laragon](https://laragon.org/) (recommended on Windows), the app is served automatically. Otherwise:

```bash
php artisan serve
```

---

## Database

All monetary values use `DECIMAL(10,2)` — never `float`. All dates use `DATE` type. All transaction tables use soft deletes (`deleted_at`). Stored `total` columns are computed on save for historical accuracy (prices may change later).

Key tables: `timbang_carabao`, `hango_transactions`, `hango_items`, `collectible_transactions`, `collectible_items`, `cash_sales_transactions`, `cash_sales_items`, `entrails_sales`, `cash_received`, `cash_out`, `freezer_in`, `freezer_out`, `suki`, `suki_tab_entries`, `suki_payments`, `suppliers`, `cuts`, `settings`.

---

## Project Structure

```
app/
  Http/Controllers/    — Thin controllers, one per resource
  Services/            — Business logic (DailySummaryService, SukiLedgerService, FreezerStockService)
  Models/              — Eloquent models

resources/js/
  Pages/               — Inertia page components (React)
  Components/          — Shared components (DateNavigator, NameInput)
  Layouts/             — AppLayout (sidebar nav + flash messages)
```

---

## Notes

- Owner-only app — single user, no roles needed
- All routes use Inertia (no API endpoints)
- Mobile-first layout — owner uses phone in the market
- Collectibles can include both meat cuts and entrails (sukis buy both together)
- Entrails sales are informational in the profit summary — zero cost, pure margin
- The suki tab is manually maintained and independent of the collectibles ledger
