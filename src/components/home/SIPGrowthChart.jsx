import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";

function fmt(n) {
  if (n >= 1e7) return (n / 1e7).toFixed(1) + "Cr";
  if (n >= 1e5) return (n / 1e5).toFixed(1) + "L";
  return (n / 1000).toFixed(0) + "K";
}

export default function SIPGrowthChart({ data, inflationEnabled, years }) {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={data} barSize={data.length > 20 ? 10 : 14} barGap={2}>
        <XAxis
          dataKey="year"
          tick={{ fontSize: 10, fill: "#6B7E99" }}
          tickFormatter={v => `${v}Y`}
          interval={data.length > 20 ? 4 : 2}
          axisLine={false} tickLine={false}
        />
        <YAxis
          tick={{ fontSize: 10, fill: "#6B7E99" }}
          tickFormatter={fmt}
          axisLine={false} tickLine={false} width={44}
        />
        <Tooltip
          formatter={(value, name) => {
            const labels = { invested: "Invested", total: "Maturity (Nominal)", real: "Maturity (Real)" };
            return ["₹" + Number(value).toLocaleString("en-IN"), labels[name] || name];
          }}
          labelFormatter={l => `Year ${l}`}
          contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid #E2EBF5" }}
        />
        <Bar dataKey="invested" radius={[3, 3, 0, 0]}>
          {data.map((entry, i) => (
            <Cell key={i} fill={entry.year <= years ? "#22568F" : "#C8DCF5"} fillOpacity={entry.year <= years ? 1 : 0.5} />
          ))}
        </Bar>
        <Bar dataKey={inflationEnabled ? "real" : "total"} radius={[3, 3, 0, 0]}>
          {data.map((entry, i) => (
            <Cell key={i} fill={entry.year <= years ? "#F5A623" : "#FAD89B"} fillOpacity={entry.year <= years ? 1 : 0.5} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
