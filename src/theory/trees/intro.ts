// src/theory/tree/intro.ts
import type { TreeTheoryEntry } from ".";

const entry: TreeTheoryEntry = {
  title: "Binary Trees — Basics",
  intro: "A tree is a hierarchical structure of nodes (root, children). Binary trees have at most two children per node.",
  topics: [
    { heading: "Terminology", body: "Root, leaf, parent, child, subtree; Height = longest path root→leaf; Balanced vs skewed trees" },
    { heading: "Traversals", body: "Inorder (LNR), Preorder (NLR), Postorder (LRN), Level-order (BFS)" },
    { heading: "BST Property", body: "Left subtree < node < right subtree — enables O(log n) average search if balanced" },
  ],
};

export default entry;
