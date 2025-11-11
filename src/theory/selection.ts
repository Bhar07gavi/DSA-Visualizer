const selection = {
  title: "Selection Sort",
  intro:
    "Selection sort divides the array into a sorted and an unsorted region, repeatedly selecting the minimum from the unsorted region and swapping it to the end of the sorted region.",
  pseudocode: `for i from 0 to n-2:
  minIndex = i
  for j from i+1 to n-1:
    if A[j] < A[minIndex]:
      minIndex = j
  if minIndex != i:
    swap A[i], A[minIndex]`,
  best: "O(n²)",
  avg: "O(n²)",
  worst: "O(n²)",
  space: "O(1) auxiliary",
  stable: "No (equal keys may be reordered by swaps)",
  notes: [
    "Performs the minimum number of swaps (≤ n−1).",
    "Good when swap cost is high but comparisons are cheap.",
    "Not stable by default; stable variants exist but add overhead.",
  ],
};

export default selection;
