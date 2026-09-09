"""
Autonomous Intelligence Ingestion Engine
Async scraping and NLP pipeline for regulatory, research, and video sources

Sources:
- RBI, CERT-In, SEBI, MeitY, UIDAI, NPCI, Sahamati
- IDRBT, arXiv, NASSCOM, DSCI
- Whitelisted YouTube channels (IDRBT, NPCI, USENIX, Black Hat, AWS, Two Minute Papers)
"""

import asyncio
import hashlib
import logging
from datetime import datetime, timezone
from typing import List, Optional, Dict, Any
from uuid import uuid4

import httpx
import feedparser
from bs4 import BeautifulSoup
from pydantic import BaseModel, Field

logger = logging.getLogger(__name__)


# ─── LLM Analysis Output Schema ────────────────────────────────────────────

class LLMIntelligenceOutput(BaseModel):
    """Strict Pydantic model for LLM-analyzed intelligence items."""
    id: str = Field(default_factory=lambda: str(uuid4()))
    category: str  # Literal['Regulatory', 'Cyber-Threat', 'Infra-Architecture', 'Frontier-Tech', 'Video-Masterclass', 'Networking-Event']
    headline: str
    source_authority: str
    source_url: str
    applicable_nbfc_layers: List[str]  # ['Base', 'Middle', 'Upper', 'Top', 'All']
    technical_summary: str
    cio_actionable_directive: str
    severity_or_relevance_score: int = Field(ge=1, le=10)
    published_at: str  # ISO timestamp


# ─── Executive System Prompt for LLM ────────────────────────────────────────

EXECUTIVE_SYSTEM_PROMPT = """You are an Elite Enterprise Architect & Strategic Advisor to an Indian NBFC CIO. 
Analyze the raw text/transcripts provided. Drop all superficial PR, consumer hype, and mainstream market filler.

For every high-signal item, extract:
1. Operational & Architectural Impact: Core banking/lending impact, latency implications, technical debt, or infrastructure modernization needs.
2. Compliance & Threat Mapping: Explicit impact mapped to RBI Scale-Based regulations (Base/Middle/Upper/Top layer) or CERT-In directives.
3. Concrete CIO Action Item: What specific technical task must be delegated immediately.

Output MUST be valid JSON matching this schema:
{
    "category": "Regulatory|Cyber-Threat|Infra-Architecture|Frontier-Tech|Video-Masterclass|Networking-Event",
    "headline": "Concise technical title",
    "source_authority": "Source name",
    "source_url": "Verified URL",
    "applicable_nbfc_layers": ["Base", "Middle", "Upper", "Top", "All"],
    "technical_summary": "Granular mechanics of the circular/CVE/paper",
    "cio_actionable_directive": "Direct strategic next step",
    "severity_or_relevance_score": 1-10,
    "published_at": "ISO timestamp"
}

If the content has no enterprise-grade signal for an NBFC CIO, return: {"skip": true, "reason": "..."}.
"""


# ─── Source Registry ────────────────────────────────────────────────────────

class SourceConfig(BaseModel):
    name: str
    url: str
    source_type: str  # rss, api, scrape, youtube
    category: str
    frequency_hours: int = 6
    priority: int = 5  # 1-10


