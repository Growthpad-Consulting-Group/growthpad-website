import type { SchemaTypeDefinition } from "sanity";
import { blog } from "./blog";
import { category } from "./category";
import { insight } from "./insight";
import { jobOpening } from "./jobOpening";
import { tender } from "./tender";
import { caseStudy } from "./caseStudy";
import { author } from "./author";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [blog, category, insight, jobOpening, tender, caseStudy, author],
};
