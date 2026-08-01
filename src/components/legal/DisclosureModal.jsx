import { AnimatePresence, motion } from "framer-motion";
import { X, FileText } from "lucide-react";

const SECTIONS = [
  {
    title: "Disclosure",
    list: [
      "Details of scheme level commission on Mutual Funds are available with the Relationship Managers and would be produced on demand.",
      "This is on a best effort basis and rates are updated as and when actual rates are received from AMCs.",
      "We are a NISM certified / AMFI registered Mutual Fund Distributor and not an RIA. We get compensated / incentivised by AMCs. We don't charge any fees for our services.",
    ],
  },
];

export default function DisclosureModal({ open, onClose }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Disclosure"
            onClick={(e) => e.stopPropagation()}
            className="relative bg-white flex flex-col overflow-hidden rounded-2xl w-full max-w-[560px] max-h-[85vh]"
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.97 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="px-5 py-4 flex items-center gap-3 flex-shrink-0" style={{ background: "#22568F" }}>
              <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                <FileText size={17} className="text-white" />
              </div>
              <div className="flex-1">
                <h2 className="text-white font-semibold text-sm leading-tight">Disclosure</h2>
                <p className="text-white/50 text-[11px] leading-tight">Mutual Fund commission disclosure</p>
              </div>
              <button
                onClick={onClose}
                aria-label="Close disclosure"
                className="w-8 h-8 rounded-lg flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 transition-colors flex-shrink-0"
              >
                <X size={18} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-5 space-y-7">
              {SECTIONS.map((section) => (
                <div key={section.title}>
                  <h3 className="font-playfair text-base font-bold text-[#0D1B2E] mb-2.5">
                    {section.title}
                  </h3>
                  {section.list && (
                    <ul className="list-disc pl-4 space-y-1.5 mb-2.5">
                      {section.list.map((item, i) => (
                        <li key={i} className="text-[#475569] text-[13px] leading-relaxed">
                          {item}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}

              <div className="pt-4 border-t border-[#E2EBF5]">
                <p className="text-[#94A3B8] text-[11px] leading-relaxed">
                  Copyright © 2026 RADDS Capital. All rights reserved.
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}