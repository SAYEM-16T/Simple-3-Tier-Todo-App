from uuid import UUID

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.task import Task, TaskStatus
from app.schemas.task import TaskCreate, TaskUpdate


def get_tasks_for_user(db: Session, user_id: UUID, status_filter: TaskStatus | None = None) -> list[Task]:
    stmt = select(Task).where(Task.user_id == user_id).order_by(Task.created_at.desc())
    if status_filter:
        stmt = stmt.where(Task.status == status_filter)
    return list(db.scalars(stmt).all())


def get_task_by_id(db: Session, task_id: UUID, user_id: UUID) -> Task | None:
    stmt = select(Task).where(Task.id == task_id, Task.user_id == user_id)
    return db.scalar(stmt)


def create_task(db: Session, user_id: UUID, payload: TaskCreate) -> Task:
    task = Task(user_id=user_id, **payload.model_dump())
    db.add(task)
    db.commit()
    db.refresh(task)
    return task


def update_task(db: Session, task_id: UUID, user_id: UUID, payload: TaskUpdate) -> Task | None:
    task = get_task_by_id(db, task_id, user_id)
    if not task:
        return None

    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(task, field, value)

    db.commit()
    db.refresh(task)
    return task


def update_task_status(db: Session, task_id: UUID, user_id: UUID, status: TaskStatus) -> Task | None:
    task = get_task_by_id(db, task_id, user_id)
    if not task:
        return None
    task.status = status
    db.commit()
    db.refresh(task)
    return task


def delete_task(db: Session, task_id: UUID, user_id: UUID) -> bool:
    task = get_task_by_id(db, task_id, user_id)
    if not task:
        return False
    db.delete(task)
    db.commit()
    return True
