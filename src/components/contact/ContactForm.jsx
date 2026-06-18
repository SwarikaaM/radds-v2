import { useState } from "react";
import { CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import Button from "../ui/Button";

export default function ContactForm() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", subject: "", message: "" });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle"); // idle | loading | success | error
  const [serverError, setServerError] = useState("");

  function set(field, value) { setForm(f => ({ ...f, [field]: value })); setErrors(e => ({ ...e, [field]: "" })); }

  function validate() {
    const e = {};
    if (!form.name.trim() || form.name.trim().length < 2) e.name = "Please enter your name (min 2 characters)";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) e.email = "Please enter a valid email address";
    if (!form.phone.trim()) {
      e.phone = "Please enter your mobile number";
    } else if (!/^[6-9]\d{9}$/.test(form.phone)) {
      e.phone = "Enter a valid 10-digit Indian mobile number";
    }
    if (!form.subject) e.subject = "Please select a subject";
    if (form.message.trim().length < 20) e.message = "Message must be at least 20 characters";
    return e;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setStatus("loading");
    setServerError("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong");
      setStatus("success");
      setForm({ name: "", email: "", phone: "", subject: "", message: "" });
    } catch (err) {
      setStatus("error");
      setServerError(err.message || "Failed to send message. Please try again.");
    }
  }

  if (status === "success") {
    return (
      <section className="py-24 bg-white">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-5">
            <CheckCircle size={32} className="text-green-500" />
          </div>
          <h2 className="font-playfair text-3xl font-bold text-[#0D1B2E] mb-3">Message Sent!</h2>
          <p className="text-[#6B7E99] mb-6">Thank you for reaching out. Our team will get back to you within 1–2 business days.</p>
          <button onClick={() => setStatus("idle")} className="text-[#22568F] font-medium hover:underline text-sm">
            Send another message
          </button>
        </div>
      </section>
    );
  }

  const inputClass = (field) =>
    `w-full border rounded-lg p-3 text-sm outline-none transition-all focus:border-[#22568F] focus:shadow-[0_0_0_3px_rgba(34,86,143,0.08)] ${
      errors[field] ? "border-red-400 bg-red-50" : "border-[#D1DDE8]"
    }`;

  return (
    <section className="py-24 bg-white">
      <div className="max-w-3xl mx-auto px-6">
        <h2 className="font-playfair text-4xl font-bold text-[#0D1B2E] mb-2">Send Us a Message</h2>
        <p className="text-[#6B7E99] mb-8">We'll respond within 1–2 business days.</p>

        {status === "error" && (
          <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 mb-6 text-sm">
            <AlertCircle size={16} className="flex-shrink-0" />
            {serverError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5" noValidate>
          {/* Honeypot — hidden from humans, bots fill it */}
          <input type="text" name="honeypot" tabIndex={-1} autoComplete="off"
            style={{ position: "absolute", left: "-9999px", opacity: 0 }}
            onChange={() => {}} />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block mb-1.5 text-sm font-medium text-[#3D4F66]">Full Name *</label>
              <input type="text" autoComplete="name" placeholder="Your name" maxLength={100}
                className={inputClass("name")} value={form.name}
                onChange={e => set("name", e.target.value)}   />
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
            </div>
            <div>
              <label className="block mb-1.5 text-sm font-medium text-[#3D4F66]">Email Address *</label>
              <input type="email" autoComplete="email" placeholder="you@example.com" maxLength={100}
                className={inputClass("email")} value={form.email}
                onChange={e => set("email", e.target.value)}  />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block mb-1.5 text-sm font-medium text-[#3D4F66]">Mobile Number *</label>
              <input type="tel" inputMode="numeric" placeholder="9876543210" maxLength={10}
                className={inputClass("phone")} value={form.phone}
                onChange={e => set("phone", e.target.value.replace(/\D/g,"").slice(0,10))}  />
              {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
            </div>
            <div>
              <label className="block mb-1.5 text-sm font-medium text-[#3D4F66]">Subject *</label>
              <select className={inputClass("subject")} value={form.subject}
                onChange={e => set("subject", e.target.value)}>
                <option value="">Select Subject</option>
                <option>General Enquiry</option>
                <option>Investment Query</option>
                <option>Insurance</option>
                <option>Complaint</option>
                {/* <option>Partnership</option> */}
              </select>
              {errors.subject && <p className="text-red-500 text-xs mt-1">{errors.subject}</p>}
            </div>
          </div>

          <div>
            <label className="block mb-1.5 text-sm font-medium text-[#3D4F66]">Message *</label>
            <textarea rows={5} placeholder="Tell us how we can help..." maxLength={2000}
              className={inputClass("message")} value={form.message}
              onChange={e => set("message", e.target.value)}  />
            <div className="flex justify-between mt-1">
              {errors.message ? <p className="text-red-500 text-xs">{errors.message}</p> : <span />}
              <p className="text-xs text-[#6B7E99]">{form.message.length}/2000</p>
            </div>
          </div>

          <Button type="submit" disabled={status === "loading"} className="flex items-center gap-2">
            {status === "loading" ? <><Loader2 size={15} className="animate-spin" /> Sending...</> : "Submit Message"}
          </Button>
        </form>
      </div>
    </section>
  );
}
