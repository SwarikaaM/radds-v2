import { useState, useMemo } from "react";
import { Home, TrendingUp, AlertCircle } from "lucide-react";

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

function inr(n) { return "₹" + Math.round(n).toLocaleString("en-IN"); }

export default function HomeLoanCalc() {
  const [loanAmt, setLoanAmt] = useState(5000000);
  const [emi, setEmi] = useState(45000);
  const [tenure, setTenure] = useState(20);
  const [rate, setRate] = useState(8.5);

  const calc = useMemo(() => {
    // Actual interest = total EMI paid minus principal
    const totalPaid = emi * tenure * 12;
    const totalInterest = Math.max(0, totalPaid - loanAmt);

    // Monthly SIP needed so that SIP corpus at end of tenure = totalInterest
    // FV of SIP = P * [((1+r)^n - 1) / r] * (1+r)
    // Solving for P: P = FV * r / [((1+r)^n - 1) * (1+r)]
    const n = tenure * 12;
    const r = 0.12 / 12;
    const sipNeeded = totalInterest > 0 && n > 0
      ? Math.ceil((totalInterest * r) / ((Math.pow(1 + r, n) - 1) * (1 + r)))
      : 0;
    const annualSip = sipNeeded * 12;

    // Year-by-year table — matches backend logic exactly
    let sipOpen = 0;
    const rows = [];
    for (let yr = 1; yr <= tenure; yr++) {
      const openingBalance = sipOpen;
      // Monthly compounding — add sipNeeded each month and grow at 1%/month
      for (let m = 0; m < 12; m++) {
        sipOpen = (sipOpen + sipNeeded) * (1 + 0.12 / 12);
      }
      const close = sipOpen;
      const add = annualSip;
      const growth = close - openingBalance - add;
      rows.push({ yr, open: openingBalance, add, growth, close });
    }

    const finalCorpus = sipOpen;
    const net = finalCorpus - totalInterest;
    return { totalPaid, totalInterest, sipNeeded, annualSip, rows, finalCorpus, net };
  }, [loanAmt, emi, tenure, rate]);

  return (
    <section className="bg-lightbg py-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-[#22568F]/10 rounded-xl flex items-center justify-center">
              <Home size={20} className="text-[#22568F]" />
            </div>
            <h1 className="font-playfair text-3xl font-bold text-[#0D1B2E]">Home Loan Interest Free Plan</h1>
          </div>
          <p className="text-[#6B7E99]">Run a parallel SIP to offset the total interest on your home loan — making it effectively interest-free.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-6">
          {/* Inputs */}
          <div className="bg-white rounded-2xl border border-[#E2EBF5] p-6 space-y-5 h-fit">
            <h2 className="font-semibold text-[#0D1B2E]">Loan Parameters</h2>
            <NumInput label="Loan Amount" value={loanAmt} onChange={setLoanAmt} />
            <NumInput label="Monthly EMI" value={emi} onChange={setEmi} />
            <NumInput label="Loan Tenure" value={tenure} onChange={setTenure} prefix="" suffix=" years" />
            <NumInput label="Interest Rate (p.a.)" value={rate} onChange={setRate} prefix="" suffix="%" />
          </div>

          {/* Results */}
          <div className="space-y-5">
            {/* Summary cards */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white rounded-xl border border-[#E2EBF5] p-5">
                <p className="text-xs text-[#6B7E99] mb-1">Total Interest Payable</p>
                <p className="text-2xl font-bold text-red-600">{inr(calc.totalInterest)}</p>
              </div>
              <div className="bg-white rounded-xl border border-[#E2EBF5] p-5">
                <p className="text-xs text-[#6B7E99] mb-1">Monthly SIP to Offset Interest</p>
                <p className="text-2xl font-bold text-green-600">{inr(calc.sipNeeded)}<span className="text-sm font-normal text-[#6B7E99]">/mo</span></p>
              </div>
              <div className="bg-white rounded-xl border border-[#E2EBF5] p-5">
                <p className="text-xs text-[#6B7E99] mb-1">Final SIP Corpus ({tenure} yrs @ 12%)</p>
                <p className="text-2xl font-bold text-[#22568F]">{inr(calc.finalCorpus)}</p>
              </div>
              <div className={`rounded-xl border p-5 ${calc.net >= 0 ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"}`}>
                <p className="text-xs text-[#6B7E99] mb-1">Net Benefit (Corpus − Interest)</p>
                <p className={`text-2xl font-bold ${calc.net >= 0 ? "text-green-700" : "text-red-600"}`}>{inr(calc.net)}</p>
              </div>
            </div>

            <div className="bg-[#EAF2FF] border border-[#C8DCF5] rounded-xl p-4 flex gap-3">
              <TrendingUp size={18} className="text-[#22568F] flex-shrink-0 mt-0.5" />
              <p className="text-sm text-[#22568F]">
                Invest just <strong>{inr(calc.sipNeeded)}/month</strong> in a mutual fund SIP at 12% p.a. alongside your loan. Over {tenure} years, the corpus covers your entire interest burden — your home loan becomes effectively interest-free.
              </p>
            </div>

            {/* Year-by-year table */}
            <div className="bg-white rounded-2xl border border-[#E2EBF5] overflow-hidden">
              <div className="px-5 py-4 border-b border-[#E2EBF5]">
                <h3 className="font-semibold text-[#0D1B2E] text-sm">SIP Growth Table ({tenure} Years @ 12% p.a.)</h3>
              </div>
              <div className="overflow-auto max-h-72">
                <table className="w-full text-xs">
                  <thead className="sticky top-0 bg-[#22568F] text-white">
                    <tr>
                      {["Yr", "Opening", "Annual SIP", "Growth", "Closing"].map(h => (
                        <th key={h} className="px-4 py-2.5 text-right first:text-left font-medium">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {calc.rows.map((r, i) => (
                      <tr key={r.yr} className={i % 2 === 0 ? "bg-white" : "bg-[#F9FBFD]"}>
                        <td className="px-4 py-2 text-[#6B7E99]">{r.yr}</td>
                        <td className="px-4 py-2 text-right">{inr(r.open)}</td>
                        <td className="px-4 py-2 text-right text-[#22568F]">{inr(r.add)}</td>
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
              SIP growth assumed at 12% p.a. compounded annually. Mutual fund returns are not guaranteed. Past performance is not indicative of future returns.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
