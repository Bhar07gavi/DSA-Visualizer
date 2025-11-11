// src/theory/queue/index.ts
import intro from "./intro";

export type QueueTopic = { heading: string; body: string };
export type QueueTheoryEntry = {
  title: string;
  intro?: string;
  topics: QueueTopic[];
};

export const queueTheory: Record<"intro", QueueTheoryEntry> = { intro };
export default queueTheory;
