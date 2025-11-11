const linear = {
  title: "Linear Search",
  intro:
    "Scan elements one by one until the target is found or the collection ends. Works on any list (sorted or unsorted).",
  pseudocode: `for i from 0 to n-1:
  if A[i] == target:
    return i
return -1`,
  best: "O(1) — target at first position",
  avg: "O(n)",
  worst: "O(n)",
  space: "O(1) auxiliary",
  stable: "—",
  notes: [
    "No preconditions; simplest approach.",
    "Performance degrades linearly with size; use only for small lists or one-off searches.",
  ],
};

export default linear;
