# Simple 3-Tier Todo App

A full starter project using:
- React + Vite + TypeScript
- FastAPI
- PostgreSQL
- Docker Compose
- Adminer

## Project structure

- `frontend/` - React app
- `backend/` - FastAPI app
- `db/` - DB initialization SQL
- `docs/` - architecture and setup docs
- `docker-compose.yml` - local development stack

## Run locally

```bash
cp .env.example .env
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
docker compose up --build
```

Open:
- Frontend: `http://localhost:5173`
- Backend docs: `http://localhost:8000/docs`
- Backend health: `http://localhost:8000/health`
- Adminer: `http://localhost:8080`

## Fresh reset

Use this when you change the first migration or want a clean database.

```bash
docker compose down -v
docker compose up --build
```

## Adminer login

- System: `PostgreSQL`
- Server: `db`
- Username: value from root `.env` (`POSTGRES_USER`)
- Password: value from root `.env` (`POSTGRES_PASSWORD`)
- Database: value from root `.env` (`POSTGRES_DB`)

## Default sample values

Register with:
- Name: `Test User`
- Email: `testuser02@gmail.com`
- Password: `Test@12345`

## Notes

- Backend startup runs `alembic upgrade head` automatically.
- Email is normalized to lowercase.
- The project avoids fixed Docker `container_name` values to reduce naming conflicts.
