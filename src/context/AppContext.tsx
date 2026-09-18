import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  Product, 
  ComplianceRule, 
  Inspection, 
  ReportItem, 
  TeamMember, 
  Violation, 
  ReviewStatus,
  AuditLog
} from '../types';
import { 
  INITIAL_PRODUCTS, 
  COMPLIANCE_RULES, 
  MOCK_INSPECTIONS, 
  MOCK_REPORTS, 
  TEAM_MEMBERS,
  AUDIT_LOGS
} from '../data/mockData';

interface AppNotification {
  id: string;
  title: string;
  description: string;
  time: string;
  read: boolean;
  type: 'alert' | 'success' | 'info';
}

export type UserRole = 'inspector' | 'business' | 'consumer' | 'controller';

interface AppContextType {
  currentRole: UserRole;
  setCurrentRole: (role: UserRole) => void;
  switchRole: (role: UserRole) => void;
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  products: Product[];
  selectedProduct: Product | null;
  setSelectedProduct: (product: Product | null) => void;
  selectedProductId: string | null;
  setSelectedProductId: (id: string | null) => void;
  rules: ComplianceRule[];
  inspections: Inspection[];
  reports: ReportItem[];
  teamMembers: TeamMember[];
  auditLogs: AuditLog[];
  notifications: AppNotification[];
  markNotificationAsRead: (id: string) => void;
  clearAllNotifications: () => void;
  currentUser: TeamMember;
  setCurrentUser: (member: TeamMember) => void;
  isCopilotOpen: boolean;
  setIsCopilotOpen: (open: boolean) => void;
  allViolations: Violation[];
  updateViolationStatus: (violationId: string, newStatus: ReviewStatus) => void;
  assignViolation: (violationId: string, assignee: string) => void;
  addNewScanResult: (product: Product) => void;
  toggleRuleActive: (ruleId: string) => void;
  addNewInspection: (inspection: Partial<Inspection>) => void;
  updateInspectionStatus: (id: string, status: Inspection['status']) => void;
  addNewReport: (report: Partial<ReportItem>) => void;
  activeEvidenceBoxId: string | null;
  setActiveEvidenceBoxId: (boxId: string | null) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  isCommandPaletteOpen: boolean;
  setIsCommandPaletteOpen: (open: boolean) => void;
  zoomScale: number;
  setZoomScale: React.Dispatch<React.SetStateAction<number>>;
  selectedTraceBatchId: string;
  setSelectedTraceBatchId: (batchId: string) => void;
  updateBatchRecallStatus: (batchId: string, status: 'active_distribution' | 'warning_flagged' | 'quarantine_ordered' | 'seizure_complete') => void;
  resetToPuneMockData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [zoomScale, setZoomScale] = useState<number>(100);
  const [currentRole, setCurrentRole] = useState<UserRole>(() => {
    try {
      const saved = localStorage.getItem('yatarth_role');
      if (saved && ['inspector', 'business', 'consumer', 'controller'].includes(saved)) {
        return saved as UserRole;
      }
    } catch (e) {}
    return 'controller';
  });
  const [currentTab, setCurrentTab] = useState<string>('landing');
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem('yatarth_products_pune_v2');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.some((p) => p.batchTrace?.reverseStores?.some((s: any) => s.lat))) {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Error parsing stored products', e);
    }
    return INITIAL_PRODUCTS;
  });
  const [rules, setRules] = useState<ComplianceRule[]>(COMPLIANCE_RULES);
  const [inspections, setInspections] = useState<Inspection[]>(MOCK_INSPECTIONS);
  const [reports, setReports] = useState<ReportItem[]>(MOCK_REPORTS);
  const [teamMembers] = useState<TeamMember[]>(TEAM_MEMBERS);
  const [currentUser, setCurrentUser] = useState<TeamMember>(TEAM_MEMBERS[0]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(AUDIT_LOGS);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [isCopilotOpen, setIsCopilotOpen] = useState<boolean>(false);
  const [activeEvidenceBoxId, setActiveEvidenceBoxId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState<boolean>(false);
  const [selectedTraceBatchId, setSelectedTraceBatchId] = useState<string>('LAY-EXP-2025-09');

  const resetToPuneMockData = () => {
    localStorage.removeItem('yatarth_products');
    localStorage.setItem('yatarth_products_pune_v2', JSON.stringify(INITIAL_PRODUCTS));
    setProducts(INITIAL_PRODUCTS);
    setSelectedTraceBatchId('LAY-EXP-2025-09');
  };

  const switchRole = (role: UserRole) => {
    setCurrentRole(role);
    try {
      localStorage.setItem('yatarth_role', role);
    } catch (e) {}

    if (role === 'inspector') {
      setCurrentUser(TEAM_MEMBERS[3]); // Suresh Kumar, Field Enforcement Inspector
      setCurrentTab('scan_product');
    } else if (role === 'business') {
      setCurrentUser({
        id: 'user-biz',
        name: 'Sunil Aggarwal (Packer Director)',
        email: 'compliance@britannia-fmcg.in',
        role: 'Manufacturer / Packer Lead',
        status: 'active',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        assignedProducts: 18,
        lastActive: 'Just now'
      });
      setCurrentTab('business_portal');
    } else if (role === 'consumer') {
      setCurrentUser({
        id: 'user-consumer',
        name: 'Aarav Sharma (Citizen)',
        email: 'aarav.sharma@gmail.com',
        role: 'Citizen Consumer',
        status: 'active',
        avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
        assignedProducts: 0,
        lastActive: 'Just now'
      });
      setCurrentTab('consumer_portal');
    } else {
      setCurrentUser(TEAM_MEMBERS[0]); // Rajesh Varma, Controller of Legal Metrology
      setCurrentTab('overview');
    }
  };

  const updateBatchRecallStatus = (
    batchId: string, 
    status: 'active_distribution' | 'warning_flagged' | 'quarantine_ordered' | 'seizure_complete'
  ) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.batchTrace?.batchId === batchId || p.batchNumber === batchId) {
          return {
            ...p,
            batchTrace: p.batchTrace ? { ...p.batchTrace, recallStatus: status } : undefined
          };
        }
        return p;
      })
    );

    // Create Audit Log
    const newLog: AuditLog = {
      id: 'log-' + Date.now(),
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
      actor: currentUser.name,
      action: `Supply Chain Quarantine Order: Batch ${batchId} set to ${status.toUpperCase()}`,
      target: `Batch ID: ${batchId}`,
      ipAddress: '10.10.14.22',
      severity: status === 'quarantine_ordered' || status === 'seizure_complete' ? 'warn' : 'info'
    };
    setAuditLogs((prev) => [newLog, ...prev]);

    // Send Notification
    setNotifications((prev) => [
      {
        id: 'notif-' + Date.now(),
        title: `Batch Recall Alert: ${batchId}`,
        description: `Order issued to seize and quarantine batch ${batchId} across all retail outlets.`,
        time: 'Just now',
        read: false,
        type: 'alert'
      },
      ...prev
    ]);
  };

  const [notifications, setNotifications] = useState<AppNotification[]>([
    {
      id: 'notif-1',
      title: 'Critical Violation Flagged',
      description: 'Organic Turmeric Powder missing mandatory tax-inclusive clause on MRP.',
      time: '12m ago',
      read: false,
      type: 'alert'
    },
    {
      id: 'notif-2',
      title: 'Packaging Inspection Passed',
      description: 'Herbal Revitalizing Shampoo achieved 98% compliance index.',
      time: '1h ago',
      read: false,
      type: 'success'
    },
    {
      id: 'notif-3',
      title: 'Audit Report Ready for Export',
      description: 'Q3 Western Region Packaged Foods summary is compiled.',
      time: '3h ago',
      read: true,
      type: 'info'
    }
  ]);

  // Sync products to local storage
  useEffect(() => {
    localStorage.setItem('yatarth_products_pune_v2', JSON.stringify(products));
  }, [products]);

  // Global shortcut for Command Palette (Cmd+K / Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const selectedProduct = products.find((p) => p.id === selectedProductId) || null;

  const setSelectedProduct = (prod: Product | null) => {
    setSelectedProductId(prod ? prod.id : null);
  };

  // Flatten all violations from products
  const allViolations: Violation[] = products.flatMap((p) => p.violations);

  const updateViolationStatus = (violationId: string, newStatus: ReviewStatus) => {
    setProducts((prev) =>
      prev.map((prod) => ({
        ...prod,
        violations: prod.violations.map((v) =>
          v.id === violationId ? { ...v, reviewStatus: newStatus } : v
        )
      }))
    );

    // Add audit log
    const targetViol = allViolations.find((v) => v.id === violationId);
    if (targetViol) {
      const newLog: AuditLog = {
        id: 'log-' + Date.now(),
        timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
        actor: currentUser.name,
        action: `Violation status changed to: ${newStatus.toUpperCase()}`,
        target: `${targetViol.productName} (${targetViol.title})`,
        ipAddress: '103.21.244.12',
        severity: newStatus === 'resolved' ? 'info' : 'warn'
      };
      setAuditLogs((prev) => [newLog, ...prev]);
    }
  };

  const assignViolation = (violationId: string, assignee: string) => {
    setProducts((prev) =>
      prev.map((prod) => ({
        ...prod,
        violations: prod.violations.map((v) =>
          v.id === violationId ? { ...v, assignedTo: assignee } : v
        )
      }))
    );
  };

  const addNewScanResult = (product: Product) => {
    setProducts((prev) => [product, ...prev.filter((p) => p.id !== product.id)]);
    setSelectedProductId(product.id);
    setCurrentTab('analysis_results');
    
    // Create audit log
    const newLog: AuditLog = {
      id: 'log-' + Date.now(),
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
      actor: currentUser.name,
      action: `AI Multi-side Scan Executed: Score ${product.complianceScore}/100`,
      target: `${product.name} (SKU: ${product.sku})`,
      ipAddress: '103.21.244.12',
      severity: product.complianceScore < 70 ? 'warn' : 'info'
    };
    setAuditLogs((prev) => [newLog, ...prev]);

    // Send notification
    setNotifications((prev) => [
      {
        id: 'notif-' + Date.now(),
        title: `Scan Completed: ${product.name}`,
        description: `Compliance Score: ${product.complianceScore}/100 with ${product.violations.length} issue(s).`,
        time: 'Just now',
        read: false,
        type: product.complianceScore >= 85 ? 'success' : product.complianceScore >= 70 ? 'info' : 'alert'
      },
      ...prev
    ]);
  };

  const toggleRuleActive = (ruleId: string) => {
    setRules((prev) =>
      prev.map((r) => (r.id === ruleId ? { ...r, active: !r.active } : r))
    );
  };

  const addNewInspection = (partial: Partial<Inspection>) => {
    const newInsp: Inspection = {
      id: 'insp-' + Date.now(),
      code: `INS-2026-${Math.floor(100 + Math.random() * 900)}`,
      title: partial.title || 'Ad-Hoc Packaging Verification',
      leadAuditor: partial.leadAuditor || currentUser.name,
      status: partial.status || 'scheduled',
      scheduledDate: partial.scheduledDate || new Date().toISOString().slice(0, 10),
      facility: partial.facility || 'Central Quality Assurance Lab',
      productsCount: partial.productIds ? partial.productIds.length : products.length,
      passedCount: partial.passedCount || 0,
      failedCount: partial.failedCount || 0,
      avgScore: partial.avgScore || 85.0,
      notes: partial.notes || 'Audited in accordance with packaging standards.',
      productIds: partial.productIds || products.map((p) => p.id)
    };
    setInspections((prev) => [newInsp, ...prev]);
  };

  const updateInspectionStatus = (id: string, status: Inspection['status']) => {
    setInspections((prev) =>
      prev.map((i) => (i.id === id ? { ...i, status } : i))
    );
  };

  const addNewReport = (partial: Partial<ReportItem>) => {
    const newReport: ReportItem = {
      id: partial.id || 'rep-' + Date.now(),
      reportNumber: partial.reportNumber || `REP-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      title: partial.title || 'Packaging Inspection Report',
      type: partial.type || 'Audit Inspection',
      generatedAt: partial.generatedAt || new Date().toISOString().slice(0, 10),
      author: partial.author || currentUser.name,
      scope: partial.scope || 'Retail Store Verification',
      complianceRate: partial.complianceRate ?? 85,
      criticalIssuesCount: partial.criticalIssuesCount ?? 0,
      status: partial.status || 'ready',
      fileSize: partial.fileSize || '2.4 MB',
      storeName: partial.storeName,
      storeLocation: partial.storeLocation,
      productId: partial.productId,
      evidenceCount: partial.evidenceCount
    };
    setReports((prev) => [newReport, ...prev]);
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const clearAllNotifications = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  return (
    <AppContext.Provider
      value={{
        currentRole,
        setCurrentRole,
        switchRole,
        currentTab,
        setCurrentTab,
        products,
        selectedProduct,
        setSelectedProduct,
        selectedProductId,
        setSelectedProductId,
        rules,
        inspections,
        reports,
        teamMembers,
        auditLogs,
        notifications,
        markNotificationAsRead,
        clearAllNotifications,
        currentUser,
        setCurrentUser,
        isCopilotOpen,
        setIsCopilotOpen,
        allViolations,
        updateViolationStatus,
        assignViolation,
        addNewScanResult,
        toggleRuleActive,
        addNewInspection,
        updateInspectionStatus,
        addNewReport,
        activeEvidenceBoxId,
        setActiveEvidenceBoxId,
        searchQuery,
        setSearchQuery,
        isCommandPaletteOpen,
        setIsCommandPaletteOpen,
        zoomScale,
        setZoomScale,
        selectedTraceBatchId,
        setSelectedTraceBatchId,
        updateBatchRecallStatus,
        resetToPuneMockData
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
