import { useEffect, useState } from "react";
import { useClient } from "sanity";
import { DashboardWidgetContainer } from "@sanity/dashboard";

type SeoIssue = {
  _id: string;
  title: string;
  slug: string;
  missingKeyword: boolean;
  missingTitle: boolean;
  missingDesc: boolean;
};

export function SeoHealthWidget() {
  const client = useClient({ apiVersion: "2024-01-01" });
  const [issues, setIssues] = useState<SeoIssue[] | null>(null);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    Promise.all([
      client.fetch<number>(`count(*[_type == "blog"])`),
      client.fetch<SeoIssue[]>(`
        *[_type == "blog" && (
          !defined(focusKeyword) || focusKeyword == "" ||
          !defined(seoTitle) || seoTitle == "" ||
          !defined(seoDescription) || seoDescription == ""
        )] | order(publishedAt desc) {
          _id,
          title,
          "slug": slug.current,
          "missingKeyword": !defined(focusKeyword) || focusKeyword == "",
          "missingTitle": !defined(seoTitle) || seoTitle == "",
          "missingDesc": !defined(seoDescription) || seoDescription == ""
        }
      `),
    ]).then(([count, data]) => {
      setTotal(count);
      setIssues(data);
    });
  }, [client]);

  const healthy = issues !== null ? total - issues.length : null;
  const score = healthy !== null ? Math.round((healthy / total) * 100) : null;
  const scoreColor = score === null ? "#888" : score >= 80 ? "#0a7c42" : score >= 50 ? "#b45309" : "#b91c1c";

  return (
    <DashboardWidgetContainer header="SEO Health">
      {issues === null ? (
        <p style={s.muted}>Loading…</p>
      ) : (
        <div style={{ padding: "16px 20px" }}>
          {/* Score bar */}
          <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 16 }}>
            <div style={{ ...s.scoreCircle, borderColor: scoreColor, color: scoreColor }}>
              {score}%
            </div>
            <div>
              <p style={{ margin: 0, fontWeight: 700, fontSize: 14 }}>
                {healthy} / {total} posts fully optimised
              </p>
              <p style={{ margin: "2px 0 0", fontSize: 12, color: "#888" }}>
                {issues.length} post{issues.length !== 1 ? "s" : ""} need attention
              </p>
            </div>
          </div>

          {issues.length === 0 ? (
            <p style={{ ...s.muted, padding: 0, color: "#0a7c42", fontWeight: 600 }}>
              ✅ All posts are fully optimised!
            </p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 6, maxHeight: 260, overflowY: "auto" }}>
              {issues.map((post) => (
                <a
                  key={post._id}
                  href={`/studio/structure/blog;${post._id}`}
                  style={s.issueRow}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "#fdf4f0")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "#fafafa")}
                >
                  <p style={s.issueTitle}>{post.title}</p>
                  <div style={s.tags}>
                    {post.missingKeyword && <Tag label="No keyword" />}
                    {post.missingTitle && <Tag label="No SEO title" />}
                    {post.missingDesc && <Tag label="No description" />}
                  </div>
                </a>
              ))}
            </div>
          )}
        </div>
      )}
    </DashboardWidgetContainer>
  );
}

function Tag({ label }: { label: string }) {
  return (
    <span style={{
      fontSize: 10, fontWeight: 600, padding: "2px 6px", borderRadius: 4,
      background: "#fee2e2", color: "#b91c1c", whiteSpace: "nowrap",
    }}>
      {label}
    </span>
  );
}

const s: Record<string, React.CSSProperties> = {
  muted: { color: "#888", fontSize: 13, margin: 0 },
  scoreCircle: {
    width: 56, height: 56, borderRadius: "50%", border: "3px solid",
    display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: 14, fontWeight: 700, flexShrink: 0,
  },
  issueRow: {
    display: "flex", flexDirection: "column", gap: 4,
    padding: "8px 10px", borderRadius: 8, background: "#fafafa",
    textDecoration: "none", transition: "background 0.15s", cursor: "pointer",
  },
  issueTitle: { margin: 0, fontSize: 12, fontWeight: 600, color: "#111", lineHeight: 1.4 },
  tags: { display: "flex", gap: 4, flexWrap: "wrap" },
};
