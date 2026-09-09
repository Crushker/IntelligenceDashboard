# NBFC Intelligence Platform

> Enterprise-grade Autonomous Intelligence Ingestion & Subscription Portal for Indian NBFC CIOs

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────────┐
│                        NBFC INTELLIGENCE PLATFORM                        │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────────────────┐  │
│  │   Frontend   │    │   Backend    │    │   Ingestion Pipeline     │  │
│  │  (React/Vite)│◄──►│  (FastAPI)   │◄──►│  (Async Python)         │  │
│  │              │    │              │    │                          │  │
│  │ • Dashboard  │    │ • Auth (JWT) │    │ • RBI/CERT-In Scraping  │  │
│  │ • Intel Feed │    │ • RBAC       │    │ • YouTube Transcript    │  │
│  │ • Video Hub  │    │ • REST API   │    │ • LLM Analysis (GPT-4)  │  │
│  │ • Settings   │    │ • WebSocket  │    │ • Deduplication         │  │
│  └──────────────┘    └──────────────┘    └──────────────────────────┘  │
│         │                    │                         │                 │
│         ▼                    ▼                         ▼                 │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │                    Data Layer                                     │  │
│  │  ┌────────────┐  ┌────────────┐  ┌──────────────────────────┐  │  │
│  │  │ PostgreSQL │  │   Redis    │  │  Celery + Beat           │  │  │
│  │  │    16      │  │   7.x     │  │  (Task Queue)            │  │  │
│  │  └────────────┘  └────────────┘  └──────────────────────────┘  │  │
│  └──────────────────────────────────────────────────────────────────┘  │
│                                                                          │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │                    Delivery Layer                                 │  │
│  │  ┌────────────┐  ┌────────────┐  ┌──────────────────────────┐  │  │
│  │  │  Email     │  │   Slack    │  │  Microsoft Teams         │  │  │
│  │  │  (SES)     │  │  Webhook   │  │  Webhook                 │  │  │
│  │  └────────────┘  └────────────┘  └──────────────────────────┘  │  │
│  └──────────────────────────────────────────────────────────────────┘  │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

## Directory Structure

```
.
├── index.html                          # Frontend entry point
├── src/                                # React Frontend
│   ├── App.tsx                         # Main app with routing & auth context
│   ├── index.css                       # Global styles & theme
│   ├── main.tsx                        # React entry
│   ├── data/
│   │   └── mockData.ts                 # Intelligence feed & video mock data
│   ├── pages/
│   │   ├── Landing.tsx                 # Public landing page
│   │   ├── Login.tsx                   # Authentication page
│   │   ├── Dashboard.tsx               # Executive dashboard
│   │   ├── IntelligenceFeed.tsx        # Filtered intelligence feed
│   │   ├── VideoHub.tsx               # Video masterclass hub
│   │   ├── Subscription.tsx           # Subscription management
│   │   └── Settings.tsx               # User preferences & DPDP
│   └── components/
│       └── Layout.tsx                  # Authenticated layout with sidebar
│
├── backend/                            # FastAPI Backend
│   ├── main.py                        # Application entry point
│   ├── Dockerfile                     # Multi-stage production build
│   ├── requirements.txt               # Python dependencies
│   ├── migrations/
│   │   └── init.sql                   # PostgreSQL schema + RLS
│   └── app/
│       ├── core/
│       │   ├── config.py              # Pydantic settings
│       │   ├── security.py            # Auth, JWT, Argon2id, RBAC
│       │   └── database.py            # Async SQLAlchemy engine
│       ├── models/
│       │   └── models.py             # ORM models (User, Intelligence, etc.)
│       ├── api/v1/
│       │   ├── router.py             # API route registration
│       │   └── endpoints/
│       │       ├── auth.py           # Login, Register, SSO, CSRF
│       │       ├── intelligence.py   # Feed, Search, Stats
│       │       ├── subscriptions.py  # Preferences, Plans, DPDP erasure
│       │       ├── users.py          # User management
│       │       └── webhooks.py       # Slack/Teams dispatch
│       ├── ingestion/
│       │   └── pipeline.py           # Async scraping & LLM analysis
│       ├── workers/
│       │   └── tasks.py              # Celery tasks & scheduling
│       └── middleware/
│           └── security_headers.py   # HSTS, CSP, OWASP headers
│
├── nginx/
│   └── nginx.conf                    # TLS 1.3, rate limiting, security
│
├── docker-compose.production.yml     # Full production orchestration
├── .env.example                      # Environment template
└── README.md                         # This file
```

## Compliance Matrix

| Regulation | Implementation |
|---|---|
| **RBI IT Governance 2023** | SOC 2 controls, SIEM integration, audit trails |
| **DPDP Act 2023** | Consent tracking, right-to-erasure, data portability |
| **CERT-In Guidelines** | 6-hour incident reporting, vulnerability feeds |
| **OWASP Top 10** | Argon2id, CSRF, CSP, rate limiting, input validation |
| **RBI Scale-Based Reg** | Base/Middle/Upper/Top layer filtering per Master Direction |

## Quick Start

### Frontend (Development)
```bash
npm install
npm run dev
```

### Full Stack (Production)
```bash
cp .env.example .env
# Edit .env with your credentials
docker compose -f docker-compose.production.yml up -d
```

## Key Features

### Intelligence Ingestion Engine
- **12+ Authoritative Sources**: RBI, CERT-In, SEBI, MeitY, NPCI, Sahamati, IDRBT, arXiv, NIST
- **Whitelisted YouTube Channels**: IDRBT, NPCI, USENIX, Black Hat, AWS Architecture, Two Minute Papers
- **LLM Cognitive Analysis**: GPT-4 powered extraction of CIO action items
- **Deduplication**: SHA-256 content hashing with PostgreSQL tracking
- **Async Pipeline**: 6-hour cycles with exponential backoff

### Enterprise Web Portal
- **Executive Dashboard**: Critical alerts ticker, severity-coded intelligence, compliance deadlines
- **Intelligence Feed**: Filtered by NBFC layer, category, relevance score
- **Video Hub**: AI-generated summaries with architecture notes
- **Subscription Engine**: Multi-tier plans with usage tracking
- **Settings**: Granular preferences, webhook configuration, DPDP controls

### Security Architecture
- **Authentication**: JWT + Argon2id + SSO (OIDC/SAML)
- **RBAC**: SuperAdmin, EnterpriseCIO, Subscriber roles
- **Zero-Trust**: Network isolation, RLS in PostgreSQL, encrypted at rest
- **Rate Limiting**: Redis-backed slowapi on all endpoints
- **Security Headers**: HSTS, CSP, X-Frame-Options, CORS hardening

## License

Proprietary - NBFC Intelligence Platform © 2026
