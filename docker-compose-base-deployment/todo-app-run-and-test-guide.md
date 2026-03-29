# Simple 3-Tier Todo App — Run & Check Guide

## 1) Project overview

This project contains:

- **Frontend:** React + Vite
- **Backend:** FastAPI
- **Database:** PostgreSQL
- **Containers:** Docker Compose
- **DB UI:** Adminer

## 2) Prerequisites

Install these first:

- Docker
- Docker Compose

Check:

```bash
docker --version
docker compose version
```

## 3) Go to the project folder

```bash
cd /home/technonext/ANS__SAYEM/EXPERIMENT/todo
```

Then check the files:

```bash
ls
```

You should see:

- `frontend/`
- `backend/`
- `db/`
- `docker-compose.yml`
- `.env`

## 4) Run the application

### Normal run

```bash
docker compose up --build
```

### Run in background

```bash
docker compose up --build -d
```

## 5) Stop the application

```bash
docker compose down
```

### Stop and remove database volume

Use this when you want a fresh database:

```bash
docker compose down -v
```

## 6) Open the app

After startup, open these URLs:

- **Frontend:** http://localhost:5173
- **Backend Swagger Docs:** http://localhost:8000/docs
- **Backend OpenAPI JSON:** http://localhost:8000/openapi.json
- **Adminer:** http://localhost:8080

## 7) Check if containers are running

```bash
docker compose ps
```

Expected: `frontend`, `backend`, `db`, and `adminer` should be **Up**.

## 8) Check logs

### All logs

```bash
docker compose logs -f
```

### Backend only

```bash
docker compose logs -f backend
```

### Frontend only

```bash
docker compose logs -f frontend
```

### Database only

```bash
docker compose logs -f db
```

### Adminer only

```bash
docker compose logs -f adminer
```

## 9) What is normal and what is not

### Normal

These are usually fine:

- `VITE v6.x ready`
- `Uvicorn running on http://0.0.0.0:8000`
- `Application startup complete`
- `GET /docs 200 OK`
- `GET /openapi.json 200 OK`
- `GET / 404 Not Found` on backend root if `/` route is not defined

### Problem signs

These mean something is wrong:

- `500 Internal Server Error`
- `connection refused`
- `exited with code`
- `Permission denied`
- `column does not exist`
- `type already exists`
- `Mapper has no property`
- `npm ERR!`

## 10) Full functionality checklist

### A. Smoke test

- Open frontend
- Open Swagger docs
- Open Adminer

Pass if all pages load.

### B. Register test

Use this sample data:

- **Name:** Test User
- **Email:** testuser03@gmail.com
- **Password:** Test@12345

Expected:

- Registration succeeds
- No backend 500 error
- User can continue to login or dashboard

### C. Duplicate register test

Try to register again with the same email.

Expected:

- Friendly error message
- Duplicate account is blocked

### D. Login test

Login with the same account.

Expected:

- Login succeeds
- Dashboard opens
- User name is visible

### E. Invalid login test

Use a wrong password.

Expected:

- Login fails
- User stays on login page
- No crash

### F. Protected route test

Without logging in, open:

```text
http://localhost:5173/dashboard
```

Expected:

- Redirect to login
- Or access blocked

After login, dashboard should open normally.

### G. Create task test

Create a task with:

- **Title:** First Task
- **Description:** My first test task
- **Status:** Pending
- **Priority:** Medium

Expected:

- Task appears in the list
- Total Tasks becomes 1
- Pending becomes 1

Create a second task:

- **Title:** API Integration
- **Description:** Connect frontend and backend
- **Status:** In Progress
- **Priority:** High

Expected:

- Task appears
- In Progress count updates

### H. Validation test

Try creating a task with empty title.

Expected:

- Validation error
- Task is not created

### I. Filter test

Use the dashboard filters:

- ALL
- PENDING
- IN PROGRESS
- DONE

Expected:

- Each filter shows only matching tasks

### J. Update task test

Edit a task:

- Change title
- Change description
- Change status
- Change priority

Expected:

- Updated task appears immediately
- Stats update correctly

### K. Delete task test

Delete one task.

Expected:

- Task disappears
- Total count decreases
- Page refresh still shows it deleted

### L. Logout test

Click **Logout**.

Expected:

- Redirect to login
- Dashboard is no longer accessible

### M. Refresh persistence test

- Create tasks
- Refresh the page
- Close browser
- Open again
- Login again

Expected:

- Tasks still exist
- Data is loaded from database

## 11) Adminer database check

Open:

```text
http://localhost:8080
```

Use the DB connection values from your `.env` file.

Typical setup:

- **System:** PostgreSQL
- **Server:** db
- **Username:** postgres
- **Password:** postgres
- **Database:** todo_db

Then verify:

- `users` table contains registered users
- `tasks` table contains created tasks

## 12) API check in Swagger

Open:

```text
http://localhost:8000/docs
```

Check these endpoints:

- Auth register
- Auth login
- Auth me
- Create task
- Get tasks
- Update task
- Delete task

Expected:

- Endpoints load
- Request/response schema visible
- Calls work without server crash

## 13) Quick pass/fail sheet

```text
[ ] Frontend opens
[ ] Swagger docs open
[ ] Adminer opens
[ ] Register works
[ ] Duplicate register blocked
[ ] Login works
[ ] Wrong login blocked
[ ] Protected route works
[ ] Task create works
[ ] Empty title blocked
[ ] Task list loads
[ ] Filters work
[ ] Task update works
[ ] Task delete works
[ ] Stats update
[ ] Refresh keeps data
[ ] Logout works
[ ] DB rows match UI
[ ] No backend 500 errors
```

## 14) If something fails

### First check container status

```bash
docker compose ps
```

### Then check backend logs

```bash
docker compose logs -f backend
```

### Then check database logs

```bash
docker compose logs -f db
```

### Full reset if needed

```bash
docker compose down -v
docker compose up --build
```

## 15) Recommended final test flow

1. Register a new user
2. Login
3. Create 3 tasks
4. Set one as Pending
5. Set one as In Progress
6. Set one as Done
7. Test filters
8. Edit one task
9. Delete one task
10. Refresh the page
11. Logout
12. Login again

If all of that works, your application is in a very good state for local development testing.
