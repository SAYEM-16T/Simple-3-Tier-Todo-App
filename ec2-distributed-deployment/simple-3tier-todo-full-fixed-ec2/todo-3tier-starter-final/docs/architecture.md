# Architecture

## Frontend
- React + Vite + TypeScript
- React Router for route management
- Context API for auth state
- Axios instance for API calls
- Tailwind CSS for UI styling

## Backend
- FastAPI as the HTTP API layer
- SQLAlchemy ORM for database access
- Alembic for migrations
- Pydantic schemas for request/response validation
- JWT for stateless authentication

## Database
- PostgreSQL stores users and tasks
- Each task belongs to a user
- Foreign key + cascade delete on tasks

## Request flow
1. User logs in from React.
2. FastAPI verifies credentials and returns JWT.
3. React stores token and calls protected endpoints.
4. FastAPI extracts current user from JWT.
5. CRUD operations are limited to the logged-in user's tasks.
