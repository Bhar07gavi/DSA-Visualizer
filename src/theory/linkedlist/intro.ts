import type { LinkedListTheoryEntry } from "./index";

const intro = (): LinkedListTheoryEntry => ({
  title: "Introduction to Linked Lists",
  intro:
    "A linked list is a linear data structure where each node stores a value and a reference to the next node. Unlike arrays, memory is not contiguous, so inserts/deletes near known nodes are O(1) but random access is O(n).",
  topics: [
    {
      heading: "Types",
      body:
        "• Singly (next)\n• Doubly (prev & next)\n• Circular variants where tail points to head",
    },
    {
      heading: "Strengths",
      body:
        "• O(1) insert/delete at head or after a known node\n• No need for contiguous memory; size can grow flexibly",
    },
    {
      heading: "Weaknesses",
      body:
        "• O(n) random access (must traverse)\n• Extra memory for pointers\n• Cache-unfriendly compared to arrays",
    },
  ],
});

export default intro;
