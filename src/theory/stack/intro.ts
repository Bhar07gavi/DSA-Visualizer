// src/theory/stack/intro.ts
import type { StackTheoryEntry } from ".";

const intro: StackTheoryEntry = {
  title: "Stack — LIFO (Last-In, First-Out)",
  intro:
    "A stack is a linear structure where the last element inserted is the first one removed. Think of a pile of plates.",
  topics: [
    { heading: "Core Operations", body: "push(x), pop(), peek(), isEmpty()" },
    { heading: "Time Complexity", body: "push: O(1), pop: O(1), peek: O(1)" },
    { heading: "Use Cases", body: "Function call stack, undo/redo, DFS" },
  ],
};

export default intro;
