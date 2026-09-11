import React, { useState } from 'react';
import { 
  ViewMode, 
  CameraFeedInfo, 
  AlertItem 
} from './types';
import { MOCK_CAMERAS, MOCK_ALERTS } from './data/mockData';
import { AccessScreen } from './components/AccessScreen';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { ArchitectureModal } from './components/ArchitectureModal';

// Views
import { OverviewView } from './views/OverviewView';
import { LiveSurveillanceView } from './views/LiveSurveillanceView';
import { CameraNetworkView } from './views/CameraNetworkView';
import { AiAnalyticsView } from './views/AiAnalyticsView';
import { HumanDetectionView } from './views/HumanDetectionView';
import { VehicleDetectionView } from './views/VehicleDetectionView';
import { FaceDetectionView } from './views/FaceDetectionView';
import { AnprView } from './views/AnprView';
import { VirtualFenceView } from './views/VirtualFenceView';
import { SuspiciousActivityView } from './views/SuspiciousActivityView';
import { NightMovementView } from './views/NightMovementView';
import { AlertsView } from './views/AlertsView';
import { IncidentLogView } from './views/IncidentLogView';
import { PatrolManagementView } from './views/PatrolManagementView';
import { SystemHealthView } from './views/SystemHealthView';
import { SettingsView } from './views/SettingsView';
import { soundEngine } from './utils/audio';

export const App: React.FC = () => {
  // Login Gate State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);
  const [officerName, setOfficerName] = useState<string>('MAJOR V. SHARMA');
  const [officerRole, setOfficerRole] = useState<string>('SECTOR COMMANDER');

  // Navigation & Modals
  const [currentView, setCurrentView] = useState<ViewMode>('overview');
  const [isArchitectureOpen, setIsArchitectureOpen] = useState<boolean>(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  // App State
  const [cameras, setCameras] = useState<CameraFeedInfo[]>(MOCK_CAMERAS);
  const [selectedCamera, setSelectedCamera] = useState<CameraFeedInfo>(MOCK_CAMERAS[6]); // CAM-07 (Perimeter breach)
  const [alerts, setAlerts] = useState<AlertItem[]>(MOCK_ALERTS);

  // Alert Handlers
  const handleAcknowledgeAlert = (id: string) => {
    soundEngine.playActionConfirm();
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, status: 'ACKNOWLEDGED' } : a));
  };

  const handleDismissAlert = (id: string) => {
    soundEngine.playActionConfirm();
    setAlerts(prev => prev.filter(a => a.id !== id));
  };

  const handleDispatchPatrolFromAlert = (alert: AlertItem) => {
    soundEngine.playActionConfirm();
    setCurrentView('patrol-management');
  };

  // Camera Handlers
  const handleAddCamera = (newCam: CameraFeedInfo) => {
    setCameras(prev => [newCam, ...prev]);
    setSelectedCamera(newCam);
  };

  const handleSelectCamera = (cam: CameraFeedInfo) => {
    setSelectedCamera(cam);
    setCurrentView('live-surveillance');
  };

  const handleLogin = (officer: string, role: string) => {
    setOfficerName(officer);
    setOfficerRole(role);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    soundEngine.playActionConfirm();
    setIsAuthenticated(false);
  };

  // If not logged in, render the tactical access gate
  if (!isAuthenticated) {
    return <AccessScreen onLoginSuccess={handleLogin} />;
  }

  const activeAlertsCount = alerts.filter(a => a.status === 'ACTIVE').length;

  return (
    <div className="min-h-screen bg-[#06080c] text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-slate-950 antialiased overflow-hidden">
      {/* Top Tactical Command Header */}
      <Header
        alerts={alerts}
        activeAlertsCount={activeAlertsCount}
        onOpenArchitecture={() => setIsArchitectureOpen(true)}
        onOpenAlerts={() => setCurrentView('alerts')}
        onSelectAlert={(alert) => {
          const matchCam = cameras.find(c => c.name === alert.camera);
          if (matchCam) setSelectedCamera(matchCam);
          setCurrentView('alerts');
        }}
        onLogout={handleLogout}
        officerName={officerName}
        officerRole={officerRole}
        onToggleMobileMenu={() => setMobileMenuOpen(!mobileMenuOpen)}
      />

      {/* Main Body Layout: Sidebar + Viewport Stage */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Sidebar Navigation */}
        <Sidebar
          currentView={currentView}
          onSelectView={(v) => {
            setCurrentView(v);
            setMobileMenuOpen(false);
          }}
          activeAlertsCount={activeAlertsCount}
          isOpenMobile={mobileMenuOpen}
          onCloseMobile={() => setMobileMenuOpen(false)}
        />

        {/* Dynamic Content View Area */}
        <main className="flex-1 overflow-y-auto relative bg-[#05070a] custom-scrollbar">
          {/* Subtle Background Tactical Grid Lines */}
          <div className="absolute inset-0 tactical-grid opacity-30 pointer-events-none" />

          {/* Current View Renderer */}
          <div className="relative z-10">
            {currentView === 'overview' && (
              <OverviewView
                cameras={cameras}
                alerts={alerts}
                onSelectCamera={handleSelectCamera}
                onNavigate={setCurrentView}
                onAcknowledgeAlert={handleAcknowledgeAlert}
                onOpenArchitecture={() => setIsArchitectureOpen(true)}
              />
            )}

            {currentView === 'live-surveillance' && (
              <LiveSurveillanceView
                cameras={cameras}
                selectedCamera={selectedCamera}
                onSelectCamera={setSelectedCamera}
              />
            )}

            {currentView === 'camera-network' && (
              <CameraNetworkView
                cameras={cameras}
                onSelectCamera={handleSelectCamera}
                onAddCamera={handleAddCamera}
              />
            )}

            {currentView === 'ai-analytics' && (
              <AiAnalyticsView onNavigate={setCurrentView} />
            )}

            {currentView === 'human-detection' && (
              <HumanDetectionView cameras={cameras} />
            )}

            {currentView === 'vehicle-detection' && (
              <VehicleDetectionView cameras={cameras} />
            )}

            {currentView === 'face-detection' && (
              <FaceDetectionView cameras={cameras} />
            )}

            {currentView === 'anpr' && (
              <AnprView cameras={cameras} />
            )}

            {currentView === 'virtual-fence' && (
              <VirtualFenceView cameras={cameras} />
            )}

            {currentView === 'suspicious-activity' && (
              <SuspiciousActivityView cameras={cameras} />
            )}

            {currentView === 'night-movement' && (
              <NightMovementView cameras={cameras} />
            )}

            {currentView === 'alerts' && (
              <AlertsView
                alerts={alerts}
                onAcknowledgeAlert={handleAcknowledgeAlert}
                onDismissAlert={handleDismissAlert}
                onDispatchPatrol={handleDispatchPatrolFromAlert}
              />
            )}

            {currentView === 'incident-log' && (
              <IncidentLogView />
            )}

            {currentView === 'patrol-management' && (
              <PatrolManagementView />
            )}

            {currentView === 'system-health' && (
              <SystemHealthView />
            )}

            {currentView === 'settings' && (
              <SettingsView />
            )}
          </div>
        </main>
      </div>

      {/* System Architecture Pipeline Modal */}
      <ArchitectureModal
        isOpen={isArchitectureOpen}
        onClose={() => setIsArchitectureOpen(false)}
      />
    </div>
  );
};

export default App;
