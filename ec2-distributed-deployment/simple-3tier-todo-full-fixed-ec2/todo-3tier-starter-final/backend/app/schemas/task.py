from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field

from app.models.task import TaskPriority, TaskStatus


class TaskBase(BaseModel):
    title: str = Field(min_length=1, max_length=255)
    description: str | None = Field(default=None, max_length=1000)
    status: TaskStatus = TaskStatus.pending
    priority: TaskPriority = TaskPriority.medium


class TaskCreate(TaskBase):
    pass


class TaskUpdate(TaskBase):
    pass


class TaskStatusUpdate(BaseModel):
    status: TaskStatus


class TaskPublic(TaskBase):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    user_id: UUID
    created_at: datetime
    updated_at: datetime
