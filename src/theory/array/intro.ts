import type { ArrayTheoryEntry } from "./index";

const intro = (): ArrayTheoryEntry => ({
  title: "Introduction to Arrays",
  intro:
    "An array is a contiguous block of memory storing elements of the same type. It offers O(1) random access by index and compact, cache-friendly layout.",
  topics: [
    {
      heading: "Properties",
      body:
        `• Fixed-size (static arrays) or dynamic (Resizable arrays used by languages/libraries)
• Contiguous memory → excellent cache locality
• Zero-based index in most languages`,
    },
    {
      heading: "Indexing",
      body: "Accessing arr[i] computes address base + i * elementSize → O(1) time.",
    },
  ],
});
export default intro;
