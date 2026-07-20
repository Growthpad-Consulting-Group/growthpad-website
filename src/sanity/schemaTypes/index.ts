import type { SchemaTypeDefinition } from "sanity";
import { insight } from "./insight";
import { jobOpening } from "./jobOpening";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [insight, jobOpening],
};
