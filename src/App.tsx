// ============================================================
// TRACE-X — Main App with Protected Role Routing
// ============================================================

import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/useStore';
import LoginPage from './pages/LoginPage';
import AppLayout from './components/layout/AppLayout';
import DashboardPage from './pages/DashboardPage';
import ActiveCasesPage from './pages/ActiveCasesPage';
import CreateCasePage from './pages/CreateCasePage';
import EvidenceInboxPage from './pages/EvidenceInboxPage';
import EvidenceGraphPage from './pages/EvidenceGraphPage';
import InvestigationGapsPage from './pages/InvestigationGapsPage';
import NextBestEvidencePage from './pages/NextBestEvidencePage';
import SearchPriorityMapPage from './pages/SearchPriorityMapPage';
import CitizenReportsPage from './pages/CitizenReportsPage';
import PublicReportPage from './pages/PublicReportPage';
import AuditLogPage from './pages/AuditLogPage';
import PrivacyPage from './pages/PrivacyPage';
import SettingsPage from './pages/SettingsPage';
import FamilyPortalPage from './pages/FamilyPortalPage';
import NgoPortalPage from './pages/NgoPortalPage';
import VolunteerPortalPage from './pages/VolunteerPortalPage';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

function RoleDefaultRedirect() {
  const currentUser = useAuthStore((s) => s.currentUser);
  const role = currentUser?.role || 'police';

  if (role === 'ngo') return <Navigate to="/ngo" replace />;
  if (role === 'volunteer') return <Navigate to="/volunteer" replace />;
  if (role === 'family') return <Navigate to="/family" replace />;
  return <Navigate to="/dashboard" replace />;
}

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/report" element={<PublicReportPage />} />
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <AppLayout>
                <Routes>
                  <Route path="/" element={<RoleDefaultRedirect />} />
                  <Route path="/dashboard" element={<DashboardPage />} />
                  <Route path="/family" element={<FamilyPortalPage />} />
                  <Route path="/ngo" element={<NgoPortalPage />} />
                  <Route path="/volunteer" element={<VolunteerPortalPage />} />
                  <Route path="/cases" element={<ActiveCasesPage />} />
                  <Route path="/cases/create" element={<CreateCasePage />} />
                  <Route path="/evidence" element={<EvidenceInboxPage />} />
                  <Route path="/graph" element={<EvidenceGraphPage />} />
                  <Route path="/gaps" element={<InvestigationGapsPage />} />
                  <Route path="/next-evidence" element={<NextBestEvidencePage />} />
                  <Route path="/map" element={<SearchPriorityMapPage />} />
                  <Route path="/citizen-reports" element={<CitizenReportsPage />} />
                  <Route path="/audit" element={<AuditLogPage />} />
                  <Route path="/privacy" element={<PrivacyPage />} />
                  <Route path="/settings" element={<SettingsPage />} />
                </Routes>
              </AppLayout>
            </ProtectedRoute>
          }
        />
      </Routes>
    </HashRouter>
  );
}
