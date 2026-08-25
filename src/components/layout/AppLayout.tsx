// ============================================================
// TRACE-X — App Layout (Sidebar + TopBar + Content)
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
  Bell,
  Search,
  Radar,
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
  police: 'Police / Investigator',
  ngo: 'NGO Partner',
  volunteer: 'Verified Volunteer',
  family: 'Family Member',
};

const roleColors: Record<string, string> = {
  police: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
  ngo: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
  volunteer: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
  family: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
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
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarCollapsed ? 'w-[68px]' : 'w-[260px]'
        } flex-shrink-0 bg-navy-900/80 backdrop-blur-xl border-r border-navy-700/50 flex flex-col transition-all duration-300 overflow-hidden`}
      >
        {/* Logo */}
        <div className="p-4 border-b border-navy-700/50">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setSidebarCollapsed(!sidebarCollapsed)}>
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center flex-shrink-0">
              <Radar className="w-5 h-5 text-white" />
            </div>
            {!sidebarCollapsed && (
              <div>
                <h1 className="text-lg font-bold tracking-tight text-white">TRACE-X</h1>
                <p className="text-[10px] text-navy-400 font-medium tracking-wider uppercase">Evidence Intelligence</p>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
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
                <Icon className="w-[18px] h-[18px] flex-shrink-0" />
                {!sidebarCollapsed && <span>{item.label}</span>}
              </NavLink>
            );
          })}
        </nav>

        {/* User section */}
        <div className="p-3 border-t border-navy-700/50">
          {!sidebarCollapsed && currentUser && (
            <div className="mb-2 px-2">
              <p className="text-sm font-semibold text-navy-200 truncate">{currentUser.name}</p>
              <span className={`inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-bold border ${roleColors[currentUser.role]}`}>
                {roleLabels[currentUser.role]}
              </span>
            </div>
          )}
          <button
            onClick={handleLogout}
            className="sidebar-item w-full text-red-400 hover:text-red-300 hover:bg-red-500/10"
          >
            <LogOut className="w-[18px] h-[18px] flex-shrink-0" />
            {!sidebarCollapsed && <span>Sign Out</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="h-14 border-b border-navy-700/50 bg-navy-900/40 backdrop-blur-xl flex items-center justify-between px-6 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="w-4 h-4 text-navy-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search cases, evidence..."
                className="pl-9 pr-4 py-1.5 bg-navy-800/60 border border-navy-700/50 rounded-lg text-sm text-navy-300 w-64 focus:outline-none focus:border-blue-500/50 transition-colors"
              />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="prototype-badge">Prototype Simulation</span>
            <button className="relative p-2 rounded-lg hover:bg-navy-800/60 transition-colors">
              <Bell className="w-4 h-4 text-navy-400" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            {currentUser && (
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-xs font-bold text-white">
                  {currentUser.name.split(' ').map(n => n[0]).join('')}
                </div>
              </div>
            )}
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6 bg-navy-950">
          {children}
        </main>
      </div>
    </div>
  );
}
