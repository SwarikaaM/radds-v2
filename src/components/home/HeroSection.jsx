import { motion } from "framer-motion";
import { useEffect, useState, useRef } from "react";
import { ShieldCheck, ArrowUpRight, TrendingUp, ChevronRight, Target, GraduationCap, Users, Home, Plane } from "lucide-react";
import Badge from "../ui/Badge";
import Button from "../ui/Button";
import { Link } from "react-router-dom";

// ─── Animated count-up hook ───────────────────────────────────────────────────
function useCountUp(target, active, duration = 2000) {
  const [val, setVal] = useState(0);
  const raf = useRef(null);
  useEffect(() => {
    if (!active) { setVal(0); return; }
    const start = performance.now();
    const tick = (now) => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setVal(Math.round(eased * target));
      if (p < 1) raf.current = requestAnimationFrame(tick);
      else setVal(target);
    };
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, [active, target, duration]);
  return val;
}

// ─── Format Indian numbers ────────────────────────────────────────────────────
function fmtINR(n) {
  if (n >= 10000000) return `₹${(n / 10000000).toFixed(1)} Cr`;
  if (n >= 100000)   return `₹${(n / 100000).toFixed(0)} L`;
  if (n >= 1000)     return `₹${(n / 1000).toFixed(0)}K`;
  return `₹${n}`;
}

// ─── Single dream stat card ───────────────────────────────────────────────────
function DreamStat({ icon: Icon, iconColor, iconBg, label, sublabel, target, suffix = "", delay, active }) {
  const val = useCountUp(target, active, 2200);
  return (
    <motion.div
      className="glass rounded-2xl p-4 flex items-center gap-4"
      initial={{ opacity: 0, x: -24 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: iconBg }}>
        <Icon size={20} style={{ color: iconColor }} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-white/50 text-[11px] font-medium mb-0.5">{label}</p>
        <p className="text-white font-mono-num font-bold text-lg leading-tight">
          {fmtINR(val)}{suffix}
        </p>
        <p className="text-white/35 text-[10px] mt-0.5">{sublabel}</p>
      </div>
    </motion.div>
    
  );
}



// ─── Progress bar milestone ───────────────────────────────────────────────────
function MilestoneBar({ label, pct, color, delay, active }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
    >
      <div className="flex justify-between items-center mb-1">
        <span className="text-white/55 text-[11px]">{label}</span>
        <span className="text-white/70 text-[11px] font-mono-num font-semibold">{pct}%</span>
      </div>
      <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{ background: color }}
          initial={{ width: 0 }}
          animate={active ? { width: `${pct}%` } : { width: 0 }}
          transition={{ delay: delay + 0.2, duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
        />
      </div>
    </motion.div>
  );
}

// ─── Compounding chart SVG ────────────────────────────────────────────────────
const CHART_LINE = "M0,90 C15,85 25,75 35,60 C45,45 50,35 60,22 C70,10 80,5 100,2";
const CHART_FILL = CHART_LINE + " L100,100 L0,100 Z";

function CompoundChart({ active }) {
  return (
    <svg viewBox="0 0 100 100" className="w-full h-16" preserveAspectRatio="none">
      <defs>
        <linearGradient id="cg2" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#39C3EF" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#39C3EF" stopOpacity="0" />
        </linearGradient>
        <clipPath id="cc2">
          <motion.rect
            x="0" y="0" height="100"
            initial={{ width: 0 }}
            animate={active ? { width: 100 } : { width: 0 }}
            transition={{ duration: 2, ease: [0.16, 1, 0.3, 1] }}
          />
        </clipPath>
      </defs>
      <path d={CHART_FILL} fill="url(#cg2)" clipPath="url(#cc2)" />
      <path d={CHART_LINE} stroke="#39C3EF" strokeWidth="2.5" fill="none" strokeLinecap="round" clipPath="url(#cc2)" />
    </svg>
  );
}

// ─── Phone mock (right side assembly animation) ───────────────────────────────
const LOOP_MS = 9500;
const STEP_MS = [0, 1200, 2000, 2500, 3400, 4000, 4500, 5200, 6000, 6600, 7200, 7800];
const STRIPS = [
  { label: "Retirement Corpus", val: "₹4.2 Cr",  bg: "#16a34a" },
  { label: "Child Education",   val: "₹55 L",    bg: "#ca8a04" },
  { label: "Monthly SIP",       val: "₹15,000",  bg: "#1e293b" },
];
const BTNS = ["Retirement", "Education", "Tax Saving", "More"];

