import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import SectionHeader from "../ui/SectionHeader";
import ScrollReveal from "../ui/ScrollReveal";
import SIPGrowthChart from "./SIPGrowthChart";
import SIPYearlyTable from "./SIPYearlyTable";

// ── Slider input with click-to-type ───────────────────────────────────
function SliderInput({ label, value, min, max, step, onChange, prefix, suffix, formatDisplay }) {
  const pct = Math.min(100, Math.max(0, ((value - min) / (max - min)) * 100));
  const [editing, setEditing] = useState(false);
  const [raw, setRaw] = useState("");

  function startEdit() { setRaw(String(value)); setEditing(true); }
  function commitEdit() {
    setEditing(false);
    const n = parseFloat(raw);
    if (!isNaN(n)) onChange(Math.min(max, Math.max(min, n)));
  }
  function handleKey(e) {
    if (e.key === "Enter") commitEdit();
    if (e.key === "Escape") setEditing(false);
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-textmuted text-sm font-medium">{label}</label>
        <div className="flex items-center gap-1 bg-lightbg border border-[#E2EBF5] rounded-lg px-3 py-1.5 min-w-[100px]">
          {prefix && <span className="text-textmuted text-sm">{prefix}</span>}
          {editing ? (
            <input
              type="text" inputMode="numeric" autoFocus value={raw}
              onChange={e => setRaw(e.target.value)}
              onBlur={commitEdit} onKeyDown={handleKey}
              className="font-semibold text-sm text-textprimary w-[70px] bg-transparent outline-none text-center"
            />
          ) : (
            <span
              className="font-semibold text-sm text-textprimary min-w-[60px] text-center cursor-text hover:text-primary transition-colors"
              onClick={startEdit} title="Click to type"
            >
              {formatDisplay ? formatDisplay(value) : value.toLocaleString("en-IN")}
            </span>
          )}
          {suffix && <span className="text-textmuted text-sm">{suffix}</span>}
        </div>
      </div>
      <div className="relative h-5 flex items-center">
        <div className="w-full h-1.5 bg-[#E2EBF5] rounded-full relative overflow-hidden">
          <motion.div
            className="absolute inset-y-0 left-0 bg-gradient-to-r from-primary to-secondary rounded-full"
            animate={{ width: `${pct}%` }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          />
        </div>
        <input
          type="range" min={min} max={max} step={step} value={value}
          onChange={e => onChange(Number(e.target.value))}
          className="absolute inset-0 w-full opacity-0 cursor-pointer h-5"
          style={{ zIndex: 2 }}
        />
        <motion.div
          className="absolute w-4 h-4 bg-white border-2 border-primary rounded-full shadow-md pointer-events-none"
          animate={{ left: `calc(${pct}% - 8px)` }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        />
      </div>
      <div className="flex justify-between text-[11px] text-textmuted">
        <span>{prefix}{min.toLocaleString("en-IN")}{suffix}</span>
        <span>{prefix}{max.toLocaleString("en-IN")}{suffix}</span>
      </div>
    </div>
  );
}

// ── Core calculation ───────────────────────────────────────────────────
function calcResults({ lumpsum, monthly, rate, sipTopUp, years, compounding, inflationEnabled, inflation }) {
  const periods = compounding === "monthly" ? 12 : compounding === "quarterly" ? 4 : 1;
  const rPerPeriod = rate / 100 / periods;
  const totalPeriods = years * periods;
  const monthsPerPeriod = 12 / periods;

  // Lumpsum future value
  const lumpsumFV = lumpsum > 0 ? lumpsum * Math.pow(1 + rPerPeriod, totalPeriods) : 0;

  // SIP with step-up (annual) — compute year by year
  let sipCorpus = 0;
  let currentMonthly = monthly;
  let totalSipInvested = 0;

  for (let yr = 1; yr <= years; yr++) {
    const periodsThisYear = periods;
    const contributionPerPeriod = currentMonthly * monthsPerPeriod;
    for (let p = 0; p < periodsThisYear; p++) {
      const periodsLeft = (years - yr) * periods + (periodsThisYear - p);
      // Add contribution and grow it to end
      sipCorpus += contributionPerPeriod * Math.pow(1 + rPerPeriod, periodsLeft);
      totalSipInvested += contributionPerPeriod;
    }
    if (sipTopUp > 0) currentMonthly = currentMonthly * (1 + sipTopUp / 100);
  }

  const nominalTotal = Math.round(lumpsumFV + sipCorpus);
  const totalInvested = Math.round(lumpsum + totalSipInvested);
  const growth = nominalTotal - totalInvested;

  // Inflation adjustment
  const realTotal = inflationEnabled
    ? Math.round(nominalTotal / Math.pow(1 + inflation / 100, years))
    : nominalTotal;

  return { nominalTotal, realTotal, totalInvested, growth };
}

function buildChartData({ lumpsum, monthly, rate, sipTopUp, years, compounding, inflationEnabled, inflation }) {
  const periods = compounding === "monthly" ? 12 : compounding === "quarterly" ? 4 : 1;
  const rPerPeriod = rate / 100 / periods;
  const monthsPerPeriod = 12 / periods;
  const maxYears = 50;

  return Array.from({ length: maxYears }, (_, i) => {
    const yr = i + 1;
    const totalPeriods = yr * periods;

    const lumpsumFV = lumpsum > 0 ? lumpsum * Math.pow(1 + rPerPeriod, totalPeriods) : 0;

    let sipCorpus = 0;
    let currentMonthly = monthly;
    let totalSipInvested = 0;

    for (let y = 1; y <= yr; y++) {
      const contributionPerPeriod = currentMonthly * monthsPerPeriod;
      for (let p = 0; p < periods; p++) {
        const periodsLeft = (yr - y) * periods + (periods - p);
        sipCorpus += contributionPerPeriod * Math.pow(1 + rPerPeriod, periodsLeft);
        totalSipInvested += contributionPerPeriod;
      }
      if (sipTopUp > 0) currentMonthly = currentMonthly * (1 + sipTopUp / 100);
    }

    const nominal = Math.round(lumpsumFV + sipCorpus);
    const invested = Math.round(lumpsum + totalSipInvested);
    const real = inflationEnabled
      ? Math.round(nominal / Math.pow(1 + inflation / 100, yr))
      : nominal;

    return {
      year: yr,
      invested,
      total: nominal,
      real,
      growth: nominal - invested,
      real_growth: real - invested,
    };
  });
}

function fmt(n) {
  if (n >= 1e7) return "₹" + (n / 1e7).toFixed(2) + " Cr";
  if (n >= 1e5) return "₹" + (n / 1e5).toFixed(2) + " L";
  return "₹" + n.toLocaleString("en-IN");
}

export default function FeaturedCalculator() {
  const [lumpsum, setLumpsum] = useState(150000);
  const [monthly, setMonthly] = useState(0);
  const [rate, setRate] = useState(15);
  const [sipTopUp, setSipTopUp] = useState(0);
  const [years, setYears] = useState(10);
  const [compounding, setCompounding] = useState("monthly");
  const [inflationEnabled, setInflationEnabled] = useState(false);
  const [inflation, setInflation] = useState(6);
  const [viewMode, setViewMode] = useState("graph"); // "graph" | "table"

  const results = useMemo(() => calcResults({ lumpsum, monthly, rate, sipTopUp, years, compounding, inflationEnabled, inflation }),
    [lumpsum, monthly, rate, sipTopUp, years, compounding, inflationEnabled, inflation]);

  const chartData = useMemo(() => buildChartData({ lumpsum, monthly, rate, sipTopUp, years, compounding, inflationEnabled, inflation }),
    [lumpsum, monthly, rate, sipTopUp, years, compounding, inflationEnabled, inflation]);

  // Highlight the selected year on chart (up to years, rest lighter)
  const chartDataWithHighlight = chartData.map(d => ({
    ...d,
    highlighted: d.year <= years,
  }));

  return (
    <section className="bg-lightbg py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow="Investment Calculator"
          title="See Your Money Grow"
          subtitle="Combine a one-time investment with monthly SIP, add step-up and inflation — see the full picture."
          className="mb-6"
        />

        <ScrollReveal>
          <div className="bg-white rounded-xl border border-[#E2EBF5] shadow-sm overflow-hidden">

            {/* ── Row 1: Input fields (compact, single row) ── */}
            <div className="flex flex-wrap items-end gap-3 px-5 pt-4 pb-3 border-b border-[#E2EBF5]">
              {[
                { label: "I want to invest One time", value: lumpsum, onChange: setLumpsum, prefix: "₹" },
                { label: "I want to invest monthly", value: monthly, onChange: setMonthly, prefix: "₹" },
                { label: "SIP Top up", value: sipTopUp, onChange: setSipTopUp, suffix: "%" },
                { label: "Expected return", value: rate, onChange: setRate, suffix: "%" },
              ].map(f => (
                <div key={f.label} className="flex flex-col gap-1 min-w-[130px]">
                  <span className="text-[11px] text-textmuted">{f.label}</span>
                  <div className="flex items-center border-b border-[#CDD8E3] pb-0.5 gap-1">
                    {f.prefix && <span className="text-textmuted text-sm">{f.prefix}</span>}
                    <input
                      type="text" inputMode="numeric"
                      value={f.value === 0 ? "" : f.value.toLocaleString("en-IN").replace(/,/g, "")}
                      onChange={e => { const v = e.target.value.replace(/,/g, ""); if (v === "" || /^\d*\.?\d*$/.test(v)) f.onChange(v === "" ? 0 : Number(v)); }}
                      className="w-24 bg-transparent text-sm font-semibold text-textprimary outline-none"
                    />
                    {f.suffix && <span className="text-textmuted text-sm">{f.suffix}</span>}
                  </div>
                </div>
              ))}

              {/* Compounding */}
              <div className="flex flex-col gap-1">
                <span className="text-[11px] text-textmuted">——Compounded——</span>
                <div className="flex gap-1">
                  {["Monthly", "Quarterly", "Yearly"].map(opt => (
                    <button key={opt}
                      onClick={() => setCompounding(opt.toLowerCase())}
                      className={`px-3 py-1 text-xs rounded border transition-all ${
                        compounding === opt.toLowerCase()
                          ? "bg-[#22568F] text-white border-[#22568F]"
                          : "bg-white text-textmuted border-[#D1DDE8] hover:border-[#22568F]"
                      }`}
                    >{opt}</button>
                  ))}
                </div>
              </div>

              {/* Reset */}
              <button
                onClick={() => { setLumpsum(150000); setMonthly(0); setRate(15); setSipTopUp(0); setYears(10); setCompounding("monthly"); setInflationEnabled(false); setInflation(6); }}
                className="w-9 h-9 rounded-full bg-[#22568F] text-white flex items-center justify-center hover:bg-[#1a4070] transition-colors flex-shrink-0 ml-auto"
                title="Reset"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
                  <path d="M3 3v5h5"/>
                </svg>
              </button>
            </div>

            {/* ── Row 2: Year slider + summary + controls ── */}
            <div className="flex flex-wrap items-center gap-6 px-5 py-3 border-b border-[#E2EBF5]">
              {/* Year slider */}
              <div className="flex items-center gap-3 flex-1 min-w-[260px]">
                <span className="text-sm text-textprimary whitespace-nowrap">
                  Invest for a period of: <strong>{years} Years</strong>
                </span>
                <div className="relative flex-1 h-5 flex items-center">
                  <div className="w-full h-1 bg-[#E2EBF5] rounded-full">
                    <div className="h-1 bg-[#22568F] rounded-full" style={{ width: `${((years - 1) / 49) * 100}%` }} />
                  </div>
                  <input type="range" min={1} max={50} step={1} value={years}
                    onChange={e => setYears(Number(e.target.value))}
                    className="absolute inset-0 w-full opacity-0 cursor-pointer" />
                  <div className="absolute flex flex-col items-center pointer-events-none"
                    style={{ left: `calc(${((years - 1) / 49) * 100}% - 14px)` }}>
                    <div className="bg-[#22568F] text-white text-[10px] font-bold px-1.5 py-0.5 rounded">{years}Yr</div>
                  </div>
                </div>
              </div>

              {/* Summary */}
              <div className="flex gap-6">
                <div>
                  <p className="text-[11px] text-textmuted">Invested Amount</p>
                  <p className="text-base font-bold text-textprimary">{fmt(results.totalInvested)}</p>
                </div>
                <div>
                  <p className="text-[11px] text-textmuted">Growth Earned</p>
                  <p className="text-base font-bold text-green-600">{fmt(results.growth)}</p>
                </div>
                <div>
                  <p className="text-[11px] text-textmuted">{inflationEnabled ? "Maturity (Inflation Adj.)" : "Maturity Amount"}</p>
                  <p className="text-base font-bold text-primary">{fmt(inflationEnabled ? results.realTotal : results.nominalTotal)}</p>
                </div>
              </div>

              {/* Inflation + Graph/Table */}
              <div className="flex items-center gap-4 ml-auto">
                <div className="flex items-center gap-2">
                  <button onClick={() => setInflationEnabled(e => !e)}
                    className={`relative w-9 h-5 rounded-full transition-colors ${inflationEnabled ? "bg-[#22568F]" : "bg-gray-200"}`}>
                    <span className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${inflationEnabled ? "translate-x-4" : ""}`} />
                  </button>
                  <span className="text-xs text-textmuted">Inflation @</span>
                  {inflationEnabled && (
                    <div className="flex items-center border-b border-[#CDD8E3] gap-0.5">
                      <input type="number" min={1} max={20} step={0.5} value={inflation}
                        onChange={e => setInflation(Number(e.target.value))}
                        className="w-8 bg-transparent text-xs font-semibold outline-none text-center" />
                      <span className="text-xs text-textmuted">%</span>
                    </div>
                  )}
                </div>
                <div className="flex gap-1">
                  {["Graph", "Table"].map(m => (
                    <button key={m} onClick={() => setViewMode(m.toLowerCase())}
                      className={`px-3 py-1 text-xs rounded border transition-all ${
                        viewMode === m.toLowerCase()
                          ? "bg-[#E8EFF6] text-textprimary border-[#D1DDE8] font-medium"
                          : "bg-white text-textmuted border-[#E2EBF5] hover:border-[#D1DDE8]"
                      }`}>{m}</button>
                  ))}
                </div>
              </div>
            </div>

            {/* ── Row 3: Chart / Table full width ── */}
            <div className="px-4 py-4">
              {viewMode === "graph" ? (
                <SIPGrowthChart data={chartData} inflationEnabled={inflationEnabled} years={years} />
              ) : (
                <SIPYearlyTable data={chartData} inflationEnabled={inflationEnabled} years={years} />
              )}
            </div>

          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
