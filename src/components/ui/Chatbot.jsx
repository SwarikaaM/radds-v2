import { useState, useRef, useEffect } from "react";
import logoPNG from "../../assets/Logo.png"; 

const WHATSAPP_NUMBER = ["91966", "415", "0986"].join("");
const KYC_SIGNUP_URL = "https://raddsenterprises.investwell.app/app/#/kycOnBoarding/mobileSignUp";

const FAQS = [
  {
    q: "What does Radds Capital do?",
    a: "Radds Capital is an AMFI-registered Mutual Fund Distributor (MFD). We help you invest in mutual funds by understanding your risk profile and investment goals, and assisting you in executing transactions. We do not provide investment advice or financial planning services.",
  },
  {
    q: "Do you provide investment advice or financial planning?",
    a: "No. As an AMFI-registered MFD, we are not permitted to provide investment advice or financial planning. We provide only incidental guidance to help you choose mutual fund schemes suitable to your risk profile and investment goals.",
  },
  {
    q: "How do you recommend mutual fund schemes?",
    a: "We first assess your risk profile, investment horizon, and goals. Based on this assessment, we suggest a curated list of mutual fund schemes that may be suitable for you. All recommendations are limited to mutual funds only.",
  },
  {
    q: "Can I start a SIP for a specific goal?",
    a: "Yes. We can assist you with goal-based SIP investments — such as for children's education, marriage, or buying a home — but our recommendations are limited to mutual fund schemes only.",
  },
  {
    q: "Is my portfolio reviewed periodically?",
    a: "As an AMFI-registered MFD, we periodically review the mutual fund schemes we distribute and may bring relevant scheme-level updates to your attention. Any switch or redemption decision remains yours as the investor. We do not provide portfolio management services.",
  },
  {
    q: "What is an Execution Only transaction?",
    a: "An Execution Only transaction is one where you, the investor, decide and choose the mutual fund scheme yourself without any recommendation from us. We simply assist in executing the transaction.",
  },
  {
    q: "Do you earn commissions?",
    a: "As an AMFI-registered MFD, we earn trail commission from the AMCs on the mutual fund schemes we distribute. There are no hidden fees. Commission details are disclosed transparently.",
  },
  {
    q: "Are mutual funds safe?",
    a: "Mutual funds are SEBI-regulated investment products. However, they are subject to market risk. Please read all scheme-related documents carefully before investing. Past performance does not guarantee future returns.",
  },
  {
    q: "How do I start investing?",
    a: "Great — you can start your KYC and onboarding right here. Tap the button below to get started, or reach out to us on WhatsApp and we'll guide you through it.",
    type: "kyc",
  },
  {
    q: "How do I start a SIP?",
    a: "You can begin by completing your KYC online. Tap the button below to get started, or reach out to us on WhatsApp and we'll guide you through risk profiling and scheme selection.",
    type: "kyc",
  },
  {
    q: "What records do you maintain for me?",
    a: "We maintain records of your risk profile, scheme suitability assessments, and transaction correspondence as required under AMFI and SEBI guidelines.",
  },
  {
    q: "Why do I need insurance if I am healthy?",
    a: "It's natural to feel that way — but insurance is easiest to get exactly when you feel you don't need it. While you're healthy, insurers are happy to cover you. Once an illness shows up, insurers can decline cover or charge much more for it. Getting covered while you're healthy is what makes the protection valid for when you actually need it.",
  },
];

// Tokenize into lowercase words, stripping punctuation, keeping words >2 chars
// (so "sip" still counts) but excluding common filler words that would
// otherwise cause unrelated FAQs to match.
const STOPWORDS = new Set([
  "the", "a", "an", "is", "are", "do", "does", "did", "how", "what", "who",
  "you", "your", "i", "we", "to", "for", "of", "in", "on", "and", "or",
  "can", "my", "me", "if", "am", "with", "this", "that", "it", "be",
]);

function tokenize(str) {
  return str
    .toLowerCase()
    .replace(/[?.,!]/g, "")
    .split(/\s+/)
    .filter((w) => w.length > 2 && !STOPWORDS.has(w));
}

