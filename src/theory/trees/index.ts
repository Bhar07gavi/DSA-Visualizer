// src/theory/tree/index.ts
import intro from "./intro";
import type { ReactNode } from "react";

export type TreeTopic = { heading: string; body: string | ReactNode };
export type TreeTheoryEntry = { title: string; intro?: string; topics: TreeTopic[] };

export const treeTheory: Record<"intro", TreeTheoryEntry> = { intro };
