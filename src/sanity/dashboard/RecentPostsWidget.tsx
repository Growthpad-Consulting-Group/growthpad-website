import { useEffect, useState } from "react";
import { useClient } from "sanity";
import { DashboardWidgetContainer } from "@sanity/dashboard";

type RecentPost = {
  _id: string;
  title: string;
  category: string;
  categorySlug: string;
  slug: string;
  publishedAt: string;
  author: string;
};

export function RecentPostsWidget() {
  const client = useClient({ apiVersion: "2024-01-01" });
  const [posts, setPosts] = useState<RecentPost[] | null>(null);

  useEffect(() => {
    client
      .fetch<RecentPost[]>(`
        *[_type == "blog"] | order(publishedAt desc) [0...8] {
          _id, title,
          "category": category->title,
          "categorySlug": category->slug.current,
          "slug": slug.current,
          publishedAt,
          "author": author->name
        }
      `)
      .then(setPosts);
  }, [client]);

  return (
    <DashboardWidgetContainer header="Recently Published">
      {!posts ? (
        <p style={s.muted}>Loading…</p>
      ) : (
        <div style={{ padding: "8px 0" }}>
          {posts.map((post) => (
            <a
              key={post._id}
              href={`/studio/structure/blog;${post._id}`}
              style={s.row}
              onMouseEnter={(e) => (e.currentTarget.style.background = "#fdf4f0")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
            >
              <div style={s.dot} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={s.title}>{post.title}</p>
                <p style={s.meta}>
                  <span style={s.cat}>{post.category}</span>
                  {" · "}
                  {post.author}
                  {" · "}
                  {new Date(post.publishedAt).toLocaleDateString("en-GB", {
                    day: "numeric", month: "short", year: "numeric",
                  })}
                </p>
              </div>
            </a>
          ))}
        </div>
      )}
    </DashboardWidgetContainer>
  );
}

const s: Record<string, React.CSSProperties> = {
  muted: { color: "#888", padding: "16px 20px", fontSize: 13 },
  row: {
    display: "flex", alignItems: "flex-start", gap: 12,
    padding: "10px 20px", textDecoration: "none",
    transition: "background 0.15s", cursor: "pointer",
  },
  dot: {
    width: 8, height: 8, borderRadius: "50%", background: "#f05d23",
    flexShrink: 0, marginTop: 5,
  },
  title: { margin: 0, fontSize: 13, fontWeight: 600, color: "#111", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" },
  meta: { margin: "2px 0 0", fontSize: 11, color: "#888" },
  cat: { color: "#f05d23", fontWeight: 600 },
};
