import { ShieldCheck, Users, Clock3, Headphones, Search, Cpu, GraduationCap } from "lucide-react";
import SectionHeader from "../ui/SectionHeader";
import ScrollReveal from "../ui/ScrollReveal";

const values = [
  { icon: ShieldCheck, title: "Transparent & Ethical Practices", description: "Costs, commissions, and risks are disclosed upfront — no fine print surprises." },
  { icon: Users, title: "Personalised Service", description: "Recommendations are built around your goals and risk profile, not a sales target." },
  { icon: Clock3, title: "Long-Term Relationship Focus", description: "We measure success by the confidence and relationships we build, not by transactions." },
  { icon: Headphones, title: "Responsive Support", description: "Real people, ready to help with your questions and transactions when you need it." },
  { icon: Search, title: "Research-Driven Investment Approach", description: "Every recommendation is backed by research into the product, not a hunch or a trend." },
  { icon: Cpu, title: "Technology-Enabled Investing", description: "Digital tools and calculators that make tracking and investing simpler." },
  { icon: GraduationCap, title: "Continuous Investor Education", description: "We explain the product before you buy it, so every decision is an informed one." },
];

export default function ValuesSection() {
  return (
    <section className="py-8 bg-[#F4F8FC]">
      <div className="max-w-7xl mx-auto px-6">
        <SectionHeader eyebrow="Why Radds Capital" title="Why Investors Choose Radds Capital" className="mb-16" />
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
        <p className="text-[#6B7E99] text-sm text-center max-w-2xl mx-auto mt-12">
          We measure our success not by transactions, but by the financial confidence and long-term
          relationships we build.
        </p>
      </div>
    </section>
  );
}