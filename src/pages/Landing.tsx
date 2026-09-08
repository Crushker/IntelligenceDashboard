import { Link } from 'react-router-dom';
import { Shield, Brain, Zap, Lock, TrendingUp, Users, ChevronRight, ArrowRight, CheckCircle2 } from 'lucide-react';

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
        
        <div className="relative max-w-7xl mx-auto">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-navy-800/60 border border-navy-700/50 mb-8">
              <div className="w-2 h-2 rounded-full bg-accent-green animate-pulse" />
              <span className="text-xs font-medium text-navy-200">Trusted by 40+ Upper & Top Layer NBFCs</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-white leading-tight mb-6">
              Strategic Intelligence for{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-gold to-amber-400">
                NBFC Leadership
              </span>
            </h1>
            
            <p className="text-lg md:text-xl text-navy-300 max-w-3xl mx-auto mb-10 leading-relaxed">
              Autonomous ingestion of regulatory circulars, cyber threats, architectural breakthroughs, and frontier technology — distilled into actionable CIO directives. Built for India's regulated NBFC ecosystem.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
              <Link to="/login" className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 bg-accent-gold text-navy-950 font-bold rounded-lg hover:bg-amber-400 transition-all shadow-lg shadow-accent-gold/20">
                Access Executive Dashboard <ArrowRight className="w-4 h-4" />
              </Link>
              <a href="#features" className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 border border-navy-600 text-white font-medium rounded-lg hover:bg-navy-800/50 transition-all">
                Explore Platform <ChevronRight className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {[
              { value: '12+', label: 'Regulatory Sources' },
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
                <div key={feature.title} className={`glass-card rounded-xl p-6 hover:border-navy-500/50 transition-all duration-300 group`}>
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

      {/* Sources */}
      <section id="sources" className="py-20 px-6 bg-navy-900/30">
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

      {/* Compliance */}
      <section id="compliance" className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Built for Regulatory Compliance</h2>
            <p className="text-navy-300 max-w-2xl mx-auto">Every architectural decision aligned with Indian BFSI regulatory requirements.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {[
              { title: 'RBI IT Governance 2023', desc: 'Full alignment with RBI Master Direction on IT Governance, including cyber security framework and digital lending directions.' },
              { title: 'DPDP Act 2023', desc: 'Consent management, data principal rights, right to erasure, and cryptographic audit trails for all subscriber data.' },
              { title: 'CERT-In Guidelines', desc: 'Mandatory incident reporting within 6 hours, vulnerability management integration, and automated threat intelligence feeds.' },
              { title: 'OWASP Top 10 / CERT-In', desc: 'Argon2id password hashing, CSRF protection, strict CSP headers, rate limiting, and zero-trust network architecture.' },
            ].map((item) => (
              <div key={item.title} className="glass-card rounded-xl p-6">
                <h3 className="text-lg font-semibold text-white mb-2">{item.title}</h3>
                <p className="text-sm text-navy-300 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 px-6 bg-navy-900/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Subscription Tiers</h2>
            <p className="text-navy-300 max-w-2xl mx-auto">Choose the intelligence depth your organization requires.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              {
                name: 'Base Layer',
                price: '₹25,000',
                period: '/month',
                features: ['Regulatory circulars digest', 'Daily email briefing', '5 user seats', 'Base & Middle layer alerts', 'Standard support'],
                highlighted: false
              },
              {
                name: 'Upper Layer',
                price: '₹75,000',
                period: '/month',
                features: ['Full intelligence feed', 'Real-time critical alerts', '25 user seats', 'All NBFC layers', 'Slack/Teams integration', 'Video masterclass access', 'Priority support'],
                highlighted: true
              },
              {
                name: 'Top Layer',
                price: '₹2,00,000',
                period: '/month',
                features: ['Everything in Upper', 'Unlimited seats', 'Custom source ingestion', 'Dedicated account manager', 'API access', 'White-label briefings', 'Quarterly strategy sessions'],
                highlighted: false
              },
            ].map((tier) => (
              <div key={tier.name} className={`rounded-xl p-6 ${tier.highlighted ? 'glass-card border-accent-gold/50 border-2 shadow-xl shadow-accent-gold/10' : 'glass-card'}`}>
                {tier.highlighted && (
                  <div className="text-xs font-bold text-accent-gold uppercase tracking-wider mb-4">Most Popular</div>
                )}
                <h3 className="text-xl font-bold text-white mb-2">{tier.name}</h3>
                <div className="flex items-baseline gap-1 mb-6">
                  <span className="text-3xl font-bold text-white">{tier.price}</span>
                  <span className="text-sm text-navy-400">{tier.period}</span>
                </div>
                <ul className="space-y-3 mb-8">
                  {tier.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm text-navy-200">
                      <CheckCircle2 className="w-4 h-4 text-accent-green flex-shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  to="/login"
                  className={`block text-center py-3 rounded-lg font-medium transition-colors ${
                    tier.highlighted
                      ? 'bg-accent-gold text-navy-950 hover:bg-amber-400'
                      : 'border border-navy-600 text-white hover:bg-navy-800/50'
                  }`}
                >
                  Get Started
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-navy-700/30 py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent-gold to-amber-600 flex items-center justify-center">
              <Shield className="w-4 h-4 text-navy-950" />
            </div>
            <span className="text-sm font-bold text-white">NBFC INTEL</span>
          </div>
          <p className="text-xs text-navy-500">© 2026 NBFC Intelligence Platform. Compliant with RBI IT Governance, DPDP Act 2023, CERT-In Guidelines.</p>
        </div>
      </footer>
    </div>
  );
}
