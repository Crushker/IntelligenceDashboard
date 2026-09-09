"""
Webhook Endpoints - Slack & Microsoft Teams Integration
"""

from typing import Optional
import httpx
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.core.security import get_current_user
from app.models.models import UserPreferences, IntelligenceItem
from sqlalchemy import select
from uuid import UUID

router = APIRouter()


class WebhookTestRequest(BaseModel):
    webhook_url: str
    channel_type: str  # "slack" or "teams"


class WebhookTestResponse(BaseModel):
    success: bool
    message: str


@router.post("/test", response_model=WebhookTestResponse)
async def test_webhook(
    payload: WebhookTestRequest,
    current_user: dict = Depends(get_current_user),
):
    """Test webhook connectivity to Slack or Teams."""
    
    if payload.channel_type == "slack":
        message_payload = {
            "text": "🔔 NBFC Intelligence Platform - Webhook Test Successful",
            "blocks": [
                {
                    "type": "header",
                    "text": {"type": "plain_text", "text": "🛡️ NBFC Intel - Connection Verified"}
                },
                {
                    "type": "section",
                    "text": {
                        "type": "mrkdwn",
                        "text": "Your Slack webhook is configured correctly. You will receive intelligence briefings here."
                    }
                }
            ]
        }
    elif payload.channel_type == "teams":
        message_payload = {
            "@type": "MessageCard",
            "@context": "http://schema.org/extensions",
            "themeColor": "F5A623",
            "summary": "NBFC Intelligence Platform - Webhook Test",
            "sections": [{
                "activityTitle": "🛡️ NBFC Intel - Connection Verified",
                "text": "Your Microsoft Teams webhook is configured correctly. You will receive intelligence briefings here."
            }]
        }
    else:
        raise HTTPException(status_code=400, detail="Invalid channel_type. Use 'slack' or 'teams'.")
    
    try:
        async with httpx.AsyncClient() as client:
            response = await client.post(
                payload.webhook_url,
                json=message_payload,
                timeout=10,
            )
            
            if response.status_code in (200, 201, 202, 204):
                return WebhookTestResponse(success=True, message="Webhook test successful")
            else:
                return WebhookTestResponse(
                    success=False,
                    message=f"Webhook returned status {response.status_code}"
                )
    except httpx.TimeoutException:
        return WebhookTestResponse(success=False, message="Webhook request timed out")
    except Exception as e:
        return WebhookTestResponse(success=False, message=f"Error: {str(e)}")


async def dispatch_slack_alert(webhook_url: str, item: IntelligenceItem):
    """Dispatch intelligence alert to Slack channel."""
    
    severity_emoji = "🔴" if item.severity_or_relevance_score >= 9 else "🟡" if item.severity_or_relevance_score >= 7 else "🔵"
    
    payload = {
        "text": f"{severity_emoji} [{item.category}] {item.headline}",
        "blocks": [
            {
                "type": "header",
                "text": {
                    "type": "plain_text",
                    "text": f"{severity_emoji} {item.headline[:100]}"
                }
            },
            {
                "type": "section",
                "fields": [
                    {"type": "mrkdwn", "text": f"*Category:* {item.category}"},
                    {"type": "mrkdwn", "text": f"*Score:* {item.severity_or_relevance_score}/10"},
                    {"type": "mrkdwn", "text": f"*Source:* {item.source_authority}"},
                    {"type": "mrkdwn", "text": f"*Layers:* {', '.join(item.applicable_nbfc_layers)}"},
                ]
            },
            {
                "type": "section",
                "text": {
                    "type": "mrkdwn",
                    "text": f"*CIO Action:* {item.cio_actionable_directive[:300]}"
                }
            },
            {
                "type": "actions",
                "elements": [
                    {
                        "type": "button",
                        "text": {"type": "plain_text", "text": "View Full Brief"},
                        "url": item.source_url,
                    }
                ]
            }
        ]
    }
    
    async with httpx.AsyncClient() as client:
        await client.post(webhook_url, json=payload, timeout=10)


async def dispatch_teams_alert(webhook_url: str, item: IntelligenceItem):
    """Dispatch intelligence alert to Microsoft Teams channel."""
    
    severity_color = "FF0000" if item.severity_or_relevance_score >= 9 else "FFA500" if item.severity_or_relevance_score >= 7 else "0066CC"
    
    payload = {
        "@type": "MessageCard",
        "@context": "http://schema.org/extensions",
        "themeColor": severity_color,
        "summary": f"[{item.category}] {item.headline}",
        "sections": [
            {
                "activityTitle": f"[{item.category}] {item.headline}",
                "activitySubtitle": f"Source: {item.source_authority} | Score: {item.severity_or_relevance_score}/10",
                "facts": [
                    {"name": "Applicable Layers", "value": ", ".join(item.applicable_nbfc_layers)},
                    {"name": "Category", "value": item.category},
                ],
                "text": f"**CIO Action:** {item.cio_actionable_directive[:500]}"
            }
        ],
        "potentialAction": [
            {
                "@type": "OpenUri",
                "name": "View Source",
                "targets": [{"os": "default", "uri": item.source_url}]
            }
        ]
    }
    
    async with httpx.AsyncClient() as client:
        await client.post(webhook_url, json=payload, timeout=10)
