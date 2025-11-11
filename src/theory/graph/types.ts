import type { ReactNode } from "react";

export type GraphTopic = {
  heading: string;
  body: string | ReactNode;
};

export type GraphTheoryEntry = {
  title: string;
  intro?: string;
  topics: GraphTopic[];
};
