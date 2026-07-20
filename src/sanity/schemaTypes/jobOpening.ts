import { defineField, defineType } from "sanity";
import { AutoSlugInput } from "@/sanity/components/AutoSlugInput";
import { JobDocumentExtractor } from "../components/JobDocumentExtractor";

export const jobOpening = defineType({
  name: "jobOpening",
  title: "Job Opening",
  type: "document",
  fields: [
    defineField({
      name: "sourceDocument",
      title: "Job description document",
      description:
        "Upload the job description (PDF or Word doc) to auto-fill the fields below from it.",
      type: "file",
      options: {
        accept:
          ".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      },
      components: { input: JobDocumentExtractor },
    }),
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
      description: "Auto-generated from the title as you type. Used for the job's detail page URL.",
      options: { source: "title", maxLength: 96 },
      components: { input: AutoSlugInput },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "department",
      title: "Department",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "reportsTo",
      title: "Reports to",
      type: "string",
      description: "e.g. \"CEO, Commercial Director or designated Growth Lead\"",
    }),
    defineField({
      name: "experience",
      title: "Experience",
      type: "text",
      rows: 2,
      description: "e.g. \"Minimum three years of relevant B2B sales experience\"",
    }),
    defineField({
      name: "employmentType",
      title: "Employment type",
      type: "string",
      options: {
        list: ["Full-time", "Part-time", "Contract", "Internship"],
      },
      initialValue: "Full-time",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "workMode",
      title: "Work mode",
      type: "string",
      options: { list: ["On-site", "Hybrid", "Remote"] },
      initialValue: "Hybrid",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "city",
      title: "Location",
      type: "string",
      description: "e.g. \"Nairobi, Kenya\"",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "deadline",
      title: "Application deadline",
      type: "date",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "applyUrl",
      title: "Apply link",
      description: "Where the \"Apply now\" button should send candidates — a form URL or a mailto: link.",
      type: "url",
      validation: (rule) =>
        rule.uri({ allowRelative: false, scheme: ["http", "https", "mailto"] }),
    }),
    defineField({
      name: "description",
      title: "Full job description",
      description:
        "The full JD body — role purpose, responsibilities, qualifications, competencies, KPIs, application requirements, etc. Shown on the role's detail page.",
      type: "array",
      of: [{ type: "block" }],
    }),
    defineField({
      name: "isOpen",
      title: "Currently open?",
      description: "Turn off to hide this role from the site without deleting it.",
      type: "boolean",
      initialValue: true,
    }),
  ],
  preview: {
    select: { title: "title", department: "department", isOpen: "isOpen" },
    prepare({ title, department, isOpen }) {
      return {
        title,
        subtitle: `${department}${isOpen === false ? " — closed" : ""}`,
      };
    },
  },
});
