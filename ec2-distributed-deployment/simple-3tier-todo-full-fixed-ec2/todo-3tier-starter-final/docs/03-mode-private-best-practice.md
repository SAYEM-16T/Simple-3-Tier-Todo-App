# Mode 2 — Best-practice direction (frontend public, backend and DB private)

Use this after mode 1 works.

## Topology

- Frontend EC2: public subnet
- Backend EC2: private subnet
- DB EC2: private subnet
- Optional bastion host OR SSM for access to private instances

Connections:

- Browser -> Frontend public IP or ALB
- Frontend -> Backend private IP:8000
- Backend -> DB private IP:5432

## Network expectations

- Frontend subnet route table includes internet gateway route
- Backend and DB subnets do not expose public internet directly
- If backend/private servers need to pull packages/images directly, use NAT gateway or pre-baked AMIs

## Security groups

### frontend-sg
Inbound:
- 22 from your IP only
- 80 from `0.0.0.0/0`
- 443 optional from `0.0.0.0/0`

Outbound:
- allow to backend-sg on 8000

### backend-sg
Inbound:
- 8000 from frontend-sg
- 22 from bastion/SSM path only if needed

Outbound:
- 5432 to db-sg

### db-sg
Inbound:
- 5432 from backend-sg
- no public access

## Files to use

- DB server:
  - `deploy/ec2/private/db/.env.example` -> copy as `.env`
  - `deploy/ec2/private/db/docker-compose.yml`

- Backend server:
  - `deploy/ec2/private/backend/.env.example` -> copy as `.env`
  - `deploy/ec2/private/backend/docker-compose.yml`

- Frontend server:
  - `deploy/ec2/private/frontend/.env.example` -> copy as `.env`
  - `frontend/nginx/nginx.private.template` -> copy as `deploy/ec2/private/frontend/nginx.conf`
  - `deploy/ec2/private/frontend/docker-compose.yml`

## Deployment steps

### 1) Start DB on private DB server

```bash
cd /opt/apps/simple-3tier-todo-app/deploy/ec2/private/db
cp .env.example .env
nano .env

docker compose up -d
docker compose ps
docker compose logs -f
```

### 2) Start backend on private backend server

```bash
cd /opt/apps/simple-3tier-todo-app/deploy/ec2/private/backend
cp .env.example .env
nano .env

docker compose up -d --build
docker compose ps
docker compose logs -f
curl http://localhost:8000/health
```

### 3) Start frontend on public frontend server

```bash
cd /opt/apps/simple-3tier-todo-app
cp frontend/nginx/nginx.private.template deploy/ec2/private/frontend/nginx.conf
nano deploy/ec2/private/frontend/nginx.conf
# replace BACKEND_HOST with backend private IP

cd deploy/ec2/private/frontend
cp .env.example .env
nano .env

docker compose up -d --build
docker compose ps
docker compose logs -f
curl http://localhost
```

## Final test
Open:

```text
http://<FRONTEND_PUBLIC_IP>
```

Then verify:
- page loads
- register/login works
- backend logs show requests
- DB logs show normal connections
