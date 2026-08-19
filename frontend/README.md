# Ecommerce Frontend

Next.js 16 storefront and admin dashboard for the ecommerce application. It consumes the sibling Express API for products, authentication, payments, and orders.

## Stack

- Next.js 16 App Router
- React 19 and TypeScript
- Tailwind CSS and shadcn/ui
- Axios
- Stripe Elements
- React Hook Form and Zod

## Prerequisites

- Node.js 18 or newer
- npm
- Backend running at `http://localhost:5000`
- MongoDB connected through the backend

## Setup

```bash
npm install
```

Create `frontend/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
```

Update `NEXT_PUBLIC_API_URL` if the API uses a different host or port.

## Commands

```bash
npm run dev    # development server
npm run build  # production build
npm run start  # serve the production build
npm run lint   # ESLint
```

Open `http://localhost:3000` after starting the development server.

## Routes

### Customer

- `/` - product storefront
- `/products/[id]` - product detail
- `/login` - login
- `/register` - registration
- `/checkout` - cart and Stripe checkout
- `/success` - successful payment confirmation

### Admin

- `/dashboard/products` - product list and management actions
- `/dashboard/products/new` - create a product
- `/dashboard/products/[id]/edit` - edit a product
- `/dashboard/orders` - searchable, filterable, paginated order list
- `/dashboard/orders/[id]` - order detail and status management

Admin pages require an authenticated admin account. Registering an admin also requires the server-side admin secret configured in the backend.

## Application Areas

- `app/` - App Router pages and layouts
- `components/` - shared, storefront, checkout, and dashboard components
- `context/` - auth and cart providers
- `hooks/` - reusable client hooks
- `lib/` - utilities and validation helpers
- `types/` - frontend TypeScript types

## Backend

Start the API in a separate terminal:

```bash
cd ../backend
npm install
npm run seed
npm run dev
```

The seed command adds demo products for the storefront. Cookie authentication depends on the frontend and backend running on the configured hosts and allowing credentials.

## Troubleshooting

- Empty product pages: confirm MongoDB is running, seed data exists, and `NEXT_PUBLIC_API_URL` is correct.
- Failed login or admin pages: confirm the API is running and browser cookies are allowed for the configured frontend/backend hosts.
- Checkout errors: confirm both Stripe publishable and secret keys are configured and that the backend webhook secret matches Stripe.

See the repository [README.md](../README.md) and [SPEC.md](../SPEC.md) for the complete application overview and API contract.
