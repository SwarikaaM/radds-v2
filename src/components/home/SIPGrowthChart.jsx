import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

function fmtY(n) {
  if (Math.abs(n) >= 1e7) return (n / 1e7).toFixed(1) + " Cr";
  if (Math.abs(n) >= 1e5) return (n / 1e5).toFixed(1) + " L";
  if (Math.abs(n) >= 1000) return (n / 1000).toFixed(0) + "K";
  return String(n);
}

export default function SIPGrowthChart({ data, inflationEnabled, years }) {
  const visibleData = data.filter(d => d.year <= years);
  const barSize = visibleData.length > 25 ? 14 : visibleData.length > 15 ? 11 : 14;

  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={visibleData} barSize={barSize} barCategoryGap="25%">
        <CartesianGrid vertical={false} stroke="#E8EFF6" strokeDasharray="3 0" />
        <XAxis
          dataKey="year"
          tick={{ fontSize: 10, fill: "#9BAAB8" }}
          tickFormatter={v => `${v}Y`}
          interval={0}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={{ fontSize: 10, fill: "#9BAAB8" }}
          tickFormatter={fmtY}
          axisLine={false}
          tickLine={false}
          width={62}
        />
        <Tooltip
          formatter={(value, name) => {
            const labels = { invested: "Invested", growth: "Growth", real_growth: "Growth (Adj.)" };
            return ["₹" + Number(value).toLocaleString("en-IN"), labels[name] || name];
          }}
          labelFormatter={l => `Year ${l}`}
          contentStyle={{ fontSize: 12, borderRadius: 6, border: "1px solid #E2EBF5" }}
          cursor={{ fill: "rgba(34,86,143,0.03)" }}
        />
        <Bar dataKey="invested" stackId="s" fill="#B8D0EE" radius={[0, 0, 0, 0]} />
        <Bar dataKey={inflationEnabled ? "real_growth" : "growth"} stackId="s" fill="#3B6FC4" radius={[2, 2, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
