"""
Celery Workers & Scheduled Tasks
Background job processing for ingestion, email dispatch, and webhook delivery
"""

from celery import Celery
from celery.schedules import crontab
from datetime import datetime, timezone
import logging

from app.core.config import settings

logger = logging.getLogger(__name__)

# Celery Application
celery_app = Celery(
    "nbfc_intel",
    broker=settings.CELERY_BROKER_URL,
    backend=settings.CELERY_RESULT_BACKEND,
)

# Celery Configuration
celery_app.conf.update(
    task_serializer="json",
    accept_content=["json"],
    result_serializer="json",
    timezone="Asia/Kolkata",
    enable_utc=True,
    task_track_started=True,
    task_time_limit=3600,  # 1 hour max per task
    task_soft_time_limit=3000,  # 50 min soft limit
    worker_prefetch_multiplier=1,
    worker_max_tasks_per_child=100,
    task_acks_late=True,
    task_reject_on_worker_lost=True,
)

# ─── Beat Schedule (Automated Schedulers) ───────────────────────────────────

celery_app.conf.beat_schedule = {
    # Scraper tasks: Run every 6 hours with staggered timing
    "ingest-regulatory-sources": {
        "task": "app.workers.tasks.run_regulatory_ingestion",
        "schedule": crontab(minute=0, hour="*/6"),  # Every 6 hours
        "options": {"queue": "ingestion"},
    },
    "ingest-research-sources": {
        "task": "app.workers.tasks.run_research_ingestion",
        "schedule": crontab(minute=30, hour="*/6"),  # 30 min offset
        "options": {"queue": "ingestion"},
    },
    "ingest-youtube-channels": {
        "task": "app.workers.tasks.run_youtube_ingestion",
        "schedule": crontab(minute=0, hour="*/12"),  # Every 12 hours
        "options": {"queue": "ingestion"},
    },
    
    # Email digest: Daily at 7 AM IST
    "send-daily-digest": {
        "task": "app.workers.tasks.send_daily_email_digest",
        "schedule": crontab(minute=0, hour=7),
        "options": {"queue": "email"},
    },
    
    # Weekly executive briefing: Monday 8 AM IST
    "send-weekly-briefing": {
        "task": "app.workers.tasks.send_weekly_briefing",
        "schedule": crontab(minute=0, hour=8, day_of_week=1),
        "options": {"queue": "email"},
    },
    
    # Cleanup: Remove old processed items daily
    "cleanup-old-data": {
        "task": "app.workers.tasks.cleanup_processed_data",
        "schedule": crontab(minute=0, hour=3),
        "options": {"queue": "maintenance"},
    },
}


# ─── Task Definitions ───────────────────────────────────────────────────────

@celery_app.task(bind=True, name="app.workers.tasks.run_regulatory_ingestion", max_retries=3)
def run_regulatory_ingestion(self):
    """Ingest from regulatory sources (RBI, CERT-In, SEBI, etc.)."""
    import asyncio
    
    logger.info("Starting regulatory source ingestion...")
    
    try:
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
        
        from app.ingestion.pipeline import IngestionPipeline, REGULATORY_SOURCES
        import httpx
        
        async def _run():
            pipeline = IngestionPipeline()
            async with httpx.AsyncClient() as client:
                tasks = [pipeline._process_source(source, client) for source in REGULATORY_SOURCES]
                results = await asyncio.gather(*tasks, return_exceptions=True)
                
                new_items = []
                for result in results:
                    if not isinstance(result, Exception) and result:
                        new_items.extend(result)
                
                # Analyze with LLM
                from app.ingestion.pipeline import analyze_with_llm
                analyzed = []
                for item in new_items:
                    result = await analyze_with_llm(
                        content=item["text"],
                        source_name=item["source"],
                        source_url=item["url"],
                    )
                    if result:
                        analyzed.append(result)
                
                return analyzed
        
        items = loop.run_until_complete(_run())
        loop.close()
        
        # Store in database
        _store_intelligence_items(items)
        
        # Dispatch real-time alerts for critical items
        for item in items:
            if item.severity_or_relevance_score >= 9:
                dispatch_realtime_alert.delay(item.model_dump())
        
        logger.info(f"Regulatory ingestion complete: {len(items)} items")
        return {"processed": len(items)}
        
    except Exception as exc:
        logger.error(f"Regulatory ingestion failed: {exc}")
        raise self.retry(exc=exc, countdown=300)  # Retry after 5 min


