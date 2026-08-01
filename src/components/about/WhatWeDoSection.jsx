import {
  TrendingUp, Repeat, Wallet, Target, HeartPulse,
  LineChart, Landmark, ReceiptText, ClipboardList,
} from "lucide-react";
import SectionHeader from "../ui/SectionHeader";
import ScrollReveal from "../ui/ScrollReveal";

const offerings = [
  { icon: TrendingUp, label: "Mutual Fund Investments" },
  { icon: Repeat, label: "Systematic Investment Plans (SIPs)" },
  { icon: Wallet, label: "One-Time (Lumpsum) Investments" },
  { icon: Target, label: "Goal-Based Investing" },
  { icon: HeartPulse, label: "Health & Life Insurance" },
  { icon: LineChart, label: "Equity & Demat Services" },
  { icon: Landmark, label: "Fixed Deposits & Bonds" },
  { icon: ReceiptText, label: "Tax-Saving Solutions" },
  { icon: ClipboardList, label: "Investment Portfolio Reviews" },
];

export default function WhatWeDoSection() {
  return (
    <section className="py-8 bg-[#F4F8FC]">
      <div className="max-w-7xl mx-auto px-6">
        <SectionHeader
          eyebrow="Our Offerings"
          title="What We Do"
          subtitle="We provide comprehensive financial solutions designed around our clients' needs."
          className="mb-16"
        />

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {offerings.map((o, i) => {
            const Icon = o.icon;
            return (
              <ScrollReveal key={o.label} delay={i * 0.04}>
                <div className="flex items-center gap-3 bg-white rounded-xl border border-[#E2EBF5] p-5">
                  <div className="w-9 h-9 rounded-lg bg-primary/8 flex items-center justify-center flex-shrink-0">
                    <Icon size={16} className="text-primary" />
                  </div>
                  <span className="text-[#0D1B2E] text-sm font-medium">{o.label}</span>
                </div>
              </ScrollReveal>
            );
          })}
        </div>

        <p className="text-[#6B7E99] text-sm leading-relaxed text-center max-w-2xl mx-auto mt-10">
          Every recommendation is made with one objective — to help clients make informed financial
          decisions aligned with their goals. As an AMFI-registered Mutual Fund Distributor, our role
          is limited to distribution and incidental guidance on mutual fund scheme selection; we are
          not a SEBI Registered Investment Adviser and do not offer investment advisory services.
        </p>
      </div>
    </section>
  );
}