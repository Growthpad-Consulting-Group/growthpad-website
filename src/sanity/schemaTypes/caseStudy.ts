import { defineField, defineType } from "sanity";
import { AutoSlugInput } from "@/sanity/components/AutoSlugInput";

export const caseStudy = defineType({
  name: "caseStudy",
  title: "Case Study",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Brand",
      type: "string",
      description: "The name of the client/brand (e.g. Sidian Bank, Uber).",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      description: "Auto-generated from the brand as you type.",
      options: { source: "title", maxLength: 96 },
      components: { input: AutoSlugInput },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "string",
      description: "Short summary shown on listing grids and metadata fallback.",
    }),
    defineField({
      name: "image",
      title: "Cover Image",
      type: "image",
      description: "Optional — Card display image shown on the listing page. Falls back to Hero Image or Hero Video if left empty.",
      options: { hotspot: true },
    }),
    defineField({
      name: "coverVideo",
      title: "Cover Video",
      type: "file",
      description: "Optional — upload a video file for the cover card / listing. Overrides Cover Image if provided.",
      options: { accept: "video/*" },
    }),
    defineField({
      name: "heroTitle",
      title: "Hero Title",
      type: "string",
      description: "Optional — Headline displayed on the full-bleed hero page. Falls back to description if left empty.",
    }),
    defineField({
      name: "heroImage",
      title: "Hero Image",
      type: "image",
      description: "Optional — Full-bleed showcase photo at the top of the detail page. Falls back to Cover Image if left empty.",
      options: { hotspot: true },
    }),
    defineField({
      name: "heroVideo",
      title: "Hero Video",
      type: "file",
      description: "Optional — upload a video file for the detail page hero header. Overrides Hero Image if provided.",
      options: { accept: "video/*" },
    }),
    defineField({
      name: "problemText",
      title: "Puzzle Text (Problem)",
      type: "text",
      description: "The problem question / challenge statement (e.g., 'How can we help Uber grow app downloads...').",
      rows: 4,
    }),
    defineField({
      name: "solutionText",
      title: "Piecing the Puzzle (Solution)",
      type: "text",
      description: "How Growthpad solved the problem (e.g., 'We executed strategic media planning, creative design...').",
      rows: 4,
    }),
    defineField({
      name: "outcomeText",
      title: "Outcome Text",
      type: "text",
      description: "The final result summary text.",
      rows: 4,
    }),
    defineField({
      name: "outcomeImages",
      title: "Outcome Images",
      description: "Optional showcase images for the outcome (2 or more proof photos).",
      type: "array",
      of: [
        {
          type: "image",
          options: { hotspot: true },
          fields: [
            {
              name: "alt",
              type: "string",
              title: "Alternative Text",
            },
          ],
        },
      ],
    }),
    defineField({
      name: "videoTitle",
      title: "Video Title",
      type: "string",
      description: "Optional — Title shown above or inside the video modal.",
    }),
    defineField({
      name: "videoThumbnail",
      title: "Video Thumbnail",
      type: "image",
      description: "Optional — Thumbnail image for the play video card background.",
      options: { hotspot: true },
    }),
    defineField({
      name: "youtubeUrl",
      title: "YouTube Video URL",
      type: "url",
      description: "Optional — YouTube video link (e.g., https://www.youtube.com/watch?v=...).",
    }),
  ],
  preview: {
    select: { title: "title", subtitle: "description", media: "image", fallbackMedia: "heroImage" },
    prepare({ title, subtitle, media, fallbackMedia }) {
      return { title, subtitle, media: media || fallbackMedia };
    },
  },
});
