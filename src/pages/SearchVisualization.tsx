// src/pages/SearchVisualization.tsx
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Search, RotateCcw, Shuffle } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import TheoryPanel from "@/components/TheoryPanel";
import { searchingTheory } from "@/theory/searching";

type SearchAlgorithm = "linear" | "binary" | "jump";

interface ArrayElement {
  value: number;
  id: string;
  isChecking?: boolean;
  isFound?: boolean;
  isInRange?: boolean;
}

/** ---- Theory mapping helpers ---- */
type SearchingTheoryEntry = {
  title: string;
  intro: string;
  pseudocode: string;
  best: string;
  avg: string;
  worst: string;
  space: string;
  stable?: string;
  notes: string[];
};

function isSearchingTheoryEntry(x: unknown): x is SearchingTheoryEntry {
  if (!x || typeof x !== "object") return false;
  const o = x as Record<string, unknown>;
  return (
    typeof o.title === "string" &&
    typeof o.intro === "string" &&
    typeof o.pseudocode === "string"
  );
}

function buildSearchingSections(t: SearchingTheoryEntry) {
  return [
    { heading: "Introduction", body: <p>{t.intro}</p> },
    {
      heading: "Pseudocode",
      body: (
        <pre className="bg-muted/40 rounded p-3 overflow-auto">
          <code>{t.pseudocode}</code>
        </pre>
      ),
    },
    {
      heading: "Complexity",
      body: (
        <ul className="list-disc pl-5 space-y-1">
          <li><strong>Best:</strong> {t.best}</li>
          <li><strong>Average:</strong> {t.avg}</li>
          <li><strong>Worst:</strong> {t.worst}</li>
          <li><strong>Space:</strong> {t.space}</li>
        </ul>
      ),
    },
    t.notes && t.notes.length
      ? {
          heading: "Notes",
          body: (
            <ul className="list-disc pl-5 space-y-1">
              {t.notes.map((n, i) => (
                <li key={i}>{n}</li>
              ))}
            </ul>
          ),
        }
      : null,
  ].filter(Boolean) as { heading: string; body: string | JSX.Element }[];
}
/** -------------------------------- */

