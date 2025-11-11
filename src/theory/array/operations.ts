import type { ArrayTheoryEntry } from "./index";

const operations = (): ArrayTheoryEntry => ({
  title: "Array Operations",
  intro:
    "Common operations include insertions, deletions, traversals, and searches. Costs vary depending on where the operation happens.",
  topics: [
    { heading: "Access / Update", body: `• Access: O(1)\n• Update: O(1)` },
    { heading: "Insertion", body: `• End (push): Amortized O(1)\n• Front/middle: O(n) (requires shifting)` },
    { heading: "Deletion", body: `• End (pop): O(1)\n• Front/middle: O(n) (requires shifting)` },
    { heading: "Search", body: `• Linear: O(n)\n• Binary: O(log n) — requires sorted array` },
  ],
});
export default operations;
