import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { dashboardTool } from "@sanity/dashboard";
import { dataset, projectId } from "@/sanity/env";
import { schema } from "@/sanity/schemaTypes";
import { ContentStatsWidget } from "@/sanity/dashboard/ContentStatsWidget";
import { RecentPostsWidget } from "@/sanity/dashboard/RecentPostsWidget";
import { QuickActionsWidget } from "@/sanity/dashboard/QuickActionsWidget";
import { SeoHealthWidget } from "@/sanity/dashboard/SeoHealthWidget";

export default defineConfig({
  basePath: "/studio",
  projectId,
  dataset,
  schema,
  plugins: [
    dashboardTool({
      widgets: [
        { name: "quick-actions", component: QuickActionsWidget, layout: { width: "small" } },
        { name: "content-stats", component: ContentStatsWidget, layout: { width: "medium" } },
        { name: "seo-health", component: SeoHealthWidget, layout: { width: "medium" } },
        { name: "recent-posts", component: RecentPostsWidget, layout: { width: "large" } },
      ],
    }),
    structureTool(),
  ],
});
