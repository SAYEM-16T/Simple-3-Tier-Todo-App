from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.core.security import get_current_user
from app.db.session import get_db
from app.models.user import User
from app.schemas.task import TaskCreate, TaskPublic, TaskStatusUpdate, TaskUpdate
from app.models.task import TaskStatus
from app.services.task_service import (
    create_task,
    delete_task,
    get_task_by_id,
    get_tasks_for_user,
    update_task,
    update_task_status,
)

router = APIRouter()


@router.get("", response_model=list[TaskPublic])
def list_tasks(
    status_filter: TaskStatus | None = Query(default=None, alias="status"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> list[TaskPublic]:
    return get_tasks_for_user(db, current_user.id, status_filter)


@router.post("", response_model=TaskPublic, status_code=status.HTTP_201_CREATED)
def add_task(
    payload: TaskCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> TaskPublic:
    return create_task(db, current_user.id, payload)


@router.get("/{task_id}", response_model=TaskPublic)
def get_task(
    task_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> TaskPublic:
    task = get_task_by_id(db, task_id, current_user.id)
    if not task:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Task not found")
    return task


@router.put("/{task_id}", response_model=TaskPublic)
def replace_task(
    task_id: UUID,
    payload: TaskUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> TaskPublic:
    task = update_task(db, task_id, current_user.id, payload)
    if not task:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Task not found")
    return task


@router.patch("/{task_id}/status", response_model=TaskPublic)
def patch_task_status(
    task_id: UUID,
    payload: TaskStatusUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> TaskPublic:
    task = update_task_status(db, task_id, current_user.id, payload.status)
    if not task:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Task not found")
    return task


@router.delete("/{task_id}", status_code=status.HTTP_204_NO_CONTENT)
def remove_task(
    task_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> None:
    deleted = delete_task(db, task_id, current_user.id)
    if not deleted:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Task not found")
    return None
