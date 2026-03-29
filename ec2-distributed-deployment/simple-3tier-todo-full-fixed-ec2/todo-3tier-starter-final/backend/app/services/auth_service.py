from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.core.security import create_access_token, get_password_hash, verify_password
from app.models.user import User
from app.schemas.user import UserCreate


def normalize_email(email: str) -> str:
    return email.strip().lower()


def get_user_by_email(db: Session, email: str) -> User | None:
    stmt = select(User).where(func.lower(User.email) == normalize_email(email))
    return db.scalar(stmt)


def create_user(db: Session, payload: UserCreate) -> User:
    user = User(
        name=payload.name.strip(),
        email=normalize_email(payload.email),
        hashed_password=get_password_hash(payload.password),
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


def authenticate_user(db: Session, email: str, password: str) -> User | None:
    user = get_user_by_email(db, email)
    if not user:
        return None
    if not verify_password(password, user.hashed_password):
        return None
    return user


__all__ = [
    "normalize_email",
    "get_user_by_email",
    "create_user",
    "authenticate_user",
    "create_access_token",
]
