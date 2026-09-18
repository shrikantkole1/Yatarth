import React, { useState } from 'react';
import {
  Scale, FileText, ArrowLeft, CheckCircle2, Upload, AlertTriangle,
  Building2, MapPin, ShoppingBag, DollarSign, Calendar, ShieldAlert,
  Info, Check, HelpCircle, PhoneCall
} from 'lucide-react';

interface ConsumerGrievanceFormViewProps {
  onBack: () => void;
  onGrievanceSubmitted: (complaintId: string) => void;
}

export const ConsumerGrievanceFormView: React.FC<ConsumerGrievanceFormViewProps> = ({
  onBack,
  onGrievanceSubmitted
}) => {
  // Form Field States (Mirroring the reference images)
  const [expectation, setExpectation] = useState<string>('Refund of Overcharged Amount');
  const [registeredWithCompany, setRegisteredWithCompany] = useState<string>('Yes');
  const [companyComplaintNo, setCompanyComplaintNo] = useState<string>('R145080');
  const [grievanceType, setGrievanceType] = useState<string>('Grievance');
  const [grievanceClassification, setGrievanceClassification] = useState<string>('Goods (Packaged Commodities)');
  const [stateName, setStateName] = useState<string>('RAJASTHAN');
  const [purchaseCity, setPurchaseCity] = useState<string>('Jaipur');
  const [sectorIndustry, setSectorIndustry] = useState<string>('E-Commerce');
  const [category, setCategory] = useState<string>('Online Shopping');
  const [companyName, setCompanyName] = useState<string>('Flipkart.com (Flipkart Internet Private Limited)');
  const [productServiceType, setProductServiceType] = useState<string>('Packaged Dry Fruits & Beverages');
  const [orderNumber, setOrderNumber] = useState<string>('OD3289041289410');
  const [transactionId, setTransactionId] = useState<string>('TXN-88219410');
  const [dateOfPurchase, setDateOfPurchase] = useState<string>('2026-09-15');
  const [registeredContact, setRegisteredContact] = useState<string>('9876543210 / consumer@yatarth.ai');
  const [amountPaid, setAmountPaid] = useState<string>('65.00');
  const [productValue, setProductValue] = useState<string>('50.00');
  const [natureOfGrievance, setNatureOfGrievance] = useState<string>('Charging More than MRP');
  const [dealerInfo, setDealerInfo] = useState<string>('Super Retail Hub, C-Scheme, Jaipur, Rajasthan - 302001 | care@superretail.in');
  const [grievanceDetails, setGrievanceDetails] = useState<string>(
    'The packaged beverage was billed at ₹65.00 against the declared Maximum Retail Price of ₹50.00 printed on the label. The retailer refused to sell at the printed MRP citing extra refrigeration/cooling charges. Furthermore, mandatory Unit Sale Price under Rule 6(11) is completely missing from the product outer packaging.'
  );

  const [doc1Name, setDoc1Name] = useState<string>('Product_Label_Front_Back.jpg');
  const [doc2Name, setDoc2Name] = useState<string>('Tax_Invoice_Bill_Receipt.pdf');
  const [doc3Name, setDoc3Name] = useState<string>('Shelf_Price_Tag_Display.jpg');
  const [declarationChecked, setDeclarationChecked] = useState<boolean>(true);
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [generatedId, setGeneratedId] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!declarationChecked) {
      alert('Please accept the declaration before submitting.');
      return;
    }
    const newId = 'LMPC-2026-' + Math.floor(1000 + Math.random() * 9000);
    setGeneratedId(newId);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6">
        <div className="bg-white rounded-3xl border border-emerald-200 p-8 shadow-xl text-center space-y-6">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto shadow-inner">
            <CheckCircle2 size={36} />
          </div>

          <div className="space-y-2">
            <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-mono font-black uppercase">
              STATUTORY GRIEVANCE LODGED
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
              Grievance Registered Successfully!
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 max-w-lg mx-auto">
              Your report under the Legal Metrology Act, 2009 has been assigned to the State Metrology Inspection Cell.
            </p>
          </div>

          {/* Reference Card */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 max-w-md mx-auto text-left space-y-3 font-mono text-xs">
            <div className="flex justify-between border-b border-slate-200 pb-2">
              <span className="text-slate-500 font-bold">CASE REFERENCE NO:</span>
              <span className="text-blue-900 font-black text-sm">{generatedId}</span>
            </div>
            <div className="flex justify-between border-b border-slate-200 pb-2">
              <span className="text-slate-500 font-bold">COMMODITY:</span>
              <span className="text-slate-800 font-semibold">{productServiceType}</span>
            </div>
            <div className="flex justify-between border-b border-slate-200 pb-2">
              <span className="text-slate-500 font-bold">ALLEGED OFFENCE:</span>
              <span className="text-rose-700 font-black">{natureOfGrievance}</span>
            </div>
            <div className="flex justify-between pb-1">
              <span className="text-slate-500 font-bold">ASSIGNED CONTROLLER:</span>
              <span className="text-slate-800">Jaipur District Metrology Zone</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={() => onGrievanceSubmitted(generatedId)}
              className="px-6 py-3 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-black text-xs shadow-md transition-all cursor-pointer"
            >
              Track Live 4-Stage Redressal Status
            </button>

            <button
              onClick={onBack}
              className="px-5 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-all cursor-pointer"
            >
              Return to Portal Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 sm:px-6">
      
      {/* Top Breadcrumb & Back button */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-xs font-bold text-blue-900 hover:text-blue-700 bg-white border border-slate-200 px-3.5 py-2 rounded-xl shadow-2xs hover:bg-slate-50 transition-all cursor-pointer"
        >
          <ArrowLeft size={14} />
          <span>Back to Legal Metrology Portal</span>
        </button>

        <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 font-mono">
          <span>Toll-Free Helpline:</span>
          <span className="font-bold text-blue-900 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">1915</span>
        </div>
      </div>

      {/* Main Form Container (Styled exactly like NCH Reference Images) */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
        
        {/* Form Header Banner */}
        <div className="bg-gradient-to-r from-[#1e2768] via-[#283593] to-[#1a237e] text-white p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-amber-400 text-xs font-mono font-bold uppercase tracking-wider mb-1">
                <Scale size={16} />
                <span>Legal Metrology (LMR 2011) Consumer Protection</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                Grievance Registration Form
              </h1>
              <p className="text-xs sm:text-sm text-blue-200 mt-1 max-w-xl">
                Official statutory filing for overcharging above MRP, missing mandatory packaging declarations, underweight packets, or blurred expiry dates.
              </p>
            </div>

            <div className="hidden sm:block text-right">
              <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 font-mono text-[11px] font-bold border border-emerald-400/30 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>CITIZEN DIRECT ACCESS • FORM PCR-2011</span>
              </span>
            </div>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6 text-xs text-slate-800">
          
          {/* Row 1: Expectation & Registered with company? */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            <div>
              <label className="font-bold text-slate-800 block mb-1.5">
                What is your expectation related to your grievance ? <span className="text-red-600">*</span>
              </label>
              <select
                value={expectation}
                onChange={(e) => setExpectation(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:outline-none focus:border-blue-600 font-semibold"
                required
              >
                <option>Refund of Overcharged Amount</option>
                <option>Replacement of Non-Standard Package</option>
                <option>Statutory Seizure & Legal Action under Section 36</option>
                <option>Compensation for Deceptive Underweight Package</option>
                <option>Feedback & Compliance Warning to Manufacturer</option>
              </select>
            </div>

            <div>
              <label className="font-bold text-slate-800 block mb-1.5">
                Have you registered your grievance with the company / retailer ? <span className="text-red-600">*</span>
              </label>
              <select
                value={registeredWithCompany}
                onChange={(e) => setRegisteredWithCompany(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:outline-none focus:border-blue-600 font-semibold"
                required
              >
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
            </div>

          </div>

          {/* Conditional Complaint Number from Company */}
          {registeredWithCompany === 'Yes' && (
            <div>
              <label className="font-bold text-slate-800 block mb-1.5">
                Please Share the Merchant / Company Complaint no <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                value={companyComplaintNo}
                onChange={(e) => setCompanyComplaintNo(e.target.value)}
                placeholder="e.g. R145080 or TKT-99201"
                className="w-full p-2.5 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:outline-none focus:border-blue-600 font-mono font-semibold"
                required
              />
            </div>
          )}

          {/* Row 2: Grievance Type, Grievance Classification, State */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="font-bold text-slate-800 block mb-1.5">
                Grievance Type <span className="text-red-600">*</span>
              </label>
              <select
                value={grievanceType}
                onChange={(e) => setGrievanceType(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:outline-none focus:border-blue-600 font-semibold"
                required
              >
                <option>Grievance</option>
                <option>Statutory Non-Compliance Alert</option>
                <option>Deceptive Packaging Report</option>
              </select>
            </div>

            <div>
              <label className="font-bold text-slate-800 block mb-1.5">
                Grievance Classification <span className="text-red-600">*</span>
              </label>
              <select
                value={grievanceClassification}
                onChange={(e) => setGrievanceClassification(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:outline-none focus:border-blue-600 font-semibold"
                required
              >
                <option>Goods (Packaged Commodities)</option>
                <option>Retail Merchant Weighing & Scale</option>
                <option>E-Commerce Packaging & Label</option>
              </select>
            </div>

            <div>
              <label className="font-bold text-slate-800 block mb-1.5">
                State <span className="text-red-600">*</span>
              </label>
              <select
                value={stateName}
                onChange={(e) => setStateName(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:outline-none focus:border-blue-600 font-semibold"
                required
              >
                <option>RAJASTHAN</option>
                <option>MAHARASHTRA</option>
                <option>DELHI NCR</option>
                <option>KARNATAKA</option>
                <option>GUJARAT</option>
                <option>UTTAR PRADESH</option>
                <option>TAMIL NADU</option>
                <option>WEST BENGAL</option>
              </select>
            </div>
          </div>

          {/* Row 3: Purchase City, Sector/Industry */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="font-bold text-slate-800 block mb-1.5">
                Purchase City <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                value={purchaseCity}
                onChange={(e) => setPurchaseCity(e.target.value)}
                placeholder="e.g. Jaipur, Mumbai, Bengaluru"
                className="w-full p-2.5 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:outline-none focus:border-blue-600 font-semibold"
                required
              />
            </div>

            <div>
              <label className="font-bold text-slate-800 block mb-1.5">
                Sector / Industry <span className="text-red-600">*</span>
              </label>
              <select
                value={sectorIndustry}
                onChange={(e) => setSectorIndustry(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:outline-none focus:border-blue-600 font-semibold"
                required
              >
                <option>E-Commerce / Online Delivery</option>
                <option>Supermarket / Modern Retail</option>
                <option>FMCG Packaged Foods</option>
                <option>Beverages & Edible Oils</option>
                <option>Consumer Electronics & Appliances</option>
                <option>Personal Care & Cosmetics</option>
              </select>
            </div>
          </div>

          {/* Row 4: Category & Company */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="font-bold text-slate-800 block mb-1.5">
                Category <span className="text-red-600">*</span>
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:outline-none focus:border-blue-600 font-semibold"
                required
              >
                <option>Online Shopping</option>
                <option>Packaged Grocery & Snacks</option>
                <option>Cold Drinks & Mineral Water</option>
                <option>Edible Grains & Staples</option>
                <option>Pharmaceutical / Healthcare Package</option>
              </select>
            </div>

            <div>
              <label className="font-bold text-slate-800 block mb-1.5">
                Company / Brand Name <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="e.g. Flipkart.com / D-Mart / PepsiCo India"
                className="w-full p-2.5 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:outline-none focus:border-blue-600 font-semibold"
                required
              />
            </div>
          </div>

          {/* Row 5: Product/Service Type & Order Number */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="font-bold text-slate-800 block mb-1.5">
                Product / Commodity Name <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                value={productServiceType}
                onChange={(e) => setProductServiceType(e.target.value)}
                placeholder="e.g. Sparkling Lemonade 600ml / Almond Cookies 250g"
                className="w-full p-2.5 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:outline-none focus:border-blue-600 font-semibold"
                required
              />
            </div>

            <div>
              <label className="font-bold text-slate-800 block mb-1.5">
                Order / Bill / Invoice Number <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                value={orderNumber}
                onChange={(e) => setOrderNumber(e.target.value)}
                placeholder="e.g. OD3289041289410 or INV-2026-904"
                className="w-full p-2.5 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:outline-none focus:border-blue-600 font-mono font-semibold"
                required
              />
            </div>
          </div>

          {/* Row 6: Transaction ID & Date of Purchase */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="font-bold text-slate-800 block mb-1.5">
                Transaction ID / Barcode Number <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                value={transactionId}
                onChange={(e) => setTransactionId(e.target.value)}
                placeholder="e.g. TXN-88219410 or EAN 8901491101824"
                className="w-full p-2.5 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:outline-none focus:border-blue-600 font-mono font-semibold"
                required
              />
            </div>

            <div>
              <label className="font-bold text-slate-800 block mb-1.5">
                Date of Purchase / Transaction <span className="text-red-600">*</span>
              </label>
              <input
                type="date"
                value={dateOfPurchase}
                onChange={(e) => setDateOfPurchase(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:outline-none focus:border-blue-600 font-semibold"
                required
              />
            </div>
          </div>

          {/* Row 7: Amount Paid vs Printed MRP (Legal Metrology Core) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-blue-50/60 p-4 rounded-2xl border border-blue-100">
            <div>
              <label className="font-bold text-slate-800 block mb-1.5">
                Amount Paid by Consumer (₹) <span className="text-red-600">*</span>
              </label>
              <input
                type="number"
                step="0.01"
                value={amountPaid}
                onChange={(e) => setAmountPaid(e.target.value)}
                placeholder="65.00"
                className="w-full p-2.5 rounded-xl border border-slate-300 bg-white font-mono font-bold text-red-600"
                required
              />
            </div>

            <div>
              <label className="font-bold text-slate-800 block mb-1.5">
                Declared MRP on Product (₹) <span className="text-red-600">*</span>
              </label>
              <input
                type="number"
                step="0.01"
                value={productValue}
                onChange={(e) => setProductValue(e.target.value)}
                placeholder="50.00"
                className="w-full p-2.5 rounded-xl border border-slate-300 bg-white font-mono font-bold text-emerald-700"
                required
              />
            </div>

            <div>
              <label className="font-bold text-slate-800 block mb-1.5">
                Overcharge Differential:
              </label>
              <div className="p-2.5 rounded-xl bg-white border border-slate-200 font-mono font-black text-rose-700 text-sm flex items-center justify-between">
                <span>₹ {(parseFloat(amountPaid || '0') - parseFloat(productValue || '0')).toFixed(2)}</span>
                <span className="text-[10px] uppercase font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                  VIOLATION
                </span>
              </div>
            </div>
          </div>

          {/* Row 8: Nature of Grievance (Matching Reference Image 4) */}
          <div>
            <label className="font-bold text-slate-800 block mb-1.5">
              Nature of Grievance <span className="text-red-600">*</span>
            </label>
            <select
              value={natureOfGrievance}
              onChange={(e) => setNatureOfGrievance(e.target.value)}
              className="w-full p-3 rounded-xl border-2 border-blue-600 bg-blue-50/30 text-xs font-bold text-blue-950 focus:outline-none focus:bg-white"
              required
            >
              <option value="Charging More than MRP">Charging More than MRP (Overcharging / Cooling Charges / Sticker MRP)</option>
              <option value="Missing Mandatory Declarations">Missing Mandatory Declarations under Rule 6 (Mfg Date, Customer Care, Address)</option>
              <option value="Missing Unit Sale Price">Missing Unit Sale Price (USP) per 100g/ml under Rule 6(11)</option>
              <option value="Net Quantity Shortfall">Net Quantity Shortfall / Underweight Package under Rule 7</option>
              <option value="Blurred Font Height">Blurred / Illegible Font Height (&lt; 2.0mm) under Rule 7 Table I</option>
              <option value="Bill / Invoice Copy Not Provided">Bill / Invoice Copy Not Provided by Merchant</option>
              <option value="Selling Expired Goods">Selling Expired Packaged Commodity on Shelf</option>
            </select>
          </div>

          {/* Row 9: Dealer Name / Address / email */}
          <div>
            <label className="font-bold text-slate-800 block mb-1.5">
              Dealer Name / Address / email / Contact no (For improving the chance of redressal)
            </label>
            <input
              type="text"
              value={dealerInfo}
              onChange={(e) => setDealerInfo(e.target.value)}
              placeholder="e.g. Super Retail Hub, C-Scheme, Jaipur, Rajasthan - 302001"
              className="w-full p-2.5 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:outline-none focus:border-blue-600 font-medium"
            />
          </div>

          {/* Row 10: Grievance Details */}
          <div>
            <label className="font-bold text-slate-800 block mb-1.5">
              Grievance Details <span className="text-red-600">*</span>
            </label>
            <textarea
              rows={4}
              value={grievanceDetails}
              onChange={(e) => setGrievanceDetails(e.target.value)}
              placeholder="Please provide specific facts regarding the packaging non-compliance, overcharge, or date issues..."
              className="w-full p-3 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:outline-none focus:border-blue-600 font-medium text-xs leading-relaxed"
              required
            ></textarea>
          </div>

          {/* Row 11: Document Upload Slots (Matches Reference Image 5) */}
          <div className="space-y-3 pt-2 border-t border-slate-200">
            <p className="font-bold text-slate-900 text-xs">
              Upload Supporting Documents & Photos (Max 3 files):
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              
              {/* Doc 1 */}
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <span className="font-bold text-slate-800 block text-[11px]">
                  Document 1 (Product / Label Photo)
                </span>
                <div className="flex items-center justify-between bg-white p-2 rounded-lg border border-slate-300 text-[11px]">
                  <span className="truncate max-w-[160px] text-slate-600 font-mono">{doc1Name}</span>
                  <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">ATTACHED</span>
                </div>
                <p className="text-[10px] text-slate-400">
                  (only jpg, jpeg, png, doc or pdf allowed up to 5MB)
                </p>
              </div>

              {/* Doc 2 */}
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <span className="font-bold text-slate-800 block text-[11px]">
                  Document 2 (Purchase Receipt / Tax Invoice)
                </span>
                <div className="flex items-center justify-between bg-white p-2 rounded-lg border border-slate-300 text-[11px]">
                  <span className="truncate max-w-[160px] text-slate-600 font-mono">{doc2Name}</span>
                  <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">ATTACHED</span>
                </div>
                <p className="text-[10px] text-slate-400">
                  (only jpg, jpeg, png, doc or pdf allowed up to 5MB)
                </p>
              </div>

              {/* Doc 3 */}
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <span className="font-bold text-slate-800 block text-[11px]">
                  Document 3 (Barcode / Shelf Price Tag)
                </span>
                <div className="flex items-center justify-between bg-white p-2 rounded-lg border border-slate-300 text-[11px]">
                  <span className="truncate max-w-[160px] text-slate-600 font-mono">{doc3Name}</span>
                  <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">ATTACHED</span>
                </div>
                <p className="text-[10px] text-slate-400">
                  (only jpg, jpeg, png, doc or pdf allowed up to 5MB)
                </p>
              </div>

            </div>
          </div>

          {/* Declaration Statement (Matches Reference Image 5) */}
          <div className="pt-2 flex items-start gap-2.5">
            <input
              type="checkbox"
              id="declaration"
              checked={declarationChecked}
              onChange={(e) => setDeclarationChecked(e.target.checked)}
              className="mt-0.5 w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500 cursor-pointer"
            />
            <label htmlFor="declaration" className="text-xs font-semibold text-slate-700 cursor-pointer select-none">
              I hereby state that the facts mentioned above are true to the best of my knowledge and belief.
            </label>
          </div>

          {/* Submit Button */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
            <button
              type="button"
              onClick={onBack}
              className="px-5 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs cursor-pointer transition-colors"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-8 py-3.5 rounded-xl bg-[#0080ff] hover:bg-[#0070e0] text-white font-black text-xs shadow-lg transition-all active:scale-98 cursor-pointer tracking-wider uppercase"
            >
              Submit
            </button>
          </div>

        </form>

      </div>

    </div>
  );
};