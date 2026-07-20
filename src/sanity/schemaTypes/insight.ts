import { defineField, defineType } from "sanity";
import { AutoSlugInput } from "@/sanity/components/AutoSlugInput";
import { CoverImageInput } from "@/sanity/components/CoverImageInput";

export const insight = defineType({
  name: "insight",
  title: "Insight",
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
      name: "file",
      title: "PDF file",
      description: "The downloadable PDF for this insight.",
      type: "file",
      options: { accept: "application/pdf" },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "coverImage",
      title: "Cover image",
      description:
        "Optional — with the PDF above uploaded, use the \"Generate thumbnail from PDF\" button below to auto-create a cover from page 1. Falls back to a plain document icon on the site if left empty.",
      type: "image",
      options: { hotspot: true },
      components: { input: CoverImageInput },
    }),
    defineField({
      name: "year",
      title: "Year",
      type: "number",
      validation: (rule) => rule.required().integer().min(2000).max(2100),
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
    select: { title: "title", year: "year", media: "coverImage" },
    prepare({ title, year, media }) {
      return { title, subtitle: year ? String(year) : undefined, media };
    },
  },
});
