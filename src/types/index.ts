export type ComplianceStatus = 'compliant' | 'warning' | 'non_compliant';
export type SeverityLevel = 'critical' | 'high' | 'medium' | 'low';
export type ReviewStatus = 'open' | 'under_review' | 'resolved' | 'dismissed';
export type FieldStatus = 'detected' | 'missing' | 'needs_review';

export interface BoundingBox {
  id: string;
  field: string;
  category: 'mrp' | 'net_quantity' | 'manufacturer' | 'dates' | 'consumer_care' | 'origin' | 'nutrition' | 'ingredients' | 'barcode';
  x: number; // percentage (0-100)
  y: number; // percentage (0-100)
  width: number;
  height: number;
  detectedText: string;
  confidence: number;
  status: FieldStatus;
  violationId?: string;
}

export interface PackagingSide {
  id: string;
  sideName: 'Front Panel' | 'Back Panel' | 'Nutritional Panel' | 'Side Panel';
  imageUrl: string;
  boundingBoxes: BoundingBox[];
}

export interface DeclarationDetail {
  id: string;
  key: string;
  label: string;
  detectedValue: string;
  standardRequired: string;
  status: FieldStatus;
  category: string;
  confidence: number;
  evidenceBoxId?: string;
  notes?: string;
}

export interface Violation {
  id: string;
  productId: string;
  productName: string;
  sku: string;
  title: string;
  category: 'Mandatory Declaration' | 'MRP & Pricing' | 'Net Quantity' | 'Dates & Shelf Life' | 'Manufacturer & Origin' | 'Consumer Care' | 'Typography & Legibility';
  severity: SeverityLevel;
  explanation: string;
  evidence: string;
  evidenceBoxId?: string;
  recommendedAction: string;
  reviewStatus: ReviewStatus;
  detectedAt: string;
  assignedTo: string;
  ruleCode: string;
}

export interface Product {
  id: string;
  sku: string;
  name: string;
  category: 'Packaged Food & Snacks' | 'Spices & Seasoning' | 'Grains & Staples' | 'Beverages' | 'Personal Care & Cosmetics' | 'Condiments & Spreads';
  brand: string;
  packSize: string;
  batchNumber: string;
  complianceScore: number;
  status: ComplianceStatus;
  lastScanDate: string;
  issuesCount: number;
  criticalIssues: number;
  owner: string;
  sides: PackagingSide[];
  declarations: DeclarationDetail[];
  violations: Violation[];
  history: {
    date: string;
    score: number;
    scannedBy: string;
    notes: string;
  }[];
  // Optional surveillance metadata
  storeName?: string;
  storeLocation?: string;
  sampleBatchId?: string;
  observedRetailPrice?: string;
  officerNotes?: string;
  // Supply Chain & Backtracking metadata
  batchTrace?: BatchTraceInfo;
}

export interface RawMaterialSupplier {
  material: string;
  supplierName: string;
  originLocation: string;
  lotNumber: string;
  purityScore: number;
  qualityCertificateNo: string;
}

export interface AffectedStoreLocation {
  storeName: string;
  storeAddress: string;
  areaDistrict: string;
  receivedUnits: number;
  remainingUnits: number;
  deliveryDate: string;
  status: 'active_shelf' | 'quarantined' | 'recalled';
  contactPerson: string;
  phone: string;
  lat?: number;
  lng?: number;
  locality?: string;
  violationSummary?: string;
  seizureNoticeNo?: string;
}

export interface RegionalAreaImpact {
  regionName: string;
  stateCode: string;
  totalOutletsAffected: number;
  estimatedUnitsInMarket: number;
  riskLevel: 'CRITICAL' | 'HIGH' | 'MODERATE';
  containmentStatus: string;
  zonalOfficerInCharge: string;
}

export interface SmartEscalationNotice {
  escalationId: string;
  severityLevel: 'IMMEDIATE_STOP_SALE' | 'URGENT_DISTRIBUTOR_RECALL' | 'ROUTINE_ADVISORY';
  recipientRole: string; // e.g., 'Controller of Legal Metrology (State Head)'
  recipientName: string;
  recipientEmail: string;
  sentTimestamp: string;
  status: 'DISPATCHED' | 'ACKNOWLEDGED' | 'ENFORCEMENT_TEAM_DEPLOYED';
  actionDirective: string;
}

export interface BatchTraceInfo {
  batchId: string;
  barcodeQr: string;
  barcodeFormat: string;
  mfgDate: string;
  expDate: string;
  isExpired: boolean;
  mfgLicenseNumber: string; // e.g., FSSAI / Legal Metrology Mfg Reg #
  manufacturer: {
    entityName: string;
    brandOwner: string;
    plantLocation: string;
    plantManager: string;
    contactPhone: string;
    contactEmail: string;
    fssaiLicense: string;
    productionLine: string;
  };
  distributor: {
    name: string;
    hubLocation: string;
    dispatchInvoiceNo: string;
    dispatchDate: string;
    vehicleRegistration: string;
    contactPerson: string;
  };
  wholesaler: {
    name: string;
    depotLocation: string;
    intakeDate: string;
    inventoryLotId: string;
    contactPhone: string;
  };
  retailer: {
    storeName: string;
    storeAddress: string;
    inspectorCoords: string;
    shelfLocation: string;
    stockReceivedDate: string;
    unitsOnShelf: number;
  };
  rawSuppliers: RawMaterialSupplier[];
  reverseStores: AffectedStoreLocation[];
  regionalAreaImpact: RegionalAreaImpact;
  smartEscalation: SmartEscalationNotice;
  recallStatus: 'active_distribution' | 'warning_flagged' | 'quarantine_ordered' | 'seizure_complete';
}

export interface Inspection {
  id: string;
  code: string;
  title: string;
  leadAuditor: string;
  status: 'scheduled' | 'in_progress' | 'review' | 'completed';
  scheduledDate: string;
  completedDate?: string;
  facility: string;
  productsCount: number;
  passedCount: number;
  failedCount: number;
  avgScore: number;
  notes: string;
  productIds: string[];
}

export interface ComplianceRule {
  id: string;
  code: string;
  title: string;
  category: string;
  description: string;
  severity: SeverityLevel;
  statutoryReference: string;
  active: boolean;
  version: string;
  lastUpdated: string;
  matchCriteria: string;
  enforcementThreshold: string;
}

export interface ReportItem {
  id: string;
  reportNumber: string;
  title: string;
  type: 'Product Compliance' | 'Audit Inspection' | 'Executive Summary' | 'Violation Matrix' | 'Comprehensive Audit';
  generatedAt: string;
  author: string;
  scope: string;
  complianceRate: number;
  criticalIssuesCount: number;
  status: 'ready' | 'archived';
  fileSize: string;
  storeName?: string;
  storeLocation?: string;
  productId?: string;
  evidenceCount?: number;
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: 'Controller of Legal Metrology' | 'Senior Inspection Officer' | 'Legal Metrology Officer' | 'Field Enforcement Inspector' | 'Verification Officer' | 'Manufacturer / Packer Lead' | 'Citizen Consumer';
  status: 'active' | 'away' | 'offline';
  avatar: string;
  assignedProducts: number;
  lastActive: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  actor: string;
  action: string;
  target: string;
  ipAddress: string;
  severity: 'info' | 'warn' | 'security';
}
