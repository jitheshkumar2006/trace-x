// ============================================================
// TRACE-X — App Layout (Clean Executive Intelligence Portal)
// ============================================================

import { NavLink, useNavigate } from 'react-router-dom';
import { useAuthStore, useAppStore } from '../../store/useStore';
import {
  LayoutDashboard,
  FolderOpen,
  FilePlus,
  Inbox,
  GitBranch,
  AlertTriangle,
  Crosshair,
  Map,
  Users,
  FileText,
  Shield,
  Settings,
  LogOut,
  Search,
  Activity,
} from 'lucide-react';
import { useEffect, useState } from 'react';

const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/cases', label: 'Active Cases', icon: FolderOpen },
  { path: '/cases/create', label: 'Create Case', icon: FilePlus },
  { path: '/evidence', label: 'Evidence Inbox', icon: Inbox },
  { path: '/graph', label: 'Evidence Graph', icon: GitBranch },
  { path: '/gaps', label: 'Investigation Gaps', icon: AlertTriangle },
  { path: '/next-evidence', label: 'Next Best Evidence', icon: Crosshair },
  { path: '/map', label: 'Search Priority Map', icon: Map },
  { path: '/citizen-reports', label: 'Citizen Reports', icon: Users },
  { path: '/audit', label: 'Audit Log', icon: FileText },
  { path: '/privacy', label: 'Privacy & Access', icon: Shield },
  { path: '/settings', label: 'Settings', icon: Settings },
];

const roleLabels: Record<string, string> = {
  police: 'Investigator T1',
  ngo: 'NGO Partner',
  volunteer: 'Field Volunteer',
  family: 'Family View',
};

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { currentUser, logout } = useAuthStore();
  const { initDemoData, cases } = useAppStore();
  const navigate = useNavigate();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  useEffect(() => {
    if (cases.length === 0) {
      initDemoData();
    }
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex h-screen overflow-hidden bg-navy-950">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarCollapsed ? 'w-[64px]' : 'w-[240px]'
        } flex-shrink-0 bg-navy-900 border-r border-navy-800 flex flex-col transition-all duration-200 select-none`}
      >
        {/* Brand Header */}
        <div className="h-14 px-4 border-b border-navy-800 flex items-center justify-between">
          <div
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          >
            <div className="w-8 h-8 rounded-md bg-blue-600 flex items-center justify-center flex-shrink-0 text-white font-bold">
              <Activity className="w-4 h-4" />
            </div>
            {!sidebarCollapsed && (
              <div>
                <h1 className="text-base font-bold tracking-tight text-white">TRACE-X</h1>
                <p className="text-[10px] text-navy-400 font-mono uppercase tracking-wider">SIH 2026 • PSS2</p>
              </div>
            )}
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 py-3 px-2 space-y-0.5 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `sidebar-item ${isActive ? 'active' : ''}`
                }
                title={item.label}
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                {!sidebarCollapsed && <span>{item.label}</span>}
              </NavLink>
            );
          })}
        </nav>

        {/* User Account Bar */}
        <div className="p-3 border-t border-navy-800 bg-navy-950/40">
          {!sidebarCollapsed && currentUser && (
            <div className="mb-2 px-1">
              <p className="text-xs font-semibold text-white truncate">{currentUser.name}</p>
              <p className="text-[10px] text-navy-400 font-mono mt-0.5">{roleLabels[currentUser.role]}</p>
            </div>
          )}
          <button
            onClick={handleLogout}
            className="sidebar-item w-full text-red-400 hover:bg-red-500/10 hover:text-red-300"
          >
            <LogOut className="w-4 h-4 flex-shrink-0" />
            {!sidebarCollapsed && <span>Sign Out</span>}
          </button>
        </div>
      </aside>

      {/* Main View Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header Bar */}
        <header className="h-14 border-b border-navy-800 bg-navy-900/60 px-6 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-navy-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search case TRX-2026-001..."
                className="pl-8 pr-3 py-1 bg-navy-950 border border-navy-800 rounded-md text-xs text-navy-200 w-56 focus:outline-none focus:border-blue-500 transition-colors font-sans"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <span className="prototype-badge">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse"></span>
              Live System Prototype
            </span>
            {currentUser && (
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-navy-800 border border-navy-700 flex items-center justify-center text-xs font-semibold text-blue-400">
                  {currentUser.name.split(' ').map((n) => n[0]).join('')}
                </div>
              </div>
            )}
          </div>
        </header>

        {/* Dynamic Page Component */}
        <main className="flex-1 overflow-y-auto p-6 bg-navy-950">
          {children}
        </main>
      </div>
    </div>
  );
}
