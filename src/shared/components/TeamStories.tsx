import VideoStoryGrid from "@/features/home/components/VideoStoryGrid";
import { teamStories } from "@/features/home/data/teamStories";

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
