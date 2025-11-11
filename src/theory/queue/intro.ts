// src/theory/queue/intro.ts
import type { QueueTheoryEntry } from ".";

const intro: QueueTheoryEntry = {
  title: "Queue — FIFO (First-In, First-Out)",
  intro:
    "A queue is a linear structure where the first element inserted is the first one removed. Like people in a line.",
  topics: [
    { heading: "Core Operations", body: "enqueue(x), dequeue(), front()/peek(), isEmpty()" },
    { heading: "Time Complexity", body: "enqueue: O(1), dequeue: O(1), peek: O(1)" },
    { heading: "Use Cases", body: "Scheduling, BFS, producer–consumer buffers" },
  ],
};

export default intro;
