import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Play, Pause, RotateCcw, Shuffle } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "@/hooks/use-toast";

type SortingAlgorithm = "bubble" | "selection" | "insertion" | "merge" | "quick";

interface ArrayElement {
  value: number;
  id: string;
  isComparing?: boolean;
  isSwapping?: boolean;
  isSorted?: boolean;
  isPivot?: boolean;
}

const SortingVisualization = () => {
  const [array, setArray] = useState<ArrayElement[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [algorithm, setAlgorithm] = useState<SortingAlgorithm>("bubble");
  const [speed, setSpeed] = useState(500);
  const [comparisons, setComparisons] = useState(0);
  const [swaps, setSwaps] = useState(0);

  const generateRandomArray = (size = 12) => {
    const newArray: ArrayElement[] = [];
    for (let i = 0; i < size; i++) {
      newArray.push({
        value: Math.floor(Math.random() * 300) + 10,
        id: Math.random().toString(36).substr(2, 9),
      });
    }
    setArray(newArray);
    setComparisons(0);
    setSwaps(0);
  };

  useEffect(() => {
    generateRandomArray();
  }, []);

  const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const updateArray = (newArray: ArrayElement[]) => {
    setArray([...newArray]);
  };

  const bubbleSort = async () => {
    const arr = [...array];
    const n = arr.length;
    let compCount = 0;
    let swapCount = 0;

    for (let i = 0; i < n - 1; i++) {
      for (let j = 0; j < n - i - 1; j++) {
        // Highlight comparing elements
        arr[j].isComparing = true;
        arr[j + 1].isComparing = true;
        updateArray(arr);
        compCount++;
        setComparisons(compCount);
        await sleep(speed);

        if (arr[j].value > arr[j + 1].value) {
          // Highlight swapping elements
          arr[j].isSwapping = true;
          arr[j + 1].isSwapping = true;
          updateArray(arr);
          await sleep(speed / 2);

          // Swap
          [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
          swapCount++;
          setSwaps(swapCount);
          updateArray(arr);
          await sleep(speed / 2);

          arr[j].isSwapping = false;
          arr[j + 1].isSwapping = false;
        }

        arr[j].isComparing = false;
        arr[j + 1].isComparing = false;
      }
      // Mark as sorted
      arr[n - 1 - i].isSorted = true;
      updateArray(arr);
    }
    arr[0].isSorted = true;
    updateArray(arr);
  };

  const selectionSort = async () => {
    const arr = [...array];
    const n = arr.length;
    let compCount = 0;
    let swapCount = 0;

    for (let i = 0; i < n - 1; i++) {
      let minIdx = i;
      arr[minIdx].isPivot = true;
      updateArray(arr);

      for (let j = i + 1; j < n; j++) {
        arr[j].isComparing = true;
        updateArray(arr);
        compCount++;
        setComparisons(compCount);
        await sleep(speed);

        if (arr[j].value < arr[minIdx].value) {
          arr[minIdx].isPivot = false;
          minIdx = j;
          arr[minIdx].isPivot = true;
        }

        arr[j].isComparing = false;
        updateArray(arr);
      }

      if (minIdx !== i) {
        arr[i].isSwapping = true;
        arr[minIdx].isSwapping = true;
        updateArray(arr);
        await sleep(speed);

        [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
        swapCount++;
        setSwaps(swapCount);

        arr[i].isSwapping = false;
        arr[minIdx].isSwapping = false;
      }

      arr[i].isPivot = false;
      arr[i].isSorted = true;
      updateArray(arr);
    }
    arr[n - 1].isSorted = true;
    updateArray(arr);
  };

  const insertionSort = async () => {
    const arr = [...array];
    let compCount = 0;
    let swapCount = 0;

    arr[0].isSorted = true;
    updateArray(arr);

    for (let i = 1; i < arr.length; i++) {
      const key = arr[i];
      key.isPivot = true;
      updateArray(arr);
      await sleep(speed);

      let j = i - 1;
      while (j >= 0) {
        arr[j].isComparing = true;
        updateArray(arr);
        compCount++;
        setComparisons(compCount);
        await sleep(speed);

        if (arr[j].value <= key.value) {
          arr[j].isComparing = false;
          break;
        }

        arr[j].isSwapping = true;
        arr[j + 1].isSwapping = true;
        updateArray(arr);
        await sleep(speed / 2);

        arr[j + 1] = arr[j];
        swapCount++;
        setSwaps(swapCount);

        arr[j].isComparing = false;
        arr[j].isSwapping = false;
        arr[j + 1].isSwapping = false;
        j--;
        updateArray(arr);
        await sleep(speed / 2);
      }

      arr[j + 1] = key;
      arr[j + 1].isPivot = false;
      arr[j + 1].isSorted = true;
      updateArray(arr);
    }
  };

  const startSorting = async () => {
    setIsPlaying(true);
    
    // Reset array states
    const resetArray = array.map(item => ({
      ...item,
      isComparing: false,
      isSwapping: false,
      isSorted: false,
      isPivot: false,
    }));
    setArray(resetArray);

    try {
      switch (algorithm) {
        case "bubble":
          await bubbleSort();
          break;
        case "selection":
          await selectionSort();
          break;
        case "insertion":
          await insertionSort();
          break;
        default:
          await bubbleSort();
      }
      toast({ description: `${algorithm} sort completed!` });
    } catch (error) {
      console.error("Sorting error:", error);
    }

    setIsPlaying(false);
  };

  const resetArray = () => {
    generateRandomArray();
    setIsPlaying(false);
  };

  const getBarStyle = (element: ArrayElement) => {
    let className = "flex-1 transition-all duration-300 rounded-t-lg relative min-w-[20px]";
    
    if (element.isSorted) {
      className += " bg-green-500 border-green-400";
    } else if (element.isSwapping) {
      className += " bg-red-500 border-red-400 scale-110";
    } else if (element.isComparing) {
      className += " bg-primary border-primary-glow scale-105";
    } else if (element.isPivot) {
      className += " bg-accent border-accent-glow";
    } else {
      className += " bg-secondary border-border/40";
    }
    
    return className;
  };

  const algorithms = [
    { value: "bubble", label: "Bubble Sort", complexity: "O(n²)" },
    { value: "selection", label: "Selection Sort", complexity: "O(n²)" },
    { value: "insertion", label: "Insertion Sort", complexity: "O(n²)" },
  ];

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
            <h1 className="text-3xl font-bold">Sorting Algorithms</h1>
            <p className="text-muted-foreground">Watch sorting algorithms in action with step-by-step visualization</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Visualization Panel */}
          <div className="lg:col-span-3">
            <Card className="bg-gradient-card border-border/40">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>
                    {algorithms.find(a => a.value === algorithm)?.label} Visualization
                  </CardTitle>
                  <Badge variant="outline" className="border-primary/20">
                    {algorithms.find(a => a.value === algorithm)?.complexity}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="bg-code rounded-lg p-6 min-h-[400px]">
                  <div className="flex items-end justify-center gap-1 h-80">
                    {array.map((element, index) => (
                      <div
                        key={element.id}
                        className={getBarStyle(element)}
                        style={{ 
                          height: `${(element.value / 300) * 100}%`,
                          border: '2px solid',
                        }}
                      >
                        <div className="absolute bottom-0 left-0 right-0 text-center">
                          <span className="text-xs text-foreground font-mono">
                            {element.value}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Control Panel */}
          <div className="space-y-6">
            {/* Algorithm Selection */}
            <Card className="bg-gradient-card border-border/40">
              <CardHeader>
                <CardTitle className="text-lg">Algorithm</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Select value={algorithm} onValueChange={(value: SortingAlgorithm) => setAlgorithm(value)} disabled={isPlaying}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select algorithm" />
                  </SelectTrigger>
                  <SelectContent>
                    {algorithms.map(algo => (
                      <SelectItem key={algo.value} value={algo.value}>
                        <div className="flex flex-col">
                          <span>{algo.label}</span>
                          <span className="text-xs text-muted-foreground">{algo.complexity}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Speed: {1100 - speed}ms</label>
                  <input
                    type="range"
                    min="100"
                    max="1000"
                    value={1100 - speed}
                    onChange={(e) => setSpeed(1100 - parseInt(e.target.value))}
                    className="w-full"
                    disabled={isPlaying}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Controls */}
            <Card className="bg-gradient-card border-border/40">
              <CardHeader>
                <CardTitle className="text-lg">Controls</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button
                  variant="neon"
                  onClick={startSorting}
                  disabled={isPlaying}
                  className="w-full"
                >
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  {isPlaying ? "Sorting..." : "Start Sorting"}
                </Button>

                <div className="grid grid-cols-2 gap-2">
                  <Button variant="control" onClick={() => generateRandomArray()} disabled={isPlaying}>
                    <Shuffle className="w-4 h-4" />
                    Shuffle
                  </Button>
                  <Button variant="control" onClick={resetArray} disabled={isPlaying}>
                    <RotateCcw className="w-4 h-4" />
                    Reset
                  </Button>
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
                  <span className="text-muted-foreground">Swaps:</span>
                  <span>{swaps}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Time complexity:</span>
                  <span>{algorithms.find(a => a.value === algorithm)?.complexity}</span>
                </div>
              </CardContent>
            </Card>

            {/* Legend */}
            <Card className="bg-gradient-card border-border/40">
              <CardHeader>
                <CardTitle className="text-lg">Legend</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-secondary rounded border-2 border-border/40"></div>
                  <span className="text-sm">Unsorted</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-primary rounded border-2 border-primary-glow"></div>
                  <span className="text-sm">Comparing</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-red-500 rounded border-2 border-red-400"></div>
                  <span className="text-sm">Swapping</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-accent rounded border-2 border-accent-glow"></div>
                  <span className="text-sm">Pivot/Key</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-green-500 rounded border-2 border-green-400"></div>
                  <span className="text-sm">Sorted</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SortingVisualization;