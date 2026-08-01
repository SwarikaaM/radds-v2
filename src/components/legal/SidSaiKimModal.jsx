import { AnimatePresence, motion } from "framer-motion";
import { X, ExternalLink } from "lucide-react";

const AMC_LINKS = [
  { name: "AXIS", url: "https://www.axismf.com/downloads?formType=NonTransactionalForms" },
  { name: "BIRLA", url: "https://mutualfund.adityabirlacapital.com/forms-and-downloads/forms" },
  { name: "CANARA ROBECO", url: "https://www.canararobeco.com/documents/forms-downloads/forms-information-documents/forms/application-forms/" },
  { name: "DSP", url: "https://www.dspim.com/downloads" },
  { name: "EDELWEISS", url: "https://www.edelweissmf.com/downloads/forms" },
  { name: "FRANKLIN TEMPLETON", url: "https://www.franklintempletonindia.com/investor/downloads/forms-and-instructions/forms-for-investor" },
  { name: "HDFC", url: "https://www.hdfcfund.com/investor-desk/forms" },
  { name: "HSBC", url: "https://www.assetmanagement.hsbc.co.in/en/mutual-funds/investment-expertise/active-equities" },
  { name: "ICICI PRUDENTIAL", url: "https://archive.icicipruamc.com/downloads/sid" },
  { name: "IDFC (now Bandhan)", url: "https://bandhanmutual.com/downloads/forms-for-investor" },
  { name: "INVESCO", url: "https://www.invescomutualfund.com/literature-forms" },
  { name: "JM FINANCIAL", url: "https://www.jmfinancialmf.com/Downloads/" },
  { name: "KOTAK", url: "https://www.kotakmf.com/Information/forms-and-downloads" },
  { name: "L&T (now HSBC)", url: "https://www.assetmanagement.hsbc.co.in/en/mutual-funds/investment-expertise/active-equities" },
  { name: "NIPPON INDIA", url: "https://mf.nipponindiaim.com/investor-service/downloads/forms" },
  { name: "LIC", url: "https://www.licmf.com/application-form" },
  { name: "MIRAE ASSET", url: "https://www.miraeassetmf.co.in/downloads/forms" },
  { name: "MOTILAL OSWAL", url: "https://www.motilaloswalmf.com/downloads/forms" },
  { name: "PGIM INDIA", url: "https://www.pgimindia.com/forms-and-updates" },
  { name: "PPFAS", url: "https://amc.ppfas.com/downloads/ConfirmCitizenship.php" },
  { name: "QUANT", url: "https://quantmutual.com/downloads/forms" },
  { name: "SBI", url: "https://www.sbimf.com/forms" },
  { name: "SUNDARAM", url: "https://www.sundarammutual.com/Downloads" },
  { name: "TATA", url: "https://www.tatamutualfund.com/downloads/transaction-and-application-forms" },
  { name: "UTI", url: "https://www.utimf.com/downloads/kyc" },
];

export default function SidSaiKimModal({ open, onClose }) {
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
            aria-label="SID/SAI/KIM"
            onClick={(e) => e.stopPropagation()}
            className="relative bg-white flex flex-col overflow-hidden rounded-2xl w-full max-w-[560px] max-h-[85vh]"
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.97 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="px-5 py-4 flex items-center gap-3 flex-shrink-0" style={{ background: "#22568F" }}>
              <div className="flex-1">
                <h2 className="text-white font-semibold text-sm leading-tight">SID / SAI / KIM</h2>
                <p className="text-white/50 text-[11px] leading-tight">Fund house scheme documents</p>
              </div>
              <button
                onClick={onClose}
                aria-label="Close SID/SAI/KIM"
                className="w-8 h-8 rounded-lg flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 transition-colors flex-shrink-0"
              >
                <X size={18} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-5">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {AMC_LINKS.map((amc) => (
                 <a 
                    key={amc.name}
                    href={amc.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between gap-1.5 px-3 py-2 rounded-lg border border-[#E2EBF5] text-[#0D1B2E] text-[12px] font-medium hover:border-[#22568F] hover:bg-[#22568F]/5 transition-colors"
                  >
                    {amc.name}
                    <ExternalLink size={11} className="text-[#94A3B8] flex-shrink-0" />
                  </a>
                ))}
              </div>
              <p className="text-[#94A3B8] text-[11px] leading-relaxed mt-5 pt-4 border-t border-[#E2EBF5]">
                Links open each AMC's official forms/downloads page in a new tab. A few AMCs change their URLs from time to time — if a link is broken, please search the AMC's official website directly.
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}