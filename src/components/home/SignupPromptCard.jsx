import { Link } from "react-router-dom";
import { BarChart2 } from "lucide-react";

export default function SignupPromptCard() {
  return (
    <div className="rounded-xl bg-gradient-to-br from-[#22568F] to-[#1a4070] p-5 text-white">
      <div className="flex items-center gap-2 mb-2">
        <BarChart2 size={18} className="text-accent" />
        <p className="font-semibold text-sm">Get Your Financial Plan</p>
      </div>
      <p className="text-white/70 text-xs mb-4">
        Enter your income and expenses — get a personalised Excel & PDF financial plan instantly. No login needed.
      </p>
      <Link
        to="/financial-planning"
        className="block text-center bg-white text-primary font-semibold text-sm py-2 px-4 rounded-lg hover:bg-accent hover:text-white transition-colors"
      >
        Create My Plan →
      </Link>
    </div>
  );
}
