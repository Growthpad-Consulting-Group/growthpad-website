import { defineField, defineType } from "sanity";
import { AutoSlugInput } from "@/sanity/components/AutoSlugInput";

export const blog = defineType({
  name: "blog",
  title: "Blog",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      description: "Auto-generated from the title as you type.",
      options: { source: "title", maxLength: 96 },
      components: { input: AutoSlugInput },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "coverImage",
      title: "Cover image",
      type: "image",
      options: { hotspot: true },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "reference",
      to: [{ type: "category" }],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "author",
      title: "Author",
      type: "reference",
      to: [{ type: "author" }],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "excerpt",
      title: "Excerpt",
      description: "A short summary of the post shown in the list grid.",
      type: "text",
      rows: 3,
      validation: (rule) => rule.required().max(200),
    }),
    defineField({
      name: "content",
      title: "Content",
      type: "array",
      of: [
        { type: "block" },
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
        {
          name: "youtube",
          type: "object",
          title: "YouTube Video",
          fields: [
            {
              name: "url",
              type: "url",
              title: "YouTube Video URL",
              validation: (rule) => rule.required(),
            },
          ],
        },
      ],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "seoTitle",
      title: "SEO Title",
      description: "Optional — custom Title tag for search engines. Falls back to post title if left empty. Keep under 60 characters.",
      type: "string",
      validation: (rule) => rule.max(60).warning("SEO titles over 60 characters may be truncated in search results."),
    }),
    defineField({
      name: "seoDescription",
      title: "SEO Description",
      description: "Custom Meta Description for search engines. Keep between 120–160 characters.",
      type: "text",
      rows: 2,
      validation: (rule) =>
        rule
          .required()
          .min(120)
          .warning("Meta descriptions under 120 characters may appear too thin in search results.")
          .max(160)
          .warning("Meta descriptions over 160 characters will be truncated by Google."),
    }),
    defineField({
      name: "seoKeywords",
      title: "SEO Keywords",
      description: "Type a keyword and press comma or enter to add it as a tag (e.g. 'digital marketing Kenya'). Used by Bing and other search engines.",
      type: "array",
      of: [{ type: "string" }],
      options: { layout: "tags" },
      validation: (rule) => rule.required().min(1),
    }),
    defineField({
      name: "publishedAt",
      title: "Published at",
      type: "datetime",
      initialValue: () => new Date().toISOString(),
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: { title: "title", category: "category", media: "coverImage" },
    prepare({ title, category, media }) {
      return { title, subtitle: category, media };
    },
  },
});
