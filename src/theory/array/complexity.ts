import type { ArrayTheoryEntry } from "./index";

const complexity = (): ArrayTheoryEntry => ({
  title: "Array Time & Space Complexity",
  intro:
    "Because arrays use contiguous memory, different operations have different performance trade-offs.",
  topics: [
    {
      heading: "Time Complexity",
      body:
        `• Access: O(1)
• Search:
   - Linear: O(n)
   - Binary: O(log n)
• Insertion:
   - End: O(1)
   - Front: O(n)
• Deletion:
   - Front: O(n)
   - End: O(1)`,
    },
    {
      heading: "Space Complexity",
      body:
        `• Space used = O(n)
• Contiguous memory must be allocated at once
• Dynamic growth needs a resizable array (e.g., ArrayList)`,
    },
    {
      heading: "When to Use Arrays?",
      body:
        `Use arrays when:
• You need fast random access
• Size is known in advance
• Compact, cache-friendly layout

Avoid arrays when:
• Size varies frequently
• Inserts/deletes occur often`,
    },
  ],
});
export default complexity;
