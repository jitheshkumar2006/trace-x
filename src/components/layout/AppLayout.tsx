// ============================================================
// TRACE-X — App Layout (Role-Aware Executive Intelligence Portal)
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
  Search,
  Activity,
  Lock,
  ChevronDown,
  Zap,
  UserPlus,
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
    title: 'MAIN',
    items: [
      { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { path: '/cases', label: 'Active Cases', icon: FolderOpen },
      { path: '/cases/create', label: 'Create New Case', icon: FilePlus },
    ],
  },
  {
    title: 'INTELLIGENCE & AI',
    items: [
      { path: '/evidence', label: 'Clues & Evidence', icon: Inbox },
      { path: '/graph', label: 'Visual Evidence Map', icon: GitBranch },
      { path: '/gaps', label: 'Missing Info (Gaps)', icon: AlertTriangle },
      { path: '/next-evidence', label: 'Top Recommended Action', icon: Crosshair },
      { path: '/map', label: 'Search Area Map', icon: Map },
    ],
  },
  {
    title: 'COMMUNITY & SYSTEM',
    items: [
      { path: '/citizen-reports', label: 'Public Sightings', icon: Users },
      { path: '/audit', label: 'Audit Log', icon: FileText },
      { path: '/privacy', label: 'Privacy & Security', icon: Shield },
      { path: '/settings', label: 'Settings', icon: Settings },
    ],
  },
];

const roleLabels: Record<UserRole, string> = {
  police: 'Police Investigator (Full Access)',
  ngo: 'NGO Partner (Assigned Cases)',
  volunteer: 'Field Volunteer (Sightings Only)',
  family: 'Family View (Approved Status)',
};

