import { useEffect, useState } from "react";
import { useClient } from "sanity";
import { DashboardWidgetContainer } from "@sanity/dashboard";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell,
} from "recharts";

type MonthData = { month: string; posts: number };

function getLast12Months(): { key: string; label: string }[] {
  const months = [];
  const now = new Date();
  for (let i = 11; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    months.push({
      key: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`,
      label: d.toLocaleDateString("en-US", { month: "short", year: "2-digit" }),
    });
  }
  return months;
}

export function PublishingActivityWidget() {
  const client = useClient({ apiVersion: "2024-01-01" });
  const [data, setData] = useState<MonthData[] | null>(null);

  useEffect(() => {
    const months = getLast12Months();
    const from = `${months[0].key}-01`;

    client
      .fetch<{ publishedAt: string }[]>(`
        *[_type == "blog" && publishedAt >= $from] { publishedAt }
      `, { from })
      .then((posts) => {
        const counts: Record<string, number> = {};
        for (const p of posts) {
          const key = p.publishedAt.slice(0, 7);
          counts[key] = (counts[key] ?? 0) + 1;
        }
        setData(months.map(({ key, label }) => ({ month: label, posts: counts[key] ?? 0 })));
      });
  }, [client]);

  const maxVal = data ? Math.max(...data.map((d) => d.posts), 1) : 1;

  return (
    <DashboardWidgetContainer header="Publishing Activity (Last 12 Months)">
      {!data ? (
        <p style={{ color: "#888", padding: "16px 20px", fontSize: 13 }}>Loading…</p>
      ) : (
        <div style={{ padding: "16px 20px 8px" }}>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={data} barSize={18} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
              <XAxis
                dataKey="month"
                tick={{ fontSize: 11, fill: "#888" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                allowDecimals={false}
                tick={{ fontSize: 11, fill: "#888" }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                cursor={{ fill: "#f9f9f9" }}
                formatter={(value) => [`${Number(value)} post${Number(value) !== 1 ? "s" : ""}`, "Published"]}
                contentStyle={{ borderRadius: 8, border: "1px solid #e5e7eb", fontSize: 12 }}
              />
              <Bar dataKey="posts" radius={[4, 4, 0, 0]}>
                {data.map((entry, i) => (
                  <Cell
                    key={i}
                    fill={entry.posts === maxVal ? "#f05d23" : "#f05d2340"}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <p style={{ margin: "8px 0 0", fontSize: 11, color: "#aaa", textAlign: "center" }}>
            {data.reduce((s, d) => s + d.posts, 0)} posts published in the last 12 months
          </p>
        </div>
      )}
    </DashboardWidgetContainer>
  );
}
