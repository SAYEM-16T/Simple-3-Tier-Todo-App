# Setup

## 1. Copy environment files

```bash
cp .env.example .env
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

## 2. Start the stack

```bash
docker compose up --build
```

## 3. Open the app

- Frontend: `http://localhost:5173`
- FastAPI docs: `http://localhost:8000/docs`
- Health: `http://localhost:8000/health`
- Adminer: `http://localhost:8080`

## 4. Reset database when needed

```bash
docker compose down -v
docker compose up --build
```
