# CLAUDE.md — Karne ni Nanay (Carabao Meat Business System)

## Project overview

A daily operations management system for a carabao meat vendor. Replaces a physical notebook.
Tracks capital, credit sales, cash sales, purchases, entrails income, freezer stock, and produces
a daily reconciliation balance and profit summary.

The business sells **carabao meat only**. All item types are either meat cuts or entrails.

Owner-only app. No customer-facing interface.

---

## Tech stack

| Layer | Technology |
|---|---|
| Language | PHP 8.3 |
| Framework | Laravel 11 |
| Frontend | React 18 + Inertia.js |
| UI library | MUI v6 — `sx` prop only, no Tailwind |
| Database | MySQL 8 |
| Auth | Laravel Breeze |
| Permissions | Spatie Laravel Permission |
| Server | DigitalOcean VPS (Ubuntu) |
| Web server | Nginx |
| Process manager | Supervisor (queue workers) |
| Build tool | Vite |

### MUI v6 notes
- Use `Grid size={{ xs: 12, sm: 6 }}` — not the deprecated `xs` prop
- No Tailwind classes anywhere
- All styling via `sx` prop or `styled()`
- Use MUI `DatePicker` from `@mui/x-date-pickers` for all date inputs

### Inertia.js notes
- All pages are React components under `resources/js/Pages/`
- Shared data (auth user, flash messages) via `HandleInertiaRequests` middleware
- Use `router.post()` / `router.put()` / `router.delete()` for mutations
- Use `usePage().props` to access shared props

### Laravel notes
- Controllers are thin — business logic goes in Service classes under `app/Services/`
- Use Form Requests for validation
- All routes in `routes/web.php` — no API routes needed (Inertia handles everything)
- Use `DECIMAL(10,2)` for all monetary columns — never `float`
- All dates stored as `DATE` — time is irrelevant for this business
- Soft deletes (`deleted_at`) on all transaction tables

---

## Database schema

### Master / reference tables

```sql
cuts
  id              BIGINT UNSIGNED PK AUTO_INCREMENT
  name            VARCHAR(100)        -- e.g. pata, buto-buto, kalitiran, atay, bato
  type            ENUM('meat','entrails')
  created_at      TIMESTAMP
  updated_at      TIMESTAMP

suki
  id              BIGINT UNSIGNED PK AUTO_INCREMENT
  name            VARCHAR(150)
  contact         VARCHAR(100) NULL
  created_at      TIMESTAMP
  updated_at      TIMESTAMP

suppliers
  id              BIGINT UNSIGNED PK AUTO_INCREMENT
  name            VARCHAR(150)
  notes           TEXT NULL
  created_at      TIMESTAMP
  updated_at      TIMESTAMP
```

### Transaction tables

