import { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../App';
import {
  LayoutDashboard, Shield, Video, CreditCard, Settings,
  LogOut, Bell, Search, Menu, X, ChevronDown, GitBranch
} from 'lucide-react';
import { useState } from 'react';

interface LayoutProps {
  children: ReactNode;
}

const navItems = [
  { path: '/dashboard', label: 'Executive Dashboard', icon: LayoutDashboard },
  { path: '/intelligence', label: 'Intelligence Feed', icon: Shield },
  { path: '/videos', label: 'Video Hub', icon: Video },
  { path: '/architecture', label: 'Architecture', icon: GitBranch },
  { path: '/subscription', label: 'Subscription', icon: CreditCard },
  { path: '/settings', label: 'Settings', icon: Settings },
];

export function Layout({ children }: LayoutProps) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-navy-950">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-72 transform transition-transform duration-300 lg:relative lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex h-full flex-col border-r border-navy-700/50 bg-navy-900/95 backdrop-blur-xl">
          {/* Logo */}
          <div className="flex items-center gap-3 px-6 py-5 border-b border-navy-700/50">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-accent-gold to-amber-600 flex items-center justify-center">
              <Shield className="w-5 h-5 text-navy-950" />
            </div>
            <div>
              <h1 className="text-sm font-bold text-white tracking-tight">NBFC INTEL</h1>
              <p className="text-[10px] text-navy-400 uppercase tracking-widest">CIO Platform</p>
            </div>
            <button onClick={() => setSidebarOpen(false)} className="lg:hidden ml-auto text-navy-400">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-navy-700/60 text-white shadow-lg shadow-navy-900/50 border border-navy-600/50'
                      : 'text-navy-300 hover:text-white hover:bg-navy-800/50'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-accent-gold' : ''}`} />
                  {item.label}
                  {isActive && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-accent-gold animate-pulse-glow" />}
                </Link>
              );
            })}
          </nav>

          {/* Status */}
          <div className="px-4 py-4 border-t border-navy-700/50">
            <div className="glass-card rounded-lg p-3">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 rounded-full bg-accent-green animate-pulse" />
                <span className="text-xs text-accent-green font-medium">Pipeline Active</span>
              </div>
              <p className="text-[10px] text-navy-400">Last sync: 2 min ago</p>
              <p className="text-[10px] text-navy-400">14 sources monitored</p>
              <p className="text-[10px] text-navy-400">5 critical alerts pending</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black/60 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="flex items-center justify-between px-6 py-4 border-b border-navy-700/50 bg-navy-900/80 backdrop-blur-xl">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-navy-300">
              <Menu className="w-5 h-5" />
            </button>
            <div className="hidden md:flex items-center gap-2 bg-navy-800/60 rounded-lg px-4 py-2 border border-navy-700/50">
              <Search className="w-4 h-4 text-navy-400" />
              <input
                type="text"
                placeholder="Search intelligence, CVEs, circulars..."
                className="bg-transparent text-sm text-navy-200 placeholder-navy-500 outline-none w-64"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button className="relative text-navy-300 hover:text-white transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-accent-red text-[9px] font-bold text-white flex items-center justify-center">5</span>
            </button>

            <div className="relative">
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-navy-800/50 transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent-gold to-amber-600 flex items-center justify-center text-xs font-bold text-navy-950">
                  RK
                </div>
                <div className="hidden md:block text-left">
                  <p className="text-sm font-medium text-white">{user?.name}</p>
                  <p className="text-[10px] text-navy-400">{user?.role}</p>
                </div>
                <ChevronDown className="w-3 h-3 text-navy-400 hidden md:block" />
              </button>

              {profileOpen && (
                <div className="absolute right-0 top-full mt-2 w-56 glass-card rounded-lg shadow-2xl border border-navy-700/50 py-2 z-50">
                  <div className="px-4 py-2 border-b border-navy-700/50">
                    <p className="text-sm font-medium text-white">{user?.name}</p>
                    <p className="text-xs text-navy-400">{user?.org}</p>
                    <p className="text-[10px] text-navy-500 mt-1">Enterprise CIO Access</p>
                  </div>
                  <Link to="/settings" className="w-full flex items-center gap-3 px-4 py-2 text-sm text-navy-300 hover:text-white hover:bg-navy-800/50 transition-colors">
                    <Settings className="w-4 h-4" /> Account Settings
                  </Link>
                  <Link to="/subscription" className="w-full flex items-center gap-3 px-4 py-2 text-sm text-navy-300 hover:text-white hover:bg-navy-800/50 transition-colors">
                    <CreditCard className="w-4 h-4" /> Subscription
                  </Link>
                  <button
                    onClick={logout}
                    className="w-full flex items-center gap-3 px-4 py-2 text-sm text-accent-red hover:bg-navy-800/50 transition-colors"
                  >
                    <LogOut className="w-4 h-4" /> Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
