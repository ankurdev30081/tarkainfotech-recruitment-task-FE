# Advanced Expense Tracker

Track expenses by category. Next.js frontend + FastAPI backend + SQLite database.

**Prerequisites:** Node.js 20+, Python 3.10+, SQLite 3

---

## Backend (FastAPI)

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate          # Windows: .venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

The API runs at **http://localhost:8000**.

Run the tests with `pytest`.

## Swagger (API docs)

- Swagger UI: **http://localhost:8000/docs**: open an endpoint, click **Try it out**, then **Execute**
- ReDoc: http://localhost:8000/redoc
- OpenAPI JSON: http://localhost:8000/openapi.json

## Frontend (Next.js)

Start the backend first. Then, in a new terminal:

```bash
cd frontend
npm install
npm run dev
```

Open **http://localhost:3000**.

Run the tests with `npm test`.

## Database (SQLite)

The database file is `backend/expenses.db`. It is created automatically the first time the backend starts.

Open it from the `backend` folder:

```bash
sqlite3 expenses.db
```

Useful commands inside the SQLite shell:

```sql
.headers on
.mode column
.tables                      -- list tables
SELECT * FROM categories;
SELECT * FROM expenses;
.quit
```

Or use a GUI such as [DB Browser for SQLite](https://sqlitebrowser.org/) and open `backend/expenses.db`.

To start with an empty database, stop the backend, delete `expenses.db`, and start the backend again.

## Configuration (optional)

| Variable | Where | Default |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | frontend | `http://localhost:8000` |
| `CORS_ORIGINS` | backend (comma-separated) | `http://localhost:3000` |
| `DATABASE_PATH` | backend | `expenses.db` |

If the frontend runs on a different port, add that origin to `CORS_ORIGINS`, for example:
`CORS_ORIGINS=http://localhost:3000,http://localhost:3001 uvicorn app.main:app --reload`
