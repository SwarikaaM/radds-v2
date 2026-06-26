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
      "Markets move every day whether you're invested or not. The right mix of funds turns time into your biggest advantage.",
    benefits: [
      "Diversified across sectors & fund houses",
      "Built around your real time horizon",
      "Liquidity when life needs it",
    ],
  },
  {
    title: "Life & Health Insurance",
    slug: "life-health-insurance",
    icon: "Shield",
    description:
      "One hospital bill or one bad year can undo a decade of savings. Cover is cheap until you need it — then it's priceless.",
    benefits: [
      "Protects income, not just assets",
      "Easier and cheaper while you're young & healthy",
      "One less thing your family has to worry about",
    ],
  },
  {
    title: "Equity",
    slug: "equity-shares",
    icon: "BarChart2",
    description:
      "Direct ownership in the businesses driving India's growth — for investors ready to participate, not just watch, through our broking partner.",
    benefits: [
      "Direct ownership, direct upside",
      "Built for long-term wealth creation",
      "Convenient market access",
    ],
  },
  {
    title: "NPS",
    slug: "nps",
    icon: "Landmark",
    description:
      "The retirement you picture won't fund itself. NPS turns small, regular contributions into a pension you can rely on.",
    benefits: [
      "Government-backed pension structure",
      "Tax-efficient retirement savings",
      "One of the lowest-cost products available",
    ],
  },
  {
    title: "Fixed Deposits & Bonds",
    slug: "fixed-deposits-bonds",
    icon: "Lock",
    description:
      "Not every rupee needs to chase growth. Some need to simply be safe, predictable, and there when you need it.",
    benefits: [
      "Predictable, stable returns",
      "Capital preservation",
      "Lower volatility for peace of mind",
    ],
  },
];

const services = [
  {
    title: "SIP Planning",
    slug: "sip-planning",
    icon: "Repeat",
    description:
      "Waiting for the 'right time' to invest is how most people miss it entirely. A disciplined SIP removes that guesswork.",
    benefits: [
      "Builds the habit, not just the corpus",
      "Rupee cost averaging smooths market swings",
      "Starts small, scales with you",
    ],
  },
  {
    title: "Tax Planning",
    slug: "tax-planning",
    icon: "FileText",
    description:
      "Every March, taxes get paid one way or another — the only question is whether any of it also builds your wealth.",
    benefits: [
      "Section 80C-eligible options",
      "Tax-efficient, not just tax-saving",
      "Plug the gap before the deadline does",
    ],
  },
  {
    title: "Retirement Planning",
    slug: "retirement-planning",
    icon: "Landmark",
    description:
      "By the time retirement feels urgent, the best years to prepare for it are already gone. Start the corpus now, while time is still on your side.",
    benefits: [
      "Built around your retirement timeline",
      "Curated mutual fund & pension-linked options",
      "Reviewed as the goal gets closer",
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
    ],
  },
  {
    title: "Portfolio Review",
    slug: "portfolio-review",
    icon: "PieChart",
    description:
      "The investments you made five years ago may not be the ones you need today. A periodic review catches what's quietly falling behind.",
    benefits: [
      "Spot underperformers before they cost you",
      "Rebalancing aligned to your goals",
      "A second pair of eyes on your money",
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