const SearchVisualization = () => {
  const [array, setArray] = useState<ArrayElement[]>([]);
  const [isSorted, setIsSorted] = useState(true);
  const [searchValue, setSearchValue] = useState("");
  const [algorithm, setAlgorithm] = useState<SearchAlgorithm>("linear");
  const [isSearching, setIsSearching] = useState(false);
  const [comparisons, setComparisons] = useState(0);
  const [foundIndex, setFoundIndex] = useState(-1);
  const [speed, setSpeed] = useState(800);

  const algorithms = [
    { value: "linear", label: "Linear Search", complexity: "O(n)", requiresSorted: false },
    { value: "binary", label: "Binary Search", complexity: "O(log n)", requiresSorted: true },
    { value: "jump", label: "Jump Search", complexity: "O(√n)", requiresSorted: true },
  ] as const;

  const selectedAlgo = useMemo(
    () => algorithms.find((a) => a.value === algorithm),
    [algorithm]
  );

  // Utilities
  const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
  const updateArray = (newArray: ArrayElement[]) => setArray([...newArray]);

  const checkSorted = (arr: ArrayElement[]) => {
    for (let i = 1; i < arr.length; i++) if (arr[i - 1].value > arr[i].value) return false;
    return true;
  };

  const markCleared = (arr: ArrayElement[]) =>
    arr.map((item) => ({ ...item, isChecking: false, isFound: false, isInRange: false }));

  const resetSearch = () => {
    setComparisons(0);
    setFoundIndex(-1);
    setArray((prev) => markCleared(prev));
  };

  const generateSortedArray = (size = 15) => {
    const vals = Array.from({ length: size }, (_, i) => (i + 1) * 7 + Math.floor(Math.random() * 5));
    const newArray: ArrayElement[] = vals
      .sort((a, b) => a - b)
      .map((value) => ({ value, id: Math.random().toString(36).slice(2) }));
    setArray(newArray);
    setIsSorted(true);
    resetSearch();
  };

  const generateRandomArray = (size = 15) => {
    const values = new Set<number>();
    while (values.size < size) values.add(Math.floor(Math.random() * 100) + 1);
    const newArray: ArrayElement[] = Array.from(values).map((value) => ({
      value,
      id: Math.random().toString(36).slice(2),
    }));
    setArray(newArray);
    setIsSorted(checkSorted(newArray));
    resetSearch();
  };

  useEffect(() => {
    generateSortedArray();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // --- Searching algorithms ---
  const linearSearch = async (target: number) => {
    const arr = [...array];
    let compCount = 0;

    for (let i = 0; i < arr.length; i++) {
      arr[i].isChecking = true;
      updateArray(arr);
      compCount++;
      setComparisons(compCount);
      await sleep(speed);

      if (arr[i].value === target) {
        arr[i].isFound = true;
        arr[i].isChecking = false;
        setFoundIndex(i);
        updateArray(arr);
        toast({ description: `Found ${target} at index ${i}! (${compCount} comparisons)` });
        return;
      }

      arr[i].isChecking = false;
      updateArray(arr);
    }

    toast({ description: `${target} not found in array (${compCount} comparisons)`, variant: "destructive" });
  };

  const binarySearch = async (target: number) => {
    const arr = [...array];
    let left = 0;
    let right = arr.length - 1;
    let compCount = 0;

    while (left <= right && arr.length > 0) {
      // highlight range
      for (let i = 0; i < arr.length; i++) arr[i].isInRange = i >= left && i <= right;
      updateArray(arr);
      await sleep(speed / 2);

      const mid = Math.floor((left + right) / 2);
      arr[mid].isChecking = true;
      updateArray(arr);
      compCount++;
      setComparisons(compCount);
      await sleep(speed);

      if (arr[mid].value === target) {
        arr[mid].isFound = true;
        arr[mid].isChecking = false;
        setFoundIndex(mid);
        updateArray(arr);
        toast({ description: `Found ${target} at index ${mid}! (${compCount} comparisons)` });
        return;
      }

      arr[mid].isChecking = false;
      if (arr[mid].value < target) left = mid + 1;
      else right = mid - 1;

      updateArray(arr);
      await sleep(speed / 2);
    }

    arr.forEach((a) => (a.isInRange = false));
    updateArray(arr);
    toast({ description: `${target} not found in array (${compCount} comparisons)`, variant: "destructive" });
  };

  const jumpSearch = async (target: number) => {
    const arr = [...array];
    const n = arr.length;
    if (n === 0) {
      toast({ description: "Array is empty.", variant: "destructive" });
      return;
    }

    let step = Math.floor(Math.sqrt(n));
    let prev = 0;
    let compCount = 0;

    while (arr[Math.min(step, n) - 1].value < target) {
      const pos = Math.min(step, n) - 1;
      arr[pos].isChecking = true;
      updateArray(arr);
      compCount++;
      setComparisons(compCount);
      await sleep(speed);
      arr[pos].isChecking = false;

      prev = step;
      step += Math.floor(Math.sqrt(n));
      if (prev >= n) {
        updateArray(arr);
        toast({ description: `${target} not found in array (${compCount} comparisons)`, variant: "destructive" });
        return;
      }
      updateArray(arr);
      await sleep(speed / 2);
    }

    for (let i = prev; i < Math.min(step, n); i++) {
      arr[i].isChecking = true;
      updateArray(arr);
      compCount++;
      setComparisons(compCount);
      await sleep(speed);

      if (arr[i].value === target) {
        arr[i].isFound = true;
        arr[i].isChecking = false;
        setFoundIndex(i);
        updateArray(arr);
        toast({ description: `Found ${target} at index ${i}! (${compCount} comparisons)` });
        return;
      }
      arr[i].isChecking = false;
      updateArray(arr);
    }

    toast({ description: `${target} not found in array (${compCount} comparisons)`, variant: "destructive" });
  };

  // Ensure sorted array when needed
  const ensureSortedIfNeeded = () => {
    if (selectedAlgo?.requiresSorted && !isSorted) {
      const sorted = [...array].sort((a, b) => a.value - b.value).map((x) => ({ ...x }));
      setArray(sorted);
      setIsSorted(true);
      toast({ description: "Array auto-sorted for this algorithm." });
    }
  };

  const startSearch = async () => {
    const target = parseInt(searchValue, 10);
    if (isNaN(target)) {
      toast({ description: "Please enter a valid number", variant: "destructive" });
      return;
    }

    setIsSearching(true);
    resetSearch();
    ensureSortedIfNeeded();

    try {
      switch (algorithm) {
        case "linear":
          await linearSearch(target);
          break;
        case "binary":
          await binarySearch(target);
          break;
        case "jump":
          await jumpSearch(target);
          break;
      }
    } catch (e) {
      console.error("Search error:", e);
    }

    setIsSearching(false);
  };

  const getElementStyle = (element: ArrayElement) => {
    let className =
      "w-16 h-16 rounded-lg border-2 transition-all duration-300 flex items-center justify-center font-bold text-sm";
    if (element.isFound) className += " bg-green-500 border-green-400 text-white shadow-lg scale-110";
    else if (element.isChecking) className += " bg-primary border-primary-glow text-primary-foreground shadow-neon scale-105";
    else if (element.isInRange) className += " bg-accent/30 border-accent text-foreground";
    else className += " bg-card border-border/40 text-foreground hover:border-primary/40";
    return className;
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button asChild variant="ghost">
            <Link to="/">
              <ArrowLeft className="w-4 h-4" />
              Back to Topics
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Search Algorithms</h1>
            <p className="text-muted-foreground">Visualize different search techniques and their efficiency</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Visualization Panel */}
          <div className="lg:col-span-3">
            <Card className="bg-gradient-card border-border/40">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>{selectedAlgo?.label ?? "Search"} Visualization</CardTitle>
                  <div className="flex gap-2">
                    <Badge variant="outline" className="border-primary/20">
                      {selectedAlgo?.complexity ?? "—"}
                    </Badge>
                    {selectedAlgo?.requiresSorted && <Badge variant="secondary">Requires Sorted Array</Badge>}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="bg-code rounded-lg p-6 min-h-[300px]">
                  <div className="flex flex-wrap gap-3 justify-center">
                    {array.map((element, index) => (
                      <div key={element.id} className="flex flex-col items-center gap-2">
                        <div className={getElementStyle(element)}>{element.value}</div>
                        <div className="text-xs text-muted-foreground font-mono">[{index}]</div>
                      </div>
                    ))}
                  </div>

                  {foundIndex !== -1 && (
                    <div className="text-center mt-6">
                      <Badge variant="outline" className="border-green-500/30 text-green-400">
                        Found at index: {foundIndex}
                      </Badge>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* ---- THEORY PANEL ---- */}
            {(() => {
              const raw = searchingTheory[algorithm];
              if (!isSearchingTheoryEntry(raw)) return null;
              const sections = buildSearchingSections(raw);
              return <TheoryPanel title={raw.title} sections={sections} />;
            })()}
          </div>

          {/* Control Panel */}
          <div className="space-y-6">
            <Card className="bg-gradient-card border-border/40">
              <CardHeader>
                <CardTitle className="text-lg">Search Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Algorithm</label>
                  <Select
                    value={algorithm}
                    onValueChange={(value) => setAlgorithm(value as SearchAlgorithm)}
                    disabled={isSearching}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select algorithm" />
                    </SelectTrigger>
                    <SelectContent>
                      {algorithms.map((algo) => (
                        <SelectItem key={algo.value} value={algo.value}>
                          <div className="flex flex-col">
                            <span>{algo.label}</span>
                            <span className="text-xs text-muted-foreground">{algo.complexity}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Search Value</label>
                  <div className="flex gap-2">
                    <Input
                      type="number"
                      placeholder="Enter value"
                      value={searchValue}
                      onChange={(e) => setSearchValue(e.target.value)}
                      disabled={isSearching}
                    />
                    <Button variant="accent" onClick={startSearch} disabled={isSearching || !searchValue}>
                      <Search className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Speed: {1100 - speed}ms</label>
                  <input
                    type="range"
                    min="200"
                    max="1000"
                    value={1100 - speed}
                    onChange={(e) => setSpeed(1100 - parseInt(e.target.value, 10))}
                    className="w-full"
                    disabled={isSearching}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Array Controls */}
            <Card className="bg-gradient-card border-border/40">
              <CardHeader>
                <CardTitle className="text-lg">Array Controls</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button variant="neon" onClick={() => generateSortedArray()} disabled={isSearching} className="w-full">
                  <RotateCcw className="w-4 h-4" />
                  Generate Sorted Array
                </Button>

                <Button variant="control" onClick={() => generateRandomArray()} disabled={isSearching} className="w-full">
                  <Shuffle className="w-4 h-4" />
                  Generate Random Array
                </Button>

                <Button variant="control" onClick={resetSearch} disabled={isSearching} className="w-full">
                  Clear Results
                </Button>

                <div className="text-xs text-muted-foreground text-center">
                  Current array: {isSorted ? "Sorted" : "Unsorted"}
                </div>
              </CardContent>
            </Card>

            {/* Statistics */}
            <Card className="bg-gradient-card border-border/40">
              <CardHeader>
                <CardTitle className="text-lg">Statistics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Array size:</span>
                  <span>{array.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Comparisons:</span>
                  <span>{comparisons}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Time complexity:</span>
                  <span>{selectedAlgo?.complexity ?? "—"}</span>
                </div>
                {foundIndex !== -1 && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Found at:</span>
                    <span>Index {foundIndex}</span>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Legend */}
            <Card className="bg-gradient-card border-border/40">
              <CardHeader>
                <CardTitle className="text-lg">Legend</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-card rounded border-2 border-border/40"></div>
                  <span className="text-sm">Unchecked</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-accent/30 rounded border-2 border-accent"></div>
                  <span className="text-sm">In Range</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-primary rounded border-2 border-primary-glow"></div>
                  <span className="text-sm">Currently Checking</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-green-500 rounded border-2 border-green-400"></div>
                  <span className="text-sm">Found</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchVisualization;
