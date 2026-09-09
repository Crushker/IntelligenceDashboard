import { intelligenceFeed, alertTickerItems, intelligenceTrendData, severityDistribution, complianceTimeline, sourceActivityData } from '../data/mockData';
import { Shield, AlertTriangle, Cpu, Zap, TrendingUp, Clock, ArrowUpRight, Activity, BarChart3, PieChart as PieIcon, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

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

function getComplianceStatusStyle(status: string) {
  switch (status) {
    case 'overdue': return { bg: 'bg-accent-red/10', border: 'border-accent-red/30', dot: 'bg-accent-red', text: 'text-accent-red' };
    case 'upcoming': return { bg: 'bg-amber-500/10', border: 'border-amber-500/30', dot: 'bg-amber-400', text: 'text-amber-400' };
    default: return { bg: 'bg-accent-blue/10', border: 'border-accent-blue/30', dot: 'bg-accent-blue', text: 'text-accent-blue' };
  }
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass-card rounded-lg p-3 border border-navy-600/50 shadow-xl">
        <p className="text-xs font-medium text-white mb-1">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} className="text-[10px] text-navy-300">
            <span style={{ color: entry.color }}>●</span> {entry.name}: {entry.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

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
          <span className="text-[10px] text-navy-500 ml-auto">Live Feed • Updated 30s ago</span>
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
          { label: 'Critical Alerts', value: criticalItems.length.toString(), icon: AlertTriangle, color: 'text-accent-red', bg: 'bg-accent-red/10', change: '+2' },
          { label: 'Sources Active', value: '14', icon: Shield, color: 'text-accent-green', bg: 'bg-accent-green/10', change: '+1' },
          { label: 'Avg Relevance', value: '8.4', icon: TrendingUp, color: 'text-accent-gold', bg: 'bg-accent-gold/10', change: '+0.3' },
          { label: 'Last Ingestion', value: '2m ago', icon: Clock, color: 'text-accent-blue', bg: 'bg-accent-blue/10', change: '' },
        ].map((metric) => {
          const Icon = metric.icon;
          return (
            <div key={metric.label} className="glass-card rounded-xl p-5 glass-card-hover transition-all duration-300">
              <div className="flex items-center justify-between mb-3">
                <div className={`w-10 h-10 rounded-lg ${metric.bg} flex items-center justify-center`}>
                  <Icon className={`w-5 h-5 ${metric.color}`} />
                </div>
                <div className="flex items-center gap-1">
                  {metric.change && <span className="text-[10px] text-accent-green font-medium">{metric.change}</span>}
                  <ArrowUpRight className="w-4 h-4 text-navy-500" />
                </div>
              </div>
              <div className="text-2xl font-bold text-white">{metric.value}</div>
              <div className="text-xs text-navy-400 mt-1">{metric.label}</div>
            </div>
          );
        })}
      </div>

      {/* Charts Row */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Intelligence Trend Chart */}
        <div className="lg:col-span-2 glass-card rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-accent-gold" />
              <h3 className="text-sm font-semibold text-white">Intelligence Volume Trend</h3>
            </div>
            <span className="text-[10px] text-navy-500">Last 6 months</span>
          </div>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={intelligenceTrendData}>
                <defs>
                  <linearGradient id="colorRegulatory" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f5a623" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#f5a623" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorCyber" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorInfra" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorFrontier" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(90, 122, 181, 0.1)" />
                <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#5a7ab5' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: '#5a7ab5' }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="regulatory" stroke="#f5a623" fill="url(#colorRegulatory)" strokeWidth={2} name="Regulatory" />
                <Area type="monotone" dataKey="cyber" stroke="#ef4444" fill="url(#colorCyber)" strokeWidth={2} name="Cyber-Threat" />
                <Area type="monotone" dataKey="infra" stroke="#3b82f6" fill="url(#colorInfra)" strokeWidth={2} name="Infra-Architecture" />
                <Area type="monotone" dataKey="frontier" stroke="#8b5cf6" fill="url(#colorFrontier)" strokeWidth={2} name="Frontier-Tech" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="flex items-center justify-center gap-4 mt-3">
            {[
              { label: 'Regulatory', color: '#f5a623' },
              { label: 'Cyber-Threat', color: '#ef4444' },
              { label: 'Infra', color: '#3b82f6' },
              { label: 'Frontier', color: '#8b5cf6' },
            ].map(item => (
              <div key={item.label} className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-[10px] text-navy-400">{item.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Severity Distribution */}
        <div className="glass-card rounded-xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <PieIcon className="w-4 h-4 text-accent-gold" />
            <h3 className="text-sm font-semibold text-white">Severity Distribution</h3>
          </div>
          <div className="h-44">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={severityDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={70}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {severityDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-2 mt-2">
            {severityDistribution.map(item => (
              <div key={item.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-[10px] text-navy-300">{item.name}</span>
                </div>
                <span className="text-[10px] font-medium text-white">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Source Activity Chart */}
      <div className="glass-card rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-accent-gold" />
            <h3 className="text-sm font-semibold text-white">Source Activity & Alert Volume</h3>
          </div>
          <span className="text-[10px] text-navy-500">Current Month</span>
        </div>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={sourceActivityData} barGap={4}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(90, 122, 181, 0.1)" />
              <XAxis dataKey="source" tick={{ fontSize: 10, fill: '#5a7ab5' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: '#5a7ab5' }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="items" fill="#3b82f6" radius={[3, 3, 0, 0]} name="Total Items" />
              <Bar dataKey="alerts" fill="#ef4444" radius={[3, 3, 0, 0]} name="Critical Alerts" />
            </BarChart>
          </ResponsiveContainer>
        </div>
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
              <div key={item.id} className="glass-card rounded-xl p-5 hover:border-navy-500/50 transition-all duration-300 group">
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div className="flex items-center gap-2">
                    <Icon className="w-4 h-4 text-navy-400" />
                    <span className="text-xs font-medium text-navy-400 uppercase tracking-wider">{item.category}</span>
                    <span className="text-[10px] text-navy-600">•</span>
                    <span className="text-[10px] text-navy-500">{new Date(item.published_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${badge.color}`}>
                    {badge.label} • {item.severity_or_relevance_score}/10
                  </span>
                </div>
                <h3 className="text-sm font-semibold text-white mb-2 leading-snug group-hover:text-accent-gold transition-colors">{item.headline}</h3>
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
                <div key={item.id} className="p-3 rounded-lg bg-navy-800/40 border border-navy-700/30 hover:border-accent-gold/20 transition-colors">
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

          {/* Compliance Timeline */}
          <div className="glass-card rounded-xl p-5">
            <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-accent-red" /> Compliance Timeline
            </h3>
            <div className="space-y-3">
              {complianceTimeline.slice(0, 5).map((item) => {
                const style = getComplianceStatusStyle(item.status);
                return (
                  <div key={item.id} className={`flex items-center gap-3 p-2.5 rounded-lg ${style.bg} border ${style.border}`}>
                    <div className={`w-2 h-2 rounded-full ${style.dot} ${item.status === 'overdue' ? 'animate-pulse' : ''}`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-navy-200 truncate">{item.title}</p>
                      <p className="text-[10px] text-navy-500">{new Date(item.deadline).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                    </div>
                    <span className={`text-[9px] font-bold uppercase ${style.text}`}>{item.status}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Pipeline Status */}
          <div className="glass-card rounded-xl p-5">
            <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
              <Activity className="w-4 h-4 text-accent-green" /> Ingestion Pipeline
            </h3>
            <div className="space-y-2.5">
              {[
                { name: 'RBI Circulars', status: 'active', lastRun: '2 min ago', items: 3 },
                { name: 'CERT-In Advisories', status: 'active', lastRun: '5 min ago', items: 2 },
                { name: 'YouTube Channels', status: 'active', lastRun: '1 hr ago', items: 1 },
                { name: 'arXiv Papers', status: 'active', lastRun: '3 hr ago', items: 2 },
                { name: 'NPCI/OCEN Updates', status: 'active', lastRun: '4 hr ago', items: 1 },
                { name: 'Sahamati AA', status: 'pending', lastRun: 'scheduled', items: 0 },
              ].map((pipeline) => (
                <div key={pipeline.name} className="flex items-center justify-between py-1.5">
                  <div className="flex items-center gap-2">
                    <div className={`w-1.5 h-1.5 rounded-full ${pipeline.status === 'active' ? 'bg-accent-green' : 'bg-amber-400'}`} />
                    <span className="text-xs text-navy-300">{pipeline.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {pipeline.items > 0 && (
                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-accent-gold/10 text-accent-gold border border-accent-gold/20">+{pipeline.items}</span>
                    )}
                    <span className="text-[10px] text-navy-500">{pipeline.lastRun}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
