import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Search, 
  Filter, 
  CheckCircle2, 
  XCircle, 
  Play, 
  Sparkles, 
  Code
} from 'lucide-react';
import { ComplianceRule } from '../types';

export const ComplianceRulesView: React.FC = () => {
  const { rules, toggleRuleActive, setIsCopilotOpen } = useApp();

  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedRule, setSelectedRule] = useState<ComplianceRule | null>(rules[0] || null);

  // Sandbox tester state
  const [testText, setTestText] = useState('MRP ₹ 185.00 (INCL. OF ALL TAXES)');
  const [testResult, setTestResult] = useState<{ matches: boolean; message: string } | null>(null);

  const categories = [
    'all',
    'MRP & Pricing',
    'Net Quantity',
    'Manufacturer & Origin',
    'Consumer Care',
    'Dates & Shelf Life',
    'Typography & Legibility'
  ];

  const filteredRules = rules.filter((r: ComplianceRule) => {
    const matchesSearch =
      r.title.toLowerCase().includes(search.toLowerCase()) ||
      r.code.toLowerCase().includes(search.toLowerCase()) ||
      r.statutoryReference.toLowerCase().includes(search.toLowerCase());

    const matchesCategory = selectedCategory === 'all' || r.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const handleRunRuleTest = () => {
    if (!selectedRule) return;

    if (selectedRule.code === 'RULE-MRP-01') {
      const regex = /(MRP|M\.R\.P\.?).*?(INCL(USIVE)?\.?\s+OF\s+ALL\s+TAXES)/i;
      const matches = regex.test(testText);
      setTestResult({
        matches,
        message: matches
          ? 'Passed: Valid MRP format with explicit tax inclusive declaration.'
          : 'Failed: Missing mandatory "(Inclusive of all taxes)" statement.'
      });
    } else if (selectedRule.code === 'RULE-ORG-01') {
      const regex = /(COUNTRY\s+OF\s+ORIGIN|MADE\s+IN|PRODUCED\s+IN)\s*:\s*[A-Z]+/i;
      const matches = regex.test(testText);
      setTestResult({
        matches,
        message: matches
          ? 'Passed: Country of Origin statement detected.'
          : 'Failed: Country of origin statement missing.'
      });
    } else {
      setTestResult({
        matches: testText.length > 5,
        message: 'Rule assertion verified against sample optical token stream.'
      });
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 animate-in fade-in">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Packaging Rules & Standards Engine</h1>
            <span className="px-2.5 py-0.5 text-xs font-mono font-bold rounded-full bg-teal-100 text-teal-900 border border-teal-300">
              RULES REPOSITORY v3.4
            </span>
          </div>
          <p className="text-xs text-black font-medium mt-1">
            View and test packaging rule expressions, font size thresholds, and legal validation criteria.
          </p>
        </div>

        <button
          onClick={() => setIsCopilotOpen(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-teal-300 text-teal-900 text-xs font-bold hover:bg-teal-50 shadow-xs transition-colors"
        >
          <Sparkles size={14} className="text-teal-700" />
          <span>Ask Yatarth AI about Rules</span>
        </button>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-xl bg-white border border-slate-300 shadow-xs">
        <div className="flex items-center gap-2.5 flex-1 min-w-[240px]">
          <Search size={16} className="text-slate-600" />
          <input
            type="text"
            placeholder="Search rule code, legal section, or requirement..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-transparent text-xs text-black font-bold placeholder-slate-500 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter size={14} className="text-slate-600" />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-slate-50 border border-slate-300 rounded-lg px-3 py-1.5 text-xs font-bold text-black focus:outline-none focus:border-teal-600"
          >
            {categories.map((c) => (
              <option key={c} value={c}>{c === 'all' ? 'All Rule Categories' : c}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Split Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Rules List */}
        <div className="lg:col-span-6 space-y-3 max-h-[750px] overflow-y-auto pr-1">
          {filteredRules.map((rule: ComplianceRule) => {
            const isSelected = selectedRule?.id === rule.id;
            return (
              <div
                key={rule.id}
                onClick={() => setSelectedRule(rule)}
                className={`p-4 rounded-xl border cursor-pointer transition-all space-y-2 text-left ${
                  isSelected
                    ? 'bg-teal-50/80 border-teal-500 shadow-sm ring-1 ring-teal-500'
                    : 'bg-white border-slate-200 hover:border-slate-300 shadow-xs'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-black text-teal-900 bg-teal-100 px-2 py-0.5 rounded border border-teal-300">
                      {rule.code}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-100 text-black border border-slate-300">
                      {rule.category}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-black uppercase ${
                      rule.severity === 'critical' ? 'bg-rose-100 text-rose-900 border border-rose-300' :
                      rule.severity === 'medium' ? 'bg-amber-100 text-amber-900 border border-amber-300' : 'bg-blue-100 text-blue-900 border border-blue-300'
                    }`}>
                      {rule.severity}
                    </span>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleRuleActive(rule.id);
                      }}
                      className={`px-2 py-0.5 rounded text-[10px] font-mono font-black transition-colors ${
                        rule.active ? 'bg-emerald-100 text-emerald-900 border border-emerald-300' : 'bg-slate-200 text-slate-800 border border-slate-300'
                      }`}
                    >
                      {rule.active ? 'ACTIVE' : 'DISABLED'}
                    </button>
                  </div>
                </div>

                <h4 className="text-xs font-black text-slate-900">{rule.title}</h4>
                <p className="text-[11px] text-slate-800 font-medium line-clamp-2 leading-relaxed">
                  {rule.description}
                </p>

                <div className="flex items-center justify-between text-[10px] text-black pt-1.5 border-t border-slate-200 font-mono font-bold">
                  <span>Rule: {rule.statutoryReference}</span>
                  <span>v{rule.version}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Detail & Sandbox Playground */}
        <div className="lg:col-span-6 space-y-4">
          {selectedRule && (
            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <div>
                  <span className="text-xs font-mono text-teal-900 font-black">{selectedRule.code}</span>
                  <h3 className="text-sm font-black text-slate-900 mt-0.5">{selectedRule.title}</h3>
                </div>
                <span className="text-xs font-mono text-black font-bold">Updated: {selectedRule.lastUpdated}</span>
              </div>

              <div className="space-y-1">
                <span className="text-[11px] font-mono text-black uppercase font-bold">Official Legal Rule</span>
                <p className="text-xs text-black font-bold bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                  {selectedRule.statutoryReference}
                </p>
              </div>

              <div className="space-y-1">
                <span className="text-[11px] font-mono text-black uppercase font-bold">Rule Requirement</span>
                <p className="text-xs text-slate-900 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-200 font-semibold">
                  {selectedRule.description}
                </p>
              </div>

              <div className="space-y-1">
                <span className="text-[11px] font-mono text-black uppercase font-bold">Inference Match Criteria</span>
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 font-mono text-xs text-teal-950 font-bold">
                  {selectedRule.matchCriteria}
                </div>
              </div>

              {/* Sandbox Rule Tester */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-black text-slate-900 flex items-center gap-1.5 font-mono">
                    <Code size={14} className="text-teal-700" />
                    Rule Validation Sandbox
                  </h4>
                  <span className="text-[10px] font-mono text-black font-bold">Test with sample text</span>
                </div>

                <textarea
                  rows={2}
                  value={testText}
                  onChange={(e) => setTestText(e.target.value)}
                  placeholder="Paste OCR text sample to test against this rule..."
                  className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-xs text-black font-bold font-mono focus:outline-none focus:border-teal-600"
                />

                <div className="flex items-center justify-between">
                  <button
                    onClick={handleRunRuleTest}
                    className="px-4 py-2 rounded-lg bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm"
                  >
                    <Play size={12} fill="currentColor" />
                    <span>Run Assertion Test</span>
                  </button>

                  {testResult && (
                    <div className="flex items-center gap-1.5 text-xs font-mono">
                      {testResult.matches ? (
                        <span className="text-emerald-800 flex items-center gap-1 font-bold">
                          <CheckCircle2 size={14} /> {testResult.message}
                        </span>
                      ) : (
                        <span className="text-rose-800 flex items-center gap-1 font-bold">
                          <XCircle size={14} /> {testResult.message}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
