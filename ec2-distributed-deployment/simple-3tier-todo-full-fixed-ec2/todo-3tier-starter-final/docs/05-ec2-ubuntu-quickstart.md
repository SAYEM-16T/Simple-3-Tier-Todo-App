# EC2 Ubuntu Quickstart

This guide assumes three EC2 instances:
- frontend
- backend
- db

## 1. Install Docker on each Ubuntu server

```bash
sudo apt update
sudo apt install -y ca-certificates curl git unzip
sudo install -m 0755 -d /etc/apt/keyrings
sudo curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
sudo chmod a+r /etc/apt/keyrings/docker.asc

echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu $(. /etc/os-release && echo ${UBUNTU_CODENAME:-$VERSION_CODENAME}) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
sudo systemctl enable --now docker
sudo usermod -aG docker $USER
newgrp docker
```

## 2. Clone this repo on each EC2

```bash
sudo mkdir -p /opt/apps
sudo chown -R $USER:$USER /opt/apps
cd /opt/apps
git clone <YOUR_GITHUB_REPO_URL> simple-3tier-todo-app
cd simple-3tier-todo-app
```

## 3. Security groups

### frontend-sg
- 22 from your IP
- 80 from 0.0.0.0/0
- 443 from 0.0.0.0/0 (optional)

### backend-sg
- 22 from your IP
- 8000 from frontend-sg

### db-sg
- 22 from your IP
- 5432 from backend-sg

## 4. Start DB first

```bash
cd /opt/apps/simple-3tier-todo-app/deploy/ec2/public-ip/db
cp .env.example .env
nano .env
docker compose up -d
docker exec -it todo_db pg_isready -U postgres -d todo_db
```

## 5. Start backend second

Use the DB **private IP** in `.env`.

```bash
cd /opt/apps/simple-3tier-todo-app/deploy/ec2/public-ip/backend
cp .env.example .env
nano .env
nc -vz <DB_PRIVATE_IP> 5432
docker compose up -d --build
curl http://localhost:8000/health
```

## 6. Start frontend last

Use the backend **private IP** inside Nginx.

```bash
cd /opt/apps/simple-3tier-todo-app
cp frontend/nginx/nginx.public.template deploy/ec2/public-ip/frontend/nginx.conf
nano deploy/ec2/public-ip/frontend/nginx.conf
cd deploy/ec2/public-ip/frontend
cp .env.example .env
docker compose up -d --build
curl http://localhost
```

## 7. Browser test

Open:

```text
http://<FRONTEND_PUBLIC_IP>
```

Then test:
- register
- login
- create task
- update task
- delete task
