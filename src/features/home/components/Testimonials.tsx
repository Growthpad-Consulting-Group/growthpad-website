import VideoStoryGrid from "@/components/VideoStoryGrid";
import { testimonials } from "@/data/testimonials";

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
