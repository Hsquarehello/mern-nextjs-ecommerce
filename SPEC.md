# Project Specification

## 1. Overview

MERN Ecommerce is a monorepo containing a TypeScript Express API and a Next.js storefront. Customers can browse products, authenticate, manage a cart, and pay through Stripe. Administrators can manage products and review and update orders.

## 2. Goals

- Provide a searchable, paginated product storefront.
- Support secure user and admin authentication with HTTP-only JWT cookies.
- Provide a Stripe payment-intent checkout flow.
- Persist paid orders from verified Stripe webhook events.
- Give administrators product and order management workflows.
- Keep API validation, error handling, and feature boundaries explicit.

## 3. Scope

### In Scope

- Public product listing, search, category filtering, pagination, and detail pages
- User registration, login, logout, and current-user lookup
- User and admin roles, including admin registration using a server-side secret
- Cart and shipping-address checkout
- Stripe payment intents and verified payment webhooks
- Order creation, admin listing, detail lookup, filtering, search, pagination, and status updates
- Admin product create, read, update, and delete operations
- Seed data for local development

### Out of Scope

- Analytics and reporting dashboards
- Multi-vendor marketplace behavior
- Deployment and infrastructure configuration
- Refunds, subscriptions, and advanced payment workflows
- Social login and external identity providers

## 4. Architecture

### Backend

The backend is an Express 5 REST API written in TypeScript. It uses Mongoose for MongoDB persistence, Zod at validation boundaries, cookie-based JWT authentication, and centralized async/error handling. Stripe webhook routes are registered before `express.json()` so their raw request body remains available for signature verification.

### Frontend

The frontend is a Next.js 16 App Router application. Axios communicates with the API, while React context manages authentication and cart state. Reusable UI primitives and feature components support the storefront, checkout, and admin dashboard.

## 5. Functional Requirements

### 5.1 Product Catalog

- Anyone can retrieve products and individual product details.
- Product listing accepts optional `page`, `limit`, `category`, and `search` query parameters.
- Product responses include `data`, `total`, `page`, `limit`, and `totalPages`.
- Products contain `name`, `description`, `price`, `category`, `stock`, `imageUrl`, and `isFeatured`.
- Admin users can create, edit, and delete products through the dashboard.

### 5.2 Authentication

- Registration requires name, email, and password.
- Registration defaults to the `user` role.
- Admin registration additionally requires the server-side `ADMIN_SECRET_KEY`.
- Login and registration issue a JWT in an HTTP-only cookie valid for seven days.
- Logout clears the authentication cookie.
- `GET /api/auth/me` returns the authenticated user's id, name, email, and role.

### 5.3 Checkout and Payments

- Users can add products to a client-side cart and provide shipping information.
- The frontend sends cart items, shipping address, email, and currency to the payment endpoint.
- The backend calculates the total from item price and quantity and returns a Stripe client secret.
- Stripe `payment_intent.succeeded` events are verified with `STRIPE_WEBHOOK_SECRET`.
- A verified successful event creates one paid order, guarded by the unique payment intent id.

### 5.4 Orders

- Authenticated checkout can create an order record through `POST /api/orders`.
- Admins can list orders with `page`, `limit`, `status`, and `search` filters.
- Admins can inspect an order and update its status.
- Order statuses are `Processing`, `Shipped`, `Delivered`, and `Cancelled`.

### 5.5 Admin Operations

- Admin users can access product and order dashboard routes.
- Product mutation and order administration endpoints must enforce authenticated admin access.
- The UI must show useful loading, empty, validation, and API error states.

## 6. Data Model

### User

`name`, `email`, `password`, `role` (`user` or `admin`), `createdAt`, `updatedAt`

### Product

`name`, `description`, `price`, `category`, `stock`, `imageUrl`, `isFeatured`, `createdAt`, `updatedAt`

### Order

`user`, `paymentIntentId`, `amount`, `currency`, `paymentStatus`, `orderStatus`, `customerEmail`, `shippingAddress`, `items`, `createdAt`, `updatedAt`

Order item fields are `product`, `name`, `price`, `quantity`, and `imageUrl`. Shipping address fields are `fullName`, `address`, `city`, `postalCode`, and `phone`.

## 7. API Contract Summary

| Method | Path                                 | Access                  | Purpose                         |
| ------ | ------------------------------------ | ----------------------- | ------------------------------- |
| POST   | `/api/auth/register`                 | Public                  | Register and issue auth cookie  |
| POST   | `/api/auth/login`                    | Public                  | Log in and issue auth cookie    |
| POST   | `/api/auth/logout`                   | Public                  | Clear auth cookie               |
| GET    | `/api/auth/me`                       | Authenticated           | Return current user             |
| GET    | `/api/products`                      | Public                  | List filtered products          |
| GET    | `/api/products/:id`                  | Public                  | Get one product                 |
| POST   | `/api/products`                      | Admin                   | Create product                  |
| PUT    | `/api/products/:id`                  | Admin                   | Update product                  |
| DELETE | `/api/products/:id`                  | Admin                   | Delete product                  |
| POST   | `/api/payment/create-payment-intent` | Public or authenticated | Create Stripe client secret     |
| POST   | `/api/orders`                        | Authenticated           | Create an order                 |
| GET    | `/api/orders`                        | Admin                   | List orders                     |
| GET    | `/api/orders/:id`                    | Admin                   | Get order details               |
| PATCH  | `/api/orders/:id/status`             | Admin                   | Update order status             |
| POST   | `/api/webhook`                       | Stripe                  | Process verified payment events |

## 8. Local Acceptance Criteria

- MongoDB and required environment variables allow the backend to build and start.
- Seed data appears in the storefront after running `npm run seed`.
- Customers can register, log in, browse, search, filter, and paginate products.
- Admins can manage products and view, filter, search, paginate, and update orders.
- Checkout returns a Stripe client secret for a non-empty cart.
- A verified successful Stripe webhook creates one paid order per payment intent.
- Both services run locally at ports 5000 and 3000 by default.

## 9. Constraints

- Never commit MongoDB, JWT, Stripe, or admin secret values.
- Cookie auth requires frontend/backend CORS and credential configuration to match.
- Stripe webhook requests must retain their raw JSON body.
- Product and order administration must remain restricted to admin users.

## 10. Deliverables

- Backend API service
- Next.js storefront and admin dashboard
- Seed script with demo products
- Environment variable documentation
- Root README, application READMEs, and this specification
