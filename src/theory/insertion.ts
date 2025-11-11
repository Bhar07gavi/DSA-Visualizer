const insertion = {
  title: "Insertion Sort",
  intro:
    "Insertion sort grows a sorted prefix, inserting each new element into its correct position within the prefix (like sorting cards in hand).",
  pseudocode: `for i from 1 to n-1:
  key = A[i]
  j = i - 1
  while j >= 0 and A[j] > key:
    A[j+1] = A[j]
    j = j - 1
  A[j+1] = key`,
  best: "O(n)  — nearly/already sorted",
  avg: "O(n²)",
  worst: "O(n²)",
  space: "O(1) auxiliary",
  stable: "Yes",
  notes: [
    "Excellent on tiny arrays and nearly-sorted data.",
    "Often used as the base case inside faster algorithms (e.g., TimSort, quick/merge cutovers).",
    "Fewer writes than bubble sort; adaptive with respect to existing order.",
  ],
};

export default insertion;
