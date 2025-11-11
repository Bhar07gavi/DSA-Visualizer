import intro from "./intro";
import operations from "./operations";
import complexity from "./complexity";

export type Topic = { heading: string; body: string };
export type LinkedListTheoryEntry = {
  title: string;
  intro?: string;
  topics: Topic[];
  pseudocode?: string;
  best?: string;
  avg?: string;
  worst?: string;
  space?: string;
  stable?: string;
  notes?: string[];
};

// Record of all sections shown in the Theory panel (order matters)
export type LinkedListTheoryMap = Record<
  "intro" | "operations" | "complexity",
  LinkedListTheoryEntry
>;

export const linkedListTheory: LinkedListTheoryMap = {
  intro: intro(),
  operations: operations(),
  complexity: complexity(),
};

export default linkedListTheory;
