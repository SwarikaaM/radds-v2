import {
  TrendingUp,
  Shield,
  BarChart3,
  Repeat,
  FileText,
  Landmark,
  Lock,
  Target,
  PieChart,
} from "lucide-react";

export const serviceDetails = {
  "mutual-funds": {
    name: "Mutual Funds",
    tagline: "Invest With Purpose. Build Wealth With Discipline.",
    icon: TrendingUp,
    description:
      "Whether you're planning for your child's education, retirement, buying your dream home, or creating long-term wealth, mutual funds offer a flexible and disciplined way to participate in the growth potential of financial markets. At Radds Capital, we help investors understand mutual funds, identify suitable investment options based on their financial goals, investment horizon and risk profile, and support them throughout their investment journey.",
    steps: [
      "Understand Your Financial Goals",
      "Assess Risk Profile",
      "Select Suitable Mutual Fund Solutions",
      "Simple Digital Investment Process",
      "Regular Portfolio Reviews",
      "Support Through Market Cycles",
    ],
    benefits: [
      { title: "Start Investing with Convenience", description: "Begin your investment journey through a Systematic Investment Plan (SIP) or invest a lump sum depending on your financial situation and goals." },
      { title: "Professional Fund Management", description: "Each scheme is managed by experienced fund managers who make investment decisions in accordance with the scheme's investment objective." },
      { title: "Diversification", description: "A mutual fund typically invests across multiple securities, sectors or asset classes, helping reduce concentration risk." },
      { title: "Liquidity", description: "Most open-ended mutual fund schemes allow investors to redeem their investments, subject to applicable exit loads and scheme-specific conditions." },
      { title: "Goal-Based Investing", description: "Different categories of mutual funds can help investors pursue different financial goals such as wealth creation, income generation or capital preservation." },
      { title: "Transparent & Regulated", description: "Mutual funds in India are regulated by SEBI and operate under a transparent regulatory framework with regular disclosures." },
    ],
    categories: [
      { goal: "Long-Term Wealth Creation", type: "Equity Mutual Funds", description: "Designed for investors seeking long-term capital appreciation by investing primarily in equity and equity-related instruments." },
      { goal: "Stability & Income", type: "Debt Mutual Funds", description: "Invest primarily in fixed-income securities and may be considered for short- to medium-term financial goals, depending on the scheme." },
      { goal: "Balanced Approach", type: "Hybrid Mutual Funds", description: "Combine equity and debt investments to provide diversified exposure within a single scheme." },
      { goal: "Tax Saving", type: "ELSS (Equity Linked Savings Scheme)", description: "Offers tax benefits under applicable provisions of the Income Tax Act while investing primarily in equities, subject to a statutory lock-in period." },
      { goal: "International Exposure", type: "International Funds", description: "Provide investors with exposure to overseas markets through permitted investment structures." },
      { goal: "Gold Allocation", type: "Gold ETFs & Gold Funds", description: "Allow investors to gain exposure to gold without holding physical gold." },
    ],
    whyChooseUs: [
      { title: "Goal-Focused Approach", description: "We begin with your financial goals rather than recommending products." },
      { title: "Experienced Guidance", description: "Our team assists investors in understanding mutual funds and building disciplined investment habits." },
      { title: "Long-Term Relationship", description: "We believe investing is a journey, not a one-time transaction." },
      { title: "Investor Education", description: "We regularly share educational insights to help investors make informed decisions." },
      { title: "Digital Convenience", description: "Invest, track and manage your investments with a smooth digital experience." },
      { title: "Ongoing Support", description: "From your first SIP to long-term wealth creation, we're here to support your investment journey." },
    ],
    audience: [
      { title: "The 25-Year-Old Who Hasn't Started", description: "Every year you wait costs you years of compounding you can't buy back later." },
      { title: "The Parent Watching the Clock", description: "School fees and college costs are coming whether you've saved for them or not." },
      { title: "The Saver Tired of FD Returns", description: "If inflation is quietly eating your savings, it's time your money worked harder." },
    ],
    risks: [
      "Market volatility can affect returns.",
      "Returns are not guaranteed.",
      "Short-term losses are possible.",
    ],
    faqs: [
      { question: "What is a SIP?", answer: "A Systematic Investment Plan (SIP) allows you to invest a fixed amount at regular intervals in a mutual fund scheme." },
      { question: "Is SIP better than a lump sum investment?", answer: "The appropriate option depends on your financial situation, investment horizon, market conditions and overall financial goals." },
      { question: "Are mutual funds safe?", answer: "Mutual funds are regulated by SEBI. However, the value of investments can fluctuate based on market conditions. Investors should understand the risks associated with the scheme before investing." },
      { question: "Can I withdraw my money anytime?", answer: "Most open-ended mutual funds allow redemption, subject to scheme-specific conditions, exit loads or lock-in periods where applicable." },
      { question: "How much should I invest?", answer: "The investment amount depends on your financial goals, income, expenses, investment horizon and risk profile." },
      { question: "What happens if markets decline?", answer: "Market fluctuations are a normal part of investing. Staying invested with discipline and reviewing your portfolio periodically can be important aspects of long-term investing." },
    ],
    related: ["sip-planning", "goal-based-planning", "portfolio-review"],
    ctaHeadline: "Start Your Investment Journey Today",
    ctaSubtext: "Whether you're investing for the first time, reviewing your existing portfolio or planning for long-term financial goals, our team is here to help you build a disciplined investment approach.",
  },

  "life-health-insurance": {
    name: "Life & Health Insurance",
    tagline: "Cover is cheap until the day you actually need it.",
    icon: Shield,
    description:
      "Nobody plans to get sick or worse — that's exactly the problem. One serious diagnosis, one hospital stay, or one income lost overnight can erase years of careful saving. Insurance is the one thing that's easy and affordable to get while you're healthy, and the hardest thing to get once you're not. Get it now, while the door is still open.",
    steps: [
      "Assess coverage requirements",
      "Compare suitable plans",
      "Complete application process",
      "Review coverage periodically",
    ],
    benefits: [
      { title: "Your Family Isn't Left to Figure It Out", description: "If something happens to you, your family doesn't also have to face a financial crisis." },
      { title: "One Hospital Bill Won't Undo Years of Saving", description: "Medical costs are rising every year — cover protects the wealth you've already built." },
      { title: "Sleep Easier", description: "Knowing the worst-case is financially covered changes how you live the everyday case." },
      { title: "Lock In a Lower Premium Now", description: "Premiums only go up with age and health issues — the cheapest day to buy is today." },
    ],
    audience: [
      { title: "The Sole Earner", description: "If your income stops, does everything your family depends on stop with it?" },
      { title: "The Parent", description: "Your children's future shouldn't depend on nothing ever going wrong." },
      { title: "The Business Owner", description: "Personal and business risk are more connected than most owners realise." },
    ],
    risks: [
      "Insufficient coverage may leave protection gaps.",
      "Policy terms vary significantly.",
      "Delayed disclosure can impact claims.",
    ],
    faqs: [
      { question: "Why do I need life insurance?", answer: "It provides financial protection to your family if something happens to you." },
      { question: "How much coverage should I have?", answer: "Coverage should align with income, liabilities, and family needs." },
      { question: "What is health insurance?", answer: "It helps cover hospitalization and medical expenses." },
      { question: "Can I have multiple policies?", answer: "Yes, many individuals maintain multiple policies." },
      { question: "When should I buy insurance?", answer: "The earlier you buy, the lower premiums generally are." },
    ],
    related: ["goal-based-planning", "portfolio-review", "retirement-planning"],
    // life-health-insurance
    ctaHeadline: "Don't wait for a reason to need this.",
    ctaSubtext: "The cheapest day to get covered is today. Let's find the right plan while you still qualify for it.",
  },

  "equity-shares": {
    name: "Equity",
    tagline: "Stop watching other people's portfolios grow.",
    icon: BarChart3,
    description:
      "Every time a company you admire grows, someone who owns its shares grows with it — and someone who doesn't, watches. Direct equity gives you ownership in the businesses actually driving India's growth, through our broking partner, for investors ready to participate in that growth rather than just read about it.",
    externalCta: {
      label: "Open a Demat Account",
      url: "https://register.iiflcapital.com/?E1Code=L5hZBjAbE2xVbHG+SVwywQ==&SourceChannelID=KBWtK3WkgyXc2SanaseYhg==",
    },
      steps: [
      "Define investment objectives",
      "Open a trading account",
      "Explore investment opportunities via our broking partner",
      "Monitor your holdings",
    ],
    benefits: [
      { title: "Own the Growth, Don't Just Watch It", description: "Direct ownership means the upside is yours, not someone else's." },
      { title: "Built for the Long Game", description: "Equity has historically rewarded patience more than any other asset class." },
      { title: "Liquidity When You Need It", description: "Buy and sell on the exchange — your capital isn't locked away." },
      { title: "Income Beyond Price Growth", description: "Many companies pay dividends — a second stream on top of capital appreciation." },
    ],
    audience: [
      { title: "The Investor Ready to Go Direct", description: "If you understand markets and want more control, mutual funds alone may feel limiting." },
      { title: "The Long-Term Wealth Builder", description: "Comfortable riding out short-term noise for long-term gain." },
      { title: "The Hands-On Investor", description: "Wants to actually follow and understand what they own." },
    ],
    risks: [
      "Higher market volatility.",
      "Potential capital loss.",
      "Requires ongoing monitoring.",
    ],
    faqs: [
      { question: "Are stocks risky?", answer: "Yes, stock prices fluctuate and can result in losses." },
      { question: "Can stocks beat inflation?", answer: "Historically, equities have outpaced inflation over long periods." },
      { question: "How much should I invest?", answer: "It depends on goals, income, and risk tolerance." },
      { question: "Do stocks provide regular income?", answer: "Some companies distribute dividends." },
      { question: "Should beginners invest in stocks?", answer: "Beginners often start with diversified strategies first." },
    ],
    related: ["mutual-funds", "portfolio-review", "sip-planning"],
     // equity-shares
    ctaHeadline: "Ready to own it, not just watch it?",
    ctaSubtext: "Get direct market access through our broking partner — built for investors ready to participate.",
  },

  "nps": {
    name: "NPS",
    tagline: "Build your retirement corpus with NPS.",
    icon: Landmark,
    description:
      "The salary stops the day you retire — but your expenses don't. NPS is a government-backed pension product that turns small, regular contributions today into a structured retirement corpus and income tomorrow, while you're still earning to fund it.",
    steps: [
      "Understand NPS account types (Tier I / Tier II)",
      "Choose your asset allocation",
      "Make regular contributions",
      "Review your allocation periodically",
    ],
    benefits: [
      { title: "A Pension You Actually Control", description: "Government-backed, but the contribution pace is yours to set." },
      { title: "Tax Benefits Today", description: "Potential tax advantages under applicable sections while you save." },
      { title: "Income When the Salary Stops", description: "Annuity options designed to pay you after you retire." },
      { title: "Among the Lowest-Cost Options", description: "More of your contribution stays invested, not eaten by fees." },
    ],
    audience: [
      { title: "The Early Starter", description: "The earlier the first contribution, the smaller every contribution after it needs to be." },
      { title: "The Mid-Career Professional", description: "Still time to build a meaningful corpus — but the window is closing." },
      { title: "The Pre-Retiree", description: "The last few years before retirement are for fine-tuning, not starting from zero." },
    ],
    risks: [
      "Returns are market-linked and not guaranteed.",
      "Partial withdrawal rules apply.",
      "Annuitization is mandatory on a portion at maturity.",
    ],
    faqs: [],
    related: ["retirement-planning", "goal-based-planning", "portfolio-review"],
    // nps
    ctaHeadline: "Your pension won't build itself.",
    ctaSubtext: "Start your NPS contribution now, while you still have the most working years left to build it.",
  },

  "fixed-deposits-bonds": {
    name: "Fixed Deposits & Bonds",
    tagline: "Not every rupee should be fighting for growth.",
    icon: Lock,
    description:
      "Chasing returns on every rupee you have is how people end up exposed when they can least afford it. Some money — your emergency fund, a near-term goal, a senior parent's savings — needs to simply be safe and predictable. Fixed deposits and bonds are where that money belongs.",
    steps: [
      "Assess income needs",
      "Choose suitable products",
      "Allocate funds",
      "Monitor maturity schedule",
    ],
    benefits: [
      { title: "Predictable, Not a Guessing Game", description: "You know roughly what you'll get and when." },
      { title: "Your Principal Stays Protected", description: "Built for capital preservation, not capital risk." },
      { title: "Steady Interest Income", description: "Useful for anyone who needs regular, dependable payouts." },
      { title: "A Counterbalance to Riskier Holdings", description: "Stability that lets the rest of your portfolio take calculated risks." },
    ],
    audience: [
      { title: "The Risk-Averse Saver", description: "Wants growth on their terms — slow, steady, and certain." },
      { title: "The Retiree Needing Income Now", description: "Can't afford to wait out a market downturn." },
      { title: "Anyone Parking Money for a Near-Term Goal", description: "A goal 1–3 years away shouldn't be sitting in volatile assets." },
    ],
    risks: [
      "Inflation may reduce real returns.",
      "Interest rates may change.",
      "Some bonds carry credit risk.",
    ],
    faqs: [],
    related: ["retirement-planning", "portfolio-review", "goal-based-planning"],
    // fixed-deposits-bonds
    ctaHeadline: "Some money just needs to be safe.",
    ctaSubtext: "Talk to us about parking your near-term goals or emergency fund in capital-safe options.", 
  },

  "sip-planning": {
    name: "SIP Planning",
    tagline: "The investors who win are the ones who never stopped.",
    icon: Repeat,
    description:
      "Most people lose money in markets not by investing badly, but by waiting for the 'right time' and never starting — or by stopping the moment things get volatile. A SIP removes that decision entirely. The same amount, on the same date, every month, regardless of how you feel about the market that day.",
    steps: [
      "Define goals",
      "Choose investment amount",
      "Select suitable funds",
      "Track progress",
    ],
    benefits: [
      { title: "Removes the Guesswork", description: "No need to time the market — your SIP buys through every high and low automatically." },
      { title: "Starts Where You Are", description: "Begin with what you can afford today; scale it up as your income grows." },
      { title: "Builds the Habit, Not Just the Corpus", description: "Consistency compounds — in your discipline and in your money." },
      { title: "Smooths Out Market Swings", description: "Rupee cost averaging means volatility works for you over time, not against you." },
    ],
    audience: [
      { title: "The First-Time Investor", description: "Don't know where to start? A SIP is the simplest first step there is." },
      { title: "The Salaried Professional", description: "Turn one fixed deduction into a habit you barely notice and a corpus you will." },
      { title: "Anyone Who's Tried and Stopped Before", description: "If you've started and quit before, this is built to make stopping the hard part." },
    ],
    risks: [
      "Returns depend on market performance.",
      "Stopping SIPs frequently may impact goals.",
      "Short-term volatility remains possible.",
    ],
    faqs: [
      { question: "What is SIP?", answer: "A method of investing fixed amounts regularly into mutual funds." },
      { question: "Can I stop SIP anytime?", answer: "Yes, SIPs are generally flexible." },
      { question: "Does SIP guarantee returns?", answer: "No, returns depend on markets." },
      { question: "Can I increase SIP amount?", answer: "Yes, many funds support step-up SIPs." },
      { question: "How long should I continue?", answer: "Longer durations generally improve outcomes." },
    ],
    related: ["mutual-funds", "goal-based-planning", "portfolio-review"],
    // sip-planning
    ctaHeadline: "Ready to stop waiting for the 'right time'?",
    ctaSubtext: "Set up a SIP this week and let the habit do the heavy lifting from here.",  
  },

  "tax-planning": {
    name: "Tax Planning",
    tagline: "That tax is getting paid either way.",
    icon: FileText,
    description:
      "Every March, a chunk of your income disappears into taxes — that part is non-negotiable. What is negotiable is whether that money also builds your wealth on the way out the door. Tax-saving instruments turn a mandatory outflow into an investment that's working for you.",
    steps: [
      "Review tax liabilities",
      "Identify eligible deductions",
      "Select tax-efficient investments",
      "Review annually",
    ],
    benefits: [
      { title: "Money That Was Leaving Anyway, Now Working", description: "Redirect what you'd pay in tax into something that grows." },
      { title: "Shortest Lock-In Among 80C Options", description: "ELSS typically ties up your money for less time than other tax-saving choices." },
      { title: "Wealth Creation, Not Just Tax Saving", description: "Equity-linked exposure means growth potential alongside the deduction." },
      { title: "One Less Scramble in March", description: "Plan it through the year instead of a last-minute rush before the deadline." },
    ],
    audience: [
      { title: "The Salaried Employee", description: "Watching deductions reduce take-home pay every month? This claws some back." },
      { title: "The High-Bracket Earner", description: "The higher your slab, the more a missed deduction actually costs you." },
      { title: "The Last-Minute Filer", description: "If March 31st always catches you off guard, a plan now avoids the scramble." },
    ],
    risks: [
      "Tax laws can change.",
      "Investment returns are not guaranteed.",
      "Incorrect planning may reduce efficiency.",
    ],
    faqs: [],
    related: ["mutual-funds", "sip-planning", "goal-based-planning"],
    // tax-planning
    ctaHeadline: "Don't let March catch you off guard.",
    ctaSubtext: "Plan your 80C investments now and make tax season a non-event.", 
  },

  "retirement-planning": {
    name: "Retirement Planning",
    tagline: "The years to prepare are fewer than you think.",
    icon: Landmark,
    description:
      "Retirement doesn't feel urgent until it's close — and by then, the years that would have made it easiest to prepare are already gone. This is curated mutual fund and pension-linked scheme guidance built around your retirement timeline, started now while time is still the one advantage that's free.",
    steps: [
      "Understand your retirement goal and timeline",
      "Assess your current investments",
      "Get curated mutual fund / NPS scheme suggestions",
      "Review and rebalance periodically",
    ],
    benefits: [
      { title: "A Number to Actually Aim For", description: "Stop guessing — work toward a real target corpus." },
      { title: "Curated, Not Random", description: "Mutual fund and pension-linked options matched to your retirement horizon." },
      { title: "Tax-Efficient Where Possible", description: "Schemes chosen with potential tax advantages in mind." },
      { title: "Reviewed as Retirement Gets Closer", description: "The plan adjusts as your timeline shortens, not after it's too late." },
    ],
    audience: [
      { title: "The 30-Something Who Hasn't Started", description: "The single biggest cost of waiting is the compounding you forfeit." },
      { title: "The Mid-Career Saver", description: "Still enough runway to build a meaningful corpus — if it starts now." },
      { title: "The Pre-Retiree Fine-Tuning the Final Stretch", description: "Less time for risk, more need for a clear, realistic number." },
    ],
    risks: [
      "Inflation may reduce purchasing power over time.",
      "Starting late may require larger contributions.",
      "Market-linked schemes can fluctuate in value.",
    ],
    faqs: [],
    related: ["nps", "goal-based-planning", "mutual-funds"],
    // retirement-planning
    ctaHeadline: "The best time to start was years ago. The next best time is now.",
    ctaSubtext: "Get a retirement corpus number to work toward, and a plan to get there.",  
  },

  "goal-based-planning": {
    name: "Goal-Based Planning",
    tagline: "Your goals don't come with a payment plan. This does.",
    icon: Target,
    description:
      "A child's education, a wedding, a down payment — none of these arrive with an invoice you can budget for in advance. They just arrive, and the money either is there or it isn't. Goal-based planning maps your investments directly to each milestone, so 'I hope it's enough' is replaced with an actual number and a plan to reach it.",
    steps: [
      "Define goals",
      "Estimate future costs",
      "Create investment plan",
      "Track progress regularly",
    ],
    benefits: [
      { title: "Every Goal Gets Its Own Plan", description: "Education, a home, a wedding — each tracked on its own timeline, not lumped together." },
      { title: "Replaces Guessing With a Number", description: "Know roughly what you'll need and whether you're on pace for it." },
      { title: "Keeps You From Random Investing", description: "Every rupee invested is working toward something specific." },
      { title: "Progress You Can Actually See", description: "Track advancement instead of wondering if you're behind." },
    ],
    audience: [
      { title: "The Parent Planning Ahead", description: "Education costs rise every year — waiting only makes the number bigger." },
      { title: "The Couple Saving for a Home", description: "A down payment goal needs a plan, not just good intentions." },
      { title: "Anyone Juggling Multiple Goals at Once", description: "Education, a wedding, retirement — all at the same time needs structure, not chaos." },
    ],
    risks: [
      "Unrealistic assumptions may affect outcomes.",
      "Goals may evolve over time.",
      "Inflation can increase future costs.",
    ],
    faqs: [],
    related: ["sip-planning", "mutual-funds", "portfolio-review"],
    // goal-based-planning
    ctaHeadline: "Give every goal a plan, not just a wish.",
    ctaSubtext: "Map your next big goal to a real investment roadmap — let's start with one goal today.",
  },

  "portfolio-review": {
    name: "Portfolio Review",
    tagline: "The fund that worked 5 years ago may be costing you now.",
    icon: PieChart,
    description:
      "Markets change. Fund managers change. Your own goals change. The portfolio you built years ago was right for who you were then — but nobody's checking whether it's still right for who you are now. A periodic review catches what's quietly underperforming or drifting from your goals, before it costs you more than a check-up would have.",
    steps: [
      "Analyze current holdings",
      "Assess risk exposure",
      "Identify gaps and opportunities",
      "Implement recommendations",
    ],
    benefits: [
      { title: "Catch Underperformers Early", description: "Spot funds quietly lagging before years go by unnoticed." },
      { title: "Rebalance Toward Your Goals", description: "Review your mutual fund mix against where you actually want to end up." },
      { title: "Know Where You Really Stand", description: "An honest evaluation of progress, not just a quarterly statement glance." },
      { title: "Identify Concentration Risk", description: "Find out if you're more exposed to one sector or fund house than you realised." },
    ],
    audience: [
      { title: "The Investor Who Hasn't Checked in Years", description: "If you can't remember your last review, that's the clearest sign you need one." },
      { title: "The High-Net-Worth Individual", description: "More holdings mean more places for something to quietly go wrong." },
      { title: "Anyone Approaching a Major Goal", description: "The closer the goal, the more a misaligned portfolio actually costs you." },
    ],
    risks: [
      "Past performance may not continue.",
      "Frequent changes may increase costs.",
      "Market uncertainty remains unavoidable.",
    ],
    faqs: [],
    related: ["mutual-funds", "equity-shares", "goal-based-planning"],
  },
};