REGULATORY_SOURCES: List[SourceConfig] = [
    SourceConfig(
        name="RBI Notifications",
        url="https://www.rbi.org.in/Scripts/NotificationUser.aspx",
        source_type="scrape",
        category="Regulatory",
        frequency_hours=4,
        priority=10,
    ),
    SourceConfig(
        name="RBI Master Directions",
        url="https://www.rbi.org.in/Scripts/BS_View-MasterDirections.aspx",
        source_type="scrape",
        category="Regulatory",
        frequency_hours=12,
        priority=10,
    ),
    SourceConfig(
        name="CERT-In Advisories",
        url="https://www.cert-in.org.in/Content/Advisory.aspx",
        source_type="scrape",
        category="Cyber-Threat",
        frequency_hours=2,
        priority=10,
    ),
    SourceConfig(
        name="SEBI Circulars",
        url="https://www.sebi.gov.in/sebi_data/ circulars.html",
        source_type="scrape",
        category="Regulatory",
        frequency_hours=12,
        priority=7,
    ),
    SourceConfig(
        name="MeitY DPDP Updates",
        url="https://meity.gov.in/writereaddata/files/Digital%20Personal%20Data%20Protection%20Act%202023.pdf",
        source_type="scrape",
        category="Regulatory",
        frequency_hours=24,
        priority=9,
    ),
    SourceConfig(
        name="NPCI Updates",
        url="https://www.npci.org.in/what-we-do/ocen",
        source_type="scrape",
        category="Infra-Architecture",
        frequency_hours=8,
        priority=8,
    ),
    SourceConfig(
        name="Sahamati AA Updates",
        url="https://sahamati.org.in/blog",
        source_type="rss",
        category="Infra-Architecture",
        frequency_hours=12,
        priority=7,
    ),
]

RESEARCH_SOURCES: List[SourceConfig] = [
    SourceConfig(
        name="IDRBT Research",
        url="https://idrbt.ac.in/publications",
        source_type="scrape",
        category="Frontier-Tech",
        frequency_hours=24,
        priority=8,
    ),
    SourceConfig(
        name="arXiv Cryptography",
        url="https://rss.arxiv.org/rss/cs.CR",
        source_type="rss",
        category="Frontier-Tech",
        frequency_hours=6,
        priority=6,
    ),
    SourceConfig(
        name="NIST PQC Updates",
        url="https://csrc.nist.gov/news",
        source_type="rss",
        category="Frontier-Tech",
        frequency_hours=24,
        priority=7,
    ),
]

# Whitelisted YouTube Channel IDs - ONLY technical deep-dives
YOUTUBE_CHANNELS: Dict[str, str] = {
    "IDRBT Official": "UCidrbt123456789",
    "NPCI Official": "UCnpci987654321",
    "Two Minute Papers": "UCbfYPyITQ-7l4upoX8nvctg",
    "USENIX": "UCIH3Wo4zduMIBg6sIHp1K3A",
    "Black Hat": "UC0hZSkGP8t0XjI7zNfIgpSA",
    "AWS Architecture": "UCklKm9DfWZxGnSgK7YnHLgA",
    "GCP Architecture": "UCfLwGPYurB77xSv0jT3F4Vw",
}


# ─── Content Hashing for Deduplication ──────────────────────────────────────

def compute_content_hash(content: str) -> str:
    """Compute SHA-256 hash for deduplication."""
    normalized = content.strip().lower()
    return hashlib.sha256(normalized.encode()).hexdigest()


# ─── RSS Feed Parser ────────────────────────────────────────────────────────

async def fetch_rss_feed(url: str, client: httpx.AsyncClient) -> List[Dict[str, Any]]:
    """Fetch and parse RSS/Atom feed."""
    try:
        response = await client.get(url, timeout=30)
        response.raise_for_status()
        feed = feedparser.parse(response.text)
        
        items = []
        for entry in feed.entries[:20]:  # Last 20 entries
            items.append({
                "title": entry.get("title", ""),
                "link": entry.get("link", ""),
                "summary": entry.get("summary", ""),
                "published": entry.get("published", ""),
                "content": entry.get("content", [{}])[0].get("value", "") if entry.get("content") else "",
            })
        
        return items
    except Exception as e:
        logger.error(f"RSS fetch error for {url}: {e}")
        return []


# ─── Web Scraper ────────────────────────────────────────────────────────────

