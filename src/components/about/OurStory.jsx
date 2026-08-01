import ScrollReveal from "../ui/ScrollReveal";
import founderImg from "../../assets/founder.png";

export default function OurStory() {
  return (
    <section className="py-8 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="max-w-3xl mx-auto">
          <ScrollReveal>
            <div>
              <p className="text-primary font-semibold uppercase tracking-wider mb-3">Who We Are</p>
              <h2 className="font-playfair text-5xl font-bold mb-8 text-[#0D1B2E]">
                Helping Families Build Wealth with Clarity, Discipline &amp; Trust
              </h2>
              <p className="text-[#6B7E99] mb-6 leading-relaxed">
                At Radds Capital, we believe wealth creation is not about chasing the next hot
                investment — it's about making informed financial decisions consistently over time.
              </p>
              <p className="text-[#6B7E99] mb-6 leading-relaxed">
                Founded in 2017 by Deven Shah, Radds Capital started with just 4 clients and ₹40,000
                of investments under management. Today, we proudly serve 1,100+ investors, helping
                families and professionals build long-term wealth through disciplined investing and
                personalised financial solutions.
              </p>
              <div className="border-l-2 border-secondary pl-5 mb-6">
                <p className="text-[#0D1B2E] font-playfair italic text-lg leading-relaxed">
                  Invest with purpose. Stay invested with discipline. Create wealth with patience.
                </p>
              </div>
              <p className="text-[#6B7E99] mb-8 leading-relaxed">
                Rather than focusing on short-term market movements, we help investors align their
                investments with their life goals — whether it's buying a home, funding children's
                education, planning retirement, or creating long-term financial security.
              </p>
              <p className="text-[#6B7E99] leading-relaxed text-sm bg-[#F4F8FC] border border-[#E2EBF5] rounded-xl p-5">
                Radds Capital is an AMFI-registered Mutual Fund Distributor (ARN holder). We
                distribute schemes across multiple AMCs and insurers — we do not manufacture or
                guarantee any product, and all mutual fund investments are subject to market risk.
                Our role is to make the process of investing simpler, more transparent, and easier
                to act on.
              </p>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}