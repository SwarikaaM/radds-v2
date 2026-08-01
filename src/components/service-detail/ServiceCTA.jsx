import Button from "../ui/Button";

export default function ServiceCTA({ service }) {
  return (
    <section className="py-24 bg-[#0D1B2E] text-center">
      <div className="max-w-4xl mx-auto px-6">
        <h2 className="font-playfair text-5xl text-white font-bold mb-5">
          {service?.ctaHeadline || "Ready to plan this properly?"}
        </h2>
        <p className="text-white/70 text-lg mb-8">
          {service?.ctaSubtext || "Speak with our team and understand your next best step."}
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Button href="/contact#book">Book a Consultation</Button>
          {service?.externalCta && (
            <Button
              href={service.externalCta.url}
              target="_blank"
              rel="noopener noreferrer"
              variant="outline"
              className="!text-white !border-white/40 hover:!bg-white hover:!text-[#0D1B2E]"
            >
              {service.externalCta.label}
            </Button>
          )}
        </div>
      </div>
    </section>
  );
}