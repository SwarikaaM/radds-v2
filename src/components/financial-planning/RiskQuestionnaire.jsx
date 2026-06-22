import { useState } from "react";
import { X, ChevronRight, RotateCcw } from "lucide-react";

const QUESTIONS = [
  {
    id: "q1",
    text: "What is your primary investment goal?",
    options: [
      { label: "Preserve capital — I don't want to lose money", score: 1 },
      { label: "Steady income with some growth", score: 2 },
      { label: "Balanced growth and income", score: 3 },
      { label: "Long-term wealth creation", score: 4 },
      { label: "Maximum growth — I can accept high volatility", score: 5 },
    ],
  },
  {
    id: "q2",
    text: "How long can you stay invested without needing the money?",
    options: [
      { label: "Less than 1 year", score: 1 },
      { label: "1 – 3 years", score: 2 },
      { label: "3 – 5 years", score: 3 },
      { label: "5 – 10 years", score: 4 },
      { label: "More than 10 years", score: 5 },
    ],
  },
  {
    id: "q3",
    text: "If your portfolio dropped 20% in a month, what would you do?",
    options: [
      { label: "Sell everything immediately", score: 1 },
      { label: "Sell some to reduce exposure", score: 2 },
      { label: "Hold and wait for recovery", score: 3 },
      { label: "Hold and invest a small additional amount", score: 4 },
      { label: "Invest significantly more — great opportunity", score: 5 },
    ],
  },
  {
    id: "q4",
    text: "What percentage of your monthly income can you invest without affecting your lifestyle?",
    options: [
      { label: "Less than 5%", score: 1 },
      { label: "5 – 10%", score: 2 },
      { label: "10 – 20%", score: 3 },
      { label: "20 – 30%", score: 4 },
      { label: "More than 30%", score: 5 },
    ],
  },
  {
    id: "q5",
    text: "How would you describe your investment experience?",
    options: [
      { label: "No experience — first time investing", score: 1 },
      { label: "Basic — only Fixed Deposits or PPF", score: 2 },
      { label: "Some — invested in mutual funds before", score: 3 },
      { label: "Moderate — understand equity and debt funds", score: 4 },
      { label: "Experienced — comfortable with direct equities", score: 5 },
    ],
  },
  {
    id: "q6",
    text: "What is your current financial situation?",
    options: [
      { label: "High debt, limited savings", score: 1 },
      { label: "Some debt, minimal emergency fund", score: 2 },
      { label: "Debt under control, 3-month emergency fund", score: 3 },
      { label: "Low debt, 6-month emergency fund", score: 4 },
      { label: "Debt-free, 12+ month emergency fund", score: 5 },
    ],
  },
];

function getProfile(score) {
  if (score <= 8)
    return {
      label: "conservative",
      display: "Conservative",
      color: "#0e7490",
      bg: "#ecfeff",
      border: "#a5f3fc",
      desc: "You prioritise capital safety over returns. Debt funds, liquid funds, and Fixed Deposits suit your profile best.",
    };
  if (score <= 16)
    return {
      label: "moderate",
      display: "Moderate",
      color: "#92400e",
      bg: "#fffbeb",
      border: "#fde68a",
      desc: "You seek a balance of growth and safety. Hybrid funds and a mix of equity and debt are appropriate for you.",
    };
  return {
    label: "aggressive",
    display: "Aggressive",
    color: "#166534",
    bg: "#f0fdf4",
    border: "#86efac",
    desc: "You can tolerate market volatility for higher long-term returns. Equity and small-cap funds suit your profile.",
  };
}

