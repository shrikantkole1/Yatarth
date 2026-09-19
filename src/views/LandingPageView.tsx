import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ConsumerGrievanceFormView } from './ConsumerGrievanceFormView';
import { BusinessPortalView } from './BusinessPortalView';
import ashokaEmblem from '../assets/ashoka_emblem.png';
import {
  Scale, Shield, ShieldCheck, ShieldAlert, FileText, Search, Upload, Scan, Camera,
  PhoneCall, MessageSquare, Bot, Sparkles, Globe, RefreshCw,
  CheckCircle2, XCircle, AlertTriangle, User, Lock, Mail, Smartphone, Building2,
  ExternalLink, ChevronRight, ChevronDown, ArrowRight, X, HelpCircle, Send,
  Check, Clock, MapPin, Share2, Network, Store, QrCode, Home,
  Briefcase, ArrowLeft, Cpu, Activity, Target, BarChart2, IndianRupee, Zap, ArrowUpRight,
  Ruler, Radio, Bell
} from 'lucide-react';

interface LandingPageViewProps {
  onLaunchApp: (tab?: string) => void;
}

export const LandingPageView: React.FC<LandingPageViewProps> = ({ onLaunchApp }) => {
  const { switchRole } = useApp();

  // Portal Navigation State: 'home' | 'grievance_form' | 'tracking_view' | 'business_portal'
  const [activePortalView, setActivePortalView] = useState<'home' | 'grievance_form' | 'tracking_view' | 'business_portal'>('home');

  // Four Role Switcher Dropdown State
  const [roleDropdownOpen, setRoleDropdownOpen] = useState<boolean>(false);

  // Workflow Stage Switcher State (6 Steps)
  const [activeWorkflowStep, setActiveWorkflowStep] = useState<number>(4);

  // Live Scanner Preview Test Case State ('lays' | 'cookies')
  const [activeTestCase, setActiveTestCase] = useState<'lays' | 'cookies'>('lays');

  // FAQ Accordion State (0 = open by default)
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  // Chatbot Drawer State
  const [chatbotOpen, setChatbotOpen] = useState<boolean>(false);
  const [chatMessages, setChatMessages] = useState<Array<{ sender: 'bot' | 'user'; text: string; time: string }>>([
    {
      sender: 'bot',
      text: 'Namaste! I am Yatarth AI, your Legal Metrology & Packaging Compliance Assistant. How can I assist you with statutory rules, verification, or filing an overcharge complaint today?',
      time: 'Just now'
    }
  ]);
  const [chatInput, setChatInput] = useState<string>('');

  // Tracking query state
  const [trackedId, setTrackedId] = useState<string>('LMPC-2026-089');
  const [trackedRecord] = useState<any>({
    id: 'LMPC-2026-089',
    product: 'Sparkling Lemonade (600ml Bottle)',
    category: 'Beverages',
    violation: 'Overcharging Rs 15 above declared MRP at Transit Food Plaza',
    date: '14 Sep 2026',
    stage: 3,
    status: 'Notice Served under Section 36',
    officer: 'Vikram Sengupta (Legal Metrology Officer, Zone 2)',
    timeline: [
      { step: '1. Grievance Registered', date: '14 Sep 2026, 11:20 AM', done: true, desc: 'Consumer submitted digital bill and photo evidence' },
      { step: '2. Yatarth AI Optical Verification', date: '14 Sep 2026, 11:21 AM', done: true, desc: 'OCR verified declared MRP is Rs 40; billed amount Rs 55' },
      { step: '3. Legal Metrology Officer Investigation', date: '15 Sep 2026, 03:40 PM', done: true, desc: 'Inspection order issued to Vendor ID V-7741' },
      { step: '4. Compounding / Prosecution Resolution', date: 'In Progress (Expected 20 Sep 2026)', done: false, desc: 'Summons notice served for compounding penalty under Section 36' }
    ]
  });

  // Four Role-Based Portals (Zero-Auth Direct Entry)
  const handleSelectRolePortal = (role: 'inspector' | 'business' | 'consumer' | 'controller') => {
    setRoleDropdownOpen(false);
    switchRole(role);
  };

  const handleChatSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!chatInput.trim()) return;

    const userMsg = chatInput.trim();
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    setChatMessages((prev) => [
      ...prev,
      { sender: 'user', text: userMsg, time: now }
    ]);
    setChatInput('');

    setTimeout(() => {
      let botReply = '';
      const lower = userMsg.toLowerCase();
      if (lower.includes('cooling') || lower.includes('chill') || lower.includes('above mrp') || lower.includes('extra')) {
        botReply = 'Under Section 36 of the Legal Metrology Act 2009, charging any amount above the Maximum Retail Price (MRP) - including cooling or refrigeration charges - is strictly ILLEGAL. Retailers are liable for penalties up to Rs 25,000 for first offence, and up to Rs 50,000 or imprisonment for repeat violations.';
      } else if (lower.includes('usp') || lower.includes('unit sale price')) {
        botReply = 'Under Rule 6(11) of the Legal Metrology (Packaged Commodities) Rules 2011, every package containing more than 1kg/1L must declare Unit Sale Price (USP) per 100g, per 100ml, or per piece to ensure transparent price comparison for consumers.';
      } else if (lower.includes('track') || lower.includes('status')) {
        botReply = 'You can track any filed grievance by entering your Complaint ID (e.g. LMPC-2026-089) in the Track Your Grievance card on the homepage. Resolution generally takes 3 to 7 working days.';
      } else if (lower.includes('font') || lower.includes('height')) {
        botReply = 'Under Rule 7 & Table I of LMR 2011, numeral and letter heights for mandatory declarations (MRP, Net Quantity, Mfg Date) must be at least 2.0 mm to 6.0 mm depending on package net volume to ensure legibility.';
      } else {
        botReply = 'Under the Legal Metrology (Packaged Commodities) Rules 2011, all packaged goods must declare: 1) MRP (inclusive of all taxes), 2) Net Quantity in standard metric units, 3) Month & Year of Mfg, 4) Complete Consumer Care contact details, and 5) Country of Origin. You can register a formal grievance through our portal.';
      }

      setChatMessages((prev) => [
        ...prev,
        { sender: 'bot', text: botReply, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
      ]);
    }, 500);
  };

  // ── Render 1: Dedicated Business / Manufacturer Portal ──
  if (activePortalView === 'business_portal') {
    return (
      <div className="min-h-screen bg-slate-50 font-sans">
        <BusinessPortalView
          onBack={() => setActivePortalView('home')}
          onLaunchInspectorScan={() => onLaunchApp('scan_product')}
        />
      </div>
    );
  }

  // ── Render 2: Dedicated Consumer Grievance Form View ──
  if (activePortalView === 'grievance_form') {
    return (
      <div className="min-h-screen bg-slate-50 font-sans">
        <ConsumerGrievanceFormView
          onBack={() => setActivePortalView('home')}
          onGrievanceSubmitted={(id) => {
            setTrackedId(id);
            setActivePortalView('tracking_view');
          }}
        />
      </div>
    );
  }

  // ── Render 3: Dedicated Tracking View ──
  if (activePortalView === 'tracking_view') {
    return (
      <div className="min-h-screen bg-slate-50 font-sans py-10 px-4 sm:px-8">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setActivePortalView('home')}
              className="flex items-center gap-2 text-xs font-bold text-slate-800 hover:text-blue-700 bg-white border border-slate-200 px-4 py-2 rounded-xl shadow-xs cursor-pointer transition-colors"
            >
              <ArrowLeft size={14} />
              <span>Back to Portal Home</span>
            </button>

            <button
              onClick={() => setActivePortalView('grievance_form')}
              className="flex items-center gap-1.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-xl shadow-xs cursor-pointer transition-colors"
            >
              <FileText size={14} />
              <span>File Another Grievance</span>
            </button>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
              <div>
                <span className="font-mono text-xs font-black text-blue-700 bg-blue-50 border border-blue-200 px-2.5 py-1 rounded-md">
                  CASE NO: {trackedId}
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-2">
                  {trackedRecord.product}
                </h2>
                <p className="text-xs text-slate-600 mt-0.5">{trackedRecord.violation}</p>
              </div>

              <div className="text-left sm:text-right">
                <span className="inline-block px-3 py-1 rounded-full bg-amber-100 text-amber-900 font-bold text-xs border border-amber-300 font-mono">
                  {trackedRecord.status}
                </span>
                <p className="text-[11px] text-slate-400 font-mono mt-1">Registered: {trackedRecord.date}</p>
              </div>
            </div>

            <div className="space-y-4 pt-2">
              <h3 className="font-bold text-xs uppercase tracking-wider text-slate-800 font-mono">
                Official Redressal & Investigation Timeline:
              </h3>

              <div className="space-y-4">
                {trackedRecord.timeline.map((st: any, i: number) => (
                  <div key={i} className="flex items-start gap-4">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-white shadow-xs ${
                      st.done ? 'bg-emerald-600' : 'bg-slate-300 text-slate-600'
                    }`}>
                      {st.done ? <Check size={16} className="stroke-[3]" /> : <span className="font-bold text-xs">{i+1}</span>}
                    </div>

                    <div className="flex-1 pb-2 border-b border-slate-100">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                        <span className={`font-bold text-sm ${st.done ? 'text-slate-900' : 'text-slate-500'}`}>
                          {st.step}
                        </span>
                        <span className="text-[11px] font-mono text-slate-400">{st.date}</span>
                      </div>
                      <p className="text-xs text-slate-600 mt-1 leading-relaxed">{st.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs text-slate-600">
              <span>Investigation Officer: <strong>{trackedRecord.officer}</strong></span>
              <span className="text-blue-700 font-bold font-mono">Status: ACTIVE</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── Render 4: Full Landing Page Matching Design Reference ──
  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans antialiased selection:bg-blue-100 selection:text-blue-900">
      
      {/* ── 1. Top Modern Header (Official GovTech Deep Blue) ── */}
      <header className="bg-[#183883] text-white border-b border-blue-900 sticky top-0 z-30 shadow-md backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 h-18 flex items-center justify-between gap-4">
          
          {/* Brand Logo & Department Title */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-700/70 border border-blue-400/40 flex items-center justify-center text-white shadow-inner flex-shrink-0">
              <Scale size={20} className="stroke-[2.5]" />
            </div>
            <div>
              <div className="text-[11px] text-blue-200 font-semibold tracking-wide flex items-center gap-1.5 leading-tight">
                <span>उपभोक्ता मामले विभाग</span>
                <span className="text-blue-300">•</span>
                <span>DEPT. OF CONSUMER AFFAIRS</span>
              </div>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-lg sm:text-xl font-black text-white tracking-tight">Yatharth AI</span>
                <span className="text-xs sm:text-sm font-semibold text-blue-200">Legal Metrology</span>
                <span className="hidden sm:inline-block px-2 py-0.2 rounded-md bg-amber-400/20 text-amber-300 border border-amber-400/30 text-[10px] font-mono font-bold">
                  यथार्थ AI
                </span>
              </div>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6 text-xs font-semibold text-blue-100">
            <a href="#how-it-works" className="hover:text-white transition-colors">How it Works</a>
            <a href="#portals" className="hover:text-white transition-colors">4 Portals</a>
            <a href="#pillars" className="hover:text-white transition-colors">5 Pillars</a>
            <a href="#scanner-demo" className="hover:text-white transition-colors">Live Demo</a>
            <a href="#impact" className="hover:text-white transition-colors">National Impact</a>
          </nav>

          {/* Right Action CTAs: Officer Login & Access Console */}
          <div className="flex items-center gap-2.5 relative">
            
            {/* Officer Login / Role Selector Trigger */}
            <div className="relative">
              <button
                onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
                className="px-3 py-2 rounded-xl border border-blue-400/40 hover:border-blue-300 bg-blue-800/60 hover:bg-blue-800 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
                title="Select Stakeholder Portal"
              >
                <Lock size={13} className="text-blue-200" />
                <span className="hidden sm:inline">Officer Login</span>
                <ChevronDown size={13} className="text-blue-300" />
              </button>

              {/* 4-Role Dropdown Popover */}
              {roleDropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-white border border-slate-200 shadow-2xl p-2 z-50 animate-in fade-in slide-in-from-top-2 text-slate-900">
                  <div className="px-3 py-1.5 border-b border-slate-100 text-[10px] font-mono font-bold uppercase text-slate-400 tracking-wider">
                    Select Stakeholder Role:
                  </div>
                  
                  <button
                    onClick={() => handleSelectRolePortal('inspector')}
                    className="w-full text-left p-2.5 rounded-xl hover:bg-blue-50 text-xs font-bold text-slate-800 flex items-center gap-2.5 transition-colors cursor-pointer"
                  >
                    <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center">
                      <Scan size={14} />
                    </div>
                    <div>
                      <div className="text-slate-900 font-black">Inspector</div>
                      <div className="text-[10px] text-slate-500 font-normal">Field Enforcement Officer</div>
                    </div>
                  </button>

                  <button
                    onClick={() => handleSelectRolePortal('business')}
                    className="w-full text-left p-2.5 rounded-xl hover:bg-amber-50 text-xs font-bold text-slate-800 flex items-center gap-2.5 transition-colors cursor-pointer"
                  >
                    <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center">
                      <Building2 size={14} />
                    </div>
                    <div>
                      <div className="text-slate-900 font-black">Business</div>
                      <div className="text-[10px] text-slate-500 font-normal">Manufacturer & Packer</div>
                    </div>
                  </button>

                  <button
                    onClick={() => handleSelectRolePortal('consumer')}
                    className="w-full text-left p-2.5 rounded-xl hover:bg-emerald-50 text-xs font-bold text-slate-800 flex items-center gap-2.5 transition-colors cursor-pointer"
                  >
                    <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center">
                      <User size={14} />
                    </div>
                    <div>
                      <div className="text-slate-900 font-black">Consumer</div>
                      <div className="text-[10px] text-slate-500 font-normal">Citizen Grievance Redressal</div>
                    </div>
                  </button>

                  <button
                    onClick={() => handleSelectRolePortal('controller')}
                    className="w-full text-left p-2.5 rounded-xl hover:bg-indigo-50 text-xs font-bold text-slate-800 flex items-center gap-2.5 transition-colors cursor-pointer"
                  >
                    <div className="w-7 h-7 rounded-lg bg-indigo-100 text-indigo-800 flex items-center justify-center">
                      <Briefcase size={14} />
                    </div>
                    <div>
                      <div className="text-slate-900 font-black">Controller</div>
                      <div className="text-[10px] text-slate-500 font-normal">State Legal Metrology Director</div>
                    </div>
                  </button>
                </div>
              )}
            </div>

            {/* Access Console / Launch Workspace Primary Pill Button */}
            <button
              onClick={() => handleSelectRolePortal('inspector')}
              className="px-5 py-2 rounded-full bg-white hover:bg-blue-50 text-[#183883] text-xs font-black flex items-center gap-1.5 transition-all shadow-md active:scale-95 cursor-pointer"
            >
              <span>Access Console</span>
              <ArrowRight size={14} />
            </button>
          </div>

        </div>
      </header>

      {/* ── 2. Hero Section: Official Reference Layout with 3D Ashoka Lion Capital ── */}
      <section className="pt-10 pb-16 px-4 sm:px-8 bg-gradient-to-b from-slate-50 via-white to-slate-50/60 border-b border-slate-200/80 relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* Left Content Column */}
            <div className="lg:col-span-7 space-y-5 text-left">
              
              {/* Ministry & Govt of India Bar */}
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-xs sm:text-sm font-bold text-slate-800">
                  <span className="w-6 h-0.75 bg-amber-500 rounded-full inline-block"></span>
                  <span className="font-semibold text-slate-900">भारत सरकार</span>
                  <span className="text-slate-400">•</span>
                  <span className="font-extrabold text-slate-900 tracking-wider">GOVERNMENT OF INDIA</span>
                </div>
                <p className="text-[11px] sm:text-xs text-slate-500 font-bold tracking-wider uppercase pl-8">
                  MINISTRY OF CONSUMER AFFAIRS, FOOD & PUBLIC DISTRIBUTION
                </p>
              </div>

              {/* SIH Hackathon Problem Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-slate-100/90 border border-slate-200/90 text-[11px] font-mono font-bold text-slate-700 shadow-2xs">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>SIH 2026 Problem ID SIH26034</span>
              </div>

              {/* Hero Title */}
              <h1 className="text-3xl sm:text-5xl lg:text-[52px] font-black text-slate-950 tracking-tight leading-[1.12]">
                Statutory Packaging Intelligence & Enforcement Cloud
              </h1>

              {/* Blue Colored Line with Yatharth AI Legal Terminology */}
              <div className="rounded-xl bg-blue-50/90 border border-blue-200/90 p-3 sm:p-3.5 shadow-2xs">
                <div className="flex items-center gap-2.5 text-blue-900 text-xs sm:text-sm">
                  <span className="flex h-2.5 w-2.5 relative shrink-0">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-blue-600"></span>
                  </span>
                  <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 font-semibold">
                    <span className="font-extrabold text-blue-950">Legal Metrology Act, 2009</span>
                    <span className="text-blue-300">|</span>
                    <span className="text-blue-800">PCR 2011 Rules 6, 7 & 18</span>
                    <span className="text-blue-300">|</span>
                    <span className="text-blue-800">Sub-mm Font Caliper</span>
                    <span className="text-blue-300">|</span>
                    <span className="text-blue-800">Sec 36 Penalty Compounding</span>
                  </div>
                </div>
              </div>

              {/* Description Paragraph */}
              <p className="text-sm sm:text-base text-slate-700 font-medium leading-relaxed max-w-xl">
                Yatharth AI scans packaged commodity labels and checks them against the <strong>Legal Metrology (Packaged Commodities) Rules, 2011</strong> deterministically with sub-millimeter precision. Every statutory declaration verified in seconds across retail stores and e-commerce platforms.
              </p>

              {/* Replaced Action Buttons for Yatharth AI */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  onClick={() => handleSelectRolePortal('inspector')}
                  className="px-6 py-3.5 rounded-xl bg-slate-950 hover:bg-slate-900 text-white text-xs sm:text-sm font-black flex items-center gap-2 transition-all shadow-md hover:shadow-lg active:scale-95 cursor-pointer"
                >
                  <Scan size={16} />
                  <span>Start Inspection Scan</span>
                </button>

                <button
                  onClick={() => setActivePortalView('business_portal')}
                  className="px-5 py-3.5 rounded-xl bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 text-xs sm:text-sm font-bold flex items-center gap-2 transition-all shadow-2xs hover:shadow-sm active:scale-95 cursor-pointer"
                >
                  <Building2 size={16} className="text-slate-600" />
                  <span>Pre-Audit Packaging</span>
                </button>

                <button
                  onClick={() => setActivePortalView('grievance_form')}
                  className="px-4 py-3.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-800 border border-blue-200/80 text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer"
                >
                  <FileText size={15} className="text-blue-600" />
                  <span>Citizen Grievance</span>
                </button>
              </div>

            </div>

            {/* Right Column: 3D Ashoka Lion Capital (Emblem of India) */}
            <div className="lg:col-span-5 flex items-center justify-center relative">
              {/* Soft atmospheric ambient glow */}
              <div className="absolute inset-0 bg-radial from-blue-100/60 via-slate-100/30 to-transparent blur-3xl rounded-full scale-95 pointer-events-none" />
              
              <div className="relative z-10 p-2 flex flex-col items-center">
                <img
                  src={ashokaEmblem}
                  alt="State Emblem of India - Satyamev Jayate"
                  className="w-full max-w-[320px] sm:max-w-[380px] lg:max-w-[430px] h-auto object-contain drop-shadow-2xl transition-transform duration-500 hover:scale-[1.02] select-none"
                />
                <div className="mt-2 text-center">
                  <span className="text-[11px] font-mono font-bold text-slate-400 uppercase tracking-widest">
                    सत्यमेव जयते • TRUTH ALONE TRIUMPHS
                  </span>
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ── 3. Four Stakeholder Role Portals ── */}
      <section id="portals" className="py-14 px-4 sm:px-8 bg-white border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto space-y-8">
          
          <div className="text-center space-y-2 max-w-3xl mx-auto">
            <span className="px-3.5 py-1 rounded-full bg-blue-100/90 text-blue-900 text-xs font-mono font-bold uppercase tracking-wider border border-blue-300/80 shadow-2xs">
              FOUR DEDICATED STAKEHOLDER PORTALS
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-slate-950 tracking-tight">
              Select Your Operational Workspace
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 font-medium">
              Zero-friction role access configured specifically for enforcement officers, FMCG packers, consumers, and state directors.
            </p>
          </div>

          {/* 4 Role Cards (Pristine Light GovTech UI with Enhanced Readability & Bold Highlights) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-2">
            
            {/* Card 1: Inspector */}
            <div 
              onClick={() => handleSelectRolePortal('inspector')}
              className="bg-white rounded-2xl p-6 border border-slate-200/90 hover:border-blue-500 hover:shadow-md transition-all duration-200 flex flex-col justify-between group cursor-pointer shadow-2xs"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center group-hover:scale-105 transition-transform">
                    <Scan size={24} className="stroke-[2.5]" />
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 text-[10px] font-mono font-bold">
                    FIELD SCANNER
                  </span>
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-900 group-hover:text-blue-700 transition-colors">
                    Inspector
                  </h3>
                  <p className="text-xs text-slate-500 font-semibold mt-0.5">Field Enforcement Officer</p>
                </div>
                <p className="text-sm text-slate-700 leading-relaxed font-normal">
                  <strong>On-site retail inspection</strong>, <strong>GPS geofencing</strong>, <strong>sub-mm font caliper measurement</strong>, assess <strong>editable compounding fines</strong>, and issue statutory <strong>Form LM-IR-2026</strong> seizure notices.
                </p>
              </div>
              <div className="pt-6">
                <span className="inline-flex items-center gap-1 text-xs font-bold text-blue-700 group-hover:underline">
                  <span>Launch Workspace</span>
                  <ArrowRight size={13} />
                </span>
              </div>
            </div>

            {/* Card 2: Business */}
            <div 
              onClick={() => handleSelectRolePortal('business')}
              className="bg-white rounded-2xl p-6 border border-slate-200/90 hover:border-amber-500 hover:shadow-md transition-all duration-200 flex flex-col justify-between group cursor-pointer shadow-2xs"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center group-hover:scale-105 transition-transform">
                    <Building2 size={24} className="stroke-[2.5]" />
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-mono font-bold">
                    PRE-MARKET
                  </span>
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-900 group-hover:text-amber-700 transition-colors">
                    Business
                  </h3>
                  <p className="text-xs text-slate-500 font-semibold mt-0.5">Manufacturer & Packer</p>
                </div>
                <p className="text-sm text-slate-700 leading-relaxed font-normal">
                  <strong>Pre-audit packaging artwork</strong> prior to mass printing, verify <strong>mandatory 7 declarations</strong>, calculate <strong>Rule 6(11) Unit Sale Price</strong>, and ensure <strong>Rule 7 font height (mm)</strong> compliance.
                </p>
              </div>
              <div className="pt-6">
                <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-800 group-hover:underline">
                  <span>Enter as Business</span>
                  <ArrowRight size={13} />
                </span>
              </div>
            </div>

            {/* Card 3: Consumer */}
            <div 
              onClick={() => handleSelectRolePortal('consumer')}
              className="bg-white rounded-2xl p-6 border border-slate-200/90 hover:border-emerald-500 hover:shadow-md transition-all duration-200 flex flex-col justify-between group cursor-pointer shadow-2xs"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center group-hover:scale-105 transition-transform">
                    <User size={24} className="stroke-[2.5]" />
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-mono font-bold">
                    CITIZEN RIGHTS
                  </span>
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-900 group-hover:text-emerald-700 transition-colors">
                    Consumer
                  </h3>
                  <p className="text-xs text-slate-500 font-semibold mt-0.5">Citizen Grievance Redressal</p>
                </div>
                <p className="text-sm text-slate-700 leading-relaxed font-normal">
                  Instant citizen protection against <strong>MRP overcharging</strong>, illegal <strong>cooling charges</strong>, <strong>dual pricing</strong>, or smudged expiry dates. <strong>File formal complaints</strong> and <strong>track real-time resolution</strong>.
                </p>
              </div>
              <div className="pt-6">
                <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-800 group-hover:underline">
                  <span>Enter as Consumer</span>
                  <ArrowRight size={13} />
                </span>
              </div>
            </div>

            {/* Card 4: Controller */}
            <div 
              onClick={() => handleSelectRolePortal('controller')}
              className="bg-white rounded-2xl p-6 border border-slate-200/90 hover:border-indigo-500 hover:shadow-md transition-all duration-200 flex flex-col justify-between group cursor-pointer shadow-2xs"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center group-hover:scale-105 transition-transform">
                    <Briefcase size={24} className="stroke-[2.5]" />
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-800 text-[10px] font-mono font-bold">
                    COMMAND
                  </span>
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-900 group-hover:text-indigo-700 transition-colors">
                    Controller
                  </h3>
                  <p className="text-xs text-slate-500 font-semibold mt-0.5">State Legal Metrology Director</p>
                </div>
                <p className="text-sm text-slate-700 leading-relaxed font-normal">
                  <strong>State-wide surveillance command</strong> with <strong>real-time compliance heatmaps</strong>, <strong>reverse supply chain trace</strong> back to wholesale depots, and instant <strong>stop-sale orders</strong>.
                </p>
              </div>
              <div className="pt-6">
                <span className="inline-flex items-center gap-1 text-xs font-bold text-indigo-800 group-hover:underline">
                  <span>Enter as Controller</span>
                  <ArrowRight size={13} />
                </span>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ── 3. Section: Core Foundation (Matches Screenshot 5: media_1789715810216.png) ── */}
      <section id="pillars" className="py-20 px-4 sm:px-8 bg-white border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto space-y-12">
          
          <div className="text-center space-y-3 max-w-3xl mx-auto">
            <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-mono font-bold uppercase tracking-wider">
              CORE FOUNDATION
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-950 tracking-tight">
              Why Yatarth AI Stands Out
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              Built specifically to address the statutory enforcement challenges of India's Legal Metrology departments.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
            
            {/* 1. Objective & Defensible */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:border-slate-300 hover:shadow-md transition-all flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                  <ShieldCheck size={20} />
                </div>
                <h3 className="font-bold text-base text-slate-900 leading-snug">Objective & Defensible</h3>
                <p className="text-sm text-slate-700 leading-relaxed font-normal">
                  Packaged commodities enforced strictly under <strong>Legal Metrology Rules, 2011</strong>. Eliminates <strong>inspector subjectivity</strong> and <strong>visual bias</strong> in judicial scrutiny.
                </p>
              </div>
              <span className="text-[11px] font-mono font-bold text-emerald-700 pt-3 border-t border-slate-100 block">
                Legally Verifiable
              </span>
            </div>

            {/* 2. Real Measurement */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:border-slate-300 hover:shadow-md transition-all flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-700 flex items-center justify-center">
                  <Ruler size={20} />
                </div>
                <h3 className="font-bold text-base text-slate-900 leading-snug">Real Measurement</h3>
                <p className="text-sm text-slate-700 leading-relaxed font-normal">
                  Character height in mm measured with <strong>calibrated reference geometry</strong> and <strong>optical distance compensation</strong>. Sub-millimeter proof for <strong>Rule 7 Table I</strong>.
                </p>
              </div>
              <span className="text-[11px] font-mono font-bold text-sky-700 pt-3 border-t border-slate-100 block">
                Calibrated Accuracy
              </span>
            </div>

            {/* 3. Complete Visibility */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:border-slate-300 hover:shadow-md transition-all flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
                  <Network size={20} />
                </div>
                <h3 className="font-bold text-base text-slate-900 leading-snug">Complete Visibility</h3>
                <p className="text-sm text-slate-700 leading-relaxed font-normal">
                  Full custody trail across <strong>Retail Shelf → Wholesaler → Distributor → Manufacturing Plant → Raw Material Suppliers</strong>.
                </p>
              </div>
              <span className="text-[11px] font-mono font-bold text-blue-700 pt-3 border-t border-slate-100 block">
                5-Stage Lineage
              </span>
            </div>

            {/* 4. Reverse Supply Mapping */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:border-slate-300 hover:shadow-md transition-all flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center">
                  <Store size={20} />
                </div>
                <h3 className="font-bold text-base text-slate-900 leading-snug">Reverse Supply Mapping</h3>
                <p className="text-sm text-slate-700 leading-relaxed font-normal">
                  Detect a non-compliant batch in one supermarket and instantly identify <strong>every other retail outlet</strong> that received the <strong>same defective lot</strong>.
                </p>
              </div>
              <span className="text-[11px] font-mono font-bold text-purple-700 pt-3 border-t border-slate-100 block">
                Multi-Store Recall
              </span>
            </div>

            {/* 5. Smart Escalation */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:border-slate-300 hover:shadow-md transition-all flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-700 flex items-center justify-center">
                  <Bell size={20} />
                </div>
                <h3 className="font-bold text-base text-slate-900 leading-snug">Smart Escalation</h3>
                <p className="text-sm text-slate-700 leading-relaxed font-normal">
                  Auto-routes <strong>high-severity violations</strong> to the <strong>Controller of Legal Metrology</strong> with pre-drafted <strong>statutory seizure summonses</strong>.
                </p>
              </div>
              <span className="text-[11px] font-mono font-bold text-rose-700 pt-3 border-t border-slate-100 block">
                Automated Seizure
              </span>
            </div>

          </div>

        </div>
      </section>

      {/* ── 4. Section: Live Scanner & Verification Preview (Matches Screenshot 4: media_1789715810211.png) ── */}
      <section id="scanner-demo" className="py-20 px-4 sm:px-8 bg-slate-50 border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto space-y-8">
          
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight">
                Live Scanner & Verification Preview
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-1">
                Experience how Yatarth AI processes packaging declarations in real-time during a store audit.
              </p>
            </div>

            {/* Test Case Switcher Pills */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveTestCase('lays')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeTestCase === 'lays'
                    ? 'bg-rose-600 text-white shadow-xs font-black'
                    : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                Test Case 1: Lay's Chips (Expired Batch)
              </button>

              <button
                onClick={() => setActiveTestCase('cookies')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeTestCase === 'cookies'
                    ? 'bg-blue-600 text-white shadow-xs font-black'
                    : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                Test Case 2: Almond Cookies (Label Audit)
              </button>
            </div>
          </div>

          {/* The Live Scanner Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              
              {/* Left Column: Calibrated Camera Viewfinder */}
              <div className="lg:col-span-5 space-y-3">
                <div className="relative rounded-2xl bg-[#070d1e] text-white p-4 border border-slate-800 shadow-inner font-mono text-xs space-y-3">
                  
                  {/* Camera Header Bar */}
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2 text-[10px]">
                    <div className="flex items-center gap-1.5 text-cyan-400 font-bold">
                      <Scan size={13} />
                      <span>CAMERA_FEED: REAR_48MP_CALIBRATED</span>
                    </div>
                    <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/30">
                      FRAME_LOCKED
                    </span>
                  </div>

                  {/* Target and Grid info */}
                  <div className="flex justify-between items-center text-[11px] text-slate-400">
                    <span className="text-white font-bold">
                      Target: {activeTestCase === 'lays' ? "Lay's Classic Salted" : 'Artisan Almond Cookies'}
                    </span>
                    <span className="text-slate-500">Grid: 1.0mm/div</span>
                  </div>

                  {/* Bounding Box 1: MRP */}
                  <div className="p-3 rounded-xl border border-emerald-500/70 bg-emerald-950/20 space-y-1">
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="text-emerald-400 font-bold">BOX_01: MANDATORY MRP</span>
                      <span className="text-emerald-400 font-bold">100% CONF</span>
                    </div>
                    <p className="text-white font-black text-xs">
                      {activeTestCase === 'lays' ? 'MRP ₹20.00 (Incl. of all taxes)' : 'MRP ₹185.00 (Incl. of all taxes)'}
                    </p>
                    <p className="text-[10px] text-emerald-400 font-medium">✓ Valid statutory inclusive formulation</p>
                  </div>

                  {/* Bounding Box 2: Dates / Batch */}
                  <div className={`p-3 rounded-xl border space-y-1 ${
                    activeTestCase === 'lays'
                      ? 'border-rose-500/70 bg-rose-950/20'
                      : 'border-emerald-500/70 bg-emerald-950/20'
                  }`}>
                    <div className="flex items-center justify-between text-[10px]">
                      <span className={activeTestCase === 'lays' ? 'text-rose-400 font-bold' : 'text-emerald-400 font-bold'}>
                        BOX_02: DATES & BATCH
                      </span>
                      <span className={`font-bold px-1 rounded text-[9px] ${
                        activeTestCase === 'lays' ? 'bg-rose-500 text-white' : 'bg-emerald-500 text-white'
                      }`}>
                        {activeTestCase === 'lays' ? 'VIOLATION_FLAG' : 'VERIFIED'}
                      </span>
                    </div>
                    <p className="text-white font-black text-xs">
                      {activeTestCase === 'lays' ? 'Mfg: 10/06/2025 | Use By: 10/12/2025' : 'Mfg: 09/2026 | Best Before: 03/2027'}
                    </p>
                    <p className={`text-[10px] font-medium ${
                      activeTestCase === 'lays' ? 'text-rose-400' : 'text-emerald-400'
                    }`}>
                      {activeTestCase === 'lays' ? '⚠️ EXPIRED: 280+ days past expiry on shelf' : '✓ Fresh batch within statutory shelf life'}
                    </p>
                  </div>

                  {/* Optical Font Caliper Measurement */}
                  <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between text-[11px]">
                    <span className="text-slate-300">
                      Helpline Text Height: <strong className={activeTestCase === 'lays' ? 'text-amber-400' : 'text-emerald-400'}>{activeTestCase === 'lays' ? '1.8 mm' : '2.2 mm'}</strong>
                    </span>
                    <span className="text-slate-400">Min Required: 2.0 mm</span>
                  </div>

                </div>

                <button
                  onClick={() => onLaunchApp('scan_product')}
                  className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black text-xs flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
                >
                  <span>Inspect Full Regulatory Finding</span>
                  <ArrowRight size={14} />
                </button>
              </div>

              {/* Right Column: Regulatory Audit Summary */}
              <div className="lg:col-span-7 space-y-4">
                
                <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-3">
                  <div>
                    <h3 className="text-xl font-black text-slate-900">
                      {activeTestCase === 'lays' ? "Lay's Classic Salted Chips (50g)" : 'Premium Almond Cookies (250g)'}
                    </h3>
                    <p className="text-xs font-mono text-slate-500 mt-0.5">
                      Batch ID: <strong className="text-blue-700">{activeTestCase === 'lays' ? 'LAY-EXP-2025-09' : 'AH-BATCH-2026-04'}</strong> • Barcode: {activeTestCase === 'lays' ? '8901491101824' : '8904018293710'}
                    </p>
                  </div>

                  <div className="text-right">
                    <span className={`text-2xl font-black font-mono block ${
                      activeTestCase === 'lays' ? 'text-rose-600' : 'text-emerald-600'
                    }`}>
                      {activeTestCase === 'lays' ? '42/100' : '94/100'}
                    </span>
                    <span className="text-[10px] font-mono font-bold uppercase text-slate-400">
                      COMPLIANCE SCORE
                    </span>
                  </div>
                </div>

                {/* 4 Checklist Items (Matches Design) */}
                <div className="space-y-2.5">
                  
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between gap-3">
                    <div className="flex items-start gap-2.5">
                      <CheckCircle2 size={16} className="text-emerald-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-xs font-bold text-slate-900">Net Quantity Metric Formulation</p>
                        <p className="text-[11px] text-slate-500">Standard gram (g) representation with correct typeface positioning.</p>
                      </div>
                    </div>
                    <span className="px-2.5 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-mono font-black">
                      PASS
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between gap-3">
                    <div className="flex items-start gap-2.5">
                      <CheckCircle2 size={16} className="text-emerald-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-xs font-bold text-slate-900">Maximum Retail Price (MRP) Statutory Declaration</p>
                        <p className="text-[11px] text-slate-500">Includes mandatory 'inclusive of all taxes' string under Rule 6(1)(e).</p>
                      </div>
                    </div>
                    <span className="px-2.5 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-mono font-black">
                      PASS
                    </span>
                  </div>

                  <div className={`p-3 rounded-xl border flex items-center justify-between gap-3 ${
                    activeTestCase === 'lays'
                      ? 'bg-rose-50/50 border-rose-200'
                      : 'bg-slate-50 border-slate-200/80'
                  }`}>
                    <div className="flex items-start gap-2.5">
                      {activeTestCase === 'lays' ? (
                        <AlertTriangle size={16} className="text-rose-600 mt-0.5 flex-shrink-0" />
                      ) : (
                        <CheckCircle2 size={16} className="text-emerald-600 mt-0.5 flex-shrink-0" />
                      )}
                      <div>
                        <p className="text-xs font-bold text-slate-900">
                          {activeTestCase === 'lays' ? 'Expiry Date & Consumer Protection Violation' : 'Month & Year of Manufacture Formulation'}
                        </p>
                        <p className="text-[11px] text-slate-500">
                          {activeTestCase === 'lays'
                            ? 'Offering expired packaged goods for sale mandates immediate seizure under Legal Metrology Act & FSSAI.'
                            : 'Standard MM/YYYY declaration verified compliant with Rule 6(1)(d).'}
                        </p>
                      </div>
                    </div>
                    <span className={`px-2.5 py-0.5 rounded text-[10px] font-mono font-black ${
                      activeTestCase === 'lays'
                        ? 'bg-rose-100 text-rose-800 border border-rose-200'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}>
                      {activeTestCase === 'lays' ? 'SEIZURE ORDER' : 'PASS'}
                    </span>
                  </div>

                  <div className={`p-3 rounded-xl border flex items-center justify-between gap-3 ${
                    activeTestCase === 'lays'
                      ? 'bg-amber-50/50 border-amber-200'
                      : 'bg-slate-50 border-slate-200/80'
                  }`}>
                    <div className="flex items-start gap-2.5">
                      {activeTestCase === 'lays' ? (
                        <AlertTriangle size={16} className="text-amber-600 mt-0.5 flex-shrink-0" />
                      ) : (
                        <CheckCircle2 size={16} className="text-emerald-600 mt-0.5 flex-shrink-0" />
                      )}
                      <div>
                        <p className="text-xs font-bold text-slate-900">
                          {activeTestCase === 'lays' ? 'Helpline Character Height Non-Compliance' : 'Rule 7 Minimum Character Height Compliance'}
                        </p>
                        <p className="text-[11px] text-slate-500">
                          {activeTestCase === 'lays'
                            ? 'Measured optical height is 1.8 mm, which fails the mandatory 2.0 mm minimum standard under Rule 7 Table I.'
                            : 'Measured glyph height 2.2 mm satisfies the mandatory 2.0 mm minimum threshold.'}
                        </p>
                      </div>
                    </div>
                    <span className={`px-2.5 py-0.5 rounded text-[10px] font-mono font-black ${
                      activeTestCase === 'lays'
                        ? 'bg-amber-100 text-amber-900 border border-amber-200'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}>
                      {activeTestCase === 'lays' ? 'REVISE DIES' : 'PASS'}
                    </span>
                  </div>

                </div>

                {/* Bottom Detection Site & Backtrack Link */}
                <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-1.5 text-slate-500">
                    <MapPin size={13} className="text-blue-600" />
                    <span>Detection Site: <strong>Star Bazaar Hypermarket, Bengaluru East</strong></span>
                  </div>

                  <button
                    onClick={() => onLaunchApp('backtrack')}
                    className="text-xs font-bold text-blue-700 hover:text-blue-900 flex items-center gap-1 cursor-pointer"
                  >
                    <span>Backtrack this Batch Upstream</span>
                    <ArrowRight size={13} />
                  </button>
                </div>

              </div>

            </div>

            {/* Prototype synthetic data disclaimer */}
            <div className="pt-3 border-t border-slate-100 text-center">
              <p className="text-xs text-slate-400 font-medium">
                * Used synthetic data for prototype demonstration
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* ── 5. Section: End-to-End Enforcement Flow (Matches Screenshot 3: media_1789715810206.png) ── */}
      <section id="workflow" className="py-20 px-4 sm:px-8 bg-white border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto space-y-10">
          
          <div className="text-center space-y-3 max-w-3xl mx-auto">
            <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-mono font-bold uppercase tracking-wider">
              ENFORCEMENT WORKFLOW
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-950 tracking-tight">
              End-to-End Enforcement Flow
            </h2>
            <p className="text-sm text-slate-700 font-medium">
              Department of Consumer Affairs (DoCA) Architecture: From single product detection on the shelf to state-wide containment.
            </p>
          </div>

          {/* 6 Stage Tabs Horizontally (Matches Reference) */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {[
              { step: 1, code: '01', title: 'Product Scan', desc: 'Barcode & Label Scan', icon: QrCode },
              { step: 2, code: '02', title: 'Batch / Lot', desc: 'Trace Lot Details', icon: FileText },
              { step: 3, code: '03', title: 'Supplier Trace', desc: 'Identify Manufacturer', icon: Building2 },
              { step: 4, code: '04', title: 'Reverse Stores', desc: 'Reverse Supply Mapping', icon: Store },
              { step: 5, code: '05', title: 'Regional Area', desc: 'Area-Wise Containment', icon: MapPin },
              { step: 6, code: '06', title: 'Smart Alert', desc: 'Senior Officer Escalation', icon: Bell }
            ].map((st) => {
              const Icon = st.icon;
              const isActive = activeWorkflowStep === st.step;
              return (
                <button
                  key={st.step}
                  onClick={() => setActiveWorkflowStep(st.step)}
                  className={`p-4 rounded-2xl text-left border transition-all cursor-pointer flex flex-col justify-between ${
                    isActive
                      ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                      : 'bg-white border-slate-200 hover:border-slate-300 text-slate-800'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <Icon size={18} className={isActive ? 'text-white' : 'text-slate-600'} />
                    <span className={`text-[10px] font-mono font-bold ${isActive ? 'text-blue-200' : 'text-slate-400'}`}>
                      {st.code}
                    </span>
                  </div>
                  <div>
                    <h4 className="text-xs font-black leading-tight">{st.title}</h4>
                    <p className={`text-[11px] mt-0.5 leading-snug ${isActive ? 'text-blue-100' : 'text-slate-500'}`}>
                      {st.desc}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Detailed Split Card for the Selected Workflow Step */}
          <div className="p-6 sm:p-8 rounded-3xl bg-slate-50 border border-slate-200">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              
              {/* Left Column: Stage Explanation */}
              <div className="lg:col-span-6 space-y-4">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-md bg-blue-100 text-blue-800 font-mono text-xs font-bold">
                    Step {activeWorkflowStep}: Containment
                  </span>
                  <span className="text-xs font-mono text-slate-500">
                    Stage 0{activeWorkflowStep} of 06
                  </span>
                </div>

                <h3 className="text-2xl font-black text-slate-950">
                  {activeWorkflowStep === 4 && 'Reverse Supply Mapping Across Outlets'}
                  {activeWorkflowStep === 1 && 'Edge Optical Capture & Barcode Parsing'}
                  {activeWorkflowStep === 2 && 'Lot Manifest Extraction & Batch Verification'}
                  {activeWorkflowStep === 3 && 'Wholesale CFA & Manufacturer Identification'}
                  {activeWorkflowStep === 5 && 'Regional Geofenced Containment & Freeze'}
                  {activeWorkflowStep === 6 && 'Automated Legal Seizure Notice Generation'}
                </h3>

                <p className="text-sm text-slate-700 leading-relaxed font-normal">
                  {activeWorkflowStep === 4 &&
                    'Traces wholesale dispatch manifests to pinpoint all physical supermarkets and hypermarkets that took delivery of inventory from the defective lot.'}
                  {activeWorkflowStep === 1 &&
                    'Field officer camera scans front and back product panels, extracting barcode, OCR text, and GPS geofence with sub-second latency.'}
                  {activeWorkflowStep === 2 &&
                    'Cross-references scanned batch code against statutory registration database to check date of packaging and approved unit size.'}
                  {activeWorkflowStep === 3 &&
                    'Identifies parent manufacturer, licensed packaging plant, and regional Clearing & Forwarding Agent (CFA) responsible for distribution.'}
                  {activeWorkflowStep === 5 &&
                    'Establishes a digital perimeter over affected sales territory to prevent inter-state consignment movement.'}
                  {activeWorkflowStep === 6 &&
                    'Generates Form LM-IR-2026 compounding notice with full legal citations under Sections 36 & 39 of The Legal Metrology Act, 2009.'}
                </p>

                <button
                  onClick={() => onLaunchApp('backtrack')}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-700 hover:text-blue-900 cursor-pointer pt-2"
                >
                  <span>Inspect this step in Backtrack Engine</span>
                  <ArrowRight size={13} />
                </button>
              </div>

              {/* Right Column: Dark Terminal Output Snapshot (Matches Design) */}
              <div className="lg:col-span-6 rounded-2xl bg-[#0b1329] text-white p-6 font-mono text-xs space-y-4 border border-slate-800 shadow-lg">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span className="text-[11px] font-bold text-slate-300">LIVE_OUTPUT_SNAPSHOT</span>
                  </div>
                  <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
                    VERIFIED_AUTHENTIC
                  </span>
                </div>

                <div className="space-y-2 text-[11px]">
                  <div className="flex justify-between border-b border-slate-800/60 pb-1.5">
                    <span className="text-slate-400">STORESMAPPED:</span>
                    <span className="text-emerald-400 font-bold">4 Supermarkets & Hypermarkets</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-800/60 pb-1.5">
                    <span className="text-slate-400">TOTALSUPPLIED:</span>
                    <span className="text-white font-bold">510 Units in Retail Distribution</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-800/60 pb-1.5">
                    <span className="text-slate-400">CURRENTRISK:</span>
                    <span className="text-rose-400 font-bold">153 Units on Active Retail Shelves</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-800/60 pb-1.5">
                    <span className="text-slate-400">ENFORCEMENT:</span>
                    <span className="text-amber-300 font-bold">One-Click Instant Multi-Store Quarantine Ordered</span>
                  </div>
                  <div className="pt-1 text-slate-300">
                    <span className="text-slate-500 block text-[10px]">STORESLIST:</span>
                    <span className="text-slate-300 text-[10px]">
                      Star Bazaar (38 units), D-Mart (52 units), Nature's Basket (19 units), Spencer's (44 units)
                    </span>
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* ── 6. Section: Directorate Solutions (Matches Screenshot 2: media_1789715810197.png) ── */}
      <section id="capabilities" className="py-20 px-4 sm:px-8 bg-slate-50 border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto space-y-12">
          
          <div className="text-center space-y-3 max-w-3xl mx-auto">
            <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-mono font-bold uppercase tracking-wider">
              DIRECTORATE SOLUTIONS
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-950 tracking-tight">
              Complete Digital Suite for Enforcement
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              Equipping field officers, laboratory analysts, and state controllers with purpose-built tools.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* Card 1 */}
            <div className="p-7 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:border-slate-300 hover:shadow-md transition-all space-y-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <Scan size={20} />
              </div>
              <h3 className="font-bold text-base text-slate-900">AI OCR & Declaration Validator</h3>
              <p className="text-sm text-slate-700 leading-relaxed font-normal">
                Multi-angle camera scanning parses <strong>Net Quantity</strong>, <strong>MRP</strong>, <strong>Date of Mfg/Packing</strong>, <strong>Expiry</strong>, <strong>Consumer Care details</strong>, and <strong>Country of Origin</strong> with sub-second validation.
              </p>
            </div>

            {/* Card 2 */}
            <div className="p-7 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:border-slate-300 hover:shadow-md transition-all space-y-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-50 text-cyan-700 flex items-center justify-center">
                <Ruler size={20} />
              </div>
              <h3 className="font-bold text-base text-slate-900">Calibrated Millimeter Typography</h3>
              <p className="text-sm text-slate-700 leading-relaxed font-normal">
                Computer vision models measure the actual <strong>physical millimeter height</strong> of mandatory letters, enforcing <strong>Rule 7 Table I</strong> standards with zero calipers needed.
              </p>
            </div>

            {/* Card 3 */}
            <div className="p-7 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:border-slate-300 hover:shadow-md transition-all space-y-3">
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center">
                <Network size={20} />
              </div>
              <h3 className="font-bold text-base text-slate-900">Reverse Supply Chain Backtracker</h3>
              <p className="text-sm text-slate-700 leading-relaxed font-normal">
                Trace defective or expired lots from the <strong>retail supermarket shelf</strong> back to <strong>wholesale depots</strong>, transport invoices, and <strong>manufacturer production lines</strong>.
              </p>
            </div>

            {/* Card 4 */}
            <div className="p-7 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:border-slate-300 hover:shadow-md transition-all space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
                <Radio size={20} />
              </div>
              <h3 className="font-bold text-base text-slate-900">Zonal Containment Radar</h3>
              <p className="text-sm text-slate-700 leading-relaxed font-normal">
                Broadcasting <strong>emergency alerts</strong> to all field enforcement inspectors in the circle, containing <strong>hazardous or expired product spread</strong> within hours.
              </p>
            </div>

            {/* Card 5 */}
            <div className="p-7 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:border-slate-300 hover:shadow-md transition-all space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                <FileText size={20} />
              </div>
              <h3 className="font-bold text-base text-slate-900">Tamper-Proof Evidence Dossier</h3>
              <p className="text-sm text-slate-700 leading-relaxed font-normal">
                Every inspection automatically produces <strong>court-ready PDF dossiers</strong> with <strong>SHA-256 digital hashes</strong>, <strong>GPS geofence coordinates</strong>, and inspector credentials.
              </p>
            </div>

            {/* Card 6 */}
            <div className="p-7 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:border-slate-300 hover:shadow-md transition-all space-y-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center">
                <Sparkles size={20} />
              </div>
              <h3 className="font-bold text-base text-slate-900">Yatarth AI Statutory Copilot</h3>
              <p className="text-sm text-slate-700 leading-relaxed font-normal">
                An intelligent legal metrology assistant answering <strong>statutory questions</strong>, citing specific <strong>penalty sections</strong>, and drafting <strong>summons notices</strong> on demand.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* ── 7. Section: Scalable GovTech Impact (Matches Screenshot 1: media_1789715810190.png) ── */}
      <section id="impact" className="py-20 px-4 sm:px-8 bg-white border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto space-y-12">
          
          <div className="text-center space-y-3 max-w-3xl mx-auto">
            <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-mono font-bold uppercase tracking-wider">
              DEMONSTRATED IMPACT
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-950 tracking-tight">
              Scalable GovTech Impact
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              Empowering field enforcement teams with unmatched velocity and accuracy.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5 text-center">
            
            <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-1.5 hover:shadow-md transition-all">
              <span className="text-3xl sm:text-4xl font-black text-slate-950 font-sans tracking-tight">1.4 B+</span>
              <p className="text-xs font-bold text-blue-700 uppercase tracking-wider">CONSUMERS PROTECTED</p>
              <p className="text-[11px] text-slate-500">Pan-India statutory coverage</p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-1.5 hover:shadow-md transition-all">
              <span className="text-3xl sm:text-4xl font-black text-slate-950 font-sans tracking-tight">1,420+</span>
              <p className="text-xs font-bold text-blue-700 uppercase tracking-wider">OUTLETS AUDITED</p>
              <p className="text-[11px] text-slate-500">Hypermarkets & local kiranas</p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-1.5 hover:shadow-md transition-all">
              <span className="text-3xl sm:text-4xl font-black text-emerald-700 font-sans tracking-tight">99.4%</span>
              <p className="text-xs font-bold text-emerald-800 uppercase tracking-wider">OCR ACCURACY</p>
              <p className="text-[11px] text-slate-500">Multi-lingual label recognition</p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-1.5 hover:shadow-md transition-all">
              <span className="text-3xl sm:text-4xl font-black text-amber-800 font-sans tracking-tight">&lt; 48h</span>
              <p className="text-xs font-bold text-amber-800 uppercase tracking-wider">SEIZURE NOTICE</p>
              <p className="text-[11px] text-slate-500">Down from 3 weeks manually</p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-1.5 hover:shadow-md transition-all">
              <span className="text-3xl sm:text-4xl font-black text-rose-700 font-sans tracking-tight">₹4.2 Cr</span>
              <p className="text-xs font-bold text-rose-700 uppercase tracking-wider">RIGHTS DEFENDED</p>
              <p className="text-[11px] text-slate-500">Overcharge violations halted</p>
            </div>

          </div>

        </div>
      </section>

      {/* ── 8. Floating Quick Contact Pills & Chatbot ── */}
      <div className="fixed right-0 top-1/2 -translate-y-1/2 z-40 flex flex-col gap-2.5 pr-1 sm:pr-2">
        <a
          href="https://wa.me/918800001915"
          target="_blank"
          rel="noreferrer"
          className="group flex items-center gap-2 bg-[#25d366] text-white p-2.5 sm:px-3.5 sm:py-2.5 rounded-l-2xl shadow-xl hover:bg-[#20ba59] transition-all hover:pr-4 cursor-pointer border-l border-y border-white/30"
          title="Chat on WhatsApp (8800001915)"
        >
          <Share2 size={16} className="stroke-[2.5]" />
          <div className="hidden md:flex flex-col text-left">
            <span className="text-[9px] uppercase tracking-wider font-extrabold text-emerald-100 leading-none">WhatsApp</span>
            <span className="text-xs font-mono font-black leading-none mt-0.5">8800001915</span>
          </div>
        </a>

        <a
          href="tel:1915"
          className="group flex items-center gap-2 bg-[#0284c7] text-white p-2.5 sm:px-3.5 sm:py-2.5 rounded-l-2xl shadow-xl hover:bg-[#0369a1] transition-all hover:pr-4 cursor-pointer border-l border-y border-white/30"
          title="National Consumer & Metrology Helpline (1915)"
        >
          <PhoneCall size={16} className="stroke-[2.5]" />
          <div className="hidden md:flex flex-col text-left">
            <span className="text-[9px] uppercase tracking-wider font-extrabold text-sky-100 leading-none">Toll-Free</span>
            <span className="text-xs font-mono font-black leading-none mt-0.5">1915 (Helpline)</span>
          </div>
        </a>
      </div>

      {/* Floating Bottom-Right Chatbot Trigger */}
      <div className="fixed right-5 bottom-5 z-40">
        <button
          onClick={() => setChatbotOpen(true)}
          className="relative group w-14 h-14 rounded-full bg-gradient-to-tr from-blue-700 to-indigo-600 text-white shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all border-2 border-white cursor-pointer"
          title="Chat with Yatarth AI Assistant"
        >
          <Bot size={28} />
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white animate-pulse"></span>
          <span className="absolute right-16 top-2 bg-slate-900 text-white text-[11px] font-bold px-2.5 py-1 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-md">
            Chat with Yatarth AI
          </span>
        </button>
      </div>

      {/* ── 9. Interactive AI Chat Assistant Drawer ── */}
      {chatbotOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/40 backdrop-blur-xs animate-in fade-in">
          <div className="w-full sm:w-96 bg-white h-full shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-200">
            
            {/* Drawer Header */}
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white">
                  <Bot size={18} />
                </div>
                <div>
                  <h4 className="text-xs font-black">Yatarth AI Assistant</h4>
                  <p className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    <span>ONLINE • LEGAL METROLOGY 2011</span>
                  </p>
                </div>
              </div>
              <button
                onClick={() => setChatbotOpen(false)}
                className="p-1 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Messages Body */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50">
              {chatMessages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[85%] p-3 rounded-2xl text-xs leading-relaxed ${
                      msg.sender === 'user'
                        ? 'bg-blue-600 text-white rounded-br-none'
                        : 'bg-white text-slate-800 border border-slate-200 rounded-bl-none shadow-2xs'
                    }`}
                  >
                    {msg.text}
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono mt-1 px-1">
                    {msg.time}
                  </span>
                </div>
              ))}
            </div>

            {/* Message Input Form */}
            <form onSubmit={handleChatSubmit} className="p-3 bg-white border-t border-slate-200 flex items-center gap-2">
              <input
                type="text"
                placeholder="Ask about Rule 6, MRP, font mm..."
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                className="flex-1 px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
              />
              <button
                type="submit"
                className="p-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white transition-all shadow-xs cursor-pointer active:scale-95"
              >
                <Send size={15} />
              </button>
            </form>

          </div>
        </div>
      )}

      {/* ── 8. Section: Frequently Asked Questions (Matches Screenshot 1: media_1789716933101.png) ── */}
      <section id="faq" className="py-20 px-4 sm:px-8 bg-slate-50 border-b border-slate-200/80">
        <div className="max-w-4xl mx-auto space-y-10">
          
          <div className="text-center space-y-3">
            <span className="px-3.5 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-mono font-bold uppercase tracking-wider">
              COMMON INQUIRIES
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-950 tracking-tight">
              Frequently Asked Questions
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              Answers to technical, legal, and operational questions regarding Yatarth AI.
            </p>
          </div>

          {/* Accordion List */}
          <div className="space-y-3.5">
            {[
              {
                question: 'How does Yatarth AI measure character height in millimeters without physical callipers?',
                answer: 'Yatarth AI utilizes calibrated optical geometry and reference bounding grids. By computing the physical surface dimensions of the packaging and applying sub-pixel edge detection, it calculates the true physical character height of declarations (e.g., MRP, Net Qty, Consumer Care) in real millimeters, directly validating against Rule 7 Table I of the Legal Metrology (Packaged Commodities) Rules, 2011.'
              },
              {
                question: 'Are reports generated by Yatarth AI legally admissible in consumer courts and tribunals?',
                answer: 'Yes. Every report generated by Yatarth AI produces an immutable SHA-256 digital signature, tamper-evident EXIF timestamp, and GPS coordinates conforming to Section 65B of the Indian Evidence Act for electronic records, enabling direct admissibility in consumer dispute forums and judicial magistrate courts.'
              },
              {
                question: 'Can field inspectors use Yatarth AI in rural markets with low or no cellular connectivity?',
                answer: 'Yes. Yatarth AI includes an edge-optimized offline inspection mode. Inspectors can capture, OCR-parse, and assess compounding fines on local device storage. Scans and evidence dossiers automatically sync to the state cloud once a cellular or Wi-Fi link is re-established.'
              },
              {
                question: 'How does the Reverse Supply Mapping locate other stores carrying an expired batch?',
                answer: 'When an infraction is logged against a batch ID, Yatarth AI indexes regional supply chain manifests, Clearing & Forwarding (CFA) dispatch records, and e-way bill databases to identify all retail supermarkets that took delivery of inventory from that specific production run, enabling rapid multi-store quarantine.'
              },
              {
                question: 'How does Yatarth AI integrate with existing state portals and MeriPehchan / Gov SSO?',
                answer: 'Yatarth AI provides standardized REST & OpenID Connect endpoints for direct integration with MeriPehchan (National Single Sign-On), Jan Parichay, UMANG, and State Legal Metrology departmental databases, allowing officers to log in using their official government credentials.'
              }
            ].map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div
                  key={idx}
                  className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden transition-all duration-200 hover:border-slate-300"
                >
                  <button
                    onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                    className="w-full p-5 text-left flex items-center justify-between gap-4 font-bold text-slate-900 text-sm hover:text-blue-700 transition-colors cursor-pointer"
                  >
                    <span className="leading-snug">{faq.question}</span>
                    <span className="flex-shrink-0 text-blue-600">
                      {isOpen ? <ChevronDown size={18} className="rotate-180 transition-transform" /> : <ChevronDown size={18} className="transition-transform" />}
                    </span>
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-5 text-sm text-slate-700 leading-relaxed border-t border-slate-100 pt-3 animate-in fade-in duration-150 font-normal">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* ── 9. CTA Banner (Matches Screenshot 2: media_1789716933143.png) ── */}
      <section className="py-16 px-4 sm:px-8 bg-white text-center border-b border-slate-200/80">
        <div className="max-w-4xl mx-auto space-y-6">
          
          <div className="w-12 h-12 mx-auto rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 shadow-2xs">
            <Scale size={24} className="stroke-[2.5]" />
          </div>

          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 max-w-2xl mx-auto leading-relaxed">
            Empower your enforcement officers with automated scanning, calibrated font height detection, and real-time reverse supply chain recalls.
          </h2>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-2">
            <button
              onClick={() => handleSelectRolePortal('inspector')}
              className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-white hover:bg-slate-50 border border-slate-300 text-slate-900 font-bold text-xs shadow-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <span>Launch Field Inspector Workspace</span>
              <ArrowRight size={14} />
            </button>

            <button
              onClick={() => setChatbotOpen(true)}
              className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-[#3b5998] hover:bg-[#324b80] text-white font-bold text-xs shadow-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <FileText size={14} />
              <span>Schedule State Demonstration</span>
            </button>
          </div>

        </div>
      </section>

      {/* ── 10. Official Dark GovTech Footer (Matches Screenshot 2: media_1789716933143.png) ── */}
      <footer className="bg-[#0b1329] text-white py-16 px-4 sm:px-8 font-sans">
        <div className="max-w-7xl mx-auto space-y-12">
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            
            {/* Column 1: Brand & Ministry Tag */}
            <div className="space-y-4">
              <div className="flex items-center gap-2.5">
                <Scale size={20} className="text-blue-400" />
                <span className="text-lg font-black tracking-tight text-white">Yatarth AI</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Statutory compliance, label inspection, and packaging surveillance software for the Department of Consumer Affairs (DoCA), Ministry of Consumer Affairs, Food & Public Distribution, Government of India.
              </p>
              <p className="text-xs font-bold text-[#eab308] font-serif tracking-wide pt-1">
                सत्यमेव जयते | Truth Alone Triumphs
              </p>
            </div>

            {/* Column 2: Enforcement Suite */}
            <div className="space-y-3 text-xs">
              <h4 className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-400">
                ENFORCEMENT SUITE
              </h4>
              <ul className="space-y-2 text-slate-300">
                <li>
                  <button onClick={() => onLaunchApp('overview')} className="hover:text-white transition-colors cursor-pointer text-left">
                    Inspector Dashboard
                  </button>
                </li>
                <li>
                  <button onClick={() => onLaunchApp('scan_product')} className="hover:text-white transition-colors cursor-pointer text-left">
                    Live Label Scanner
                  </button>
                </li>
                <li>
                  <button onClick={() => onLaunchApp('backtrack')} className="hover:text-white transition-colors cursor-pointer text-left">
                    Batch Backtracking Engine
                  </button>
                </li>
                <li>
                  <button onClick={() => onLaunchApp('compliance_rules')} className="hover:text-white transition-colors cursor-pointer text-left">
                    Legal Metrology Rules (2011)
                  </button>
                </li>
                <li>
                  <button onClick={() => onLaunchApp('reports')} className="hover:text-white transition-colors cursor-pointer text-left">
                    Seizure Notices & Reports
                  </button>
                </li>
              </ul>
            </div>

            {/* Column 3: Statutory Framework */}
            <div className="space-y-3 text-xs">
              <h4 className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-400">
                STATUTORY FRAMEWORK
              </h4>
              <ul className="space-y-2 text-slate-300">
                <li className="hover:text-white transition-colors cursor-pointer">Legal Metrology Act, 2009 (Act 1 of 2010)</li>
                <li className="hover:text-white transition-colors cursor-pointer">Packaged Commodities Rules, 2011</li>
                <li className="hover:text-white transition-colors cursor-pointer">FSSAI Packaging & Labelling Norms</li>
                <li className="hover:text-white transition-colors cursor-pointer">Rule 7 Table I Font Height Regulations</li>
                <li className="hover:text-white transition-colors cursor-pointer">Section 36 & 39 Penalty Guidelines</li>
              </ul>
            </div>

            {/* Column 4: GovTech Architecture */}
            <div className="space-y-3 text-xs">
              <h4 className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-400">
                GOVTECH ARCHITECTURE
              </h4>
              <ul className="space-y-2 text-slate-300">
                <li className="hover:text-white transition-colors cursor-pointer">Single Sign-On (MeriPehchan / Jan Parichay)</li>
                <li className="hover:text-white transition-colors cursor-pointer">SHA-256 Court-Admissible Digital Signatures</li>
                <li className="hover:text-white transition-colors cursor-pointer">National Consumer Helpline (NCH) Bridge</li>
                <li className="hover:text-white transition-colors cursor-pointer">GeM Market Surveillance Integration</li>
              </ul>
            </div>

          </div>

          {/* Sub-Footer Bar */}
          <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
            <p>© 2026 Yatarth AI • Department of Consumer Affairs (DoCA), Ministry of Consumer Affairs, Food & Public Distribution • Government of India.</p>
            <div className="flex items-center gap-4 text-slate-400">
              <button onClick={() => handleSelectRolePortal('inspector')} className="hover:text-white transition-colors cursor-pointer">
                Inspector Portal
              </button>
              <span>•</span>
              <a href="https://github.com" target="_blank" rel="noreferrer" className="hover:text-white transition-colors flex items-center gap-1">
                <span>GitHub Repo</span>
                <ArrowUpRight size={12} />
              </a>
            </div>
          </div>

        </div>
      </footer>

    </div>
  );
};
