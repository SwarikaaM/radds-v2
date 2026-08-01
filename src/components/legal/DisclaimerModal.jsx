import { AnimatePresence, motion } from "framer-motion";
import { X, AlertTriangle } from "lucide-react";

const SECTIONS = [
  {
    title: "Disclaimer",
    body: [
      "These are our terms and conditions for usage of the website, RADDS Capital and the related services offered by RADDS Capital ('Related Services' hereafter means Stock Market Trading / Mutual Funds / ULIPs / Investment Analysis given through E-Mail, Messenger, Mobile Phone, Mobile SMS, Telephone or in any other form, manner or media). RADDS Capital owns raddscapital.com and all its contents & related services. You agree and understand that the information and material contained in this website and the related services offered by RADDS Capital, or research, implies and constitutes your consent to the terms and conditions mentioned below.",
      "You also agree that RADDS Capital can modify or alter the terms and conditions of the use of this service without any liability. The contents of this site & related services offered by RADDS Capital are solely the personal views of the contributors.",
      "RADDS Capital reserves the right to make modifications and alterations to the contents of this website. Users are advised to use the data for the purpose of information only and rely on their own judgement while making investment or trading decisions. The investments or trades discussed or recommended in this website & related services offered by RADDS Capital may not be suitable for all investors.",
      "RADDS Capital does not warranty the timeliness, accuracy or quality of the electronic content and takes no responsibility for any loss or profit arising out of decisions being made by anyone acting on the analysis published in this website.",
      "The contents of this website & the related services offered by RADDS Capital cannot be copied, reproduced, republished, uploaded, posted, transmitted or distributed for any non-personal use without obtaining prior permission from RADDS Capital. Any person who intends to use the services rendered by RADDS Capital should do so only after due consideration of the above as well as all other factors.",
      "RADDS Capital is not responsible for the contents of any of the linked sites, by providing access to other websites, nor recommending nor endorsing the content available in the linked websites. If you do not agree to any of the terms mentioned in this agreement, you should kindly exit the site.",
    ],
  },
];

export default function DisclaimerModal({ open, onClose }) {
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
            aria-label="Disclaimer"
            onClick={(e) => e.stopPropagation()}
            className="relative bg-white flex flex-col overflow-hidden rounded-2xl w-full max-w-[560px] max-h-[85vh]"
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.97 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="px-5 py-4 flex items-center gap-3 flex-shrink-0" style={{ background: "#22568F" }}>
              <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                <AlertTriangle size={17} className="text-white" />
              </div>
              <div className="flex-1">
                <h2 className="text-white font-semibold text-sm leading-tight">Disclaimer</h2>
                <p className="text-white/50 text-[11px] leading-tight">Terms & conditions of website use</p>
              </div>
              <button
                onClick={onClose}
                aria-label="Close disclaimer"
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
                  {section.body?.map((p, i) => (
                    <p key={i} className="text-[#475569] text-[13px] leading-relaxed mb-2.5">
                      {p}
                    </p>
                  ))}
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