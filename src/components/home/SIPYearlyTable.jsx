function fmt(n) {
  if (n >= 1e7) return "₹" + (n / 1e7).toFixed(2) + " Cr";
  if (n >= 1e5) return "₹" + (n / 1e5).toFixed(2) + " L";
  return "₹" + n.toLocaleString("en-IN");
}

export default function SIPYearlyTable({ data, inflationEnabled, years }) {
  return (
    <div className="overflow-auto max-h-[220px] rounded-lg border border-[#E2EBF5]">
      <table className="w-full text-xs">
        <thead className="sticky top-0 bg-[#22568F] text-white">
          <tr>
            <th className="px-3 py-2 text-left font-medium">Year</th>
            <th className="px-3 py-2 text-right font-medium">Invested</th>
            <th className="px-3 py-2 text-right font-medium">Maturity</th>
            {inflationEnabled && <th className="px-3 py-2 text-right font-medium">Real Value</th>}
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr key={row.year}
              className={`border-t border-[#F0F4F8] ${row.year === years ? "bg-blue-50 font-semibold" : i % 2 === 0 ? "bg-white" : "bg-[#F9FBFD]"}`}
            >
              <td className="px-3 py-1.5 text-textmuted">{row.year}Y</td>
              <td className="px-3 py-1.5 text-right text-textprimary">{fmt(row.invested)}</td>
              <td className="px-3 py-1.5 text-right text-primary font-medium">{fmt(row.total)}</td>
              {inflationEnabled && <td className="px-3 py-1.5 text-right text-amber-600">{fmt(row.real)}</td>}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
