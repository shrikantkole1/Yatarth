import React from 'react';
import { X, BookOpen, Scale, ShieldCheck, FileText, ExternalLink, AlertTriangle } from 'lucide-react';

interface RuleDetailModalProps {
  ruleRef: string | null;
  onClose: () => void;
}

export const LEGAL_RULES_DATABASE: Record<string, {
  title: string;
  actRef: string;
  gazetteRef: string;
  summary: string;
  mandatoryRequirements: string[];
  penaltyProvision: string;
  exemptions?: string;
}> = {
  "Rule 6(1)(a)": {
    title: "Manufacturer, Packer, or Importer Name & Address",
    actRef: "Section 18, Legal Metrology Act, 2009 read with Rule 6(1)(a), LMPC Rules, 2011",
    gazetteRef: "G.S.R. 202(E) dated 1.3.2011",
    summary: "Every package shall bear the name and complete physical address of the manufacturer, packer, or importer. The address must be sufficient to enable consumer correspondence and verification by Legal Metrology inspectors.",
    mandatoryRequirements: [
      "Must state 'Manufactured by:', 'Packed by:', or 'Imported by:' explicitly.",
      "Must include full physical premise address (Plot/Survey No., Street, City, State).",
      "Must include a valid 6-digit postal PIN code."
    ],
    penaltyProvision: "Compounding fine under Section 36 of the Legal Metrology Act, 2009 up to ₹25,000 for first offence and up to ₹50,000 / imprisonment for subsequent offences."
  },

  "Rule 6(1)(b)": {
    title: "Generic or Common Name of Commodity",
    actRef: "Rule 6(1)(b), Legal Metrology (Packaged Commodities) Rules, 2011",
    gazetteRef: "G.S.R. 202(E) dated 1.3.2011",
    summary: "The principal display panel of every package shall bear the common or generic name of the commodity contained inside.",
    mandatoryRequirements: [
      "Must be printed clearly on the Principal Display Panel (PDP).",
      "Generic name must not mislead the consumer regarding true composition or nature.",
      "Trade name or brand name alone is insufficient without generic descriptor."
    ],
    penaltyProvision: "Violation attracts seizure of packages under Section 15 and penalty under Section 36 of LM Act, 2009."
  },

  "Rule 6(1)(c)": {
    title: "Net Quantity Declaration & Metric Unit Standard",
    actRef: "Rule 6(1)(c) & Rule 7, LMPC Rules, 2011",
    gazetteRef: "G.S.R. 629(E) dated 23.6.2017",
    summary: "Mandates net quantity declaration in standard metric units of weight, volume, or length, with prescribed symbol spacing.",
    mandatoryRequirements: [
      "Weight: g, kg | Volume: ml, l | Length: cm, m | Count: N or number.",
      "Must leave space between numeral and unit symbol (e.g. '500 g', not '500g').",
      "Non-standard abbreviations like 'GMS', 'Gms', 'Ltrs' are strictly prohibited."
    ],
    penaltyProvision: "Prosecution under Section 36(1) for incorrect net quantity declarations."
  },

  "Rule 6(1)(e)": {
    title: "Maximum Retail Price (MRP) & Inclusive of All Taxes",
    actRef: "Rule 6(1)(e), LMPC Rules, 2011",
    gazetteRef: "G.S.R. 779(E) dated 2.11.2021",
    summary: "Mandatory declaration of Maximum Retail Price (MRP) in Indian Rupees inclusive of all taxes. Dual pricing or sticking overwrites is illegal.",
    mandatoryRequirements: [
      "Format: 'Maximum Retail Price ₹ ____ (incl. of all taxes)' or 'MRP ₹ ____ (Incl. of all taxes)'.",
      "Must use the official Indian Rupee currency symbol (₹) or 'Rs.'.",
      "Over-sticking modified MRP stickers over original printed MRP is a punishable offense."
    ],
    penaltyProvision: "Fine up to ₹25,000 for first offence and up to ₹1,000,000 / imprisonment for repeat violations."
  },

  "Rule 6(1)(f)": {
    title: "Month & Year of Manufacture, Packing, or Import",
    actRef: "Rule 6(1)(f), LMPC Rules, 2011",
    gazetteRef: "G.S.R. 202(E) dated 1.3.2011",
    summary: "Declaration of month and year of manufacture or packing to inform consumers about freshness and shelf life.",
    mandatoryRequirements: [
      "Numeric format: MM/YYYY or MM/YY (e.g. '04/2026').",
      "Perishable and limited shelf-life goods must also declare 'Best Before' or 'Use By' date.",
      "Imported goods must declare month and year of import."
    ],
    penaltyProvision: "Penalty under Section 36 for non-declaration or misleading date formats."
  },

  "Rule 6(1)(g)": {
    title: "Consumer Care Details & Helpline Officer",
    actRef: "Rule 6(1)(g), LMPC Rules, 2011",
    gazetteRef: "G.S.R. 202(E) dated 1.3.2011",
    summary: "Every package must prominently display contact details of the designated person or office for consumer complaints.",
    mandatoryRequirements: [
      "Name / Designation of Consumer Care Officer.",
      "Physical address of consumer care office.",
      "Telephone helpline number.",
      "Valid email address for electronic complaints."
    ],
    penaltyProvision: "Compounding penalty up to ₹25,000."
  },

  "Rule 6(11)": {
    title: "Unit Sale Price (USP) Mandate & Exemptions",
    actRef: "Rule 6(11), LMPC Amendment Rules, 2022",
    gazetteRef: "G.S.R. 779(E) dated 2.11.2021 w.e.f. 1.12.2022",
    summary: "Requires declaration of Unit Sale Price (USP) per gram, kilogram, milliliter, liter, meter, or unit count to assist consumers in price comparison across package sizes.",
    mandatoryRequirements: [
      "Format: ₹ per g/kg/ml/l/m/N (e.g. '₹ 0.68 / g').",
      "USP numeral height must be at least 50% of the MRP numeral height."
    ],
    exemptions: "Exempt if package principal display surface area ≤ 100 cm², OR MRP ≤ ₹35, OR package is a wholesale package.",
    penaltyProvision: "Non-compliance results in seizure of non-conforming packages."
  },

  "Rule 7": {
    title: "Minimum Height & Width Ratio of Numerals (Rule 7 / Rule 9)",
    actRef: "Rule 7 & Schedule II, LMPC Rules, 2011",
    gazetteRef: "G.S.R. 629(E) dated 23.6.2017",
    summary: "Prescribes mandatory minimum height of numerals for Net Quantity and MRP declarations based on package surface area.",
    mandatoryRequirements: [
      "Surface area ≤ 100 cm²: Min 1.0 mm numeral height.",
      "Surface area 101 – 200 cm²: Min 2.0 mm numeral height.",
      "Surface area 201 – 500 cm²: Min 4.0 mm numeral height.",
      "Surface area > 500 cm²: Min 6.0 mm numeral height.",
      "Letter width must be at least 1/3 of height (0.333 ratio)."
    ],
    penaltyProvision: "Seizure of packages under Section 15 and penalty up to ₹25,000."
  },

  "Rule 6 (Import)": {
    title: "Mandatory Country of Origin for Imported Goods",
    actRef: "Rule 6(1), Import Provisions, LMPC Rules, 2011",
    gazetteRef: "G.S.R. 202(E) & Customs Notification 44/2000",
    summary: "All pre-packaged commodities imported into India must explicitly state the Country of Origin on the outer packaging.",
    mandatoryRequirements: [
      "Must state 'Country of Origin: [Country Name]' or 'Made in [Country Name]'.",
      "Name & address of Indian importer must be declared alongside country of origin.",
      "Customs clearance requires verification of LMPC compliance before port entry."
    ],
    penaltyProvision: "Customs detention and Legal Metrology Act prosecution."
  },

  "FSSAI": {
    title: "FSSAI 14-Digit Food Safety Licence & Logo",
    actRef: "Food Safety and Standards (Packaging and Labelling) Regulations, 2011",
    gazetteRef: "FSSAI Regulation F. No. 1-1164/FSSAI/Imports/2014",
    summary: "Mandatory for all food & beverage commodities. Must display 14-digit FSSAI license number and logo.",
    mandatoryRequirements: [
      "14-digit numeric licence code format.",
      "Must be displayed with the official FSSAI logo.",
      "Must match FSSAI central database registry for manufacturer/brand."
    ],
    penaltyProvision: "Fine up to ₹5,000,000 and suspension of food business operator license under FSS Act, 2006."
  },

  "LMPC-2011-v2022": {
    title: "Legal Metrology (Packaged Commodities) Rules, 2011 (Master Code)",
    actRef: "Legal Metrology Act, 2009 (18 of 2010)",
    gazetteRef: "G.S.R. 202(E) dated 1.3.2011 amended up to G.S.R. 779(E)",
    summary: "The primary statutory framework governing consumer packaged goods packaging, net weight verification, pricing transparency, and manufacturer accountability in India.",
    mandatoryRequirements: [
      "All 11 mandatory declarations must be legible, prominent, and in English or Hindi.",
      "Dual pricing is strictly banned.",
      "Inspectors have authority to enter premises, test samples, and seize non-compliant batches."
    ],
    penaltyProvision: "Statutory enforcement under Sections 15, 18, and 36 of LM Act, 2009."
  }
};

