"""
User Management Endpoints
"""

from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.core.database import get_db
from app.core.security import get_current_user, require_roles, RBACRoles
from app.models.models import User

router = APIRouter()


class UserResponse(BaseModel):
    id: str
    email: str
    full_name: str
    organization: str | None
    role: str
    is_active: bool
    is_verified: bool
    
    class Config:
        from_attributes = True


@router.get("/me", response_model=UserResponse)
async def get_current_user_profile(
    current_user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Get current authenticated user's profile."""
    user_id = UUID(current_user["user_id"])
    
    result = await db.execute(select(User).where(User.id == user_id))
    user = result.scalar_one_or_none()
    
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    return UserResponse(
        id=str(user.id),
        email=user.email,
        full_name=user.full_name,
        organization=user.organization,
        role=user.role.value,
        is_active=user.is_active,
        is_verified=user.is_verified,
    )


@router.get("/all")
async def list_users(
    current_user: dict = Depends(require_roles([RBACRoles.SUPER_ADMIN])),
    db: AsyncSession = Depends(get_db),
):
    """List all users (SuperAdmin only)."""
    result = await db.execute(select(User).order_by(User.created_at.desc()))
    users = result.scalars().all()
    
    return [
        UserResponse(
            id=str(u.id),
            email=u.email,
            full_name=u.full_name,
            organization=u.organization,
            role=u.role.value,
            is_active=u.is_active,
            is_verified=u.is_verified,
        )
        for u in users
    ]
