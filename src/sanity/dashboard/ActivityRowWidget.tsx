import { PublishingActivityWidget } from "./PublishingActivityWidget";
import { RecentPostsWidget } from "./RecentPostsWidget";

export function ActivityRowWidget() {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, width: "100%" }}>
      <PublishingActivityWidget />
      <RecentPostsWidget />
    </div>
  );
}
