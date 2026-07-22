import type { SchemaTypeDefinition } from "sanity";
import { blog } from "./blog";
import { insight } from "./insight";
import { jobOpening } from "./jobOpening";
import { tender } from "./tender";
import { caseStudy } from "./caseStudy";
import { author } from "./author";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [blog, insight, jobOpening, tender, caseStudy, author],
};
