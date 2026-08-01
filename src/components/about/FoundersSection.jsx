import { GraduationCap, Briefcase } from "lucide-react";
import { FaLinkedin } from "react-icons/fa";
import SectionHeader from "../ui/SectionHeader";
import ScrollReveal from "../ui/ScrollReveal";
import founderImg from "../../assets/founder.png";
import cofounderImg from "../../assets/cofounder.jpg";

const founders = [
  {
    name: "Deven Shah",
    designation: "Founder",
    image: founderImg,
    bio: "Deven Shah combines global education with over a decade of corporate experience to bring a structured and disciplined approach to wealth creation.",
    education: [
      "Bachelor of Computer Applications (BCA)",
      "Master of Management Studies (MMS), University of Mumbai",
      "MSc in International Finance, London South Bank University, United Kingdom",
    ],
    experience:
      "Before founding Radds Capital, Deven spent nearly 10 years working with leading organisations including Birla Group, Sun Pharma, and Deutsche Bank — gaining valuable insights into finance, risk management, business operations, and client service.",
  },
  {
    name: "Anjali Shah",
    designation: "Co-Founder",
    image: cofounderImg,
    bio: "As Co-Founder, Anjali Shah brings deep expertise in wealth management and capital markets, ensuring every client receives a professional, transparent, and relationship-driven experience.",
    education: [
      "MSc in Finance and Investment, Brunel University London, United Kingdom",
    ],
    experience:
      "With over 15 years of professional experience, she has worked with reputed financial institutions including Way2Wealth and ICICI Securities, gaining extensive exposure to investment products, client advisory, and financial services.",
  },
];

export default function FoundersSection() {
  return (
    <section className="py-8 bg-[#F4F8FC]">
      <div className="max-w-5xl mx-auto px-6">
        <SectionHeader eyebrow="Leadership" title="Meet Our Founders" className="mb-16" />

        <div className="grid md:grid-cols-2 gap-8">
          {founders.map((person, i) => (
            <ScrollReveal key={person.name} delay={i * 0.1}>
              <div className="bg-white rounded-2xl border border-[#E2EBF5] h-full">
                <div className="relative p-6 pb-0">
                  <div className="h-72 sm:h-80 rounded-xl bg-[#F4F8FC] flex items-center justify-center overflow-hidden">
                    <img
                      src={person.image}
                      alt={person.name}
                      className="max-w-full max-h-full object-contain"
                    />
                  </div>
                  {/* <a
                    href="#"
                    className="absolute top-9 right-9 w-9 h-9 rounded-full bg-white/90 backdrop-blur flex items-center justify-center hover:bg-white transition-colors shadow-sm"
                    aria-label={`${person.name} on LinkedIn`}
                  >
                    <FaLinkedin className="text-primary" size={18} />
                  </a> */}
                </div>

                <div className="p-8">
                  <h3 className="font-playfair text-2xl font-bold text-[#0D1B2E]">{person.name}</h3>
                  <p className="text-secondary font-semibold text-sm mb-4">{person.designation}</p>                </div>
                <p className="text-[#6B7E99] leading-relaxed mb-6 px-4">{person.bio}</p>

                <div className="mb-5 px-4">
                  <div className="flex items-center gap-2 mb-2.5">
                    <GraduationCap size={16} className="text-primary" />
                    <h4 className="font-semibold text-sm text-[#0D1B2E]">Education</h4>
                  </div>
                  <ul className="space-y-1.5 pl-6">
                    {person.education.map((e) => (
                      <li key={e} className="text-[#6B7E99] text-sm list-disc leading-relaxed">{e}</li>
                    ))}
                  </ul>
                </div>

                <div className="mb-6 px-4">
                  <div className="flex items-center gap-2 mb-2.5 px-0.5">
                    <Briefcase size={16} className="text-primary" />
                    <h4 className="font-semibold text-sm text-[#0D1B2E]">Professional Experience</h4>
                  </div>
                  <p className="text-[#6B7E99] text-sm leading-relaxed">{person.experience}</p>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>

        <ScrollReveal delay={0.15}>
          <p className="text-[#6B7E99] leading-relaxed text-center max-w-3xl mx-auto mt-12">
            Together, Deven and Anjali have built Radds Capital on a single principle: put clients'
            interests first. Their mission is to simplify investing, educate investors, and help
            families make confident financial decisions that stand the test of time.
          </p>
        </ScrollReveal>
      </div>
    </section>
  );
}