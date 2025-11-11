// src/theory/stack/index.ts
import intro from "./intro";

export type StackTopic = { heading: string; body: string };
export type StackTheoryEntry = {
  title: string;
  intro?: string;
  topics: StackTopic[];
};

export const stackTheory: Record<"intro", StackTheoryEntry> = { intro };
export default stackTheory;
