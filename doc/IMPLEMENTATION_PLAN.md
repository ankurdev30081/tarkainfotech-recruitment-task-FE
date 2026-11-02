# Advanced Expense Tracker with Categories — Implementation Plan

Reference: `Interview_Task_Expense_Tracker.pdf`

## Scope (agreed)
- Only the 5 endpoints defined in the PDF (no update/delete).
- Frontend tests: Vitest + React Testing Library.

## Folder Structure
```
Advanced Expense Tracker/
├── backend/    FastAPI + SQLite
└── frontend/   Next.js + TypeScript + Tailwind + TanStack Query + Redux Toolkit
```

## Backend (FastAPI + SQLite)

### Database (Python built-in `sqlite3`, file `expenses.db`)
- `categories (id INTEGER PRIMARY KEY, name TEXT NOT NULL UNIQUE)`
- `expenses (id INTEGER PRIMARY KEY, title TEXT NOT NULL, amount NUMERIC NOT NULL, category_id INTEGER NOT NULL, created_at DATETIME NOT NULL, FOREIGN KEY (category_id) REFERENCES categories(id))`

### API
| Method | Path | Description |
|---|---|---|
| POST | `/categories` | Create category → `{id, name}`; duplicate name → 409 |
| GET | `/categories` | List categories with `total_expenses` |
| POST | `/expenses` | Create expense → `{id, title, amount, category_id, created_at}`; unknown category → 400 |
| GET | `/expenses` | List expenses with `category` name and `created_at` |
| GET | `/summary` | `{total, count, average}` |

### Validation (PDF constraints)
- Category must exist before creating an expense.
- Title / category name cannot be empty (whitespace trimmed).
- Amount must be positive.
- Invalid input → clear JSON error (`422` validation, `400` / `409` business errors).

### Files
- `app/main.py` – app, CORS, routes
- `app/database.py` – connection + table creation
- `app/schemas.py` – Pydantic request/response models
- `tests/test_api.py` – pytest tests (isolated temp DB)
- Swagger UI: `http://localhost:8000/docs`

## Frontend (Next.js App Router)

### State
- **TanStack Query** – server data (categories, expenses, summary). Mutations invalidate queries so the UI refreshes after every action.
- **Redux Toolkit** – client form state for the expense form (title, amount, category).

### Components
- Reusable UI: `Button`, `Input`, `Select`, `Card`
- `CategorySection` – input to create a category + list of categories (with expense count)
- `ExpenseForm` – title, amount, category dropdown, submit
- `ExpenseList` – title, amount, category name, date
- `SummarySection` – total amount, total count, average

### Files
- `src/lib/api.ts` – typed API client
- `src/hooks/` – TanStack Query hooks
- `src/store/` – Redux store + expense form slice
- `src/components/` – UI + feature components
- `src/__tests__/` – Vitest tests

## Steps
1. ✅ Read PDF requirements
2. ✅ Write this plan
3. ✅ Backend implementation with SQLite
4. ✅ Backend tests (pytest)
5. ✅ Frontend API integration
6. ✅ Frontend UI
7. ✅ Frontend tests (Vitest)
8. ✅ End-to-end verification and fixes

## Running
- Backend setup (once): `cd backend && python3 -m venv --system-site-packages .venv && .venv/bin/pip install -r requirements.txt`
- Backend: `cd backend && .venv/bin/python -m uvicorn app.main:app --reload` → Swagger at http://localhost:8000/docs
- Frontend: `cd frontend && npm run dev` → http://localhost:3000 (API URL configurable via `NEXT_PUBLIC_API_URL`)
- Backend allowed origins configurable via `CORS_ORIGINS` (default `http://localhost:3000`)

## Tests
- Backend: `cd backend && .venv/bin/pytest`
- Frontend: `cd frontend && npm test`
