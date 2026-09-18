import React from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink, ShieldCheck, PhoneCall, Globe } from 'lucide-react';

export const GovtFooter: React.FC = () => {
  return (
    <footer className="bg-[#0B3D91] text-white border-t-4 border-[#FF6A00] font-sans text-xs pt-8 pb-6">
      <div className="max-w-7xl mx-auto px-4 space-y-8">
        {/* Footer Navigation Columns */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 pb-6 border-b border-blue-800">
          <div className="space-y-3">
            <div className="flex items-center gap-2 font-bold text-sm text-amber-300">
              <ShieldCheck className="w-5 h-5" />
              <span>Yatarth AI Engine</span>
            </div>
            <p className="text-slate-300 leading-relaxed text-[11px]">
              National Legal Metrology Act (LMR 2011) AI Compliance Audit &amp; Consumer Protection Portal.
            </p>
            <div className="text-[11px] text-amber-200 font-mono">
              National Consumer Helpline: <strong>1915</strong> (Toll-Free 24x7)
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="font-bold text-amber-300 uppercase tracking-wider text-[11px]">Quick Portal Links</h4>
            <ul className="space-y-1 text-slate-300 text-[11px]">
              <li><Link to="/officer-dashboard" className="hover:text-amber-300">Executive Dashboard</Link></li>
              <li><Link to="/create-inspection" className="hover:text-amber-300">LMPC AI Scanner</Link></li>
              <li><Link to="/inspections" className="hover:text-amber-300">Track Complaint Status</Link></li>
              <li><Link to="/login" className="hover:text-amber-300">RBAC Portal Login</Link></li>
            </ul>
          </div>

          <div className="space-y-2">
            <h4 className="font-bold text-amber-300 uppercase tracking-wider text-[11px]">Related Government Portals</h4>
            <ul className="space-y-1 text-slate-300 text-[11px]">
              <li><a href="https://consumerhelpline.gov.in" target="_blank" rel="noreferrer" className="hover:text-amber-300 flex items-center gap-1">consumerhelpline.gov.in <ExternalLink className="w-3 h-3" /></a></li>
              <li><a href="https://fssai.gov.in" target="_blank" rel="noreferrer" className="hover:text-amber-300 flex items-center gap-1">fssai.gov.in (Food Safety) <ExternalLink className="w-3 h-3" /></a></li>
              <li><a href="https://consumeraffairs.nic.in" target="_blank" rel="noreferrer" className="hover:text-amber-300 flex items-center gap-1">consumeraffairs.nic.in <ExternalLink className="w-3 h-3" /></a></li>
              <li><a href="https://india.gov.in" target="_blank" rel="noreferrer" className="hover:text-amber-300 flex items-center gap-1">india.gov.in (National Portal) <ExternalLink className="w-3 h-3" /></a></li>
            </ul>
          </div>

          <div className="space-y-2">
            <h4 className="font-bold text-amber-300 uppercase tracking-wider text-[11px]">GIGW &amp; Accessibility</h4>
            <p className="text-slate-300 text-[11px]">
              Designed according to Guidelines for Indian Government Websites (GIGW) &amp; WCAG 2.1 AA Standards.
            </p>
            <div className="pt-1 text-[10px] font-mono text-slate-400">
              Screen Reader Accessible • Multilingual (EN/HI/MR)
            </div>
          </div>
        </div>

        {/* Copyright & Disclaimer */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-400">
          <p>
            Copyright © 2026 Department of Consumer Affairs, Ministry of Consumer Affairs, Food &amp; Public Distribution, Government of India.
          </p>
          <div className="flex items-center gap-4 text-[11px] font-semibold text-slate-300">
            <span className="hover:text-white cursor-pointer">RTI</span>
            <span>•</span>
            <span className="hover:text-white cursor-pointer">Privacy Policy</span>
            <span>•</span>
            <span className="hover:text-white cursor-pointer">Terms &amp; Conditions</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
