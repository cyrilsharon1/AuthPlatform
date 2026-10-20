# CV Foods Authentication and Ordering Demo

A React and TypeScript customer app for CV Foods. It includes account registration and sign in, demo password recovery, a 100-item Nigerian menu, a persistent shopping bag, pay-on-delivery demo checkout, and order history.

## Run locally

1. Install Node.js 20.19 or newer.
2. Run `npm install`.
3. Set `VITE_AUTH_MODE=mock` in `.env.local` for the no-backend demo (already configured for this project).
4. Run `npm run dev`.

Create an account, add dishes to the bag, continue to checkout, enter delivery details, and place a demo order. Sign out and back in with the same account to see its order history. Demo accounts, bag contents, reset links, and orders are stored in this browser using local storage. A demo password-reset link appears in the app because no email service is connected.

This is a front-end demonstration. It does not charge payment, send email, notify a restaurant, or provide live delivery updates. Do not use real passwords or customer data. For real customers, replace mock mode with a secure backend, database, email provider, and payment integration.

## Render static demo

`render.yaml` sets `VITE_AUTH_MODE=mock`, publishes `dist`, and rewrites application routes to `index.html`.

## Checks

- `npm run build` type-checks the app and builds production assets.
- `npm run lint` runs ESLint.
- `npm test` runs the unit tests.

## Backend API contract

When mock mode is disabled, the client expects an API at `VITE_API_BASE_URL`. It sends JSON with credentialed requests. Auth responses return `{ user: { id, fullName, email, emailVerified } }`; errors may return `{ message }`.

| Method | Endpoint | Request | Success |
| --- | --- | --- | --- |
| POST | `/auth/register` | `{ fullName, email, phone, password }` | `{ user }` plus session cookie |
| POST | `/auth/login` | `{ email, password, remember? }` | `{ user }` plus session cookie |
| POST | `/auth/logout` | empty | 204, clear session cookie |
| GET | `/auth/me` | empty | `{ user }` |
| POST | `/auth/forgot-password` | `{ email }` | generic 204 response |
| POST | `/auth/reset-password` | `{ token, password }` | 204 |
| POST | `/auth/verify-email` | `{ token }` | 204 |
| POST | `/auth/verify-email/resend` | `{ email }` | 204 |

A production backend must hash passwords, authorize access to orders, persist orders, expire sessions, issue single-use reset and verification tokens, throttle resend requests, protect cookie flows against CSRF, and configure credentialed CORS.
