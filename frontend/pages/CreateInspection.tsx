import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../src/contexts/AuthContext';
import { ScanLine, Camera, CheckCircle2, AlertCircle, Loader2, Sparkles } from 'lucide-react';
import { uploadImage } from '../../src/lib/uploadImage';
import { createInspectionApi, confirmViewUploadApi, submitInspectionApi } from '../../src/services/api';
import { DEMO_FIXTURES } from '../engine/fixtures';
import { generatePanelSVG } from '../engine/labelArtwork';

const PRODUCT_CATEGORIES = [
  'Food & Beverages',
  'Cosmetics & Personal Care',
  'Electronics & Electricals',
  'Pharmaceuticals',
  'Household Goods',
  'Textiles & Apparel',
  'Chemicals & Cleaners',
  'Other',
];

type ViewKey = 'front' | 'back' | 'left' | 'right' | 'top' | 'bottom';

interface ViewState {
  file: File | null;
  preview: string | null;
  uploaded: boolean;
}

const LAYS_PREFED_PANELS: Record<ViewKey, string> = {
  front:  '/images/lays_chips.jpg',
  back:   '/images/lays_chips.jpg',
  left:   '/images/lays_chips.jpg',
  right:  '/images/lays_chips.jpg',
  top:    '/images/lays_chips.jpg',
  bottom: '/images/lays_chips.jpg',
};

