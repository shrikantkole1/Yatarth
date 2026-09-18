import React, { useState } from 'react';
import { CheckCircle2, XCircle, AlertTriangle, HelpCircle, BookOpen, Filter } from 'lucide-react';
import { OverallResult, EvaluatedField, FontSizeEvaluation, RULE_VERSION_TAG } from '../engine/complianceEngine';
import { RuleDetailModal } from './RuleDetailModal';

interface OverallResultBannerProps {
  overallResult: OverallResult;
  evaluatedFields: EvaluatedField[];
  fontSizeEval: FontSizeEvaluation;
  productName: string;
  category: string;
  batchNumber?: string;
  inspectorName?: string;
  activeStatusFilter?: string | null;
  onSelectStatusFilter?: (status: string | null) => void;
}

const RESULT_STYLE_MAP: Record<OverallResult, {
  bannerBg: string;
  border: string;
  badgeBg: string;
  textColor: string;
  icon: React.ElementType;
  title: string;
  subtitle: string;
}> = {
  PASS: {
    bannerBg: 'bg-emerald-500/10 border-emerald-500/30',
    border: 'border-emerald-500/30',
    badgeBg: 'bg-emerald-600 text-white',
    textColor: 'text-emerald-950',
    icon: CheckCircle2,
    title: 'COMPLIANT WITH LMPC RULES 2011',
    subtitle: 'All mandatory Rule 6 declarations and Rule 7 font-size standards are verified & compliant.'
  },
  FAIL: {
    bannerBg: 'bg-red-500/10 border-red-500/30',
    border: 'border-red-500/30',
    badgeBg: 'bg-red-600 text-white',
    textColor: 'text-red-950',
    icon: XCircle,
    title: 'NON-COMPLIANT (VIOLATIONS DETECTED)',
    subtitle: 'One or more mandatory Rule 6 declarations or Rule 7 font standards failed verification.'
  },
  WARNING: {
    bannerBg: 'bg-amber-500/10 border-amber-500/30',
    border: 'border-amber-500/30',
    badgeBg: 'bg-amber-500 text-slate-950 font-black',
    textColor: 'text-amber-950',
    icon: AlertTriangle,
    title: 'BORDERLINE / WARNINGS DETECTED',
    subtitle: 'Product declarations are technically present but have minor formatting or font size warnings.'
  },
  NEEDS_REVIEW: {
    bannerBg: 'bg-blue-500/10 border-blue-500/30',
    border: 'border-blue-500/30',
    badgeBg: 'bg-blue-600 text-white',
    textColor: 'text-blue-950',
    icon: HelpCircle,
    title: 'MANUAL INSPECTOR REVIEW REQUIRED',
    subtitle: 'OCR confidence is below threshold for one or more fields. Manual inspector check required.'
  }
};

