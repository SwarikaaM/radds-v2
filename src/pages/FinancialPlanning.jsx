import { useState, useEffect, useCallback } from "react";
import { Download, FileText, BarChart2, Plus, Trash2, ChevronDown, ChevronUp, Save, CheckCircle } from "lucide-react";
import { exportXLSX } from "../utils/fpExport";
import { exportPDF } from "../utils/fpExportPdf";
import { useNavigate } from "react-router-dom";

const STORAGE_KEY = "radds_fp_data";

const DISCLAIMER = "Mutual Fund investments are subject to market risks. Read all scheme related documents carefully. Past performance is not indicative of future returns. This report is for planning purposes only and does not constitute investment advice. Radds Capital is an AMFI-Registered Mutual Fund Distributor (ARN-334716 | ARN-292158 | ARN-124053).";

function createDefault() {
  return {
    name: "",
    email: "",
    phone: "",
    age: "",
    riskPreference: "moderate",
    salary: 0,
    salary2: 0,
    otherIncome: 0,
    householdExp: 0,
    rent: 0,
    emi: 0,
    healthInsurance: 0,
    insurance: 0,
    bills: 0,
    schoolFees: 0,
    fuel: 0,
    personal: 0,
    existingSip: 0,
    addExpenses: 0,
    children: [],
  };
}

// ── Numeric Input ──────────────────────────────────────────────────────
function NumInput({ value, onChange, placeholder = "0", prefix = "₹" }) {
  const [raw, setRaw] = useState(value === 0 ? "" : String(value));
  useEffect(() => { setRaw(value === 0 ? "" : String(value)); }, [value]);

  return (
    <div className="flex items-center border border-[#D1DDE8] rounded-lg bg-white focus-within:border-[#22568F] focus-within:shadow-[0_0_0_3px_rgba(34,86,143,0.08)] transition-all">
      <span className="pl-3 text-[#6B7E99] text-sm select-none">{prefix}</span>
      <input
        type="text" inputMode="numeric" value={raw} placeholder={placeholder}
        onChange={e => {
          const v = e.target.value;
          if (v === "" || /^\d*$/.test(v)) { setRaw(v); onChange(v === "" ? 0 : Number(v)); }
        }}
        onFocus={e => { if (e.target.value === "0") setRaw(""); }}
        className="w-full bg-transparent outline-none p-3 pl-1.5 text-sm font-semibold text-[#0D1B2E]"
      />
    </div>
  );
}

// ── Collapsible section ────────────────────────────────────────────────
function Section({ title, defaultOpen = false, children, badge }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="rounded-xl border border-[#E2EBF5] bg-white overflow-hidden">
      <button onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-6 py-4 hover:bg-[#F8FAFC] transition-colors">
        <div className="flex items-center gap-3">
          <h2 className="font-semibold text-[#0D1B2E]">{title}</h2>
          {badge && <span className="text-xs bg-[#22568F]/10 text-[#22568F] px-2 py-0.5 rounded-full font-medium">{badge}</span>}
        </div>
        {open ? <ChevronUp size={18} className="text-[#6B7E99]" /> : <ChevronDown size={18} className="text-[#6B7E99]" />}
      </button>
      {open && <div className="px-6 pb-6 border-t border-[#E2EBF5]">{children}</div>}
    </div>
  );
}

// ── Field wrapper ──────────────────────────────────────────────────────
function Field({ label, children }) {
  return (
    <div>
      <label className="block mb-1.5 text-sm font-medium text-[#3D4F66]">{label}</label>
      {children}
    </div>
  );
}

function TextInput({ value, onChange, placeholder, type = "text" }) {
  return (
    <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
      className="w-full border border-[#D1DDE8] rounded-lg p-3 text-sm outline-none focus:border-[#22568F] focus:shadow-[0_0_0_3px_rgba(34,86,143,0.08)] transition-all" />
  );
}

