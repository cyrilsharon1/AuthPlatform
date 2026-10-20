# CV Foods Authentication Platform

Responsive React and TypeScript authentication UI using Redux Toolkit, React Router, React Hook Form, Zod, and a cookie based API adapter.

## Run locally

1. Install Node.js 20.19 or newer.
2. Run `npm install`.
3. Copy `.env.example` to `.env.local` and set `VITE_API_BASE_URL`.
4. Run `npm run dev`.

Set `VITE_AUTH_MODE=mock` in `.env.local` to explore the interface without a backend. Demo mode auto-verifies registrations because it does not send email, stores demo accounts in the current browser tab session, and requires the same email and password used during registration. This client-side demo is not secure production authentication. Do not use real passwords or deploy it for real users.

## Checks

- `npm run build` — type-checks app and Vite config, then builds production assets.
- `npm run lint` — ESLint.
- `npm test` — validation, auth state, and password visibility tests.

## Backend API contract

All paths are relative to `VITE_API_BASE_URL`. The client sends JSON with `credentials: include`. Auth responses return `{ user: { id, fullName, email, emailVerified } }`; errors may return `{ message }`.

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

The backend must hash passwords, enforce authorization, expire sessions, issue single-use expiring reset and verification tokens, throttle resend requests, protect cookie flows against CSRF, and configure credentialed CORS. The frontend stores no passwords or session tokens in Redux or browser storage.

Dashboard menu and order panels are previews and are not connected to ordering services. Food photography loads from Unsplash.

## Project map

- `src/app`: Redux store and typed hooks.
- `src/features/auth`: service, slice, types, and validation.
- `src/components`: shared form, layout, and routing UI.
- `src/pages`: authentication flows and protected dashboard.
- `src/styles`: palette tokens and responsive styles.