function getBotReply(input, userName) {
  const inputTokens = tokenize(input);
  if (inputTokens.length === 0) return null;

  let best = null;
  let bestScore = -1;

  for (const f of FAQS) {
    const qTokens = tokenize(f.q);
    let rawMatches = 0;
    for (const t of inputTokens) {
      if (qTokens.includes(t)) rawMatches += 1;
      else if (qTokens.some((qt) => qt.includes(t) || t.includes(qt))) rawMatches += 0.5;
    }
    if (rawMatches === 0) continue;

    // Score = how much of the FAQ's own question is covered by the input
    // (precision), weighted with how much of the input is covered by the
    // question (recall). This favours short, specific questions like
    // "How do I start a SIP?" over loosely-related ones like "Can I start
    // a SIP for a specific goal?" when both share a couple of words.
    const precision = rawMatches / qTokens.length;
    const recall = rawMatches / inputTokens.length;
    const score = precision * recall;

    if (score > bestScore) {
      bestScore = score;
      best = f;
    }
  }

  // Require a reasonably confident match to avoid false positives
  if (best && bestScore >= 0.15) {
    return { text: best.a, type: best.type };
  }

  const keywords = [
    ["sip", "invest", "start", "begin", "mutual fund", "fund", "kyc"],
    ["advice", "planning", "financial plan"],
    ["commission", "fee", "earn", "charge"],
    ["safe", "risk", "market"],
    ["review", "portfolio", "performance"],
    ["goal", "education", "marriage", "house", "car"],
    ["execution", "transaction", "execute"],
    ["record", "document"],
    ["recommend", "suggest", "select"],
    ["insurance", "healthy", "sick", "ill", "cover", "premium"],
    ["what", "who", "radds"],
  ];

  const lower = input.toLowerCase().trim();
  for (const group of keywords) {
    if (group.some((k) => lower.includes(k))) {
      const faq = FAQS.find((f) =>
        group.some((k) => f.q.toLowerCase().includes(k))
      );
      if (faq) return { text: faq.a, type: faq.type };
    }
  }

  return null;
}

