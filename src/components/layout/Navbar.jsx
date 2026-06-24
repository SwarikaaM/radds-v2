import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, BarChart2, MessageCircle, LayoutDashboard } from "lucide-react";
import { FaInstagram, FaLinkedin, FaFacebook } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import Button from "../ui/Button";
import logoPNG from "../../assets/Logo.png";

const socialLinks = [
  { Icon: FaInstagram, href: "https://www.instagram.com/radds.capital/", label: "Instagram" },
  { Icon: FaLinkedin, href: "https://in.linkedin.com/company/radds-capital", label: "LinkedIn" },
  { Icon: FaFacebook, href: "https://www.facebook.com/mymoneygrowswithradds/", label: "Facebook" },
  { Icon: FaXTwitter, href: "#", label: "Twitter / X" }, // TODO: add link once available
  // { Icon: MessageCircle, href: "https://whatsapp.com/channel/0029VakDgcoIyPtUCoTAYw17", label: "WhatsApp Channel" },
  // { Icon: LayoutDashboard, href: "https://raddsenterprises.investwell.app/app/#/broker/dashboard", label: "Investwell Dashboard" },
];

const navLinks = [
  { label: "Home", path: "/" },
  { label: "Calculators", path: "/calculators" },
  { label: "Services", path: "/services" },
  { label: "Contact", path: "/contact" },
  { label: "Careers", path: "/careers" },
  { label: "About", path: "/about" },
  { label: "Learning", path: "/learning" },
  { label: "Blog", path: "/blog" },
  { label: "FAQ", path: "/faq" },
];