async def scrape_webpage(url: str, client: httpx.AsyncClient) -> str:
    """Scrape webpage content with proper headers."""
    headers = {
        "User-Agent": "NBFCIntel-Bot/2.0 (Enterprise Intelligence Platform; contact@nbfcintel.in)",
        "Accept": "text/html,application/xhtml+xml",
        "Accept-Language": "en-IN,en;q=0.9",
    }
    
    try:
        response = await client.get(url, headers=headers, timeout=30, follow_redirects=True)
        response.raise_for_status()
        
        soup = BeautifulSoup(response.text, "html.parser")
        
        # Remove scripts, styles, nav
        for element in soup(["script", "style", "nav", "footer", "header"]):
            element.decompose()
        
        # Extract main content
        main_content = soup.find("main") or soup.find("article") or soup.find("body")
        text = main_content.get_text(separator="\n", strip=True) if main_content else ""
        
        return text[:10000]  # Limit to 10K chars for LLM processing
    except Exception as e:
        logger.error(f"Scrape error for {url}: {e}")
        return ""


# ─── YouTube Transcript Fetcher ─────────────────────────────────────────────

async def fetch_youtube_transcript(video_id: str) -> Optional[str]:
    """Fetch YouTube video transcript/captions."""
    try:
        # Using youtube-transcript-api
        from youtube_transcript_api import YouTubeTranscriptApi
        
        transcript_list = YouTubeTranscriptApi.list_transcripts(video_id)
        
        # Prefer English, then auto-generated
        try:
            transcript = transcript_list.find_transcript(["en"])
        except:
            transcript = transcript_list.find_generated_transcript(["en"])
        
        # Fetch and combine transcript segments
        fetched = transcript.fetch()
        full_text = " ".join([segment["text"] for segment in fetched])
        
        return full_text[:15000]  # Limit for LLM
    except Exception as e:
        logger.error(f"YouTube transcript error for {video_id}: {e}")
        return None


# ─── LLM Analysis Engine ───────────────────────────────────────────────────

async def analyze_with_llm(content: str, source_name: str, source_url: str) -> Optional[LLMIntelligenceOutput]:
    """
    Analyze raw content using LLM with executive system prompt.
    Returns structured intelligence item or None if low-signal.
    """
    try:
        import openai
        
        client = openai.AsyncOpenAI()
        
        response = await client.chat.completions.create(
            model="gpt-4-turbo-preview",
            temperature=0.1,
            max_tokens=4096,
            messages=[
                {"role": "system", "content": EXECUTIVE_SYSTEM_PROMPT},
                {"role": "user", "content": f"Source: {source_name} ({source_url})\n\nContent:\n{content}"},
            ],
            response_format={"type": "json_object"},
        )
        
        import json
        result = json.loads(response.choices[0].message.content)
        
        # Check if LLM flagged as low-signal
        if result.get("skip"):
            logger.info(f"LLM skipped low-signal content from {source_name}: {result.get('reason')}")
            return None
        
        # Validate and construct output
        output = LLMIntelligenceOutput(
            category=result["category"],
            headline=result["headline"],
            source_authority=source_name,
            source_url=source_url,
            applicable_nbfc_layers=result["applicable_nbfc_layers"],
            technical_summary=result["technical_summary"],
            cio_actionable_directive=result["cio_actionable_directive"],
            severity_or_relevance_score=result["severity_or_relevance_score"],
            published_at=result.get("published_at", datetime.now(timezone.utc).isoformat()),
        )
        
        return output
        
    except Exception as e:
        logger.error(f"LLM analysis error: {e}")
        return None


# ─── Main Ingestion Pipeline ───────────────────────────────────────────────

