const bubble = {
  title: "Bubble Sort",
  intro:
    "Bubble sort repeatedly swaps adjacent elements if they are in the wrong order. After each full pass, the largest unsorted element 'bubbles' to the end.",
  pseudocode: `for i from 0 to n-2:
  for j from 0 to n-2-i:
    if A[j] > A[j+1]:
      swap A[j], A[j+1]`,
  best: "O(n)  — already sorted (with early-exit optimization)",
  avg: "O(n²)",
  worst: "O(n²)",
  space: "O(1) auxiliary",
  stable: "Yes",
  notes: [
    "Simple to implement but inefficient for large datasets.",
    "If you add an 'early-exit' flag when no swaps occur in a pass, best case becomes O(n).",
    "In-place and stable, useful for teaching and tiny arrays.",
  ],
};

export default bubble;
