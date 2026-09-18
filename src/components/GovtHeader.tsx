import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  PhoneCall, Search, Globe, Eye, UserCheck, ShieldCheck,
  Plus, History, LayoutDashboard, FileText, AlertTriangle, LogOut, ChevronDown, CheckCircle2
} from 'lucide-react';

interface GovtHeaderProps {
  currentLang: 'en' | 'hi' | 'mr';
  onChangeLang: (lang: 'en' | 'hi' | 'mr') => void;
}

export const GovtHeader: React.FC<GovtHeaderProps> = ({ currentLang, onChangeLang }) => {
  const { profile, isAuthenticated, logout, setRoleProfile } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const [contrastMode, setContrastMode] = useState<boolean>(false);
  const [fontSize, setFontSize] = useState<'normal' | 'large' | 'xlarge'>('normal');

  useEffect(() => {
    if (contrastMode) {
      document.body.classList.add('high-contrast');
    } else {
      document.body.classList.remove('high-contrast');
    }
  }, [contrastMode]);

  useEffect(() => {
    document.body.classList.remove('font-large', 'font-xlarge');
    if (fontSize === 'large') document.body.classList.add('font-large');
    if (fontSize === 'xlarge') document.body.classList.add('font-xlarge');
  }, [fontSize]);

  const currentPath = location.pathname;

  const labels = {
    en: {
      govIndia: 'Government of India',
      ministry: 'Ministry of Consumer Affairs, Food & Public Distribution',
      deptName: 'Department of Consumer Affairs • Legal Metrology Division',
      portalTitle: 'National Legal Metrology & Consumer Protection Portal',
      subTitle: 'Yatarth AI — Packaged Commodities (LMR 2011) Compliance Engine',
      helplineText: 'National Consumer Helpline (NCH)',
      helplineNum: '1915',
      skipContent: 'Skip to main content',
      screenReader: 'Screen Reader Access',
      home: 'Home / Dashboard',
      fileComplaint: 'File LMPC Complaint',
      trackStatus: 'Track Status',
      scanner: 'LMPC AI Scanner',
      heatmap: 'Region Heatmap',
      rules: 'LMPC 2011 Rules',
      contact: 'Helpline / Contact',
      activeRole: 'Active Role:',
    },
    hi: {
      govIndia: 'भारत सरकार',
      ministry: 'उपभोक्ता मामले, खाद्य और सार्वजनिक वितरण मंत्रालय',
      deptName: 'उपभोक्ता मामले विभाग • विधिक माप विज्ञान प्रभाग',
      portalTitle: 'राष्ट्रीय विधिक माप विज्ञान एवं उपभोक्ता संरक्षण पोर्टल',
      subTitle: 'यथार्थ एआई — पैक्ड वस्तुएँ (LMR 2011) अनुपालन इंजन',
      helplineText: 'राष्ट्रीय उपभोक्ता हेल्पलाइन',
      helplineNum: '1915',
      skipContent: 'मुख्य सामग्री पर जाएं',
      screenReader: 'स्क्रीन रीडर एक्सेस',
      home: 'मुख्य पृष्ठ / डैशबोर्ड',
      fileComplaint: 'LMPC शिकायत दर्ज करें',
      trackStatus: 'स्थिति ट्रैक करें',
      scanner: 'LMPC AI स्कैनर',
      heatmap: 'क्षेत्रीय हीटमैप',
      rules: 'LMPC 2011 नियम',
      contact: 'हेल्पलाइन / संपर्क',
      activeRole: 'सक्रिय भूमिका:',
    },
    mr: {
      govIndia: 'भारत सरकार',
      ministry: 'ग्राहक व्यवहार, अन्न आणि सार्वजनिक वितरण मंत्रालय',
      deptName: 'ग्राहक व्यवहार विभाग • कायदेशीर वजन व मापे विभाग',
      portalTitle: 'राष्ट्रीय कायदेशीर वजन-मापे आणि ग्राहक संरक्षण पोर्टल',
      subTitle: 'यथार्थ एआय — पॅकबंद वस्तू (LMR 2011) नियम पालन इंजिन',
      helplineText: 'राष्ट्रीय ग्राहक हेल्पलाइन',
      helplineNum: '1915',
      skipContent: 'मुख्य सामग्रीवर जा',
      screenReader: 'स्क्रीन रीडर प्रवेश',
      home: 'मुख्य पृष्ठ / डॅशबोर्ड',
      fileComplaint: 'तक्रार नोंदवा',
      trackStatus: 'स्थिती तपासा',
      scanner: 'LMPC AI स्कॅनर',
      heatmap: 'प्रादेशिक नकाशे',
      rules: 'LMPC 2011 कायदे',
      contact: 'संपर्क हेल्पलाइन',
      activeRole: 'भूमिका:',
    },
  };

  const t = labels[currentLang] || labels.en;

  return (
    <header className="w-full bg-white border-b border-slate-200 shadow-xs text-slate-900 font-sans">
      {/* 1. Indian Tricolor Strip */}
      <div className="tricolor-strip" />

      {/* 2. Top Government Accessibility & Utility Bar */}
      <div className="bg-[#0B3D91] text-white py-1.5 px-4 text-xs font-medium">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          {/* Left Ministry Title */}
          <div className="flex items-center gap-2 text-[11px] truncate">
            <span className="font-bold text-amber-300">{t.govIndia}</span>
            <span className="opacity-60">|</span>
            <span className="truncate opacity-90">{t.ministry}</span>
          </div>

          {/* Right Accessibility Tools */}
          <div className="flex items-center gap-3 text-[11px] shrink-0">
            <a href="#main-content" className="hover:underline opacity-90 hidden md:inline">
              {t.skipContent}
            </a>

            <div className="flex items-center gap-1 bg-white/10 px-2 py-0.5 rounded border border-white/20">
              <span className="text-[10px] opacity-75 mr-0.5">Text Size:</span>
              <button
                onClick={() => setFontSize('normal')}
                className={`px-1 font-bold ${fontSize === 'normal' ? 'text-amber-300' : 'opacity-80'}`}
                title="Normal text size"
              >
                A
              </button>
              <button
                onClick={() => setFontSize('large')}
                className={`px-1 font-bold text-[12px] ${fontSize === 'large' ? 'text-amber-300' : 'opacity-80'}`}
                title="Large text size"
              >
                A+
              </button>
            </div>

            {/* Contrast Switcher */}
            <button
              onClick={() => setContrastMode(!contrastMode)}
              className="px-2 py-0.5 rounded bg-white/10 hover:bg-white/20 border border-white/20 text-[10px] font-bold flex items-center gap-1"
            >
              <Eye className="w-3 h-3 text-amber-300" />
              {contrastMode ? 'Normal Contrast' : 'High Contrast'}
            </button>

            {/* Language Switcher */}
            <div className="flex items-center gap-1 bg-white/15 px-2 py-0.5 rounded border border-white/25">
              <Globe className="w-3 h-3 text-amber-300" />
              <select
                value={currentLang}
                onChange={(e) => onChangeLang(e.target.value as any)}
                className="bg-transparent text-white text-[11px] font-bold focus:outline-none cursor-pointer"
              >
                <option value="en" className="bg-[#0B3D91] text-white">English</option>
                <option value="hi" className="bg-[#0B3D91] text-white">हिंदी (Hindi)</option>
                <option value="mr" className="bg-[#0B3D91] text-white">मराठी (Marathi)</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Main Government Header Branding */}
      <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Emblem & Portal Title */}
        <Link to="/" className="flex items-center gap-4 group">
          <div className="w-14 h-14 rounded-xl bg-slate-100 border border-slate-300 p-1 flex items-center justify-center shrink-0 shadow-sm">
            {/* National Emblem Visual Mockup */}
            <div className="w-full h-full bg-[#0B3D91] rounded-lg text-white font-black text-center flex flex-col items-center justify-center p-1 leading-none">
              <span className="text-[10px] text-amber-400 font-mono">GOI</span>
              <span className="text-[9px] tracking-tighter">सत्यमेव जयते</span>
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-black text-[#0B3D91] tracking-tight group-hover:text-[#14509E] transition-colors">
                {t.portalTitle}
              </span>
              <span className="bg-amber-100 text-amber-900 border border-amber-300 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                Yatarth AI
              </span>
            </div>
            <p className="text-xs font-semibold text-slate-600 mt-0.5">
              {t.subTitle}
            </p>
          </div>
        </Link>

        {/* National Helpline Toll-Free Card */}
        <div className="flex items-center gap-3 shrink-0 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 p-3 rounded-2xl shadow-xs">
          <div className="w-10 h-10 rounded-xl bg-[#FF6A00] text-white flex items-center justify-center shadow-md shrink-0">
            <PhoneCall className="w-5 h-5 animate-bounce" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
              {t.helplineText}
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-black text-[#0B3D91] font-mono tracking-tight">
                {t.helplineNum}
              </span>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                Toll-Free 24x7
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Primary Government Navigation Bar */}
      <nav className="bg-[#0B3D91] text-white border-t border-blue-900 shadow-md">
        <div className="max-w-7xl mx-auto px-4 flex flex-wrap items-center justify-between gap-2 py-1">
          <div className="flex flex-wrap items-center gap-1 text-xs font-bold">
            <Link
              to="/officer-dashboard"
              className={`px-3.5 py-2.5 rounded-lg transition-all flex items-center gap-2 ${
                currentPath === '/' || currentPath === '/officer-dashboard'
                  ? 'bg-[#14509E] text-amber-300 shadow-inner'
                  : 'hover:bg-[#14509E] text-white'
              }`}
            >
              <LayoutDashboard className="w-4 h-4 text-amber-400" /> {t.home}
            </Link>

            <Link
              to="/create-inspection"
              className={`px-3.5 py-2.5 rounded-lg transition-all flex items-center gap-2 ${
                currentPath === '/create-inspection'
                  ? 'bg-[#14509E] text-amber-300 shadow-inner'
                  : 'hover:bg-[#14509E] text-white'
              }`}
            >
              <Plus className="w-4 h-4 text-amber-400" /> {t.scanner}
            </Link>

            <Link
              to="/inspections"
              className={`px-3.5 py-2.5 rounded-lg transition-all flex items-center gap-2 ${
                currentPath === '/inspections'
                  ? 'bg-[#14509E] text-amber-300 shadow-inner'
                  : 'hover:bg-[#14509E] text-white'
              }`}
            >
              <History className="w-4 h-4 text-amber-400" /> {t.trackStatus}
            </Link>
          </div>

          {/* User Profile / Role Bar */}
          <div className="flex items-center gap-2 py-1">
            <div className="bg-blue-950/80 px-3 py-1 rounded-lg border border-blue-800 flex items-center gap-2 text-xs font-semibold">
              <UserCheck className="w-3.5 h-3.5 text-amber-300" />
              <span className="text-[11px] text-slate-300">{t.activeRole}</span>
              <select
                value={profile?.role || 'officer'}
                onChange={(e) => setRoleProfile(e.target.value as any)}
                className="bg-transparent text-amber-300 font-bold focus:outline-none cursor-pointer"
              >
                <option value="officer" className="bg-[#0B3D91] text-white">Officer (Auditor)</option>
                <option value="inspector" className="bg-[#0B3D91] text-white">Inspector (Field)</option>
                <option value="admin" className="bg-[#0B3D91] text-white">Super Admin</option>
                <option value="citizen" className="bg-[#0B3D91] text-white">Consumer / Citizen</option>
              </select>
            </div>

            {isAuthenticated && (
              <button
                onClick={() => {
                  logout();
                  navigate('/login');
                }}
                className="p-1.5 bg-red-600/80 hover:bg-red-600 text-white rounded-lg text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
                title="Sign Out"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
};
