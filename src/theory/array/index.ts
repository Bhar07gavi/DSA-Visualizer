// ✅ final index.ts
import intro from "./intro";
import operations from "./operations";
import complexity from "./complexity";
import type { ReactNode } from "react";

export type ArrayTopic = { heading: string; body: string | ReactNode };

export type ArrayTheoryEntry = {
  title: string;
  intro?: string;
  topics: ArrayTopic[];
  // optional extras (not required by your current files)
  pseudocode?: string;
  best?: string;
  avg?: string;
  worst?: string;
  space?: string;
  stable?: string;
  notes?: string[];
};

// Build the record by calling the factory functions you created.
export const arrayTheory: Record<
  "intro" | "operations" | "complexity",
  ArrayTheoryEntry
> = {
  intro: intro(),
  operations: operations(),
  complexity: complexity(),
};

// (optional) default export if you really want it, but the page will import the named one.
export default arrayTheory;
