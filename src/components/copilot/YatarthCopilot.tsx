import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Sparkles, 
  X, 
  Send, 
  Bot, 
  User, 
  ArrowRight,
  Lightbulb
} from 'lucide-react';
import { Product } from '../../types';

interface ChatMessage {
  id: string;
  sender: 'copilot' | 'user';
  text: string;
  timestamp: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export const YatarthCopilot: React.FC = () => {
  const { 
    isCopilotOpen, 
    setIsCopilotOpen, 
    products, 
    setCurrentTab, 
    setSelectedProductId,
    setSelectedTraceBatchId 
  } = useApp();

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-1',
      sender: 'copilot',
      text: "Namaste Officer! I am **Yatarth AI**, your Legal Metrology inspection assistant. I analyze product packaging labels, legal rules, mandatory MRP tax statements, and store inspection records.\n\nHow can I help you today?",
      timestamp: 'Just now'
    }
  ]);

  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  if (!isCopilotOpen) return null;

  const quickPrompts = [
    "Backtrack Lay's chips (Expired batch LAY-EXP-2025-09)",
    "Why was Organic Turmeric Powder flagged?",
    "What rule violations should be fixed first?",
    "Show products with violations.",
    "Explain the MRP tax clause requirement (Rule 6)."
  ];

  const handleSend = (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim()) return;

    const userMsg: ChatMessage = {
      id: 'msg-' + Date.now(),
      sender: 'user',
      text: query,
      timestamp: 'Just now'
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput('');
    setIsTyping(true);

    setTimeout(() => {
      let botResponse = '';
      let actionObj: ChatMessage['action'] | undefined = undefined;

      const lower = query.toLowerCase();

      if (lower.includes('lay') || lower.includes('chip') || lower.includes('backtrack') || lower.includes('trace') || lower.includes('expired')) {
        botResponse = `### 🚨 Supply Chain Backtrack: Lay's Classic Salted (Batch: LAY-EXP-2025-09)\n\n**CRITICAL SAFETY FINDING**: Product on retail shelf is **EXPIRED** (Use By: 10/12/2025).\n\n#### 📍 Upstream Supply Chain Lineage Trace:\n1. **Retail Detection Site**: Star Bazaar Hypermarket, Shelf C-04 (Ward 82, Bengaluru) — *38 units on shelf*.\n2. **Regional Wholesaler**: Bengaluru Metro FMCG Depot 3 (Nelamangala Hub, Lot: \`LOT-BLR-2025-8812\`).\n3. **C&F / Distributor**: Northern & Western C&F Logistics (Ambala Bay 12, Dispatch Invoice: \`DIS-PEP-2025-44910\`, Truck: \`HR-37-D-9122\`).\n4. **Manufacturer & Plant**: **PepsiCo India Holdings Pvt. Ltd.**, Village Channo, Sangrur, Punjab (LM Reg: \`PB-LM-2018-9941\`, FSSAI: \`10014064000435\`, Line 4).\n5. **Raw Material Suppliers Found**:\n   - *Potatoes*: Kullu & Doaba Agro Contract Farmers (Jalandhar Lot: \`POT-AGR-2025-06\`)\n   - *Palmolein Oil*: Adani Wilmar Edible Oil Complex (Mundra Port Lot: \`OIL-PLM-2025-1102\`)\n   - *Barrier Foil*: UFlex Packaging Unit II (Noida Sector 58 Lot: \`LAM-UFLX-2025-401\`)\n\n*Mandated Enforcement Action*: Immediate batch quarantine issued. Seize remaining 38 shelf units.`;
        actionObj = {
          label: 'Open Interactive Supply Chain Map',
          onClick: () => {
            setSelectedTraceBatchId('LAY-EXP-2025-09');
            setCurrentTab('backtrack');
            setIsCopilotOpen(false);
          }
        };
      } else if (lower.includes('turmeric') || lower.includes('organic turmeric')) {
        botResponse = `**Organic Turmeric Powder (Product Code: YAT-SP-002)** scored **58/100 (Non-Compliant)** with 2 Critical Legal Metrology Violations:\n\n1. **MRP Missing Tax Statement (RULE-MRP-01 / Rule 6(1)(e))**: The package prints \`MRP Rs 65/-\` without the mandatory \`(Inclusive of all taxes)\` or \`(Incl. of all taxes)\` text.\n2. **Incomplete Customer Care Details (RULE-CARE-02 / Rule 6(1)(n))**: The helpline number \`080-4999\` is incomplete (7 digits) and no customer email address is printed.\n\n*Action Required*: Issue notice to manufacturer for immediate packaging revision.`;
        actionObj = {
          label: 'Inspect Turmeric Powder Evidence',
          onClick: () => {
            setSelectedProductId('prod-02');
            setCurrentTab('analysis_results');
            setIsCopilotOpen(false);
          }
        };
      } else if (lower.includes('prioritize') || lower.includes('violations') || lower.includes('fix first')) {
        botResponse = `### Priority Legal Metrology Action Queue:\n\n1. **Critical Violation: Missing Country of Origin on Natural Forest Honey (Product Code: YAT-HN-004)**.\n   *Legal Rule*: Rule 6(1)(j) mandate.\n   *Action*: Market distribution block & notice.\n\n2. **Critical Violation: MRP Tax Inclusivity & Short Helpline on Organic Turmeric (Product Code: YAT-SP-002)**.\n   *Legal Rule*: Rule 6(1)(e) & 6(1)(n).\n\n3. **Warning: Net Quantity Font Height on Classic Basmati Rice (Product Code: YAT-GR-003)**.\n   *Issue*: 5 kg bag font height is 2.8 mm; Schedule II mandates >= 4.0 mm.`;
        actionObj = {
          label: 'Open Violations Hub',
          onClick: () => {
            setCurrentTab('violations');
            setIsCopilotOpen(false);
          }
        };
      } else if (lower.includes('non-compliant') || lower.includes('high-risk') || lower.includes('risk products')) {
        const nonCompliant = products.filter((p: Product) => p.complianceScore < 70);
        botResponse = `Currently, **${nonCompliant.length} products** are categorized as **Non-Compliant (< 70 Compliance Score)**:\n\n` +
          nonCompliant.map((p: Product) => `• **${p.name}** (Score: ${p.complianceScore}/100) — ${p.issuesCount} rule violation(s) detected.`).join('\n') +
          `\n\nBoth products require correction notices.`;
        actionObj = {
          label: 'View Products with Violations',
          onClick: () => {
            setCurrentTab('products');
            setIsCopilotOpen(false);
          }
        };
      } else if (lower.includes('mrp') || lower.includes('tax clause') || lower.includes('inclusive') || lower.includes('rule 6')) {
        botResponse = `### Retail Price & Tax Text Rule (Rule 6(1)(e))\n\nUnder packaged product metrology standards:\n• Every pre-packaged product sold in stores must declare Maximum Retail Price followed immediately by **"(Inclusive of all taxes)"** or **"(Incl. of all taxes)"**.\n• Printing only \`MRP Rs 65/-\` without the inclusive tax phrase is a rule violation.\n• Recommended format: \`MRP ₹ [Amount] (INCL. OF ALL TAXES)\`.`;
      } else if (lower.includes('summary') || lower.includes('surveillance') || lower.includes('western zone')) {
        botResponse = `### Executive Inspection Summary: Western Zone (INS-2026-089)\n\n• **Facility**: Regional Wholesale Distribution Hub B4\n• **Inspected Products**: 14 items\n• **Pass Rate**: 78.6% (11 verified, 3 flagged)\n• **Average Score**: 84.6/100\n• **Key Finding**: Net quantity font size (Schedule II) and customer helpline contacts are the most frequent packaging errors.`;
        actionObj = {
          label: 'View Inspection Report',
          onClick: () => {
            setCurrentTab('reports');
            setIsCopilotOpen(false);
          }
        };
      } else {
        botResponse = `I analyzed your query across the product inspection records.\n\nAll mandatory packaging rules (Net Weight, MRP with Tax, Manufacturer Details, Date of Packing, Customer Helpline, and Country of Origin) are continuously verified by Yatarth AI.\n\nWould you like me to inspect a specific product label or show notice templates?`;
      }

      setMessages((prev) => [
        ...prev,
        {
          id: 'msg-' + Date.now(),
          sender: 'copilot',
          text: botResponse,
          timestamp: 'Just now',
          action: actionObj
        }
      ]);
      setIsTyping(false);
    }, 500);
  };

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-[480px] bg-white border-l border-slate-200 shadow-2xl flex flex-col animate-in slide-in-from-right duration-300 text-slate-900">
      {/* Header */}
      <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-teal-700 flex items-center justify-center shadow-xs">
            <Sparkles size={16} className="text-white font-bold" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-sm text-slate-900">Yatarth AI</h3>
              <span className="px-1.5 py-0.2 rounded text-[9px] font-mono font-bold bg-teal-100 text-teal-800 border border-teal-200">
                METROLOGY AI
              </span>
            </div>
            <p className="text-[11px] text-slate-500">Legal Metrology Inspection Assistant</p>
          </div>
        </div>

        <button
          onClick={() => setIsCopilotOpen(false)}
          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-800 hover:bg-slate-200/60 transition-colors"
        >
          <X size={17} />
        </button>
      </div>

      {/* Message Stream */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-50/50">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex gap-3 text-xs leading-relaxed ${
              m.sender === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            {m.sender === 'copilot' && (
              <div className="w-6 h-6 rounded-md bg-teal-100 border border-teal-200 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Bot size={14} className="text-teal-800" />
              </div>
            )}

            <div
              className={`max-w-[85%] rounded-2xl p-3.5 space-y-2.5 ${
                m.sender === 'user'
                  ? 'bg-teal-700 text-white rounded-br-none shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-800 rounded-bl-none shadow-xs'
              }`}
            >
              <div className="whitespace-pre-line prose prose-xs text-inherit">
                {m.text}
              </div>

              {m.action && (
                <button
                  onClick={m.action.onClick}
                  className="mt-2 w-full flex items-center justify-center gap-2 px-3 py-1.5 rounded-lg bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200 text-xs font-semibold transition-colors"
                >
                  <span>{m.action.label}</span>
                  <ArrowRight size={13} />
                </button>
              )}

              <div className={`text-[10px] font-mono text-right ${m.sender === 'user' ? 'text-teal-200' : 'text-slate-400'}`}>
                {m.timestamp}
              </div>
            </div>

            {m.sender === 'user' && (
              <div className="w-6 h-6 rounded-md bg-slate-200 flex items-center justify-center flex-shrink-0 mt-0.5">
                <User size={14} className="text-slate-700" />
              </div>
            )}
          </div>
        ))}

        {isTyping && (
          <div className="flex gap-3 text-xs justify-start">
            <div className="w-6 h-6 rounded-md bg-teal-100 border border-teal-200 flex items-center justify-center flex-shrink-0">
              <Bot size={14} className="text-teal-800" />
            </div>
            <div className="bg-white border border-slate-200 rounded-2xl p-3 rounded-bl-none flex items-center gap-1.5 shadow-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-teal-600 animate-bounce" />
              <span className="w-1.5 h-1.5 rounded-full bg-teal-600 animate-bounce [animation-delay:0.2s]" />
              <span className="w-1.5 h-1.5 rounded-full bg-teal-600 animate-bounce [animation-delay:0.4s]" />
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Prompt Chips */}
      <div className="px-4 py-2 border-t border-slate-200 bg-white">
        <div className="flex items-center gap-1.5 text-[11px] text-black font-black mb-2">
          <Lightbulb size={13} className="text-amber-600" />
          <span>Suggested Questions:</span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {quickPrompts.slice(0, 3).map((prompt, i) => (
            <button
              key={i}
              onClick={() => handleSend(prompt)}
              className="text-[11px] px-2.5 py-1 rounded-full bg-slate-100 border border-slate-300 text-black hover:text-teal-900 hover:border-teal-400 hover:bg-teal-50 transition-colors truncate max-w-full font-bold"
            >
              {prompt}
            </button>
          ))}
        </div>
      </div>

      {/* Input Form */}
      <div className="p-3 border-t border-slate-200 bg-white">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            placeholder="Ask about MRP text, net weight, customer care details..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-black font-bold placeholder-slate-500 focus:outline-none focus:border-teal-600 focus:bg-white"
          />
          <button
            type="submit"
            disabled={!input.trim()}
            className="p-2 rounded-xl bg-teal-700 hover:bg-teal-800 disabled:opacity-40 text-white transition-all font-bold"
          >
            <Send size={15} />
          </button>
        </form>
      </div>
    </div>
  );
};