export default function RiskQuestionnaire({ onResult, currentProfile }) {
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);

  function handleAnswer(score) {
    const updated = { ...answers, [QUESTIONS[current].id]: score };
    setAnswers(updated);
    if (current < QUESTIONS.length - 1) {
      setCurrent((c) => c + 1);
    } else {
      const total = Object.values(updated).reduce((s, v) => s + v, 0);
      const profile = getProfile(total);
      setResult(profile);
    }
  }

  function handleApply() {
    if (result) {
      onResult(result.label);
      setOpen(false);
      resetQuiz();
    }
  }

  function resetQuiz() {
    setCurrent(0);
    setAnswers({});
    setResult(null);
  }

  const progress = ((current + (result ? 1 : 0)) / QUESTIONS.length) * 100;

  return (
    <>
      {/* Trigger button */}
      <button
        onClick={() => setOpen(true)}
        className="text-xs text-[#22568F] underline underline-offset-2 hover:text-[#1a4070] transition-colors font-medium mt-1"
      >
        Not sure? Take the risk profiling quiz →
      </button>

      {/* Modal overlay */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: "rgba(13,27,46,0.55)" }}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden"
            style={{ maxHeight: "90vh", overflowY: "auto" }}>
            {/* Header */}
            <div className="bg-[#22568F] px-6 py-4 flex items-center justify-between">
              <div>
                <p className="text-white font-semibold text-base">Risk Profile Questionnaire</p>
                <p className="text-white/60 text-xs mt-0.5">
                  {result ? "Your result" : `Question ${current + 1} of ${QUESTIONS.length}`}
                </p>
              </div>
              <button onClick={() => { setOpen(false); resetQuiz(); }}
                className="text-white/70 hover:text-white transition-colors">
                <X size={20} />
              </button>
            </div>

            {/* Progress bar */}
            {!result && (
              <div className="h-1 bg-[#E2EBF5]">
                <div className="h-1 bg-[#22568F] transition-all duration-300"
                  style={{ width: `${progress}%` }} />
              </div>
            )}

            {result ? (
              /* Result screen */
              <div className="p-6 space-y-4">
                <div className="rounded-xl border p-5 text-center"
                  style={{ background: result.bg, borderColor: result.border }}>
                  <p className="text-xs font-medium uppercase tracking-widest mb-1"
                    style={{ color: result.color }}>Your Risk Profile</p>
                  <p className="text-3xl font-bold mb-2" style={{ color: result.color }}>
                    {result.display}
                  </p>
                  <p className="text-sm text-[#3D4F66] leading-relaxed">{result.desc}</p>
                </div>

                <p className="text-xs text-[#6B7E99] text-center leading-relaxed">
                  This is an indicative assessment only and does not constitute investment advice. 
                  Mutual fund suitability depends on multiple factors. Please consult your distributor.
                </p>

                <div className="flex gap-3 pt-1">
                  <button onClick={resetQuiz}
                    className="flex items-center gap-1.5 text-sm border border-[#D1DDE8] rounded-lg px-4 py-2.5 text-[#6B7E99] hover:text-[#22568F] hover:border-[#22568F] transition-colors">
                    <RotateCcw size={13} /> Retake
                  </button>
                  <button onClick={handleApply}
                    className="flex-1 bg-[#22568F] text-white font-semibold text-sm rounded-lg px-4 py-2.5 hover:bg-[#1a4070] transition-colors flex items-center justify-center gap-1.5">
                    Apply "{result.display}" to my plan <ChevronRight size={15} />
                  </button>
                </div>
              </div>
            ) : (
              /* Question screen */
              <div className="p-6 space-y-4">
                <p className="font-semibold text-[#0D1B2E] text-base leading-snug">
                  {QUESTIONS[current].text}
                </p>
                <div className="space-y-2">
                  {QUESTIONS[current].options.map((opt) => (
                    <button
                      key={opt.label}
                      onClick={() => handleAnswer(opt.score)}
                      className="w-full text-left px-4 py-3 rounded-xl border border-[#E2EBF5] text-sm text-[#3D4F66] hover:border-[#22568F] hover:bg-[#22568F]/5 hover:text-[#22568F] transition-all duration-150 font-medium"
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}