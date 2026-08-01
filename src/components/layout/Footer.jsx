import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, MessageCircle, LayoutDashboard } from "lucide-react";
import { FaInstagram, FaLinkedin, FaFacebook } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import logoPNG from "../../assets/Logo.png";
import MFDisclosure from "../ui/MFDisclosure";
import PrivacyPolicyModal from "../legal/PrivacyPolicyModal";

const socialLinks = [
  { Icon: FaInstagram, href: "https://www.instagram.com/radds.capital/", label: "Instagram" },
  { Icon: FaLinkedin, href: "https://in.linkedin.com/company/radds-capital", label: "LinkedIn" },
  { Icon: FaFacebook, href: "https://www.facebook.com/mymoneygrowswithradds/", label: "Facebook" },
  { Icon: FaXTwitter, href: "#", label: "Twitter / X" }, // TODO: add link once available
  { Icon: MessageCircle, href: "https://whatsapp.com/channel/0029VakDgcoIyPtUCoTAYw17", label: "WhatsApp Channel" },
  { Icon: LayoutDashboard, href: "https://raddsenterprises.investwell.app/app/#/broker/dashboard", label: "Investwell Dashboard" },
];

const productLinks = [
  { label: "Mutual Funds", path: "/services/mutual-funds" },
  { label: "Life & Health Insurance", path: "/services/life-health-insurance" },
  { label: "Equity", path: "/services/equity-shares" },
  { label: "NPS", path: "/services/nps" },
  { label: "FD / Bonds", path: "/services/fixed-deposits-bonds" },
];

const serviceLinks = [
  { label: "SIP Planning", path: "/services/sip-planning" },
  { label: "Tax Planning", path: "/services/tax-planning" },
  { label: "Retirement Planning", path: "/services/retirement-planning" },
  { label: "Goal-Based Planning", path: "/services/goal-based-planning" },
  { label: "Portfolio Review", path: "/services/portfolio-review" },
];

const companyLinks = [
  { label: "About Us", path: "/about" },
  { label: "Calculators", path: "/calculators" },
  { label: "Blog", path: "/blog" },
  { label: "Learning Center", path: "/learning" },
  { label: "Careers", path: "/careers" },
  { label: "FAQ", path: "/faq" },
  { label: "Contact", path: "/contact" },
];

