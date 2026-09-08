# Eventify — AI-Powered Event Booking Platform

A simple, production-oriented full-stack event discovery, booking, payment, and
management platform. Built to be **easy to understand, easy to explain in an
SDE-1 interview, and practical** — not over-engineered.

```
Next.js (frontend)  →  Express.js REST API (backend)  →  PostgreSQL
                              │                │
                          AWS S3          Razorpay
                        (event images)    (payments)
                              │
                            Groq
                       (AI assistant)
```

---

## 1. Tech Stack

| Layer      | Technology |
|------------|------------|
| Frontend   | Next.js (App Router), TypeScript, Tailwind CSS, shadcn/ui-style components, Axios, Zod |
| Backend    | Node.js, Express.js, TypeScript, JWT, bcrypt, `pg` (raw SQL), Zod |
| Database   | PostgreSQL (`schema.sql`, no ORM) |
| Storage    | AWS S3 (presigned URLs for event images) |
| Payments   | Razorpay (order creation + signature verification) |
| AI         | Groq API, called directly (no LangChain, no vector DB) |
| DevOps     | Docker, Docker Compose |

Intentionally **not** used: Prisma, Redis, BullMQ, TanStack Query, React Hook
Form, LangChain, vector databases, microservices, or complex RBAC libraries.
The goal is a codebase a fresher can fully understand and defend line by line.

---

## 2. Project Structure

```
eventify/
├── backend/
│   ├── src/
│   │   ├── controllers/   # Thin HTTP handlers — parse input, call services
│   │   ├── routes/        # Express routers, wired to middleware + controllers
│   │   ├── services/      # Business logic + SQL queries (via pg)
│   │   ├── middleware/    # authenticateUser, authorizeRole, error handler
│   │   ├── schemas/       # Zod request-validation schemas
│   │   ├── db/db.ts       # pg Pool + transaction helper
│   │   ├── utils/         # jwt, asyncHandler, apiResponse
│   │   ├── app.ts         # Express app (middleware, routes)
│   │   └── server.ts      # Entry point
│   ├── sql/schema.sql     # Full DDL (tables, constraints, indexes, triggers)
│   └── Dockerfile
├── frontend/
│   ├── app/                # Next.js App Router pages
│   │   ├── page.tsx         # Landing page
│   │   ├── events/          # Discovery + [id] details page
│   │   ├── dashboard/       # User dashboard
│   │   ├── organizer/       # Organizer dashboard + sub-pages
│   │   ├── admin/           # Admin dashboard + sub-pages
│   │   ├── login/ register/
│   │   └── booking/confirmation/[id]/
│   ├── components/         # Navbar, Footer, EventCard, AIAssistant, ui/*
│   ├── lib/                # api client, auth context, types
│   └── Dockerfile
├── docker-compose.yml
└── .env.example
```

---

## 3. Request Flow (how a request travels through the backend)

```
Route
  → authenticateUser   (verifies JWT, attaches req.user)
  → authorizeRole(...) (checks req.user.role)
  → Zod schema.parse() (validates & types the request body/query)
  → Controller         (thin — extracts input, calls a service, sends response)
  → Service            (business logic, talks to PostgreSQL via pg)
  → PostgreSQL
```

Every controller is wrapped in `asyncHandler`, so any thrown error (a Zod
`ZodError`, an `ApiError`, or an unexpected exception) is forwarded to the
single centralized `errorHandler` middleware — no repeated try/catch blocks.

---

## 4. Database

Four tables, plain SQL, no ORM: `users`, `events`, `bookings`, `payments`.
See [`backend/sql/schema.sql`](backend/sql/schema.sql) for the full DDL,
including foreign keys, `CHECK` constraints, indexes on frequently-filtered
columns (`email`, `category`, `location`, `event_date`), and `updated_at`
triggers.

**Booking safety.** Creating a booking runs inside a single PostgreSQL
transaction (`backend/src/services/booking.service.ts`):

1. `SELECT ... FOR UPDATE` locks the event row so two concurrent bookings
   can't both read the same "5 seats left" and oversell.
2. If enough seats exist, the booking is inserted as `PENDING` and
   `available_seats` is decremented in the same transaction.
