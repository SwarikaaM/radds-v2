import { AnimatePresence, motion } from "framer-motion";
import { X, Shield } from "lucide-react";

const SECTIONS = [
  {
    title: "Introduction",
    body: [
      "This privacy policy sets out how RADDS Capital uses and protects any information that you share when you use this website. RADDS Capital is committed to ensuring that your privacy is protected at all times. Should we ask you to provide certain information by which you can be identified when using this website, you can be assured that it will only be used in accordance with this privacy statement.",
      "RADDS Capital may change this policy from time to time by updating this page. This policy is effective from 26 January 2023.",
      "RADDS Capital understands that our relationship is strongly built on trust and faith. In the course of using information on this website or availing the services, RADDS Capital may become privy to the personal information of its customers, including information that is of a confidential nature. RADDS Capital is strictly committed to protecting the privacy of its customers and has taken reasonable measures to protect the confidentiality of customer information and its transmission through the World Wide Web. However, it shall not be liable in any manner for disclosure of confidential information in accordance with this Privacy Commitment, or in terms of any agreement with the customer, or by reasons beyond its control.",
      "We may however be required to disclose your personal information to Government, judicial bodies, and our regulators, or to any person to whom the Firm is under an obligation to make disclosure under the requirements of any law binding on the Firm or any of its branches, if required.",
    ],
  },
  {
    title: "Hyperlink Policy",
    body: [
      "Any hyperlink to other internet sites is at the customer's own risk. The contents of which, and the accuracy of opinions expressed, are not verified, monitored, or endorsed by RADDS Capital in any way or manner. RADDS Capital is not responsible for the setup of any hyperlink from a third-party website to RADDS Capital.",
    ],
  },
  {
    title: "What We Collect",
    body: ["We may collect the following information:"],
    list: [
      "Name and contact details",
      "Personal information, including date of birth, Aadhaar Number, and Permanent Account Number (PAN)",
      "Demographic information such as gender and income",
      "Other information that can help us improve our services",
    ],
  },
  {
    title: "What We Do With the Information We Gather",
    list: [
      "To conduct Know-Your-Customer (KYC) registration as required by SEBI and/or other regulatory bodies",
      "To perform compliance checks and keep/maintain internal records",
      "To use the information to improve our products and services",
      "To periodically send emails to your registered email address about your investments, or other information which we think you may find interesting",
    ],
    bodyAfter: [
      "You will be free to unsubscribe from our mailing list at any time if you do not wish to receive such emails from us. From time to time, we may also use your information to contact you via phone or email for market research purposes.",
      "We will not sell, distribute, or lease your personal information to third parties unless we are required to share such information under the terms and conditions of the products and services you avail, or we are required to do so by law.",
    ],
  },
  {
    title: "Security",
    body: [
      "We are committed to ensuring that your information is secure. In order to prevent unauthorised access or disclosure, we have put in place suitable physical, electronic, and managerial procedures to safeguard and secure the information we collect online.",
    ],
  },
  {
    title: "Links to Other Websites",
    body: [
      "Our website may contain links to other websites of interest. However, once you have used these links to leave our site, you should note that we do not have any control over such third-party websites. Therefore, we cannot be responsible for the protection and privacy of any information which you provide whilst visiting such sites. You should exercise caution and look at the privacy statement applicable to the website in question.",
    ],
  },
  {
    title: "Security Certificates",
    body: [
      "RADDS Capital is an online financial services company. We fully recognise and understand the security implications of being a service provider with whom people trust their money. There are many safeguards we adopt in this regard — some technical, and some structural. When it comes to data security, our goal is to ensure that:",
    ],
    list: [
      "Your data is stored safely and securely, and passwords are one-way encrypted before being stored in the database for high security",
      "All communication with you, or with mutual fund companies and other service providers, is encrypted using the highest standards",
      "Your data is not shared with anyone, unless you have explicitly requested us to do so to fulfil a transaction request",
    ],
    bodyAfter: [
      "To ensure that we achieve these goals, we have a variety of certifications and trust verifications in place for our firm, both from technical and legal-operational perspectives. All our communications are encrypted by 256-bit encryption, and our data is hosted with top-tier hosting service providers. Also, our data is continuously backed up to ensure continuity of operations.",
    ],
  },
];

export default function PrivacyPolicyModal({ open, onClose }) {
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
            aria-label="Privacy Policy"
            onClick={(e) => e.stopPropagation()}
            className="relative bg-white flex flex-col overflow-hidden rounded-2xl w-full max-w-[560px] max-h-[85vh]"
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.97 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="px-5 py-4 flex items-center gap-3 flex-shrink-0" style={{ background: "#22568F" }}>
              <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                <Shield size={17} className="text-white" />
              </div>
              <div className="flex-1">
                <h2 className="text-white font-semibold text-sm leading-tight">Privacy Policy</h2>
                <p className="text-white/50 text-[11px] leading-tight">Effective from 26 January 2023</p>
              </div>
              <button
                onClick={onClose}
                aria-label="Close privacy policy"
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
                  {section.list && (
                    <ul className="list-disc pl-4 space-y-1.5 mb-2.5">
                      {section.list.map((item, i) => (
                        <li key={i} className="text-[#475569] text-[13px] leading-relaxed">
                          {item}
                        </li>
                      ))}
                    </ul>
                  )}
                  {section.bodyAfter?.map((p, i) => (
                    <p key={i} className="text-[#475569] text-[13px] leading-relaxed mb-2.5">
                      {p}
                    </p>
                  ))}
                </div>
              ))}

              <div className="pt-4 border-t border-[#E2EBF5]">
                <p className="text-[#94A3B8] text-[11px] leading-relaxed">
                  Radds Capital is an AMFI-registered Mutual Fund Distributor. We are not a SEBI Registered Investment Adviser.
                  For any privacy-related queries, please reach out to us via our Contact page.
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}