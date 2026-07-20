import VideoStoryGrid from "@/shared/components/VideoStoryGrid";
import { teamStories } from "@/shared/data/teamStories";

export default function TeamStories() {
  return (
    <VideoStoryGrid
      theme="light"
      heading={
        <>
          Stories from the
          <br />
          Growthpad team
        </>
      }
      videos={teamStories}
      navLabel="stories"
    />
  );
}
