import VideoStoryGrid from "@/components/VideoStoryGrid";
import { teamStories } from "@/data/teamStories";

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
