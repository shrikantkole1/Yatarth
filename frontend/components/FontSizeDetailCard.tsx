import React, { useState } from 'react';
import { Ruler, AlertCircle, CheckCircle2, XCircle, AlertTriangle, BookOpen } from 'lucide-react';
import { FontSizeEvaluation } from '../engine/complianceEngine';
import { RuleDetailModal } from './RuleDetailModal';

interface FontSizeDetailCardProps {
  fontSizeEval: FontSizeEvaluation;
}

export const FontSizeDetailCard: React.FC<FontSizeDetailCardProps> = ({ fontSizeEval }) => {
  const [modalRuleRef, setModalRuleRef] = useState<string | null>(null);

  const {
    status,
    surfaceAreaCm2,
    requiredMinNumeralHeightMm,
    measuredNumeralHeightMm,
    measuredUspHeightMm,
    requiredMinUspHeightMm,
    measuredWidthRatio,
    minWidthRatioRequired,
    reason,
    configVersion,
    comparisonPercentage
  } = fontSizeEval;

  const isPass = status === 'PASS';
  const isFail = status === 'FAIL';
  const isWarning = status === 'WARNING';

  const progressPercent = Math.min(Math.round((measuredNumeralHeightMm / Math.max(requiredMinNumeralHeightMm, 1)) * 100), 100);

  return (
    <>
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
              <Ruler className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                Rule 7 Font Size & Height Verification Sub-Engine
              </h2>
              <p className="text-xs text-slate-500">
                Mandatory numeral height inspection tied to package surface area
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setModalRuleRef('Rule 7')}
              className="text-[10px] font-mono font-bold bg-blue-50 hover:bg-blue-100 text-blue-700 px-2.5 py-1 rounded-full border border-blue-200 transition-all flex items-center gap-1 cursor-pointer"
              title="Click to view official Rule 7 Font Size Gazette Table"
            >
              <BookOpen className="w-3 h-3 text-blue-600" />
              {configVersion}
            </button>

            <span
              className={`px-3 py-1 rounded-full border text-xs font-black uppercase flex items-center gap-1 ${
                isPass
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  : isFail
                  ? 'bg-red-50 text-red-700 border-red-200'
                  : isWarning
                  ? 'bg-amber-50 text-amber-800 border-amber-200'
                  : 'bg-blue-50 text-blue-700 border-blue-200'
              }`}
            >
              {isPass ? <CheckCircle2 className="w-3.5 h-3.5" /> : isFail ? <XCircle className="w-3.5 h-3.5" /> : <AlertTriangle className="w-3.5 h-3.5" />}
              FONT {status}
            </span>
          </div>
        </div>

        <div className="bg-slate-50 rounded-2xl border border-slate-200 p-5 space-y-4">
          <div className="flex items-center justify-between text-xs font-bold text-slate-800">
            <span>Measured Numeral Height (MRP / Net Qty)</span>
            <span className="font-mono text-sm">
              <span className={isFail ? 'text-red-600 font-black' : isWarning ? 'text-amber-600 font-black' : 'text-emerald-600 font-black'}>
                {measuredNumeralHeightMm.toFixed(1)} mm
              </span>
              {' '}/ Required Min {requiredMinNumeralHeightMm.toFixed(1)} mm
            </span>
          </div>

          <div className="relative pt-1">
            <div className="overflow-hidden h-4 text-xs flex rounded-full bg-slate-200 border border-slate-300">
              <div
                style={{ width: `${progressPercent}%` }}
                className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center transition-all duration-500 font-mono text-[10px] font-black ${
                  isFail ? 'bg-red-500' : isWarning ? 'bg-amber-500' : 'bg-emerald-500'
                }`}
              >
                {progressPercent}%
              </div>
            </div>

            <div className="flex justify-between text-[10px] font-mono text-slate-400 mt-1.5 px-0.5">
              <span>0.0mm</span>
              <span>1.0mm</span>
              <span>2.0mm</span>
              <span>4.0mm</span>
              <span>6.0mm+</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs">
            <button
              type="button"
              onClick={() => setModalRuleRef('Rule 7')}
              className="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs hover:border-blue-300 text-left transition-all cursor-pointer group"
            >
              <span className="text-[10px] text-slate-400 group-hover:text-blue-600 font-bold uppercase tracking-wider block">Package Surface Area</span>
              <span className="font-black text-slate-800 text-sm font-mono">{surfaceAreaCm2} cm²</span>
            </button>

            <button
              type="button"
              onClick={() => setModalRuleRef('Rule 7')}
              className="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs hover:border-blue-300 text-left transition-all cursor-pointer group"
            >
              <span className="text-[10px] text-slate-400 group-hover:text-blue-600 font-bold uppercase tracking-wider block">Prescribed Minimum</span>
              <span className="font-black text-slate-800 text-sm font-mono">&ge; {requiredMinNumeralHeightMm.toFixed(1)} mm</span>
            </button>

            <button
              type="button"
              onClick={() => setModalRuleRef('Rule 7')}
              className="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs hover:border-blue-300 text-left transition-all cursor-pointer group"
            >
              <span className="text-[10px] text-slate-400 group-hover:text-blue-600 font-bold uppercase tracking-wider block">Compliance Ratio</span>
              <span className={`font-black text-sm font-mono ${isFail ? 'text-red-600' : isWarning ? 'text-amber-600' : 'text-emerald-600'}`}>
                {comparisonPercentage}% of minimum
              </span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          {measuredUspHeightMm !== undefined && (
            <button
              type="button"
              onClick={() => setModalRuleRef('Rule 6(11)')}
              className="p-3.5 rounded-xl border border-slate-200 bg-white hover:border-blue-300 text-left transition-all cursor-pointer space-y-1 group"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-700 group-hover:text-blue-600 flex items-center gap-1">
                  <BookOpen className="w-3 h-3 text-blue-600" /> USP Height Check (Rule 6(11))
                </span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                  measuredUspHeightMm >= (requiredMinUspHeightMm ?? 0)
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  {measuredUspHeightMm >= (requiredMinUspHeightMm ?? 0) ? 'PASS' : 'FAIL'}
                </span>
              </div>
              <p className="text-[11px] text-slate-500">
                Measured: <span className="font-bold">{measuredUspHeightMm.toFixed(1)} mm</span> (Must be &ge;50% of MRP height: {requiredMinUspHeightMm?.toFixed(1)} mm required)
              </p>
            </button>
          )}

          {measuredWidthRatio !== undefined && (
            <button
              type="button"
              onClick={() => setModalRuleRef('Rule 7')}
              className="p-3.5 rounded-xl border border-slate-200 bg-white hover:border-blue-300 text-left transition-all cursor-pointer space-y-1 group"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-700 group-hover:text-blue-600 flex items-center gap-1">
                  <BookOpen className="w-3 h-3 text-blue-600" /> Width-to-Height Ratio (Rule 7)
                </span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                  measuredWidthRatio >= minWidthRatioRequired
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-amber-100 text-amber-800'
                }`}>
                  {measuredWidthRatio >= minWidthRatioRequired ? 'PASS' : 'WARNING'}
                </span>
              </div>
              <p className="text-[11px] text-slate-500">
                Measured ratio: <span className="font-bold">{measuredWidthRatio.toFixed(2)}</span> (Required &ge; {minWidthRatioRequired.toFixed(2)} [1/3])
              </p>
            </button>
          )}
        </div>

        <div className={`p-3.5 rounded-xl border text-xs flex items-start gap-2.5 ${
          isPass ? 'bg-emerald-50/60 border-emerald-200 text-emerald-900' :
          isFail ? 'bg-red-50/60 border-red-200 text-red-900' :
          'bg-amber-50/60 border-amber-200 text-amber-900'
        }`}>
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <p className="font-semibold leading-relaxed">{reason}</p>
        </div>
      </div>

      <RuleDetailModal
        ruleRef={modalRuleRef}
        onClose={() => setModalRuleRef(null)}
      />
    </>
  );
};
