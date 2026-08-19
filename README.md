# MERN Ecommerce

Full-stack ecommerce application with a TypeScript Express API, MongoDB persistence, Stripe payments, and a Next.js storefront with an admin dashboard.

## Applications

- `backend/` - Express API, MongoDB models, authentication, product and order operations, Stripe payment intents, and webhook processing.
- `frontend/` - Next.js App Router storefront, authentication screens, cart and checkout flow, and admin product and order dashboards.

## Tech Stack

### Backend

- Node.js and Express 5
- TypeScript
- MongoDB with Mongoose
- JWT authentication in HTTP-only cookies
- Zod request validation
- Stripe API and webhooks

### Frontend

- Next.js 16 with the App Router
- React 19 and TypeScript
- Tailwind CSS and shadcn/ui components
- Axios for API requests
- Stripe Elements for checkout

## Prerequisites

- Node.js 18 or newer
- npm
- MongoDB, local or hosted
- Stripe test-mode API keys

## Quick Start

1. Start MongoDB.
2. Configure `backend/.env` and `frontend/.env.local` using the examples below.
3. Install and start the backend:

   ```bash
   cd backend
   npm install
   npm run seed
   npm run dev
   ```

4. In a second terminal, install and start the frontend:

   ```bash
   cd frontend
   npm install
   npm run dev
   ```

Open `http://localhost:3000`. The API is available at `http://localhost:5000`.

## Environment Variables

### `backend/.env`

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/mern-ecommerce
JWT_SECRET=your_jwt_secret
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
NODE_ENV=development
ADMIN_SECRET_KEY=your_admin_secret_key
```

### `frontend/.env.local`

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
```

Keep secret values out of source control. The frontend and backend must use matching hosts and cookie/CORS settings for authentication to work.

## Features

- Public product catalog with category filtering, name search, and pagination
- User registration, login, logout, and current-user lookup
- JWT cookie authentication with user and admin roles
- Cart and Stripe payment-intent checkout
- Stripe webhook handling that creates paid orders idempotently
- Admin product creation, editing, and deletion screens
- Admin order list, order detail, filtering, search, pagination, and status updates
- Seed data for local product browsing

## Frontend Routes

- `/` - storefront
- `/login` and `/register` - authentication
- `/products/[id]` - product detail
- `/checkout` - cart and checkout
- `/success` - payment success
- `/dashboard/products` - admin product list
- `/dashboard/products/new` - create a product
- `/dashboard/products/[id]/edit` - edit a product
- `/dashboard/orders` - admin order list
- `/dashboard/orders/[id]` - admin order detail and status management

## Backend API

All API routes are prefixed with `/api`.

- Auth: `POST /auth/register`, `POST /auth/login`, `POST /auth/logout`, `GET /auth/me`
- Products: `GET /products`, `GET /products/:id`, `POST /products`, `PUT /products/:id`, `DELETE /products/:id`
- Payments: `POST /payment/create-payment-intent`
- Orders: `POST /orders`, `GET /orders`, `GET /orders/:id`, `PATCH /orders/:id/status`
- Stripe webhook: `POST /webhook`

Product reads are public. Product mutations and order administration are admin operations and require the authenticated admin cookie in the intended application flow. The webhook requires Stripe's raw request body and a valid signature.

## Development Commands

Backend:

```bash
npm run dev
npm run build
npm run seed
```

Frontend:

```bash
npm run dev
npm run build
npm run start
npm run lint
```

See [backend/README.md](backend/README.md), [frontend/README.md](frontend/README.md), and [SPEC.md](SPEC.md) for application-specific details.
