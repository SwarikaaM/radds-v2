import {
  TrendingUp,
  Shield,
  BarChart2,
  Repeat,
  FileText,
  Landmark,
  Lock,
  Target,
  PieChart,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";

import Card from "../ui/Card";
import Button from "../ui/Button";
import SectionHeader from "../ui/SectionHeader";
import ScrollReveal from "../ui/ScrollReveal";

const iconMap = {
  TrendingUp,
  Shield,
  BarChart2,
  Repeat,
  FileText,
  Landmark,
  Lock,
  Target,
  PieChart,
};

const products = [
  {
    title: "Mutual Funds",
    slug: "mutual-funds",
    icon: "TrendingUp",
    description:
      "Stop letting idle cash sit on the sidelines. Get access to a curated shortlist of mutual fund schemes, matched to your goals and risk profile — so every rupee you invest is working with a purpose, not just parked.",
    benefits: [
      "Curated shortlist, not 1,000+ confusing options",
      "Spread across sectors & fund houses to manage risk",
      "Matched to your goals, timeline & risk appetite",
      "Stay liquid — redeem when life needs it",
    ],
  },
  {
    title: "Life & Health Insurance",
    slug: "life-health-insurance",
    icon: "Shield",
    description:
      "A single hospital bill or a lost income year can wipe out a decade of saving. Get the right cover in place while it's still cheap and easy to buy — before age or health makes that decision for you.",
    benefits: [
      "Protects your family's income, not just your assets",
      "Locks in lower premiums while you're young & healthy",
      "Health cover that absorbs rising medical costs",
      "One less worry for the people who depend on you",
    ],
  },
  {
    title: "Equity",
    slug: "equity-shares",
    icon: "BarChart2",
    description:
      "Every time a company you admire grows, its shareholders grow with it. Get direct access to India's listed businesses through our broking partner — built for investors ready to participate, not just watch from the sidelines.",
    benefits: [
      "Direct ownership in the businesses you believe in",
      "Convenient market access through our broking partner",
      "Built for investors with a long-term mindset",
      "Stay fully in control of what you hold and when",
    ],
  },
  {
    title: "NPS",
    slug: "nps",
    icon: "Landmark",
    description:
      "Your salary stops the day you retire — your expenses don't. NPS turns small, regular contributions today into a structured, government-backed pension corpus for tomorrow, while you're still earning to build it.",
    benefits: [
      "Government-backed retirement structure",
      "Among the lowest-cost investment products available",
      "Potential tax benefits under applicable sections",
      "Choose your own pace of contribution",
    ],
  },
  {
    title: "Fixed Deposits & Bonds",
    slug: "fixed-deposits-bonds",
    icon: "Lock",
    description:
      "Not every rupee you own needs to chase growth. Your emergency fund, a near-term goal, or a parent's savings often just need to stay safe and accessible — fixed deposits and bonds are built for exactly that job.",
    benefits: [
      "Built for capital safety, not capital risk",
      "A steady counterbalance to your riskier holdings",
      "Useful for near-term goals 1–3 years away",
      "Simple, transparent, easy to understand",
    ],
  },
];

const services = [
  {
    title: "SIP Planning",
    slug: "sip-planning",
    icon: "Repeat",
    description:
      "Most people don't lose money by investing badly — they lose by waiting for the 'right time' and never starting. A disciplined SIP removes that decision entirely: the same amount, the same date, every month.",
    benefits: [
      "Removes the guesswork of timing the market",
      "Builds the habit, not just the corpus",
      "Starts small — scale it up as your income grows",
      "Rupee-cost averaging smooths out market swings",
    ],
  },
  {
    title: "Tax Planning",
    slug: "tax-planning",
    icon: "FileText",
    description:
      "Every March, taxes get paid one way or another — the only question is whether any of it also builds your wealth. Plan it through the year instead of scrambling at the deadline.",
    benefits: [
      "Section 80C-eligible options",
      "Tax-efficient, not just tax-saving",
      "Plug the gap before the deadline does",
      "Spread the decision across the year, not one rushed month",
    ],
  },
  {
    title: "Retirement Planning",
    slug: "retirement-planning",
    icon: "Landmark",
    description:
      "By the time retirement feels urgent, the best years to prepare for it are already gone. Start the corpus now, while time and your income are both still on your side.",
    benefits: [
      "Built around your retirement timeline",
      "Curated mutual fund & pension-linked options",
      "Reviewed as the goal gets closer",
      "A clear number to work toward, not a guess",
    ],
  },
  {
    title: "Goal-Based Planning",
    slug: "goal-based-planning",
    icon: "Target",
    description:
      "A child's education, a wedding, a home — these don't arrive with a payment plan. Map your investments to the goal, and the goal stops feeling out of reach.",
    benefits: [
      "Every goal gets its own roadmap",
      "Education, home & life-event ready",
      "Progress you can actually track",
      "Stops random investing — every rupee has a job",
    ],
  },
  {
    title: "Portfolio Review",
    slug: "portfolio-review",
    icon: "PieChart",
    description:
      "The investments you made five years ago may not be the ones you need today. A periodic review catches what's quietly falling behind before it costs you more.",
    benefits: [
      "Spot underperformers before they cost you",
      "Rebalancing aligned to your current goals",
      "A second pair of eyes on your money",
      "Adjust for life changes — job, marriage, kids, relocation",
    ],
  },
];

function ServiceCardSet({ items }) {
  return (
    <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6 mt-10">
      {items.map((service, index) => {
        const Icon = iconMap[service.icon];

        return (
          <ScrollReveal key={service.slug} delay={index * 0.05}>
            <Card hover glow className="h-full flex flex-col">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-5">
                <Icon size={24} className="text-primary" />
              </div>

              <h3 className="text-xl font-semibold text-textprimary mb-3">
                {service.title}
              </h3>

              <p className="text-textmuted mb-5">
                {service.description}
              </p>

              <ul className="space-y-3 mb-8 flex-1">
                {service.benefits.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-2 text-sm text-textmuted"
                  >
                    <CheckCircle2
                      size={16}
                      className="text-success mt-0.5"
                    />
                    {item}
                  </li>
                ))}
              </ul>

              <Button
                href={`/services/${service.slug}`}
                variant="outline"
                className="w-full justify-center"
              >
                Explore
                <ArrowRight size={16} />
              </Button>
            </Card>
          </ScrollReveal>
        );
      })}
    </div>
  );
}

export default function ServicesGrid() {
  return (
    <section className="py-24 bg-[#F4F8FC]">
      <div className="max-w-7xl mx-auto px-6">
        <SectionHeader
          eyebrow="What We Offer"
          title="Comprehensive Financial Solutions"
          subtitle="Every recommendation is aligned with your goals, risk appetite and investment horizon."
        />

        <h3 className="text-2xl font-semibold text-textprimary mt-16">Products</h3>
        <ServiceCardSet items={products} />

        <h3 className="text-2xl font-semibold text-textprimary mt-16">Services</h3>
        <ServiceCardSet items={services} />
      </div>
    </section>
  );
}