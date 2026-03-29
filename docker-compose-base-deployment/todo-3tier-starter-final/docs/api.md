# API Contract

## Auth
### POST /api/v1/auth/register
Request:
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "Password123"
}
```

### POST /api/v1/auth/login
Request:
```json
{
  "email": "john@example.com",
  "password": "Password123"
}
```
Response:
```json
{
  "access_token": "...",
  "token_type": "bearer",
  "user": {
    "id": "uuid",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

### GET /api/v1/auth/me
Requires `Authorization: Bearer <token>`.

## Tasks
### GET /api/v1/tasks?status=pending
Returns the logged-in user's tasks.

### POST /api/v1/tasks
```json
{
  "title": "Finish dashboard",
  "description": "Build cards and filters",
  "status": "pending",
  "priority": "high"
}
```

### PUT /api/v1/tasks/{task_id}
Full update.

### PATCH /api/v1/tasks/{task_id}/status
```json
{
  "status": "done"
}
```

### DELETE /api/v1/tasks/{task_id}
Deletes the task owned by the current user.
