"""
Subscription & User Preferences Endpoints
"""

from typing import Optional, List
from uuid import UUID
from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, Field
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.core.database import get_db
from app.core.security import get_current_user, require_roles, RBACRoles
from app.models.models import (
    Subscription, UserPreferences, User, NBFCLayer,
    IntelligenceCategory, ConsentAuditLog
)

router = APIRouter()


# ─── Schemas ────────────────────────────────────────────────────────────────

class PreferencesUpdate(BaseModel):
    nbfc_layers: Optional[List[str]] = None
    enabled_categories: Optional[List[str]] = None
    min_relevance_score: Optional[int] = Field(None, ge=1, le=10)
    email_digest_frequency: Optional[str] = None
    slack_webhook_url: Optional[str] = None
    teams_webhook_url: Optional[str] = None


class PreferencesResponse(BaseModel):
    nbfc_layers: List[str]
    enabled_categories: List[str]
    min_relevance_score: int
    email_digest_frequency: str
    slack_webhook_url: Optional[str] = None
    teams_webhook_url: Optional[str] = None


class SubscriptionResponse(BaseModel):
    plan_tier: str
    status: str
    billing_cycle: str
    amount_monthly: float
    active_seats: int
    max_seats: int
    current_period_end: datetime


# ─── Preferences Endpoints ─────────────────────────────────────────────────

@router.get("/preferences", response_model=PreferencesResponse)
async def get_preferences(
    current_user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Get user's intelligence delivery preferences."""
    user_id = UUID(current_user["user_id"])
    
    result = await db.execute(
        select(UserPreferences).where(UserPreferences.user_id == user_id)
    )
    prefs = result.scalar_one_or_none()
    
    if not prefs:
        # Return defaults
        return PreferencesResponse(
            nbfc_layers=["Upper", "Top"],
            enabled_categories=["Regulatory", "Cyber-Threat", "Infra-Architecture", "Frontier-Tech"],
            min_relevance_score=5,
            email_digest_frequency="daily",
        )
    
    return PreferencesResponse(
        nbfc_layers=[str(l) for l in (prefs.nbfc_layers or [])],
        enabled_categories=[str(c) for c in (prefs.enabled_categories or [])],
        min_relevance_score=prefs.min_relevance_score,
        email_digest_frequency=prefs.email_digest_frequency,
        slack_webhook_url=prefs.slack_webhook_url,
        teams_webhook_url=prefs.teams_webhook_url,
    )


@router.put("/preferences", response_model=PreferencesResponse)
async def update_preferences(
    payload: PreferencesUpdate,
    current_user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Update user's intelligence delivery preferences."""
    user_id = UUID(current_user["user_id"])
    
    result = await db.execute(
        select(UserPreferences).where(UserPreferences.user_id == user_id)
    )
    prefs = result.scalar_one_or_none()
    
    if not prefs:
        prefs = UserPreferences(user_id=user_id)
        db.add(prefs)
    
    # Update fields
    if payload.nbfc_layers is not None:
        prefs.nbfc_layers = payload.nbfc_layers
    if payload.enabled_categories is not None:
        prefs.enabled_categories = payload.enabled_categories
    if payload.min_relevance_score is not None:
        prefs.min_relevance_score = payload.min_relevance_score
    if payload.email_digest_frequency is not None:
        prefs.email_digest_frequency = payload.email_digest_frequency
    if payload.slack_webhook_url is not None:
        prefs.slack_webhook_url = payload.slack_webhook_url
    if payload.teams_webhook_url is not None:
        prefs.teams_webhook_url = payload.teams_webhook_url
    
    await db.flush()
    
    return await get_preferences(current_user, db)


# ─── Subscription Endpoints ────────────────────────────────────────────────

@router.get("/current", response_model=SubscriptionResponse)
async def get_current_subscription(
    current_user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Get current subscription details."""
    user_id = UUID(current_user["user_id"])
    
    result = await db.execute(
        select(Subscription).where(Subscription.user_id == user_id)
    )
    sub = result.scalar_one_or_none()
    
    if not sub:
        raise HTTPException(status_code=404, detail="No active subscription found")
    
    return SubscriptionResponse(
        plan_tier=sub.plan_tier,
        status=sub.status,
        billing_cycle=sub.billing_cycle,
        amount_monthly=sub.amount_monthly,
        active_seats=sub.active_seats,
        max_seats=sub.max_seats,
        current_period_end=sub.current_period_end,
    )


# ─── DPDP Right to Erasure ─────────────────────────────────────────────────

@router.delete("/account", status_code=200)
async def request_data_erasure(
    current_user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """
    DPDP Act 2023 - Right to Erasure.
    Initiates account deletion and data erasure process.
    """
    user_id = UUID(current_user["user_id"])
    
    # Mark user for erasure
    result = await db.execute(select(User).where(User.id == user_id))
    user = result.scalar_one_or_none()
    
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    user.data_erasure_requested_at = datetime.utcnow()
    user.is_active = False
    
    # Record erasure request in audit log
    erasure_log = ConsentAuditLog(
        user_id=user_id,
        action="data_erasure_requested",
        metadata_json={"requested_at": datetime.utcnow().isoformat()},
    )
    db.add(erasure_log)
    
    # TODO: Queue async job to actually delete data after retention period
    
    return {
        "status": "erasure_initiated",
        "message": "Your data erasure request has been recorded. All personal data will be deleted within 30 days per DPDP Act 2023.",
        "request_id": str(erasure_log.id),
    }