3. If the Razorpay payment later fails or the signature check fails, the
   booking is marked `FAILED` and the seats are released back automatically.
4. A successful payment verification flips the booking to `CONFIRMED`.

This is the one place in the app where a transaction is required, and it's
kept simple and explicit rather than hidden behind an ORM.

---

## 5. Authentication & Authorization

- **Signup/Login**: email + password only (no OAuth), hashed with `bcrypt`.
- **JWT**: signed with `JWT_SECRET`, payload is just `{ id, role }`, sent both
  as an httpOnly cookie and returned in the response body (frontend keeps a
  copy in `localStorage` as a fallback for cross-origin API calls).
- **`authenticateUser` middleware**: reads the token from the `Authorization:
  Bearer <token>` header or the `token` cookie, verifies it, attaches the
  payload to `req.user`.
- **`authorizeRole(...roles)` middleware**: a simple allow-list check against
  `req.user.role`. No permission matrix, no policy engine — just
  `if (!roles.includes(req.user.role)) return 403`.

Roles: `USER`, `ORGANIZER`, `ADMIN`, stored directly on the `users` row.

---

## 6. Why `pg` instead of Prisma (and how to add Prisma later)

Raw SQL via `pg` keeps every query visible and explicit — useful for
understanding exactly what hits the database, and for an interview where
you're expected to explain your own queries. All queries live inside the
`services/` layer; controllers and routes never touch SQL directly.

Because of that separation, Prisma (or any ORM) can be introduced later by
rewriting only the *inside* of the service functions — swapping
`pool.query(...)` calls for `prisma.model.findMany(...)` — without touching
controllers, routes, middleware, or the frontend at all:

```
Before:  Controller → Service → pg      → PostgreSQL
After:   Controller → Service → Prisma  → PostgreSQL
```

---

## 7. Why Zod

Zod schemas (`backend/src/schemas/*.ts`) validate and type every request
before it reaches a controller. `schema.parse(req.body)` throws a `ZodError`
on invalid input, which the centralized error handler turns into a `400`
with field-level messages — so controllers can assume their input is already
valid and correctly typed, no manual `if (!req.body.name) ...` checks.

---

## 8. AI Assistant (Groq, no LangChain)

`backend/src/services/ai.service.ts` pulls up to 40 upcoming events straight
from PostgreSQL, serializes them into the system prompt, and calls the Groq
chat completions API directly. This is a deliberately simple
"retrieval" step (a SQL query, not a vector database) — good enough for a
catalog of this size, and easy to explain: *"the assistant only recommends
events that actually exist, because I hand it real database rows as
context."*

---

## 9. AWS S3 Image Uploads

Images never pass through the Express server. The flow:

```
Organizer picks a file
  → POST /api/uploads/presigned-url  { fileName, fileType }
  → Backend generates a presigned S3 PUT URL (5 min expiry)
  → Frontend PUTs the file directly to S3 using that URL
  → Frontend saves the resulting public URL on the event (POST /api/events)
```

---

## 10. Payments (Razorpay)

```
POST /api/bookings                 → creates a PENDING booking, reserves seats
POST /api/payments/create-order    → creates a Razorpay order for that booking
(Razorpay Checkout runs client-side)
POST /api/payments/verify          → verifies the HMAC-SHA256 signature,
                                      then marks the booking CONFIRMED
```

The signature is recomputed server-side from `order_id|payment_id` using
`RAZORPAY_KEY_SECRET` and compared to what the client sends — this is what
stops someone from calling `/verify` with a fabricated "success" payload.

---

## 11. API Reference

All responses share one shape:

```json
// success
{ "success": true, "data": { ... } }

// error
{ "success": false, "message": "Event not found" }
```

### Auth
| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/register` | — | `{ name, email, password, role }` |
| POST | `/api/auth/login` | — | `{ email, password }` |
| POST | `/api/auth/logout` | — | Clears the auth cookie |
| GET | `/api/auth/me` | ✅ | Current user profile |

### Events
| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/api/events` | — | Filters: `search, category, location, date, minPrice, maxPrice, sort, page, limit` |
| GET | `/api/events/:id` | — | Event + related events |
| POST | `/api/events` | Organizer | Create event |
| PUT | `/api/events/:id` | Organizer (owner) | Update event |
| DELETE | `/api/events/:id` | Organizer (owner) / Admin | Delete event |
| GET | `/api/events/organizer/my-events` | Organizer | Own events |
| GET | `/api/events/organizer/stats` | Organizer | Dashboard stats |
| GET | `/api/events/:eventId/bookings` | Organizer (owner) | Attendee list |

