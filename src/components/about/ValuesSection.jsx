import { Eye, Users, ShieldCheck, Scale, Clock3, GraduationCap } from "lucide-react";
import SectionHeader from "../ui/SectionHeader";
import ScrollReveal from "../ui/ScrollReveal";

const values = [
  { icon: Eye, title: "Transparency", description: "Costs, commissions, and risks are disclosed upfront — no fine print surprises." },
  { icon: Users, title: "Client-First", description: "Recommendations are built around your goals and risk profile, not a sales target." },
  { icon: ShieldCheck, title: "Multi-AMC Access", description: "We distribute across AMCs and insurers, so you aren't limited to one provider's products." },
  { icon: Scale, title: "Integrity", description: "We tell you what a product is built for — and just as importantly, what it isn't." },
  { icon: Clock3, title: "Long-Term Thinking", description: "Built for portfolios that compound over years, not for chasing short-term moves." },
  { icon: GraduationCap, title: "Investor Education", description: "We explain the product before you buy it, so every decision is an informed one." },
];

export default function ValuesSection() {
  return (
    <section className="py-24 bg-[#F4F8FC]">
      <div className="max-w-7xl mx-auto px-6">
        <SectionHeader eyebrow="What We Stand For" title="Our Values" className="mb-16" />
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {values.map((value) => {
            const Icon = value.icon;
            return (
              <ScrollReveal key={value.title}>
                <div className="bg-white rounded-xl p-8 border border-[#E2EBF5] h-full">
                  <Icon size={28} className="text-primary mb-5" />
                  <h3 className="font-semibold text-lg mb-2">{value.title}</h3>
                  <p className="text-[#6B7E99] text-sm leading-relaxed">{value.description}</p>
                </div>
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}