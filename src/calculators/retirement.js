/**
 * Retirement Corpus Calculator
 * Projects the corpus required at retirement to sustain inflation-adjusted
 * monthly expenses through retirement, and compares it against the
 * future value of your existing corpus.
 *
 * requiredCorpus = PV of an inflation-adjusted annuity-due, discounted at the
 * "real" post-retirement return (post-retirement return net of inflation).
 */
export function calcRetirement(
  currentAge,
  retirementAge,
  monthlyExpenses,
  existingCorpus,
  lifeExpectancy,
  preReturn,
  postReturn,
  inflation
) {
  const yearsToRetirement = Math.max(retirementAge - currentAge, 0);
  const yearsInRetirement = Math.max(lifeExpectancy - retirementAge, 1);

  const futureMonthlyExpense = monthlyExpenses * Math.pow(1 + inflation / 100, yearsToRetirement);
  const futureAnnualExpense = futureMonthlyExpense * 12;

  const realReturn = (1 + postReturn / 100) / (1 + inflation / 100) - 1;

  let requiredCorpus;
  if (Math.abs(realReturn) < 0.0001) {
    requiredCorpus = futureAnnualExpense * yearsInRetirement;
  } else {
    requiredCorpus =
      ((futureAnnualExpense * (1 - Math.pow(1 + realReturn, -yearsInRetirement))) / realReturn) *
      (1 + realReturn);
  }

  const currentCorpusFV = existingCorpus * Math.pow(1 + preReturn / 100, yearsToRetirement);
  const shortfall = Math.max(requiredCorpus - currentCorpusFV, 0);

  let suggestedMonthlySIP = 0;
  if (shortfall > 0 && yearsToRetirement > 0) {
    const r = preReturn / 12 / 100;
    const n = yearsToRetirement * 12;
    const factor = r === 0 ? n : ((Math.pow(1 + r, n) - 1) / r) * (1 + r);
    suggestedMonthlySIP = Math.round(shortfall / factor);
  }

  return {
    currentCorpus: Math.round(existingCorpus),
    requiredCorpus: Math.round(requiredCorpus),
    shortfall: Math.round(shortfall),
    suggestedMonthlySIP,
  };
}

export function buildRetirementChartData(
  currentAge,
  retirementAge,
  monthlyExpenses,
  existingCorpus,
  lifeExpectancy,
  preReturn,
  postReturn,
  inflation
) {
  const { requiredCorpus } = calcRetirement(
    currentAge, retirementAge, monthlyExpenses, existingCorpus,
    lifeExpectancy, preReturn, postReturn, inflation
  );
  const years = Math.max(retirementAge - currentAge, 1);
  return Array.from({ length: years }, (_, i) => {
    const y = i + 1;
    const corpus = existingCorpus * Math.pow(1 + preReturn / 100, y);
    return {
      year: y,
      age: currentAge + y,
      corpus: Math.round(corpus),
      required: Math.round(requiredCorpus),
    };
  });
}

export const retirementConfig = {
  slug: "retirement",
  title: "Retirement Calculator",
  shortTitle: "Retirement",
  description:
    "Find out how large a corpus you'll need at retirement to sustain your current lifestyle, adjusted for inflation.",
  inputs: [
    {
      key: "currentAge",
      label: "Current Age",
      prefix: "",
      suffix: " Yrs",
      min: 18,
      max: 65,
      step: 1,
      default: 30,
      helper: "Your age today",
    },
    {
      key: "retirementAge",
      label: "Desired Retirement Age",
      prefix: "",
      suffix: " Yrs",
      min: 40,
      max: 75,
      step: 1,
      default: 60,
      helper: "Age you plan to stop working",
    },
    {
      key: "monthlyExpenses",
      label: "Current Monthly Expenses",
      prefix: "₹",
      suffix: "",
      min: 10000,
      max: 1000000,
      step: 5000,
      default: 50000,
      helper: "Your current monthly household expenses",
    },
    {
      key: "existingCorpus",
      label: "Existing Corpus",
      prefix: "₹",
      suffix: "",
      min: 0,
      max: 100000000,
      step: 25000,
      default: 500000,
      helper: "Retirement savings you already have",
    },
    {
      key: "lifeExpectancy",
      label: "Life Expectancy",
      prefix: "",
      suffix: " Yrs",
      min: 60,
      max: 100,
      step: 1,
      default: 85,
      helper: "Age until which the corpus should last",
    },
    {
      key: "preReturn",
      label: "Expected Return (Pre-retirement)",
      prefix: "",
      suffix: "% p.a.",
      min: 1,
      max: 20,
      step: 0.5,
      default: 12,
      decimals: 1,
      helper: "Growth rate while you're still investing",
    },
    {
      key: "postReturn",
      label: "Expected Return (Post-retirement)",
      prefix: "",
      suffix: "% p.a.",
      min: 1,
      max: 15,
      step: 0.5,
      default: 8,
      decimals: 1,
      helper: "Conservative growth rate during retirement",
    },
    {
      key: "inflation",
      label: "Expected Inflation Rate",
      prefix: "",
      suffix: "% p.a.",
      min: 1,
      max: 12,
      step: 0.5,
      default: 6,
      decimals: 1,
      helper: "Long-term average inflation assumption",
    },
  ],
  summaryKeys: [
    { key: "currentCorpus", label: "Existing Corpus (Today)", color: "primary" },
    { key: "requiredCorpus", label: "Required Corpus (at Retirement)", color: "gradient" },
    { key: "shortfall", label: "Corpus Shortfall", color: "warning" },
    { key: "suggestedMonthlySIP", label: "Suggested Monthly SIP to Close Gap", color: "success" },
  ],
  chartSeries: [
    { key: "corpus", name: "Projected Corpus", color: "#22568F" },
    { key: "required", name: "Required Corpus", color: "#F5A623" },
  ],
  tableColumns: ["Year", "Age", "Projected Corpus", "Required Corpus"],
  tableRowKeys: ["year", "age", "corpus", "required"],
  faqs: [
    {
      question: "How is the required retirement corpus calculated?",
      answer:
        "We inflate your current monthly expenses to your retirement year, then calculate the lump sum needed at retirement to sustain that (inflation-adjusted) spending for your expected years in retirement, using your post-retirement return assumption net of inflation.",
    },
    {
      question: "Why does inflation matter so much for retirement planning?",
      answer:
        "Even at a modest 6% inflation, expenses roughly double every 12 years. A monthly expense of ₹50,000 today could be over ₹2 lakh in 25 years. Ignoring inflation is the most common reason retirement plans fall short.",
    },
    {
      question: "What return rate should I assume post-retirement?",
      answer:
        "Most planners recommend a more conservative, capital-protection-oriented allocation after retirement (debt-heavy, some equity), typically yielding 7–9% p.a., versus a growth-oriented pre-retirement portfolio which can target 12%+ p.a.",
    },
    {
      question: "What if I already have a shortfall?",
      answer:
        "The calculator shows the additional monthly SIP needed, invested at your pre-retirement return assumption, to close the gap by your target retirement age. Starting early — even with a smaller amount — meaningfully reduces the required monthly investment thanks to compounding.",
    },
    {
      question: "Are these projections guaranteed?",
      answer:
        "No. Return, inflation, and life expectancy are assumptions, not guarantees. Actual market returns fluctuate and inflation varies year to year. Revisit this calculator periodically and consult a SEBI Registered Investment Adviser for personalised retirement planning.",
    },
  ],
};