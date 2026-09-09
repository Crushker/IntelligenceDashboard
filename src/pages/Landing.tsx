import { Link } from 'react-router-dom';
import { Shield, Brain, Zap, Lock, TrendingUp, Users, ChevronRight, ArrowRight, CheckCircle2, Database, Globe, Server, Cpu, Eye } from 'lucide-react';

export function Landing() {
  return (
    <div className="min-h-screen bg-navy-950">
      {/* Nav */}
      <nav className="fixed top-0 w-full z-50 border-b border-navy-700/30 bg-navy-950/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-accent-gold to-amber-600 flex items-center justify-center">
              <Shield className="w-4 h-4 text-navy-950" />
            </div>
            <span className="text-lg font-bold text-white tracking-tight">NBFC INTEL</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm text-navy-300 hover:text-white transition-colors">Platform</a>
            <a href="#architecture" className="text-sm text-navy-300 hover:text-white transition-colors">Architecture</a>
            <a href="#sources" className="text-sm text-navy-300 hover:text-white transition-colors">Sources</a>
            <a href="#pricing" className="text-sm text-navy-300 hover:text-white transition-colors">Pricing</a>
            <a href="#compliance" className="text-sm text-navy-300 hover:text-white transition-colors">Compliance</a>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/login" className="text-sm text-navy-300 hover:text-white transition-colors px-4 py-2">
              Sign In
            </Link>
            <Link to="/login" className="text-sm font-medium bg-accent-gold text-navy-950 px-5 py-2.5 rounded-lg hover:bg-amber-400 transition-colors">
              Request Access
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-navy-800/20 to-transparent" />
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-accent-gold/5 rounded-full blur-3xl" />
        <div className="absolute top-40 right-1/4 w-96 h-96 bg-accent-blue/5 rounded-full blur-3xl" />
        <div className="absolute inset-0 bg-grid-pattern opacity-30" />
        
        <div className="relative max-w-7xl mx-auto">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-navy-800/60 border border-navy-700/50 mb-8">
              <div className="w-2 h-2 rounded-full bg-accent-green animate-pulse" />
              <span className="text-xs font-medium text-navy-200">Trusted by 40+ Upper & Top Layer NBFCs • CERT-In Empanelled</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-white leading-tight mb-6">
              Strategic Intelligence for{' '}
              <span className="text-gradient-gold">
                NBFC Leadership
              </span>
            </h1>
            
            <p className="text-lg md:text-xl text-navy-300 max-w-3xl mx-auto mb-10 leading-relaxed">
              Autonomous ingestion of regulatory circulars, cyber threats, architectural breakthroughs, and frontier technology — distilled into actionable CIO directives. Built for India's regulated NBFC ecosystem under RBI Scale-Based Regulation.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
              <Link to="/login" className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 bg-accent-gold text-navy-950 font-bold rounded-lg hover:bg-amber-400 transition-all shadow-lg shadow-accent-gold/20 glow-gold">
                Access Executive Dashboard <ArrowRight className="w-4 h-4" />
              </Link>
              <a href="#architecture" className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 border border-navy-600 text-white font-medium rounded-lg hover:bg-navy-800/50 transition-all">
                View Architecture <ChevronRight className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {[
              { value: '14+', label: 'Regulatory Sources' },
              { value: '< 6hr', label: 'Ingestion Cycle' },
              { value: '98.7%', label: 'Dedup Accuracy' },
              { value: '24/7', label: 'Threat Monitoring' },
            ].map((stat) => (
              <div key={stat.label} className="glass-card rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-accent-gold">{stat.value}</div>
                <div className="text-xs text-navy-400 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Enterprise-Grade Intelligence Pipeline</h2>
            <p className="text-navy-300 max-w-2xl mx-auto">From regulatory circulars to zero-day exploits — every signal processed, scored, and delivered to your executive team.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: Brain,
                title: 'LLM Cognitive Analysis',
                description: 'GPT-4/Claude-powered analysis extracts operational impact, compliance mapping, and concrete CIO action items from raw intelligence.',
                color: 'from-purple-500/20 to-purple-600/5'
              },
              {
                icon: Shield,
                title: 'RBI Scale-Based Mapping',
                description: 'Every intelligence item automatically mapped to applicable NBFC layers (Base/Middle/Upper/Top) per RBI Master Directions.',
                color: 'from-accent-gold/20 to-amber-600/5'
              },
              {
                icon: Zap,
                title: 'Real-Time Threat Alerts',
                description: 'CERT-In advisories, CVE exploits, and supply chain attacks delivered within minutes via Email, Slack, or Teams webhooks.',
                color: 'from-accent-red/20 to-red-600/5'
              },
              {
                icon: Lock,
                title: 'DPDP-Compliant Architecture',
                description: 'Full DPDP Act 2023 compliance with consent tracking, right-to-erasure, and cryptographic masking of subscriber telemetry.',
                color: 'from-accent-green/20 to-green-600/5'
              },
              {
                icon: TrendingUp,
                title: 'Severity Scoring Engine',
                description: 'Proprietary 1-10 relevance scoring based on NBFC layer, regulatory deadline proximity, and technical debt implications.',
                color: 'from-accent-blue/20 to-blue-600/5'
              },
              {
                icon: Users,
                title: 'Multi-Tenant Delivery',
                description: 'Configurable per-subscriber delivery: daily executive digests, real-time critical alerts, and weekly architecture briefings.',
                color: 'from-accent-purple/20 to-purple-600/5'
              },
            ].map((feature) => {
              const Icon = feature.icon;
              return (
                <div key={feature.title} className="glass-card glass-card-hover rounded-xl p-6 transition-all duration-300 group">
                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                  <p className="text-sm text-navy-300 leading-relaxed">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Architecture */}
      <section id="architecture" className="py-20 px-6 bg-navy-900/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">System Architecture</h2>
            <p className="text-navy-300 max-w-2xl mx-auto">Production-grade, multi-layer architecture designed for regulated BFSI environments</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Globe,
                title: 'Ingestion Layer',
                subtitle: 'Async Scraping Pipeline',
                items: ['Playwright + Crawl4AI', 'YouTube Transcript API', 'RSS/Atom Feed Parser', 'httpx Async Client', '6-hour scheduling cycles', 'Exponential backoff + UA rotation'],
                color: 'border-accent-blue/30'
              },
              {
                icon: Brain,
                title: 'Cognitive Layer',
                subtitle: 'LLM Analysis Engine',
                items: ['GPT-4 / Claude Analysis', 'Pydantic Schema Validation', 'Severity Scoring (1-10)', 'NBFC Layer Mapping', 'Deduplication via SHA-256', 'Multi-model consensus'],
                color: 'border-accent-purple/30'
              },
              {
                icon: Database,
                title: 'Storage Layer',
                subtitle: 'PostgreSQL + Redis',
                items: ['PostgreSQL 16 (Primary)', 'Redis (Cache + Queue)', 'Full-text search (pg_trgm)', 'JSONB for flexible schemas', 'Row-level security', 'Encrypted at rest (AES-256)'],
                color: 'border-accent-green/30'
              },
              {
                icon: Server,
                title: 'Delivery Layer',
                subtitle: 'Multi-Channel Dispatch',
                items: ['SMTP/SES Email Engine', 'Slack Webhook Cards', 'MS Teams Adaptive Cards', 'Jinja2 HTML Templates', 'Celery + ARQ Workers', 'Idempotent delivery'],
                color: 'border-accent-gold/30'
              },
            ].map((layer) => {
              const Icon = layer.icon;
              return (
                <div key={layer.title} className={`glass-card rounded-xl p-6 border-t-2 ${layer.color}`}>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-lg bg-navy-800/60 flex items-center justify-center">
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-white">{layer.title}</h3>
                      <p className="text-[10px] text-navy-400">{layer.subtitle}</p>
                    </div>
                  </div>
                  <ul className="space-y-2">
                    {layer.items.map((item) => (
                      <li key={item} className="flex items-center gap-2 text-xs text-navy-300">
                        <div className="w-1 h-1 rounded-full bg-navy-500" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>

          {/* Architecture Flow */}
          <div className="mt-12 glass-card rounded-xl p-6">
            <h3 className="text-sm font-semibold text-white mb-6 text-center">Data Flow: Source → Intelligence → Action</h3>
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              {[
                { step: '1', label: 'Source Ingestion', desc: 'RBI, CERT-In, YouTube, arXiv' },
                { step: '2', label: 'Dedup & Filter', desc: 'SHA-256 checksums, whitelist' },
                { step: '3', label: 'LLM Analysis', desc: 'Scoring, categorization, directives' },
                { step: '4', label: 'Storage & Index', desc: 'PostgreSQL + full-text search' },
                { step: '5', label: 'Delivery', desc: 'Email, Slack, Teams, Dashboard' },
              ].map((item, idx) => (
                <div key={item.step} className="flex items-center gap-4">
                  <div className="text-center">
                    <div className="w-10 h-10 rounded-full bg-accent-gold/10 border border-accent-gold/30 flex items-center justify-center mx-auto mb-2">
                      <span className="text-sm font-bold text-accent-gold">{item.step}</span>
                    </div>
                    <p className="text-xs font-medium text-white">{item.label}</p>
                    <p className="text-[10px] text-navy-400 mt-0.5">{item.desc}</p>
                  </div>
                  {idx < 4 && <ChevronRight className="w-4 h-4 text-navy-600 hidden md:block" />}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Sources */}
      <section id="sources" className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Authoritative Source Network</h2>
            <p className="text-navy-300 max-w-2xl mx-auto">Curated, whitelisted sources — zero noise, maximum signal for BFSI leadership.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                category: 'Regulatory & Statutory',
                sources: ['RBI Master Directions', 'CERT-In Advisories', 'SEBI Circulars', 'MeitY/DPDP', 'UIDAI Specifications', 'NPCI/OCEN Protocols', 'Sahamati AA Standards']
              },
              {
                category: 'Deep Tech Research',
                sources: ['IDRBT Banking Tech', 'arXiv Cryptography', 'NIST PQC Standards', 'IIT Research Labs', 'Confidential Computing Papers', 'ZKP for BFSI']
              },
              {
                category: 'Technical Video Channels',
                sources: ['IDRBT Official', 'NPCI Architecture', 'USENIX Enigma', 'Black Hat Briefings', 'AWS This is My Architecture', 'Two Minute Papers']
              },
              {
                category: 'Industry Bodies',
                sources: ['NASSCOM BFSI', 'DSCI Cybersecurity', 'FICCI Roundtables', 'ASSOCHAM Banking', 'ISAC-India Threat Intel']
              },
              {
                category: 'Cloud & Infrastructure',
                sources: ['AWS Architecture Center', 'Azure Confidential Computing', 'GCP BFSI Solutions', 'HSM Vendor Updates', 'Kubernetes Security']
              },
              {
                category: 'Standards & Frameworks',
                sources: ['ISO 27001/27017', 'PCI-DSS Updates', 'SOC 2 Requirements', 'OWASP Top 10', 'MITRE ATT&CK BFSI']
              },
            ].map((group) => (
              <div key={group.category} className="glass-card rounded-xl p-6">
                <h3 className="text-sm font-semibold text-accent-gold uppercase tracking-wider mb-4">{group.category}</h3>
                <ul className="space-y-2">
                  {group.sources.map((source) => (
                    <li key={source} className="flex items-center gap-2 text-sm text-navy-200">
                      <CheckCircle2 className="w-3.5 h-3.5 text-accent-green flex-shrink-0" />
                      {source}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 px-6 bg-navy-900/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Enterprise Subscription Plans</h2>
            <p className="text-navy-300 max-w-2xl mx-auto">Aligned with RBI Scale-Based Regulation layers. Choose the intelligence coverage that matches your NBFC classification.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              {
                name: 'Base Layer',
                price: '₹25,000',
                period: '/month',
                description: 'For Base & Middle layer NBFCs starting their intelligence journey',
                features: [
                  'Regulatory circular monitoring',
                  'Daily executive digest',
                  '5 user seats',
                  'Base & Middle layer alerts',
                  'Email delivery',
                  'Basic severity scoring',
                  'Standard support (48hr SLA)'
                ],
                highlighted: false,
                cta: 'Start Base Plan'
              },
              {
                name: 'Upper Layer',
                price: '₹75,000',
                period: '/month',
                description: 'Full intelligence suite for Upper layer NBFCs with complex operations',
                features: [
                  'Complete intelligence feed (all categories)',
                  'Real-time critical alerts',
                  '25 user seats',
                  'All NBFC layer coverage',
                  'Slack + Teams webhook delivery',
                  'Video Hub with AI summaries',
                  'Priority support (4hr SLA)',
                  'Custom alert thresholds',
                  'API access for integration'
                ],
                highlighted: true,
                cta: 'Start Upper Plan'
              },
              {
                name: 'Top Layer',
                price: '₹2,00,000',
                period: '/month',
                description: 'Enterprise-grade for Top layer NBFCs requiring maximum coverage',
                features: [
                  'Everything in Upper Layer',
                  'Unlimited user seats',
                  'Custom source ingestion',
                  'Dedicated account manager',
                  'Full REST API access',
                  'White-label dashboard',
                  'Monthly strategy sessions',
                  'Custom LLM fine-tuning',
                  'On-prem deployment option',
                  'SLA: 99.9% uptime guarantee'
                ],
                highlighted: false,
                cta: 'Contact Sales'
              },
            ].map((plan) => (
              <div key={plan.name} className={`rounded-xl p-6 transition-all duration-300 ${
                plan.highlighted 
                  ? 'bg-gradient-to-b from-accent-gold/10 to-navy-800/40 border-2 border-accent-gold/40 glow-gold scale-[1.02]' 
                  : 'glass-card hover:border-navy-500/50'
              }`}>
                {plan.highlighted && (
                  <div className="text-[10px] font-bold text-accent-gold uppercase tracking-wider mb-3 text-center bg-accent-gold/10 py-1 rounded-full border border-accent-gold/30">Most Popular</div>
                )}
                <h3 className="text-lg font-bold text-white mb-1">{plan.name}</h3>
                <p className="text-xs text-navy-400 mb-4">{plan.description}</p>
                <div className="mb-6">
                  <span className="text-3xl font-black text-white">{plan.price}</span>
                  <span className="text-sm text-navy-400">{plan.period}</span>
                </div>
                <ul className="space-y-2.5 mb-6">
                  {plan.features.map(f => (
                    <li key={f} className="flex items-center gap-2 text-xs text-navy-200">
                      <CheckCircle2 className="w-3.5 h-3.5 text-accent-green flex-shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  to="/login"
                  className={`w-full py-3 rounded-lg text-sm font-medium text-center transition-all block ${
                    plan.highlighted
                      ? 'bg-accent-gold text-navy-950 hover:bg-amber-400 shadow-lg shadow-accent-gold/20'
                      : 'border border-navy-600 text-navy-200 hover:bg-navy-800/50'
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Compliance */}
      <section id="compliance" className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Enterprise Security & Compliance</h2>
            <p className="text-navy-300 max-w-2xl mx-auto">Built from ground up for regulated BFSI environments. Every layer designed for audit-readiness.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { icon: Shield, title: 'RBI IT Governance', desc: 'Aligned with Master Direction on IT Framework 2023', badge: 'Mandatory' },
              { icon: Lock, title: 'DPDP Act 2023', desc: 'Consent management, right-to-erasure, data minimization', badge: 'Compliant' },
              { icon: Eye, title: 'CERT-In Guidelines', desc: 'Incident reporting within 6 hours, vulnerability management', badge: 'Empanelled' },
              { icon: Cpu, title: 'ISO 27001:2022', desc: 'ISMS certified, annual surveillance audits', badge: 'Certified' },
              { icon: Database, title: 'SOC 2 Type II', desc: 'Continuous monitoring, annual third-party assessment', badge: 'In Progress' },
              { icon: Server, title: 'Data Localization', desc: 'All data stored in India-region data centers', badge: 'Compliant' },
              { icon: Lock, title: 'OWASP Top 10', desc: 'Quarterly penetration testing, WAF, CSP headers', badge: 'Hardened' },
              { icon: Shield, title: 'PCI-DSS v4.0', desc: 'Payment data handling, tokenization, key management', badge: 'Applicable' },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.title} className="glass-card rounded-xl p-5 text-center glass-card-hover transition-all duration-300">
                  <div className="w-10 h-10 rounded-lg bg-navy-800/60 flex items-center justify-center mx-auto mb-3">
                    <Icon className="w-5 h-5 text-accent-gold" />
                  </div>
                  <h3 className="text-sm font-semibold text-white mb-1">{item.title}</h3>
                  <p className="text-[10px] text-navy-400 mb-3 leading-relaxed">{item.desc}</p>
                  <span className="inline-block px-2 py-0.5 rounded bg-accent-green/10 text-[9px] font-bold text-accent-green border border-accent-green/20 uppercase">
                    {item.badge}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="glass-card rounded-2xl p-10 glow-gold">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Ready to Transform Your NBFC's Intelligence Posture?</h2>
            <p className="text-navy-300 max-w-2xl mx-auto mb-8">Join 40+ Upper and Top layer NBFCs already using NBFC INTEL to stay ahead of regulatory changes, cyber threats, and architectural breakthroughs.</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/login" className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 bg-accent-gold text-navy-950 font-bold rounded-lg hover:bg-amber-400 transition-all shadow-lg shadow-accent-gold/20">
                Request Executive Demo <ArrowRight className="w-4 h-4" />
              </Link>
              <a href="#pricing" className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 border border-navy-600 text-white font-medium rounded-lg hover:bg-navy-800/50 transition-all">
                View Pricing
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-navy-700/30 py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent-gold to-amber-600 flex items-center justify-center">
                  <Shield className="w-4 h-4 text-navy-950" />
                </div>
                <span className="text-sm font-bold text-white">NBFC INTEL</span>
              </div>
              <p className="text-xs text-navy-400 leading-relaxed">Enterprise intelligence platform for India's regulated NBFC ecosystem. Built by BFSI architects, for BFSI leaders.</p>
            </div>
            <div>
              <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-3">Platform</h4>
              <ul className="space-y-2">
                <li><a href="#features" className="text-xs text-navy-400 hover:text-white transition-colors">Intelligence Feed</a></li>
                <li><a href="#architecture" className="text-xs text-navy-400 hover:text-white transition-colors">Architecture</a></li>
                <li><a href="#sources" className="text-xs text-navy-400 hover:text-white transition-colors">Sources</a></li>
                <li><a href="#pricing" className="text-xs text-navy-400 hover:text-white transition-colors">Pricing</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-3">Compliance</h4>
              <ul className="space-y-2">
                <li><span className="text-xs text-navy-400">RBI IT Governance 2023</span></li>
                <li><span className="text-xs text-navy-400">DPDP Act 2023</span></li>
                <li><span className="text-xs text-navy-400">CERT-In Guidelines</span></li>
                <li><span className="text-xs text-navy-400">ISO 27001:2022</span></li>
              </ul>
            </div>
            <div>
              <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-3">Security</h4>
              <ul className="space-y-2">
                <li><span className="text-xs text-navy-400">OWASP Top 10 Compliant</span></li>
                <li><span className="text-xs text-navy-400">SOC 2 Type II</span></li>
                <li><span className="text-xs text-navy-400">Data Localization (India)</span></li>
                <li><span className="text-xs text-navy-400">Zero-Trust Architecture</span></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-navy-700/30 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-[10px] text-navy-500">© 2026 NBFC INTEL Platform. All rights reserved. Registered with CERT-In as Security Empanelled Organization.</p>
            <div className="flex items-center gap-4">
              <span className="text-[10px] text-navy-500">Privacy Policy</span>
              <span className="text-[10px] text-navy-500">Terms of Service</span>
              <span className="text-[10px] text-navy-500">DPDP Notice</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
