// ============================================================
// TRACE-X — Operational Command Center & Role-Based Layout
// Enforces least-privilege view controls, verified session headers,
// and role permission filtering across Police, NGO, Volunteer, and Family
// ============================================================

import React, { useEffect, useState } from 'react';
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
  Building2,
  Compass,
  Search
} from 'lucide-react';

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
    '/ngo',
    '/evidence',
    '/citizen-reports',
    '/privacy',
  ],
  volunteer: [
    '/volunteer',
    '/map',
    '/citizen-reports',
    '/privacy',
  ],
  family: [
    '/family',
    '/map',
    '/privacy',
  ],
};

const navGroups = [
  {
    title: 'PRIMARY OPERATIONS',
    items: [
      { path: '/dashboard', label: 'Command Dashboard', icon: LayoutDashboard, roles: ['police'] },
      { path: '/ngo', label: 'Assigned Cases', icon: Building2, roles: ['ngo'] },
      { path: '/volunteer', label: 'Field Portal', icon: Compass, roles: ['volunteer'] },
      { path: '/family', label: 'Case Status View', icon: Search, roles: ['family'] },
      { path: '/cases', label: 'Case Registry', icon: FolderOpen, roles: ['police'] },
      { path: '/cases/create', label: 'Register Case', icon: FilePlus, roles: ['police'] },
    ],
  },
  {
    title: 'INTELLIGENCE ENGINE',
    items: [
      { path: '/evidence', label: 'Evidence Inbox', icon: Inbox, roles: ['police', 'ngo'] },
      { path: '/graph', label: 'Evidence Graph', icon: GitBranch, roles: ['police'] },
      { path: '/gaps', label: 'Investigation Gaps', icon: AlertTriangle, roles: ['police'] },
      { path: '/next-evidence', label: 'Next Best Evidence', icon: Crosshair, roles: ['police'] },
      { path: '/map', label: 'Search Priority Map', icon: Map, roles: ['police', 'volunteer', 'family'] },
    ],
  },
  {
    title: 'GOVERNANCE & AUDIT',
    items: [
      { path: '/citizen-reports', label: 'Citizen Reports', icon: Users, roles: ['police', 'ngo', 'volunteer'] },
      { path: '/audit', label: 'Audit Trail', icon: FileText, roles: ['police'] },
      { path: '/privacy', label: 'Privacy & RBAC', icon: Shield, roles: ['police', 'ngo', 'volunteer', 'family'] },
      { path: '/settings', label: 'System Diagnostics', icon: Settings, roles: ['police'] },
    ],
  },
];

const roleLabels: Record<UserRole, string> = {
  police: 'Police / Authority',
  ngo: 'Authorized NGO',
  volunteer: 'Field Volunteer',
  family: 'Case Access',
};

const accessLevels: Record<UserRole, string> = {
  police: 'Investigator',
  ngo: 'Assigned Partner',
  volunteer: 'Field Searcher',
  family: 'Milestone Tracking',
};