export function CreateInspection() {
  const { profile } = useAuth();
  const navigate = useNavigate();

  const [productName, setProductName] = useState("Lay's India's Magic Masala Chips 50g");
  const [category, setCategory] = useState('Food & Beverages');
  const [batchNumber, setBatchNumber] = useState('BATCH-LAYS-2026-N7');

  // Pre-feed ALL 6 view panels by default so every tab is pre-loaded and ready
  const [views, setViews] = useState<Record<ViewKey, ViewState>>({
    front:  { file: null, preview: LAYS_PREFED_PANELS.front, uploaded: true },
    back:   { file: null, preview: LAYS_PREFED_PANELS.back, uploaded: true },
    left:   { file: null, preview: LAYS_PREFED_PANELS.left, uploaded: true },
    right:  { file: null, preview: LAYS_PREFED_PANELS.right, uploaded: true },
    top:    { file: null, preview: LAYS_PREFED_PANELS.top, uploaded: true },
    bottom: { file: null, preview: LAYS_PREFED_PANELS.bottom, uploaded: true },
  });

  const [activeView, setActiveView] = useState<ViewKey>('front');
  const [loading, setLoading] = useState(false);
  const [progressMsg, setProgressMsg] = useState('');
  const [error, setError] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSelectPreset = (fixtureKey: string) => {
    const fixture = DEMO_FIXTURES[fixtureKey];
    if (!fixture) return;

    const prodName = fixture.name.split(' (')[0];
    const photoUrl = fixture.rawPayload.sample_image_url || generatePanelSVG(prodName, 'front', 'COMPLIANT');

    setProductName(prodName);
    setCategory(fixture.category);
    setBatchNumber(`BATCH-2026-${fixtureKey.substring(0, 5).toUpperCase()}`);
    setViews({
      front:  { file: null, preview: photoUrl, uploaded: true },
      back:   { file: null, preview: photoUrl, uploaded: true },
      left:   { file: null, preview: photoUrl, uploaded: true },
      right:  { file: null, preview: photoUrl, uploaded: true },
      top:    { file: null, preview: photoUrl, uploaded: true },
      bottom: { file: null, preview: photoUrl, uploaded: true },
    });
    setError('');
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      setError('Image must be under 10MB');
      return;
    }

    const previewUrl = URL.createObjectURL(file);
    setViews((prev) => ({
      ...prev,
      [activeView]: { file, preview: previewUrl, uploaded: true },
    }));
    setError('');
  };

  const handleRemoveView = (vKey: ViewKey) => {
    setViews((prev) => ({
      ...prev,
      [vKey]: { file: null, preview: null, uploaded: false },
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!productName.trim()) {
      setError('Please enter a product name');
      return;
    }

    setLoading(true);
    setError('');

    let inspectionId = 'insp_scan_' + Date.now().toString(36);

    try {
      setProgressMsg('Initializing Legal Metrology inspection record…');
      try {
        const inspection = await createInspectionApi({
          inspector_id: profile?.uid || 'insp_default',
          inspector_name: profile?.name || 'Inspector R. K. Sharma',
          product_name: productName.trim(),
          category,
          batch_number: batchNumber.trim(),
        });

        if (inspection?._id || inspection?.id) {
          inspectionId = inspection._id || inspection.id;
        }

        const viewKeys: ViewKey[] = ['front', 'back', 'left', 'right', 'top', 'bottom'];
        for (const vKey of viewKeys) {
          if (views[vKey].file) {
            setProgressMsg(`Compressing & Uploading ${vKey.toUpperCase()} panel label…`);
            const base64Data = await uploadImage(views[vKey].file!);
            await confirmViewUploadApi(inspectionId, vKey, base64Data);
          }
        }

        setProgressMsg('Submitting to Yatarth AI Legal Metrology Compliance Engine…');
        await submitInspectionApi(inspectionId).catch(() => null);
      } catch (err) {
        console.warn('Backend server offline, generating local inspection audit session');
      }

      setProgressMsg('Scan complete! Opening LMPC compliance audit breakdown…');
      setTimeout(() => {
        navigate(`/inspections/${inspectionId}`);
      }, 700);
    } catch (err: any) {
      navigate(`/inspections/${inspectionId}`);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Outer Packaging Audit Scope Notice */}
      <div className="mb-6 p-3.5 bg-blue-50 border border-blue-200 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-blue-950">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-blue-600 shrink-0" />
          <span className="font-semibold">Legal Metrology Audit Scope:</span> Inspection evaluates outer label packaging declarations &amp; Rule 7 font dimensions only (no inner food/contents testing).
        </div>
        <span className="font-bold bg-blue-200/80 text-blue-900 px-2.5 py-0.5 rounded-lg text-[11px] uppercase tracking-wider shrink-0">
          LMPC Rules 2011 Standard
        </span>
      </div>

      <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-600">
            <ScanLine className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">New Label Scan</h1>
            <p className="text-sm text-slate-500">Legal Metrology Packaged Commodities (LMPC 2011) AI Compliance Audit</p>
          </div>
        </div>

        <div className="bg-slate-100 p-2 rounded-2xl border border-slate-200 text-xs">
          <span className="text-[10px] font-bold text-slate-500 block mb-1 uppercase tracking-wider">Pre-Fed Commodity Profiles:</span>
          <div className="flex flex-wrap gap-1.5">
            <button
              type="button"
              onClick={() => handleSelectPreset('chips_lays_compliant')}
              className="px-2.5 py-1 bg-emerald-600 text-white font-bold rounded-lg hover:bg-emerald-700 transition-all text-[11px] cursor-pointer"
            >
              Lay's Magic Masala 50g (Compliant)
            </button>
            <button
              type="button"
              onClick={() => handleSelectPreset('chips_masala_violating')}
              className="px-2.5 py-1 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 transition-all text-[11px] cursor-pointer"
            >
              Masala Chips 90g (Violating)
            </button>
            <button
              type="button"
              onClick={() => handleSelectPreset('biscuit_parleg_compliant')}
              className="px-2.5 py-1 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-all text-[11px] cursor-pointer"
            >
              Parle-G Biscuits 250g
            </button>
            <button
              type="button"
              onClick={() => handleSelectPreset('biscuit_bourbon_warning')}
              className="px-2.5 py-1 bg-amber-600 text-white font-bold rounded-lg hover:bg-amber-700 transition-all text-[11px] cursor-pointer"
            >
              Bourbon Cream 150g
            </button>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
          <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs flex items-center justify-center">1</span>
            Commodity Information (Pre-Fed Mandatory Declarations)
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Product Name *
              </label>
              <input
                type="text"
                required
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                placeholder="e.g. Lay's Magic Masala 50g"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-semibold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Commodity Category *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer font-semibold"
              >
                {PRODUCT_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Batch / Lot Number *
              </label>
              <input
                type="text"
                required
                value={batchNumber}
                onChange={(e) => setBatchNumber(e.target.value)}
                placeholder="e.g. BATCH-LAYS-2026-N7"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono font-bold"
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs flex items-center justify-center">2</span>
              Multi-View Label Image Capture (All 6 Panels Pre-Loaded)
            </h2>
            <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> 6 / 6 Panels Pre-Fed
            </span>
          </div>

          {/* View Selector Tabs — ALL PRE-FED WITH GREEN CHECKMARKS */}
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {(['front', 'back', 'left', 'right', 'top', 'bottom'] as ViewKey[]).map((vKey) => (
              <button
                key={vKey}
                type="button"
                onClick={() => setActiveView(vKey)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all capitalize flex items-center gap-1.5 shrink-0 cursor-pointer ${
                  activeView === vKey
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                    : views[vKey].preview
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {views[vKey].preview && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
                {vKey} Panel {vKey === 'front' || vKey === 'back' ? '*' : ''}
              </button>
            ))}
          </div>

          {/* Active View Label Display */}
          <div className="border-2 border-dashed border-slate-200 hover:border-blue-400 rounded-2xl p-8 text-center bg-slate-50/50 transition-all relative">
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              capture="environment"
              onChange={handleFileSelect}
              className="hidden"
            />

            {views[activeView].preview ? (
              <div className="space-y-4">
                <div className="relative max-w-lg mx-auto rounded-xl overflow-hidden shadow-md border border-slate-200 bg-slate-900">
                  <img
                    src={views[activeView].preview!}
                    alt={`${activeView} label view`}
                    className="max-h-80 mx-auto object-contain"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveView(activeView)}
                    className="absolute top-2 right-2 bg-red-600 text-white p-1.5 rounded-full shadow-lg hover:bg-red-700 text-xs font-bold cursor-pointer"
                  >
                    ✕ Remove
                  </button>
                </div>
                <p className="text-xs font-bold text-emerald-600 flex items-center justify-center gap-1">
                  <CheckCircle2 className="w-4 h-4" /> {activeView.toUpperCase()} Outer Label View Pre-Fed &amp; Ready for LMPC Audit
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-100 text-blue-600 flex items-center justify-center mx-auto">
                  <Camera className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-800">
                    Capture or Upload <span className="capitalize text-blue-600">{activeView}</span> Panel Label
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    Ensure Net Quantity, MRP, Manufacturer, and Date area are well lit and clear.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-sm transition-all cursor-pointer"
                >
                  Open Camera / Select Image
                </button>
              </div>
            )}
          </div>
        </div>

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-xs text-red-600 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            {error}
          </div>
        )}

        {loading && (
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-700 flex items-center gap-3 animate-pulse">
            <Loader2 className="w-5 h-5 animate-spin shrink-0 text-blue-600" />
            <span className="font-semibold">{progressMsg}</span>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-base rounded-2xl shadow-xl shadow-blue-500/20 transition-all disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
        >
          <ScanLine className="w-5 h-5" />
          Run Yatarth AI Legal Metrology LMPC Scan
        </button>
      </form>
    </div>
  );
}
