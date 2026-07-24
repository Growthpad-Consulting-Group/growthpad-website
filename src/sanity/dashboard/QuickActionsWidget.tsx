import { useRouter } from "sanity/router";
import { DashboardWidgetContainer } from "@sanity/dashboard";

const ACTIONS = [
  { label: "New Blog Post", icon: "✍️", href: "/studio/structure/blog;new" },
  { label: "New Category", icon: "🗂️", href: "/studio/structure/category;new" },
  { label: "New Author", icon: "👤", href: "/studio/structure/author;new" },
  { label: "View All Posts", icon: "📋", href: "/studio/structure/blog" },
  { label: "Visit Blog", icon: "🌐", href: "/blog", external: true },
];

export function QuickActionsWidget() {
  return (
    <DashboardWidgetContainer header="Quick Actions">
      <div style={{ padding: "12px 16px", display: "flex", flexDirection: "column", gap: 8 }}>
        {ACTIONS.map((action) =>
          action.external ? (
            <a
              key={action.label}
              href={action.href}
              target="_blank"
              rel="noreferrer"
              style={s.btn}
              onMouseEnter={(e) => Object.assign(e.currentTarget.style, s.btnHover)}
              onMouseLeave={(e) => Object.assign(e.currentTarget.style, s.btn)}
            >
              <span>{action.icon}</span>
              <span>{action.label}</span>
              <span style={s.arrow}>↗</span>
            </a>
          ) : (
            <a
              key={action.label}
              href={action.href}
              style={s.btn}
              onMouseEnter={(e) => Object.assign(e.currentTarget.style, s.btnHover)}
              onMouseLeave={(e) => Object.assign(e.currentTarget.style, s.btn)}
            >
              <span>{action.icon}</span>
              <span>{action.label}</span>
              <span style={s.arrow}>→</span>
            </a>
          ),
        )}
      </div>
    </DashboardWidgetContainer>
  );
}

const s: Record<string, React.CSSProperties> = {
  btn: {
    display: "flex", alignItems: "center", gap: 10,
    padding: "10px 14px", borderRadius: 8,
    border: "1px solid #e5e7eb", background: "#fff",
    textDecoration: "none", color: "#111", fontSize: 13, fontWeight: 500,
    cursor: "pointer", transition: "all 0.15s",
  },
  btnHover: {
    display: "flex", alignItems: "center", gap: 10,
    padding: "10px 14px", borderRadius: 8,
    border: "1px solid #f05d23", background: "#fdf4f0",
    textDecoration: "none", color: "#f05d23", fontSize: 13, fontWeight: 500,
    cursor: "pointer", transition: "all 0.15s",
  },
  arrow: { marginLeft: "auto", opacity: 0.5 },
};
