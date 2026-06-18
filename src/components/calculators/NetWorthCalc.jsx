import { useState, useMemo } from "react";
import { PieChart, Plus, Trash2 } from "lucide-react";

const FINANCIAL_TYPES = ["Mutual Funds","Fixed Deposit","PPF / EPF","Stocks / Equity","NPS","Bonds","Cash / Savings","Gold (Financial)","Other Financial"];
const PHYSICAL_TYPES  = ["Own Home","Second Property","Land","Gold (Physical)","Vehicle","Other Physical"];
const LIABILITY_TYPES = ["Home Loan","Car Loan","Personal Loan","Education Loan","Credit Card","Other Loan"];

function inr(n) { return "₹" + Math.round(n || 0).toLocaleString("en-IN"); }

function AssetRow({ row, index, onUpdate, onRemove, typeOptions, isFirst }) {
  return (
    <div className="grid grid-cols-[1fr_1.2fr_1fr_auto] gap-2 items-end">
      <div>
        {isFirst && <p className="text-[10px] text-[#6B7E99] mb-1">Category</p>}
        <select value={row.type} onChange={e => onUpdate("type", e.target.value)}
          className="w-full border border-[#D1DDE8] rounded-lg p-2 text-sm bg-white">
          {typeOptions.map(o => <option key={o}>{o}</option>)}
        </select>
      </div>
      <div>
        {isFirst && <p className="text-[10px] text-[#6B7E99] mb-1">Label</p>}
        <input type="text" placeholder="Description" value={row.label}
          onChange={e => onUpdate("label", e.target.value)}
          className="w-full border border-[#D1DDE8] rounded-lg p-2 text-sm" />
      </div>
      <div>
        {isFirst && <p className="text-[10px] text-[#6B7E99] mb-1">Value (₹)</p>}
        <div className="flex items-center border border-[#D1DDE8] rounded-lg focus-within:border-[#22568F]">
          <span className="pl-2 text-[#6B7E99] text-sm">₹</span>
          <input type="text" inputMode="numeric" value={row.value || ""}
            onChange={e => { const v = e.target.value; if (v === "" || /^\d*$/.test(v)) onUpdate("value", v === "" ? 0 : Number(v)); }}
            className="w-full bg-transparent outline-none p-2 pl-1 text-sm font-semibold" />
        </div>
      </div>
      <button onClick={onRemove} className="p-2 text-red-400 hover:text-red-600 transition-colors mb-0.5">
        <Trash2 size={14} />
      </button>
    </div>
  );
}

function Section({ title, rows, setRows, typeOptions, color }) {
  function update(i, field, val) { setRows(r => r.map((row, idx) => idx === i ? { ...row, [field]: val } : row)); }
  function add() { setRows(r => [...r, { type: typeOptions[0], label: "", value: 0 }]); }
  function remove(i) { setRows(r => r.filter((_, idx) => idx !== i)); }
  const total = rows.reduce((s, r) => s + Number(r.value || 0), 0);

  return (
    <div className="bg-white rounded-2xl border border-[#E2EBF5] p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-[#0D1B2E]">{title}</h3>
        <span className={`text-sm font-bold ${color}`}>{inr(total)}</span>
      </div>
      <div className="space-y-2">
        {rows.map((row, i) => (
          <AssetRow key={i} row={row} index={i}
            onUpdate={(f, v) => update(i, f, v)}
            onRemove={() => remove(i)}
            typeOptions={typeOptions}
            isFirst={i === 0}
          />
        ))}
      </div>
      <button onClick={add} className="flex items-center gap-1.5 text-sm text-[#22568F] hover:text-[#1a4070] font-medium mt-3">
        <Plus size={14} /> Add row
      </button>
    </div>
  );
}

export default function NetWorthCalc() {
  const [financial, setFinancial] = useState([{ type: "Mutual Funds", label: "", value: 0 }]);
  const [physical, setPhysical] = useState([{ type: "Own Home", label: "", value: 0 }]);
  const [liabilities, setLiabilities] = useState([{ type: "Home Loan", label: "", value: 0 }]);

  const totals = useMemo(() => {
    const fin  = financial.reduce((s, r) => s + Number(r.value || 0), 0);
    const phy  = physical.reduce((s, r) => s + Number(r.value || 0), 0);
    const liab = liabilities.reduce((s, r) => s + Number(r.value || 0), 0);
    return { fin, phy, totalAssets: fin + phy, liab, netWorth: fin + phy - liab };
  }, [financial, physical, liabilities]);

  return (
    <section className="bg-lightbg py-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-[#22568F]/10 rounded-xl flex items-center justify-center">
              <PieChart size={20} className="text-[#22568F]" />
            </div>
            <h1 className="font-playfair text-3xl font-bold text-[#0D1B2E]">Net Worth Calculator</h1>
          </div>
          <p className="text-[#6B7E99]">Add your assets and subtract liabilities to know exactly where you stand financially.</p>
        </div>

        {/* Net Worth Banner */}
        <div className={`rounded-2xl p-6 mb-6 flex flex-wrap gap-6 items-center ${totals.netWorth >= 0 ? "bg-green-50 border border-green-200" : "bg-red-50 border border-red-200"}`}>
          <div>
            <p className="text-xs text-[#6B7E99] mb-1">Total Assets</p>
            <p className="text-2xl font-bold text-[#22568F]">{inr(totals.totalAssets)}</p>
          </div>
          <div className="text-2xl text-[#6B7E99]">−</div>
          <div>
            <p className="text-xs text-[#6B7E99] mb-1">Total Liabilities</p>
            <p className="text-2xl font-bold text-red-600">{inr(totals.liab)}</p>
          </div>
          <div className="text-2xl text-[#6B7E99]">=</div>
          <div>
            <p className="text-xs text-[#6B7E99] mb-1">Your Net Worth</p>
            <p className={`text-3xl font-bold ${totals.netWorth >= 0 ? "text-green-700" : "text-red-600"}`}>{inr(totals.netWorth)}</p>
          </div>
          <div className="ml-auto text-right hidden sm:block">
            <p className="text-xs text-[#6B7E99]">Financial Assets</p>
            <p className="text-sm font-semibold text-[#22568F]">{inr(totals.fin)}</p>
            <p className="text-xs text-[#6B7E99] mt-1">Physical Assets</p>
            <p className="text-sm font-semibold text-[#22568F]">{inr(totals.phy)}</p>
          </div>
        </div>

        <div className="space-y-5">
          <Section title="Financial Assets" rows={financial} setRows={setFinancial} typeOptions={FINANCIAL_TYPES} color="text-[#22568F]" />
          <Section title="Physical Assets" rows={physical} setRows={setPhysical} typeOptions={PHYSICAL_TYPES} color="text-[#22568F]" />
          <Section title="Liabilities" rows={liabilities} setRows={setLiabilities} typeOptions={LIABILITY_TYPES} color="text-red-600" />
        </div>
      </div>
    </section>
  );
}
