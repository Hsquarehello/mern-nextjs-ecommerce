# MERN Store Frontend

This is the Next.js frontend for the MERN ecommerce application. It handles the customer storefront, login/register flow, cart, Stripe checkout, and the admin product dashboard.

## Tech Stack

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS
- Shadcn UI components
- Axios for API requests
- Stripe for checkout payments

## Project Structure

- `app/` — route pages using the App Router
- `components/` — reusable UI and feature components
- `context/` — auth and cart state
- `lib/` — validation helpers and utility functions
- `types/` — shared TypeScript types

## Main Features

- Product catalog homepage
- User authentication with login/register
- Cart and checkout flow
- Stripe payment success page
- Admin dashboard for products
- Dynamic product creation and editing

## Prerequisites

Before starting the frontend, make sure the backend is running and MongoDB is connected.

- Node.js 18+
- npm
- Backend API running on `http://localhost:5000`

## Environment Variables

Create a `.env.local` file inside this folder with the following values:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key_here
```

If the backend runs on a different port or host, update `NEXT_PUBLIC_API_URL` accordingly.

## Installation

From the `frontend` directory:

```bash
npm install
```

## Run the App

Start the development server:

```bash
npm run dev
```

Then open:

```text
http://localhost:3000
```

## Useful Commands

```bash
npm run dev
npm run build
npm run start
npm run lint
```

## Related Backend Setup

The frontend depends on the backend API. In a separate terminal, run:

```bash
cd ../backend
npm install
npm run dev
npm run seed
```

The seed script populates product data so the homepage can display items.

## Routes

- `/` — home page with products
- `/login` — login page
- `/register` — register page
- `/checkout` — cart and checkout
- `/success` — Stripe payment success page
- `/dashboard/products` — admin product list
- `/dashboard/products/new` — create product
- `/dashboard/products/[id]/edit` — edit product

## Notes

- The app uses the backend cookie-based auth flow, so credentials and session management must be enabled in the backend.
- Stripe keys are required for the checkout experience to work properly.
- If products do not load, confirm the backend is running and the API URL is correct.
