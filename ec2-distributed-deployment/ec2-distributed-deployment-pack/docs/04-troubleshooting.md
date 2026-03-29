# Troubleshooting

## Frontend loads, API fails
Check from frontend server:

```bash
curl http://BACKEND_HOST:8000/health
```

If it fails:
- backend container may be down
- backend SG may not allow 8000
- frontend nginx.conf may point to the wrong host

## Backend starts, DB connection fails
Check from backend server:

```bash
nc -vz DB_HOST 5432
```

If it fails:
- DB container may be down
- db SG may not allow 5432
- backend `.env` may contain wrong host/password

## Backend container logs

```bash
docker compose logs -f
```

## Full reset

```bash
docker compose down -v
docker compose up -d --build
```

## Useful commands

```bash
docker compose ps
docker ps
docker images
docker logs <container_name>
```
