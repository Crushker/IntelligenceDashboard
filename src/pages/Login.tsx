import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../App';
import { Shield, Eye, EyeOff, ArrowRight } from 'lucide-react';

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError('Please enter your corporate email');
      return;
    }
    const success = login(email, password);
    if (success) {
      navigate('/dashboard');
    } else {
      setError('Authentication failed');
    }
  };

  return (
    <div className="min-h-screen bg-navy-950 flex items-center justify-center px-6">
      <div className="absolute inset-0 bg-gradient-to-br from-navy-800/30 via-transparent to-navy-900/30" />
      <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-accent-gold/3 rounded-full blur-3xl" />
      
      <div className="relative w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent-gold to-amber-600 flex items-center justify-center">
              <Shield className="w-6 h-6 text-navy-950" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Executive Access</h1>
          <p className="text-sm text-navy-400">NBFC Intelligence Platform — Secure Login</p>
        </div>

        <div className="glass-card rounded-2xl p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="p-3 rounded-lg bg-accent-red/10 border border-accent-red/30 text-sm text-accent-red">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-navy-200 mb-2">Corporate Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="cio@varnafinance.in"
                className="w-full px-4 py-3 rounded-lg bg-navy-800/60 border border-navy-700/50 text-white placeholder-navy-500 outline-none focus:border-accent-gold/50 focus:ring-1 focus:ring-accent-gold/20 transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-navy-200 mb-2">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full px-4 py-3 rounded-lg bg-navy-800/60 border border-navy-700/50 text-white placeholder-navy-500 outline-none focus:border-accent-gold/50 focus:ring-1 focus:ring-accent-gold/20 transition-all pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-navy-400 hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 rounded border-navy-600 bg-navy-800 text-accent-gold focus:ring-accent-gold/20" />
                <span className="text-xs text-navy-300">Remember this device</span>
              </label>
              <a href="#" className="text-xs text-accent-gold hover:text-amber-400">Forgot password?</a>
            </div>

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 py-3.5 bg-accent-gold text-navy-950 font-bold rounded-lg hover:bg-amber-400 transition-all shadow-lg shadow-accent-gold/20"
            >
              Authenticate <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-navy-700/50">
            <p className="text-center text-xs text-navy-400 mb-4">Enterprise SSO Available</p>
            <div className="grid grid-cols-2 gap-3">
              <button className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-navy-700/50 text-sm text-navy-200 hover:bg-navy-800/50 transition-colors">
                <span className="text-base">🔷</span> Microsoft Entra
              </button>
              <button className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-navy-700/50 text-sm text-navy-200 hover:bg-navy-800/50 transition-colors">
                <span className="text-base">🔶</span> Google Workspace
              </button>
            </div>
          </div>
        </div>

        <p className="text-center text-xs text-navy-500 mt-6">
          Protected by OWASP-compliant security • DPDP Act 2023 Compliant<br />
          <Link to="/" className="text-navy-400 hover:text-accent-gold">← Back to home</Link>
        </p>
      </div>
    </div>
  );
}
