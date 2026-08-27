// ============================================================
// TRACE-X — Operational Command Center Layout
// High-precision intelligence interface with role access controls
// ============================================================

import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore, useAppStore } from '../../store/useStore';
import type { UserRole } from '../../types';
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
  ChevronDown,
  Zap,
  UserPlus,
  Menu,
  X,
  Radar,
} from 'lucide-react';
import { useEffect, useState } from 'react';

const roleAllowedPaths: Record<UserRole, string[]> = {
  police: [
    '/dashboard',
    '/cases',
    '/cases/create',
    '/evidence',
    '/graph',
    '/gaps',
    '/next-evidence',
    '/map',
    '/citizen-reports',
    '/audit',
    '/privacy',
    '/settings',
  ],
  ngo: [
    '/dashboard',
    '/cases',
    '/evidence',
    '/citizen-reports',
    '/privacy',
  ],
  volunteer: [
    '/dashboard',
    '/map',
    '/citizen-reports',
    '/privacy',
  ],
  family: [
    '/dashboard',
    '/map',
    '/privacy',
  ],
};

const navGroups = [
  {
    title: 'CORE OPERATIONAL',
    items: [
      { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { path: '/cases', label: 'Active Cases', icon: FolderOpen },
      { path: '/cases/create', label: 'Create Case', icon: FilePlus },
    ],
  },
  {
    title: 'INTELLIGENCE CORE',
    items: [
      { path: '/evidence', label: 'Evidence Inbox', icon: Inbox },
      { path: '/graph', label: 'Evidence Graph', icon: GitBranch },
      { path: '/gaps', label: 'Investigation Gaps', icon: AlertTriangle },
      { path: '/next-evidence', label: 'Next Best Evidence', icon: Crosshair },
      { path: '/map', label: 'Search Priority', icon: Map },
    ],
  },
  {
    title: 'COMMUNITY & LOGS',
    items: [
      { path: '/citizen-reports', label: 'Citizen Reports', icon: Users },
      { path: '/audit', label: 'Audit Log', icon: FileText },
      { path: '/privacy', label: 'Privacy & Access', icon: Shield },
      { path: '/settings', label: 'Settings', icon: Settings },
    ],
  },
];

const roleLabels: Record<UserRole, string> = {
  police: 'Police Investigator',
  ngo: 'NGO Partner',
  volunteer: 'Field Volunteer',
  family: 'Family Access',
};

const roleColors: Record<UserRole, string> = {
  police: 'bg-sky-500/10 text-sky-400 border-sky-500/30',
  ngo: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
  volunteer: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
  family: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
};

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { currentUser, login, logout } = useAuthStore();
  const { initDemoData, cases, addCase } = useAppStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [strangerTheme, setStrangerTheme] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Quick Custom Person Modal State
  const [showCustomModal, setShowCustomModal] = useState(false);
  const [customName, setCustomName] = useState('');
  const [customAge, setCustomAge] = useState('');
  const [customLoc, setCustomLoc] = useState('');
  const [customCategory, setCustomCategory] = useState('child');

  useEffect(() => {
    if (cases.length === 0) {
      initDemoData();
    }
  }, []);

  const handleQuickCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customName.trim()) return;
    const newId = `TRX-2026-${Math.floor(100 + Math.random() * 900)}`;
    addCase({
      id: newId,
      person: {
        name: customName,
        age: parseInt(customAge) || 21,
        gender: 'Male',
        category: customCategory as any,
        lastKnownLocation: customLoc || 'Central Market Corridor',
        lastKnownDateTime: new Date().toISOString(),
        clothingDescription: 'Dark jacket, dark trousers',
        distinguishingFeatures: 'N/A',
        knownObjects: 'Backpack',
      },
      appearance: {
        faceEmbeddingStatus: 'generated',
        approximateAge: `${customAge || '21'} years`,
        clothing: 'Dark jacket',
        backpackOrObject: 'Backpack',
        shoes: 'Dark sneakers',
        hair: 'Short black hair',
        bodyAppearance: 'Average build',
      },
      status: 'active',
      certainty: {
        identity: 75,
        time: 65,
        location: 55,
        route: 35,
        cctvCoverage: 25,
        witness: 45,
        overall: 50,
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      assignedTo: ['USR-001'],
      evidenceIds: [],
      hypothesisIds: [],
      gapIds: [],
    });
    setShowCustomModal(false);
    setCustomName('');
    setCustomAge('');
    setCustomLoc('');
    navigate('/dashboard');
  };

  const userRole = currentUser?.role || 'police';
  const allowedPaths = roleAllowedPaths[userRole] || roleAllowedPaths.police;

  const handleRoleChange = (role: UserRole) => {
    login(role);
    setShowRoleMenu(false);
    if (!roleAllowedPaths[role].some(p => location.pathname.startsWith(p))) {
      navigate('/dashboard');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className={`flex h-screen overflow-hidden ${strangerTheme ? 'stranger-things-mode' : 'bg-[#080B10]'}`}>
      {/* Mobile Backdrop */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-30 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        } ${
          sidebarCollapsed ? 'w-[64px]' : 'w-[240px]'
        } fixed lg:static inset-y-0 left-0 bg-[#0D1219] border-r border-[#1D2733] flex flex-col transition-transform lg:transition-all duration-200 select-none z-40`}
      >
        {/* Brand Header */}
        <div className="h-14 px-4 border-b border-[#1D2733] flex items-center justify-between">
          <div
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          >
            <div className={`w-8 h-8 rounded-md flex items-center justify-center flex-shrink-0 text-white font-bold ${
              strangerTheme ? 'bg-red-600 shadow-[0_0_15px_rgba(239,68,68,0.8)] stranger-flicker' : 'bg-sky-600 shadow-sm shadow-sky-500/30'
            }`}>
              <Radar className="w-4.5 h-4.5 text-white" />
            </div>
            {!sidebarCollapsed && (
              <div>
                <h1 className={`text-base font-extrabold tracking-wider ${strangerTheme ? 'text-red-500 stranger-title stranger-flicker' : 'text-white font-mono'}`}>
                  TRACE-X
                </h1>
                <p className="text-[9px] text-[#8B98A8] font-mono uppercase tracking-widest">INVESTIGATION INTELLIGENCE</p>
              </div>
            )}
          </div>
        </div>

        {/* Dynamic Navigation Links based on Role Permissions */}
        <nav className="flex-1 py-3 px-2 space-y-4 overflow-y-auto">
          {navGroups.map((group) => {
            const visibleItems = group.items.filter((item) =>
              allowedPaths.includes(item.path)
            );

            if (visibleItems.length === 0) return null;

            return (
              <div key={group.title} className="space-y-1">
                {!sidebarCollapsed && (
                  <div className="px-3 text-[9px] font-bold uppercase tracking-widest text-[#8B98A8]">
                    {group.title}
                  </div>
                )}
                {visibleItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      onClick={() => setMobileMenuOpen(false)}
                      className={({ isActive }) =>
                        `sidebar-item ${isActive ? 'active' : ''}`
                      }
                      title={item.label}
                    >
                      <Icon className={`w-4 h-4 flex-shrink-0 ${location.pathname === item.path ? 'neon-icon-green' : 'text-[#8B98A8]'}`} />
                      {!sidebarCollapsed && <span className="text-xs">{item.label}</span>}
                    </NavLink>
                  );
                })}
              </div>
            );
          })}
        </nav>

        {/* User Account Bar */}
        <div className="p-3 border-t border-[#1D2733] bg-[#080B10]">
          {!sidebarCollapsed && currentUser && (
            <div className="mb-2 px-1">
              <p className="text-xs font-semibold text-white truncate">{currentUser.name}</p>
              <p className="text-[10px] text-sky-400 font-mono mt-0.5 truncate">{roleLabels[userRole]}</p>
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
      <div className="flex-1 flex flex-col overflow-hidden w-full">
        {/* Top Operational Command Bar */}
        <header className="h-14 border-b border-[#1D2733] bg-[#0D1219] px-3 sm:px-6 flex items-center justify-between flex-shrink-0 z-10 gap-2">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-1.5 rounded bg-[#111821] text-[#8B98A8] hover:text-white border border-[#1D2733]"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            {/* Left Operational Title */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-white font-mono tracking-wider hidden sm:inline">TRACE-X</span>
              <span className="text-xs text-[#8B98A8] hidden sm:inline">/</span>
              <span className="text-xs font-medium text-[#8B98A8] tracking-wide">COMMAND CENTER</span>
            </div>
          </div>

          {/* Center System Status Indicator */}
          <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full bg-[#111821] border border-emerald-500/20 text-[11px] font-mono neon-card-green">
            <span className="live-pulse-neon-green"></span>
            <span className="text-[#8B98A8] font-medium">SYSTEM STATUS:</span>
            <span className="text-emerald-400 font-semibold tracking-wider neon-text-green">ALL SYSTEMS OPERATIONAL</span>
          </div>

          {/* Right Controls: Live Pulse + Custom Person Entry + Tactical Toggle + Role Switcher */}
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-[#111821] border border-emerald-500/20 rounded text-[11px] font-mono text-[#8B98A8]">
              <span className="live-pulse-neon-green"></span>
              <span className="hidden sm:inline font-bold text-emerald-400">LIVE</span>
            </div>

            <button
              onClick={() => setShowCustomModal(true)}
              className="px-2.5 py-1 bg-sky-600 hover:bg-sky-500 text-white rounded text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-sm border border-sky-400/30"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">+ Custom Entry</span>
            </button>

            <button
              onClick={() => setStrangerTheme(!strangerTheme)}
              className={`px-2.5 py-1 rounded text-xs font-bold border flex items-center gap-1.5 transition-all cursor-pointer ${
                strangerTheme
                  ? 'bg-red-950/80 text-red-400 border-red-500/60 stranger-flicker'
                  : 'bg-[#111821] text-[#8B98A8] border-[#1D2733] hover:text-white'
              }`}
              title="Toggle Tactical Atmosphere Mode"
            >
              <Zap className="w-3.5 h-3.5" />
              <span className="hidden md:inline">{strangerTheme ? 'Tactical Mode ON' : 'Tactical Mode'}</span>
            </button>

            <div className="relative">
              <button
                onClick={() => setShowRoleMenu(!showRoleMenu)}
                className={`px-2.5 py-1 rounded text-xs font-semibold border flex items-center gap-1.5 transition-all cursor-pointer ${roleColors[userRole]}`}
              >
                <span>Role: {userRole.toUpperCase()}</span>
                <ChevronDown className="w-3 h-3" />
              </button>

              {showRoleMenu && (
                <div className="absolute right-0 mt-2 w-56 bg-[#0D1219] border border-[#1D2733] rounded-lg shadow-xl py-1 z-50">
                  <div className="px-3 py-1.5 border-b border-[#1D2733] text-[10px] font-mono text-[#8B98A8] uppercase">
                    Switch Security Role
                  </div>
                  {(['police', 'ngo', 'volunteer', 'family'] as UserRole[]).map((r) => (
                    <button
                      key={r}
                      onClick={() => handleRoleChange(r)}
                      className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-[#111821] transition-colors ${
                        userRole === r ? 'text-sky-400 font-bold bg-[#111821]' : 'text-[#8B98A8]'
                      }`}
                    >
                      <span>{roleLabels[r]}</span>
                      {userRole === r && <span className="text-sky-400 font-mono">✓</span>}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Dynamic Route Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 bg-[#080B10]">
          {children}
        </main>
      </div>

      {/* Quick Custom Person Modal */}
      {showCustomModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-[#0D1219] border border-[#1D2733] rounded-xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#1D2733] pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <UserPlus className="w-4 h-4 text-sky-400" />
                Initialize Demo Case
              </h3>
              <button
                onClick={() => setShowCustomModal(false)}
                className="text-[#8B98A8] hover:text-white p-1 rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleQuickCreate} className="space-y-4 text-xs">
              <div>
                <label className="block text-[#8B98A8] font-medium mb-1">Person Name *</label>
                <input
                  type="text"
                  required
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  placeholder="e.g. Aarav Sharma"
                  className="input-field"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#8B98A8] font-medium mb-1">Age</label>
                  <input
                    type="number"
                    value={customAge}
                    onChange={(e) => setCustomAge(e.target.value)}
                    placeholder="e.g. 21"
                    className="input-field"
                  />
                </div>

                <div>
                  <label className="block text-[#8B98A8] font-medium mb-1">Category</label>
                  <select
                    value={customCategory}
                    onChange={(e) => setCustomCategory(e.target.value)}
                    className="input-field"
                  >
                    <option value="child">Child</option>
                    <option value="elderly">Elderly</option>
                    <option value="vulnerable">Vulnerable Person</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[#8B98A8] font-medium mb-1">Last Known Location</label>
                <input
                  type="text"
                  value={customLoc}
                  onChange={(e) => setCustomLoc(e.target.value)}
                  placeholder="e.g. Central Station, Gate 3"
                  className="input-field"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowCustomModal(false)}
                  className="btn-ghost text-xs"
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary text-xs">
                  Process Demo For This Person
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
