import { useEffect, useState } from "react";
import { useClient } from "sanity";
import { DashboardWidgetContainer } from "@sanity/dashboard";
import {
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer,
} from "recharts";

type Stats = {
  totalPosts: number;
  totalAuthors: number;
  categories: { title: string; count: number }[];
};

const COLORS = [
  "#f05d23", "#0a7c42", "#1a56db", "#9333ea",
  "#e11d48", "#0891b2", "#d97706", "#16a34a",
];

export function ContentStatsWidget() {
  const client = useClient({ apiVersion: "2024-01-01" });
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    Promise.all([
      client.fetch<number>(`count(*[_type == "blog"])`),
      client.fetch<number>(`count(*[_type == "author"])`),
      client.fetch<{ title: string; count: number }[]>(`
        *[_type == "category"] | order(title asc) {
          title,
          "count": count(*[_type == "blog" && references(^._id)])
        }
      `),
    ]).then(([totalPosts, totalAuthors, categories]) =>
      setStats({ totalPosts, totalAuthors, categories }),
    );
  }, [client]);

  return (
    <DashboardWidgetContainer header="Content Overview">
      {!stats ? (
        <p style={{ color: "#888", padding: "16px 20px", fontSize: 13 }}>Loading…</p>
      ) : (
        <div style={{ padding: "16px 20px" }}>
          {/* Stat boxes */}
          <div style={{ display: "flex", gap: 12, marginBottom: 20 }}>
            <StatBox label="Total Posts" value={stats.totalPosts} color="#f05d23" />
            <StatBox label="Authors" value={stats.totalAuthors} color="#0a7c42" />
            <StatBox label="Categories" value={stats.categories.length} color="#1a56db" />
          </div>

          {/* Donut chart */}
          <p style={{ margin: "0 0 8px", fontSize: 11, fontWeight: 700, color: "#888", textTransform: "uppercase", letterSpacing: "0.06em" }}>
            Posts by Category
          </p>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie
                data={stats.categories}
                dataKey="count"
                nameKey="title"
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={95}
                paddingAngle={3}
                strokeWidth={0}
              >
                {stats.categories.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value, name) => [`${Number(value)} posts`, String(name)]}
                contentStyle={{ borderRadius: 8, border: "1px solid #e5e7eb", fontSize: 12 }}
              />
              <Legend
                iconType="circle"
                iconSize={8}
                formatter={(value) => <span style={{ fontSize: 12, color: "#444" }}>{value}</span>}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}
    </DashboardWidgetContainer>
  );
}

function StatBox({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div style={{
      flex: 1, display: "flex", flexDirection: "column", alignItems: "center",
      padding: "12px 8px", borderRadius: 10, border: `2px solid ${color}`,
      background: "#fafafa",
    }}>
      <span style={{ fontSize: 28, fontWeight: 700, color, lineHeight: 1 }}>{value}</span>
      <span style={{ fontSize: 11, color: "#888", marginTop: 4, textTransform: "uppercase", letterSpacing: "0.05em" }}>{label}</span>
    </div>
  );
}
