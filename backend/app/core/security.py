"""
Security Module - Authentication, Authorization, Password Hashing
Implements Argon2id hashing, JWT tokens, RBAC, and CSRF protection
"""

from datetime import datetime, timedelta
from typing import Optional, List
from uuid import UUID
import jwt
from passlib.hash import argon2
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

from app.core.config import settings

security_scheme = HTTPBearer()


# ─── Password Hashing (Argon2id) ───────────────────────────────────────────

def hash_password(password: str) -> str:
    """Hash password using Argon2id with enterprise-grade parameters."""
    return argon2.using(
        time_cost=settings.ARGON2_TIME_COST,
        memory_cost=settings.ARGON2_MEMORY_COST,
        parallelism=settings.ARGON2_PARALLELISM,
        type="ID",  # Argon2id - hybrid memory-hard
    ).hash(password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify password against Argon2id hash."""
    return argon2.verify(plain_password, hashed_password)


# ─── JWT Token Management ──────────────────────────────────────────────────

def create_access_token(user_id: UUID, role: str, extra_claims: Optional[dict] = None) -> str:
    """Create JWT access token with RBAC claims."""
    expire = datetime.utcnow() + timedelta(minutes=settings.JWT_ACCESS_TOKEN_EXPIRE_MINUTES)
    payload = {
        "sub": str(user_id),
        "role": role,
        "exp": expire,
        "iat": datetime.utcnow(),
        "type": "access",
        **(extra_claims or {}),
    }
    return jwt.encode(payload, settings.JWT_SECRET_KEY, algorithm=settings.JWT_ALGORITHM)


def create_refresh_token(user_id: UUID) -> str:
    """Create JWT refresh token."""
    expire = datetime.utcnow() + timedelta(days=settings.JWT_REFRESH_TOKEN_EXPIRE_DAYS)
    payload = {
        "sub": str(user_id),
        "exp": expire,
        "iat": datetime.utcnow(),
        "type": "refresh",
    }
    return jwt.encode(payload, settings.JWT_SECRET_KEY, algorithm=settings.JWT_ALGORITHM)


def verify_token(token: str) -> dict:
    """Verify and decode JWT token."""
    try:
        payload = jwt.decode(token, settings.JWT_SECRET_KEY, algorithms=[settings.JWT_ALGORITHM])
        if datetime.fromtimestamp(payload["exp"]) < datetime.utcnow():
            raise HTTPException(status_code=401, detail="Token expired")
        return payload
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")


# ─── Role-Based Access Control (RBAC) ──────────────────────────────────────

class RBACRoles:
    SUPER_ADMIN = "SuperAdmin"
    ENTERPRISE_CIO = "EnterpriseCIO"
    SUBSCRIBER = "Subscriber"


def require_roles(allowed_roles: List[str]):
    """Dependency factory for role-based access control."""
    async def role_checker(
        credentials: HTTPAuthorizationCredentials = Depends(security_scheme),
    ):
        payload = verify_token(credentials.credentials)
        user_role = payload.get("role")
        
        if user_role not in allowed_roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Role '{user_role}' not authorized. Required: {allowed_roles}",
            )
        
        return payload
    
    return role_checker


# ─── Current User Dependency ────────────────────────────────────────────────

async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security_scheme),
) -> dict:
    """Extract current user from JWT token."""
    payload = verify_token(credentials.credentials)
    return {
        "user_id": payload["sub"],
        "role": payload["role"],
    }


# ─── CSRF Token Generation ─────────────────────────────────────────────────

import secrets

def generate_csrf_token() -> str:
    """Generate cryptographically secure CSRF token."""
    return secrets.token_urlsafe(32)


def validate_csrf_token(provided_token: str, session_token: str) -> bool:
    """Validate CSRF token using constant-time comparison."""
    return secrets.compare_digest(provided_token, session_token)
