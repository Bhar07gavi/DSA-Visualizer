import type { LinkedListTheoryEntry } from "./index";

const operations = (): LinkedListTheoryEntry => ({
  title: "Common Operations",
  intro:
    "Typical operations revolve around inserting, deleting, and traversing nodes using references.",
  topics: [
    {
      heading: "Insertion",
      body:
        "• At head: O(1)\n• After a node: O(1) (given node)\n• At tail: O(1) with tail pointer, else O(n)",
    },
    {
      heading: "Deletion",
      body:
        "• From head: O(1)\n• After a node: O(1) (given previous)\n• By value: O(n) to search",
    },
    {
      heading: "Searching / Traversal",
      body:
        "• Linear traversal only: O(n)\n• No direct random access like arrays",
    },
  ],
});

export default operations;
