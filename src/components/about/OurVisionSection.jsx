import SectionHeader from "../ui/SectionHeader";
import ScrollReveal from "../ui/ScrollReveal";

export default function OurVisionSection() {
  return (
    <section className="py-8 bg-[#0D1B2E]">
      <div className="max-w-3xl mx-auto px-6 text-center">
        <SectionHeader
          eyebrow="Looking Ahead"
          title="Our Vision"
          dark
          subtitle="To become one of India's most trusted wealth partners by helping thousands of families achieve financial independence through disciplined investing, investor education, and lifelong financial relationships."
          className="mb-10"
        />
        <ScrollReveal>
          <p className="font-playfair italic text-2xl md:text-3xl text-white leading-snug">
            "We don't just help people invest money. We help them build a future."
          </p>
        </ScrollReveal>
      </div>
    </section>
  );
}