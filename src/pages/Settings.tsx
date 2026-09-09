import { useState } from 'react';
import { useAuth } from '../App';
import { Settings as SettingsIcon, Bell, Shield, Mail, MessageSquare, Trash2, Save, ToggleLeft, ToggleRight, Eye, EyeOff, Download, AlertTriangle, CheckCircle2, Clock } from 'lucide-react';

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
  const [showDeleteModal, setShowDeleteModal] = useState(false);

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
          <p className="text-sm text-navy-400 mt-1">Configure intelligence delivery, alerts, privacy, and DPDP compliance preferences</p>
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
            <div className="flex gap-2">
              <div className="relative flex-1">
                <input
                  type={showWebhook ? 'text' : 'password'}
                  value={slackWebhook}
                  onChange={(e) => setSlackWebhook(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg bg-navy-800/60 border border-navy-700/50 text-sm text-white outline-none focus:border-accent-gold/50 pr-10"
                  placeholder="https://hooks.slack.com/services/..."
                />
                <button
                  type="button"
                  onClick={() => setShowWebhook(!showWebhook)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-navy-400 hover:text-white"
                >
                  {showWebhook ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <button className="px-4 py-2.5 rounded-lg bg-accent-green/10 border border-accent-green/30 text-xs text-accent-green font-medium hover:bg-accent-green/20 transition-colors">
                Test
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
              className="w-full px-4 py-2.5 rounded-lg bg-navy-800/60 border border-navy-700/50 text-sm text-white outline-none focus:border-accent-gold/50"
              placeholder="https://outlook.office.com/webhook/..."
            />
          </div>
        </div>
      </div>

      {/* DPDP Compliance & Privacy */}
      <div className="glass-card rounded-xl p-6 border border-accent-green/20">
        <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
          <Shield className="w-4 h-4 text-accent-green" /> DPDP Act 2023 — Privacy & Consent
        </h3>
        
        <div className="space-y-4">
          {/* Consent Status */}
          <div className="flex items-center justify-between p-3 rounded-lg bg-accent-green/5 border border-accent-green/20">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-accent-green" />
              <div>
                <p className="text-xs font-medium text-white">Data Processing Consent</p>
                <p className="text-[10px] text-navy-400">Given on: Jan 15, 2026 • Version: 2.1</p>
              </div>
            </div>
            <button
              onClick={() => setConsentGiven(!consentGiven)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                consentGiven
                  ? 'bg-accent-green/10 text-accent-green border border-accent-green/30'
                  : 'bg-accent-red/10 text-accent-red border border-accent-red/30'
              }`}
            >
              {consentGiven ? 'Active' : 'Withdrawn'}
            </button>
          </div>

          {/* Consent Details */}
          <div className="grid md:grid-cols-2 gap-3">
            {[
              { label: 'Intelligence Delivery', status: true, desc: 'Email, Slack, Teams notifications' },
              { label: 'Usage Analytics', status: true, desc: 'Dashboard interaction metrics' },
              { label: 'Threat Intelligence Sharing', status: false, desc: 'Share anonymized alerts with ISAC-India' },
              { label: 'Marketing Communications', status: false, desc: 'Product updates and webinars' },
            ].map(consent => (
              <div key={consent.label} className="flex items-center justify-between p-3 rounded-lg bg-navy-800/40 border border-navy-700/30">
                <div>
                  <p className="text-xs font-medium text-navy-200">{consent.label}</p>
                  <p className="text-[10px] text-navy-500">{consent.desc}</p>
                </div>
                <div className={`w-2 h-2 rounded-full ${consent.status ? 'bg-accent-green' : 'bg-navy-600'}`} />
              </div>
            ))}
          </div>

          {/* Data Rights */}
          <div className="pt-4 border-t border-navy-700/30">
            <p className="text-xs font-medium text-white mb-3">Your Data Rights (DPDP Act 2023)</p>
            <div className="grid md:grid-cols-3 gap-3">
              <button className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-navy-800/40 border border-navy-700/30 text-xs text-navy-200 hover:border-accent-gold/30 transition-colors">
                <Download className="w-3.5 h-3.5 text-accent-blue" />
                Export My Data
              </button>
              <button className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-navy-800/40 border border-navy-700/30 text-xs text-navy-200 hover:border-accent-gold/30 transition-colors">
                <Clock className="w-3.5 h-3.5 text-accent-amber" />
                View Consent History
              </button>
              <button
                onClick={() => setShowDeleteModal(true)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-accent-red/5 border border-accent-red/20 text-xs text-accent-red hover:bg-accent-red/10 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Right to Erasure
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
          <div className="glass-card rounded-xl p-6 max-w-md mx-4 border border-accent-red/30">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-accent-red/10 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-accent-red" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Right to Erasure (DPDP Act)</h3>
                <p className="text-[10px] text-navy-400">This action is irreversible</p>
              </div>
            </div>
            <p className="text-xs text-navy-300 mb-4 leading-relaxed">
              This will permanently delete your account, all preference data, delivery history, and consent records. 
              Per DPDP Act 2023 Section 11, this will be processed within 72 hours. Some anonymized aggregate data 
              may be retained for regulatory compliance purposes.
            </p>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 py-2.5 rounded-lg border border-navy-600 text-sm text-navy-200 hover:bg-navy-800/50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 py-2.5 rounded-lg bg-accent-red text-sm font-medium text-white hover:bg-red-600 transition-colors"
              >
                Confirm Erasure
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
