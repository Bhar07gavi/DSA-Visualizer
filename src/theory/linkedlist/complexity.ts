import type { LinkedListTheoryEntry } from "./index";

const complexity = (): LinkedListTheoryEntry => ({
  title: "Time & Space Complexity",
  pseudocode:
`Access k-th:  O(n)
Search:       O(n)
Insert:       O(1)  (given node)
Delete:       O(1)  (given previous or node in DLL)`,
  topics: [
    { heading: "Average/Worst Time", body: "• Access: O(n)\n• Search: O(n)\n• Insert: O(1)\n• Delete: O(1)" },
    { heading: "Space", body: "• O(n) for nodes + pointer fields" },
  ],
  notes: [
    "Use DLL when deletions with only a node pointer must be O(1).",
    "Prefer arrays when you need frequent random access.",
  ],
});

export default complexity;
