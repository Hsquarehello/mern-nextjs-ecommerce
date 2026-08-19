# Ecommerce Backend

TypeScript Express API for the ecommerce application. It provides product catalog, authentication, payment-intent, order, and Stripe webhook endpoints backed by MongoDB.

## Stack

- Node.js and Express 5
- TypeScript
- MongoDB with Mongoose
- JWT in HTTP-only cookies
- Zod validation
- Stripe API and webhooks

## Prerequisites

- Node.js 18 or newer
- MongoDB, local or hosted
- Stripe test-mode credentials

## Setup

```bash
npm install
```

Create `backend/.env`:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/mern-ecommerce
JWT_SECRET=your_jwt_secret
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
NODE_ENV=development
ADMIN_SECRET_KEY=your_admin_secret_key
```

Do not commit this file or real secret values.

## Commands

```bash
npm run dev    # development server with watch mode
npm run build  # compile TypeScript
npm run seed   # insert demo products
```

The API starts at `http://localhost:5000` by default.

## API

All routes are prefixed with `/api`.

### Authentication

- `POST /auth/register` - register a user; use `role: "admin"` with the valid `adminSecretKey` to create an admin.
- `POST /auth/login` - log in and set the JWT cookie.
- `POST /auth/logout` - clear the JWT cookie.
- `GET /auth/me` - return the authenticated user's profile.

### Products

- `GET /products` - public list with optional `page`, `limit`, `category`, and `search` query parameters.
- `GET /products/:id` - public product detail.
- `POST /products` - create a product as an admin.
- `PUT /products/:id` - update a product as an admin.
- `DELETE /products/:id` - delete a product as an admin.

Product fields are `name`, `description`, `price`, `category`, `stock`, `imageUrl`, and `isFeatured`.

### Payments

- `POST /payment/create-payment-intent` - calculate the cart total and return a Stripe `clientSecret`.

The request can include `items`, `shippingAddress`, `customerEmail`, and `currency`. Each item supplies a price and quantity.

### Orders

- `POST /orders` - create an authenticated order.
- `GET /orders` - admin order list with optional `page`, `limit`, `status`, and `search` filters.
- `GET /orders/:id` - admin order detail.
- `PATCH /orders/:id/status` - admin status update. Valid statuses are `Processing`, `Shipped`, `Delivered`, and `Cancelled`.

### Stripe Webhook

- `POST /webhook` - verify `payment_intent.succeeded` events and create the corresponding paid order.

The webhook route is registered before JSON parsing and must receive Stripe's raw request body. Configure Stripe to send events to `http://localhost:5000/api/webhook` during local testing.

## Example Requests

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Jane Doe","email":"jane@example.com","password":"password123"}'

curl "http://localhost:5000/api/products?page=1&limit=8&search=shoe"
```

## Project Structure

```text
src/
├── app.ts              # Express configuration and route registration
├── server.ts           # Database connection and server startup
├── seed.ts             # Demo product seeding
├── config/             # Database configuration
├── controllers/        # Request handlers
├── middlewares/        # Auth and error handling
├── models/             # Mongoose models
├── routes/             # Feature routers
├── utils/              # Shared backend helpers
└── validations/        # Zod schemas
```

The sibling frontend expects this API at `http://localhost:5000` and sends credentials for cookie authentication.
