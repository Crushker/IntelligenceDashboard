import { Shield, Database, Brain, Globe, Server, Lock, Cpu, ArrowRight, Layers, Zap, GitBranch, Cloud, Key, FileCode } from 'lucide-react';

export function Architecture() {
  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-white">Platform Architecture</h1>
        <p className="text-sm text-navy-400 mt-1">Production-grade system design for regulated BFSI intelligence ingestion and delivery</p>
      </div>

      {/* High-Level Architecture Diagram */}
      <div className="glass-card rounded-xl p-6">
        <h2 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
          <Layers className="w-5 h-5 text-accent-gold" /> High-Level System Architecture
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3 items-center">
          {/* Sources */}
          <div className="bg-navy-800/60 rounded-xl p-4 border border-accent-blue/20">
            <div className="flex items-center gap-2 mb-3">
              <Globe className="w-4 h-4 text-accent-blue" />
              <span className="text-xs font-bold text-accent-blue uppercase">Sources</span>
            </div>
            <ul className="space-y-1.5">
              {['RBI Portal', 'CERT-In RSS', 'NPCI APIs', 'YouTube RSS', 'arXiv Feed', 'IDRBT', 'Sahamati'].map(s => (
                <li key={s} className="text-[10px] text-navy-300 flex items-center gap-1.5">
                  <div className="w-1 h-1 rounded-full bg-accent-blue" />{s}
                </li>
              ))}
            </ul>
          </div>

          <ArrowRight className="w-4 h-4 text-navy-600 mx-auto hidden md:block" />

          {/* Ingestion */}
          <div className="bg-navy-800/60 rounded-xl p-4 border border-accent-purple/20">
            <div className="flex items-center gap-2 mb-3">
              <Cpu className="w-4 h-4 text-accent-purple" />
              <span className="text-xs font-bold text-accent-purple uppercase">Ingestion</span>
            </div>
            <ul className="space-y-1.5">
              {['Playwright Scraper', 'Feedparser', 'yt-dlp', 'httpx Async', 'Celery Workers', 'Redis Queue', 'Dedup Engine'].map(s => (
                <li key={s} className="text-[10px] text-navy-300 flex items-center gap-1.5">
                  <div className="w-1 h-1 rounded-full bg-accent-purple" />{s}
                </li>
              ))}
            </ul>
          </div>

          <ArrowRight className="w-4 h-4 text-navy-600 mx-auto hidden md:block" />

          {/* Analysis */}
          <div className="bg-navy-800/60 rounded-xl p-4 border border-accent-gold/20">
            <div className="flex items-center gap-2 mb-3">
              <Brain className="w-4 h-4 text-accent-gold" />
              <span className="text-xs font-bold text-accent-gold uppercase">LLM Analysis</span>
            </div>
            <ul className="space-y-1.5">
              {['GPT-4 / Claude', 'Pydantic Schema', 'Scoring Engine', 'Layer Mapper', 'Dedup (SHA-256)', 'NLP Pipeline', 'Output Validator'].map(s => (
                <li key={s} className="text-[10px] text-navy-300 flex items-center gap-1.5">
                  <div className="w-1 h-1 rounded-full bg-accent-gold" />{s}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Second Row */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3 items-center mt-4">
          <div className="md:col-start-1 bg-navy-800/60 rounded-xl p-4 border border-accent-green/20">
            <div className="flex items-center gap-2 mb-3">
              <Database className="w-4 h-4 text-accent-green" />
              <span className="text-xs font-bold text-accent-green uppercase">Storage</span>
            </div>
            <ul className="space-y-1.5">
              {['PostgreSQL 16', 'Redis Cache', 'pg_trgm Index', 'JSONB Schemas', 'Row-Level Security', 'AES-256 Encryption', 'Backup (WAL-G)'].map(s => (
                <li key={s} className="text-[10px] text-navy-300 flex items-center gap-1.5">
                  <div className="w-1 h-1 rounded-full bg-accent-green" />{s}
                </li>
              ))}
            </ul>
          </div>

          <ArrowRight className="w-4 h-4 text-navy-600 mx-auto hidden md:block" />

          <div className="bg-navy-800/60 rounded-xl p-4 border border-accent-red/20">
            <div className="flex items-center gap-2 mb-3">
              <Server className="w-4 h-4 text-accent-red" />
              <span className="text-xs font-bold text-accent-red uppercase">API Layer</span>
            </div>
            <ul className="space-y-1.5">
              {['FastAPI Backend', 'JWT + OIDC Auth', 'RBAC Middleware', 'Rate Limiting', 'CORS + CSP', 'Security Headers', 'OpenAPI Spec'].map(s => (
                <li key={s} className="text-[10px] text-navy-300 flex items-center gap-1.5">
                  <div className="w-1 h-1 rounded-full bg-accent-red" />{s}
                </li>
              ))}
            </ul>
          </div>

          <ArrowRight className="w-4 h-4 text-navy-600 mx-auto hidden md:block" />

          <div className="bg-navy-800/60 rounded-xl p-4 border border-amber-500/20">
            <div className="flex items-center gap-2 mb-3">
              <Zap className="w-4 h-4 text-amber-400" />
              <span className="text-xs font-bold text-amber-400 uppercase">Delivery</span>
            </div>
            <ul className="space-y-1.5">
              {['React Dashboard', 'Email (SES/SMTP)', 'Slack Webhooks', 'Teams Cards', 'Jinja2 Templates', 'Celery Beat', 'Idempotent Dispatch'].map(s => (
                <li key={s} className="text-[10px] text-navy-300 flex items-center gap-1.5">
                  <div className="w-1 h-1 rounded-full bg-amber-400" />{s}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Backend Architecture */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="glass-card rounded-xl p-6">
          <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
            <FileCode className="w-4 h-4 text-accent-gold" /> Backend Stack (FastAPI)
          </h3>
          <div className="space-y-3">
            {[
              { label: 'Framework', value: 'FastAPI 0.109+ with async endpoints' },
              { label: 'ORM', value: 'SQLModel / SQLAlchemy 2.0 (async)' },
              { label: 'Auth', value: 'JWT (RS256) + OIDC/SAML SSO' },
              { label: 'Password Hash', value: 'Argon2id (memory-hard)' },
              { label: 'Rate Limiting', value: 'slowapi + Redis (100 req/min)' },
              { label: 'Task Queue', value: 'Celery 5.3 + Redis broker' },
              { label: 'Scheduler', value: 'Celery Beat (cron-like)' },
              { label: 'Validation', value: 'Pydantic v2 + Instructor' },
              { label: 'Migrations', value: 'Alembic (auto-generated)' },
              { label: 'Testing', value: 'pytest + httpx (async tests)' },
            ].map(item => (
              <div key={item.label} className="flex items-center justify-between py-1.5 border-b border-navy-700/30 last:border-0">
                <span className="text-xs text-navy-400">{item.label}</span>
                <span className="text-xs text-navy-200 font-medium">{item.value}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-card rounded-xl p-6">
          <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
            <Cloud className="w-4 h-4 text-accent-blue" /> Frontend Stack (React/Next.js)
          </h3>
          <div className="space-y-3">
            {[
              { label: 'Framework', value: 'Next.js 14 (App Router)' },
              { label: 'UI Library', value: 'React 18 + TypeScript 5.3' },
              { label: 'Styling', value: 'Tailwind CSS 3.4 + shadcn/ui' },
              { label: 'State', value: 'Zustand + React Query' },
              { label: 'Charts', value: 'Recharts + D3.js' },
              { label: 'Forms', value: 'React Hook Form + Zod' },
              { label: 'Auth', value: 'NextAuth.js (OIDC/SAML)' },
              { label: 'API Client', value: 'Axios + interceptors' },
              { label: 'Real-time', value: 'WebSocket + SSE' },
              { label: 'Testing', value: 'Vitest + Playwright E2E' },
            ].map(item => (
              <div key={item.label} className="flex items-center justify-between py-1.5 border-b border-navy-700/30 last:border-0">
                <span className="text-xs text-navy-400">{item.label}</span>
                <span className="text-xs text-navy-200 font-medium">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Security Architecture */}
      <div className="glass-card rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
          <Lock className="w-5 h-5 text-accent-red" /> Zero-Trust Security Architecture
        </h3>
        
        <div className="grid md:grid-cols-3 gap-6">
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-accent-red uppercase tracking-wider">Authentication & Identity</h4>
            <div className="space-y-2">
              {[
                'JWT RS256 tokens (15min expiry)',
                'Refresh token rotation',
                'Argon2id password hashing',
                'OIDC/SAML SSO integration',
                'MFA (TOTP + WebAuthn)',
                'Session binding (IP + UA)',
                'Corporate SSO (Entra/Google)',
              ].map(item => (
                <div key={item} className="flex items-center gap-2 text-xs text-navy-300">
                  <Key className="w-3 h-3 text-accent-red flex-shrink-0" />
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-xs font-bold text-accent-amber uppercase tracking-wider">Network & Transport</h4>
            <div className="space-y-2">
              {[
                'TLS 1.3 only (no fallback)',
                'HSTS preload (2 years)',
                'CSP strict-dynamic',
                'X-Frame-Options: DENY',
                'X-Content-Type: nosniff',
                'Referrer-Policy: strict-origin',
                'Nginx rate limiting (10 req/s)',
              ].map(item => (
                <div key={item} className="flex items-center gap-2 text-xs text-navy-300">
                  <Shield className="w-3 h-3 text-accent-amber flex-shrink-0" />
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-xs font-bold text-accent-green uppercase tracking-wider">Data Protection (DPDP)</h4>
            <div className="space-y-2">
              {[
                'AES-256 encryption at rest',
                'Consent tracking (timestamped)',
                'Right-to-erasure endpoint',
                'Data minimization by design',
                'Purpose limitation enforced',
                'Retention policies (auto-purge)',
                'Cryptographic audit trail',
              ].map(item => (
                <div key={item} className="flex items-center gap-2 text-xs text-navy-300">
                  <Lock className="w-3 h-3 text-accent-green flex-shrink-0" />
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Data Model */}
      <div className="glass-card rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
          <Database className="w-5 h-5 text-accent-green" /> Core Data Model (Pydantic Schema)
        </h3>
        
        <div className="bg-navy-950/80 rounded-lg p-4 border border-navy-700/30 overflow-x-auto">
          <pre className="text-xs text-navy-200 font-mono leading-relaxed">
{`class IntelligenceItem(BaseModel):
    """LLM-validated intelligence output schema"""
    id: UUID                          # Auto-generated
    category: Literal[
        'Regulatory', 'Cyber-Threat', 'Infra-Architecture',
        'Frontier-Tech', 'Video-Masterclass', 'Networking-Event'
    ]
    headline: str = Field(max_length=200)
    source_authority: str             # e.g., "Reserve Bank of India"
    source_url: HttpUrl              # Verified source URL
    applicable_nbfc_layers: List[Literal['Base', 'Middle', 'Upper', 'Top', 'All']]
    technical_summary: str           # Granular technical analysis
    cio_actionable_directive: str    # Concrete action item
    severity_or_relevance_score: int = Field(ge=1, le=10)
    published_at: datetime           # ISO 8601 timestamp
    content_hash: str                # SHA-256 for deduplication
    ingested_at: datetime            # Pipeline ingestion timestamp
    llm_model: str                   # Model used for analysis
    
    class Config:
        json_schema_extra = {
            "example": {
                "category": "Cyber-Threat",
                "headline": "CERT-In: Critical RCE in Apache Struts",
                "severity_or_relevance_score": 10,
                "applicable_nbfc_layers": ["All"]
            }
        }`}
          </pre>
        </div>
      </div>

      {/* Deployment Architecture */}
      <div className="glass-card rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
          <GitBranch className="w-5 h-5 text-accent-purple" /> Deployment Architecture (Docker Compose)
        </h3>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-navy-950/80 rounded-lg p-4 border border-navy-700/30">
            <h4 className="text-xs font-bold text-accent-purple uppercase mb-3">Production Services</h4>
            <div className="space-y-2">
              {[
                { name: 'nginx', desc: 'Reverse proxy + TLS termination', port: '443' },
                { name: 'fastapi', desc: 'Backend API (4 workers)', port: '8000' },
                { name: 'nextjs', desc: 'Frontend SSR + static', port: '3000' },
                { name: 'postgres', desc: 'PostgreSQL 16 (primary)', port: '5432' },
                { name: 'redis', desc: 'Cache + Celery broker', port: '6379' },
                { name: 'celery-worker', desc: 'Async task processing', port: '-' },
                { name: 'celery-beat', desc: 'Scheduled task runner', port: '-' },
              ].map(svc => (
                <div key={svc.name} className="flex items-center justify-between py-1.5 border-b border-navy-700/30 last:border-0">
                  <div>
                    <span className="text-xs font-medium text-navy-200">{svc.name}</span>
                    <p className="text-[10px] text-navy-500">{svc.desc}</p>
                  </div>
                  <span className="text-[10px] text-navy-400 font-mono">:{svc.port}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-navy-950/80 rounded-lg p-4 border border-navy-700/30">
            <h4 className="text-xs font-bold text-accent-purple uppercase mb-3">Infrastructure Specs</h4>
            <div className="space-y-2">
              {[
                { label: 'Compute', value: '4 vCPU, 16GB RAM (min)' },
                { label: 'Storage', value: '500GB SSD (encrypted)' },
                { label: 'Network', value: 'India-region only (Mumbai/AP)' },
                { label: 'TLS', value: "Let's Encrypt + TLS 1.3" },
                { label: 'Backups', value: 'Daily WAL-G to S3 (India)' },
                { label: 'Monitoring', value: 'Prometheus + Grafana' },
                { label: 'Logging', value: 'ELK Stack (India-region)' },
                { label: 'CI/CD', value: 'GitHub Actions + ArgoCD' },
                { label: 'Secrets', value: 'HashiCorp Vault / AWS SSM' },
                { label: 'DR', value: 'RPO: 1hr, RTO: 4hr' },
              ].map(item => (
                <div key={item.label} className="flex items-center justify-between py-1.5 border-b border-navy-700/30 last:border-0">
                  <span className="text-xs text-navy-400">{item.label}</span>
                  <span className="text-xs text-navy-200 font-medium">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Ingestion Pipeline Detail */}
      <div className="glass-card rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
          <Cpu className="w-5 h-5 text-accent-blue" /> Ingestion Pipeline Configuration
        </h3>
        
        <div className="grid md:grid-cols-3 gap-4">
          {[
            {
              title: 'Regulatory Sources',
              schedule: 'Every 6 hours',
              tools: ['Playwright (headless)', 'httpx (async)', 'Feedparser (RSS)'],
              targets: ['RBI Notifications', 'CERT-In Advisories', 'MeitY Circulars', 'UIDAI Updates']
            },
            {
              title: 'Research & Papers',
              schedule: 'Every 12 hours',
              tools: ['arXiv API', 'Semantic Scholar', 'CrossRef'],
              targets: ['PQC Cryptography', 'ZKP for BFSI', 'Confidential Computing', 'Sovereign LLMs']
            },
            {
              title: 'Video Channels',
              schedule: 'Every 4 hours',
              tools: ['YouTube Data API v3', 'youtube-transcript-api', 'yt-dlp (subtitles)'],
              targets: ['IDRBT Official', 'USENIX Enigma', 'Black Hat', 'AWS Architecture']
            },
          ].map(pipeline => (
            <div key={pipeline.title} className="bg-navy-800/40 rounded-lg p-4 border border-navy-700/30">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-xs font-bold text-white">{pipeline.title}</h4>
                <span className="text-[9px] px-2 py-0.5 rounded bg-accent-blue/10 text-accent-blue border border-accent-blue/20">{pipeline.schedule}</span>
              </div>
              <div className="mb-3">
                <p className="text-[10px] text-navy-400 uppercase tracking-wider mb-1.5">Tools</p>
                {pipeline.tools.map(t => (
                  <p key={t} className="text-[10px] text-navy-300 flex items-center gap-1.5">
                    <div className="w-1 h-1 rounded-full bg-accent-blue" />{t}
                  </p>
                ))}
              </div>
              <div>
                <p className="text-[10px] text-navy-400 uppercase tracking-wider mb-1.5">Targets</p>
                {pipeline.targets.map(t => (
                  <p key={t} className="text-[10px] text-navy-300 flex items-center gap-1.5">
                    <div className="w-1 h-1 rounded-full bg-accent-green" />{t}
                  </p>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
