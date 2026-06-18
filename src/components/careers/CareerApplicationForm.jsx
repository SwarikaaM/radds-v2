import { useState } from "react";
import { Upload, X, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import Button from "../ui/Button";
import SectionHeader from "../ui/SectionHeader";

const POSITIONS = [
  "Mutual Fund Advisor",
  "Insurance Advisor",
  "Financial Planner",
  "Operations Executive",
  "Digital Marketing",
  "Other",
];

export default function CareerApplicationForm() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", position: "", experience: "", linkedin: "", message: "" });
  const [resume, setResume] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle"); // idle | loading | success | error
  const [serverError, setServerError] = useState("");

  function set(field, value) { setForm(f => ({ ...f, [field]: value })); setErrors(e => ({ ...e, [field]: "" })); }

  function handleFile(file) {
    if (!file) return;
    const allowed = ["application/pdf", "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
    if (!allowed.includes(file.type)) {
      setErrors(e => ({ ...e, resume: "Only PDF or Word documents (.pdf, .doc, .docx) are accepted" }));
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setErrors(e => ({ ...e, resume: "File must be under 5MB" }));
      return;
    }
    setResume(file);
    setErrors(e => ({ ...e, resume: "" }));
  }

  function validate() {
    const e = {};
    if (!form.name.trim() || form.name.trim().length < 2) e.name = "Please enter your name";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) e.email = "Please enter a valid email address";
    if (!form.phone || !/^[6-9]\d{9}$/.test(form.phone)) e.phone = "Enter a valid 10-digit Indian mobile number";
    if (!form.position) e.position = "Please select a position";
    return e;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setStatus("loading");
    setServerError("");

    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      if (resume) fd.append("resume", resume);
      // Honeypot
      fd.append("honeypot", "");

      const res = await fetch("/api/careers", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong");
      setStatus("success");
    } catch (err) {
      setStatus("error");
      setServerError(err.message || "Failed to submit. Please try again.");
    }
  }

  if (status === "success") {
    return (
      <section className="py-20 bg-white">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-5">
            <CheckCircle size={32} className="text-green-500" />
          </div>
          <h2 className="font-playfair text-3xl font-bold text-[#0D1B2E] mb-3">Application Submitted!</h2>
          <p className="text-[#6B7E99] max-w-sm mx-auto">Thank you for your interest in Radds Capital. We'll review your application and be in touch soon.</p>
        </div>
      </section>
    );
  }

  const inputClass = (field) =>
    `w-full border rounded-lg p-3 text-sm outline-none transition-all focus:border-[#22568F] focus:shadow-[0_0_0_3px_rgba(34,86,143,0.08)] ${
      errors[field] ? "border-red-400 bg-red-50" : "border-[#D1DDE8]"
    }`;

  return (
    <section className="py-20 bg-white">
      <div className="max-w-3xl mx-auto px-6">
        <SectionHeader eyebrow="Apply Now" title="Join Our Team" subtitle="Fill in your details and attach your resume. We'll get back to you promptly." className="mb-8" />

        {status === "error" && (
          <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 mb-6 text-sm">
            <AlertCircle size={16} className="flex-shrink-0" />
            {serverError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5" noValidate>
          {/* Honeypot */}
          <input type="text" name="honeypot" tabIndex={-1} autoComplete="off"
            style={{ position: "absolute", left: "-9999px", opacity: 0 }} onChange={() => {}} />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block mb-1.5 text-sm font-medium text-[#3D4F66]">Full Name *</label>
              <input type="text" autoComplete="name" placeholder="Your name" maxLength={100}
                className={inputClass("name")} value={form.name}
                onChange={e => set("name", e.target.value)} required/>
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
            </div>
            <div>
              <label className="block mb-1.5 text-sm font-medium text-[#3D4F66]">Email Address *</label>
              <input type="email" autoComplete="email" placeholder="you@example.com" maxLength={100}
                className={inputClass("email")} value={form.email}
                onChange={e => set("email", e.target.value)} required/>
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block mb-1.5 text-sm font-medium text-[#3D4F66]">Mobile Number *</label>
              <input type="tel" inputMode="numeric" placeholder="9876543210" maxLength={10}
                className={inputClass("phone")} value={form.phone}
                onChange={e => set("phone", e.target.value.replace(/\D/g,"").slice(0,10))} required/>
              {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
            </div>
            <div>
              <label className="block mb-1.5 text-sm font-medium text-[#3D4F66]">Position Applying For *</label>
              <select className={inputClass("position")} value={form.position}
                onChange={e => set("position", e.target.value)} required>
                <option value="">Select a position</option>
                {POSITIONS.map(p => <option key={p}>{p}</option>)}
              </select>
              {errors.position && <p className="text-red-500 text-xs mt-1">{errors.position}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block mb-1.5 text-sm font-medium text-[#3D4F66]">Years of Experience</label>
              <select className={inputClass("experience")} value={form.experience}
                onChange={e => set("experience", e.target.value)} required>
                <option value="">Select experience</option>
                <option>Fresher (0 years)</option>
                <option>1–2 years</option>
                <option>3–5 years</option>
                <option>5–10 years</option>
                <option>10+ years</option>
              </select>
            </div>
            <div>
              <label className="block mb-1.5 text-sm font-medium text-[#3D4F66]">LinkedIn Profile</label>
              <input type="url" placeholder="https://linkedin.com/in/yourname" maxLength={200}
                className={inputClass("linkedin")} value={form.linkedin}
                onChange={e => set("linkedin", e.target.value)} />
            </div>
          </div>

          {/* Resume upload */}
          <div>
            <label className="block mb-1.5 text-sm font-medium text-[#3D4F66]">Resume / CV</label>
            {resume ? (
              <div className="flex items-center gap-3 border border-[#22568F]/30 bg-[#EAF2FF] rounded-lg p-3">
                <div className="w-8 h-8 bg-[#22568F]/10 rounded flex items-center justify-center flex-shrink-0">
                  <Upload size={14} className="text-[#22568F]" required/>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[#0D1B2E] truncate">{resume.name}</p>
                  <p className="text-xs text-[#6B7E99]">{(resume.size / 1024).toFixed(0)} KB</p>
                </div>
                <button type="button" onClick={() => setResume(null)} className="text-[#6B7E99] hover:text-red-500 transition-colors">
                  <X size={16} />
                </button>
              </div>
            ) : (
              <label
                className={`flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-8 cursor-pointer transition-all ${
                  dragOver ? "border-[#22568F] bg-[#EAF2FF]" : "border-[#D1DDE8] hover:border-[#22568F]/50 hover:bg-[#F8FAFC]"
                } ${errors.resume ? "border-red-400" : ""}`}
                onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={e => { e.preventDefault(); setDragOver(false); handleFile(e.dataTransfer.files[0]); }}
              >
                <Upload size={22} className="text-[#6B7E99] mb-2" />
                <p className="text-sm text-[#3D4F66] font-medium">Drag & drop or click to upload</p>
                <p className="text-xs text-[#6B7E99] mt-1">PDF, DOC, DOCX — max 5MB</p>
                <input type="file" accept=".pdf,.doc,.docx" className="hidden"
                  onChange={e => handleFile(e.target.files[0])} />
              </label>
            )}
            {errors.resume && <p className="text-red-500 text-xs mt-1">{errors.resume}</p>}
          </div>

          <div>
            <label className="block mb-1.5 text-sm font-medium text-[#3D4F66]">Cover Letter / Message</label>
            <textarea rows={4} placeholder="Tell us why you'd be a great fit..." maxLength={2000}
              className={inputClass("message")} value={form.message}
              onChange={e => set("message", e.target.value)} required/>
            <p className="text-xs text-[#6B7E99] mt-1 text-right">{form.message.length}/2000</p>
          </div>

          <Button type="submit" disabled={status === "loading"} className="flex items-center gap-2">
            {status === "loading" ? <><Loader2 size={15} className="animate-spin" /> Submitting...</> : "Submit Application"}
          </Button>
        </form>
      </div>
    </section>
  );
}
