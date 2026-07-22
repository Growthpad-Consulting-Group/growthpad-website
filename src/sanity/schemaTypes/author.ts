import { defineField, defineType } from "sanity";
import { AutoSlugInput } from "@/sanity/components/AutoSlugInput";

export const author = defineType({
  name: "author",
  title: "Author",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      description: "Auto-generated from the name as you type.",
      options: { source: "name", maxLength: 96 },
      components: { input: AutoSlugInput },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "image",
      title: "Photo",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "role",
      title: "Role / Title",
      description: "e.g. 'Content Strategist' or 'Growthpad Team'.",
      type: "string",
    }),
    defineField({
      name: "bio",
      title: "Bio",
      type: "text",
      rows: 3,
    }),
  ],
  preview: {
    select: { title: "name", subtitle: "role", media: "image" },
  },
});
