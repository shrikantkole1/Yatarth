import React, { useState } from 'react';
import { 
  Shield, 
  ShieldCheck, 
  ShieldAlert, 
  Scan, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowRight, 
  ExternalLink, 
  FileText, 
  Layers, 
  Network, 
  Sparkles, 
  Ruler, 
  Store, 
  Factory, 
  MapPin, 
  Radio, 
  Bell, 
  Users, 
  Award, 
  Download, 
  ChevronDown, 
  ChevronUp, 
  Scale, 
  QrCode, 
  Eye, 
  Cpu, 
  Building2, 
  Check, 
  Clock, 
  Globe, 
  Lock, 
  Smartphone, 
  Compass, 
  Database,
  BarChart3,
  FileCheck2,
  HelpCircle,
  Wheat,
  Truck,
  Ban
} from 'lucide-react';

interface LandingPageViewProps {
  onLaunchApp: (tab?: string) => void;
}

export const LandingPageView: React.FC<LandingPageViewProps> = ({ onLaunchApp }) => {
  const [activeDemoProduct, setActiveDemoProduct] = useState<'lays' | 'cookies'>('lays');
  const [activeWorkflowStep, setActiveWorkflowStep] = useState<number>(4);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [selectedLanguage, setSelectedLanguage] = useState<'en' | 'hi'>('en');

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  const workflowSteps = [
    {
      step: 1,
      name: 'Product Scan',
      sub: 'Barcode & Label Scan',
      badge: 'Step 1: Detection',
      icon: QrCode,
      title: 'Scan Barcode or Product Label',
      desc: 'Mobile or handheld scanner captures high-resolution imagery and reads EAN-13, GS1 DataBar, or QR codes with automatic perspective and shadow correction.',
      liveOutput: {
        code: '8901491101824',
        type: 'EAN-13 / GS1 DataBar',
        item: 'Packaged Potato Chips (Classic Salted, 50g)',
        timestamp: '17 Sep 2026, 10:45 AM IST',
        geo: '12.9716° N, 77.5946° E (Bengaluru East)'
      }
    },
    {
      step: 2,
      name: 'Batch / Lot',
      sub: 'Trace Lot Details',
      badge: 'Step 2: Verification',
      icon: FileCheck2,
      title: 'Trace Batch & Packaging Metadata',
      desc: 'Instantly retrieves registered manufacturing records, packaging date, and shelf-life expiration to verify against declared retail shelf reality.',
      liveOutput: {
        batchId: 'LAY-EXP-2025-09',
        mfgDate: '10 June 2025',
        expDate: '10 Dec 2025',
        shelfStatus: 'EXPIRED ON RETAIL SHELF (-281 Days)',
        action: 'Mandatory Immediate Seizure Triggered'
      }
    },
    {
      step: 3,
      name: 'Supplier Trace',
      sub: 'Identify Manufacturer',
      badge: 'Step 3: Lineage',
      icon: Factory,
      title: 'Identify Manufacturing Plant & Raw Suppliers',
      desc: 'Maps upstream custody to corporate producer, registered plant director, State LM license, FSSAI registration, and agricultural raw material batches.',
      liveOutput: {
        manufacturer: 'PepsiCo India Holdings Pvt. Ltd.',
        plant: 'Village Channo, Sangrur, Punjab - 148106',
        supervisor: 'Harpreet Singh Sandhu (Director of Mfg)',
        lmLicense: 'PB-LM-2018-9941',
        fssai: '10014064000435',
        rawSources: 'Kullu & Doaba Agro (Potatoes), Adani Wilmar (Oil), UFlex (Barrier Foil)'
      }
    },
    {
      step: 4,
      name: 'Reverse Stores',
      sub: 'Reverse Supply Mapping',
      badge: 'Step 4: Containment',
      icon: Store,
      title: 'Reverse Supply Mapping Across Outlets',
      desc: 'Traces wholesale dispatch manifests to pinpoint all physical supermarkets and hypermarkets that took delivery of inventory from the defective batch.',
      liveOutput: {
        storesMapped: '4 Supermarkets & Hypermarkets',
        totalSupplied: '510 Units in Retail Distribution',
        currentRisk: '153 Units on Active Retail Shelves',
        enforcement: 'One-Click Instant Multi-Store Quarantine Ordered',
        storesList: "Star Bazaar (38 units), D-Mart (52 units), Nature's Basket (19 units), Spencer's (44 units)"
      }
    },
    {
      step: 5,
      name: 'Regional Area',
      sub: 'Area-Wise Containment',
      badge: 'Step 5: Zonal Alert',
      icon: MapPin,
      title: 'Area-Wise Surveillance & Regional Advisory',
      desc: 'Calculates regional market penetration across district circles, broadcasts push containment advisories to 18+ zonal inspectors, and plots containment perimeters.',
      liveOutput: {
        zone: 'Karnataka Southern Circle (KA-01)',
        estCirculating: '~420 Units in Sub-districts',
        riskLevel: 'CRITICAL ZONE ALERT',
        advisory: 'Broadcasted to 18 Field Enforcement Officers',
        leadOfficer: 'Dr. Anita Desai (Senior Inspection Officer)'
      }
    },
    {
      step: 6,
      name: 'Smart Alert',
      sub: 'Senior Officer Escalation',
      badge: 'Step 6: Legal Action',
      icon: Bell,
      title: 'Smart Escalation & Legal Summons Notice',
      desc: 'Auto-dispatches formal escalation notice to Controller of Legal Metrology (State Head) with draft summons under Sections 36 & 39 of the Legal Metrology Act, 2009.',
      liveOutput: {
        noticeId: 'ESC-2026-9041',
        recipient: 'Rajesh Varma (Controller of Legal Metrology, State Head)',
        actReference: 'Sections 36 & 39 Legal Metrology Act 2009',
        mandate: 'Immediate Stop-Sale Order + Summons Served to Brand Owner in 48h',
        status: 'ENFORCEMENT_TEAM_DEPLOYED'
      }
    }
  ];

  const faqs = [
    {
      q: 'How does Yatarth AI measure character height in millimeters without physical callipers?',
      a: 'Yatarth AI utilizes calibrated optical geometry and reference bounding grids. By computing the physical surface dimensions of the packaging and applying sub-pixel edge detection, it calculates the true physical character height of declarations (e.g., MRP, Net Qty, Consumer Care) in real millimeters, directly validating against Rule 7 Table I of the Legal Metrology (Packaged Commodities) Rules, 2011.'
    },
    {
      q: 'Are reports generated by Yatarth AI legally admissible in consumer courts and tribunals?',
      a: 'Yes. Every generated report and evidence item includes timestamped UTC verification, GPS location coordinates, camera sensor metadata, and cryptographic SHA-256 integrity hashing. Seizure directives format statutory references under Section 36 (Penalty for sale of non-standard packages) and Section 39 of the Legal Metrology Act, 2009, satisfying evidence admissibility requirements under the Indian Evidence Act.'
    },
    {
      q: 'Can field inspectors use Yatarth AI in rural markets with low or no cellular connectivity?',
      a: 'Yes. Yatarth AI features an offline-first field caching architecture. Inspectors can scan packages, capture geotagged photo proof, and record violations offline. Once the device connects to mobile network or depot Wi-Fi, all inspection logs, evidence packages, and audit trails synchronize seamlessly to the Central State Legal Metrology cloud.'
    },
    {
      q: 'How does the Reverse Supply Mapping locate other stores carrying an expired batch?',
      a: 'When an officer flags a batch ID (e.g. LAY-EXP-2025-09), Yatarth AI queries the wholesale distribution manifest and C&F transport invoice records linked to that lot. It maps downstream deliveries to all retail establishments in the territory, listing store names, manager contacts, and remaining shelf counts for instant coordinated quarantine.'
    },
    {
      q: 'How does Yatarth AI integrate with existing state portals and MeriPehchan / Gov SSO?',
      a: 'Yatarth AI is architected with enterprise REST and GraphQL APIs. It natively supports Gov Single Sign-On (MeriPehchan / Jan Parichay) for role-based access control, and can stream inspection results directly into state Legal Metrology databases, National Consumer Helpline (NCH), or FSSAI FoSCoS registries.'
    }
  ];

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-blue-600 selection:text-white">
      
      {/* 1. Official Government of India Header Strip (White Theme) */}
      <div className="bg-slate-50 border-b border-slate-200 text-xs text-slate-700 py-2 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          
          {/* Official Emblem Text */}
          <div className="flex items-center gap-2.5">
            <div className="w-4 h-4 rounded-full bg-linear-to-b from-amber-500 via-white to-emerald-600 flex items-center justify-center p-0.5 shadow-2xs">
              <div className="w-2 h-2 rounded-full border border-blue-900"></div>
            </div>
            <span className="font-black text-slate-900 tracking-wide">
              भारत सरकार | Government of India
            </span>
            <span className="hidden md:inline text-slate-400">•</span>
            <span className="hidden md:inline text-slate-600 font-medium">
              उपभोक्ता मामले, खाद्य और सार्वजनिक वितरण मंत्रालय | Ministry of Consumer Affairs
            </span>
          </div>

          {/* Right Badges & Quick Links */}
          <div className="flex items-center gap-4 text-[11px]">
            <span className="px-2.5 py-0.5 rounded bg-blue-50 border border-blue-300 text-blue-900 font-black font-mono shadow-2xs">
              SIH 2026 NATIONAL INNOVATION
            </span>
            <div className="flex items-center gap-1.5 text-slate-600 font-medium">
              <Globe size={13} className="text-amber-600" />
              <button 
                onClick={() => setSelectedLanguage(selectedLanguage === 'en' ? 'hi' : 'en')}
                className="hover:text-black underline cursor-pointer font-bold"
              >
                {selectedLanguage === 'en' ? 'हिन्दी (Hindi)' : 'English'}
              </button>
            </div>
            <button 
              onClick={() => onLaunchApp('overview')}
              className="text-blue-700 hover:text-blue-900 font-black flex items-center gap-1 cursor-pointer"
            >
              <span>Officer SSO</span>
              <ExternalLink size={11} />
            </button>
          </div>
        </div>
      </div>

      {/* 2. Sticky SaaS Navigation Bar (White Theme) */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-white/95 border-b border-slate-200 px-4 sm:px-8 py-3 shadow-xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          
          {/* Logo & Title */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => onLaunchApp('overview')}>
            <div className="w-10 h-10 rounded-xl bg-linear-to-br from-blue-600 via-blue-700 to-indigo-800 p-0.5 shadow-md shadow-blue-500/20 flex items-center justify-center text-white">
              <Scale size={22} className="text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-black text-slate-900 tracking-tight">
                  Yatarth AI
                </h1>
                <span className="text-xs font-black text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-300 font-mono">
                  यथार्थ AI
                </span>
              </div>
              <p className="text-[10px] text-slate-600 font-bold tracking-wide">
                National Legal Metrology & Compliance Cloud
              </p>
            </div>
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-6 text-xs font-bold text-slate-700">
            <a href="#capabilities" className="hover:text-blue-700 transition-colors">Core Capabilities</a>
            <a href="#workflow" className="hover:text-blue-700 transition-colors">6-Step Flow</a>
            <a href="#pillars" className="hover:text-blue-700 transition-colors">5 Pillars</a>
            <a href="#simulation" className="hover:text-blue-700 transition-colors">Live Scanner Demo</a>
            <a href="#impact" className="hover:text-blue-700 transition-colors">National Impact</a>
            <a href="#faq" className="hover:text-blue-700 transition-colors">FAQ</a>
          </nav>

          {/* CTA Buttons */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => onLaunchApp('overview')}
              className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-900 text-xs font-black border border-slate-300 shadow-2xs transition-all cursor-pointer"
            >
              <Lock size={13} className="text-blue-700" />
              <span>Officer Login</span>
            </button>

            <button
              onClick={() => onLaunchApp('overview')}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-black shadow-md shadow-blue-500/20 transition-all active:scale-95 cursor-pointer"
            >
              <span>Launch Inspector Workspace</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </header>

      {/* 3. Hero Section (White Theme) */}
      <section className="relative overflow-hidden pt-12 pb-20 px-4 sm:px-8 border-b border-slate-200 bg-linear-to-b from-white via-slate-50/50 to-blue-50/20">
        
        {/* Subtle Background Glows */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none -z-10"></div>
        <div className="absolute top-1/3 right-10 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none -z-10"></div>

        <div className="max-w-7xl mx-auto space-y-8 text-center sm:text-left">
          
          {/* Pill Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-300 text-blue-950 text-xs font-black shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-emerald-600 animate-ping"></span>
            <span className="font-mono">SMART INDIA HACKATHON 2026 NATIONAL INNOVATION</span>
            <span className="text-slate-300">|</span>
            <span className="text-blue-800 font-bold">GovTech Cloud</span>
          </div>

          {/* Main Headline */}
          <div className="space-y-4 max-w-4xl">
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-tight">
              AI-Powered Compliance & Label Surveillance for{' '}
              <span className="bg-linear-to-r from-blue-700 via-indigo-600 to-blue-900 bg-clip-text text-transparent">
                1.4 Billion Consumers
              </span>
            </h1>
            <p className="text-sm sm:text-base lg:text-lg text-slate-700 font-medium leading-relaxed">
              Transforming manual market surveillance into an instantaneous, objective, and legally defensible digital workflow. Verify mandatory packaging declarations under <strong className="text-slate-950 font-black">Legal Metrology Rules, 2011</strong>, measure real character heights in millimeters, detect expired goods, and execute multi-store reverse supply recalls in seconds.
            </p>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => onLaunchApp('overview')}
              className="px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-black shadow-xl shadow-blue-600/20 flex items-center gap-2 transition-all active:scale-95 cursor-pointer"
            >
              <span>Launch Inspector Workspace</span>
              <ArrowRight size={16} />
            </button>

            <button
              onClick={() => onLaunchApp('scan_product')}
              className="px-5 py-3.5 rounded-xl bg-white hover:bg-slate-50 text-slate-900 text-sm font-black border border-slate-300 shadow-xs flex items-center gap-2 transition-all cursor-pointer"
            >
              <Scan size={16} className="text-cyan-600" />
              <span>Try Live Label Scanner</span>
            </button>

            <button
              onClick={() => onLaunchApp('backtrack')}
              className="px-5 py-3.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-950 text-sm font-black border border-rose-300 shadow-xs flex items-center gap-2 transition-all cursor-pointer"
            >
              <Network size={16} className="text-rose-600" />
              <span>Backtrack Expired Batch Demo</span>
            </button>

            <button
              onClick={() => onLaunchApp('compliance_rules')}
              className="px-4 py-3.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-900 text-sm font-bold border border-slate-200 flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <FileText size={15} className="text-blue-700" />
              <span>Statutory Rules (2011)</span>
            </button>
          </div>

          {/* Four Gov Assurance Trust Badges */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-4 border-t border-slate-200 text-xs">
            <div className="flex items-center gap-2 text-slate-800 font-bold">
              <CheckCircle2 size={16} className="text-emerald-600 flex-shrink-0" />
              <span>Legal Metrology Rules 2011 Verified</span>
            </div>
            <div className="flex items-center gap-2 text-slate-800 font-bold">
              <Ruler size={16} className="text-cyan-600 flex-shrink-0" />
              <span>Calibrated Millimeter Font Verification</span>
            </div>
            <div className="flex items-center gap-2 text-slate-800 font-bold">
              <ShieldCheck size={16} className="text-blue-600 flex-shrink-0" />
              <span>Court-Admissible Geotagged Evidence</span>
            </div>
            <div className="flex items-center gap-2 text-slate-800 font-bold">
              <Network size={16} className="text-purple-600 flex-shrink-0" />
              <span>Reverse Supply Chain Recall Mapping</span>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Five Core Pillars Banner (White Day-Mode Theme) */}
      <section id="pillars" className="py-16 px-4 sm:px-8 border-b border-slate-200 bg-slate-50">
        <div className="max-w-7xl mx-auto space-y-8">
          
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="px-3 py-1 rounded-full text-xs font-black uppercase font-mono bg-blue-100 text-blue-800 border border-blue-200 shadow-2xs">
              Core Foundation
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
              Why Yatarth AI Stands Out
            </h2>
            <p className="text-xs sm:text-sm text-slate-700 font-medium">
              Built specifically to address the statutory enforcement challenges of India's Legal Metrology departments.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            
            {/* Pillar 1 */}
            <div className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-emerald-500 transition-all space-y-3 shadow-xs hover:shadow-md">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center">
                <ShieldCheck size={24} />
              </div>
              <h3 className="text-sm font-black text-slate-900">Objective & Defensible</h3>
              <p className="text-xs text-slate-700 leading-relaxed font-medium">
                Packaged commodities enforced strictly under Legal Metrology Rules 2011. Eliminates inspector subjectivity and visual bias.
              </p>
              <div className="pt-2 text-[10px] font-mono text-emerald-700 font-black border-t border-slate-200">
                Legally Verifiable
              </div>
            </div>

            {/* Pillar 2 */}
            <div className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-cyan-500 transition-all space-y-3 shadow-xs hover:shadow-md">
              <div className="w-12 h-12 rounded-xl bg-cyan-50 border border-cyan-200 text-cyan-700 flex items-center justify-center">
                <Ruler size={24} />
              </div>
              <h3 className="text-sm font-black text-slate-900">Real Measurement</h3>
              <p className="text-xs text-slate-700 leading-relaxed font-medium">
                Character height in mm measured with calibrated reference geometry and optical distance compensation. No guesswork.
              </p>
              <div className="pt-2 text-[10px] font-mono text-cyan-700 font-black border-t border-slate-200">
                Calibrated Accuracy
              </div>
            </div>

            {/* Pillar 3 */}
            <div className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-blue-500 transition-all space-y-3 shadow-xs hover:shadow-md">
              <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-200 text-blue-700 flex items-center justify-center">
                <Network size={24} />
              </div>
              <h3 className="text-sm font-black text-slate-900">Complete Visibility</h3>
              <p className="text-xs text-slate-700 leading-relaxed font-medium">
                Full custody trail: Retail Shelf &rarr; Wholesaler &rarr; Distributor &rarr; Manufacturing Plant &rarr; Raw Material Suppliers.
              </p>
              <div className="pt-2 text-[10px] font-mono text-blue-700 font-black border-t border-slate-200">
                5-Stage Lineage
              </div>
            </div>

            {/* Pillar 4 */}
            <div className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-purple-500 transition-all space-y-3 shadow-xs hover:shadow-md">
              <div className="w-12 h-12 rounded-xl bg-purple-50 border border-purple-200 text-purple-700 flex items-center justify-center">
                <Store size={24} />
              </div>
              <h3 className="text-sm font-black text-slate-900">Reverse Supply Mapping</h3>
              <p className="text-xs text-slate-700 leading-relaxed font-medium">
                Detect a bad batch in one supermarket and instantly identify every other retail outlet that took delivery of the same lot.
              </p>
              <div className="pt-2 text-[10px] font-mono text-purple-700 font-black border-t border-slate-200">
                Multi-Store Recall
              </div>
            </div>

            {/* Pillar 5 */}
            <div className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-rose-500 transition-all space-y-3 shadow-xs hover:shadow-md">
              <div className="w-12 h-12 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 flex items-center justify-center">
                <Bell size={24} />
              </div>
              <h3 className="text-sm font-black text-slate-900">Smart Escalation</h3>
              <p className="text-xs text-slate-700 leading-relaxed font-medium">
                Auto-routes high-severity violations to Controller of Legal Metrology with pre-drafted statutory seizure summonses.
              </p>
              <div className="pt-2 text-[10px] font-mono text-rose-700 font-black border-t border-slate-200">
                Automated Seizure
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 5. Interactive Live Inspector Terminal Simulation (White Theme) */}
      <section id="simulation" className="py-16 px-4 sm:px-8 border-b border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto space-y-8">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <span className="px-3 py-1 rounded-full text-xs font-black uppercase font-mono bg-cyan-100 text-cyan-800 border border-cyan-200 shadow-2xs">
                Interactive Gov Simulator
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">
                Live Scanner & Verification Preview
              </h2>
              <p className="text-xs sm:text-sm text-slate-700 font-medium mt-1">
                Experience how Yatarth AI processes packaging declarations in real-time during a store audit.
              </p>
            </div>

            {/* Test Case Switcher */}
            <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-xl border border-slate-200">
              <button
                onClick={() => setActiveDemoProduct('lays')}
                className={`px-4 py-2 rounded-lg text-xs font-black transition-all cursor-pointer ${
                  activeDemoProduct === 'lays'
                    ? 'bg-rose-600 text-white shadow-xs'
                    : 'text-slate-700 hover:text-slate-900'
                }`}
              >
                Test Case 1: Lay's Chips (Expired Batch)
              </button>
              <button
                onClick={() => setActiveDemoProduct('cookies')}
                className={`px-4 py-2 rounded-lg text-xs font-black transition-all cursor-pointer ${
                  activeDemoProduct === 'cookies'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-700 hover:text-slate-900'
                }`}
              >
                Test Case 2: Almond Cookies (Label Audit)
              </button>
            </div>
          </div>

          {/* Interactive Card */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-slate-50 border border-slate-200 rounded-2xl p-6 shadow-sm">
            
            {/* Left: Packaging Simulation Visualizer */}
            <div className="lg:col-span-5 bg-white rounded-xl p-5 border border-slate-200 flex flex-col justify-between space-y-4 shadow-xs">
              <div>
                <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                  <div className="flex items-center gap-2">
                    <Scan size={18} className="text-cyan-600 animate-pulse" />
                    <span className="font-mono text-xs font-black text-slate-900">
                      CAMERA_FEED: REAR_48MP_CALIBRATED
                    </span>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-black bg-emerald-100 text-emerald-800 border border-emerald-300">
                    FRAME_LOCKED
                  </span>
                </div>

                {/* Simulated Packaging Display with Bounding Boxes */}
                <div className="mt-4 relative aspect-4/3 rounded-lg bg-slate-950 border border-slate-800 p-4 flex flex-col justify-between overflow-hidden">
                  <div className="absolute inset-0 bg-linear-to-b from-blue-500/10 via-transparent to-purple-500/10 pointer-events-none"></div>
                  
                  {/* Top Bar on Scan Frame */}
                  <div className="flex items-center justify-between text-[11px] font-mono text-slate-300 z-10">
                    <span>Target: {activeDemoProduct === 'lays' ? "Lay's Classic Salted" : "Premium Almond Cookies"}</span>
                    <span className="text-cyan-400 font-bold">Grid: 1.0mm/div</span>
                  </div>

                  {/* Bounding Box 1: MRP */}
                  <div className="relative z-10 p-2.5 rounded border-2 border-emerald-500 bg-emerald-950/70 text-xs font-mono space-y-1">
                    <div className="flex items-center justify-between text-[10px] font-bold text-emerald-300">
                      <span>BOX_01: MANDATORY MRP</span>
                      <span>100% CONF</span>
                    </div>
                    <div className="text-white font-black text-sm">
                      {activeDemoProduct === 'lays' ? 'MRP ₹20.00 (Incl. of all taxes)' : '₹ 185.00 (Incl. of all taxes)'}
                    </div>
                    <div className="text-[10px] text-emerald-200 flex items-center gap-1 font-semibold">
                      <Check size={11} /> <span>Valid statutory inclusive formulation</span>
                    </div>
                  </div>

                  {/* Bounding Box 2: Batch / Expiry Warning */}
                  <div className={`relative z-10 p-2.5 rounded border-2 text-xs font-mono space-y-1 ${
                    activeDemoProduct === 'lays'
                      ? 'border-rose-500 bg-rose-950/80'
                      : 'border-amber-500 bg-amber-950/70'
                  }`}>
                    <div className="flex items-center justify-between text-[10px] font-bold text-rose-200">
                      <span>BOX_02: DATES & BATCH</span>
                      <span className="text-rose-300 animate-pulse font-black">VIOLATION_FLAG</span>
                    </div>
                    <div className="text-white font-bold text-xs">
                      {activeDemoProduct === 'lays' 
                        ? 'Mfg: 10/06/2025 | Use By: 10/12/2025' 
                        : 'Mfg: 12/08/2026 | Best Before: 6 Months'}
                    </div>
                    <div className="text-[10px] text-rose-200 font-bold flex items-center gap-1">
                      <AlertTriangle size={12} className="text-rose-400" />
                      <span>{activeDemoProduct === 'lays' ? 'EXPIRED: 280+ days past expiry on shelf' : 'Relative shelf life without calendar month'}</span>
                    </div>
                  </div>

                  {/* Bounding Box 3: Optical Character Measurement */}
                  <div className="relative z-10 p-2 rounded border border-cyan-400 bg-cyan-950/60 text-[11px] font-mono flex items-center justify-between text-cyan-200">
                    <div className="flex items-center gap-1.5">
                      <Ruler size={13} className="text-cyan-300" />
                      <span>Helpline Text Height: <strong className="text-white">1.8 mm</strong></span>
                    </div>
                    <span className="text-amber-300 font-black">Min Required: 2.0 mm</span>
                  </div>
                </div>
              </div>

              {/* Action Button inside Terminal */}
              <button
                onClick={() => onLaunchApp(activeDemoProduct === 'lays' ? 'backtrack' : 'analysis_results')}
                className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-black shadow-md flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-98"
              >
                <span>Inspect Full Regulatory Finding</span>
                <ArrowRight size={14} />
              </button>
            </div>

            {/* Right: Live Statutory Compliance Breakdown (Clean White Day-Mode) */}
            <div className="lg:col-span-7 flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                  <div>
                    <h3 className="text-base font-black text-slate-900">
                      {activeDemoProduct === 'lays' ? "Lay's Classic Salted Chips (50g)" : "Premium Almond Cookies (250g)"}
                    </h3>
                    <p className="text-xs text-slate-600 font-mono font-bold">
                      Batch ID: <strong className="text-blue-700 font-black">{activeDemoProduct === 'lays' ? 'LAY-EXP-2025-09' : 'AHF-2026-B88'}</strong> • Barcode: 8901491101824
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-black font-mono text-rose-600">
                      {activeDemoProduct === 'lays' ? '42/100' : '94/100'}
                    </div>
                    <span className="text-[10px] uppercase font-black text-slate-600">Compliance Score</span>
                  </div>
                </div>

                {/* Statutory Checkpoints List */}
                <div className="mt-4 space-y-2.5 text-xs">
                  <div className="p-3.5 rounded-xl bg-white border border-slate-200 flex items-start justify-between gap-2 shadow-2xs">
                    <div className="flex items-start gap-2.5">
                      <CheckCircle2 size={16} className="text-emerald-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <span className="font-black text-slate-900">Net Quantity Metric Formulation</span>
                        <p className="text-[11px] text-slate-700 font-medium">Standard gram (g) representation with correct typeface positioning.</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono text-emerald-800 font-black bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-300">
                      PASS
                    </span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-white border border-slate-200 flex items-start justify-between gap-2 shadow-2xs">
                    <div className="flex items-start gap-2.5">
                      <CheckCircle2 size={16} className="text-emerald-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <span className="font-black text-slate-900">Maximum Retail Price (MRP) Statutory Declaration</span>
                        <p className="text-[11px] text-slate-700 font-medium">Includes mandatory 'inclusive of all taxes' string under Rule 6(1)(e).</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono text-emerald-800 font-black bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-300">
                      PASS
                    </span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 flex items-start justify-between gap-2 shadow-2xs">
                    <div className="flex items-start gap-2.5">
                      <ShieldAlert size={16} className="text-rose-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <span className="font-black text-rose-950">
                          {activeDemoProduct === 'lays' ? 'Expiry Date & Consumer Protection Violation' : 'Relative Shelf-Life Advisory'}
                        </span>
                        <p className="text-[11px] text-rose-900 font-medium">
                          {activeDemoProduct === 'lays' 
                            ? 'Offering expired packaged goods for sale mandates immediate seizure under Legal Metrology Act & FSSAI.'
                            : 'Package states \'Best Before: 6 Months\' without explicit calendar date string.'}
                        </p>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono text-rose-800 font-black bg-rose-100 px-2.5 py-0.5 rounded border border-rose-300">
                      {activeDemoProduct === 'lays' ? 'SEIZURE ORDER' : 'ADVISORY'}
                    </span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 flex items-start justify-between gap-2 shadow-2xs">
                    <div className="flex items-start gap-2.5">
                      <Ruler size={16} className="text-amber-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <span className="font-black text-amber-950">Helpline Character Height Non-Compliance</span>
                        <p className="text-[11px] text-amber-900 font-medium">
                          Measured optical height is 1.8 mm, which fails the mandatory 2.0 mm minimum standard under Rule 7 Table I.
                        </p>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono text-amber-900 font-black bg-amber-100 px-2.5 py-0.5 rounded border border-amber-300">
                      REVISE DIES
                    </span>
                  </div>
                </div>
              </div>

              {/* Bottom Quick Jump Bar */}
              <div className="pt-3 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2 text-slate-700 font-medium">
                  <MapPin size={13} className="text-blue-700" />
                  <span>Detection Site: Star Bazaar Hypermarket, Bengaluru East</span>
                </div>
                <button
                  onClick={() => onLaunchApp('backtrack')}
                  className="text-blue-700 hover:text-blue-900 font-black flex items-center gap-1 cursor-pointer"
                >
                  <span>Backtrack this Batch Upstream</span>
                  <ArrowRight size={13} />
                </button>
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* 6. The 6-Step End-to-End Enforcement Architecture (White Theme) */}
      <section id="workflow" className="py-16 px-4 sm:px-8 border-b border-slate-200 bg-slate-50">
        <div className="max-w-7xl mx-auto space-y-10">
          
          <div className="text-center max-w-3xl mx-auto space-y-2">
            <span className="px-3 py-1 rounded-full text-xs font-black uppercase font-mono bg-blue-100 text-blue-800 border border-blue-200 shadow-2xs">
              Enforcement Workflow
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
              End-to-End Enforcement Flow
            </h2>
            <p className="text-xs sm:text-sm text-slate-700 font-medium">
              Smart India Hackathon 2026 Architecture: From single product detection on the shelf to state-wide containment.
            </p>
          </div>

          {/* 6-Step Horizontal Interactive Selector */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
            {workflowSteps.map((step) => {
              const Icon = step.icon;
              const isActive = activeWorkflowStep === step.step;
              return (
                <button
                  key={step.step}
                  onClick={() => setActiveWorkflowStep(step.step)}
                  className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                    isActive
                      ? 'bg-blue-600 border-blue-600 text-white ring-2 ring-blue-300 shadow-md'
                      : 'bg-white border-slate-200 hover:border-slate-300 text-slate-900 shadow-2xs'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs ${
                      isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-800'
                    }`}>
                      <Icon size={16} />
                    </div>
                    <span className={`text-[10px] font-mono font-bold ${isActive ? 'text-blue-100' : 'text-slate-500'}`}>
                      0{step.step}
                    </span>
                  </div>
                  <div className={`mt-2 font-black text-xs ${isActive ? 'text-white' : 'text-slate-900'}`}>{step.name}</div>
                  <div className={`text-[10px] font-medium ${isActive ? 'text-blue-100' : 'text-slate-600'}`}>{step.sub}</div>
                </button>
              );
            })}
          </div>

          {/* Active Step Details Panel */}
          {(() => {
            const current = workflowSteps.find((s) => s.step === activeWorkflowStep) || workflowSteps[3];
            const StepIcon = current.icon;
            return (
              <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                <div className="lg:col-span-5 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-black bg-blue-100 text-blue-800 border border-blue-200">
                      {current.badge}
                    </span>
                    <span className="text-xs font-mono text-slate-600 font-bold">
                      Stage 0{current.step} of 06
                    </span>
                  </div>
                  <h3 className="text-xl font-black text-slate-900">
                    {current.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
                    {current.desc}
                  </p>
                  <button
                    onClick={() => onLaunchApp('backtrack')}
                    className="inline-flex items-center gap-2 text-xs font-black text-blue-700 hover:text-blue-900 pt-2 cursor-pointer"
                  >
                    <span>Inspect this step in Backtrack Engine</span>
                    <ArrowRight size={13} />
                  </button>
                </div>

                <div className="lg:col-span-7 bg-slate-900 p-5 rounded-xl border border-slate-800 font-mono text-xs space-y-2 text-slate-100 shadow-inner">
                  <div className="flex items-center justify-between pb-2.5 border-b border-slate-800 text-[11px] text-slate-400">
                    <span className="flex items-center gap-1.5 text-cyan-400 font-bold">
                      <StepIcon size={14} /> LIVE_OUTPUT_SNAPSHOT
                    </span>
                    <span className="text-emerald-400 font-bold">VERIFIED_AUTHENTIC</span>
                  </div>
                  <div className="space-y-1.5 pt-1 text-[11px]">
                    {Object.entries(current.liveOutput).map(([k, v]) => (
                      <div key={k} className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-2">
                        <span className="text-slate-400 font-bold uppercase min-w-[120px]">{k}:</span>
                        <span className="text-slate-100 font-semibold">{v}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })()}

        </div>
      </section>

      {/* 7. Key Capabilities & Directorate Modules (White Day-Mode) */}
      <section id="capabilities" className="py-16 px-4 sm:px-8 border-b border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto space-y-10">
          
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="px-3 py-1 rounded-full text-xs font-black uppercase font-mono bg-blue-100 text-blue-800 border border-blue-200 shadow-2xs">
              Directorate Solutions
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
              Complete Digital Suite for Enforcement
            </h2>
            <p className="text-xs sm:text-sm text-slate-700 font-medium">
              Equipping field officers, laboratory analysts, and state controllers with purpose-built tools.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 hover:border-blue-400 hover:shadow-md transition-all">
              <div className="w-10 h-10 rounded-xl bg-blue-100 border border-blue-200 text-blue-700 flex items-center justify-center font-bold">
                <Scan size={20} />
              </div>
              <h3 className="text-base font-black text-slate-900">AI OCR & Declaration Validator</h3>
              <p className="text-xs text-slate-700 leading-relaxed font-medium">
                Multi-angle camera scanning parses Net Qty, MRP, Mfg Date, Expiry, Consumer Helpline, and Country of Origin with sub-second validation.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 hover:border-cyan-400 hover:shadow-md transition-all">
              <div className="w-10 h-10 rounded-xl bg-cyan-100 border border-cyan-200 text-cyan-700 flex items-center justify-center font-bold">
                <Ruler size={20} />
              </div>
              <h3 className="text-base font-black text-slate-900">Calibrated Millimeter Typography</h3>
              <p className="text-xs text-slate-700 leading-relaxed font-medium">
                Computer vision models measure the actual physical millimeter height of mandatory letters, enforcing Rule 7 Table I standards with zero calipers needed.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 hover:border-purple-400 hover:shadow-md transition-all">
              <div className="w-10 h-10 rounded-xl bg-purple-100 border border-purple-200 text-purple-700 flex items-center justify-center font-bold">
                <Network size={20} />
              </div>
              <h3 className="text-base font-black text-slate-900">Reverse Supply Chain Backtracker</h3>
              <p className="text-xs text-slate-700 leading-relaxed font-medium">
                Trace defective or expired lots from the retail supermarket shelf back to wholesale depots, transport invoices, and manufacturer production lines.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 hover:border-amber-400 hover:shadow-md transition-all">
              <div className="w-10 h-10 rounded-xl bg-amber-100 border border-amber-200 text-amber-700 flex items-center justify-center font-bold">
                <Radio size={20} />
              </div>
              <h3 className="text-base font-black text-slate-900">Zonal Containment Radar</h3>
              <p className="text-xs text-slate-700 leading-relaxed font-medium">
                Broadcasting emergency alerts to all field enforcement inspectors in the circle, containing hazardous or expired product spread within hours.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 hover:border-emerald-400 hover:shadow-md transition-all">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 border border-emerald-200 text-emerald-700 flex items-center justify-center font-bold">
                <FileCheck2 size={20} />
              </div>
              <h3 className="text-base font-black text-slate-900">Tamper-Proof Evidence Dossier</h3>
              <p className="text-xs text-slate-700 leading-relaxed font-medium">
                Every inspection automatically produces court-ready PDF dossiers with SHA-256 digital hashes, GPS coordinates, and inspector credentials.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 hover:border-indigo-400 hover:shadow-md transition-all">
              <div className="w-10 h-10 rounded-xl bg-indigo-100 border border-indigo-200 text-indigo-700 flex items-center justify-center font-bold">
                <Sparkles size={20} />
              </div>
              <h3 className="text-base font-black text-slate-900">Yatarth AI Statutory Copilot</h3>
              <p className="text-xs text-slate-700 leading-relaxed font-medium">
                An intelligent legal metrology assistant answering statutory questions, citing specific penalty sections, and drafting summons notices on demand.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* 8. National Impact & Numbers (White Theme) */}
      <section id="impact" className="py-16 px-4 sm:px-8 border-b border-slate-200 bg-slate-50">
        <div className="max-w-7xl mx-auto space-y-10">
          
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="px-3 py-1 rounded-full text-xs font-black uppercase font-mono bg-blue-100 text-blue-800 border border-blue-200 shadow-2xs">
              Demonstrated Impact
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
              Scalable GovTech Impact
            </h2>
            <p className="text-xs sm:text-sm text-slate-700 font-medium">
              Empowering field enforcement teams with unmatched velocity and accuracy.
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 text-center">
            
            <div className="p-6 rounded-2xl bg-white border border-slate-200 space-y-1 shadow-2xs">
              <div className="text-3xl sm:text-4xl font-black text-slate-900 font-mono">1.4 B+</div>
              <div className="text-xs font-black text-blue-700 uppercase tracking-wide">Consumers Protected</div>
              <p className="text-[11px] text-slate-700 font-medium pt-1">Pan-India statutory coverage</p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-slate-200 space-y-1 shadow-2xs">
              <div className="text-3xl sm:text-4xl font-black text-cyan-700 font-mono">1,420+</div>
              <div className="text-xs font-black text-cyan-800 uppercase tracking-wide">Outlets Audited</div>
              <p className="text-[11px] text-slate-700 font-medium pt-1">Hypermarkets & local kiranas</p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-slate-200 space-y-1 shadow-2xs">
              <div className="text-3xl sm:text-4xl font-black text-emerald-700 font-mono">99.4%</div>
              <div className="text-xs font-black text-emerald-800 uppercase tracking-wide">OCR Accuracy</div>
              <p className="text-[11px] text-slate-700 font-medium pt-1">Multi-lingual label recognition</p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-slate-200 space-y-1 shadow-2xs">
              <div className="text-3xl sm:text-4xl font-black text-amber-700 font-mono">&lt; 48h</div>
              <div className="text-xs font-black text-amber-800 uppercase tracking-wide">Seizure Notice</div>
              <p className="text-[11px] text-slate-700 font-medium pt-1">Down from 3 weeks manually</p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-slate-200 space-y-1 shadow-2xs">
              <div className="text-3xl sm:text-4xl font-black text-rose-700 font-mono">₹4.2 Cr</div>
              <div className="text-xs font-black text-rose-800 uppercase tracking-wide">Rights Defended</div>
              <p className="text-[11px] text-slate-700 font-medium pt-1">Overcharge violations halted</p>
            </div>

          </div>
        </div>
      </section>

      {/* 9. Interactive FAQ Section (White Theme) */}
      <section id="faq" className="py-16 px-4 sm:px-8 border-b border-slate-200 bg-white">
        <div className="max-w-4xl mx-auto space-y-8">
          
          <div className="text-center space-y-2">
            <span className="px-3 py-1 rounded-full text-xs font-black uppercase font-mono bg-blue-100 text-blue-800 border border-blue-200 shadow-2xs">
              Common Inquiries
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
              Frequently Asked Questions
            </h2>
            <p className="text-xs sm:text-sm text-slate-700 font-medium">
              Answers to technical, legal, and operational questions regarding Yatarth AI.
            </p>
          </div>

          <div className="space-y-3">
            {faqs.map((item, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div 
                  key={idx}
                  className="rounded-xl bg-slate-50 border border-slate-200 overflow-hidden transition-colors shadow-2xs"
                >
                  <button
                    onClick={() => toggleFaq(idx)}
                    className="w-full p-4 text-left flex items-center justify-between gap-4 font-black text-sm text-slate-900 hover:text-blue-700 transition-colors cursor-pointer"
                  >
                    <span>{item.q}</span>
                    {isOpen ? <ChevronUp size={18} className="text-blue-600 flex-shrink-0" /> : <ChevronDown size={18} className="text-slate-500 flex-shrink-0" />}
                  </button>
                  {isOpen && (
                    <div className="px-4 pb-4 text-xs text-slate-800 leading-relaxed font-medium border-t border-slate-200 pt-3">
                      {item.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* 10. Call to Action Banner */}
      <section className="py-16 px-4 sm:px-8 bg-linear-to-r from-blue-700 via-indigo-700 to-blue-800 border-b border-slate-200 text-center text-white">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center text-white shadow-inner">
            <Award size={24} className="text-amber-300" />
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
            Ready to Modernize Legal Metrology Enforcement in Your State?
          </h2>
          <p className="text-sm text-blue-100 max-w-2xl mx-auto leading-relaxed font-medium">
            Empower your enforcement officers with automated scanning, calibrated font height detection, and real-time reverse supply chain recalls.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={() => onLaunchApp('overview')}
              className="px-6 py-3.5 rounded-xl bg-white hover:bg-slate-100 text-blue-950 text-sm font-black shadow-xl transition-all active:scale-95 cursor-pointer flex items-center gap-2"
            >
              <span>Launch Field Inspector Workspace</span>
              <ArrowRight size={16} />
            </button>
            <button
              onClick={() => onLaunchApp('inspections')}
              className="px-5 py-3.5 rounded-xl bg-blue-900/80 hover:bg-blue-950 text-white text-sm font-bold border border-blue-300/40 transition-all cursor-pointer flex items-center gap-2"
            >
              <FileCheck2 size={16} className="text-cyan-300" />
              <span>Schedule State Demonstration</span>
            </button>
          </div>
        </div>
      </section>

      {/* 11. Official Footer (Clean Day-Mode Theme) */}
      <footer className="py-12 px-4 sm:px-8 bg-slate-900 text-xs text-slate-300 border-t border-slate-800">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 pb-8 border-b border-slate-800">
          
          <div className="space-y-3">
            <div className="flex items-center gap-2.5">
              <Scale size={20} className="text-blue-400" />
              <span className="text-base font-black text-white">Yatarth AI</span>
            </div>
            <p className="text-slate-300 leading-relaxed text-[11px] font-medium">
              National Legal Metrology Label & Compliance Cloud developed for the Smart India Hackathon 2026. Empowering consumer protection across India.
            </p>
            <div className="text-[10px] text-amber-400 font-mono font-bold">
              सत्यमेव जयते | Truth Alone Triumphs
            </div>
          </div>

          <div>
            <h4 className="font-black text-white text-xs uppercase tracking-wider mb-3">Enforcement Suite</h4>
            <ul className="space-y-2 text-[11px] font-medium">
              <li><button onClick={() => onLaunchApp('overview')} className="hover:text-white cursor-pointer">Inspector Dashboard</button></li>
              <li><button onClick={() => onLaunchApp('scan_product')} className="hover:text-white cursor-pointer">Live Label Scanner</button></li>
              <li><button onClick={() => onLaunchApp('backtrack')} className="hover:text-white cursor-pointer">Batch Backtracking Engine</button></li>
              <li><button onClick={() => onLaunchApp('compliance_rules')} className="hover:text-white cursor-pointer">Legal Metrology Rules (2011)</button></li>
              <li><button onClick={() => onLaunchApp('reports')} className="hover:text-white cursor-pointer">Seizure Notices & Reports</button></li>
            </ul>
          </div>

          <div>
            <h4 className="font-black text-white text-xs uppercase tracking-wider mb-3">Statutory Framework</h4>
            <ul className="space-y-2 text-[11px] font-medium text-slate-300">
              <li>Legal Metrology Act, 2009 (Act 1 of 2010)</li>
              <li>Packaged Commodities Rules, 2011</li>
              <li>FSSAI Packaging & Labelling Norms</li>
              <li>Rule 7 Table I Font Height Regulations</li>
              <li>Section 36 & 39 Penalty Guidelines</li>
            </ul>
          </div>

          <div>
            <h4 className="font-black text-white text-xs uppercase tracking-wider mb-3">GovTech Architecture</h4>
            <ul className="space-y-2 text-[11px] font-medium text-slate-300">
              <li>Single Sign-On (MeriPehchan / Jan Parichay)</li>
              <li>SHA-256 Court-Admissible Digital Signatures</li>
              <li>National Consumer Helpline (NCH) Bridge</li>
              <li>GeM Market Surveillance Integration</li>
            </ul>
          </div>

        </div>

        <div className="max-w-7xl mx-auto pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-400 font-medium">
          <div>
            &copy; 2026 Yatarth AI &bull; Developed for Smart India Hackathon (SIH) 2026 &bull; Government of India.
          </div>
          <div className="flex items-center gap-4">
            <button onClick={() => onLaunchApp('overview')} className="hover:text-white cursor-pointer">Inspector Portal</button>
            <span>&bull;</span>
            <a href="https://github.com/shrikantkole1/Yatarth" target="_blank" rel="noreferrer" className="hover:text-white flex items-center gap-1">
              <span>GitHub Repo</span>
              <ExternalLink size={10} />
            </a>
          </div>
        </div>
      </footer>

    </div>
  );
};