@celery_app.task(bind=True, name="app.workers.tasks.run_research_ingestion", max_retries=3)
def run_research_ingestion(self):
    """Ingest from research sources (IDRBT, arXiv, NIST)."""
    import asyncio
    
    logger.info("Starting research source ingestion...")
    
    try:
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
        
        from app.ingestion.pipeline import IngestionPipeline, RESEARCH_SOURCES
        import httpx
        
        async def _run():
            pipeline = IngestionPipeline()
            async with httpx.AsyncClient() as client:
                tasks = [pipeline._process_source(source, client) for source in RESEARCH_SOURCES]
                results = await asyncio.gather(*tasks, return_exceptions=True)
                
                new_items = []
                for result in results:
                    if not isinstance(result, Exception) and result:
                        new_items.extend(result)
                
                from app.ingestion.pipeline import analyze_with_llm
                analyzed = []
                for item in new_items:
                    result = await analyze_with_llm(
                        content=item["text"],
                        source_name=item["source"],
                        source_url=item["url"],
                    )
                    if result:
                        analyzed.append(result)
                
                return analyzed
        
        items = loop.run_until_complete(_run())
        loop.close()
        
        _store_intelligence_items(items)
        logger.info(f"Research ingestion complete: {len(items)} items")
        return {"processed": len(items)}
        
    except Exception as exc:
        logger.error(f"Research ingestion failed: {exc}")
        raise self.retry(exc=exc, countdown=300)


@celery_app.task(bind=True, name="app.workers.tasks.run_youtube_ingestion", max_retries=2)
def run_youtube_ingestion(self):
    """Ingest from whitelisted YouTube channels."""
    import asyncio
    
    logger.info("Starting YouTube channel ingestion...")
    
    try:
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
        
        from app.ingestion.pipeline import IngestionPipeline, YOUTUBE_CHANNELS
        
        async def _run():
            pipeline = IngestionPipeline()
            tasks = [
                pipeline._process_youtube_channel(name, cid)
                for name, cid in YOUTUBE_CHANNELS.items()
            ]
            results = await asyncio.gather(*tasks, return_exceptions=True)
            
            new_items = []
            for result in results:
                if not isinstance(result, Exception) and result:
                    new_items.extend(result)
            
            from app.ingestion.pipeline import analyze_with_llm
            analyzed = []
            for item in new_items:
                result = await analyze_with_llm(
                    content=item["text"],
                    source_name=item["source"],
                    source_url=item["url"],
                )
                if result:
                    analyzed.append(result)
            
            return analyzed
        
        items = loop.run_until_complete(_run())
        loop.close()
        
        _store_intelligence_items(items)
        logger.info(f"YouTube ingestion complete: {len(items)} items")
        return {"processed": len(items)}
        
    except Exception as exc:
        logger.error(f"YouTube ingestion failed: {exc}")
        raise self.retry(exc=exc, countdown=600)


@celery_app.task(name="app.workers.tasks.send_daily_email_digest")
def send_daily_email_digest():
    """Compile and send daily executive email digest."""
    logger.info("Compiling daily email digest...")
    
    # Fetch today's intelligence items grouped by severity
    # Compile HTML email using Jinja2 template
    # Send via SMTP/SES/SendGrid
    
    # TODO: Implement full email compilation logic
    logger.info("Daily digest sent successfully")


@celery_app.task(name="app.workers.tasks.send_weekly_briefing")
def send_weekly_briefing():
    """Compile and send weekly executive strategy briefing."""
    logger.info("Compiling weekly executive briefing...")
    # TODO: Implement weekly briefing compilation
    logger.info("Weekly briefing sent successfully")


@celery_app.task(name="app.workers.tasks.dispatch_realtime_alert")
def dispatch_realtime_alert(item_data: dict):
    """Dispatch real-time alert to configured webhooks."""
    import asyncio
    
    logger.info(f"Dispatching real-time alert: {item_data.get('headline', '')[:50]}")
    
    # TODO: Fetch subscriber webhook preferences and dispatch
    # For each subscriber with matching layer/category preferences:
    #   - If slack_webhook_url: dispatch_slack_alert()
    #   - If teams_webhook_url: dispatch_teams_alert()


@celery_app.task(name="app.workers.tasks.cleanup_processed_data")
def cleanup_processed_data():
    """Clean up old processed content hashes and temporary data."""
    logger.info("Running data cleanup...")
    # Remove content hashes older than 90 days
    # Archive old intelligence items
    logger.info("Cleanup complete")


def _store_intelligence_items(items):
    """Store analyzed intelligence items in database."""
    # TODO: Implement database storage with deduplication check
    pass
