import React, { useState } from 'react';
import {
  CheckCircle2, XCircle, AlertTriangle, HelpCircle,
  ChevronDown, ChevronUp, FileText, Info, ShieldCheck, Tag, Box, Scale, Calendar, Clock, DollarSign, Phone, Globe, Award, Maximize2, BookOpen
} from 'lucide-react';
import { EvaluatedField, FieldStatus } from '../engine/complianceEngine';
import { RuleDetailModal } from './RuleDetailModal';

interface ExtractionSummaryCardProps {
  fields: EvaluatedField[];
  onSelectField?: (field: EvaluatedField) => void;
  selectedFieldId?: string;
  activeStatusFilter?: string | null;
}

const STATUS_CHIP_MAP: Record<FieldStatus, { bg: string; border: string; text: string; icon: React.ElementType }> = {
  PASS:           { bg: 'bg-emerald-50 text-emerald-700', border: 'border-emerald-200', text: 'PASS', icon: CheckCircle2 },
  FAIL:           { bg: 'bg-red-50 text-red-700',          border: 'border-red-200',     text: 'FAIL', icon: XCircle },
  WARNING:        { bg: 'bg-amber-50 text-amber-800',      border: 'border-amber-200',   text: 'WARNING', icon: AlertTriangle },
  NOT_APPLICABLE: { bg: 'bg-slate-100 text-slate-500',     border: 'border-slate-200',   text: 'NOT APPLICABLE', icon: Info },
  NEEDS_REVIEW:   { bg: 'bg-blue-50 text-blue-700',        border: 'border-blue-200',    text: 'NEEDS REVIEW', icon: HelpCircle },
};

const FIELD_ICON_MAP: Record<string, React.ElementType> = {
  manufacturer_details: Box,
  generic_name: Tag,
  net_quantity: Scale,
  mfg_date: Calendar,
  best_before: Clock,
  mrp: DollarSign,
  unit_sale_price: Tag,
  consumer_care: Phone,
  country_of_origin: Globe,
  fssai_number: Award,
  dimensions: Maximize2,
};

export const ExtractionSummaryCard: React.FC<ExtractionSummaryCardProps> = ({
  fields,
  onSelectField,
  selectedFieldId,
  activeStatusFilter
}) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [modalRuleRef, setModalRuleRef] = useState<string | null>(null);

  const toggleExpand = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedId(prev => prev === id ? null : id);
  };

  const handleOpenRuleModal = (ruleRef: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setModalRuleRef(ruleRef);
  };

  const filteredFields = activeStatusFilter
    ? fields.filter(f => f.status === activeStatusFilter)
    : fields;

  return (
    <>
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-blue-600" />
              Rule 6 Mandatory Declarations Breakdown ({filteredFields.length} of 11 Fields)
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Click any field row to open OCR evidence bounding box or click rule badges to view statutory Gazette text.
            </p>
          </div>

          <button
            type="button"
            onClick={(e) => handleOpenRuleModal('LMPC-2011-v2022', e)}
            className="text-xs font-mono font-bold bg-blue-50 text-blue-700 hover:bg-blue-100 px-3 py-1 rounded-xl border border-blue-200 transition-all flex items-center gap-1 cursor-pointer"
            title="Click to view Master Gazette LMPC Rules 2011"
          >
            <BookOpen className="w-3.5 h-3.5" />
            LMPC 2011 Rule 6
          </button>
        </div>

        <div className="divide-y divide-slate-100">
          {filteredFields.map((field) => {
            const chip = STATUS_CHIP_MAP[field.status] || STATUS_CHIP_MAP.NEEDS_REVIEW;
            const StatusIcon = chip.icon;
            const FieldIcon = FIELD_ICON_MAP[field.field_id] || Tag;
            const isSelected = selectedFieldId === field.field_id;
            const isExpanded = expandedId === field.field_id;

            return (
              <div
                key={field.field_id}
                onClick={() => onSelectField && onSelectField(field)}
                className={`p-4 transition-all rounded-xl cursor-pointer ${
                  isSelected
                    ? 'bg-blue-50/70 border border-blue-200 shadow-2xs'
                    : 'hover:bg-slate-50/80 border border-transparent'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-start gap-3 min-w-0">
                    <div className={`p-2 rounded-xl border shrink-0 ${
                      field.status === 'PASS' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                      field.status === 'FAIL' ? 'bg-red-50 text-red-600 border-red-100' :
                      field.status === 'WARNING' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                      field.status === 'NOT_APPLICABLE' ? 'bg-slate-50 text-slate-400 border-slate-200' :
                      'bg-blue-50 text-blue-600 border-blue-100'
                    }`}>
                      <FieldIcon className="w-4 h-4" />
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="text-xs font-bold text-slate-900 truncate">{field.label}</h3>

                        <button
                          type="button"
                          onClick={(e) => handleOpenRuleModal(field.rule_ref, e)}
                          className="text-[10px] font-mono font-bold text-blue-700 hover:text-blue-900 bg-blue-50 hover:bg-blue-100 px-2 py-0.5 rounded border border-blue-200 transition-all flex items-center gap-1 cursor-pointer"
                          title={`Click to view statutory legal gazette for ${field.rule_ref}`}
                        >
                          <BookOpen className="w-3 h-3 text-blue-600" />
                          {field.rule_ref}
                        </button>
                      </div>

                      <p className={`text-xs mt-0.5 font-medium truncate ${
                        field.status === 'FAIL' ? 'text-red-700 font-bold' :
                        field.status === 'WARNING' ? 'text-amber-800 font-semibold' :
                        field.status === 'NOT_APPLICABLE' ? 'text-slate-400 italic' :
                        'text-slate-700'
                      }`}>
                        {field.detected_value || 'Not found'}
                      </p>

                      {field.status !== 'PASS' && (
                        <p className="text-[11px] font-semibold text-slate-600 mt-1 flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-slate-400 shrink-0" />
                          {field.reason}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full border text-[11px] font-bold ${chip.bg} ${chip.border}`}>
                      <StatusIcon className="w-3.5 h-3.5" />
                      {chip.text}
                    </span>

                    <button
                      type="button"
                      onClick={(e) => toggleExpand(field.field_id, e)}
                      className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-400 hover:text-slate-600 transition-colors"
                      title="Toggle Rule Summary"
                    >
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {isExpanded && (
                  <div className="mt-3 pt-3 border-t border-slate-200/60 bg-slate-50/60 -mx-4 -mb-4 p-4 rounded-b-xl space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-slate-700 font-bold">
                        <FileText className="w-3.5 h-3.5 text-blue-600" />
                        <span>Statutory Legal Basis: {field.rule_ref}, Legal Metrology (Packaged Commodities) Rules, 2011</span>
                      </div>

                      <button
                        type="button"
                        onClick={(e) => handleOpenRuleModal(field.rule_ref, e)}
                        className="text-[11px] font-bold text-blue-600 hover:underline flex items-center gap-1"
                      >
                        <BookOpen className="w-3 h-3" /> View Gazette Clause
                      </button>
                    </div>

                    <p className="text-slate-600 text-[11px]">
                      <span className="font-semibold text-slate-700">Requirement: </span>
                      {field.required_value}
                    </p>
                    <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono pt-1">
                      <span>OCR Confidence: {Math.round(field.ocr_confidence * 100)}%</span>
                      <span>Config Version: {field.rule_version}</span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <RuleDetailModal
        ruleRef={modalRuleRef}
        onClose={() => setModalRuleRef(null)}
      />
    </>
  );
};
