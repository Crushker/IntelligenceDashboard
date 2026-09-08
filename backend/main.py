"""
NBFC Intelligence Platform - Backend API
FastAPI Application with Enterprise Security

Compliant with: RBI IT Governance 2023, DPDP Act 2023, CERT-In, OWASP Top 10
"""

from fastapi import FastAPI, Depends, HTTPException, status, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi.responses import JSONResponse
from slowapi import Limiter
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from contextlib import asynccontextmanager
import uvicorn

from app.core.config import settings
from app.core.security import verify_token, hash_password
from app.core.database import engine, Base
from app.api.v1.router import api_router
from app.middleware.security_headers import SecurityHeadersMiddleware

# Rate limiter
limiter = Limiter(key_func=get_remote_address)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan events."""
    # Startup: Create tables, initialize Redis pool
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    yield
    # Shutdown: Close connections
    await engine.dispose()


# FastAPI Application
app = FastAPI(
    title="NBFC Intelligence Platform API",
    description="Enterprise-grade intelligence ingestion and subscription API for Indian NBFC CIOs",
    version="2.0.0",
    docs_url="/api/docs" if settings.ENVIRONMENT == "development" else None,
    redoc_url="/api/redoc" if settings.ENVIRONMENT == "development" else None,
    lifespan=lifespan,
)

# Middleware Stack (order matters - outermost first)
app.add_middleware(
    SecurityHeadersMiddleware,  # HSTS, CSP, X-Frame-Options, etc.
)
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "PATCH"],
    allow_headers=["Authorization", "Content-Type", "X-CSRF-Token"],
    expose_headers=["X-Request-ID"],
    max_age=3600,
)
app.add_middleware(
    TrustedHostMiddleware,
    allowed_hosts=settings.ALLOWED_HOSTS,
)

# Rate limiting
app.state.limiter = limiter


@app.exception_handler(RateLimitExceeded)
async def rate_limit_handler(request: Request, exc: RateLimitExceeded):
    return JSONResponse(
        status_code=429,
        content={"detail": "Rate limit exceeded. Please retry after cooldown."},
        headers={"Retry-After": str(exc.detail.get("retry_after", 60))},
    )


# Include API routes
app.include_router(api_router, prefix="/api/v1")


# Health check
@app.get("/health", tags=["System"])
async def health_check():
    return {"status": "healthy", "version": "2.0.0", "environment": settings.ENVIRONMENT}


if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        workers=4,
        log_level="info",
        access_log=True,
    )