export const RuleDetailModal: React.FC<RuleDetailModalProps> = ({ ruleRef, onClose }) => {
  if (!ruleRef) return null;

  // Match closest key or fallback to Master Code
  const normalizedKey = Object.keys(LEGAL_RULES_DATABASE).find(
    k => ruleRef.toLowerCase().includes(k.toLowerCase()) || k.toLowerCase().includes(ruleRef.toLowerCase())
  ) || "LMPC-2011-v2022";

  const rule = LEGAL_RULES_DATABASE[normalizedKey];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-2xl w-full overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-900 text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center font-bold text-white shadow-md">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-mono font-bold text-blue-300 uppercase tracking-widest block">
                Statutory Gazette Legal Reference
              </span>
              <h3 className="text-sm font-black text-white">{rule.title}</h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center font-bold text-xs transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-5 text-xs">
          {/* Act & Gazette Citation Header */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-1">
            <div className="flex items-center gap-2 font-mono font-bold text-blue-700">
              <BookOpen className="w-4 h-4 text-blue-600" />
              <span>{rule.actRef}</span>
            </div>
            <p className="text-[11px] text-slate-500 font-mono">Gazette Notification: {rule.gazetteRef}</p>
          </div>

          {/* Legal Summary */}
          <div className="space-y-1.5">
            <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" /> Statutory Provision & Purpose
            </h4>
            <p className="text-slate-700 leading-relaxed text-xs font-medium bg-slate-50/50 p-3 rounded-xl border border-slate-200/80">
              {rule.summary}
            </p>
          </div>

          {/* Mandatory Rule Requirements Checklist */}
          <div className="space-y-2">
            <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-blue-600" /> Compliance Criteria Checklist
            </h4>
            <ul className="space-y-1.5 pl-1">
              {rule.mandatoryRequirements.map((req, idx) => (
                <li key={idx} className="flex items-start gap-2 text-slate-700 font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-600 shrink-0 mt-1.5" />
                  <span>{req}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Exemptions if any */}
          {rule.exemptions && (
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl space-y-1 text-amber-950">
              <span className="font-bold uppercase tracking-wider text-[10px] text-amber-900 block">
                Statutory Exemption Clause
              </span>
              <p className="text-xs font-medium">{rule.exemptions}</p>
            </div>
          )}

          {/* Penalty Provision */}
          <div className="p-3.5 bg-red-50 border border-red-200 rounded-xl space-y-1 text-red-950">
            <div className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-[10px] text-red-800">
              <AlertTriangle className="w-4 h-4 text-red-600" /> Statutory Penalty & Enforcement
            </div>
            <p className="text-xs font-medium leading-relaxed">{rule.penaltyProvision}</p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-100 bg-slate-50 flex items-center justify-between text-xs">
          <span className="text-[11px] font-mono text-slate-400">Official Legal Metrology Act 2009 Statutory Gazette</span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs transition-all shadow-sm"
          >
            Close Gazette Reference
          </button>
        </div>
      </div>
    </div>
  );
};