const roleColors: Record<UserRole, string> = {
  police: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
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
  const [strangerTheme, setStrangerTheme] = useState(true);

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
  const isCurrentPathAllowed = allowedPaths.some(p => location.pathname.startsWith(p));

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
    <div className={`flex h-screen overflow-hidden ${strangerTheme ? 'stranger-things-mode' : 'bg-navy-950'}`}>
      {/* Sidebar */}
      <aside
        className={`${
          sidebarCollapsed ? 'w-[64px]' : 'w-[240px]'
        } flex-shrink-0 bg-navy-900 border-r border-navy-800 flex flex-col transition-all duration-200 select-none z-20`}
      >
        {/* Brand Header */}
        <div className="h-14 px-4 border-b border-navy-800 flex items-center justify-between">
          <div
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          >
            <div className={`w-8 h-8 rounded-md flex items-center justify-center flex-shrink-0 text-white font-bold ${
              strangerTheme ? 'bg-red-600 shadow-[0_0_15px_rgba(255,0,60,0.8)] stranger-flicker' : 'bg-blue-600'
            }`}>
              <Activity className="w-4 h-4" />
            </div>
            {!sidebarCollapsed && (
              <div>
                <h1 className={`text-base font-bold tracking-tight ${strangerTheme ? 'text-red-500 stranger-title stranger-flicker' : 'text-white'}`}>
                  TRACE-X
                </h1>
                <p className="text-[10px] text-navy-400 font-mono uppercase tracking-wider">SIH 2026 • PSS2</p>
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
                  <div className="px-3 text-[10px] font-bold uppercase tracking-wider text-navy-400">
                    {group.title}
                  </div>
                )}
                {visibleItems.map((item) => {
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
                      <Icon className="w-4 h-4 flex-shrink-0 text-navy-300" />
                      {!sidebarCollapsed && <span className="text-xs">{item.label}</span>}
                    </NavLink>
                  );
                })}
              </div>
            );
          })}
        </nav>

        {/* User Account Bar */}
        <div className="p-3 border-t border-navy-800 bg-navy-950/40">
          {!sidebarCollapsed && currentUser && (
            <div className="mb-2 px-1">
              <p className="text-xs font-semibold text-white truncate">{currentUser.name}</p>
              <p className="text-[10px] text-blue-400 font-mono mt-0.5 truncate">{roleLabels[userRole]}</p>
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
        {/* Top Header Bar with Live Role Selector & Stranger Things Mode Toggle */}
        <header className="h-14 border-b border-navy-800 bg-navy-900/60 px-6 flex items-center justify-between flex-shrink-0 z-10">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-navy-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search TRX-2026-001..."
                className="pl-8 pr-3 py-1 bg-navy-950 border border-navy-800 rounded-md text-xs text-navy-200 w-48 focus:outline-none focus:border-blue-500 transition-colors font-sans"
              />
            </div>
          </div>

          {/* Controls: Custom Person Demo Input + Stranger Things Toggle + Role Switcher */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowCustomModal(true)}
              className="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>👤 Enter Custom Person</span>
            </button>

            <button
              onClick={() => setStrangerTheme(!strangerTheme)}
              className={`px-3 py-1 rounded text-xs font-bold border flex items-center gap-1.5 transition-all cursor-pointer ${
                strangerTheme
                  ? 'bg-red-950/80 text-red-400 border-red-500/60 shadow-[0_0_12px_rgba(255,0,60,0.5)] stranger-flicker'
                  : 'bg-navy-900 text-navy-400 border-navy-800 hover:text-white'
              }`}
            >
              <Zap className="w-3.5 h-3.5" />
              <span>{strangerTheme ? 'Upside Down Mode ON' : 'Stranger Mode'}</span>
            </button>

            <div className="relative">
              <button
                onClick={() => setShowRoleMenu(!showRoleMenu)}
                className={`px-3 py-1 rounded text-xs font-semibold border flex items-center gap-1.5 transition-all cursor-pointer ${roleColors[userRole]}`}
              >
                <span>Role: {userRole.toUpperCase()}</span>
                <ChevronDown className="w-3 h-3" />
              </button>

              {showRoleMenu && (
                <div className="absolute right-0 mt-2 w-56 bg-navy-900 border border-navy-700 rounded-lg shadow-xl py-1 z-50">
                  <div className="px-3 py-1.5 text-[10px] font-bold text-navy-400 uppercase tracking-wider border-b border-navy-800">
                    Switch Active Role Profile
                  </div>
                  {(['police', 'ngo', 'volunteer', 'family'] as UserRole[]).map((r) => (
                    <button
                      key={r}
                      onClick={() => handleRoleChange(r)}
                      className={`w-full text-left px-3 py-2 text-xs hover:bg-navy-800 flex items-center justify-between ${
                        userRole === r ? 'text-blue-400 font-bold bg-navy-800/50' : 'text-navy-200'
                      }`}
                    >
                      <span>{roleLabels[r]}</span>
                      {userRole === r && <span className="text-[10px] font-mono">ACTIVE</span>}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <span className={`prototype-badge hidden sm:inline-flex ${strangerTheme ? 'stranger-flicker' : ''}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${strangerTheme ? 'bg-red-500 animate-pulse' : 'bg-blue-400 animate-pulse'}`}></span>
              Upside Down
            </span>
          </div>
        </header>

        {/* Quick Custom Person Modal */}
        {showCustomModal && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="glass-card max-w-md w-full p-6 space-y-4 border-blue-500/40 relative">
              <div className="flex justify-between items-center border-b border-navy-800 pb-3">
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <UserPlus className="w-5 h-5 text-blue-400" />
                  Enter Person Details for Demo
                </h2>
                <button
                  onClick={() => setShowCustomModal(false)}
                  className="text-navy-400 hover:text-white text-sm"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleQuickCreate} className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-navy-300 mb-1">Missing Person Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Aarav Sharma, Priya Patel..."
                    value={customName}
                    onChange={(e) => setCustomName(e.target.value)}
                    className="input-field"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-navy-300 mb-1">Age</label>
                    <input
                      type="number"
                      placeholder="e.g. 21"
                      value={customAge}
                      onChange={(e) => setCustomAge(e.target.value)}
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-navy-300 mb-1">Category</label>
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
                  <label className="block text-xs font-semibold text-navy-300 mb-1">Last Known Spot / City</label>
                  <input
                    type="text"
                    placeholder="e.g. Central Station, Market Road"
                    value={customLoc}
                    onChange={(e) => setCustomLoc(e.target.value)}
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
                  <button
                    type="submit"
                    className="btn-primary text-xs font-bold"
                  >
                    🚀 Process Demo For This Person
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Dynamic Page Component with Role Guard */}
        <main className="flex-1 overflow-y-auto p-6 lg:p-8 bg-navy-950">
          <div className="max-w-7xl mx-auto w-full">
            {isCurrentPathAllowed ? (
              children
            ) : (
              <div className="glass-card p-8 text-center max-w-lg mx-auto space-y-4 my-12 border-red-500/30">
                <div className="w-12 h-12 rounded-full bg-red-500/10 text-red-400 flex items-center justify-center mx-auto">
                  <Lock className="w-6 h-6" />
                </div>
                <h2 className="text-xl font-bold text-white">Access Restricted for {userRole.toUpperCase()} Role</h2>
                <p className="text-xs text-navy-300">
                  Your current login role (<strong>{roleLabels[userRole]}</strong>) does not have access clearance for this section. Switch to Police Investigator profile to view internal intelligence tools.
                </p>
                <div className="pt-2 flex justify-center gap-3">
                  <button
                    onClick={() => handleRoleChange('police')}
                    className="btn-primary text-xs"
                  >
                    👮 Switch to Police Role
                  </button>
                  <button
                    onClick={() => navigate('/dashboard')}
                    className="btn-ghost text-xs"
                  >
                    Go to Dashboard
                  </button>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
