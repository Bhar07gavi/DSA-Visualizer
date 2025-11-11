const jump = {
  title: "Jump Search",
  intro:
    "Jump Search is an improvement over linear search for sorted arrays. It jumps ahead by fixed block sizes, reducing the number of comparisons. After jumping past the target, it performs a linear search within the previous block.",
  pseudocode: `step = floor(sqrt(n))
prev = 0

while A[min(step, n) - 1] < target:
    prev = step
    step += floor(sqrt(n))
    if prev >= n:
        return -1

// Linear search block
while A[prev] < target:
    prev += 1
    if prev == min(step, n):
        return -1

if A[prev] == target:
    return prev

return -1`,
  best: "O(1) — target found at a jump point",
  avg: "O(√n)",
  worst: "O(√n)",
  space: "O(1) auxiliary",
  stable: "—",
  notes: [
    "Works only on sorted arrays.",
    "Jump size is usually √n, minimizing comparisons.",
    "A good choice when random access is cheap and array is large.",
    "Used when binary search is not allowed but sorted order is known.",
  ],
};

export default jump;
