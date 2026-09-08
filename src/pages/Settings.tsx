import { useState } from 'react';
import { useAuth } from '../App';
import { Settings as SettingsIcon, Bell, Shield, Mail, MessageSquare, Trash2, Save, ToggleLeft, ToggleRight, Eye, EyeOff } from 'lucide-react';

export function Settings() {
  const { user } = useAuth();
  const [alertThreshold, setAlertThreshold] = useState(7);
  const [emailDigest, setEmailDigest] = useState('daily');
  const [slackWebhook, setSlackWebhook] = useState('https://hooks.slack.com/services/T00/B00/xxxx');
  const [teamsWebhook, setTeamsWebhook] = useState('');
  const [showWebhook, setShowWebhook] = useState(false);
  const [selectedLayers, setSelectedLayers] = useState<string[]>(['Upper', 'Top']);
  const [enabledCategories, setEnabledCategories] = useState<string[]>(['Regulatory', 'Cyber-Threat', 'Infra-Architecture', 'Frontier-Tech', 'Video-Masterclass']);
  const [consentGiven, setConsentGiven] = useState(true);
  const [saved, setSaved] = useState(false);

  const toggleLayer = (layer: string) => {
    setSelectedLayers(prev =>
      prev.includes(layer) ? prev.filter(l => l !== layer) : [...prev, layer]
    );
  };

  const toggleCategory = (cat: string) => {
    setEnabledCategories(prev =>
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    );
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const allLayers = ['Base', 'Middle', 'Upper', 'Top'];
  const allCategories = ['Regulatory', 'Cyber-Threat', 'Infra-Architecture', 'Frontier-Tech', 'Video-Masterclass', 'Networking-Event'];

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Settings & Preferences</h1>
          <p className="text-sm text-navy-400 mt-1">Configure your intelligence delivery, alerts, and privacy preferences</p>
        </div>
        <button
          onClick={handleSave}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${
            saved ? 'bg-accent-green text-white' : 'bg-accent-gold text-navy-950 hover:bg-amber-400'
          }`}
        >
          <Save className="w-4 h-4" />
          {saved ? 'Saved!' : 'Save Changes'}
        </button>
      </div>

      {/* Profile */}
      <div className="glass-card rounded-xl p-6">
        <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
          <SettingsIcon className="w-4 h-4 text-accent-gold" /> Profile & Organization
        </h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-navy-400 mb-1.5">Full Name</label>
            <input
              type="text"
              defaultValue={user?.name}
              className="w-full px-4 py-2.5 rounded-lg bg-navy-800/60 border border-navy-700/50 text-sm text-white outline-none focus:border-accent-gold/50"
            />
          </div>
          <div>
            <label className="block text-xs text-navy-400 mb-1.5">Organization</label>
            <input
              type="text"
              defaultValue={user?.org}
              className="w-full px-4 py-2.5 rounded-lg bg-navy-800/60 border border-navy-700/50 text-sm text-white outline-none focus:border-accent-gold/50"
            />
          </div>
          <div>
            <label className="block text-xs text-navy-400 mb-1.5">Role</label>
            <input
              type="text"
              defaultValue={user?.role}
              disabled
              className="w-full px-4 py-2.5 rounded-lg bg-navy-800/30 border border-navy-700/30 text-sm text-navy-400 outline-none"
            />
          </div>
          <div>
            <label className="block text-xs text-navy-400 mb-1.5">Email</label>
            <input
              type="email"
              defaultValue="rajesh.kumar@varnafinance.in"
              className="w-full px-4 py-2.5 rounded-lg bg-navy-800/60 border border-navy-700/50 text-sm text-white outline-none focus:border-accent-gold/50"
            />
          </div>
        </div>
      </div>

      {/* NBFC Layer Filter */}
      <div className="glass-card rounded-xl p-6">
        <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
          <Shield className="w-4 h-4 text-accent-gold" /> NBFC Layer Filter
        </h3>
        <p className="text-xs text-navy-400 mb-4">Select which RBI scale-based regulation layers you want intelligence for</p>
        <div className="flex flex-wrap gap-3">
          {allLayers.map(layer => {
            const isSelected = selectedLayers.includes(layer);
            return (
              <button
                key={layer}
                onClick={() => toggleLayer(layer)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  isSelected
                    ? 'bg-accent-gold/10 border border-accent-gold/40 text-accent-gold'
                    : 'bg-navy-800/40 border border-navy-700/30 text-navy-400 hover:border-navy-500/50'
                }`}
              >
                {isSelected ? <ToggleRight className="w-4 h-4" /> : <ToggleLeft className="w-4 h-4" />}
                {layer} Layer
              </button>
            );
          })}
        </div>
      </div>

      {/* Category Toggles */}
      <div className="glass-card rounded-xl p-6">
        <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
          <Bell className="w-4 h-4 text-accent-gold" /> Intelligence Categories
        </h3>
        <p className="text-xs text-navy-400 mb-4">Enable or disable specific intelligence categories in your feed</p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {allCategories.map(cat => {
            const isEnabled = enabledCategories.includes(cat);
            return (
              <button
                key={cat}
                onClick={() => toggleCategory(cat)}
                className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-xs font-medium transition-all ${
                  isEnabled
                    ? 'bg-accent-green/10 border border-accent-green/30 text-accent-green'
                    : 'bg-navy-800/40 border border-navy-700/30 text-navy-500 hover:border-navy-500/50'
                }`}
              >
                {isEnabled ? <ToggleRight className="w-4 h-4" /> : <ToggleLeft className="w-4 h-4" />}
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Alert Threshold */}
      <div className="glass-card rounded-xl p-6">
        <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
          <Bell className="w-4 h-4 text-accent-gold" /> Alert Threshold
        </h3>
        <p className="text-xs text-navy-400 mb-4">Only receive notifications for intelligence items above this relevance score</p>
        <div className="flex items-center gap-4">
          <input
            type="range"
            min="1"
            max="10"
            value={alertThreshold}
            onChange={(e) => setAlertThreshold(Number(e.target.value))}
            className="flex-1 accent-accent-gold"
          />
          <span className="text-lg font-bold text-accent-gold w-12 text-center">{alertThreshold}+</span>
        </div>
        <p className="text-xs text-navy-500 mt-2">
          {alertThreshold >= 9 ? 'Only critical alerts (regulatory deadlines, zero-days)' :
           alertThreshold >= 7 ? 'High-priority alerts (compliance, major vulnerabilities)' :
           alertThreshold >= 5 ? 'Medium and above (includes architecture updates)' :
           'All intelligence items including informational updates'}
        </p>
      </div>

      {/* Delivery Channels */}
      <div className="glass-card rounded-xl p-6">
        <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
          <Mail className="w-4 h-4 text-accent-gold" /> Delivery Channels
        </h3>

        <div className="space-y-5">
          {/* Email */}
          <div>
            <label className="block text-xs text-navy-300 mb-2 flex items-center gap-2">
              <Mail className="w-3.5 h-3.5" /> Email Digest Frequency
            </label>
            <div className="flex gap-2">
              {['realtime', 'daily', 'weekly'].map(freq => (
                <button
                  key={freq}
                  onClick={() => setEmailDigest(freq)}
                  className={`px-4 py-2 rounded-lg text-xs font-medium capitalize transition-all ${
                    emailDigest === freq
                      ? 'bg-accent-gold/10 border border-accent-gold/40 text-accent-gold'
                      : 'bg-navy-800/40 border border-navy-700/30 text-navy-400 hover:border-navy-500/50'
                  }`}
                >
                  {freq === 'realtime' ? 'Real-time' : freq}
                </button>
              ))}
            </div>
          </div>

          {/* Slack */}
          <div>
            <label className="block text-xs text-navy-300 mb-2 flex items-center gap-2">
              <MessageSquare className="w-3.5 h-3.5" /> Slack Webhook URL
            </label>
            <div className="relative">
              <input
                type="text"
                value={slackWebhook}
                onChange={(e) => setSlackWebhook(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg bg-navy-800/60 border border-navy-700/50 text-sm text-white outline-none focus:border-accent-gold/50 font-mono pr-10"
              />
              <button
                onClick={() => setShowWebhook(!showWebhook)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-navy-400 hover:text-white"
              >
                {showWebhook ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Teams */}
          <div>
            <label className="block text-xs text-navy-300 mb-2 flex items-center gap-2">
              <MessageSquare className="w-3.5 h-3.5" /> Microsoft Teams Webhook URL
            </label>
            <input
              type="text"
              value={teamsWebhook}
              onChange={(e) => setTeamsWebhook(e.target.value)}
              placeholder="https://outlook.office.com/webhook/..."
              className="w-full px-4 py-2.5 rounded-lg bg-navy-800/60 border border-navy-700/50 text-sm text-white placeholder-navy-600 outline-none focus:border-accent-gold/50 font-mono"
            />
          </div>
        </div>
      </div>

      {/* Privacy & DPDP */}
      <div className="glass-card rounded-xl p-6">
        <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
          <Shield className="w-4 h-4 text-accent-gold" /> Privacy & DPDP Compliance
        </h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 rounded-lg bg-navy-800/30">
            <div>
              <p className="text-sm text-navy-200">Data Processing Consent</p>
              <p className="text-xs text-navy-500">Consent given: Jan 15, 2026 at 10:32 AM IST</p>
            </div>
            <span className="px-2 py-1 rounded bg-accent-green/20 text-accent-green text-[10px] font-bold border border-accent-green/30">
              CONSENTED
            </span>
          </div>
          <div className="flex items-center justify-between p-3 rounded-lg bg-navy-800/30">
            <div>
              <p className="text-sm text-navy-200">Right to Erasure</p>
              <p className="text-xs text-navy-500">One-click account & data deletion per DPDP Act 2023</p>
            </div>
            <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-accent-red/10 border border-accent-red/30 text-accent-red text-xs font-medium hover:bg-accent-red/20 transition-colors">
              <Trash2 className="w-3.5 h-3.5" /> Delete My Data
            </button>
          </div>
          <div className="flex items-center justify-between p-3 rounded-lg bg-navy-800/30">
            <div>
              <p className="text-sm text-navy-200">Data Portability</p>
              <p className="text-xs text-navy-500">Export all your intelligence data in JSON/CSV format</p>
            </div>
            <button className="px-3 py-1.5 rounded-lg border border-navy-700/50 text-navy-200 text-xs font-medium hover:bg-navy-800/50 transition-colors">
              Export Data
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