```sql
timbang_carabao                        -- one row per carabao per day
  id              BIGINT UNSIGNED PK
  date            DATE
  weight_kg       DECIMAL(8,2)         -- dress meat weight
  price_per_kg    DECIMAL(8,2)
  total           DECIMAL(10,2)        -- stored: weight_kg x price_per_kg
  notes           VARCHAR(255) NULL
  deleted_at      TIMESTAMP NULL
  created_at      TIMESTAMP
  updated_at      TIMESTAMP

hango_transactions                     -- purchase from market vendor (header)
  id              BIGINT UNSIGNED PK
  date            DATE
  supplier_name   VARCHAR(150) NULL    -- free text OR resolved from suppliers
  supplier_id     BIGINT UNSIGNED NULL FK → suppliers.id
  deleted_at      TIMESTAMP NULL
  created_at      TIMESTAMP
  updated_at      TIMESTAMP

hango_items                            -- line items under a hango transaction
  id              BIGINT UNSIGNED PK
  hango_transaction_id  BIGINT UNSIGNED FK → hango_transactions.id
  cut_id          BIGINT UNSIGNED FK → cuts.id
  kilo            DECIMAL(8,2)
  price_per_kilo  DECIMAL(8,2)
  total           DECIMAL(10,2)        -- stored: kilo x price_per_kilo
  deleted_at      TIMESTAMP NULL
  created_at      TIMESTAMP
  updated_at      TIMESTAMP

collectible_transactions               -- credit sale header
  id              BIGINT UNSIGNED PK
  date            DATE
  customer_name   VARCHAR(150) NULL    -- free text OR resolved from suki
  suki_id         BIGINT UNSIGNED NULL FK → suki.id
  deleted_at      TIMESTAMP NULL
  created_at      TIMESTAMP
  updated_at      TIMESTAMP

collectible_items                      -- line items under a collectible transaction
  id              BIGINT UNSIGNED PK
  collectible_transaction_id  BIGINT UNSIGNED FK → collectible_transactions.id
  cut_id          BIGINT UNSIGNED FK → cuts.id
  kilo            DECIMAL(8,2)
  price_per_kilo  DECIMAL(8,2)
  total           DECIMAL(10,2)
  deleted_at      TIMESTAMP NULL
  created_at      TIMESTAMP
  updated_at      TIMESTAMP

cash_sales_transactions                -- cash sale header (paid on the spot)
  id              BIGINT UNSIGNED PK
  date            DATE
  customer_name   VARCHAR(150) NULL
  suki_id         BIGINT UNSIGNED NULL FK → suki.id
  deleted_at      TIMESTAMP NULL
  created_at      TIMESTAMP
  updated_at      TIMESTAMP

cash_sales_items
  id              BIGINT UNSIGNED PK
  cash_sales_transaction_id  BIGINT UNSIGNED FK → cash_sales_transactions.id
  cut_id          BIGINT UNSIGNED FK → cuts.id
  kilo            DECIMAL(8,2)
  price_per_kilo  DECIMAL(8,2)
  total           DECIMAL(10,2)
  deleted_at      TIMESTAMP NULL
  created_at      TIMESTAMP
  updated_at      TIMESTAMP

entrails_sales                         -- single entry (no header/lines needed)
  id              BIGINT UNSIGNED PK
  date            DATE
  customer_name   VARCHAR(150) NULL
  suki_id         BIGINT UNSIGNED NULL FK → suki.id
  cut_id          BIGINT UNSIGNED FK → cuts.id  -- must be cuts.type = 'entrails'
  kilo            DECIMAL(8,2)
  price_per_kilo  DECIMAL(8,2)
  total           DECIMAL(10,2)
  payment_type    ENUM('cash','credit')
  deleted_at      TIMESTAMP NULL
  created_at      TIMESTAMP
  updated_at      TIMESTAMP

cash_received                          -- utang payments or any cash collected
  id              BIGINT UNSIGNED PK
  date            DATE
  name            VARCHAR(150) NULL
  suki_id         BIGINT UNSIGNED NULL FK → suki.id
  amount          DECIMAL(10,2)
  notes           VARCHAR(255) NULL    -- e.g. "payment for March 5"
  deleted_at      TIMESTAMP NULL
  created_at      TIMESTAMP
  updated_at      TIMESTAMP

cash_out                               -- expenses paid out
  id              BIGINT UNSIGNED PK
  date            DATE
  name            VARCHAR(150)         -- free text always
  amount          DECIMAL(10,2)
  notes           VARCHAR(255) NULL
  deleted_at      TIMESTAMP NULL
  created_at      TIMESTAMP
  updated_at      TIMESTAMP

freezer_in                             -- stock stored in freezer
  id              BIGINT UNSIGNED PK
  date            DATE
  cut_id          BIGINT UNSIGNED FK → cuts.id
  weight_kg       DECIMAL(8,2)
  deleted_at      TIMESTAMP NULL
  created_at      TIMESTAMP
  updated_at      TIMESTAMP

freezer_out                            -- stock pulled from freezer
  id              BIGINT UNSIGNED PK
  date            DATE
  cut_id          BIGINT UNSIGNED FK → cuts.id
  weight_kg       DECIMAL(8,2)
  deleted_at      TIMESTAMP NULL
  created_at      TIMESTAMP
  updated_at      TIMESTAMP

suki_tab_entries                       -- manual charge added to a suki's tab
  id              BIGINT UNSIGNED PK
  suki_id         BIGINT UNSIGNED FK → suki.id
  date            DATE
  description     VARCHAR(255)         -- free text e.g. "pata 2kg, buto 1kg"
  amount          DECIMAL(10,2)        -- positive = debt added
  deleted_at      TIMESTAMP NULL
  created_at      TIMESTAMP
  updated_at      TIMESTAMP

suki_payments                          -- payment recorded against a suki's tab
  id              BIGINT UNSIGNED PK
  suki_id         BIGINT UNSIGNED FK → suki.id
  date            DATE
  amount          DECIMAL(10,2)
  notes           VARCHAR(255) NULL    -- e.g. "partial", "2-week payment"
  deleted_at      TIMESTAMP NULL
  created_at      TIMESTAMP
  updated_at      TIMESTAMP
```

