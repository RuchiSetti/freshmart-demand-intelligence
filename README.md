# 🛒 FreshMart Demand Intelligence Platform

A full-stack retail intelligence dashboard built with Next.js 16, designed to help grocery store chains manage inventory, forecast demand, and keep shelves stocked — all in one place.

---

## What This Is

FreshMart is an internal operations tool for a fictional grocery retail chain with 25 store locations across India. The platform gives store managers and regional directors a real-time view into sales performance, stock levels, and demand trends — without needing to dig through spreadsheets or wait for end-of-week reports.

Think of it as the command center for a mid-to-large retail operation: you walk in, see what's running low, what's selling fast, which store is crushing it this week, and what needs attention before it becomes a problem.

---

## Features at a Glance

**Dashboard** — A personalized welcome screen that greets the manager by name, shows today's sales vs. target, forecast accuracy, stockout risk, and a breakdown of top-performing stores across the network.

**Products Inventory** — Browse all 17+ products across Dairy, Produce, Bakery, and Pantry categories. Filter by category or stock status, search by name, and click any product for a detailed modal showing a 7-day demand forecast, demand driver breakdown, and stock level visualization.

**Alerts & Notifications** — A live alerts feed sorted by severity (critical, warning, info). Cards are color-coded and dismissible. The header bell icon opens a slide-out notification panel with mark-as-read and clear-all functionality.

**Insights & Analytics** — Weekly performance charts, a demand heatmap by category and day, a category performance scatter plot, and an "Opportunities" section that surfaces revenue growth ideas with estimated impact.

**Analytics Page** — Forecast accuracy trends over time, sales distribution by category (pie chart), and key performance metrics like inventory turnover and waste reduction.

**Settings** — Full store profile management, notification preferences per alert type, auto-reorder configuration, and security options. All backed by local state (no API calls needed to explore).

**Store Selector** — The sidebar includes a dropdown to switch between all 25 Indian city stores, updating every dashboard metric in real time.

**Profile Panel** — Slide-out panel showing manager info, performance summary, and quick links to Store Settings and Inventory Preferences — each with their own dedicated panels.

---

## Tech Stack

| Layer | Choice | Why |
|---|---|---|
| Framework | Next.js 16 (App Router) | File-based routing, RSC support, fast builds |
| Language | TypeScript | Type safety across the entire codebase |
| Styling | Tailwind CSS v4 | Utility-first, fast iteration |
| UI Components | shadcn/ui + Radix UI | Accessible, unstyled primitives |
| Charts | Recharts | Flexible, React-native charting |
| Icons | Lucide React | Consistent, clean icon set |
| State | React Context + useState | Lightweight, no external store needed |
| Analytics | Vercel Analytics | Zero-config page view tracking |
| Fonts | Geist (Next.js native) | Clean, modern sans-serif |

---

## Project Structure

```
├── app/
│   ├── dashboard/          # Main dashboard page
│   ├── products/           # Product inventory grid + modals
│   ├── alerts/             # Alert management
│   ├── insights/           # Deep analytics + heatmap
│   ├── analytics/          # Charts and performance metrics
│   ├── settings/           # Store config and preferences
│   ├── login/              # Admin login page
│   ├── layout.tsx          # Root layout with providers
│   └── globals.css         # Theme variables + base styles
│
├── components/
│   ├── app-layout.tsx      # Sidebar + header shell
│   ├── product-card.tsx    # Individual product card with sparkline
│   ├── product-detail-modal.tsx  # Full product deep-dive
│   ├── notification-panel.tsx    # Slide-out notifications
│   ├── profile-panel.tsx         # Slide-out user profile
│   ├── inventory-preferences.tsx # Category-level inventory config
│   ├── store-settings.tsx        # Store operational settings
│   ├── home-page.tsx             # Public landing page
│   ├── admin-login.tsx           # Login form with validation
│   └── ui/                       # shadcn/ui component library
│
├── lib/
│   ├── data.ts             # All mock data, types, and interfaces
│   ├── store-context.tsx   # Global store state (React Context)
│   └── utils.ts            # cn() helper + currency formatter
│
└── hooks/
    ├── use-mobile.ts
    └── use-toast.ts
```

---

## Getting Started

**Prerequisites:** Node.js 20.9.0 or higher, npm or pnpm.

