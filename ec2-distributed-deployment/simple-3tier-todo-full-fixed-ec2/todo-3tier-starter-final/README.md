# Simple 3-Tier Todo App — Full Fixed Project + EC2 Deployment Pack

This zip contains the **full working project source** and the **EC2 distributed deployment files**.

It fixes the issues that came up earlier:
- Full backend source is included (`requirements.txt`, `app/`, `alembic/`, `scripts/`)
- EC2 Dockerfiles are included for frontend and backend
- Distributed deployment compose files are included for **frontend**, **backend**, and **db**
- Backend `.env.example` now uses placeholders that match the recommended deployment flow
- `DATABASE_URL` examples use `%40` for passwords containing `@`
- Nginx templates are included for frontend reverse proxying to backend
- Python cache files and stale `.env` files were removed from the package

## Project structure

- `frontend/` — React + Vite app
- `backend/` — FastAPI + Alembic + PostgreSQL backend
- `db/` — database init scripts for local run
- `deploy/ec2/public-ip/` — easiest first EC2 deployment mode
- `deploy/ec2/private/` — best-practice EC2 deployment mode
- `frontend/nginx/` — Nginx templates for frontend reverse proxy
- `scripts/` — Docker install helpers
- `docs/` — runbooks and troubleshooting

## Recommended order

### 1) Local run (optional)
Run the app locally first if you want to verify the codebase:

```bash
cp .env.example .env
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env

docker compose up --build
```

### 2) EC2 public-IP mode first
Use this first because it is easier to debug.

- Browser -> frontend **public IP**
- Frontend -> backend **private IP**
- Backend -> DB **private IP**

### 3) EC2 private mode second
Move backend and db to private subnets after public-IP mode works.

## Important deployment note

For inter-service communication, prefer **private IPs**:
- frontend Nginx `proxy_pass` -> backend **private IP**
- backend `DB_HOST` / `DATABASE_URL` -> db **private IP**

That way, if public IPs change after stop/start, your internal app traffic still works.

## EC2 files you will use

### DB server
- `deploy/ec2/public-ip/db/docker-compose.yml`
- `deploy/ec2/public-ip/db/.env.example`

### Backend server
- `deploy/ec2/public-ip/backend/docker-compose.yml`
- `deploy/ec2/public-ip/backend/.env.example`
- `backend/Dockerfile.ec2`
- `backend/scripts/start-ec2.sh`
- `backend/scripts/wait-for-db.sh`

### Frontend server
- `deploy/ec2/public-ip/frontend/docker-compose.yml`
- `deploy/ec2/public-ip/frontend/.env.example`
- `frontend/Dockerfile.ec2`
- `frontend/nginx/nginx.public.template`
- `frontend/nginx/nginx.private.template`

## Quick verification checklist

- DB host listens on `5432`
- Backend can `nc -vz <DB_PRIVATE_IP> 5432`
- Backend `curl http://localhost:8000/health`
- Frontend `curl http://localhost`
- Browser can open `http://<FRONTEND_PUBLIC_IP>`
- Register / login / create task / update / delete all work

## Read next

- `docs/01-overview.md`
- `docs/02-mode-public-ip.md`
- `docs/03-mode-private-best-practice.md`
- `docs/04-troubleshooting.md`
