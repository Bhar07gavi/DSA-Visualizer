const binary = {
  title: "Binary Search",
  intro:
    "On a sorted array, repeatedly halve the search space by comparing the middle element with the target.",
  pseudocode: `lo = 0, hi = n - 1
while lo <= hi:
  mid = (lo + hi) // 2
  if A[mid] == target:
    return mid
  else if A[mid] < target:
    lo = mid + 1
  else:
    hi = mid - 1
return -1`,
  best: "O(1) — target at mid on first check",
  avg: "O(log n)",
  worst: "O(log n)",
  space: "O(1) iterative (O(log n) recursive)",
  stable: "—",
  notes: [
    "Requires a **sorted** array.",
    "For duplicates, use boundary variants (lower_bound / upper_bound) to find first/last occurrence.",
    "Be careful with mid index overflow in other languages (use lo + (hi - lo) / 2).",
  ],
};

export default binary;
