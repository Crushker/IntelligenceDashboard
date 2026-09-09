import { useState } from 'react';
import { CreditCard, CheckCircle2, Crown, Building2, Users, Zap, ArrowUpRight, Calendar, Download } from 'lucide-react';

export function Subscription() {
  const [currentPlan] = useState('Upper Layer');
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-white">Subscription Management</h1>
        <p className="text-sm text-navy-400 mt-1">Manage your intelligence platform subscription, billing, and plan configuration</p>
      </div>

      {/* Current Plan */}
      <div className="glass-card rounded-xl p-6 border-accent-gold/30 glow-gold">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-accent-gold/10 flex items-center justify-center border border-accent-gold/30">
              <Crown className="w-7 h-7 text-accent-gold" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white">{currentPlan}</h2>
                <span className="px-2 py-0.5 rounded bg-accent-green/20 text-accent-green text-[10px] font-bold border border-accent-green/30">ACTIVE</span>
              </div>
              <p className="text-sm text-navy-400">Varna Finance Ltd • Upper Layer NBFC</p>
              <p className="text-xs text-navy-500 mt-1">Renews: March 15, 2026 • Next billing: ₹75,000</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="px-4 py-2 rounded-lg border border-navy-700/50 text-sm text-navy-200 hover:bg-navy-800/50 transition-colors">
              Manage Plan
            </button>
            <button className="px-4 py-2 rounded-lg bg-accent-gold text-navy-950 text-sm font-medium hover:bg-amber-400 transition-colors flex items-center gap-1.5">
              Upgrade to Top Layer <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Usage Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { icon: Users, label: 'Active Seats', value: '18/25', color: 'text-accent-blue', sub: '7 available' },
          { icon: Zap, label: 'API Calls (MTD)', value: '12,847', color: 'text-accent-gold', sub: '50K limit' },
          { icon: Building2, label: 'NBFC Layers', value: 'All 4', color: 'text-accent-green', sub: 'Full coverage' },
          { icon: CreditCard, label: 'Total Spend (FY)', value: '₹6.75L', color: 'text-accent-purple', sub: '9 months' },
        ].map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="glass-card rounded-xl p-4 glass-card-hover transition-all duration-300">
              <Icon className={`w-5 h-5 ${stat.color} mb-2`} />
              <div className="text-xl font-bold text-white">{stat.value}</div>
              <div className="text-xs text-navy-400">{stat.label}</div>
              <div className="text-[10px] text-navy-500 mt-1">{stat.sub}</div>
            </div>
          );
        })}
      </div>

      {/* Usage Bars */}
      <div className="glass-card rounded-xl p-6">
        <h3 className="text-sm font-semibold text-white mb-4">Resource Utilization</h3>
        <div className="space-y-4">
          {[
            { label: 'Seat Utilization', current: 18, max: 25, color: 'bg-accent-blue' },
            { label: 'API Calls (Monthly)', current: 12847, max: 50000, color: 'bg-accent-gold' },
            { label: 'Storage (Intelligence Items)', current: 2847, max: 10000, color: 'bg-accent-green' },
            { label: 'Webhook Deliveries', current: 342, max: 1000, color: 'bg-accent-purple' },
          ].map(usage => {
            const pct = (usage.current / usage.max) * 100;
            return (
              <div key={usage.label}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs text-navy-300">{usage.label}</span>
                  <span className="text-xs text-navy-400">{usage.current.toLocaleString()} / {usage.max.toLocaleString()}</span>
                </div>
                <div className="h-2 rounded-full bg-navy-800 overflow-hidden">
                  <div className={`h-full rounded-full ${usage.color} transition-all duration-500`} style={{ width: `${pct}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Plan Comparison */}
      <div className="glass-card rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-6">Plan Comparison</h3>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              name: 'Base Layer',
              price: '₹25,000',
              features: ['Regulatory circulars', 'Daily digest', '5 seats', 'Base & Middle alerts', 'Email delivery'],
              current: false
            },
            {
              name: 'Upper Layer',
              price: '₹75,000',
              features: ['Full intelligence feed', 'Real-time alerts', '25 seats', 'All NBFC layers', 'Slack/Teams webhooks', 'Video hub access', 'Priority support'],
              current: true
            },
            {
              name: 'Top Layer',
              price: '₹2,00,000',
              features: ['Everything in Upper', 'Unlimited seats', 'Custom sources', 'Dedicated manager', 'API access', 'White-label', 'Strategy sessions'],
              current: false
            },
          ].map((plan) => (
            <div key={plan.name} className={`rounded-xl p-5 ${plan.current ? 'bg-accent-gold/5 border border-accent-gold/30' : 'bg-navy-800/30 border border-navy-700/30'}`}>
              {plan.current && (
                <div className="text-[10px] font-bold text-accent-gold uppercase tracking-wider mb-2">Current Plan</div>
              )}
              <h4 className="text-base font-bold text-white mb-1">{plan.name}</h4>
              <div className="text-2xl font-bold text-white mb-4">{plan.price}<span className="text-xs text-navy-400 font-normal">/mo</span></div>
              <ul className="space-y-2">
                {plan.features.map(f => (
                  <li key={f} className="flex items-center gap-2 text-xs text-navy-200">
                    <CheckCircle2 className="w-3.5 h-3.5 text-accent-green flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              {!plan.current && (
                <button className={`w-full mt-4 py-2 rounded-lg text-xs font-medium transition-colors ${
                  plan.name === 'Top Layer'
                    ? 'bg-accent-gold text-navy-950 hover:bg-amber-400'
                    : 'border border-navy-600 text-navy-200 hover:bg-navy-800/50'
                }`}>
                  {plan.name === 'Top Layer' ? 'Upgrade' : 'Downgrade'}
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Billing */}
      <div className="glass-card rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">Billing History</h3>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${billingCycle === 'monthly' ? 'bg-accent-gold text-navy-950' : 'bg-navy-800/60 text-navy-300'}`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle('annual')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${billingCycle === 'annual' ? 'bg-accent-gold text-navy-950' : 'bg-navy-800/60 text-navy-300'}`}
            >
              Annual (Save 15%)
            </button>
          </div>
        </div>

        <div className="space-y-3">
          {[
            { date: 'Feb 15, 2026', amount: '₹75,000', status: 'Paid', invoice: 'INV-2026-0247' },
            { date: 'Jan 15, 2026', amount: '₹75,000', status: 'Paid', invoice: 'INV-2026-0198' },
            { date: 'Dec 15, 2025', amount: '₹75,000', status: 'Paid', invoice: 'INV-2025-1847' },
            { date: 'Nov 15, 2025', amount: '₹75,000', status: 'Paid', invoice: 'INV-2025-1692' },
            { date: 'Oct 15, 2025', amount: '₹75,000', status: 'Paid', invoice: 'INV-2025-1534' },
          ].map((bill) => (
            <div key={bill.invoice} className="flex items-center justify-between py-3 border-b border-navy-700/30 last:border-0">
              <div className="flex items-center gap-3">
                <Calendar className="w-4 h-4 text-navy-500" />
                <div>
                  <p className="text-sm text-navy-200">{bill.date}</p>
                  <p className="text-xs text-navy-500">{bill.invoice}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-sm font-medium text-white">{bill.amount}</p>
                  <p className="text-xs text-accent-green">{bill.status}</p>
                </div>
                <button className="p-2 rounded-lg hover:bg-navy-800/50 transition-colors text-navy-400 hover:text-white">
                  <Download className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Payment Method */}
      <div className="glass-card rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Payment Method</h3>
        <div className="flex items-center justify-between p-4 rounded-lg bg-navy-800/40 border border-navy-700/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-7 rounded bg-gradient-to-r from-blue-600 to-blue-800 flex items-center justify-center">
              <span className="text-[8px] font-bold text-white">VISA</span>
            </div>
            <div>
              <p className="text-sm text-white">•••• •••• •••• 4521</p>
              <p className="text-[10px] text-navy-500">Expires 08/2028 • Corporate Card</p>
            </div>
          </div>
          <button className="px-3 py-1.5 rounded-lg border border-navy-600 text-xs text-navy-200 hover:bg-navy-800/50 transition-colors">
            Update
          </button>
        </div>
      </div>
    </div>
  );
}
