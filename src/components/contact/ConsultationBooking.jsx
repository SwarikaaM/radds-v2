import { useEffect } from "react";
import { Calendar } from "lucide-react";

export default function ConsultationBooking() {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://bookings.nimbuspop.com/assets/embed.js";
    script.async = true;
    script.onload = () => {
      if (window.Bookings) {
        const isMobile = window.innerWidth < 768;
        window.Bookings.inlineEmbed({
          url: "https://raddscapital.zohobookings.in/portal-embed#/446147000000032045",
          parent: "#zoho-booking-container",
          height: isMobile ? "1000px" : "780px",
        });
      }
    };
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <section id="book" className="py-20 bg-[#F4F8FC]">
      <div className="max-w-5xl mx-auto px-6">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-[#22568F]/10 text-[#22568F] px-4 py-1.5 rounded-full text-sm font-medium mb-4">
            <Calendar size={14} />
            Book a Consultation
          </div>
          <h2 className="font-playfair text-3xl md:text-4xl font-bold text-[#0D1B2E] mb-3">
            Schedule a Meeting
          </h2>
          <p className="text-[#6B7E99] max-w-md mx-auto">
            Pick a time that works for you. You'll receive a confirmation email automatically.
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-[#E2EBF5] shadow-sm overflow-hidden">
          <div id="zoho-booking-container" />
        </div>

        <p className="text-center text-xs text-[#6B7E99] mt-4">
          Confirmation email sent to you and our team automatically after booking.
        </p>
      </div>
    </section>
  );
}