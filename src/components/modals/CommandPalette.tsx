import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Search, 
  Scan, 
  Boxes, 
  AlertTriangle, 
  FileText, 
  ClipboardList, 
  Sliders, 
  Sparkles,
  ArrowRight,
  Network,
  X
} from 'lucide-react';
import { Product, ComplianceRule } from '../../types';

export const CommandPalette: React.FC = () => {
  const { 
    isCommandPaletteOpen, 
    setIsCommandPaletteOpen, 
    setCurrentTab, 
    products, 
    setSelectedProductId, 
    rules, 
    setIsCopilotOpen,
    setSelectedTraceBatchId
  } = useApp();

  const [query, setQuery] = useState('');

  if (!isCommandPaletteOpen) return null;

  const filteredProducts = products.filter(
    (p: Product) => p.name.toLowerCase().includes(query.toLowerCase()) || p.sku.toLowerCase().includes(query.toLowerCase())
  );

  const filteredRules = rules.filter(
    (r: ComplianceRule) => r.title.toLowerCase().includes(query.toLowerCase()) || r.code.toLowerCase().includes(query.toLowerCase())
  );

  const quickActions = [
    { label: 'Scan Packaging Image', icon: Scan, action: () => setCurrentTab('scan_product') },
    { label: 'Backtrack Supply Chain & Batches', icon: Network, action: () => { setSelectedTraceBatchId('LAY-EXP-2025-09'); setCurrentTab('backtrack'); } },
    { label: 'Ask Yatarth AI', icon: Sparkles, action: () => setIsCopilotOpen(true) },
    { label: 'View All Rule Violations', icon: AlertTriangle, action: () => setCurrentTab('violations') },
    { label: 'Export Inspection Report', icon: FileText, action: () => setCurrentTab('reports') },
    { label: 'Schedule Store Inspection', icon: ClipboardList, action: () => setCurrentTab('inspections') },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-start justify-center pt-24 px-4 animate-in fade-in">
      <div 
        className="w-full max-w-2xl bg-white border border-slate-300 rounded-2xl shadow-2xl overflow-hidden flex flex-col text-slate-900"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-slate-200 gap-3 bg-white">
          <Search size={18} className="text-teal-700" />
          <input
            type="text"
            placeholder="Search products, packaging rules, notices, or inspections..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
            className="flex-1 bg-transparent text-sm text-black font-bold placeholder-slate-500 focus:outline-none"
          />
          <button
            onClick={() => setIsCommandPaletteOpen(false)}
            className="p-1 rounded-md text-slate-500 hover:text-black hover:bg-slate-100"
          >
            <X size={16} />
          </button>
        </div>

        {/* Results Body */}
        <div className="max-h-96 overflow-y-auto p-3 space-y-4 bg-white">
          {/* Quick Actions */}
          {!query && (
            <div>
              <p className="text-[11px] font-mono text-black font-black uppercase tracking-wider px-2 mb-1.5">
                Quick Shortcuts
              </p>
              <div className="space-y-1">
                {quickActions.map((qa, idx) => {
                  const Icon = qa.icon;
                  return (
                    <button
                      key={idx}
                      onClick={() => {
                        qa.action();
                        setIsCommandPaletteOpen(false);
                      }}
                      className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs text-black hover:text-teal-900 hover:bg-teal-50 group transition-colors text-left"
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon size={15} className="text-teal-700 group-hover:scale-110 transition-transform" />
                        <span className="font-bold">{qa.label}</span>
                      </div>
                      <ArrowRight size={13} className="text-slate-400 group-hover:text-teal-700 transition-colors" />
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Products Search Results */}
          {filteredProducts.length > 0 && (
            <div>
              <p className="text-[11px] font-mono text-black font-black uppercase tracking-wider px-2 mb-1.5">
                Products & Packaging ({filteredProducts.length})
              </p>
              <div className="space-y-1">
                {filteredProducts.map((p: Product) => (
                  <button
                    key={p.id}
                    onClick={() => {
                      setSelectedProductId(p.id);
                      setCurrentTab('products');
                      setIsCommandPaletteOpen(false);
                    }}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs text-black hover:text-teal-900 hover:bg-slate-50 group transition-colors text-left"
                  >
                    <div className="flex items-center gap-2.5">
                      <Boxes size={15} className="text-cyan-700" />
                      <div>
                        <p className="font-black text-slate-900">{p.name}</p>
                        <p className="text-[10px] text-slate-700 font-mono font-semibold">Code: {p.sku} • {p.brand}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 text-[10px] font-mono font-bold rounded ${
                        p.complianceScore >= 85 ? 'bg-emerald-100 text-emerald-900 border border-emerald-300' :
                        p.complianceScore >= 70 ? 'bg-amber-100 text-amber-900 border border-amber-300' :
                        'bg-rose-100 text-rose-900 border border-rose-300'
                      }`}>
                        {p.complianceScore}%
                      </span>
                      <ArrowRight size={13} className="text-slate-400 group-hover:text-teal-700 transition-colors" />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Rules Search Results */}
          {filteredRules.length > 0 && (
            <div>
              <p className="text-[11px] font-mono text-black font-black uppercase tracking-wider px-2 mb-1.5">
                Packaging Rules ({filteredRules.length})
              </p>
              <div className="space-y-1">
                {filteredRules.map((r: ComplianceRule) => (
                  <button
                    key={r.id}
                    onClick={() => {
                      setCurrentTab('compliance_rules');
                      setIsCommandPaletteOpen(false);
                    }}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs text-black hover:text-teal-900 hover:bg-slate-50 group transition-colors text-left"
                  >
                    <div className="flex items-center gap-2.5">
                      <Sliders size={15} className="text-purple-700" />
                      <div>
                        <p className="font-bold text-slate-900">{r.title}</p>
                        <p className="text-[10px] text-slate-700 font-mono font-semibold">{r.code} • {r.category}</p>
                      </div>
                    </div>
                    <span className="text-[10px] text-black font-mono font-bold">v{r.version}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {query && filteredProducts.length === 0 && filteredRules.length === 0 && (
            <div className="text-center py-8 text-black font-bold text-xs">
              No matching records found for "{query}". Try searching product codes or rule names.
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="px-4 py-2 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-[11px] font-mono text-black font-bold">
          <span>Navigate with mouse or arrow keys</span>
          <span>ESC to close</span>
        </div>
      </div>
    </div>
  );
};
