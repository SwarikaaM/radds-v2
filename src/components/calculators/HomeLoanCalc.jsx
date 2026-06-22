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
  const [tenure, setTenure] = useState(20);
  const [rate, setRate] = useState(8.5); // Home loan interest rate

  const calc = useMemo(() => {
    // 1. Calculate actual Home Loan EMI dynamically based on user input
    // Formula: EMI = [P x R x (1+R)^N]/[((1+R)^N)-1]
    const monthlyLoanRate = (rate / 100) / 12;
    const totalMonths = tenure * 12;
    
    let calculatedEmi = 0;
    if (loanAmt > 0 && monthlyLoanRate > 0 && totalMonths > 0) {
      calculatedEmi = Math.round(
        (loanAmt * monthlyLoanRate * Math.pow(1 + monthlyLoanRate, totalMonths)) / 
        (Math.pow(1 + monthlyLoanRate, totalMonths) - 1)
      );
    }

    // 2. Total loan payments and total interest payable
    const totalPaid = calculatedEmi * totalMonths;
    const totalInterest = Math.max(0, totalPaid - loanAmt);

    // 3. SIP Math: Fixed 12% p.a. growth assumed for investment
    const sipRate = 0.12 / 12; 
    const sipNeeded = totalInterest > 0 && totalMonths > 0
      ? Math.ceil((totalInterest * sipRate) / ((Math.pow(1 + sipRate, totalMonths) - 1) * (1 + sipRate)))
      : 0;
    const annualSip = sipNeeded * 12;

    // 4. Year-by-year accumulation table (at fixed 12%)
    let sipOpen = 0;
    const rows = [];
    for (let yr = 1; yr <= tenure; yr++) {
      const openingBalance = sipOpen;
      for (let m = 0; m < 12; m++) {
        sipOpen = (sipOpen + sipNeeded) * (1 + sipRate);
      }
      const close = sipOpen;
      const add = annualSip;
      const growth = close - openingBalance - add;
      rows.push({ yr, open: openingBalance, add, growth, close });
    }

    const finalCorpus = sipOpen;
    const net = finalCorpus - totalInterest;

    return { calculatedEmi, totalPaid, totalInterest, sipNeeded, annualSip, rows, finalCorpus, net };
  }, [loanAmt, tenure, rate]);

  return (
    <section className="bg-lightbg py-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-[#22568F]/10 rounded-xl flex items-center justify-center">
              <Home size={20} className="text-[#22568F]" />
            </div>
            <h1 className="font-playfair text-3xl font-bold text-[#0D1B2E]">Home Loan Interest Offset Calculator</h1>
          </div>
          <p className="text-[#6B7E99]">See how a parallel mutual fund SIP growing at 12% p.a. could potentially offset the total interest burden of your home loan.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-6">
          {/* Inputs */}
          <div className="bg-white rounded-2xl border border-[#E2EBF5] p-6 space-y-5 h-fit">
            <h2 className="font-semibold text-[#0D1B2E]">Loan Parameters</h2>
            <NumInput label="Loan Amount" value={loanAmt} onChange={setLoanAmt} />
            <NumInput label="Home Loan Interest Rate (p.a.)" value={rate} onChange={setRate} prefix="" suffix="%" />
            <NumInput label="Loan Tenure" value={tenure} onChange={setTenure} prefix="" suffix=" years" />
            
            {/* Displaying Auto-Calculated EMI */}
            <div className="pt-3 border-t border-dashed border-[#E2EBF5]">
              <p className="text-xs font-medium text-[#6B7E99] mb-0.5">Calculated Monthly EMI</p>
              <p className="text-xl font-bold text-[#0D1B2E]">{inr(calc.calculatedEmi)}</p>
            </div>
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
                By investing <strong>{inr(calc.sipNeeded)}/month</strong> at an assumed 12% p.a. equity return rate, your generated corpus can neutralize the interest costs generated by your <strong>{rate}%</strong> home loan.
              </p>
            </div>

            {/* Year-by-year table */}
            <div className="bg-white rounded-2xl border border-[#E2EBF5] overflow-hidden">
              <div className="px-5 py-4 border-b border-[#E2EBF5]">
                <h3 className="font-semibold text-[#0D1B2E] text-sm">SIP Growth Table ({tenure} Years @ Fixed 12% p.a.)</h3>
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

            {/* Explicit Clear Disclaimers */}
            <div className="text-xs text-[#6B7E99] space-y-2 bg-gray-50 border border-gray-200 rounded-xl p-4">
              <p className="flex gap-1.5 font-medium text-gray-700">
                <AlertCircle size={14} className="flex-shrink-0 mt-0.5 text-amber-600" />
                Important Disclaimers:
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li><strong>Home Loan Rate vs. Investment Return:</strong> The Home Loan calculations dynamically adjust based on your current input parameter. The parallel mutual fund SIP growth rate is strictly simulated at a fixed benchmark rate of 12% p.a.</li>
                <li><strong>No Guaranteed Outcomes:</strong> Real-world mutual fund products are subject to market risks. Actual investment returns fluctuate over time and are not guaranteed.</li>
                <li><strong>Taxation Not Included:</strong> This calculation does not factor in components like Capital Gains Tax (LTCG) on investment withdrawals or Income Tax deductions under Section 24(b) for home loan interest payments.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
