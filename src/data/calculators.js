export const calculators = [
  {
    id: "sip",
    slug: "sip",
    title: "SIP Calculator",

    // Legacy support
    description: "Find out how much your monthly SIP can grow over time.",

    // New overview page
    shortDescription:
      "Find out how much your monthly SIP can grow into over time with the power of compounding.",

    icon: "TrendingUp",
    category: "SIP Planning",
    route: "/calculators/sip",
    inputsSummary: "Monthly amount · Annual return · Duration",
    bestFor: "First-time investors building a habit",
  },

  {
    id: "swp",
    slug: "swp",
    title: "SWP Calculator",

    description:
      "Plan regular withdrawals from your mutual fund corpus.",

    shortDescription:
      "Plan regular monthly withdrawals from a corpus, with the remaining balance invested for potential growth.",

    icon: "ArrowDownCircle",
    category: "Withdrawals",
    route: "/calculators/swp",
    inputsSummary:
      "Corpus · Monthly withdrawal · Return · Duration",
    bestFor: "Retirees seeking steady monthly income",
  },

  {
    id: "cost-of-delay-sip",
    slug: "cost-of-delay-sip",
    title: "Cost of Delay SIP",

    description:
      "See how starting late impacts your wealth journey.",

    shortDescription:
      "See how much potential wealth you could miss out on by delaying your SIP — even by just a few years.",

    icon: "Clock",
    category: "Goal Planning",
    route: "/calculators/cost-of-delay-sip",
    inputsSummary:
      "Monthly SIP · Return · Horizon · Delay years",
    bestFor: "Anyone still waiting for the right time",
  },

  {
    id: "lumpsum",
    slug: "lumpsum",
    title: "Lumpsum Calculator",

    description:
      "Calculate returns on one-time investments at different rates.",

    shortDescription:
      "Calculate the future value of a one-time investment at different return rates and horizons.",

    icon: "Wallet",
    category: "Lumpsum",
    route: "/calculators/lumpsum",
    inputsSummary:
      "Investment amount · Annual return · Duration",
    bestFor: "Investing a bonus, inheritance, or windfall",
  },

  {
    id: "step-up-sip",
    slug: "step-up-sip",
    title: "Step-up SIP Calculator",

    description:
      "Model wealth growth when you increase your SIP annually.",

    shortDescription:
      "Model wealth growth when you increase your SIP amount annually, matching salary increments.",

    icon: "ArrowUpRight",
    category: "SIP Planning",
    route: "/calculators/step-up-sip",
    inputsSummary:
      "Starting SIP · Return · Duration · Annual Step-up %",
    bestFor: "Salaried professionals expecting yearly raises",
  },
  {
    id: "retirement",
    slug: "retirement",
    title: "Retirement Calculator",
    description: "Find out how large a corpus you'll need at retirement to sustain your lifestyle.",
    shortDescription:
      "See how much you'll need at retirement, adjusted for inflation, and how big a gap (if any) you need to close.",
    icon: "PiggyBank",
    category: "Retirement",
    route: "/calculators/retirement",
    inputsSummary: "Current age · Retirement age · Expenses · Existing corpus",
    bestFor: "Anyone planning how much they need to retire comfortably",
  },
];

export const calculatorCategories = [
  "All",
  "SIP",
  "Withdrawals",
  "Lumpsum",
  "Goal",
  "Retirement",
  "Loan",
  "Insurance",
];

// 3 new calculators
export const extraCalculators = [
  {
    id: "home-loan-interest-free",
    slug: "home-loan-interest-free",
    title: "Home Loan Interest Offset",
    description: "See how a parallel SIP can offset the interest you pay on your home loan.",
    shortDescription: "Run a SIP alongside your home loan to see how it could grow and help offset the total interest you pay over time.",
    icon: "Home",
    category: "Loan Planning",
    route: "/calculators/home-loan-interest-free",
    inputsSummary: "Loan amount · EMI · Tenure · Interest rate",
    bestFor: "Home loan borrowers who invest regularly",
  },
  {
    id: "net-worth",
    slug: "net-worth",
    title: "Net Worth Calculator",
    description: "Add up all your assets and liabilities to know exactly where you stand.",
    shortDescription: "Calculate your true net worth by totalling financial assets, physical assets, and subtracting all liabilities.",
    icon: "PieChart",
    category: "Goal Planning",
    route: "/calculators/net-worth",
    inputsSummary: "Financial assets · Physical assets · Liabilities",
    bestFor: "Anyone wanting a clear financial snapshot",
  },
  {
    id: "term-insurance",
    slug: "term-insurance",
    title: "Term Cover SIP Offset Tool",
    description: "Offset your term insurance premiums by running a parallel SIP.",
    shortDescription: "Invest the equivalent of your term insurance premium in a SIP — see how the corpus can cover total premiums paid over the policy tenure.",
    icon: "Shield",
    category: "Insurance",
    route: "/calculators/term-insurance",
    inputsSummary: "Annual premium · SIP amount · Tenure · Growth rate",
    bestFor: "Term insurance holders who want to offset premium cost",
  },
];


calculators.push(...extraCalculators);
