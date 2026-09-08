"""
Database Models - SQLModel/SQLAlchemy ORM
Enterprise-grade models with audit trails, soft deletes, and DPDP compliance
"""

import uuid
from datetime import datetime
from typing import Optional, List
from enum import Enum as PyEnum

from sqlalchemy import (
    Column, String, Integer, Float, Boolean, DateTime, Text, 
    ForeignKey, JSON, Enum, Index, UniqueConstraint
)
from sqlalchemy.dialects.postgresql import UUID, ARRAY
from sqlalchemy.orm import relationship

from app.core.database import Base


# ─── Enums ──────────────────────────────────────────────────────────────────

class UserRole(str, PyEnum):
    SUPER_ADMIN = "SuperAdmin"
    ENTERPRISE_CIO = "EnterpriseCIO"
    SUBSCRIBER = "Subscriber"


class NBFCLayer(str, PyEnum):
    BASE = "Base"
    MIDDLE = "Middle"
    UPPER = "Upper"
    TOP = "Top"


class IntelligenceCategory(str, PyEnum):
    REGULATORY = "Regulatory"
    CYBER_THREAT = "Cyber-Threat"
    INFRA_ARCHITECTURE = "Infra-Architecture"
    FRONTIER_TECH = "Frontier-Tech"
    VIDEO_MASTERCLASS = "Video-Masterclass"
    NETWORKING_EVENT = "Networking-Event"


class DeliveryChannel(str, PyEnum):
    EMAIL = "email"
    SLACK = "slack"
    TEAMS = "teams"


# ─── User Model ─────────────────────────────────────────────────────────────

class User(Base):
    __tablename__ = "users"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email = Column(String(255), unique=True, nullable=False, index=True)
    hashed_password = Column(String(255), nullable=False)
    full_name = Column(String(255), nullable=False)
    organization = Column(String(255), nullable=True)
    role = Column(Enum(UserRole), default=UserRole.SUBSCRIBER, nullable=False)
    is_active = Column(Boolean, default=True)
    is_verified = Column(Boolean, default=False)
    
    # SSO fields
    sso_provider = Column(String(50), nullable=True)  # google, microsoft, etc.
    sso_external_id = Column(String(255), nullable=True)
    
    # DPDP Compliance
    consent_given_at = Column(DateTime, nullable=True)
    consent_version = Column(String(20), nullable=True)
    data_erasure_requested_at = Column(DateTime, nullable=True)
    
    # Audit
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    last_login_at = Column(DateTime, nullable=True)
    
    # Relationships
    subscription = relationship("Subscription", back_populates="user", uselist=False)
    preferences = relationship("UserPreferences", back_populates="user", uselist=False)
    
    __table_args__ = (
        Index("idx_users_email", "email"),
        Index("idx_users_sso", "sso_provider", "sso_external_id"),
    )


# ─── Subscription Model ────────────────────────────────────────────────────

class Subscription(Base):
    __tablename__ = "subscriptions"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), unique=True, nullable=False)
    plan_tier = Column(String(50), nullable=False)  # base, upper, top
    status = Column(String(20), default="active")  # active, cancelled, past_due
    billing_cycle = Column(String(20), default="monthly")  # monthly, annual
    
    # Billing
    amount_monthly = Column(Float, nullable=False)
    currency = Column(String(3), default="INR")
    current_period_start = Column(DateTime, nullable=False)
    current_period_end = Column(DateTime, nullable=False)
    
    # Usage tracking
    active_seats = Column(Integer, default=1)
    max_seats = Column(Integer, default=5)
    api_calls_mtd = Column(Integer, default=0)
    
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    user = relationship("User", back_populates="subscription")


# ─── User Preferences Model ────────────────────────────────────────────────

class UserPreferences(Base):
    __tablename__ = "user_preferences"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), unique=True, nullable=False)
    
    # NBFC Layer filters
    nbfc_layers = Column(ARRAY(Enum(NBFCLayer)), default=[])
    
    # Category toggles
    enabled_categories = Column(ARRAY(Enum(IntelligenceCategory)), default=[])
    
    # Alert threshold
    min_relevance_score = Column(Integer, default=5)
    
    # Delivery preferences
    email_digest_frequency = Column(String(20), default="daily")  # realtime, daily, weekly
    slack_webhook_url = Column(Text, nullable=True)
    teams_webhook_url = Column(Text, nullable=True)
    
    # Encrypted webhook secrets (masked in API responses)
    webhook_secret_hash = Column(String(255), nullable=True)
    
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    user = relationship("User", back_populates="preferences")


# ─── Intelligence Item Model ───────────────────────────────────────────────

class IntelligenceItem(Base):
    __tablename__ = "intelligence_items"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    category = Column(Enum(IntelligenceCategory), nullable=False)
    headline = Column(String(500), nullable=False)
    source_authority = Column(String(255), nullable=False)
    source_url = Column(Text, nullable=False)
    
    # Content
    technical_summary = Column(Text, nullable=False)
    cio_actionable_directive = Column(Text, nullable=False)
    
    # Classification
    applicable_nbfc_layers = Column(ARRAY(Enum(NBFCLayer)), nullable=False)
    severity_or_relevance_score = Column(Integer, nullable=False)  # 1-10
    tags = Column(ARRAY(String), default=[])
    
    # Deduplication
    content_hash = Column(String(64), unique=True, nullable=False, index=True)
    source_content_id = Column(String(255), nullable=True)  # CVE ID, circular number, video ID
    
    # Metadata
    published_at = Column(DateTime, nullable=False)
    ingested_at = Column(DateTime, default=datetime.utcnow)
    llm_model_used = Column(String(100), nullable=True)
    
    __table_args__ = (
        Index("idx_intel_category_score", "category", "severity_or_relevance_score"),
        Index("idx_intel_published", "published_at"),
        Index("idx_intel_layers", "applicable_nbfc_layers", postgresql_using="gin"),
    )


# ─── Content Hash / Deduplication Table ─────────────────────────────────────

class ContentDeduplication(Base):
    __tablename__ = "content_deduplication"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    content_hash = Column(String(64), unique=True, nullable=False, index=True)
    source_type = Column(String(50), nullable=False)  # rbi_circular, cert_in, youtube, arxiv
    source_id = Column(String(255), nullable=True)  # Specific identifier
    first_seen_at = Column(DateTime, default=datetime.utcnow)
    last_seen_at = Column(DateTime, default=datetime.utcnow)
    occurrence_count = Column(Integer, default=1)
    
    __table_args__ = (
        Index("idx_dedup_source", "source_type", "source_id"),
    )


# ─── Consent Audit Log (DPDP Compliance) ───────────────────────────────────

class ConsentAuditLog(Base):
    __tablename__ = "consent_audit_log"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False, index=True)
    action = Column(String(50), nullable=False)  # consent_given, consent_withdrawn, data_export, erasure
    consent_version = Column(String(20), nullable=True)
    ip_address = Column(String(45), nullable=True)
    user_agent = Column(Text, nullable=True)
    metadata_json = Column(JSON, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
