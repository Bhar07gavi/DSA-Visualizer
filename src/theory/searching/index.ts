import linear from "./linear";
import binary from "./binary";
import jump from "./jump";

export type SearchingTheoryEntry = {
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

// Extend the keys to include "jump"
export const searchingTheory: Record<
  "linear" | "binary" | "jump",
  SearchingTheoryEntry
> = {
  linear,
  binary,
  jump,
};
