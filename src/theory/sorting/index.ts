import bubble from "./bubble";
import selection from "./selection";
import insertion from "./insertion";

export type SortingTheoryEntry = {
  title: string;
  intro: string;
  pseudocode: string;
  best: string;
  avg: string;
  worst: string;
  space: string;
  stable: string;
  notes: string[];
};

export const sortingTheory: Record<"bubble" | "selection" | "insertion", SortingTheoryEntry> = {
  bubble,
  selection,
  insertion,
};
