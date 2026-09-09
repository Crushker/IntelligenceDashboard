"""
Authentication Endpoints
Login, Register, Token Refresh, SSO
"""

from datetime import datetime
from typing import Optional
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status, Request
from pydantic import BaseModel, EmailStr, Field
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.core.database import get_db
from app.core.security import (
    hash_password, verify_password, create_access_token,
    create_refresh_token, verify_token, generate_csrf_token
)
from app.models.models import User, UserRole, ConsentAuditLog

router = APIRouter()


# ─── Request/Response Schemas ───────────────────────────────────────────────

class RegisterRequest(BaseModel):
    email: EmailStr
    password: str = Field(min_length=12, max_length=128)
    full_name: str = Field(min_length=2, max_length=255)
    organization: Optional[str] = None
    consent_given: bool = Field(..., description="DPDP consent flag")

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    expires_in: int

class RefreshRequest(BaseModel):
    refresh_token: str

class CSRFResponse(BaseModel):
    csrf_token: str


# ─── Endpoints ──────────────────────────────────────────────────────────────

@router.post("/register", response_model=TokenResponse, status_code=201)
@router.post("/register", status_code=201)
async def register(
    request: Request,
    payload: RegisterRequest,
    db: AsyncSession = Depends(get_db),
):
    """Register new subscriber with DPDP consent recording."""
    
    # Check existing user
    result = await db.execute(select(User).where(User.email == payload.email))
    if result.scalar_one_or_none():
        raise HTTPException(status_code=409, detail="Email already registered")
    
    # Validate DPDP consent
    if not payload.consent_given:
        raise HTTPException(
            status_code=400,
            detail="DPDP Act 2023 consent is required for registration"
        )
    
    # Create user with Argon2id hashed password
    user = User(
        email=payload.email,
        hashed_password=hash_password(payload.password),
        full_name=payload.full_name,
        organization=payload.organization,
        role=UserRole.SUBSCRIBER,
        consent_given_at=datetime.utcnow(),
        consent_version="2.0",
        is_verified=False,
    )
    db.add(user)
    
    # Record consent audit log (DPDP compliance)
    consent_log = ConsentAuditLog(
        user_id=user.id,
        action="consent_given",
        consent_version="2.0",
        ip_address=request.client.host if request.client else None,
        user_agent=request.headers.get("user-agent"),
        metadata_json={"registration": True},
    )
    db.add(consent_log)
    await db.flush()
    
    # Generate tokens
    access_token = create_access_token(user.id, user.role.value)
    refresh_token = create_refresh_token(user.id)
    
    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer",
        "expires_in": 1800,
    }


@router.post("/login", response_model=TokenResponse)
async def login(
    request: Request,
    payload: LoginRequest,
    db: AsyncSession = Depends(get_db),
):
    """Authenticate user with email/password."""
    
    result = await db.execute(select(User).where(User.email == payload.email))
    user = result.scalar_one_or_none()
    
    if not user or not verify_password(payload.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    if not user.is_active:
        raise HTTPException(status_code=403, detail="Account deactivated")
    
    # Update last login
    user.last_login_at = datetime.utcnow()
    
    # Generate tokens
    access_token = create_access_token(user.id, user.role.value)
    refresh_token = create_refresh_token(user.id)
    
    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer",
        "expires_in": 1800,
    }


@router.post("/refresh", response_model=TokenResponse)
async def refresh_token(
    payload: RefreshRequest,
    db: AsyncSession = Depends(get_db),
):
    """Refresh access token using valid refresh token."""
    
    token_data = verify_token(payload.refresh_token)
    
    if token_data.get("type") != "refresh":
        raise HTTPException(status_code=400, detail="Invalid token type")
    
    user_id = UUID(token_data["sub"])
    result = await db.execute(select(User).where(User.id == user_id))
    user = result.scalar_one_or_none()
    
    if not user or not user.is_active:
        raise HTTPException(status_code=401, detail="User not found or inactive")
    
    access_token = create_access_token(user.id, user.role.value)
    new_refresh_token = create_refresh_token(user.id)
    
    return {
        "access_token": access_token,
        "refresh_token": new_refresh_token,
        "token_type": "bearer",
        "expires_in": 1800,
    }


@router.get("/csrf-token", response_model=CSRFResponse)
async def get_csrf_token():
    """Generate CSRF token for state-changing operations."""
    return CSRFResponse(csrf_token=generate_csrf_token())
