import React, { useState, useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Sidebar } from './components/layout/Sidebar';
import { Navbar } from './components/layout/Navbar';
import { OverviewView } from './views/OverviewView';
import { ScanProductView } from './views/ScanProductView';
import { AnalysisResultsView } from './views/AnalysisResultsView';
import { ProductsView } from './views/ProductsView';
import { ComplianceView } from './views/ComplianceView';
import { ViolationsView } from './views/ViolationsView';
import { InspectionsView } from './views/InspectionsView';
import { ReportsView } from './views/ReportsView';
import { AnalyticsView } from './views/AnalyticsView';
import { ComplianceRulesView } from './views/ComplianceRulesView';
import { TeamView } from './views/TeamView';
import { SettingsView } from './views/SettingsView';
import { BacktrackView } from './views/BacktrackView';
import { YatarthCopilot } from './components/copilot/YatarthCopilot';
import { CommandPalette } from './components/modals/CommandPalette';
import { AuthModal } from './components/modals/AuthModal';

const MainLayout: React.FC = () => {
  const { currentTab, zoomScale } = useApp();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  // Global keyboard shortcut Ctrl+B / Cmd+B to toggle sidebar
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'b') {
        e.preventDefault();
        if (window.innerWidth < 1024) {
          setIsMobileSidebarOpen((prev) => !prev);
        } else {
          setIsSidebarCollapsed((prev) => !prev);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const renderActiveView = () => {
    switch (currentTab) {
      case 'overview':
        return <OverviewView />;
      case 'scan_product':
        return <ScanProductView />;
      case 'analysis_results':
        return <AnalysisResultsView />;
      case 'products':
        return <ProductsView />;
      case 'backtrack':
        return <BacktrackView />;
      case 'compliance':
        return <ComplianceView />;
      case 'violations':
        return <ViolationsView />;
      case 'inspections':
        return <InspectionsView />;
      case 'reports':
        return <ReportsView />;
      case 'analytics':
        return <AnalyticsView />;
      case 'compliance_rules':
        return <ComplianceRulesView />;
      case 'team':
        return <TeamView />;
      case 'settings':
        return <SettingsView />;
      default:
        return <OverviewView />;
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900 selection:bg-blue-500/20 selection:text-blue-900 relative">
      {/* Mobile / High-Zoom Drawer Backdrop */}
      {isMobileSidebarOpen && (
        <div 
          onClick={() => setIsMobileSidebarOpen(false)}
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-40 lg:hidden transition-opacity"
        />
      )}

      {/* Collapsible Enterprise Sidebar */}
      <Sidebar
        isCollapsed={isSidebarCollapsed}
        setIsCollapsed={setIsSidebarCollapsed}
        isMobileOpen={isMobileSidebarOpen}
        setIsMobileOpen={setIsMobileSidebarOpen}
        onOpenAuth={() => setIsAuthOpen(true)}
      />

      {/* Main Workspace Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar 
          onOpenAuth={() => setIsAuthOpen(true)}
          isSidebarCollapsed={isSidebarCollapsed}
          setIsSidebarCollapsed={setIsSidebarCollapsed}
          isMobileSidebarOpen={isMobileSidebarOpen}
          setIsMobileSidebarOpen={setIsMobileSidebarOpen}
        />
        <main 
          className="flex-1 overflow-y-auto bg-slate-50 transition-all origin-top-left"
          style={{ zoom: `${zoomScale}%` }}
        >
          {renderActiveView()}
        </main>
      </div>

      {/* Yatarth Copilot Slide-Over Drawer */}
      <YatarthCopilot />

      {/* Global Command Palette (Cmd+K) */}
      <CommandPalette />

      {/* Authentication / Persona Switcher Modal */}
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
