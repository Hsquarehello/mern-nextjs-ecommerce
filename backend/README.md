# MERN Ecommerce Backend

This is the Express + MongoDB backend for the MERN ecommerce application. It provides the REST API for products, authentication, orders, payment intent creation, and Stripe webhook handling.

## Tech Stack

- Node.js
- Express.js
- TypeScript
- MongoDB with Mongoose
- JWT authentication
- Stripe API
- Zod validation
- Cookie-based session handling

## Features

- Product listing and detail retrieval
- Product creation, update, and deletion
- User registration and login
- JWT auth with HTTP-only cookies
- Admin-only product management flow
- Stripe payment intent generation
- Order creation and payment webhook processing
- Seed script for demo product data

## Project Structure

```text
backend/
├── src/
│   ├── app.ts
│   ├── server.ts
│   ├── seed.ts
│   ├── config/
│   │   └── db.ts
│   ├── controllers/
│   │   ├── auth.controller.ts
│   │   ├── order.controller.ts
│   │   ├── payment.controller.ts
│   │   └── product.controller.ts
│   ├── middlewares/
│   │   ├── auth.middleware.ts
│   │   └── error.middleware.ts
│   ├── models/
│   │   ├── Order.ts
│   │   ├── Product.ts
│   │   └── User.ts
│   ├── routes/
│   │   ├── auth.ts
│   │   ├── order.ts
│   │   ├── payment.ts
│   │   ├── product.ts
│   │   └── webhook.ts
│   ├── utils/
│   │   ├── appError.ts
│   │   └── asyncHandler.ts
│   └── validations/
│       ├── auth.validation.ts
│       └── product.validation.ts
├── .env
├── .gitignore
├── package.json
├── tsconfig.json
└── README.md
```

## Prerequisites

Before starting the backend, make sure you have:

- Node.js 18 or newer
- MongoDB running locally or a valid MongoDB connection string
- Stripe account credentials for payment testing

## Environment Variables

Create a `.env` file in the `backend` folder with the following variables:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/mern-ecommerce
JWT_SECRET=your_jwt_secret
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
NODE_ENV=development
ADMIN_SECRET_KEY=your_admin_secret_key
```

> This project already includes a local `.env` file for development. Keep it private and do not commit secret values to version control.

## Installation

From the backend folder:

```bash
npm install
```

## Run the App

Start the development server:

```bash
npm run dev
```

This runs the app with TypeScript watch mode using `tsx`.

The server starts on:

```text
http://localhost:5000
```

## Build

```bash
npm run build
```

## Seed Demo Data

Populate the database with sample products:

```bash
npm run seed
```

This is useful for testing the storefront homepage and product listing features.

## API Endpoints

### Auth

- `POST /api/auth/register` — register a new user
- `POST /api/auth/login` — log in a user
- `POST /api/auth/logout` — log out and clear the auth cookie
- `GET /api/auth/me` — get the authenticated user profile

### Products

- `GET /api/products` — get all products with optional pagination/search filters
- `GET /api/products/:id` — get a single product
- `POST /api/products` — create a product
- `PUT /api/products/:id` — update a product
- `DELETE /api/products/:id` — delete a product

### Payments

- `POST /api/payment/create-payment-intent` — create a Stripe payment intent for cart items

### Orders

- `POST /api/orders` — create an order record

### Webhooks

- `POST /api/webhook` — Stripe webhook endpoint for successful payment events

## Example Requests

### Register a User

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "role": "user"
  }'
```

### Login

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Get Products

```bash
curl http://localhost:5000/api/products
```

## Notes

- The frontend connects to this API at `http://localhost:5000`.
- Authentication uses cookies with `httpOnly` and `sameSite: lax` for browser session handling.
- The Stripe webhook route must receive raw JSON payloads for signature verification.
- If the database or Stripe configuration is missing or invalid, the server will fail to start correctly.

## Scripts

```json
{
  "dev": "tsx watch src/server.ts",
  "build": "tsc",
  "seed": "tsx src/seed.ts"
}
```

## Related Frontend

This backend is designed to work with the frontend application in the sibling `frontend` folder. Start both projects together to run the full ecommerce app locally.