export const OverallResultBanner: React.FC<OverallResultBannerProps> = ({
  overallResult,
  evaluatedFields,
  fontSizeEval,
  productName,
  category,
  batchNumber,
  inspectorName,
  activeStatusFilter,
  onSelectStatusFilter
}) => {
  const [modalRuleRef, setModalRuleRef] = useState<string | null>(null);

  const style = RESULT_STYLE_MAP[overallResult] || RESULT_STYLE_MAP.PASS;
  const Icon = style.icon;

  const passCount = evaluatedFields.filter(f => f.status === 'PASS').length;
  const failCount = evaluatedFields.filter(f => f.status === 'FAIL').length + (fontSizeEval.status === 'FAIL' ? 1 : 0);
  const warnCount = evaluatedFields.filter(f => f.status === 'WARNING').length + (fontSizeEval.status === 'WARNING' ? 1 : 0);
  const naCount = evaluatedFields.filter(f => f.status === 'NOT_APPLICABLE').length;

  return (
    <>
      <div className={`rounded-3xl p-6 border shadow-sm transition-all ${style.bannerBg}`}>
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-md ${style.badgeBg}`}>
              <Icon className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-wider bg-white/90 text-slate-800 px-2.5 py-0.5 rounded-md border border-slate-200 shadow-2xs">
                  {category}
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-900 text-white px-2.5 py-0.5 rounded-md border border-slate-700 shadow-2xs">
                  Outer Label Packaging Audit Scope
                </span>
                {batchNumber && (
                  <span className="text-xs font-bold text-slate-600 font-mono">
                    Batch: {batchNumber}
                  </span>
                )}

                <button
                  type="button"
                  onClick={() => setModalRuleRef(RULE_VERSION_TAG)}
                  className="text-[10px] font-mono font-bold text-blue-700 hover:text-blue-900 bg-blue-100/90 hover:bg-blue-200 px-2 py-0.5 rounded-md border border-blue-300 transition-all flex items-center gap-1 cursor-pointer"
                  title="Click to view official LMPC 2011 Gazette Rules"
                >
                  <BookOpen className="w-3 h-3 text-blue-600" />
                  Rule Ver: {RULE_VERSION_TAG}
                </button>
              </div>

              <h1 className="text-2xl font-black tracking-tight text-slate-900">{productName}</h1>
              <p className="text-xs text-slate-600 max-w-xl">{style.subtitle}</p>

              {inspectorName && (
                <p className="text-[11px] text-slate-500 pt-0.5">
                  Audited by <span className="font-bold text-slate-700">{inspectorName}</span>
                </p>
              )}
            </div>
          </div>

          <div className="flex flex-col items-start lg:items-end gap-3 shrink-0">
            <div className={`px-5 py-2.5 rounded-2xl text-xs font-black uppercase tracking-wider shadow-sm flex items-center gap-2 border ${style.badgeBg}`}>
              <Icon className="w-4 h-4" />
              OVERALL RESULT: {overallResult}
            </div>

            <div className="flex items-center gap-1.5 bg-white/90 p-1.5 rounded-xl border border-slate-200 text-xs shadow-2xs">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-1.5 flex items-center gap-1">
                <Filter className="w-3 h-3" /> Filter:
              </span>

              <button
                type="button"
                onClick={() => onSelectStatusFilter && onSelectStatusFilter(activeStatusFilter === 'PASS' ? null : 'PASS')}
                className={`px-2 py-0.5 rounded-md font-bold text-xs transition-all cursor-pointer ${
                  activeStatusFilter === 'PASS'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                }`}
              >
                {passCount} Pass
              </button>

              {failCount > 0 && (
                <button
                  type="button"
                  onClick={() => onSelectStatusFilter && onSelectStatusFilter(activeStatusFilter === 'FAIL' ? null : 'FAIL')}
                  className={`px-2 py-0.5 rounded-md font-bold text-xs transition-all cursor-pointer ${
                    activeStatusFilter === 'FAIL'
                      ? 'bg-red-600 text-white shadow-xs'
                      : 'bg-red-100 text-red-800 hover:bg-red-200'
                  }`}
                >
                  {failCount} Fail
                </button>
              )}

              {warnCount > 0 && (
                <button
                  type="button"
                  onClick={() => onSelectStatusFilter && onSelectStatusFilter(activeStatusFilter === 'WARNING' ? null : 'WARNING')}
                  className={`px-2 py-0.5 rounded-md font-bold text-xs transition-all cursor-pointer ${
                    activeStatusFilter === 'WARNING'
                      ? 'bg-amber-500 text-slate-950 font-black shadow-xs'
                      : 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                  }`}
                >
                  {warnCount} Warning
                </button>
              )}

              {naCount > 0 && (
                <button
                  type="button"
                  onClick={() => onSelectStatusFilter && onSelectStatusFilter(activeStatusFilter === 'NOT_APPLICABLE' ? null : 'NOT_APPLICABLE')}
                  className={`px-2 py-0.5 rounded-md font-semibold text-xs transition-all cursor-pointer ${
                    activeStatusFilter === 'NOT_APPLICABLE'
                      ? 'bg-slate-700 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {naCount} N/A
                </button>
              )}

              {activeStatusFilter && (
                <button
                  type="button"
                  onClick={() => onSelectStatusFilter && onSelectStatusFilter(null)}
                  className="text-[10px] font-bold text-blue-600 hover:underline px-1.5"
                >
                  Clear
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <RuleDetailModal
        ruleRef={modalRuleRef}
        onClose={() => setModalRuleRef(null)}
      />
    </>
  );
};