```bash
# Clone the repo
git clone https://github.com/your-username/freshmart-dashboard.git
cd freshmart-dashboard

# Install dependencies
npm install

# Start the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and you'll land on the public homepage. Hit **Admin Login** and use:

```
Email:    admin@freshmart.com
Password: admin123
```

That drops you straight into the dashboard for the Hyderabad Central store.

---

## Available Scripts

```bash
npm run dev      # Local dev server at localhost:3000
npm run build    # Production build
npm run start    # Serve the production build
npm run lint     # ESLint check
```

---

## The Data Layer

Everything runs on mock data defined in `lib/data.ts`. There's no database or external API — the app is entirely self-contained and works offline.

Here's what's included:

- **25 stores** across India (Hyderabad, Mumbai, Delhi, Bengaluru, Chennai, and more), each with real metrics like forecast accuracy, stockout rates, sales targets, and staff counts
- **17 products** across 4 categories, complete with current/required stock levels, demand trend arrays (for sparklines), pricing, turnover rates, and risk badges
- **Mock alerts** covering stockout risks, demand spikes, and informational notices
- **Mock notifications** with read/unread state and type-based styling
- **Category heatmap data** showing demand by day of week
- **Inventory preferences** with per-category thresholds and auto-reorder config

The `StoreProvider` wraps the whole app and makes the currently selected store available anywhere via `useStore()`. Switching stores in the sidebar immediately updates all dashboard figures.

---

## Design Decisions

**Theme:** The app uses a warm, earthy color palette inspired by fresh produce and natural grocery aesthetics — deep forest green (`#2d5016`) as the primary, burnt orange (`#e67e22`) as the accent, and off-white backgrounds. The sidebar stays dark green while the main content area stays light, creating a clear visual hierarchy.

**Dark mode quirk:** The `.dark` class in `globals.css` is actually overridden to use the light grocery theme — this was an intentional design choice so the app feels warm and retail-appropriate rather than techy-dark.

**Sparklines on product cards:** Each product card renders a tiny inline SVG chart using raw path calculations — no extra chart library needed for these. They update based on the `demandTrend` array in the product data.

**Slide-out panels:** Notifications, profile, store settings, and inventory preferences all use fixed-position slide-in panels rather than modals — keeps the main content visible and feels more like a native app sidebar.

---

## Key Components Worth Knowing

`AppLayout` — The main shell. Handles the sidebar (with store selector and nav), the top header (with notification bell and profile avatar), mobile toggle, and renders child page content in the scrollable main area.

`ProductCard` — Renders a single product tile with category badge, image, stock progress bar, price/turnover stats, an inline sparkline chart, and a status badge. Clicking opens the detail modal.

`ProductDetailModal` — A Dialog component that shows a product's full stats: a Recharts line chart for 7-day demand forecast, a horizontal bar breakdown of demand drivers (base demand, weekend boost, seasonal, promotional), and metadata chips.

`InventoryPreferencesPanel` — A comprehensive settings panel for per-store inventory rules. Covers low stock thresholds, auto-reorder triggers, supplier preferences, delivery frequency, overstock protection, and category-level rules for each of the 6 product categories.

---

## Roadmap / What's Not Built Yet

A few things are wired up visually but don't persist beyond the session:

- **Save Settings** — The settings page UI is complete but saving writes to local React state only (no localStorage or API)
- **Real auth** — Login validates against a hardcoded credential; no JWT or session management
- **Search** on the products page filters the visible list but doesn't persist across navigation
- **Alert dismiss** state resets on page refresh

If you're extending this into a real product, the natural next steps would be hooking up a backend (Supabase or a REST API), adding proper auth (NextAuth.js works well here), and replacing the mock data with live database queries.

---

## Customizing the Theme

All CSS variables live in `app/globals.css` under the `.dark` selector (yes, even though it's a light theme — see the design note above). To change the brand colors:

```css
.dark {
  --primary: #2d5016;      /* sidebar, primary buttons */
  --accent: #e67e22;       /* highlights, badges, rings */
  --background: #faf8f6;   /* main content area */
  --sidebar: #2d5016;      /* sidebar background */
}
```

---

## Adding a New Store

Open `lib/data.ts` and add an entry to the `mockStores` array:

```typescript
{
  id: 'store-26',
  name: 'FreshMart Surat West',
  city: 'Surat',
  region: 'West',
  status: 'online',
  salesTarget: 45000,
  actualSales: 47200,
  forecastAccuracy: 93.1,
  stockoutRate: 1.2,
  overstockRate: 1.8,
  averageStock: 86,
  topProduct: 'Organic Milk',
  staffCount: 24,
  lastUpdated: new Date(),
  managerName: 'Priya Mehta',
  managerPhone: '+91-9876543235',
}
```

It'll automatically appear in the sidebar dropdown and get included in all network-wide calculations.

---

## Adding a New Product

In `lib/data.ts`, add to `mockProducts`:

```typescript
{
  id: '18',
  name: 'Alphonso Mangoes - 1kg',
  category: 'Produce',
  image: 'https://images.unsplash.com/photo-...?w=400&h=400&fit=crop',
  currentStock: 120,
  requiredStock: 200,
  status: 'attention',
  trend: 'up',
  demandTrend: [80, 95, 110, 125, 140, 130, 120],
  price: 5.49,
  turnoverRate: 13.2,
}
```

It'll show up on the Products page immediately with a working sparkline, stock bar, and clickable detail modal.

---

## License

MIT — use it, fork it, ship it. No attribution required, though it's always appreciated.

---

## Acknowledgments

Built with [Next.js](https://nextjs.org), [shadcn/ui](https://ui.shadcn.com), [Recharts](https://recharts.org), and [Tailwind CSS](https://tailwindcss.com). Product images sourced from [Unsplash](https://unsplash.com). Icons by [Lucide](https://lucide.dev).