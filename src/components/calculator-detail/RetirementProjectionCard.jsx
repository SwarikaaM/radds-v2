import { formatINR, formatCompact } from "../../utils/format";

export default function RetirementProjectionCard({ results, retirementAge }) {
  if (!results) return null;
  const { currentCorpus, requiredCorpus, shortfall } = results;
  const pct = requiredCorpus > 0 ? Math.min(100, (currentCorpus / requiredCorpus) * 100) : 0;
  const onTrack = shortfall <= 0;

  return (
    <div className="rounded-card border border-[#E2EBF5] bg-white p-6">
      <p className="text-textmuted text-xs font-semibold uppercase tracking-wide mb-2">
        Your Retirement Projection
      </p>

      {onTrack ? (
        <p className="text-textprimary text-lg font-semibold leading-snug mb-5">
          You're on track to meet your required corpus by age {retirementAge}.
        </p>
      ) : (
        <p className="text-textprimary text-lg font-semibold leading-snug mb-5">
          To reach your required corpus, you need{" "}
          <span className="text-warning">{formatCompact(shortfall)} more</span> by age {retirementAge}.
        </p>
      )}

      <div className="w-full h-2.5 bg-[#E2EBF5] rounded-full overflow-hidden mb-6">
        <div
          className={`h-full rounded-full transition-all duration-500 ${
            onTrack ? "bg-success" : "bg-gradient-to-r from-primary to-secondary"
          }`}
          style={{ width: `${pct}%` }}
        />
      </div>

      <div className="flex justify-between">
        <div>
          <p className="font-mono-num font-bold text-lg text-textprimary">{formatINR(currentCorpus)}</p>
          <p className="text-textmuted text-xs">Current Corpus</p>
        </div>
        <div className="text-right">
          <p className="font-mono-num font-bold text-lg text-textprimary">{formatINR(requiredCorpus)}</p>
          <p className="text-textmuted text-xs">Required Corpus</p>
        </div>
      </div>
    </div>
  );
}