---

## Business logic

### Daily reconciliation formula

Answers: **does cash on hand match what it should be?**

```
CAPITAL SIDE (resources to account for):
  + timbang_carabao.total          SUM for the day
  + cash_received.amount           SUM for the day
  + hango_items.total              SUM for the day
  + freezer_out.weight_kg          x default price/kg, SUM for the day

LESS (settled / accounted for):
  - collectible_items.total        SUM for the day
  - freezer_in.weight_kg           x default price/kg, SUM for the day
  - cash_sales_items.total         SUM for the day
  - cash_out.amount                SUM for the day

= BALANCE
```

If balance equals physical cash on hand → day is balanced.
If not → something is missing or miscounted.

### Daily profit formula

Answers: **did she earn today?**

```
INCOME:
  + cash_sales_items.total         SUM for the day
  + collectible_items.total        SUM for the day  (sold today, paid later)
  + entrails_sales.total           SUM for the day  (zero cost = pure profit)

LESS COSTS:
  - timbang_carabao.total          SUM for the day
  - hango_items.total              SUM for the day
  - cash_out.amount                SUM for the day

= NET GAIN / LOSS
```

### Suki tab / ledger balance

```
  SUM(suki_tab_entries.amount WHERE suki_id = ?)
- SUM(suki_payments.amount    WHERE suki_id = ?)
= BALANCE OWED
```

The suki tab is **manually maintained** — independent of collectibles.
Collectibles is a daily operational record; the suki tab is the customer's personal debt notebook.

### Freezer stock balance (per cut)

```
  SUM(freezer_in.weight_kg  WHERE cut_id = ?)
- SUM(freezer_out.weight_kg WHERE cut_id = ?)
= CURRENT STOCK (kg)
```

### Freezer peso value

Freezer weight is converted to peso using `settings.default_meat_price_per_kg`.
Fall back to the most recent `timbang_carabao.price_per_kg` if setting is not configured.

### Notes on formulas

- `collectible_items` counts as income on the day sold, not when cash is received.
  Cash collection is a separate entry in `cash_received`.
- `entrails_sales` with `payment_type = 'credit'` are tracked in the suki tab separately —
  they do NOT auto-populate the suki tab. Owner manually adds to the tab.
- `timbang_carabao` is per carabao — multiple rows per day, all summed.
- All `total` columns are stored on save for historical accuracy (prices may change later).

---

## Pages and routes

| Page | Route | Notes |
|---|---|---|
| Dashboard | `/` | Today's running totals, quick-add buttons, date picker |
| Timbang carabao | `/timbang` | List + add/edit per carabao |
| Hango | `/hango` | List of transactions; `/hango/create`, `/hango/{id}` |
| Collectibles | `/collectibles` | List; `/collectibles/create`, `/collectibles/{id}` |
| Cash sales | `/cash-sales` | List; `/cash-sales/create`, `/cash-sales/{id}` |
| Entrails sales | `/entrails` | List + add/edit single entries |
| Cash received | `/cash-received` | List + add/edit |
| Cash out | `/cash-out` | List + add/edit |
| Freezer in | `/freezer-in` | List + add/edit |
| Freezer out | `/freezer-out` | List + add/edit |
| Freezer stock | `/freezer-stock` | Per-cut running balance view |
| Daily summary | `/summary` | Date-selectable reconciliation + profit |
| Suki list | `/suki` | Manage customers |
| Suki ledger | `/suki/{id}` | Tab entries + payments, running balance |
| Supplier list | `/suppliers` | Manage suppliers |
| Cuts list | `/cuts` | Manage meat cuts and entrails |
| Settings | `/settings` | Default meat price/kg, app config |

---

## UI / UX conventions

### Date navigation
- Every list page has a date picker (MUI `DatePicker`) defaulting to today
- Prev / Next day arrow buttons beside the picker for quick navigation
- All records filtered by selected date

### Name input (dual mode)
All customer and supplier name fields support two modes, toggled by a small switch:
- **Suki / supplier mode** — MUI `Autocomplete` from the relevant table
- **Free text mode** — plain `TextField` for one-off entries

