# Project Specification

## 1. Overview

This project is a full-stack ecommerce application developed as a monorepo with separate backend and frontend applications. The solution supports browsing products, authenticating users, managing cart data, initiating Stripe payments, and administrating catalog products.

The application is intended to demonstrate a modern MERN-based architecture with secure API conventions and a polished storefront UI.

## 2. Goals

- Provide a product catalog storefront for customers
- Enable user registration and login
- Safely protect admin functionality
- Support order creation and Stripe checkout
- Provide a clean frontend experience with reusable UI components
- Offer a scalable backend API with validation and error handling

## 3. Scope

### In Scope

- Product listing and filtering
- Product CRUD operations for admins
- Auth flow for users and admins
- Cart and checkout experience
- Stripe payment intent integration
- Database seeding for demo products
- API and UI error handling

### Out of Scope

- Advanced analytics dashboards
- Real multi-tenant marketplace features
- Deployment infrastructure configuration
- Payment refunds and subscriptions beyond basics
- Social login or third-party auth providers

## 4. Architecture

### Backend

The backend is an Express.js API written in TypeScript. It exposes REST endpoints and uses Mongoose models for MongoDB persistence.

Core responsibilities:

- database connection and environment configuration
- authentication and authorization
- validation using Zod
- product management
- payment intent creation using Stripe
- webhook handling for payment success events
- centralized error middleware

### Frontend

The frontend is a Next.js application using the App Router. It communicates with the backend via Axios and manages app state through React context providers.

Core responsibilities:

- product browsing and display
- login and registration forms
- stateful cart behavior
- Stripe checkout UI
- admin dashboard for catalog management

## 5. Functional Requirements

### 5.1 Product Catalog

- Users can view a homepage listing of products.
- Products can be filtered or searched using backend query parameters.
- Products can be created, edited, and deleted by admin users.
- Product data includes name, description, price, stock, category, images, and featured flag.

### 5.2 Authentication

- New users can register with name, email, and password.
- Existing users can log in using email and password.
- JWT tokens are stored in HTTP-only cookies.
- Logged-in users can fetch their own profile.
- Admin users can be created by providing a valid admin secret key.

### 5.3 Checkout and Payments

- Users can add products to a cart.
- The frontend creates a Stripe payment intent through the backend.
- The backend calculates the total amount from cart items.
- Successful payments are processed via Stripe webhooks.
- Orders are stored in MongoDB after successful payment confirmation.

### 5.4 Admin Operations

- Admin users can access product management pages.
- Admin users can add new products.
- Admin users can update existing products.
- Admin users can remove products.

## 6. Non-Functional Requirements

### Performance

- Product requests should respond quickly for typical storefront usage.
- Database queries should use pagination and filtering where appropriate.

### Security

- API routes must validate request data.
- Authenticated routes must verify tokens before accessing protected resources.
- Sensitive values such as secret keys must remain in environment variables.
- Stripe webhook payloads must be verified using signature checks.

### Maintainability

- Code should be split logically into controllers, routes, models, and middleware.
- Shared types and validation logic should be reused across frontend/backend boundaries where possible.
- TypeScript should be used for safer development and clearer contracts.

## 7. Data Model

### User

- name
- email
- password
- role
- createdAt
- updatedAt

### Product

- name
- description
- price
- category
- stock
- images
- isFeatured
- createdAt
- updatedAt

### Order

- paymentIntentId
- amount
- currency
- status
- customerEmail
- items
- createdAt
- updatedAt

## 8. API Contract Summary

### Authentication

- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/auth/me`

### Products

- `GET /api/products`
- `GET /api/products/:id`
- `POST /api/products`
- `PUT /api/products/:id`
- `DELETE /api/products/:id`

### Payments

- `POST /api/payment/create-payment-intent`

### Orders

- `POST /api/orders`

### Webhooks

- `POST /api/webhook`

## 9. Frontend User Journeys

### Customer Journey

1. User visits home page.
2. User browses product cards.
3. User adds products to cart.
4. User proceeds to checkout.
5. User completes payment with Stripe.
6. User sees a success page.

### Admin Journey

1. Admin logs in.
2. Admin opens dashboard.
3. Admin creates, edits, or deletes products.
4. Product list updates in the UI.

## 10. Acceptance Criteria

- The backend starts successfully when MongoDB and environment variables are configured.
- The frontend loads product data from the backend API.
- Users can register and log in successfully.
- Admins can manage products through the dashboard.
- Stripe payment intents can be created for cart data.
- Webhook events can update order records after successful payments.
- The app runs locally with both backend and frontend services started.

## 11. Risks and Constraints

- Local MongoDB must be available for development.
- Stripe secrets must stay private and not be committed to source control.
- Cookie-based auth requires correct CORS and credentials configuration between frontend and backend.
- Webhook verification depends on the correct `STRIPE_WEBHOOK_SECRET` value.

## 12. Implementation Notes

- Use a Node.js backend and a Next.js frontend in the same repository.
- Keep backend routes modular and organized around features.
- Use validation at the API boundary to prevent malformed data.
- Use global error handling for consistent API responses.
- Keep frontend state management lightweight and focused on auth and cart functionality.

## 13. Deliverables

- Backend API service
- Frontend storefront application
- Seed script for demo product data
- Environment variable documentation
- Root documentation and project specification
