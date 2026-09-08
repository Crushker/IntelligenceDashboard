import { intelligenceFeed, alertTickerItems } from '../data/mockData';
import { Shield, AlertTriangle, Cpu, Zap, TrendingUp, Clock, ArrowUpRight, Activity } from 'lucide-react';
import { Link } from 'react-router-dom';

function getSeverityClass(score: number) {
  if (score >= 9) return 'severity-critical';
  if (score >= 7) return 'severity-high';
  if (score >= 5) return 'severity-medium';
  return 'severity-info';
}

function getSeverityBadge(score: number) {
  if (score >= 9) return { label: 'CRITICAL', color: 'bg-accent-red/20 text-accent-red border-accent-red/30' };
  if (score >= 7) return { label: 'HIGH', color: 'bg-amber-500/20 text-amber-400 border-amber-500/30' };
  if (score >= 5) return { label: 'MEDIUM', color: 'bg-accent-blue/20 text-accent-blue border-accent-blue/30' };
  return { label: 'INFO', color: 'bg-accent-green/20 text-accent-green border-accent-green/30' };
}

function getCategoryIcon(category: string) {
  switch (category) {
    case 'Regulatory': return Shield;
    case 'Cyber-Threat': return AlertTriangle;
    case 'Infra-Architecture': return Cpu;
    case 'Frontier-Tech': return Zap;
    default: return Activity;
  }
}