export default function Footer() {
  const [privacyOpen, setPrivacyOpen] = useState(false);

  return (
    <footer className="bg-dark text-white">
      <MFDisclosure />
      {/* Gradient top line */}
      <div className="h-0.5 bg-gradient-to-r from-primary via-secondary to-accent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-12">
          {/* Col 1: Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Link
                to="/"
                className="flex items-center group"
              >
              <img
                src={logoPNG}
                alt="Radds Capital"
                className="h-[52px] md:h-[56px] w-auto object-contain transition-transform duration-200 group-hover:scale-[1.02]"
              />
              </Link>              
            </div>
            <p className="text-white/70 text-sm leading-relaxed font-playfair italic">
              Helping investors choose the right mutual fund schemes for their goals, with transparent, client-first service.
            </p>
            {/* <p className="text-white/80 text-xs leading-relaxed">
              AMFI-Registered Mutual Fund Distributor | ARN-334716 | ARN-292158 | ARN-124053. Transparent, client-first MF distribution.
            </p> */}
            <div className="flex items-center gap-3 pt-2 flex-wrap">
              {socialLinks.map(({ Icon, href, label }, i) => (
                <motion.a
                  key={i}
                  href={href}
                  target={href !== "#" ? "_blank" : undefined}
                  rel={href !== "#" ? "noopener noreferrer" : undefined}
                  className="w-8 h-8 rounded-lg bg-white/10 hover:bg-primary/70 border border-white/50 hover:border-primary/80 flex items-center justify-center text-white/90 hover:text-white transition-all duration-200"
                  aria-label={label}
                  whileHover={{ y: -2, scale: 1.08 }}
                  whileTap={{ scale: 0.92 }}
                  transition={{ duration: 0.15 }}
                >
                  <Icon size={14} />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Col 2: Products */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-5 uppercase tracking-wider">Products</h4>
            <ul className="space-y-2.5">
              {productLinks.map((link) => (
                <li key={link.path}>
                  <motion.div whileHover={{ x: 3 }} transition={{ duration: 0.15 }}>
                    <Link
                      to={link.path}
                      className="text-white/50 hover:text-white text-sm transition-colors duration-150 inline-block"
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Services */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-5 uppercase tracking-wider">Services</h4>
            <ul className="space-y-2.5">
              {serviceLinks.map((link) => (
                <li key={link.path}>
                  <motion.div whileHover={{ x: 3 }} transition={{ duration: 0.15 }}>
                    <Link
                      to={link.path}
                      className="text-white/50 hover:text-white text-sm transition-colors duration-150 inline-block"
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: Company */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-5 uppercase tracking-wider">Company</h4>
            <ul className="space-y-2.5">
              {companyLinks.map((link) => (
                <li key={link.path}>
                  <motion.div whileHover={{ x: 3 }} transition={{ duration: 0.15 }}>
                    <Link
                      to={link.path}
                      className="text-white/50 hover:text-white text-sm transition-colors duration-150 inline-block"
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 5: Contact */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-5 uppercase tracking-wider">Contact</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-white/50 text-sm">
                <Mail size={15} className="mt-0.5 flex-shrink-0 text-accent" />
                <a href="mailto:hello@raddscapital.com" className="hover:text-white transition-colors">
                  info@raddscapital.com
                </a>
              </li>
              <li className="flex items-start gap-3 text-white/50 text-sm">
                <Phone size={15} className="mt-0.5 flex-shrink-0 text-accent" />
                <a href="tel:+919664150986" className="hover:text-white transition-colors">
                  +91 96641 50986
                </a>
              </li>
              <li className="flex items-start gap-3 text-white/50 text-sm">
                <MapPin size={15} className="mt-0.5 flex-shrink-0 text-accent" />
                <span>Z-2101, Z wing, 2nd Floor, Akshar Business Park, Sector 25, Vashi, Navi Mumbai - 400705</span>
              </li>
            </ul>
            {/* <div className="mt-6 p-3 bg-white/5 border border-white/10 rounded-card">
              <p className="text-white/40 text-xs">
                AMFI ARN: <span className="font-mono-num text-white/60">ARN-334716 | ARN-292158 | ARN-124053</span>
              </p>
            </div> */}
          </div>
        </div>

        {/* Registration numbers row */}
        <div className="mt-8 py-5 px-2 border bg-white/10 border-white/15 rounded-card">
          <p className="text-white/60 text-[11px] text-center leading-relaxed font-mono-num">
            Deven Shah ARN – 124053 &nbsp;|&nbsp; Anjali Shah ARN – 292158 &nbsp;|&nbsp; Deven Shah HUF ARN – 334716 &nbsp;|&nbsp; BSE Regi Code: AP01017901146329 &nbsp;|&nbsp; NSE Registration Code: CM-AP1493473831 , FO-AP1493473831 &nbsp;|&nbsp; PMS Regist No: APRN APRN09418 &nbsp;|&nbsp; SIF <span className="text-white/25">(to be added)</span> &nbsp;|&nbsp; AIF Registration No <span className="text-white/25">(to be added)</span>
          </p>
        </div>

        {/* Bottom bar */}
        <div className="mt-5 pt-5 border-t border-white/8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-white/50 text-xs text-center sm:text-left">
            © 2026 Radds Capital. All rights reserved. AMFI-registered Mutual Fund Distributor.
          </p>
          <div className="flex items-center gap-4">
            <a
              href="#"
              onClick={(e) => { e.preventDefault(); setPrivacyOpen(true); }}
              className="text-white/50 hover:text-white/60 text-xs transition-colors"
            >
              Privacy Policy
            </a>
            <a href="#" className="text-white/50 hover:text-white/60 text-xs transition-colors">
              Terms of Use
            </a>
            <a href="#" className="text-white/50 hover:text-white/60 text-xs transition-colors">
              Disclaimer
            </a>
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-white/5">
          <p className="text-white/50 text-[10px] leading-relaxed text-center">
            Mutual Fund investments are subject to market risks. Read all scheme related documents carefully. 
            Past performance is not indicative of future returns. Radds Capital is an AMFI-Registered Mutual Fund Distributor, 
            not a SEBI Registered Investment Adviser. Incidental advice/guidance provided is limited to mutual fund scheme selection 
            and does not constitute financial planning or investment advisory services.
          </p>
        </div> 
      </div>

      <PrivacyPolicyModal open={privacyOpen} onClose={() => setPrivacyOpen(false)} />
    </footer>
  );
}