export default function FinancialPlanning() {
  const [data, setData] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? { ...createDefault(), ...JSON.parse(saved) } : createDefault();
    } catch { return createDefault(); }
  });
  const [saved, setSaved] = useState(false);
  const [exporting, setExporting] = useState(null); // "xlsx" | "pdf" | null
  const navigate = useNavigate();

  const set = useCallback((field, value) => {
    setData(d => ({ ...d, [field]: value }));
    setSaved(false);
  }, []);

  function saveToStorage() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  // Auto-save on change with debounce
  useEffect(() => {
    const t = setTimeout(() => localStorage.setItem(STORAGE_KEY, JSON.stringify(data)), 1000);
    return () => clearTimeout(t);
  }, [data]);

  const totalIncome = data.salary + data.salary2 + data.otherIncome;
  const expenseFields = ["householdExp","rent","emi","healthInsurance","insurance","bills","schoolFees","fuel","personal","existingSip","addExpenses"];
  const childrenTotal = data.children.reduce((s, c) =>
    s + (c.education||0) + (c.allowance||0) + (c.holiday||0) + (c.medical||0), 0);
  const totalExpenses = expenseFields.reduce((s, k) => s + (data[k] || 0), 0) + childrenTotal;
  const balance = totalIncome - totalExpenses;

  // Children helpers
  function addChild() {
    setData(d => ({ ...d, children: [...d.children, { name: "", age: "", education: 0, allowance: 0, holiday: 0, medical: 0 }] }));
  }
  function updateChild(i, field, value) {
    setData(d => ({ ...d, children: d.children.map((c, idx) => idx === i ? { ...c, [field]: value } : c) }));
  }
  function removeChild(i) {
    setData(d => ({ ...d, children: d.children.filter((_, idx) => idx !== i) }));
  }

  async function handleExport(type) {
    setExporting(type);
    try {
      if (type === "xlsx") await exportXLSX(data);
      else await exportPDF(data);
    } catch (e) {
      console.error("Export error", e);
      alert("Export failed. Please try again.");
    } finally {
      setExporting(null);
    }
  }

  const expenseLabels = {
    householdExp: "Household Expenses", rent: "Rent", emi: "EMI",
    healthInsurance: "Health Insurance", insurance: "Insurance", bills: "Bills",
    schoolFees: "School Fees", fuel: "Fuel", personal: "Personal",
    existingSip: "Existing SIP", addExpenses: "Additional Expenses",
  };

  return (
    <div className="min-h-screen bg-[#F4F8FC] pt-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-sm text-[#6B7E99] hover:text-[#22568F] transition-colors mb-2"
            >
              ← Back
            </button>
          </div>
      {/* Header */}
      <div className="bg-[#22568F] text-white py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="flex items-center gap-3 mb-3">
            <BarChart2 size={28} className="text-accent" />
            <h1 className="font-playfair text-3xl md:text-4xl font-bold">Goal & Budget Planner</h1>
          </div>
          <p className="text-white/70 text-base max-w-xl">
            Fill in your income and expenses below. Your data is saved locally on your device. Export a personalised Excel or PDF report instantly — no login required.
          </p>
          <div className="flex flex-wrap gap-3 mt-6">
            <button onClick={() => handleExport("xlsx")} disabled={!!exporting}
              className="flex items-center gap-2 bg-white text-[#22568F] font-semibold px-5 py-2.5 rounded-lg hover:bg-accent hover:text-white transition-colors text-sm disabled:opacity-60">
              <Download size={16} />
              {exporting === "xlsx" ? "Generating..." : "Download Excel"}
            </button>
            <button onClick={() => handleExport("pdf")} disabled={!!exporting}
              className="flex items-center gap-2 bg-white/15 border border-white/30 text-white font-semibold px-5 py-2.5 rounded-lg hover:bg-white/25 transition-colors text-sm disabled:opacity-60">
              <FileText size={16} />
              {exporting === "pdf" ? "Generating..." : "Download PDF"}
            </button>
            <button onClick={saveToStorage}
              className="flex items-center gap-2 bg-white/10 border border-white/20 text-white/80 px-4 py-2.5 rounded-lg hover:bg-white/15 transition-colors text-sm ml-auto">
              {saved ? <><CheckCircle size={15} className="text-green-400" /> Saved</> : <><Save size={15} /> Save</>}
            </button>
          </div>
        </div>
      </div>

      {/* Summary Banner */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 -mt-4">
        <div className="bg-white rounded-2xl border border-[#E2EBF5] shadow-sm p-5 grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Monthly Income", value: totalIncome, color: "text-[#22568F]" },
            { label: "Monthly Expenses", value: totalExpenses, color: "text-red-600" },
            { label: "Investment Capacity", value: Math.max(0, balance), color: "text-green-600" },
            { label: "Balance", value: balance, color: balance >= 0 ? "text-green-600" : "text-red-600" },
          ].map(c => (
            <div key={c.label} className="text-center">
              <p className="text-xs text-[#6B7E99] mb-1">{c.label}</p>
              <p className={`text-xl font-bold ${c.color}`}>₹{Math.abs(c.value).toLocaleString("en-IN")}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Form */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-4">

        {/* Personal Details */}
        <Section title="Personal Details" defaultOpen>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-5">
            <Field label="Full Name">
              <TextInput value={data.name} onChange={v => set("name", v)} placeholder="Your name" />
            </Field>
            <Field label="Email">
              <TextInput value={data.email} onChange={v => set("email", v)} placeholder="email@example.com" type="email" />
            </Field>
            <Field label="Phone">
              <TextInput value={data.phone} onChange={v => set("phone", v.replace(/\D/g,"").slice(0,10))} placeholder="9876543210" />
            </Field>
            <Field label="Age">
              <TextInput value={data.age} onChange={v => set("age", v)} placeholder="35" />
            </Field>
            <Field label="Risk Preference">
              <select value={data.riskPreference} onChange={e => set("riskPreference", e.target.value)}
                className="w-full border border-[#D1DDE8] rounded-lg p-3 text-sm bg-white outline-none focus:border-[#22568F]">
                <option value="conservative">Conservative</option>
                <option value="moderate">Moderate</option>
                <option value="aggressive">Aggressive</option>
              </select>
            </Field>
          </div>
        </Section>

        {/* Income */}
        <Section title="Monthly Income" defaultOpen badge={`₹${totalIncome.toLocaleString("en-IN")}/mo`}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-5">
            <Field label="Salary"><NumInput value={data.salary} onChange={v => set("salary", v)} /></Field>
            <Field label="Spouse / Secondary Salary"><NumInput value={data.salary2} onChange={v => set("salary2", v)} /></Field>
            <Field label="Other Income"><NumInput value={data.otherIncome} onChange={v => set("otherIncome", v)} /></Field>
          </div>
        </Section>

        {/* Expenses */}
        <Section title="Monthly Expenses" badge={`₹${totalExpenses.toLocaleString("en-IN")}/mo`}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-5">
            {expenseFields.map(k => (
              <Field key={k} label={expenseLabels[k]}>
                <NumInput value={data[k] || 0} onChange={v => set(k, v)} />
              </Field>
            ))}
          </div>
        </Section>

        {/* Children */}
        <Section title="Children Expenses" badge={data.children.length > 0 ? `${data.children.length} child${data.children.length > 1 ? "ren" : ""}` : undefined}>
          <div className="pt-5 space-y-6">
            {data.children.map((child, i) => {
              const childTotal = (child.education||0)+(child.allowance||0)+(child.holiday||0)+(child.medical||0);
              return (
                <div key={i} className="border border-[#E2EBF5] rounded-xl p-4">
                  <div className="flex items-center justify-between mb-4">
                    <p className="font-medium text-[#0D1B2E]">Child {i + 1}</p>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-[#22568F] font-semibold">₹{childTotal.toLocaleString("en-IN")}/mo</span>
                      <button onClick={() => removeChild(i)} className="text-red-400 hover:text-red-600"><Trash2 size={14} /></button>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    <Field label="Name">
                      <TextInput value={child.name} onChange={v => updateChild(i, "name", v)} placeholder="Child name" />
                    </Field>
                    <Field label="Age">
                      <TextInput value={child.age} onChange={v => updateChild(i, "age", v)} placeholder="12" />
                    </Field>
                    <Field label="Education"><NumInput value={child.education||0} onChange={v => updateChild(i,"education",v)} /></Field>
                    <Field label="Allowance"><NumInput value={child.allowance||0} onChange={v => updateChild(i,"allowance",v)} /></Field>
                    <Field label="Holiday"><NumInput value={child.holiday||0} onChange={v => updateChild(i,"holiday",v)} /></Field>
                    <Field label="Medical"><NumInput value={child.medical||0} onChange={v => updateChild(i,"medical",v)} /></Field>
                  </div>
                </div>
              );
            })}
            <button onClick={addChild}
              className="flex items-center gap-2 text-sm text-[#22568F] hover:text-[#1a4070] font-medium">
              <Plus size={14} /> Add Child
            </button>
          </div>
        </Section>

        {/* Export again at bottom */}
        <div className="bg-white rounded-2xl border border-[#E2EBF5] p-6">
          <h3 className="font-semibold text-[#0D1B2E] mb-2">Export Your Budget Plan</h3>
          <p className="text-sm text-[#6B7E99] mb-4">Your report includes a 12-month budget planning sheet with income, expenses, and investment capacity breakdown.</p>
          <div className="flex flex-wrap gap-3">
            <button onClick={() => handleExport("xlsx")} disabled={!!exporting}
              className="flex items-center gap-2 bg-[#22568F] text-white font-semibold px-5 py-2.5 rounded-lg hover:bg-[#1a4070] transition-colors text-sm disabled:opacity-60">
              <Download size={16} />
              {exporting === "xlsx" ? "Generating..." : "Download Excel (.xlsx)"}
            </button>
            <button onClick={() => handleExport("pdf")} disabled={!!exporting}
              className="flex items-center gap-2 border border-[#22568F] text-[#22568F] font-semibold px-5 py-2.5 rounded-lg hover:bg-[#22568F] hover:text-white transition-colors text-sm disabled:opacity-60">
              <FileText size={16} />
              {exporting === "pdf" ? "Generating..." : "Download PDF Report"}
            </button>
          </div>
        </div>

        {/* Disclaimer */}
        <p className="text-[10px] text-[#6B7E99] leading-relaxed pb-6">{DISCLAIMER}</p>
      </div>
    </div>
  );
}
