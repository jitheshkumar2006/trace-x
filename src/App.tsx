// ============================================================
// TRACE-X — Main App with Routing
// ============================================================

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
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
import AuditLogPage from './pages/AuditLogPage';
import PrivacyPage from './pages/PrivacyPage';
import SettingsPage from './pages/SettingsPage';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <AppLayout>
                <Routes>
                  <Route path="/" element={<Navigate to="/dashboard" replace />} />
                  <Route path="/dashboard" element={<DashboardPage />} />
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
    </BrowserRouter>
  );
}
