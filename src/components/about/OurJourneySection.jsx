import { CheckCircle2 } from "lucide-react";
import SectionHeader from "../ui/SectionHeader";
import ScrollReveal from "../ui/ScrollReveal";

const milestones = [
  "₹80+ Crore in Mutual Fund Assets Under Management",
  "1,100+ valued clients",
  "₹1+ Crore monthly SIP book",
  "A growing presence across Mutual Funds, Insurance, Equity Services, Fixed Income Solutions, and Financial Solutions",
];

export default function OurJourneySection() {
  return (
    <section className="py-8 bg-white">
      <div className="max-w-4xl mx-auto px-6">
        <SectionHeader eyebrow="Since 2017" title="Our Journey" className="mb-12" />

        <ScrollReveal>
          <p className="text-[#6B7E99] leading-relaxed mb-5">
            Every successful journey begins with a single step. In 2017, Radds Capital began with a
            vision of making quality investment solutions accessible to every family — not just
            high-net-worth investors.
          </p>
          <p className="text-[#6B7E99] leading-relaxed mb-10">
            Starting with 4 clients and ₹40,000 under management, the firm has grown primarily
            through long-term relationships, client referrals, and a commitment to putting investors
            first. Today, Radds Capital has:
          </p>

          <div className="grid sm:grid-cols-2 gap-4 mb-10">
            {milestones.map((m) => (
              <div key={m} className="flex items-start gap-3 bg-[#F4F8FC] border border-[#E2EBF5] rounded-xl p-4">
                <CheckCircle2 size={18} className="text-secondary flex-shrink-0 mt-0.5" />
                <span className="text-[#0D1B2E] text-sm font-medium leading-relaxed">{m}</span>
              </div>
            ))}
          </div>

          <p className="text-[#6B7E99] leading-relaxed italic">
            The numbers reflect growth — but our greatest achievement is the trust our clients place
            in us, year after year.
          </p>
        </ScrollReveal>
      </div>
    </section>
  );
}