class IngestionPipeline:
    """Main async ingestion pipeline orchestrator."""
    
    def __init__(self):
        self.processed_hashes: set = set()
    
    async def run_full_cycle(self):
        """Execute complete ingestion cycle across all sources."""
        logger.info("Starting full ingestion cycle...")
        
        async with httpx.AsyncClient() as client:
            # Phase 1: Fetch raw content from all sources
            tasks = []
            
            # Regulatory sources
            for source in REGULATORY_SOURCES:
                tasks.append(self._process_source(source, client))
            
            # Research sources
            for source in RESEARCH_SOURCES:
                tasks.append(self._process_source(source, client))
            
            # YouTube channels
            for channel_name, channel_id in YOUTUBE_CHANNELS.items():
                tasks.append(self._process_youtube_channel(channel_name, channel_id))
            
            # Execute all fetch tasks concurrently
            results = await asyncio.gather(*tasks, return_exceptions=True)
            
            # Phase 2: Deduplicate and filter
            new_items = []
            for result in results:
                if isinstance(result, Exception):
                    logger.error(f"Source processing error: {result}")
                    continue
                if result:
                    new_items.extend(result)
            
            # Phase 3: LLM Analysis
            analyzed_items = []
            for item_content in new_items:
                analyzed = await analyze_with_llm(
                    content=item_content["text"],
                    source_name=item_content["source"],
                    source_url=item_content["url"],
                )
                if analyzed:
                    analyzed_items.append(analyzed)
            
            logger.info(f"Ingestion cycle complete. {len(analyzed_items)} new intelligence items produced.")
            return analyzed_items
    
    async def _process_source(self, source: SourceConfig, client: httpx.AsyncClient) -> List[Dict]:
        """Process a single source (RSS or scrape)."""
        items = []
        
        if source.source_type == "rss":
            feed_items = await fetch_rss_feed(source.url, client)
            for entry in feed_items:
                content_hash = compute_content_hash(entry.get("title", "") + entry.get("summary", ""))
                if content_hash not in self.processed_hashes:
                    self.processed_hashes.add(content_hash)
                    items.append({
                        "text": f"{entry['title']}\n\n{entry.get('summary', '')}\n\n{entry.get('content', '')}",
                        "source": source.name,
                        "url": entry.get("link", source.url),
                        "hash": content_hash,
                    })
        
        elif source.source_type == "scrape":
            content = await scrape_webpage(source.url, client)
            if content:
                content_hash = compute_content_hash(content)
                if content_hash not in self.processed_hashes:
                    self.processed_hashes.add(content_hash)
                    items.append({
                        "text": content,
                        "source": source.name,
                        "url": source.url,
                        "hash": content_hash,
                    })
        
        return items
    
    async def _process_youtube_channel(self, channel_name: str, channel_id: str) -> List[Dict]:
        """Process YouTube channel for new technical videos."""
        items = []
        
        try:
            # Fetch channel RSS feed
            rss_url = f"https://www.youtube.com/feeds/videos.xml?channel_id={channel_id}"
            
            async with httpx.AsyncClient() as client:
                feed_items = await fetch_rss_feed(rss_url, client)
                
                for entry in feed_items[:5]:  # Last 5 videos
                    video_id = entry.get("link", "").split("v=")[-1] if "v=" in entry.get("link", "") else ""
                    
                    if not video_id:
                        continue
                    
                    # Fetch transcript
                    transcript = await fetch_youtube_transcript(video_id)
                    
                    if transcript:
                        content_hash = compute_content_hash(transcript[:500])
                        if content_hash not in self.processed_hashes:
                            self.processed_hashes.add(content_hash)
                            items.append({
                                "text": f"Video Title: {entry['title']}\n\nTranscript:\n{transcript}",
                                "source": f"{channel_name} (YouTube)",
                                "url": entry.get("link", f"https://youtube.com/watch?v={video_id}"),
                                "hash": content_hash,
                                "video_id": video_id,
                            })
        except Exception as e:
            logger.error(f"YouTube channel processing error for {channel_name}: {e}")
        
        return items


# ─── Celery Task Integration ────────────────────────────────────────────────

async def run_ingestion_task():
    """Entry point for Celery scheduled task."""
    pipeline = IngestionPipeline()
    results = await pipeline.run_full_cycle()
    
    # Store results in database
    # (Implementation depends on DB session injection in Celery worker)
    return {"processed": len(results), "timestamp": datetime.now(timezone.utc).isoformat()}
