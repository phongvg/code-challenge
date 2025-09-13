# Bookstore API

Backend server built with **ExpressJS**, **TypeScript**, **Prisma ORM**, and **MongoDB**.

---

## I.Features

- Create a new book.
- Retrieve a list of books (List) with filters:
  - Search by keyword (title, author).
  - Filter by author, status, year range.
  - Filter by tag (single or multiple).
  - Pagination (`page`, `limit`) and sorting (`sort`).
- Get a book by ID
- Update a book (Update).
- Delete a book (soft delete → change status to `INACTIVE`).

---

## II.Project Structure

src/
├─ constants/ # HTTP status codes, messages
├─ controllers/ # Request/response handlers
├─ libs/ # Prisma client connection
├─ middlewares/ # Error handler, validation, sanitize…
├─ models/ # Book interface
├─ routes/ # Route definitions
├─ schemas/ # Zod schemas for input validation
├─ services/ # Business logic (CRUD)
├─ utils/ # Helpers (normalize tags, parse sort…)
├─ index.ts # App initialization
├─ server.ts # Server startup

---

## III.Getting Started

### 1. Requirements

- Node.js >= 18
- Docker & Docker Compose

### 2. Clone & Install

```bash
git clone https://github.com/your-repo/bookstore-api.git
cd bookstore-api
npm install
docker-compose up -d
npm run db:push
npm run dev
```

---

## III. API Endpoints

POST /api/v1/books
Content-Type: application/json

{
"title": "Clean Code",
"author": "Robert C. Martin",
"year": 2008,
"status": "ACTIVE",
"tags": ["programming", "software"]
}

GET /api/v1/books?page=1&limit=10&q=code&status=ACTIVE&sort=-createdAt

GET /api/v1/books/:id

PATCH /api/v1/books/:id
Content-Type: application/json

{
"title": "Clean Code (Updated)"
}

DELETE /api/v1/books/:id
