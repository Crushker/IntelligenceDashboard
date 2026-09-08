"""
Intelligence Endpoints - Feed, Search, and Filtering
"""

from typing import Optional, List
from uuid import UUID
from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException, Query
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, and_, or_
from sqlalchemy.orm import selectinload

from app.core.database import get_db
from app.core.security import get_current_user
from app.models.models import (
    IntelligenceItem, IntelligenceCategory, NBFCLayer,
    UserPreferences
)

router = APIRouter()


# ─── Response Schemas ───────────────────────────────────────────────────────

class IntelligenceItemResponse(BaseModel):
    id: UUID
    category: str
    headline: str
    source_authority: str
    source_url: str
    applicable_nbfc_layers: List[str]
    technical_summary: str
    cio_actionable_directive: str
    severity_or_relevance_score: int
    published_at: datetime
    tags: List[str]

    class Config:
        from_attributes = True


class PaginatedResponse(BaseModel):
    items: List[IntelligenceItemResponse]
    total: int
    page: int
    page_size: int
    total_pages: int


# ─── Endpoints ──────────────────────────────────────────────────────────────

@router.get("/feed", response_model=PaginatedResponse)
async def get_intelligence_feed(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    category: Optional[str] = Query(None),
    nbfc_layer: Optional[str] = Query(None),
    min_score: Optional[int] = Query(None, ge=1, le=10),
    search: Optional[str] = Query(None, max_length=200),
    current_user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """
    Get paginated intelligence feed with filters.
    Applies user's preference-based filtering automatically.
    """
    
    # Build query
    query = select(IntelligenceItem)
    count_query = select(func.count(IntelligenceItem.id))
    
    # Apply filters
    conditions = []
    
    if category:
        conditions.append(IntelligenceItem.category == category)
    
    if nbfc_layer:
        conditions.append(
            or_(
                IntelligenceItem.applicable_nbfc_layers.contains([nbfc_layer]),
                IntelligenceItem.applicable_nbfc_layers.contains(["All"])
            )
        )
    
    if min_score:
        conditions.append(IntelligenceItem.severity_or_relevance_score >= min_score)
    
    if search:
        search_term = f"%{search}%"
        conditions.append(
            or_(
                IntelligenceItem.headline.ilike(search_term),
                IntelligenceItem.technical_summary.ilike(search_term),
                IntelligenceItem.tags.any(search),
            )
        )
    
    if conditions:
        query = query.where(and_(*conditions))
        count_query = count_query.where(and_(*conditions))
    
    # Get total count
    total_result = await db.execute(count_query)
    total = total_result.scalar() or 0
    
    # Apply pagination and ordering
    query = query.order_by(
        IntelligenceItem.severity_or_relevance_score.desc(),
        IntelligenceItem.published_at.desc()
    ).offset((page - 1) * page_size).limit(page_size)
    
    result = await db.execute(query)
    items = result.scalars().all()
    
    total_pages = (total + page_size - 1) // page_size
    
    return PaginatedResponse(
        items=[IntelligenceItemResponse.model_validate(item) for item in items],
        total=total,
        page=page,
        page_size=page_size,
        total_pages=total_pages,
    )


@router.get("/feed/{item_id}", response_model=IntelligenceItemResponse)
async def get_intelligence_item(
    item_id: UUID,
    current_user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Get single intelligence item by ID."""
    
    result = await db.execute(
        select(IntelligenceItem).where(IntelligenceItem.id == item_id)
    )
    item = result.scalar_one_or_none()
    
    if not item:
        raise HTTPException(status_code=404, detail="Intelligence item not found")
    
    return IntelligenceItemResponse.model_validate(item)


@router.get("/stats")
async def get_feed_stats(
    current_user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Get intelligence feed statistics for dashboard."""
    
    # Total items
    total_result = await db.execute(select(func.count(IntelligenceItem.id)))
    total = total_result.scalar() or 0
    
    # Critical items (score >= 9)
    critical_result = await db.execute(
        select(func.count(IntelligenceItem.id)).where(
            IntelligenceItem.severity_or_relevance_score >= 9
        )
    )
    critical = critical_result.scalar() or 0
    
    # By category
    category_result = await db.execute(
        select(IntelligenceItem.category, func.count(IntelligenceItem.id))
        .group_by(IntelligenceItem.category)
    )
    by_category = {str(row[0]): row[1] for row in category_result.all()}
    
    # Average score
    avg_result = await db.execute(
        select(func.avg(IntelligenceItem.severity_or_relevance_score))
    )
    avg_score = round(avg_result.scalar() or 0, 1)
    
    return {
        "total_items": total,
        "critical_items": critical,
        "average_relevance_score": avg_score,
        "by_category": by_category,
    }