function StoreBadge({ store, initial }) {
  const isAndroid = store === "android";
  return (
    <motion.a
      href={isAndroid
        ? "https://play.google.com/store/apps/details?id=com.iw.radds&pcampaignid=web_share"
        : "https://apps.apple.com/in/app/radds-capital/id6744892358"}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex items-center gap-2 bg-white/8 hover:bg-white/50 border border-white/15 hover:border-white/30 rounded-xl px-2 py-2.5 transition-all duration-200"
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: initial, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.97 }}
    >
      {isAndroid ? (
        <svg viewBox="0 0 24 24" className="w-6 h-6 flex-shrink-0" fill="none">
          <path d="M3.18 23.76a2 2 0 0 0 2.05-.22l12.04-6.95-2.76-2.76-11.33 9.93z" fill="#EA4335"/>
          <path d="M21.6 10.27a1.94 1.94 0 0 0 0 3.46l.05.03-3.3-1.9.03-.03 3.22-1.56z" fill="#FBBC04"/>
          <path d="M3.18.24C2.5.6 2 1.34 2 2.27v19.46c0 .93.5 1.67 1.18 2.03l12.31-11.76L3.18.24z" fill="#4285F4"/>
          <path d="M17.27 7.59L5.23.64a2 2 0 0 0-2.05-.4L14.51 12l2.76-4.41z" fill="#34A853"/>
        </svg>
      ) : (
        <svg viewBox="0 0 24 24" className="w-6 h-6 flex-shrink-0" fill="white">
          <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
        </svg>
      )}
      <div>
        <p className="text-white/50 text-[10px] leading-none mb-0.5">
          {isAndroid ? "Get it on" : "Download on the"}
        </p>
        <p className="text-white font-semibold text-sm leading-none">
          {isAndroid ? "Google Play" : "App Store"}
        </p>
      </div>
    </motion.a>
  );
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => { setMobileOpen(false); }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 h-16 transition-all duration-300 ${
        scrolled ? "bg-dark/95 backdrop-blur-lg shadow-lg shadow-black/20" : "bg-dark/90 backdrop-blur-md"
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center group flex-shrink-0">
            <img
              src={logoPNG}
              alt="Radds Capital"
              className="h-[52px] md:h-[56px] w-auto min-w-[120px] object-contain transition-transform duration-200 group-hover:scale-[1.02]"
            />
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = link.path === "/" ? location.pathname === "/" : location.pathname.startsWith(link.path);
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`relative px-2 py-2 text-sm font-medium rounded transition-all duration-200 ${
                    isActive ? "text-accent bg-white/5" : "text-white/70 hover:text-white hover:bg-white/6"
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <motion.div
                      layoutId="nav-underline"
                      className="absolute bottom-0 left-3 right-3 h-0.5 bg-secondary rounded-full"
                    />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Social icons - desktop only */}
          <div className="hidden xl:flex items-center gap-1.5 pr-1 border-r border-white/10 mr-2">
            {socialLinks.map(({ Icon, href, label }, i) => (
              <a
                key={i}
                href={href}
                target={href !== "#" ? "_blank" : undefined}
                rel={href !== "#" ? "noopener noreferrer" : undefined}
                aria-label={label}
                className="w-7 h-7 rounded-md flex items-center justify-center text-white/90 hover:text-white hover:bg-white/15 transition-all duration-200"
              >
                <Icon size={13} />
              </a>
            ))}
          </div>

          {/* Desktop CTAs */}
          <div className="hidden lg:flex items-center gap-3">
            {/* Financial Planning CTA - Fluid Liquid Border */}
            <Link
              to="/financial-planning"
              className="group relative inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-white text-sm font-semibold transition-all duration-300 overflow-hidden hover:scale-105 active:scale-95 shadow-[0_4px_20px_rgba(239,68,68,0.4)]"
            >
              {/* Ultra-bright rotating gradient element that spills out past the boundary */}
              <span className="absolute inset-[-300%] animate-[spin_3s_linear_infinite] bg-[conic-gradient(from_0deg,#ff4500,#ff007f,#00f0ff,#ff4500)]" />
              
              {/* Dark Inner Mask - Keeps the center clean while revealing a thick glowing border track */}
              <span className="absolute inset-[2px] bg-slate-950 rounded-[6px] group-hover:bg-slate-900 transition-colors" />

              {/* Content explicitly layered above the background track */}
              <BarChart2 size={14} className="relative z-10 text-cyan-400 group-hover:rotate-12 transition-transform" />
              <span className="relative z-10 bg-gradient-to-r from-amber-200 to-rose-300 bg-clip-text text-transparent group-hover:from-white group-hover:to-white">
                Goal & Budget Planner
              </span>
            </Link>
            {/* Investwell login */}
            <Button variant="accent" size="sm" href="https://raddsenterprises.investwell.app/app/#/login">
              Login
            </Button>
          </div>

          {/* Mobile hamburger */}
          <motion.button
            className="lg:hidden p-2 text-white/80 hover:text-white transition-colors rounded"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
            whileTap={{ scale: 0.9 }}
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={mobileOpen ? "close" : "open"}
                initial={{ opacity: 0, rotate: -90, scale: 0.7 }}
                animate={{ opacity: 1, rotate: 0, scale: 1 }}
                exit={{ opacity: 0, rotate: 90, scale: 0.7 }}
                transition={{ duration: 0.15 }}
                className="flex"
              >
                {mobileOpen ? <X size={22} /> : <Menu size={22} />}
              </motion.span>
            </AnimatePresence>
          </motion.button>
        </div>
      </nav>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/60 z-40 lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              className="fixed top-0 right-0 bottom-0 w-72 bg-dark z-50 lg:hidden flex flex-col shadow-2xl"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
            >
              <div className="flex items-center justify-between p-5 border-b border-white/10">
                <span className="text-white font-playfair font-bold text-lg">
                  Radds <span className="text-accent">Capital</span>
                </span>
                <button onClick={() => setMobileOpen(false)} className="text-white/60 hover:text-white">
                  <X size={20} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto py-4">
                {navLinks.map((link) => {
                  const isActive = link.path === "/" ? location.pathname === "/" : location.pathname.startsWith(link.path);
                  return (
                    <motion.div key={link.path} initial={false} whileHover={{ x: 3 }} transition={{ duration: 0.15 }}>
                      <Link
                        to={link.path}
                        className={`block px-6 py-3.5 text-sm font-medium transition-all duration-200 border-l-2 ${
                          isActive
                            ? "text-accent border-accent bg-accent/5"
                            : "text-white/70 hover:text-white border-transparent hover:border-white/20 hover:bg-white/4"
                        }`}
                      >
                        {link.label}
                      </Link>
                    </motion.div>
                  );
                })}

                
              </div>

              <div className="p-5 border-t border-white/10 flex flex-col gap-3">
                {/* Financial Planning in mobile nav - Liquid Border Attention Magnet */}
                <motion.div 
                  initial={false} 
                  whileHover={{ x: 6, scale: 1.02 }} 
                  transition={{ duration: 0.15 }}
                  className="mx-4 my-2" // Adds safe padding inside your mobile menu drawer
                >
                  <Link
                    to="/financial-planning"
                    className={`group relative block p-[2px] rounded-xl overflow-hidden transition-all duration-300 shadow-[0_4px_25px_rgba(239,68,68,0.35)] ${
                      location.pathname === "/financial-planning" 
                        ? "scale-[1.02] shadow-[0_4px_30px_rgba(0,240,255,0.3)]" 
                        : ""
                    }`}
                  >
                    {/* Ultra-bright rotating gradient background frame */}
                    <span className={`absolute inset-[-300%] animate-[spin_4s_linear_infinite] bg-[conic-gradient(from_0deg,#ff4500,#ff007f,#00f0ff,#ff4500)] ${
                      location.pathname === "/financial-planning" ? "[animation-duration:2s]" : ""
                    }`} />
                    
                    {/* Dark Inner Mask - Isolates button container from mobile nav blending */}
                    <div className={`relative px-6 py-3.5 rounded-[10px] flex items-center justify-between transition-colors duration-300 ${
                      location.pathname === "/financial-planning"
                        ? "bg-slate-900"
                        : "bg-slate-950 group-hover:bg-slate-900"
                    }`}>
                      {/* Text Label with Dynamic Active State Highlighting */}
                      <span className={`text-sm font-semibold transition-all bg-clip-text text-transparent ${
                        location.pathname === "/financial-planning"
                          ? "bg-gradient-to-r from-cyan-400 to-amber-200"
                          : "bg-gradient-to-r from-amber-200 to-rose-300 group-hover:from-white group-hover:to-white"
                      }`}>
                        Goal & Budget Planner
                      </span>

                      {/* Dynamic indicator badge instead of just a flat left-border line */}
                      <span className={`h-2 w-2 rounded-full transition-all duration-300 ${
                        location.pathname === "/financial-planning" 
                          ? "bg-cyan-400 animate-ping shadow-[0_0_10px_#00f0ff]" 
                          : "bg-rose-500 opacity-60 group-hover:opacity-100 group-hover:scale-125"
                      }`} />
                    </div>
                  </Link>
                </motion.div>
                <StoreBadge store="android" initial={0.25} />
                <StoreBadge store="ios" initial={0.32} />
                <Button variant="ghost" size="md" href="https://raddsenterprises.investwell.app/app/#/login" className="w-full justify-center">
                  Login
                </Button>

                {/* Social icons */}
                <div className="flex items-center justify-center gap-2 pt-2">
                  {socialLinks.map(({ Icon, href, label }, i) => (
                    <a
                      key={i}
                      href={href}
                      target={href !== "#" ? "_blank" : undefined}
                      rel={href !== "#" ? "noopener noreferrer" : undefined}
                      aria-label={label}
                      className="w-8 h-8 rounded-lg bg-white/10 border border-white/50 flex items-center justify-center text-white/90 hover:text-white hover:bg-white/35 transition-all duration-200"
                    >
                      <Icon size={14} />
                    </a>
                  ))}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}