export function Dashboard() {
  const criticalItems = intelligenceFeed.filter(i => i.severity_or_relevance_score >= 9);
  const recentItems = intelligenceFeed.slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Alert Ticker */}
      <div className="glass-card rounded-xl overflow-hidden">
        <div className="flex items-center gap-3 px-4 py-2 bg-accent-red/10 border-b border-accent-red/20">
          <div className="w-2 h-2 rounded-full bg-accent-red animate-pulse" />
          <span className="text-xs font-bold text-accent-red uppercase tracking-wider">Critical Alerts</span>
        </div>
        <div className="overflow-hidden py-3 px-4">
          <div className="flex animate-ticker whitespace-nowrap">
            {[...alertTickerItems, ...alertTickerItems].map((item, idx) => (
              <span key={idx} className="inline-flex items-center gap-2 mx-6">
                <span className={`w-2 h-2 rounded-full ${
                  item.severity === 'critical' ? 'bg-accent-red' :
                  item.severity === 'high' ? 'bg-amber-400' : 'bg-accent-blue'
                }`} />
                <span className="text-sm text-navy-200">{item.text}</span>
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Critical Alerts', value: criticalItems.length.toString(), icon: AlertTriangle, color: 'text-accent-red', bg: 'bg-accent-red/10' },
          { label: 'Sources Active', value: '12', icon: Shield, color: 'text-accent-green', bg: 'bg-accent-green/10' },
          { label: 'Avg Relevance', value: '8.4', icon: TrendingUp, color: 'text-accent-gold', bg: 'bg-accent-gold/10' },
          { label: 'Last Ingestion', value: '2m ago', icon: Clock, color: 'text-accent-blue', bg: 'bg-accent-blue/10' },
        ].map((metric) => {
          const Icon = metric.icon;
          return (
            <div key={metric.label} className="glass-card rounded-xl p-5">
              <div className="flex items-center justify-between mb-3">
                <div className={`w-10 h-10 rounded-lg ${metric.bg} flex items-center justify-center`}>
                  <Icon className={`w-5 h-5 ${metric.color}`} />
                </div>
                <ArrowUpRight className="w-4 h-4 text-navy-500" />
              </div>
              <div className="text-2xl font-bold text-white">{metric.value}</div>
              <div className="text-xs text-navy-400 mt-1">{metric.label}</div>
            </div>
          );
        })}
      </div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Critical Intelligence */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">Priority Intelligence</h2>
            <Link to="/intelligence" className="text-xs text-accent-gold hover:text-amber-400 flex items-center gap-1">
              View All <ArrowUpRight className="w-3 h-3" />
            </Link>
          </div>

          {recentItems.map((item) => {
            const badge = getSeverityBadge(item.severity_or_relevance_score);
            const Icon = getCategoryIcon(item.category);
            return (
              <div key={item.id} className={`${getSeverityClass(item.severity_or_relevance_score)} glass-card rounded-xl p-5 hover:border-navy-500/50 transition-all`}>
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div className="flex items-center gap-2">
                    <Icon className="w-4 h-4 text-navy-400" />
                    <span className="text-xs font-medium text-navy-400 uppercase tracking-wider">{item.category}</span>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${badge.color}`}>
                    {badge.label} • {item.severity_or_relevance_score}/10
                  </span>
                </div>
                <h3 className="text-sm font-semibold text-white mb-2 leading-snug">{item.headline}</h3>
                <p className="text-xs text-navy-300 mb-3 line-clamp-2">{item.technical_summary}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 flex-wrap">
                    {item.applicable_nbfc_layers.map((layer) => (
                      <span key={layer} className="px-2 py-0.5 rounded bg-navy-700/50 text-[10px] text-navy-300 border border-navy-600/50">
                        {layer}
                      </span>
                    ))}
                  </div>
                  <span className="text-[10px] text-navy-500">{item.source_authority}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* CIO Action Items */}
          <div className="glass-card rounded-xl p-5">
            <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
              <Zap className="w-4 h-4 text-accent-gold" /> Immediate CIO Actions
            </h3>
            <div className="space-y-3">
              {criticalItems.slice(0, 3).map((item) => (
                <div key={item.id} className="p-3 rounded-lg bg-navy-800/40 border border-navy-700/30">
                  <p className="text-xs text-navy-200 leading-relaxed mb-2">{item.cio_actionable_directive.substring(0, 120)}...</p>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-navy-500">{item.source_authority}</span>
                    <span className={`text-[10px] font-bold ${item.severity_or_relevance_score >= 9 ? 'text-accent-red' : 'text-amber-400'}`}>
                      Score: {item.severity_or_relevance_score}/10
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Compliance Deadlines */}
          <div className="glass-card rounded-xl p-5">
            <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
              <Shield className="w-4 h-4 text-accent-red" /> Regulatory Deadlines
            </h3>
            <div className="space-y-3">
              {[
                { title: 'SOC 2 Type II Certification', deadline: 'Q3 2026', urgency: 'critical' },
                { title: 'Digital Lending KFS Engine', deadline: 'Mar 31, 2026', urgency: 'critical' },
                { title: 'OCEN 4.0 Sandbox Registration', deadline: 'Feb 28, 2026', urgency: 'high' },
                { title: 'PQC Cryptographic Inventory', deadline: 'Q2 2026', urgency: 'medium' },
                { title: 'DPDP Consent Manager Deploy', deadline: 'Jun 2026', urgency: 'high' },
              ].map((deadline) => (
                <div key={deadline.title} className="flex items-center justify-between py-2 border-b border-navy-700/30 last:border-0">
                  <div>
                    <p className="text-xs font-medium text-navy-200">{deadline.title}</p>
                    <p className="text-[10px] text-navy-500">{deadline.deadline}</p>
                  </div>
                  <span className={`w-2 h-2 rounded-full ${
                    deadline.urgency === 'critical' ? 'bg-accent-red animate-pulse' :
                    deadline.urgency === 'high' ? 'bg-amber-400' : 'bg-accent-blue'
                  }`} />
                </div>
              ))}
            </div>
          </div>

          {/* Pipeline Status */}
          <div className="glass-card rounded-xl p-5">
            <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
              <Activity className="w-4 h-4 text-accent-green" /> Ingestion Pipeline
            </h3>
            <div className="space-y-2">
              {[
                { name: 'RBI Circulars', status: 'active', lastRun: '2 min ago' },
                { name: 'CERT-In Advisories', status: 'active', lastRun: '5 min ago' },
                { name: 'YouTube Channels', status: 'active', lastRun: '1 hr ago' },
                { name: 'arXiv Papers', status: 'active', lastRun: '3 hr ago' },
                { name: 'NPCI Updates', status: 'pending', lastRun: 'scheduled' },
              ].map((pipeline) => (
                <div key={pipeline.name} className="flex items-center justify-between py-1.5">
                  <div className="flex items-center gap-2">
                    <div className={`w-1.5 h-1.5 rounded-full ${pipeline.status === 'active' ? 'bg-accent-green' : 'bg-amber-400'}`} />
                    <span className="text-xs text-navy-300">{pipeline.name}</span>
                  </div>
                  <span className="text-[10px] text-navy-500">{pipeline.lastRun}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
