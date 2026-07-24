import { useEffect, useState } from "react";
import { useClient } from "sanity";
import { DashboardWidgetContainer } from "@sanity/dashboard";

type Stats = {
  totalPosts: number;
  totalAuthors: number;
  categories: { title: string; count: number }[];
};

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
        <p style={s.muted}>Loading…</p>
      ) : (
        <div style={{ padding: "16px 20px" }}>
          <div style={s.statRow}>
            <StatBox label="Total Posts" value={stats.totalPosts} color="#f05d23" />
            <StatBox label="Authors" value={stats.totalAuthors} color="#0a7c42" />
          </div>
          <div style={{ marginTop: 20 }}>
            <p style={s.sectionLabel}>Posts by Category</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 8 }}>
              {stats.categories.map((cat) => (
                <div key={cat.title} style={s.catRow}>
                  <span style={s.catName}>{cat.title}</span>
                  <div style={s.barWrap}>
                    <div
                      style={{
                        ...s.bar,
                        width: `${Math.round((cat.count / stats.totalPosts) * 100)}%`,
                      }}
                    />
                  </div>
                  <span style={s.catCount}>{cat.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </DashboardWidgetContainer>
  );
}

function StatBox({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div style={{ ...s.statBox, borderColor: color }}>
      <span style={{ ...s.statValue, color }}>{value}</span>
      <span style={s.statLabel}>{label}</span>
    </div>
  );
}

const s: Record<string, React.CSSProperties> = {
  muted: { color: "#888", padding: "16px 20px", fontSize: 13 },
  statRow: { display: "flex", gap: 12 },
  statBox: {
    flex: 1, display: "flex", flexDirection: "column", alignItems: "center",
    padding: "12px 8px", borderRadius: 10, border: "2px solid",
    background: "#fafafa",
  },
  statValue: { fontSize: 28, fontWeight: 700, lineHeight: 1 },
  statLabel: { fontSize: 11, color: "#888", marginTop: 4, textTransform: "uppercase", letterSpacing: "0.05em" },
  sectionLabel: { fontSize: 11, fontWeight: 700, color: "#888", textTransform: "uppercase", letterSpacing: "0.06em", margin: 0 },
  catRow: { display: "flex", alignItems: "center", gap: 10 },
  catName: { fontSize: 13, color: "#333", width: 140, flexShrink: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" },
  barWrap: { flex: 1, height: 6, background: "#eee", borderRadius: 3, overflow: "hidden" },
  bar: { height: "100%", background: "#f05d23", borderRadius: 3, transition: "width 0.4s ease" },
  catCount: { fontSize: 12, fontWeight: 600, color: "#555", width: 24, textAlign: "right" },
};
