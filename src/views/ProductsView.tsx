import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Search, 
  Filter, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  ChevronRight, 
  X, 
  Scan, 
  ExternalLink,
  Clock,
  User,
  ShieldCheck,
  Network
} from 'lucide-react';
import { Product, DeclarationDetail, Violation } from '../types';

export const ProductsView: React.FC = () => {
  const { 
    products, 
    setSelectedProductId, 
    setCurrentTab,
    setSelectedTraceBatchId 
  } = useApp();

  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [drawerProduct, setDrawerProduct] = useState<Product | null>(null);

  const categories = [
    'all',
    'Packaged Food & Snacks',
    'Spices & Seasoning',
    'Grains & Staples',
    'Beverages',
    'Personal Care & Cosmetics',
    'Condiments & Spreads'
  ];

  const filteredProducts = products.filter((p: Product) => {
    const matchesSearch = 
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.sku.toLowerCase().includes(search.toLowerCase()) ||
      p.brand.toLowerCase().includes(search.toLowerCase());

    const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;
    const matchesStatus = selectedStatus === 'all' || p.status === selectedStatus;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const getStatusBadge = (status: Product['status']) => {
    switch (status) {
      case 'compliant':
        return (
          <span className="px-2.5 py-0.5 text-[11px] font-mono font-bold rounded-full bg-emerald-50 text-emerald-800 border border-emerald-300 flex items-center gap-1 shadow-2xs">
            <CheckCircle2 size={12} className="text-emerald-600" /> Compliant
          </span>
        );
      case 'warning':
        return (
          <span className="px-2.5 py-0.5 text-[11px] font-mono font-bold rounded-full bg-amber-50 text-amber-800 border border-amber-300 flex items-center gap-1 shadow-2xs">
            <AlertTriangle size={12} className="text-amber-600" /> Advisory
          </span>
        );
      case 'non_compliant':
        return (
          <span className="px-2.5 py-0.5 text-[11px] font-mono font-bold rounded-full bg-rose-50 text-rose-800 border border-rose-300 flex items-center gap-1 shadow-2xs">
            <XCircle size={12} className="text-rose-600" /> Non-Compliant
          </span>
        );
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 animate-in fade-in text-slate-900">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-black text-slate-900">Packaged Products Registry</h1>
            <span className="px-2.5 py-0.5 text-xs font-mono font-bold rounded bg-teal-100 text-teal-900 border border-teal-300">
              {products.length} REGISTERED PRODUCTS
            </span>
          </div>
          <p className="text-xs text-black font-medium mt-1">
            Central registry of consumer packaging labels, mandatory details, and inspection history.
          </p>
        </div>

        <button
          onClick={() => setCurrentTab('scan_product')}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs shadow-sm transition-all active:scale-95"
        >
          <Scan size={14} />
          <span>Inspect New Product</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl bg-white border border-slate-300 shadow-xs">
        <div className="flex items-center gap-2 flex-1 min-w-[260px]">
          <Search size={16} className="text-slate-600" />
          <input
            type="text"
            placeholder="Search by Brand, Product Code, or Product Name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-transparent text-xs text-black font-semibold placeholder-slate-500 focus:outline-none"
          />
        </div>

        {/* Category Filter */}
        <div className="flex items-center gap-2">
          <Filter size={14} className="text-slate-600" />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1 text-xs font-bold text-black focus:outline-none"
          >
            {categories.map((c) => (
              <option key={c} value={c}>
                {c === 'all' ? 'All Product Categories' : c}
              </option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1 text-xs font-bold text-black focus:outline-none"
          >
            <option value="all">All Statuses</option>
            <option value="compliant">Compliant (Passed)</option>
            <option value="warning">Warning / Advisory</option>
            <option value="non_compliant">Violations Found</option>
          </select>
        </div>
      </div>

      {/* Products Table */}
      <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-[11px] font-mono text-black font-black uppercase tracking-wider">
                <th className="py-3 px-4">Product Name & Brand</th>
                <th className="py-3 px-4">Product Code / Size</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Score</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Rule Violations</th>
                <th className="py-3 px-4">Last Inspected</th>
                <th className="py-3 px-4">Officer</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredProducts.map((p: Product) => (
                <tr
                  key={p.id}
                  onClick={() => setDrawerProduct(p)}
                  className="hover:bg-teal-50/30 cursor-pointer transition-colors group"
                >
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-teal-50 border border-teal-200 flex items-center justify-center font-black text-teal-900 text-xs flex-shrink-0">
                        {p.name.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-bold text-slate-900 group-hover:text-teal-700 transition-colors">
                          {p.name}
                        </p>
                        <p className="text-[11px] text-slate-600 font-medium">{p.brand}</p>
                      </div>
                    </div>
                  </td>

                  <td className="py-3 px-4 font-mono text-black">
                    <p className="font-bold">{p.sku}</p>
                    <p className="text-[10px] text-slate-600 font-semibold">{p.packSize}</p>
                  </td>

                  <td className="py-3 px-4 text-black">
                    <span className="px-2 py-0.5 rounded bg-slate-100 text-[10px] font-bold border border-slate-300">
                      {p.category}
                    </span>
                  </td>

                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center font-mono font-black text-xs border"
                        style={{
                          borderColor: p.complianceScore >= 85 ? '#16a34a' : p.complianceScore >= 70 ? '#d97706' : '#dc2626',
                          backgroundColor: p.complianceScore >= 85 ? '#f0fdf4' : p.complianceScore >= 70 ? '#fffbeb' : '#fef2f2',
                          color: p.complianceScore >= 85 ? '#15803d' : p.complianceScore >= 70 ? '#b45309' : '#b91c1c'
                        }}
                      >
                        {p.complianceScore}
                      </div>
                    </div>
                  </td>

                  <td className="py-3 px-4">
                    {getStatusBadge(p.status)}
                  </td>

                  <td className="py-3 px-4">
                    {p.issuesCount > 0 ? (
                      <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-rose-100 text-rose-900 border border-rose-300">
                        {p.issuesCount} violation{p.issuesCount > 1 ? 's' : ''}
                      </span>
                    ) : (
                      <span className="text-black font-mono text-[11px] font-bold">0 violations</span>
                    )}
                  </td>

                  <td className="py-3 px-4 font-mono text-[11px] text-black font-semibold">
                    {p.lastScanDate}
                  </td>

                  <td className="py-3 px-4 text-black">
                    <div className="flex items-center gap-1.5">
                      <User size={13} className="text-slate-600" />
                      <span className="font-bold">{p.owner}</span>
                    </div>
                  </td>

                  <td className="py-3 px-4 text-right">
                    <ChevronRight size={15} className="text-slate-500 group-hover:text-teal-700 group-hover:translate-x-0.5 transition-all inline-block" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Slide-Over Product Profile Drawer */}
      {drawerProduct && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex justify-end animate-in fade-in">
          <div className="w-full max-w-xl bg-white border-l border-slate-200 shadow-2xl h-full flex flex-col animate-in slide-in-from-right duration-300 text-slate-900">
            {/* Drawer Header */}
            <div className="p-5 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-black text-slate-900">{drawerProduct.name}</h3>
                  {getStatusBadge(drawerProduct.status)}
                </div>
                <p className="text-xs text-black font-mono font-medium mt-0.5">
                  Product Code: <span className="font-bold">{drawerProduct.sku}</span> • {drawerProduct.brand} • Batch: {drawerProduct.batchNumber}
                </p>
              </div>

              <button
                onClick={() => setDrawerProduct(null)}
                className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-200/60"
              >
                <X size={17} />
              </button>
            </div>

            {/* Drawer Scrollable Content */}
            <div className="flex-1 p-5 overflow-y-auto space-y-5 bg-white">
              {/* Packaging Preview & Actions */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-4">
                <img
                  src={drawerProduct.sides[0]?.imageUrl}
                  alt={drawerProduct.name}
                  className="w-24 h-28 object-cover rounded-lg border border-slate-200 bg-white flex-shrink-0"
                />
                <div className="space-y-2 flex-1">
                  <div>
                    <span className="text-[10px] font-mono text-black uppercase font-bold">Compliance Score</span>
                    <h4 className="text-2xl font-black text-slate-900 font-mono">
                      {drawerProduct.complianceScore} / 100
                    </h4>
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <button
                      onClick={() => {
                        setSelectedProductId(drawerProduct.id);
                        setCurrentTab('analysis_results');
                      }}
                      className="px-3 py-1.5 rounded-lg bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs"
                    >
                      <ExternalLink size={13} />
                      <span>Inspect Packaging Label</span>
                    </button>
                    <button
                      onClick={() => {
                        setSelectedProductId(drawerProduct.id);
                        setCurrentTab('scan_product');
                      }}
                      className="px-3 py-1.5 rounded-lg bg-white border border-slate-300 hover:bg-slate-50 text-black text-xs font-bold flex items-center gap-1.5 shadow-2xs"
                    >
                      <Scan size={13} />
                      <span>Re-Audit</span>
                    </button>
                    <button
                      onClick={() => {
                        setSelectedTraceBatchId(drawerProduct.batchTrace?.batchId || drawerProduct.batchNumber);
                        setCurrentTab('backtrack');
                      }}
                      className="px-3 py-1.5 rounded-lg bg-blue-50 border border-blue-300 hover:bg-blue-100 text-blue-900 text-xs font-black flex items-center gap-1.5 shadow-2xs"
                    >
                      <Network size={13} className="text-blue-700" />
                      <span>Backtrack Batch</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Declarations Breakdown */}
              <div className="space-y-2">
                <h4 className="text-xs font-black text-black uppercase font-mono tracking-wider">
                  Mandatory Packaging Details (Rule 6)
                </h4>
                <div className="space-y-1.5">
                  {drawerProduct.declarations.map((d: DeclarationDetail) => (
                    <div
                      key={d.id}
                      className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between text-xs"
                    >
                      <div>
                        <p className="font-black text-slate-900">{d.label}</p>
                        <p className="text-[11px] text-black font-mono font-semibold">{d.detectedValue}</p>
                      </div>
                      <span className={`px-2 py-0.5 text-[10px] font-mono font-bold rounded ${
                        d.status === 'detected' ? 'bg-emerald-100 text-emerald-900 border border-emerald-300' :
                        d.status === 'missing' ? 'bg-rose-100 text-rose-900 border border-rose-300' :
                        'bg-amber-100 text-amber-900 border border-amber-300'
                      }`}>
                        {d.status.toUpperCase()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Detected Violations */}
              <div className="space-y-2">
                <h4 className="text-xs font-black text-black uppercase font-mono tracking-wider">
                  Active Violations ({drawerProduct.violations.length})
                </h4>
                {drawerProduct.violations.length === 0 ? (
                  <p className="text-xs text-black font-semibold p-3 bg-slate-50 rounded-lg border border-slate-200">
                    No active rule violations recorded for this product.
                  </p>
                ) : (
                  <div className="space-y-2">
                    {drawerProduct.violations.map((v: Violation) => (
                      <div key={v.id} className="p-3 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
                        <div className="flex items-center justify-between">
                          <span className={`px-1.5 py-0.2 text-[9px] font-mono font-bold uppercase rounded ${
                            v.severity === 'critical' ? 'bg-rose-100 text-rose-900' : 'bg-amber-100 text-amber-900'
                          }`}>
                            {v.severity}
                          </span>
                          <span className="text-[10px] font-mono font-black text-black">{v.ruleCode}</span>
                        </div>
                        <p className="text-xs font-bold text-slate-900">{v.title}</p>
                        <p className="text-[11px] text-slate-800 font-medium">{v.recommendedAction}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Scan Audit History */}
              <div className="space-y-2">
                <h4 className="text-xs font-black text-black uppercase font-mono tracking-wider">
                  Inspection History
                </h4>
                <div className="space-y-2">
                  {drawerProduct.history.map((h: { date: string; score: number; notes: string }, idx: number) => (
                    <div key={idx} className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 flex items-start gap-2.5">
                      <Clock size={14} className="text-teal-700 mt-0.5 flex-shrink-0" />
                      <div className="flex-1 text-xs">
                        <div className="flex items-center justify-between">
                          <span className="font-black text-slate-900">Score: {h.score}/100</span>
                          <span className="text-[10px] font-mono text-black font-bold">{h.date}</span>
                        </div>
                        <p className="text-[11px] text-black font-medium mt-0.5">{h.notes}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
