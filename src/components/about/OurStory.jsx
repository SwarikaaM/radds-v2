import ScrollReveal from "../ui/ScrollReveal";

export default function OurStory() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <ScrollReveal>
            <div>
              <p className="text-primary font-semibold uppercase tracking-wider mb-3">Who We Are</p>
              <h2 className="font-playfair text-5xl font-bold mb-8 text-[#0D1B2E]">
                An AMFI-Registered Mutual Fund Distribution Practice
              </h2>
              <p className="text-[#6B7E99] mb-6 leading-relaxed">
                Radds Capital is an AMFI-registered Mutual Fund Distributor (ARN holder) based out of India,
                helping individuals and families access mutual funds, insurance, and other investment
                products through a single, organised point of contact.
              </p>
              <p className="text-[#6B7E99] mb-8 leading-relaxed">
                We distribute schemes across multiple AMCs and insurers — we do not manufacture or
                guarantee any product, and all mutual fund investments are subject to market risk.
                Our role is to make the process of investing simpler, more transparent, and easier to act on.
              </p>
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-xl mb-2">What We Do</h3>
                  <p className="text-[#6B7E99]">
                    Help clients select, execute, and stay invested in mutual funds, SIPs, insurance,
                    NPS, and fixed-income products suited to their goals and risk profile.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-xl mb-2">Who We Serve</h3>
                  <p className="text-[#6B7E99]">
                    Salaried professionals, business owners, and families across India looking for a
                    long-term, organised approach to building their investment portfolio.
                  </p>
                </div>
              </div>
            </div>
          </ScrollReveal>
          <ScrollReveal>
            <div className="h-[500px] rounded-2xl bg-[#F4F8FC] border border-[#E2EBF5] flex items-center justify-center">
              <span className="text-[#6B7E99]">Office / Team Image Placeholder</span>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}