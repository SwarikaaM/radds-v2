import { Target, PieChart, Clock3, RefreshCcw, ShieldCheck } from "lucide-react";
import SectionHeader from "../ui/SectionHeader";
import ScrollReveal from "../ui/ScrollReveal";

const principles = [
  { icon: Target, label: "Goal-based investing" },
  { icon: PieChart, label: "Asset allocation" },
  { icon: Clock3, label: "Long-term discipline" },
  { icon: RefreshCcw, label: "Regular portfolio reviews" },
  { icon: ShieldCheck, label: "Managing risk before chasing returns" },
];

export default function InvestmentPhilosophySection() {
  return (
    <section className="py-8 bg-white">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <SectionHeader
          eyebrow="How We Think"
          title="Our Investment Philosophy"
          subtitle="Markets will always move through cycles. Instead of reacting to every headline, we believe investors benefit more from:"
          className="mb-12"
        />

        <ScrollReveal>
          <div className="flex flex-wrap justify-center gap-4 mb-10">
            {principles.map((p) => {
              const Icon = p.icon;
              return (
                <div key={p.label} className="flex items-center gap-2 bg-[#F4F8FC] border border-[#E2EBF5] rounded-full px-5 py-2.5">
                  <Icon size={15} className="text-primary" />
                  <span className="text-[#0D1B2E] text-sm font-medium">{p.label}</span>
                </div>
              );
            })}
          </div>
          <p className="font-playfair italic text-lg text-[#0D1B2E] leading-relaxed">
            "Successful investing is rarely about timing the market — it is about spending enough
            time in the market with the right strategy."
          </p>
        </ScrollReveal>
      </div>
    </section>
  );
}