### Bookings
| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/api/bookings` | User | `{ eventId, tickets }` → PENDING booking |
| GET | `/api/bookings` | User | Own bookings |
| GET | `/api/bookings/:id` | User | Single booking |
| DELETE | `/api/bookings/:id` | User (owner) | Cancel a CONFIRMED booking |

### Payments
| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/api/payments/create-order` | User | `{ bookingId }` → Razorpay order |
| POST | `/api/payments/verify` | User | Verifies signature, confirms booking |

### AI
| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/api/ai/chat` | User | `{ message, history? }` → assistant reply |

### Uploads
| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/api/uploads/presigned-url` | Organizer/Admin | `{ fileName, fileType }` → S3 upload URL |

### Admin
| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/api/admin/stats` | Admin | Platform-wide totals |
| GET | `/api/admin/users` | Admin | Paginated users |
| GET | `/api/admin/events` | Admin | Paginated events |
| GET | `/api/admin/bookings` | Admin | Paginated bookings |
| DELETE | `/api/admin/events/:id` | Admin | Force-delete an event |

### Sample request/response

```http
POST /api/bookings
Authorization: Bearer <token>
Content-Type: application/json

{ "eventId": 12, "tickets": 2 }
```

```json
{
  "success": true,
  "data": {
    "id": 47,
    "user_id": 3,
    "event_id": 12,
    "tickets": 2,
    "total_amount": "1998.00",
    "status": "PENDING",
    "created_at": "2026-09-08T10:15:00.000Z"
  }
}
```

---

## 12. Running Locally

### Option A — Docker Compose (recommended)

```bash
cp .env.example .env      # fill in JWT_SECRET, AWS, Razorpay, Groq keys
docker compose up --build
```

- Frontend: http://localhost:3000
- Backend: http://localhost:5000
- Postgres: localhost:5432 (schema auto-applied on first boot)

### Option B — Manual

```bash
# Database
createdb eventify
psql eventify -f backend/sql/schema.sql

# Backend
cd backend
cp .env.example .env      # fill in DATABASE_URL, JWT_SECRET, etc.
npm install
npm run dev                # http://localhost:5000

# Frontend (new terminal)
cd frontend
cp .env.example .env.local
npm install
npm run dev                 # http://localhost:3000
```

A seed admin account is created by `schema.sql`:
`admin@eventify.com` / `Admin@123` (change this in any real deployment).

---

## 13. SDE-1 Interview Talking Points

If asked to walk through this project, a good narrative is:

1. **"I kept the architecture to one frontend, one backend, one database."**
   No microservices, no message queues — a REST API is enough at this scale,
   and it's easier to reason about and debug.
2. **"Validation happens before business logic."** Every route runs Zod
   validation before the controller, so a service function can trust its
   input is well-formed.
3. **"I used raw SQL through `pg` instead of an ORM"** — explain the tradeoff:
   full visibility into every query vs. more boilerplate, and how the service
   layer isolates that choice so it could be swapped for Prisma later.
4. **"Booking safety is the trickiest part."** Explain the `SELECT ... FOR
   UPDATE` transaction and why it prevents overselling seats under
   concurrent requests.
5. **"Payments are verified server-side, never trusted from the client."**
   Explain the HMAC signature check.
6. **"The AI assistant isn't a black box."** It's a normal LLM call with
   real database rows injected as context — no RAG framework needed at this
   scale.
7. **"Images go straight to S3."** The backend only ever hands out a
   presigned URL; it never proxies file bytes, which keeps the API stateless
   and fast.

---

## 14. Environment Variables

See `backend/.env.example`, `frontend/.env.example`, and root `.env.example`
for the full list. Never commit real secrets — all of the above are read
from the environment at runtime.
