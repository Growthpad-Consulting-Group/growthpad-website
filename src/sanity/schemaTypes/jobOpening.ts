import { defineField, defineType } from "sanity";

export const jobOpening = defineType({
  name: "jobOpening",
  title: "Job Opening",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "department",
      title: "Department",
      type: "string",
      validation: (rule) => rule.required(),
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
