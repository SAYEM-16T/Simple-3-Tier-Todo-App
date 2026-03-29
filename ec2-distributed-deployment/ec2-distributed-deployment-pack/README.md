# EC2 Distributed Deployment Pack for Simple 3-Tier Todo App

This pack is meant to be **unzipped into the root of your existing project repository**.

Expected existing app structure in your repo:

```text
frontend/
backend/
```

This pack adds:

- EC2-ready Dockerfiles for frontend and backend
- EC2 startup scripts for backend
- Separate Docker Compose files for:
  - frontend server
  - backend server
  - db server
- Two deployment modes:
  - `public-ip` (easy first test)
  - `private` (best-practice direction)
- Detailed runbooks

## High-level deployment modes

### Mode 1: public-ip
Use this first because it is simpler to verify.

- Frontend EC2: public
- Backend EC2: public
- DB EC2: public
- Frontend connects to backend via backend **public IP**
- Backend connects to DB via DB **public IP**
- Security groups still restrict access

### Mode 2: private
Use this after mode 1 works.

- Frontend EC2: public subnet
- Backend EC2: private subnet
- DB EC2: private subnet
- Frontend Nginx reverse-proxies `/api/*` to backend **private IP**
- Backend connects to DB via DB **private IP**
- Backend and DB are not internet-facing

## What to copy where

You will unzip this pack into your project root. After that:

- `frontend/Dockerfile.ec2`
- `frontend/nginx/*.template`
- `backend/Dockerfile.ec2`
- `backend/scripts/start-ec2.sh`
- `backend/scripts/wait-for-db.sh`
- `deploy/ec2/...`
- `docs/...`

## Quick order

1. Prepare security groups
2. Install Docker on all 3 EC2 instances
3. Clone the same repo on all 3 servers
4. Configure `db/.env`
5. Start DB
6. Configure `backend/.env`
7. Start backend
8. Configure `frontend/nginx.conf` and `frontend/.env`
9. Start frontend
10. Verify in browser

See:
- `docs/01-overview.md`
- `docs/02-mode-public-ip.md`
- `docs/03-mode-private-best-practice.md`
