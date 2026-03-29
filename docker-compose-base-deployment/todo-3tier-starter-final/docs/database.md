# Database Design

## users
- `id` UUID primary key
- `name` varchar(100)
- `email` unique
- `hashed_password` text
- `created_at` timestamp with timezone
- `updated_at` timestamp with timezone

## tasks
- `id` UUID primary key
- `user_id` UUID foreign key -> users.id
- `title` varchar(255)
- `description` text nullable
- `status` enum-like string (`pending`, `in_progress`, `done`)
- `priority` enum-like string (`low`, `medium`, `high`)
- `created_at` timestamp with timezone
- `updated_at` timestamp with timezone

## Relationship
- One user has many tasks
- Deleting a user deletes all their tasks
