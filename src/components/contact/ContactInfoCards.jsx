import {
  MapPin,
  Phone,
  Mail,
  MessageCircle,
  Clock3,
} from "lucide-react";
import { FaInstagram, FaLinkedin, FaFacebook } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

const cards = [
  {
    icon: MapPin,
    title: "Office Address",
    value: "Z-2101, Z wing, 2nd Floor, Akshar Business Park, Sector 25, Vashi, Navi Mumbai - 400705",
  },
  {
    icon: Phone,
    title: "Phone",
    value: "+91 96641 50986",
    href: "tel:+919664150986",
  },
  {
    icon: Mail,
    title: "Email",
    value: "info@raddscapital.com",
    href: "mailto:info@raddscapital.com",
  },
  {
    icon: MessageCircle,
    title: "WhatsApp",
    value: "Chat With Us",
    href: "https://wa.me/919664150986",
  },
  {
    icon: Clock3,
    title: "Business Hours",
    value: "Mon–Fri • 9:00 AM – 5:00 PM",
  },
];

const socialLinks = [
  { Icon: FaInstagram, href: "https://www.instagram.com/radds.capital/", label: "Instagram" },
  { Icon: FaLinkedin, href: "https://in.linkedin.com/company/radds-capital", label: "LinkedIn" },
  { Icon: FaFacebook, href: "https://www.facebook.com/mymoneygrowswithradds/", label: "Facebook" },
  { Icon: FaXTwitter, href: "#", label: "Twitter / X" }, // TODO: add link once available
];

export default function ContactInfoCards() {
  return (
    <section className="py-20 bg-[#F4F8FC]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
          {cards.map((card) => {
            const Icon = card.icon;

            return (
              <div
                key={card.title}
                className="bg-white rounded-xl border border-[#E2EBF5] p-6"
              >
                <Icon
                  className="text-primary mb-4"
                  size={24}
                />

                <h3 className="font-semibold mb-2">
                  {card.title}
                </h3>

                {card.href ? (
                  <a
                    href={card.href}
                    className="text-primary hover:underline"
                  >
                    {card.value}
                  </a>
                ) : (
                  <p className="text-[#6B7E99]">
                    {card.value}
                  </p>
                )}
              </div>
            );
          })}

          {/* Social Links card with real, clickable icons */}
          <div className="bg-white rounded-xl border border-[#E2EBF5] p-6">
            <h3 className="font-semibold mb-4">Follow Us</h3>
            <div className="flex items-center gap-3">
              {socialLinks.map(({ Icon, href, label }, i) => (
                <a
                  key={i}
                  href={href}
                  target={href !== "#" ? "_blank" : undefined}
                  rel={href !== "#" ? "noopener noreferrer" : undefined}
                  aria-label={label}
                  className="w-10 h-10 rounded-lg bg-[#F4F8FC] hover:bg-primary border border-[#E2EBF5] hover:border-primary flex items-center justify-center text-primary hover:text-white transition-all duration-200"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}