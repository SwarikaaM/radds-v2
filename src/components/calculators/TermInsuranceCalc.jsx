import { useState, useMemo } from "react";
import { Shield, AlertCircle } from "lucide-react";

function NumInput({ label, value, onChange, prefix = "₹", suffix = "" }) {
  const [raw, setRaw] = useState(value === 0 ? "" : String(value));
  return (
    <div>
      <label className="block text-sm font-medium text-[#3D4F66] mb-1.5">{label}</label>
      <div className="flex items-center border border-[#D1DDE8] rounded-lg bg-white focus-within:border-[#22568F] focus-within:shadow-[0_0_0_3px_rgba(34,86,143,0.08)]">
        {prefix && <span className="pl-3 text-[#6B7E99] text-sm">{prefix}</span>}
        <input
          type="text" inputMode="numeric" value={raw}
          onChange={e => { const v = e.target.value; if (v === "" || /^\d*\.?\d*$/.test(v)) { setRaw(v); onChange(v === "" ? 0 : Number(v)); } }}
          onFocus={e => { if (e.target.value === "0") setRaw(""); }}
          className="w-full bg-transparent outline-none p-3 pl-1.5 text-sm font-semibold text-[#0D1B2E]"
        />
        {suffix && <span className="pr-3 text-[#6B7E99] text-sm">{suffix}</span>}
      </div>
    </div>
  );
}

function inr(n) { return "₹" + Math.round(n || 0).toLocaleString("en-IN"); }

export default function TermInsuranceCalc() {
  const [premium, setPremium] = useState(15000);
  const [sipAmt, setSipAmt] = useState(1500);
  const [tenure, setTenure] = useState(20);
  const [growthRate, setGrowthRate] = useState(12);

  const calc = useMemo(() => {
    const rate = growthRate / 100;
    let corpus = 0;
    const rows = [];
    for (let yr = 1; yr <= tenure; yr++) {
      const annSip = sipAmt * 12;
      const growth = (corpus + annSip) * rate;
      const open = corpus;
      corpus = corpus + annSip + growth;
      rows.push({ yr, premium, open, annSip, growth, close: corpus });
    }
    const totalPremiums = premium * tenure;
    const totalSipInvested = sipAmt * 12 * tenure;
    const net = corpus - totalPremiums;
    return { rows, corpus, totalPremiums, totalSipInvested, net };
  }, [premium, sipAmt, tenure, growthRate]);

  return (
    <section className="bg-lightbg py-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-[#22568F]/10 rounded-xl flex items-center justify-center">
              <Shield size={20} className="text-[#22568F]" />
            </div>
            <h1 className="font-playfair text-3xl font-bold text-[#0D1B2E]">Term Insurance Planner</h1>
          </div>
          <p className="text-[#6B7E99]">Invest a monthly SIP equal to a portion of your premium. See how the corpus can offset total premiums paid over the policy tenure.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[340px_1fr] gap-6">
          {/* Inputs */}
          <div className="bg-white rounded-2xl border border-[#E2EBF5] p-6 space-y-5 h-fit">
            <h2 className="font-semibold text-[#0D1B2E]">Policy Parameters</h2>
            <NumInput label="Annual Premium" value={premium} onChange={setPremium} />
            <NumInput label="Monthly SIP to Offset" value={sipAmt} onChange={setSipAmt} />
            <NumInput label="Policy Tenure" value={tenure} onChange={setTenure} prefix="" suffix=" years" />
            <NumInput label="SIP Growth Rate (p.a.)" value={growthRate} onChange={setGrowthRate} prefix="" suffix="%" />
          </div>

          {/* Results */}
          <div className="space-y-5">
            {/* Summary */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white rounded-xl border border-[#E2EBF5] p-5">
                <p className="text-xs text-[#6B7E99] mb-1">Total Premiums Paid</p>
                <p className="text-2xl font-bold text-red-600">{inr(calc.totalPremiums)}</p>
              </div>
              <div className="bg-white rounded-xl border border-[#E2EBF5] p-5">
                <p className="text-xs text-[#6B7E99] mb-1">Total SIP Invested</p>
                <p className="text-2xl font-bold text-[#6B7E99]">{inr(calc.totalSipInvested)}</p>
              </div>
              <div className="bg-white rounded-xl border border-[#E2EBF5] p-5">
                <p className="text-xs text-[#6B7E99] mb-1">Final SIP Corpus</p>
                <p className="text-2xl font-bold text-[#22568F]">{inr(calc.corpus)}</p>
              </div>
              <div className={`rounded-xl border p-5 ${calc.net >= 0 ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"}`}>
                <p className="text-xs text-[#6B7E99] mb-1">Net Benefit (Corpus − Premiums)</p>
                <p className={`text-2xl font-bold ${calc.net >= 0 ? "text-green-700" : "text-red-600"}`}>{inr(calc.net)}</p>
              </div>
            </div>

            {/* Year-by-year table */}
            <div className="bg-white rounded-2xl border border-[#E2EBF5] overflow-hidden">
              <div className="px-5 py-4 border-b border-[#E2EBF5]">
                <h3 className="font-semibold text-[#0D1B2E] text-sm">Premium vs SIP Corpus — Year by Year</h3>
              </div>
              <div className="overflow-auto max-h-72">
                <table className="w-full text-xs">
                  <thead className="sticky top-0 bg-[#22568F] text-white">
                    <tr>
                      {["Yr", "Premium Paid", "SIP Opening", "Annual SIP", "Growth", "SIP Closing"].map(h => (
                        <th key={h} className="px-4 py-2.5 text-right first:text-left font-medium">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {calc.rows.map((r, i) => (
                      <tr key={r.yr} className={i % 2 === 0 ? "bg-white" : "bg-[#F9FBFD]"}>
                        <td className="px-4 py-2 text-[#6B7E99]">{r.yr}</td>
                        <td className="px-4 py-2 text-right text-red-500">{inr(r.premium)}</td>
                        <td className="px-4 py-2 text-right">{inr(r.open)}</td>
                        <td className="px-4 py-2 text-right text-[#22568F]">{inr(r.annSip)}</td>
                        <td className="px-4 py-2 text-right text-green-600">{inr(r.growth)}</td>
                        <td className="px-4 py-2 text-right font-semibold">{inr(r.close)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <p className="text-xs text-[#6B7E99] flex gap-1.5">
              <AlertCircle size={13} className="flex-shrink-0 mt-0.5" />
              SIP growth assumed at the specified rate, compounded annually. Mutual fund returns are not guaranteed. This is for planning purposes only and does not constitute investment advice.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