function WhatsAppLink({ userName }) {
  const msg = encodeURIComponent(
    `Hi, I'm ${userName || "a visitor"} from the Radds Capital website. I'd like to connect with you.`
  );
  return (
    <a
      href={`https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-2 mt-2 px-4 py-2 rounded-btn text-sm font-medium text-white"
      style={{ background: "#25D366" }}
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
      </svg>
      Chat on WhatsApp
    </a>
  );
}

export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState("name"); // "name" | "chat"
  const [userName, setUserName] = useState("");
  const [nameInput, setNameInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const bottomRef = useRef(null);

  useEffect(() => {
    if (open && step === "chat" && messages.length === 0) {
      setMessages([
        {
          from: "bot",
          text: `Hi ${userName}! 👋 I'm here to help you with questions about mutual fund distribution and our services. What would you like to know?`,
        },
        {
          from: "bot",
          type: "suggestions",
        },
      ]);
    }
  }, [open, step]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleNameSubmit = (e) => {
    e.preventDefault();
    const trimmed = nameInput.trim();
    if (!trimmed) return;
    setUserName(trimmed);
    setStep("chat");
  };

  const handleSend = (text) => {
    const userText = text || input.trim();
    if (!userText) return;
    setInput("");

    const newMessages = [...messages, { from: "user", text: userText }];

    const reply = getBotReply(userText, userName);
    if (reply) {
      newMessages.push({ from: "bot", text: reply.text, type: reply.type });
    } else {
      newMessages.push({
        from: "bot",
        text: "I don't have a specific answer for that. Please connect with us on WhatsApp and our team will be happy to assist you. Radds Capital — AMFI-Registered MFD (ARN-334716 | ARN-292158 | ARN-124053).",
        type: "whatsapp",
      });
    }

    setMessages(newMessages);
  };

  const SUGGESTIONS = [
    "What does Radds Capital do?",
    "How do you recommend funds?",
    "Can I start a SIP?",
    "Do you charge fees?",
  ];

  return (
    <>
      {/* Floating Button */}
        <button
        onClick={() => setOpen((v) => !v)}
        className="fixed bottom-6 left-6 lg:right-6 lg:left-auto z-50 flex items-center gap-2 shadow-lg focus:outline-none transition-all duration-300"
        style={{
            background: "linear-gradient(135deg, #22568F, #2389AF)",
            borderRadius: open ? "50%" : "50px",
            padding: open ? "14px" : "12px 18px",
            boxShadow: "0 4px 24px rgba(34,86,143,0.45)",
        }}
        aria-label="Open chat"
        >
        {open ? (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
        ) : (
            <>
            {/* Pulse ring */}
            <span className="absolute" style={{
                width: "52px", height: "52px", borderRadius: "50%",
                background: "rgba(34,86,143,0.3)",
                animation: "ping 1.6s cubic-bezier(0,0,0.2,1) infinite",
                top: "50%", left: "50%", transform: "translate(-50%,-50%)",
                pointerEvents: "none",
            }} />

            {/* Chat icon */}
            <svg width="22" height="22" viewBox="0 0 24 24" fill="white" style={{ flexShrink: 0 }}>
                <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z" />
            </svg>

            {/* Label + notification dot — hidden on small screens to keep the button compact */}
            <span className="hidden sm:flex items-center gap-1.5 text-white font-dm font-medium text-sm pr-1" style={{ whiteSpace: "nowrap" }}>
                Chat with us
            </span>
            <span style={{
              width: "8px", height: "8px", borderRadius: "50%",
              background: "#25D366",
              display: "inline-block",
              boxShadow: "0 0 0 2px white",
              animation: "pulse-dot 2s ease-in-out infinite",
              position: "absolute",
              top: "-2px",
              right: "-2px",
            }} />
            </>
        )}
        </button>

      {/* Chat Window */}
      {open && (
        <div
          className="fixed bottom-24 left-6 lg:right-6 lg:left-auto z-50 w-80 rounded-card shadow-2xl flex flex-col overflow-hidden"
          style={{ maxHeight: "480px", border: "1px solid #e2e8f0", background: "#fff" }}
        >
          {/* Header */}
          <div className="px-4 py-3 flex items-center gap-3" style={{ background: "#22568F" }}>
            <div className="bg-white rounded-md px-2 py-1.5 flex-shrink-0">
              <img src={logoPNG} alt="Radds Capital" className="h-6 w-auto object-contain" />
            </div>
            <div className="text-white/70 text-xs">AMFI-registered MFD</div>
          </div>

          {step === "name" ? (
            /* Name Step */
            <div className="flex flex-col flex-1 p-5 justify-center gap-4">
              <p className="text-sm text-textprimary font-dm">
                Welcome! Before we begin, may we know your name?
              </p>
              <form onSubmit={handleNameSubmit} className="flex flex-col gap-3">
                <input
                  autoFocus
                  type="text"
                  placeholder="Your name"
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  className="border border-gray-200 rounded-input px-3 py-2 text-sm font-dm focus:outline-none focus:border-primary"
                  style={{ borderRadius: "4px" }}
                />
                <button
                  type="submit"
                  className="py-2 rounded-btn text-sm text-white font-medium font-dm"
                  style={{ background: "#22568F" }}
                >
                  Start Chat
                </button>
              </form>
              <p className="text-xs text-textmuted text-center">
                Mutual fund investments are subject to market risks. Please read all scheme related documents carefully.
              </p>
            </div>
          ) : (
            /* Chat Step */
            <>
              <div className="flex-1 overflow-y-auto p-4 space-y-3" style={{ minHeight: 0 }}>
                {messages.map((msg, i) => (
                  <div key={i} className={`flex ${msg.from === "user" ? "justify-end" : "justify-start"}`}>
                    {msg.type === "suggestions" ? (
                      <div className="flex flex-col gap-1 w-full">
                        <p className="text-xs text-textmuted font-dm mb-1">Quick questions:</p>
                        {SUGGESTIONS.map((s) => (
                          <button
                            key={s}
                            onClick={() => handleSend(s)}
                            className="text-left text-xs px-3 py-1.5 rounded-full border font-dm transition-colors hover:bg-primary hover:text-white"
                            style={{ borderColor: "#22568F", color: "#22568F" }}
                          >
                            {s}
                          </button>
                        ))}
                      </div>
                    ) : (
                      <div
                        className={`max-w-[85%] px-3 py-2 rounded-card text-sm font-dm ${
                          msg.from === "user"
                            ? "text-white"
                            : "text-textprimary bg-lightbg"
                        }`}
                        style={msg.from === "user" ? { background: "#22568F", borderRadius: "12px 12px 4px 12px" } : { borderRadius: "12px 12px 12px 4px" }}
                      >
                        {msg.text}
                        {msg.type === "whatsapp" && <WhatsAppLink userName={userName} />}
                        {msg.type === "kyc" && (
                          <a
                            href={KYC_SIGNUP_URL}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 mt-2 px-4 py-2 rounded-btn text-sm font-medium text-white"
                            style={{ background: "#22568F" }}
                          >
                            Start KYC & Sign Up
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                ))}
                <div ref={bottomRef} />
              </div>

              {/* WhatsApp persistent CTA */}
              <div className="px-4 py-2 border-t border-gray-100 flex justify-between items-center">
                <span className="text-xs text-textmuted font-dm">Need more help?</span>
                <WhatsAppLink userName={userName} />
              </div>

              {/* Input */}
              <div className="px-3 pb-3 pt-1 flex gap-2">
                <input
                  type="text"
                  placeholder="Ask a question..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                  className="flex-1 border border-gray-200 rounded-input px-3 py-2 text-sm font-dm focus:outline-none focus:border-primary"
                  style={{ borderRadius: "4px" }}
                />
                <button
                  onClick={() => handleSend()}
                  className="px-3 py-2 rounded-btn text-white text-sm"
                  style={{ background: "#22568F" }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                    <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                  </svg>
                </button>
              </div>

              {/* AMFI Disclaimer */}
              <div className="px-3 pb-2 text-center">
                <p className="text-xs text-textmuted font-dm" style={{ fontSize: "10px" }}>
                  Radds Capital — AMFI-registered Mutual Fund Distributor. Investments subject to market risk (ARN-334716 | ARN-292158 | ARN-124053).
                </p>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
}


