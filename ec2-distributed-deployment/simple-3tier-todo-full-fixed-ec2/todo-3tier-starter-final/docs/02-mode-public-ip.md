# Mode 1 — Public IP first

Use this first because it is easier to debug.

## Topology

- Frontend EC2: public IP
- Backend EC2: public IP
- DB EC2: public IP

Connections:

- Browser -> Frontend public IP
- Frontend -> Backend public IP:8000
- Backend -> DB public IP:5432

## Security groups

### frontend-sg
Inbound:
- 22 from your IP only
- 80 from `0.0.0.0/0`
- 443 optional from `0.0.0.0/0`

### backend-sg
Inbound:
- 22 from your IP only
- 8000 from frontend public IP/32 OR frontend security group

### db-sg
Inbound:
- 22 from your IP only
- 5432 from backend public IP/32 OR backend security group

## Files to use

- DB server:
  - `deploy/ec2/public-ip/db/.env.example` -> copy as `.env`
  - `deploy/ec2/public-ip/db/docker-compose.yml`

- Backend server:
  - `deploy/ec2/public-ip/backend/.env.example` -> copy as `.env`
  - `deploy/ec2/public-ip/backend/docker-compose.yml`

- Frontend server:
  - `deploy/ec2/public-ip/frontend/.env.example` -> copy as `.env`
  - `frontend/nginx/nginx.public.template` -> copy as `deploy/ec2/public-ip/frontend/nginx.conf`
  - `deploy/ec2/public-ip/frontend/docker-compose.yml`

## Deployment steps

### 1) DB server

```bash
cd /opt/apps/simple-3tier-todo-app/deploy/ec2/public-ip/db
cp .env.example .env
# edit values
nano .env

docker compose up -d

docker compose ps
docker compose logs -f
```

### 2) Backend server

```bash
cd /opt/apps/simple-3tier-todo-app/deploy/ec2/public-ip/backend
cp .env.example .env
# edit values, especially DB_PUBLIC_IP and FRONTEND_PUBLIC_URL
nano .env

docker compose up -d --build

docker compose ps
docker compose logs -f
curl http://localhost:8000/health
```

### 3) Frontend server

```bash
cd /opt/apps/simple-3tier-todo-app
cp frontend/nginx/nginx.public.template deploy/ec2/public-ip/frontend/nginx.conf
nano deploy/ec2/public-ip/frontend/nginx.conf
# replace BACKEND_HOST with backend public IP

cd deploy/ec2/public-ip/frontend
cp .env.example .env
nano .env

docker compose up -d --build

docker compose ps
docker compose logs -f
curl http://localhost
```

## Final test
Open in browser:

```text
http://<FRONTEND_PUBLIC_IP>
```

Then test:
- Register
- Login
- Create task
- Refresh page
- Update task
- Delete task
