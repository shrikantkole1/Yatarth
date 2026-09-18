import React from 'react';
import { X, CheckCircle2, XCircle, AlertTriangle, HelpCircle, FileText, Target, Eye, ShieldCheck, Tag } from 'lucide-react';
import { EvaluatedField } from '../engine/complianceEngine';

interface EvidencePanelModalProps {
  field: EvaluatedField | null;
  onClose: () => void;
  imageUrl?: string;
}

export const EvidencePanelModal: React.FC<EvidencePanelModalProps> = ({ field, onClose, imageUrl }) => {
  if (!field) return null;

  const bgImg = field.evidence_image_url || imageUrl || 'https://images.unsplash.com/photo-1589927986089-35812388d1f4?w=600&auto=format&fit=crop&q=80';
  const bbox = field.bounding_box || [15, 40, 85, 60]; // fallback [x1%, y1%, x2%, y2%]

  const [x1, y1, x2, y2] = bbox;
  const width = Math.max(x2 - x1, 10);
  const height = Math.max(y2 - y1, 10);

  const statusColor =
    field.status === 'PASS' ? 'border-emerald-500 bg-emerald-500/20 text-emerald-600' :
    field.status === 'FAIL' ? 'border-red-500 bg-red-500/20 text-red-600' :
    field.status === 'WARNING' ? 'border-amber-500 bg-amber-500/20 text-amber-600' :
    'border-blue-500 bg-blue-500/20 text-blue-600';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-3xl w-full overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold">
              <Target className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-black text-slate-900">{field.label}</h3>
                <span className="text-[10px] font-mono font-bold bg-slate-200 text-slate-700 px-2 py-0.5 rounded">
                  {field.rule_ref}
                </span>
              </div>
              <p className="text-xs text-slate-500">Legal Evidence & Bounding Box OCR Verification</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-200 hover:bg-slate-300 text-slate-600 flex items-center justify-center font-bold text-xs transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body: Image Bounding Box Panel & Side-by-Side Verification */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Label Image View with Bounding Box Overlay */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-slate-700">
              <span className="flex items-center gap-1.5">
                <Eye className="w-4 h-4 text-blue-600" />
                OCR Region Bounding Box Evidence
              </span>
              <span className="font-mono text-slate-500">
                Confidence: {(field.ocr_confidence * 100).toFixed(0)}%
              </span>
            </div>

            <div className="relative rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 flex items-center justify-center min-h-[280px]">
              <img
                src={bgImg}
                alt={field.label}
                className="w-full max-h-[340px] object-contain"
              />

              {/* Bounding Box Box Overlay */}
              <div
                style={{
                  left: `${x1}%`,
                  top: `${y1}%`,
                  width: `${width}%`,
                  height: `${height}%`,
                }}
                className={`absolute border-2 rounded-md shadow-lg transition-all ${statusColor} animate-pulse`}
              >
                <span className="absolute -top-6 left-0 bg-slate-900 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow font-mono truncate max-w-[180px]">
                  {field.field_id} ({(field.ocr_confidence * 100).toFixed(0)}%)
                </span>
              </div>
            </div>
          </div>

          {/* Side-by-Side Inspection Card */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            {/* Extracted Text Card */}
            <div className="bg-slate-50 rounded-2xl border border-slate-200 p-4 space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Extracted Text (AI OCR)
              </span>
              <p className={`text-sm font-extrabold ${field.status === 'FAIL' ? 'text-red-600' : field.status === 'WARNING' ? 'text-amber-700' : 'text-slate-900'}`}>
                "{field.detected_value}"
              </p>
              <div className="pt-2 text-[11px] text-slate-500 flex items-center justify-between border-t border-slate-200/60 mt-2">
                <span>OCR Confidence</span>
                <span className="font-mono font-bold text-slate-700">{(field.ocr_confidence * 100).toFixed(0)}%</span>
              </div>
            </div>

            {/* Prescribed Rule Requirement */}
            <div className="bg-slate-50 rounded-2xl border border-slate-200 p-4 space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Required Statutory Format
              </span>
              <p className="text-xs font-semibold text-slate-800 leading-snug">
                {field.required_value}
              </p>
              <div className="pt-2 text-[11px] text-slate-500 flex items-center justify-between border-t border-slate-200/60 mt-2">
                <span>Rule Reference</span>
                <span className="font-mono font-bold text-blue-700">{field.rule_ref}</span>
              </div>
            </div>
          </div>

          {/* Compliance Engine Audit Note */}
          <div className={`p-4 rounded-2xl border text-xs space-y-1 ${
            field.status === 'PASS' ? 'bg-emerald-50 border-emerald-200 text-emerald-950' :
            field.status === 'FAIL' ? 'bg-red-50 border-red-200 text-red-950' :
            field.status === 'WARNING' ? 'bg-amber-50 border-amber-200 text-amber-950' :
            'bg-slate-50 border-slate-200 text-slate-900'
          }`}>
            <div className="flex items-center gap-2 font-bold uppercase tracking-wider text-[10px]">
              <ShieldCheck className="w-4 h-4" />
              Engine Audit Findings ({field.status})
            </div>
            <p className="font-medium text-xs leading-relaxed">{field.reason}</p>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 border-t border-slate-100 bg-slate-50 flex justify-between items-center text-xs">
          <span className="text-slate-500 font-mono text-[11px]">
            Legally Defensible Audit Certificate Evidence • {field.rule_version}
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs transition-all"
          >
            Close Panel
          </button>
        </div>
      </div>
    </div>
  );
};
