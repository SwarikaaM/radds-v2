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
  const maxYears = 30;

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

    return { year: yr, invested, total: nominal, real };
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
    <section className="bg-lightbg py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow="Investment Calculator"
          title="See Your Money Grow"
          subtitle="Combine a one-time investment with monthly SIP, add step-up and inflation — see the full picture."
          className="mb-8"
        />

        <ScrollReveal>
          <div className="bg-white rounded-[16px] border border-[#E2EBF5] shadow-md overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-[400px_1fr] divide-y lg:divide-y-0 lg:divide-x divide-[#E2EBF5]">

              {/* ── Input Panel ── */}
              <div className="p-7 space-y-6">
                <div>
                  <h3 className="text-textprimary font-semibold text-base mb-0.5">Configure Investment</h3>
                  <p className="text-textmuted text-xs">Drag sliders or click values to type</p>
                </div>

                <SliderInput label="One-Time Investment" value={lumpsum} min={0} max={10000000} step={10000}
                  onChange={setLumpsum} prefix="₹" />

                <SliderInput label="Monthly SIP" value={monthly} min={0} max={100000} step={500}
                  onChange={setMonthly} prefix="₹" />

                <SliderInput label="Expected Annual Return" value={rate} min={4} max={30} step={0.5}
                  onChange={setRate} suffix="%" formatDisplay={v => v.toFixed(1)} />

                <SliderInput label="SIP Top-up (Annual)" value={sipTopUp} min={0} max={50} step={1}
                  onChange={setSipTopUp} suffix="%" formatDisplay={v => v.toFixed(0)} />

                <SliderInput label="Investment Period" value={years} min={1} max={30} step={1}
                  onChange={setYears} suffix=" Yrs" formatDisplay={v => v} />

                {/* Compounding toggle */}
                <div>
                  <p className="text-textmuted text-sm font-medium mb-2">Compounding</p>
                  <div className="flex gap-1 bg-lightbg rounded-lg p-1">
                    {["monthly", "quarterly", "yearly"].map(opt => (
                      <button key={opt}
                        onClick={() => setCompounding(opt)}
                        className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-all capitalize ${
                          compounding === opt
                            ? "bg-white text-primary shadow-sm border border-[#E2EBF5]"
                            : "text-textmuted hover:text-textprimary"
                        }`}
                      >
                        {opt.charAt(0).toUpperCase() + opt.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Inflation toggle */}
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setInflationEnabled(e => !e)}
                      className={`relative w-10 h-5 rounded-full transition-colors duration-200 ${
                        inflationEnabled ? "bg-primary" : "bg-gray-200"
                      }`}
                    >
                      <span className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 ${
                        inflationEnabled ? "translate-x-5" : ""
                      }`} />
                    </button>
                    <span className="text-sm text-textmuted font-medium">Inflation @</span>
                  </div>
                  {inflationEnabled && (
                    <div className="flex items-center gap-1 bg-lightbg border border-[#E2EBF5] rounded-lg px-3 py-1 w-24">
                      <input
                        type="number" min={1} max={15} step={0.5}
                        value={inflation}
                        onChange={e => setInflation(Number(e.target.value))}
                        className="w-full bg-transparent text-sm font-semibold text-textprimary outline-none text-center"
                      />
                      <span className="text-textmuted text-sm">%</span>
                    </div>
                  )}
                </div>

                {/* Quick presets */}
                <div>
                  <p className="text-textmuted text-xs mb-2 font-medium">Quick Presets</p>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { label: "Starter", ls: 50000, m: 2000, r: 12, y: 10 },
                      { label: "Growth", ls: 150000, m: 5000, r: 14, y: 15 },
                      { label: "Wealth", ls: 500000, m: 10000, r: 15, y: 20 },
                    ].map(p => (
                      <button key={p.label}
                        onClick={() => { setLumpsum(p.ls); setMonthly(p.m); setRate(p.r); setYears(p.y); setSipTopUp(0); }}
                        className="px-3 py-1.5 text-xs rounded-full border border-[#E2EBF5] text-textmuted hover:border-primary hover:text-primary transition-colors"
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* ── Output Panel ── */}
              <div className="p-7 space-y-5 flex flex-col">

                {/* Summary cards */}
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { label: "Invested Amount", value: fmt(results.totalInvested), color: "text-textprimary" },
                    { label: "Growth Earned", value: fmt(results.growth), color: "text-green-600" },
                    { label: inflationEnabled ? "Maturity (Inflation Adj.)" : "Maturity Amount", value: fmt(inflationEnabled ? results.realTotal : results.nominalTotal), color: "text-primary" },
                  ].map(c => (
                    <div key={c.label} className="bg-lightbg rounded-xl p-4 text-center">
                      <p className="text-[11px] text-textmuted font-medium mb-1">{c.label}</p>
                      <p className={`text-lg font-bold ${c.color}`}>{c.value}</p>
                    </div>
                  ))}
                </div>

                {/* Inflation note */}
                {inflationEnabled && (
                  <div className="text-xs text-textmuted bg-amber-50 border border-amber-100 rounded-lg px-3 py-2">
                    Nominal maturity: <span className="font-semibold text-textprimary">{fmt(results.nominalTotal)}</span>
                    {" "}→ adjusted to today's purchasing power at {inflation}% inflation over {years} yrs
                  </div>
                )}

                {/* Graph / Table toggle */}
                <div className="flex items-center justify-between">
                  <p className="text-textmuted text-xs font-medium uppercase tracking-wide">
                    {years}-Year Projection (30-year view)
                  </p>
                  <div className="flex gap-1 bg-lightbg rounded-lg p-0.5">
                    {["graph", "table"].map(m => (
                      <button key={m}
                        onClick={() => setViewMode(m)}
                        className={`px-3 py-1 text-xs font-medium rounded-md transition-all capitalize ${
                          viewMode === m
                            ? "bg-white text-primary shadow-sm border border-[#E2EBF5]"
                            : "text-textmuted hover:text-textprimary"
                        }`}
                      >
                        {m.charAt(0).toUpperCase() + m.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Chart or Table */}
                <div className="flex-1">
                  {viewMode === "graph" ? (
                    <SIPGrowthChart data={chartDataWithHighlight} inflationEnabled={inflationEnabled} years={years} />
                  ) : (
                    <SIPYearlyTable data={chartData} inflationEnabled={inflationEnabled} years={years} />
                  )}
                </div>
              </div>

            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
