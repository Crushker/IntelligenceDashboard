import { useState } from 'react';
import { intelligenceFeed, categories, nbfcLayers } from '../data/mockData';
import { Shield, AlertTriangle, Cpu, Zap, Activity, Filter, ExternalLink, Clock, ChevronDown } from 'lucide-react';

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
    case 'Networking-Event': return Activity;
    default: return Shield;
  }
}

export function IntelligenceFeed() {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedLayer, setSelectedLayer] = useState<string>('All');
  const [minScore, setMinScore] = useState(0);
  const [expandedItem, setExpandedItem] = useState<string | null>(null);

  const filteredItems = intelligenceFeed.filter(item => {
    if (selectedCategory !== 'All' && item.category !== selectedCategory) return false;
    if (selectedLayer !== 'All' && !item.applicable_nbfc_layers.includes(selectedLayer as any) && !item.applicable_nbfc_layers.includes('All')) return false;
    if (item.severity_or_relevance_score < minScore) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Intelligence Feed</h1>
          <p className="text-sm text-navy-400 mt-1">Filtered, scored, and analyzed intelligence from 12+ authoritative sources</p>
        </div>
        <div className="flex items-center gap-2 text-xs text-navy-400">
          <Clock className="w-3 h-3" />
          Last updated: 2 minutes ago
        </div>
      </div>

      {/* Filters */}
      <div className="glass-card rounded-xl p-4">
        <div className="flex items-center gap-2 mb-3">
          <Filter className="w-4 h-4 text-accent-gold" />
          <span className="text-sm font-medium text-white">Filters</span>
        </div>
        <div className="flex flex-wrap gap-3">
          <div className="relative">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="appearance-none bg-navy-800/60 border border-navy-700/50 text-sm text-navy-200 rounded-lg px-4 py-2 pr-8 outline-none focus:border-accent-gold/50"
            >
              <option value="All">All Categories</option>
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-navy-400 pointer-events-none" />
          </div>

          <div className="relative">
            <select
              value={selectedLayer}
              onChange={(e) => setSelectedLayer(e.target.value)}
              className="appearance-none bg-navy-800/60 border border-navy-700/50 text-sm text-navy-200 rounded-lg px-4 py-2 pr-8 outline-none focus:border-accent-gold/50"
            >
              <option value="All">All NBFC Layers</option>
              {nbfcLayers.map(l => <option key={l} value={l}>{l} Layer</option>)}
            </select>
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-navy-400 pointer-events-none" />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-navy-400">Min Score:</span>
            <input
              type="range"
              min="0"
              max="10"
              value={minScore}
              onChange={(e) => setMinScore(Number(e.target.value))}
              className="w-24 accent-accent-gold"
            />
            <span className="text-xs font-medium text-accent-gold">{minScore}+</span>
          </div>

          <span className="ml-auto text-xs text-navy-500 self-center">
            {filteredItems.length} items
          </span>
        </div>
      </div>

      {/* Intelligence Items */}
      <div className="space-y-4">
        {filteredItems.map((item) => {
          const badge = getSeverityBadge(item.severity_or_relevance_score);
          const Icon = getCategoryIcon(item.category);
          const isExpanded = expandedItem === item.id;

          return (
            <div
              key={item.id}
              className={`${getSeverityClass(item.severity_or_relevance_score)} glass-card rounded-xl overflow-hidden transition-all duration-300`}
            >
              <div
                className="p-5 cursor-pointer"
                onClick={() => setExpandedItem(isExpanded ? null : item.id)}
              >
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div className="flex items-center gap-2">
                    <Icon className="w-4 h-4 text-navy-400" />
                    <span className="text-xs font-medium text-navy-400 uppercase tracking-wider">{item.category}</span>
                    <span className="text-[10px] text-navy-600">•</span>
                    <span className="text-[10px] text-navy-500">{new Date(item.published_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                  </div>
                  <span className={`px-2.5 py-1 rounded text-[10px] font-bold border ${badge.color}`}>
                    {badge.label} • {item.severity_or_relevance_score}/10
                  </span>
                </div>

                <h3 className="text-sm font-semibold text-white mb-2 leading-snug">{item.headline}</h3>
                <p className="text-xs text-navy-300 line-clamp-2">{item.technical_summary}</p>

                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center gap-2 flex-wrap">
                    {item.applicable_nbfc_layers.map((layer) => (
                      <span key={layer} className="px-2 py-0.5 rounded bg-navy-700/50 text-[10px] text-navy-300 border border-navy-600/50">
                        {layer}
                      </span>
                    ))}
                    {item.tags.slice(0, 3).map((tag) => (
                      <span key={tag} className="px-2 py-0.5 rounded bg-accent-gold/10 text-[10px] text-accent-gold border border-accent-gold/20">
                        #{tag}
                      </span>
                    ))}
                  </div>
                  <ChevronDown className={`w-4 h-4 text-navy-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                </div>
              </div>

              {isExpanded && (
                <div className="px-5 pb-5 border-t border-navy-700/30 pt-4 space-y-4">
                  <div>
                    <h4 className="text-xs font-semibold text-accent-gold uppercase tracking-wider mb-2">Technical Summary</h4>
                    <p className="text-sm text-navy-200 leading-relaxed">{item.technical_summary}</p>
                  </div>
                  <div className="p-4 rounded-lg bg-navy-800/40 border border-accent-gold/20">
                    <h4 className="text-xs font-semibold text-accent-gold uppercase tracking-wider mb-2">CIO Actionable Directive</h4>
                    <p className="text-sm text-navy-200 leading-relaxed">{item.cio_actionable_directive}</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-navy-400">Source:</span>
                      <a href={item.source_url} target="_blank" rel="noopener noreferrer" className="text-xs text-accent-blue hover:text-accent-gold flex items-center gap-1">
                        {item.source_authority} <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                    <div className="flex items-center gap-2">
                      {item.tags.map((tag) => (
                        <span key={tag} className="px-2 py-0.5 rounded bg-navy-700/50 text-[10px] text-navy-300">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