const roleBadgeClasses: Record<UserRole, string> = {
  police: 'bg-sky-500/10 text-sky-300 border-sky-500/40',
  ngo: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/40',
  volunteer: 'bg-amber-500/10 text-amber-300 border-amber-500/40',
  family: 'bg-purple-500/10 text-purple-300 border-purple-500/40',
};

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { currentUser, login, logout } = useAuthStore();
  const { initDemoData, cases, addCase } = useAppStore();
  const navigate = useNavigate();
  const location = useLocation();

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
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

  const userRole = currentUser?.role || 'police';
  const allowedPaths = roleAllowedPaths[userRole] || roleAllowedPaths.police;

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

  const handleRoleSwitch = (role: UserRole) => {
    login(role);
    setShowProfileMenu(false);
    if (role === 'police') navigate('/dashboard');
    else if (role === 'ngo') navigate('/ngo');
    else if (role === 'volunteer') navigate('/volunteer');
    else if (role === 'family') navigate('/family');
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

      {/* Sidebar Navigation */}
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
                <p className="text-[9px] text-[#8B98A8] font-mono uppercase tracking-widest">INTELLIGENCE SUITE</p>
              </div>
            )}
          </div>
        </div>

        {/* Dynamic Navigation Links based on Role Permissions */}
        <nav className="flex-1 py-3 px-2 space-y-4 overflow-y-auto">
          {navGroups.map((group) => {
            const visibleItems = group.items.filter(
              (item) => item.roles.includes(userRole) && allowedPaths.includes(item.path)
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
                  const isActive = location.pathname === item.path;
                  return (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`sidebar-item ${isActive ? 'active' : ''}`}
                      title={item.label}
                    >
                      <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? 'neon-icon-green' : 'text-[#8B98A8]'}`} />
                      {!sidebarCollapsed && <span className="text-xs">{item.label}</span>}
                    </NavLink>
                  );
                })}
              </div>
            );
          })}
        </nav>

        {/* User Account & Sign Out Bar */}
        <div className="p-3 border-t border-[#1D2733] bg-[#080B10]">
          {!sidebarCollapsed && currentUser && (
            <div className="mb-2 px-1">
              <p className="text-xs font-semibold text-white truncate">{currentUser.name}</p>
              <div className="flex items-center gap-1 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[10px] text-sky-400 font-mono truncate">{roleLabels[userRole]}</span>
              </div>
            </div>
          )}
          <button
            onClick={handleLogout}
            className="sidebar-item w-full text-red-400 hover:bg-red-500/10 hover:text-red-300 font-mono text-xs cursor-pointer"
          >
            <LogOut className="w-4 h-4 flex-shrink-0" />
            {!sidebarCollapsed && <span>LOG OUT</span>}
          </button>
        </div>
      </aside>

      {/* Main View Area */}
      <div className="flex-1 flex flex-col overflow-hidden w-full">
        {/* Top Operational Command Bar */}
        <header className="h-14 border-b border-[#1D2733] bg-[#0D1219] px-3 sm:px-6 flex items-center justify-between flex-shrink-0 z-10 gap-2 font-mono">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-1.5 rounded bg-[#111821] text-[#8B98A8] hover:text-white border border-[#1D2733]"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            {/* Operational Context Title */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-white tracking-wider hidden sm:inline">TRACE-X</span>
              <span className="text-xs text-[#8B98A8] hidden sm:inline">/</span>
              <span className="text-xs font-medium text-slate-300 tracking-wide uppercase">
                {userRole === 'police' && 'POLICE COMMAND CENTER'}
                {userRole === 'ngo' && 'NGO CASE PORTAL'}
                {userRole === 'volunteer' && 'FIELD VOLUNTEER DESK'}
                {userRole === 'family' && 'FAMILY CASE TRACKING'}
              </span>
            </div>
          </div>

          {/* Center System Status Indicator */}
          <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full bg-[#111821] border border-emerald-500/20 text-[11px] neon-card-green">
            <span className="live-pulse-neon-green"></span>
            <span className="text-[#8B98A8] font-medium">STATUS:</span>
            <span className="text-emerald-400 font-semibold tracking-wider neon-text-green">SECURE SESSION ACTIVE</span>
          </div>

          {/* Right Controls: Verified Session Badge & Role Profile Dropdown */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Quick Demo Case Entry for Police */}
            {userRole === 'police' && (
              <button
                onClick={() => setShowCustomModal(true)}
                className="px-2.5 py-1 bg-sky-600 hover:bg-sky-500 text-white rounded text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-sm border border-sky-400/30"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">+ Case</span>
              </button>
            )}

            {/* Tactical Glow Mode Toggle */}
            <button
              onClick={() => setStrangerTheme(!strangerTheme)}
              className={`px-2 py-1 rounded text-xs font-bold border flex items-center gap-1.5 transition-all cursor-pointer ${
                strangerTheme
                  ? 'bg-red-950/80 text-red-400 border-red-500/60 stranger-flicker'
                  : 'bg-[#111821] text-[#8B98A8] border-[#1D2733] hover:text-white'
              }`}
              title="Toggle Tactical Glow Atmosphere"
            >
              <Zap className="w-3.5 h-3.5" />
              <span className="hidden xl:inline">{strangerTheme ? 'Tactical ON' : 'Tactical'}</span>
            </button>

            {/* Verified Session Indicator & User Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold border flex items-center gap-2 transition-all cursor-pointer ${roleBadgeClasses[userRole]}`}
              >
                <div className="text-left leading-tight">
                  <div className="text-[11px] uppercase tracking-wider">{roleLabels[userRole]}</div>
                  <div className="text-[9px] text-emerald-400 flex items-center gap-1 font-semibold">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    VERIFIED SESSION
                  </div>
                </div>
                <ChevronDown className="w-3.5 h-3.5 ml-0.5 opacity-70" />
              </button>

              {/* Profile Details & Role Switcher Popover */}
              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-64 bg-[#0D1420] border border-[#22344B] rounded-xl shadow-2xl py-2 z-50 font-mono text-left">
                  <div className="px-3.5 py-2 border-b border-[#1E2D42]">
                    <div className="text-[10px] text-slate-400 uppercase tracking-wider">CURRENT USER</div>
                    <div className="text-xs font-bold text-white mt-0.5">{currentUser?.name || 'Verified Operator'}</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">ID: {currentUser?.id || 'AUTH-001'}</div>
                  </div>

                  <div className="px-3.5 py-2.5 space-y-1.5 text-xs border-b border-[#1E2D42]">
                    <div className="flex justify-between">
                      <span className="text-slate-400">ROLE</span>
                      <span className="font-bold text-white">{roleLabels[userRole]}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">ACCESS LEVEL</span>
                      <span className="font-bold text-sky-400">{accessLevels[userRole]}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">SESSION</span>
                      <span className="font-bold text-emerald-400 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> Active
                      </span>
                    </div>
                  </div>

                  {/* Switch Role Quick Links for Testing */}
                  <div className="px-3.5 py-2 border-b border-[#1E2D42]">
                    <div className="text-[10px] text-slate-400 uppercase tracking-wider mb-1.5">
                      SWITCH DEMO ROLE
                    </div>
                    {(['police', 'ngo', 'volunteer', 'family'] as UserRole[]).map((r) => (
                      <button
                        key={r}
                        onClick={() => handleRoleSwitch(r)}
                        className={`w-full text-left px-2.5 py-1.5 rounded text-xs flex items-center justify-between transition-colors ${
                          userRole === r ? 'text-sky-300 font-bold bg-[#142338]' : 'text-slate-400 hover:text-white hover:bg-[#111B2B]'
                        }`}
                      >
                        <span>{roleLabels[r]}</span>
                        {userRole === r && <span className="text-sky-400">✓</span>}
                      </button>
                    ))}
                  </div>

                  {/* Logout Button */}
                  <div className="p-2">
                    <button
                      onClick={handleLogout}
                      className="w-full px-3 py-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-300 text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      LOG OUT TO ACCESS PORTAL
                    </button>
                  </div>
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
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4 font-mono">
          <div className="bg-[#0D1219] border border-[#1D2733] rounded-xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#1D2733] pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <UserPlus className="w-4 h-4 text-sky-400" />
                REGISTER MISSING PERSON FILE
              </h3>
              <button
                onClick={() => setShowCustomModal(false)}
                className="text-[#8B98A8] hover:text-white p-1 rounded cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleQuickCreate} className="space-y-3.5 text-xs font-sans">
              <div>
                <label className="block text-[#8B98A8] font-mono font-medium mb-1 uppercase text-[11px]">
                  Person Full Name *
                </label>
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
                  <label className="block text-[#8B98A8] font-mono font-medium mb-1 uppercase text-[11px]">
                    Age
                  </label>
                  <input
                    type="number"
                    value={customAge}
                    onChange={(e) => setCustomAge(e.target.value)}
                    placeholder="e.g. 14"
                    className="input-field"
                  />
                </div>

                <div>
                  <label className="block text-[#8B98A8] font-mono font-medium mb-1 uppercase text-[11px]">
                    Category
                  </label>
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
                <label className="block text-[#8B98A8] font-mono font-medium mb-1 uppercase text-[11px]">
                  Last Known Sighting Location
                </label>
                <input
                  type="text"
                  value={customLoc}
                  onChange={(e) => setCustomLoc(e.target.value)}
                  placeholder="e.g. Sector 4 Central Bus Stand"
                  className="input-field"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2 font-mono">
                <button
                  type="button"
                  onClick={() => setShowCustomModal(false)}
                  className="btn-ghost text-xs"
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary text-xs">
                  Generate Case File
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
