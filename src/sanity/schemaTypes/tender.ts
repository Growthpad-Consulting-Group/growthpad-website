import { defineField, defineType } from "sanity";
import { AutoSlugInput } from "@/sanity/components/AutoSlugInput";
import { CoverImageInput } from "@/sanity/components/CoverImageInput";

export const tender = defineType({
  name: "tender",
  title: "Tender",
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
      name: "referenceNumber",
      title: "Reference number",
      description: "Optional — the tender's official reference/RFP number.",
      type: "string",
    }),
    defineField({
      name: "file",
      title: "PDF file",
      description: "The downloadable tender document.",
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
      name: "deadline",
      title: "Closing date",
      type: "datetime",
      validation: (rule) => rule.required(),
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
    select: { title: "title", deadline: "deadline", media: "coverImage" },
    prepare({ title, deadline, media }) {
      return {
        title,
        subtitle: deadline ? `Closes ${new Date(deadline).toLocaleDateString()}` : undefined,
        media,
      };
    },
  },
});
