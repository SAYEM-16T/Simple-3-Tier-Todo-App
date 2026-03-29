# Overview

## Goal
Run the same app you already tested locally, but distributed across 3 EC2 instances:

- 1 EC2 for frontend
- 1 EC2 for backend
- 1 EC2 for PostgreSQL

Each EC2 runs Docker and its own Compose file.

## Important idea
Do **not** try to control all three EC2 instances from a single Docker Compose command.
Instead:

- run the DB compose on the DB server
- run the backend compose on the backend server
- run the frontend compose on the frontend server

## Repo setup on each server
Clone the same repo on all three EC2 instances.

Example:

```bash
sudo mkdir -p /opt/apps
sudo chown -R $USER:$USER /opt/apps
cd /opt/apps
git clone <YOUR_GIT_REPO_URL> simple-3tier-todo-app
cd simple-3tier-todo-app
```

## Docker install check

```bash
docker --version
docker compose version
```

## Run order

Always start in this order:

1. DB
2. Backend
3. Frontend

## Common health checks

### DB server

```bash
docker compose -f deploy/ec2/public-ip/db/docker-compose.yml ps
```

### Backend server

```bash
curl http://localhost:8000/health
```

### Frontend server

```bash
curl http://localhost
```

## Important ports

- Frontend: `80`
- Backend: `8000`
- DB: `5432`
