import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getInspectionByIdApi } from '../../src/services/api';
import { ArrowLeft, Eye, Sparkles, Sliders } from 'lucide-react';

import { evaluateCompliance, EvaluatedField } from '../engine/complianceEngine';
import { DEMO_FIXTURES } from '../engine/fixtures';
import { OverallResultBanner } from '../components/OverallResultBanner';
import { ExtractionSummaryCard } from '../components/ExtractionSummaryCard';
import { FontSizeDetailCard } from '../components/FontSizeDetailCard';
import { EvidencePanelModal } from '../components/EvidencePanelModal';

export function InspectionDetail() {
  const { id } = useParams<{ id: string }>();
  const [inspection, setInspection] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedView, setSelectedView] = useState<string>('front');

  const DEFAULT_FIXTURE_KEY = 'chips_lays_compliant';
  const [activeFixtureId, setActiveFixtureId] = useState<string>(DEFAULT_FIXTURE_KEY);
  const [selectedFieldForModal, setSelectedFieldForModal] = useState<EvaluatedField | null>(null);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);

  const fetchDetail = async () => {
    if (!id) return;
    try {
      const data = await getInspectionByIdApi(id);
      setInspection(data);

      if (data?.product_name) {
        const lower = data.product_name.toLowerCase();
        if (lower.includes('masala') || lower.includes('violat') || lower.includes('wave') || lower.includes('soda')) {
          setActiveFixtureId('chips_masala_violating');
        } else if (lower.includes('bourbon') || lower.includes('cream') || lower.includes('warn')) {
          setActiveFixtureId('biscuit_bourbon_warning');
        } else if (lower.includes('parle') || lower.includes('biscuit')) {
          setActiveFixtureId('biscuit_parleg_compliant');
        } else {
          setActiveFixtureId('chips_lays_compliant');
        }
      }
    } catch (err) {
      console.warn('Backend detail offline, using fallback fixture inspection profile:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetail();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="animate-spin w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-3" />
        <p className="text-sm font-semibold text-slate-600">Retrieving Legal Metrology AI Audit Report...</p>
      </div>
    );
  }

  const currentFixture = DEMO_FIXTURES[activeFixtureId] || DEMO_FIXTURES[DEFAULT_FIXTURE_KEY] || Object.values(DEMO_FIXTURES)[0];
  const evaluation = evaluateCompliance(currentFixture.rawPayload, currentFixture.metadata);

  const productName = inspection?.product_name || currentFixture.name;
  const category = inspection?.category || currentFixture.category;
  const batchNumber = inspection?.batch_number || 'BATCH-2026-X9';
  const inspectorName = inspection?.inspector_name || 'Inspector R. K. Sharma';
  const sampleImage = inspection?.views?.[selectedView]?.image_url || currentFixture.rawPayload.sample_image_url;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <Link to="/inspections" className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Inspection Log
        </Link>

        <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-2xl border border-slate-200 text-xs overflow-x-auto">
          <span className="text-[11px] font-bold text-slate-500 px-2 flex items-center gap-1 shrink-0">
            <Sliders className="w-3.5 h-3.5 text-blue-600" /> Commodity Profile:
          </span>
          {Object.values(DEMO_FIXTURES).map((fix) => (
            <button
              key={fix.id}
              onClick={() => {
                setActiveFixtureId(fix.id);
                setStatusFilter(null);
              }}
              className={`px-3 py-1.5 rounded-xl text-[11px] font-bold transition-all shrink-0 cursor-pointer ${
                activeFixtureId === fix.id
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-200'
              }`}
            >
              {fix.name.split(' (')[0]} {fix.name.includes('Compliant') ? '✓' : fix.name.includes('Multi') ? '⚠️' : '❓'}
            </button>
          ))}
        </div>
      </div>

      <OverallResultBanner
        overallResult={evaluation.overallResult}
        evaluatedFields={evaluation.evaluatedFields}
        fontSizeEval={evaluation.fontSizeEval}
        productName={productName}
        category={category}
        batchNumber={batchNumber}
        inspectorName={inspectorName}
        activeStatusFilter={statusFilter}
        onSelectStatusFilter={(st) => setStatusFilter(st)}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <Eye className="w-4 h-4 text-blue-600" />
                Label View Panel
              </h3>
              <span className="text-[11px] font-bold text-blue-600 capitalize bg-blue-50 px-2 py-0.5 rounded">
                {selectedView} Panel
              </span>
            </div>

            <div className="relative rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 min-h-[300px] flex items-center justify-center shadow-inner">
              <img
                src={sampleImage}
                alt={`${selectedView} label view`}
                className="w-full h-auto max-h-[360px] object-contain"
              />
              <div className="absolute top-2 left-2 bg-slate-900/80 backdrop-blur-xs text-white text-[10px] font-mono px-2 py-1 rounded border border-white/10">
                300 DPI High-Res Scan
              </div>
            </div>

            <div className="flex flex-wrap gap-2 pt-1">
              {['front', 'back', 'left', 'right', 'top', 'bottom'].map((vKey) => (
                <button
                  key={vKey}
                  onClick={() => setSelectedView(vKey)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition-all cursor-pointer ${
                    selectedView === vKey
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {vKey}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-blue-50/70 rounded-2xl border border-blue-200/80 p-4 space-y-1.5 text-xs text-blue-950">
            <div className="flex items-center gap-2 font-bold text-blue-800">
              <Sparkles className="w-4 h-4 text-blue-600" />
              Audit Scenario Overview
            </div>
            <p className="text-[11px] text-blue-900/80 leading-relaxed">
              {currentFixture.description}
            </p>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <ExtractionSummaryCard
            fields={evaluation.evaluatedFields}
            onSelectField={(field) => setSelectedFieldForModal(field)}
            selectedFieldId={selectedFieldForModal?.field_id}
            activeStatusFilter={statusFilter}
          />

          <FontSizeDetailCard fontSizeEval={evaluation.fontSizeEval} />
        </div>
      </div>

      <EvidencePanelModal
        field={selectedFieldForModal}
        onClose={() => setSelectedFieldForModal(null)}
        imageUrl={sampleImage}
      />
    </div>
  );
}
