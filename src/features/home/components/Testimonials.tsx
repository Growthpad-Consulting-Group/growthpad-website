import VideoStoryGrid from "@/shared/components/VideoStoryGrid";
import { testimonials } from "@/features/home/data/testimonials";

export default function Testimonials() {
  return (
    <VideoStoryGrid
      theme="light"
      heading={
        <>
          What do clients say
          <br />
          about us?
        </>
      }
      videos={testimonials}
      navLabel="testimonials"
    />
  );
}
