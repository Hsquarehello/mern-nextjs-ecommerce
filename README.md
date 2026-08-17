# MERN Ecommerce Project

This repository contains a full-stack ecommerce application built with the MERN stack:

- MongoDB
- Express.js
- React
- Node.js

The project is split into two main parts:

- `backend/` — Express API, MongoDB models, auth, Stripe integration, and seed data
- `frontend/` — Next.js storefront and admin dashboard

## Tech Stack

### Backend

- Node.js
- Express.js
- TypeScript
- MongoDB + Mongoose
- JWT + cookie auth
- Stripe API
- Zod validation

### Frontend

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS
- Shadcn UI
- Axios

## Project Structure

```text
mern-ecommerce/
├── backend/
│   ├── src/
│   ├── .env
│   ├── package.json
│   ├── tsconfig.json
│   └── README.md
├── frontend/
│   ├── app/
│   ├── components/
│   ├── context/
│   ├── lib/
│   ├── public/
│   ├── .env.local
│   ├── package.json
│   ├── tsconfig.json
│   └── README.md
├── README.md
├── SPEC.md
└── .git/
```

## Features

- Product catalog homepage
- Product creation, update, and deletion in admin panel
- User registration and login
- JWT authentication with cookies
- Cart and checkout flow
- Stripe payment intent generation
- Payment success page
- Webhook-based order creation for successful Stripe payments
- Seed script for sample product dataset

## Requirements

Before running the project, make sure you have:

- Node.js 18+
- npm
- MongoDB running locally
- Stripe test keys for payment testing

## Quick Start

### 1. Start the backend

```bash
cd backend
npm install
npm run dev
```

The backend runs on:

```text
http://localhost:5000
```

### 2. Start the frontend

```bash
cd frontend
npm install
npm run dev
```

The frontend runs on:

```text
http://localhost:3000
```

### 3. Seed demo data

```bash
cd backend
npm run seed
```

This adds sample products so the storefront has content.

## Environment Files

### Backend

The backend uses a `.env` file with values such as:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/mern-ecommerce
JWT_SECRET=your_jwt_secret
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_webhook_secret
NODE_ENV=development
ADMIN_SECRET_KEY=your_admin_secret_key
```

### Frontend

The frontend uses `.env.local` for client-side variables:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
```

## Main Routes

### Frontend

- `/` — storefront homepage
- `/login` — login page
- `/register` — registration page
- `/checkout` — cart and checkout
- `/success` — payment success page
- `/dashboard/products` — admin product list
- `/dashboard/products/new` — create product
- `/dashboard/products/[id]/edit` — edit product

### Backend API

- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/auth/me`
- `GET /api/products`
- `GET /api/products/:id`
- `POST /api/products`
- `PUT /api/products/:id`
- `DELETE /api/products/:id`
- `POST /api/payment/create-payment-intent`
- `POST /api/orders`
- `POST /api/webhook`

## Notes

- The frontend depends on the backend running on port 5000.
- Auth uses cookies, so the frontend must be allowed to send credentials to the backend.
- Stripe webhook verification requires raw JSON payload handling and a valid webhook secret.
- The project is designed for local development and demo usage.

## Recommended Development Flow

1. Run MongoDB.
2. Start the backend.
3. Run the seed script.
4. Start the frontend.
5. Log in or register a user.
6. Browse products, add to cart, and complete checkout with Stripe.

## Related Docs

- [backend/README.md](backend/README.md)
- [frontend/README.md](frontend/README.md)