function PhoneAssembly({ step }) {
  const showShell    = step >= 2;
  const showHeader   = step >= 3;
  const showStrips   = step >= 4;
  const showMainCard = step >= 5;
  const showBtns     = step >= 6;
  const showChart    = step >= 7;
  const zoomed       = step >= 8;

  const wealthVal = useCountUp(101, showChart, 2400); // in lakhs, shown as Cr

  return (
    <div className="relative flex items-center justify-center">


      {/* Phone shell */}
      <motion.div
        animate={zoomed ? { scale: 1.1, y: -8 } : { scale: 1, y: 0 }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        style={{ transformOrigin: "center top" }}
      >
        <motion.div
          style={{
            width: 248,
            borderRadius: 28,
            background: "#f8fafc",
            border: "1.5px solid rgba(0,0,0,0.09)",
            boxShadow: "0 32px 80px rgba(0,0,0,0.32), 0 2px 8px rgba(0,0,0,0.1)",
            minHeight: 450,
            overflow: "hidden",
          }}
          initial={{ opacity: 0, y: 110 }}
          animate={showShell ? { opacity: 1, y: 0 } : { opacity: 0, y: 110 }}
          transition={{ duration: 0.72, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Status bar */}
          <div className="flex items-center justify-between px-5 pt-3 pb-1">
            <span style={{ fontSize: 10, color: "#334155", fontFamily: "monospace" }}>9:41</span>
            <div className="flex items-center gap-0.5">
              {[3,2,1].map(h => (
                <div key={h} className="w-0.5 rounded-sm bg-slate-400" style={{ height: h * 3 + 2 }} />
              ))}
              <div className="w-3 h-2 rounded-sm bg-slate-800 ml-1" />
            </div>
          </div>

          {/* App header */}
          <motion.div
            className="flex items-center justify-between px-4 py-2"
            initial={{ opacity: 0, y: 8 }}
            animate={showHeader ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
            transition={{ duration: 0.4 }}
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
              <span style={{ fontSize: 10, color: "#fff", fontWeight: 800 }}>RC</span>
            </div>
            <span style={{ fontSize: 13, fontWeight: 600, color: "#0f172a" }}>Your Portfolio</span>
            <div className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center">
              <TrendingUp size={12} className="text-slate-500" />
            </div>
          </motion.div>

          {/* Goal strips */}
          <div className="px-3 space-y-0.5">
            {STRIPS.map((s, i) => (
              <motion.div
                key={s.label}
                className="flex items-center justify-between px-3 py-2 rounded-lg"
                style={{ background: s.bg }}
                initial={{ opacity: 0, x: -10 }}
                animate={showStrips ? { opacity: 1, x: 0 } : { opacity: 0, x: -10 }}
                transition={{ delay: i * 0.15, duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
              >
                <span style={{ fontSize: 10, color: i === 2 ? "#94a3b8" : "rgba(0,0,0,0.6)", fontWeight: 500 }}>{s.label}</span>
                <span style={{ fontSize: 10, color: i === 2 ? "#e2e8f0" : "rgba(0,0,0,0.75)", fontWeight: 700, fontFamily: "monospace" }}>{s.val}</span>
              </motion.div>
            ))}
          </div>

          {/* Main wealth card */}
          <motion.div
            className="mx-3 mt-2 rounded-2xl p-4"
            style={{ background: "linear-gradient(135deg,#22568f,#2389af)" }}
            initial={{ opacity: 0, y: 12 }}
            animate={showMainCard ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
            transition={{ duration: 0.48, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="flex justify-between items-start mb-1">
              <p style={{ fontSize: 9, color: "rgba(255,255,255,0.6)" }}>Projected Wealth</p>
              <span style={{ fontSize: 8, color: "#86efac", background: "rgba(134,239,172,0.18)", borderRadius: 4, padding: "1px 5px", fontWeight: 700 }}>+274%</span>
            </div>
            <p style={{ fontSize: 28, fontWeight: 800, color: "#fff", fontFamily: "monospace", lineHeight: 1.1 }}>
              ₹{(wealthVal / 100).toFixed(2)} Cr
            </p>
            <div className="flex gap-4 mt-2">
              <div><p style={{ fontSize: 8, color: "rgba(255,255,255,0.45)" }}>Invested</p><p style={{ fontSize: 11, color: "#fff", fontWeight: 700, fontFamily: "monospace" }}>₹27L</p></div>
              <div><p style={{ fontSize: 8, color: "rgba(255,255,255,0.45)" }}>Gain</p><p style={{ fontSize: 11, color: "#86efac", fontWeight: 700, fontFamily: "monospace" }}>+₹74L</p></div>
              <div><p style={{ fontSize: 8, color: "rgba(255,255,255,0.45)" }}>Rate</p><p style={{ fontSize: 11, color: "#fff", fontWeight: 700, fontFamily: "monospace" }}>15% p.a.</p></div>
            </div>
          </motion.div>

          {/* Action buttons */}
          <motion.div
            className="grid grid-cols-4 gap-1.5 px-3 mt-2"
            initial={{ opacity: 0, y: 8 }}
            animate={showBtns ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
            transition={{ duration: 0.38 }}
          >
            {BTNS.map((b, i) => (
              <motion.div
                key={b}
                className="flex flex-col items-center gap-1 py-2 rounded-xl"
                style={{ background: "#f1f5f9" }}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={showBtns ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
                transition={{ delay: i * 0.07, duration: 0.28 }}
              >
                <div className="w-6 h-6 rounded-lg bg-primary/15 flex items-center justify-center">
                  <TrendingUp size={10} className="text-primary" />
                </div>
                <span style={{ fontSize: 7.5, color: "#334155", fontWeight: 500 }}>{b}</span>
              </motion.div>
            ))}
          </motion.div>

          {/* Chart */}
          <motion.div
            className="mx-3 mt-2 mb-3 rounded-xl overflow-hidden"
            style={{ background: "#f1f5f9" }}
            initial={{ opacity: 0, y: 8 }}
            animate={showChart ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
            transition={{ duration: 0.45 }}
          >
            <div className="flex justify-between items-center px-3 pt-2">
              <span style={{ fontSize: 8, color: "#64748b", fontWeight: 600 }}>↑ COMPOUNDING GROWTH</span>
              <span style={{ fontSize: 8, color: "#16a34a", fontWeight: 700 }}>15 Years</span>
            </div>
            <div className="px-2 pb-1">
              <CompoundChart active={showChart} />
            </div>
          </motion.div>
        </motion.div>
      </motion.div>

      
    </div>
  );
}

// ─── Satellite card ───────────────────────────────────────────────────────────
function SatCard({ visible, from = "left", children, extraClass = "" }) {
  const xStart = from === "left" ? -28 : 28;
  return (
    <motion.div
      className={`rounded-2xl overflow-hidden ${extraClass}`}
      style={{
        background: "#fff",
        boxShadow: "0 8px 28px rgba(0,0,0,0.13), 0 1px 4px rgba(0,0,0,0.07)",
        border: "1px solid rgba(0,0,0,0.07)",
      }}
      initial={{ opacity: 0, x: xStart, y: 10 }}
      animate={visible ? { opacity: 1, x: 0, y: 0 } : { opacity: 0, x: xStart, y: 10 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

// ─── Phone + satellite cards (step driven, loops via key) ─────────────────────
function PhoneWithSatellites({ loopKey }) {
  const [step, setStep] = useState(1);
  useEffect(() => {
    setStep(1);
    const timers = STEP_MS.slice(1).map((t, i) =>
      setTimeout(() => setStep(i + 2), t)
    );
    return () => timers.forEach(clearTimeout);
  }, [loopKey]);

  const showLC1 = step >= 9;
  const showLC2 = step >= 10;
  const showRC1 = step >= 11;
  const showRC2 = step >= 12;

  return (
    <div className="relative flex items-center justify-center gap-6">
      {/* Left satellite cards */}
      <div className="flex flex-col gap-4 w-52 items-end">
        <SatCard visible={showLC1} from="left" extraClass="p-3 w-44">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
              <ShieldCheck size={16} className="text-primary" />
            </div>
            <div>
              <p className="text-[11px] font-semibold text-slate-800">AMFI-Registered Mutual Fund Distributor</p>
              <p className="text-[9px] text-slate-400 leading-tight">Certified & regulated</p>
            </div>
          </div>
        </SatCard>
        <SatCard visible={showLC2} from="left" extraClass="p-3.5 w-44">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-6 h-6 rounded-lg bg-green-50 flex items-center justify-center">
              <Target size={12} className="text-green-600" />
            </div>
            <span className="text-[10px] font-semibold text-slate-600">Retirement Goal</span>
          </div>
          <p className="text-lg font-bold text-slate-900 font-mono-num">₹4.2 Cr</p>
          <div className="flex items-center gap-1.5 mt-1.5">
            <div className="h-1.5 flex-1 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full rounded-full bg-green-500" style={{ width: "92%" }} />
            </div>
            <span className="text-[9px] font-bold text-green-600">92%</span>
          </div>
          <p className="text-[9px] text-slate-400 mt-0.5">On Track</p>
        </SatCard>
      </div>

      {/* Phone */}
      <PhoneAssembly step={step} />

      {/* Right satellite cards */}
      <div className="flex flex-col gap-4 w-52 items-start">
        <SatCard visible={showRC1} from="right" extraClass="p-3.5 w-44">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-6 h-6 rounded-lg bg-amber-50 flex items-center justify-center">
              <TrendingUp size={12} className="text-amber-600" />
            </div>
            <span className="text-[10px] font-semibold text-slate-600">Wealth Gain</span>
          </div>
          <p className="text-lg font-bold font-mono-num text-amber-600">₹74 Lakhs</p>
          <p className="text-[9px] text-slate-400 mt-0.5">Through Compounding</p>
        </SatCard>
        <SatCard visible={showRC2} from="right" extraClass="p-3.5 w-44">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-6 h-6 rounded-lg bg-accent/10 flex items-center justify-center">
              <Users size={12} className="text-accent" />
            </div>
            <span className="text-[10px] font-semibold text-slate-600">Families Guided</span>
          </div>
          <p className="text-lg font-bold text-slate-900 font-mono-num">100+</p>
          <p className="text-[9px] text-slate-400 mt-0.5">SIP ₹15K · 15 yrs</p>
        </SatCard>
      </div>
    </div>
  );
}

// ─── LEFT: Dream number stats ─────────────────────────────────────────────────
const DREAM_STATS = [
  { icon: Home,         iconColor: "#39C3EF", iconBg: "rgba(57,195,239,0.12)", label: "Dream Home in 10 Years",       sublabel: "₹10K/mo SIP @ 14% returns",       target: 2300000  },
  { icon: GraduationCap,iconColor: "#1DB954", iconBg: "rgba(29,185,84,0.12)",  label: "Child's Education in 15 Years",sublabel: "₹8K/mo SIP @ 13% returns",        target: 5500000  },
  { icon: Plane,        iconColor: "#F5A623", iconBg: "rgba(245,166,35,0.12)", label: "Retirement Corpus at 60",      sublabel: "₹15K/mo SIP @ 15% for 25 yrs",   target: 42000000 },
  { icon: TrendingUp,   iconColor: "#a78bfa", iconBg: "rgba(167,139,250,0.12)",label: "Wealth Gained via Compounding",sublabel: "On ₹27L invested over 15 years",  target: 7400000  },
];

const MILESTONES = [
  { label: "Retirement Goal",    pct: 92, color: "#1DB954" },
  { label: "Child Education",    pct: 67, color: "#39C3EF" },
  { label: "Emergency Fund",     pct: 100, color: "#F5A623" },
];

export default function HeroSection() {
  const [loopKey, setLoopKey] = useState(0);
  const [statsActive, setStatsActive] = useState(false);

  useEffect(() => {
    // Activate count-ups after a brief delay
    const t = setTimeout(() => setStatsActive(true), 600);
    // Loop the phone animation
    const loop = setInterval(() => setLoopKey(k => k + 1), LOOP_MS);
    return () => { clearTimeout(t); clearInterval(loop); };
  }, []);

  return (
    <section className="relative min-h-screen bg-dark grid-texture flex flex-col overflow-hidden">
      {/* Ambient glows */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/3 right-0 w-[400px] h-[400px] bg-secondary/8 rounded-full blur-[90px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-accent/5 rounded-full blur-[80px]" />
      </div>

      <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12 flex items-center w-full">
        <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">

          {/* ── LEFT: Dream numbers ──────────────────────────────────────── */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55 }}
            >
              <Badge icon={ShieldCheck} variant="white">
                AMFI-Registered Mutual Fund Distributor
              </Badge>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.65 }}
            >
              <h1 className="font-playfair text-4xl md:text-5xl lg:text-[3.1rem] font-bold text-white leading-[1.1] tracking-tight">
                Your Dream Life{" "}
                <span className="italic text-transparent bg-clip-text bg-gradient-to-r from-accent to-secondary">
                  Has a Number.
                </span>
                <br />Let's Hit It.
              </h1>
            </motion.div>

            <motion.p
              className="text-white/55 text-base leading-relaxed max-w-lg"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.28, duration: 0.6 }}
            >
              A ₹15,000/month SIP today becomes a crore tomorrow.
              See exactly what disciplined investing does to your future — no jargon, just numbers.
            </motion.p>

            {/* Dream stat cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {DREAM_STATS.map((s, i) => (
                <DreamStat key={s.label} {...s} delay={0.35 + i * 0.12} active={statsActive} />
              ))}
            </div>

            <motion.p
              className="text-white/30 text-xs"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.1, duration: 0.5 }}
            >
              * Illustrative projections only. Mutual Fund investments are subject to market risks.
            </motion.p>

            {/* Goal milestones */}
            {/* <motion.div
              className="glass rounded-2xl p-4 space-y-3"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.85, duration: 0.55 }}
            >
              <p className="text-white/50 text-xs font-semibold uppercase tracking-wider mb-3">Client Goal Progress</p>
              {MILESTONES.map((m, i) => (
                <MilestoneBar key={m.label} {...m} delay={0.9 + i * 0.15} active={statsActive} />
              ))}
            </motion.div> */}

            {/* CTAs */}
            <motion.div
              className="flex flex-wrap gap-3"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.0, duration: 0.5 }}
            >
              <Link to="/calculators">
                <Button variant="accent" size="lg">
                  Calculate My Number
                  <ArrowUpRight size={16} />
                </Button>
              </Link>
              <Link to="/contact#book">
                <Button variant="primary" size="lg">
                  Book a Consultation
                </Button>
              </Link>
            </motion.div>

            <motion.div
              className="flex flex-wrap items-center gap-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.15, duration: 0.5 }}
            >
              {["100+ Families", "₹60 Cr+ Distributed", "8+ Years"].map((item, i) => (
                <span key={i} className="flex items-center gap-2">
                  {i > 0 && <span className="w-1 h-1 bg-white/25 rounded-full" />}
                  <span className="text-white/40 text-sm font-mono-num">{item}</span>
                </span>
              ))}
            </motion.div>
          </div>

          {/* ── RIGHT: Store badges + Phone assembly animation ───────────── */}
          <div className="hidden lg:flex flex-col items-center gap-5">
            {/* App Store / Play Store badges — above the phone */}
            <motion.div
              className="flex items-center gap-3"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.0, duration: 0.5 }}
            >
              <a
                href="https://play.google.com/store/apps/details?id=com.iw.radds&pcampaignid=web_share"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-white/8 hover:bg-white/15 border border-white/15 hover:border-white/30 rounded-xl px-3 py-2.5 transition-all duration-200 hover:-translate-y-0.5"
              >
                <svg viewBox="0 0 24 24" className="w-6 h-6 flex-shrink-0" fill="none">
                  <path d="M3.18 23.76a2 2 0 0 0 2.05-.22l12.04-6.95-2.76-2.76-11.33 9.93z" fill="#EA4335"/>
                  <path d="M21.6 10.27a1.94 1.94 0 0 0 0 3.46l.05.03-3.3-1.9.03-.03 3.22-1.56z" fill="#FBBC04"/>
                  <path d="M3.18.24C2.5.6 2 1.34 2 2.27v19.46c0 .93.5 1.67 1.18 2.03l12.31-11.76L3.18.24z" fill="#4285F4"/>
                  <path d="M17.27 7.59L5.23.64a2 2 0 0 0-2.05-.4L14.51 12l2.76-4.41z" fill="#34A853"/>
                </svg>
                <div>
                  <p className="text-white/50 text-[10px] leading-none mb-0.5">Get it on</p>
                  <p className="text-white font-semibold text-sm leading-none">Google Play</p>
                </div>
              </a>
              <a
                href="https://apps.apple.com/in/app/radds-capital/id6744892358"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-white/8 hover:bg-white/15 border border-white/15 hover:border-white/30 rounded-xl px-3 py-2.5 transition-all duration-200 hover:-translate-y-0.5"
              >
                <svg viewBox="0 0 24 24" className="w-6 h-6 flex-shrink-0" fill="white">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                </svg>
                <div>
                  <p className="text-white/50 text-[10px] leading-none mb-0.5">Download on the</p>
                  <p className="text-white font-semibold text-sm leading-none">App Store</p>
                </div>
              </a>
            </motion.div>

            <PhoneWithSatellites loopKey={loopKey} />
          </div>

          {/* Mobile: phone below content */}
          <div className="flex lg:hidden justify-center">
            <PhoneWithSatellites loopKey={loopKey} />
          </div>
        </div>
      </div>

      {/* Scroll hint */}
      <div className="w-full flex justify-center pb-5">
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          className="flex flex-col items-center gap-1"
        >
          <span className="text-white/20 text-xs">Scroll to explore</span>
          <ChevronRight size={15} className="text-white/20 rotate-90" />
        </motion.div>
      </div>
    </section>
  );
}