When a suki is selected, `suki_id` is saved. When free text is used, only `customer_name` is saved.

### Header + items pattern
Used by: hango, collectibles, cash sales.

Flow:
1. Fill header (date + supplier/customer name) → save → get transaction ID
2. Add item rows dynamically (cut dropdown, kilo, price/kg, auto-computed total)
3. Running subtotal displayed at the bottom of the items list
4. Each item row has a delete button

### Cuts dropdown filtering
- Meat pages (hango, collectibles, cash sales) → show only `cuts.type = 'meat'`
- Entrails page → show only `cuts.type = 'entrails'`

### Computed totals
- `total = kilo × price_per_kilo` computed live on the frontend as user types
- Sent to backend on save; backend recomputes and validates before storing

### General
- All monetary displays: Philippine Peso `₱` prefix, 2 decimal places
- Mobile-friendly layout — owner uses phone in the market
- Confirmations before delete/void
- Soft delete only — no hard deletes on transaction data

---

## Suki ledger detail

The suki ledger mirrors her physical per-customer notebook.
It is **not** automatically linked to collectibles or entrails sales.
The owner manually adds charges and records payments.

### Add charge entry
Fields: date, description (free text), amount

### Record payment
Fields: date, amount, notes (partial, 2-week term, etc.)

### Display
- Entries grouped by date (newest first)
- Each row shows: date, description or "Payment", amount (+/−), running balance
- Total balance owed shown prominently at the top

---

## File structure (Laravel + Inertia)

```
app/
  Http/
    Controllers/
      TimbangCarabaoController.php
      HangoController.php
      CollectibleController.php
      CashSalesController.php
      EntrailsSalesController.php
      CashReceivedController.php
      CashOutController.php
      FreezerInController.php
      FreezerOutController.php
      SummaryController.php
      SukiController.php
      SukiTabController.php
      SupplierController.php
      CutController.php
      SettingsController.php
    Requests/               -- Form Request validation classes
  Services/
    DailySummaryService.php -- reconciliation + profit computation
    SukiLedgerService.php   -- running balance computation
    FreezerStockService.php -- per-cut balance computation

resources/js/
  Pages/
    Dashboard.jsx
    Timbang/
      Index.jsx
      Form.jsx
    Hango/
      Index.jsx
      Form.jsx         -- header + items
    Collectibles/
      Index.jsx
      Form.jsx         -- header + items
    CashSales/
      Index.jsx
      Form.jsx         -- header + items
    Entrails/
      Index.jsx
      Form.jsx
    CashReceived/
      Index.jsx
      Form.jsx
    CashOut/
      Index.jsx
      Form.jsx
    Freezer/
      InIndex.jsx
      OutIndex.jsx
      Stock.jsx
    Summary/
      Index.jsx
    Suki/
      Index.jsx
      Ledger.jsx
    Suppliers/
      Index.jsx
    Cuts/
      Index.jsx
    Settings/
      Index.jsx
  Components/
    DateNavigator.jsx    -- date picker + prev/next arrows
    NameInput.jsx        -- dual-mode suki/free-text input
    ItemsTable.jsx       -- reusable header+items line editor
    SummaryCard.jsx      -- reconciliation / profit display card
```

---

## Seed data

### Cuts — meat
| Name | Notes |
|---|---|
| Pata | Front/hind leg |
| Buto-buto | Bones with meat |
| Kalitiran | Chuck |
| Kalambre | Shoulder |
| Kenchi | Shank |
| Tadyang | Ribs |
| Lomo | Loin |
| Pigue | Hind leg (boneless) |
| Kasim | Front leg (boneless) |
| Ulo | Head |

### Cuts — entrails
| Name | Notes |
|---|---|
| Atay | Liver |
| Bato | Kidney |
| Isaw | Intestines |
| Tuwalya | Tripe |
| Puso | Heart |
| Utak | Brain |
| Dila | Tongue |

---

## Key constraints

- One codebase, one database per deployment — not multi-tenant
- All monetary values: `DECIMAL(10,2)` — never `float` or `double`
- All dates: `DATE` type — never `DATETIME` (time is irrelevant)
- Soft deletes on all transaction tables — never hard delete transaction data
- `total` columns always stored (not virtual) for historical accuracy
- No API routes — Inertia.js handles all frontend/backend communication
- Owner-only — no roles needed initially, single user auth via Breeze
