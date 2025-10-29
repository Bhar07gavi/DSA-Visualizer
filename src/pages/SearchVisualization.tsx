import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Search, RotateCcw, Shuffle } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "@/hooks/use-toast";

type SearchAlgorithm = "linear" | "binary" | "jump";

interface ArrayElement {
  value: number;
  id: string;
  isChecking?: boolean;
  isFound?: boolean;
  isInRange?: boolean;
}

const SearchVisualization = () => {
  const [array, setArray] = useState<ArrayElement[]>([]);
  const [searchValue, setSearchValue] = useState("");
  const [algorithm, setAlgorithm] = useState<SearchAlgorithm>("linear");
  const [isSearching, setIsSearching] = useState(false);
  const [comparisons, setComparisons] = useState(0);
  const [foundIndex, setFoundIndex] = useState(-1);
  const [speed, setSpeed] = useState(800);

  const generateSortedArray = (size = 15) => {
    const newArray: ArrayElement[] = [];
    for (let i = 0; i < size; i++) {
      newArray.push({
        value: (i + 1) * 7 + Math.floor(Math.random() * 5), // Generate somewhat sorted array
        id: Math.random().toString(36).substr(2, 9),
      });
    }
    newArray.sort((a, b) => a.value - b.value);
    setArray(newArray);
    resetSearch();
  };

  const generateRandomArray = (size = 15) => {
    const newArray: ArrayElement[] = [];
    const values = new Set<number>();
    
    while (values.size < size) {
      values.add(Math.floor(Math.random() * 100) + 1);
    }
    
    Array.from(values).forEach(value => {
      newArray.push({
        value,
        id: Math.random().toString(36).substr(2, 9),
      });
    });
    
    setArray(newArray);
    resetSearch();
  };

  useEffect(() => {
    generateSortedArray();
  }, []);

  const resetSearch = () => {
    setComparisons(0);
    setFoundIndex(-1);
    setArray(prev => prev.map(item => ({
      ...item,
      isChecking: false,
      isFound: false,
      isInRange: false,
    })));
  };

  const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const updateArray = (newArray: ArrayElement[]) => {
    setArray([...newArray]);
  };

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

    while (left <= right) {
      // Highlight the current range
      for (let i = 0; i < arr.length; i++) {
        arr[i].isInRange = i >= left && i <= right;
      }
      updateArray(arr);
      await sleep(speed / 2);

      const mid = Math.floor((left + right) / 2);
      
      // Highlight the middle element
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

      if (arr[mid].value < target) {
        left = mid + 1;
      } else {
        right = mid - 1;
      }

      updateArray(arr);
      await sleep(speed / 2);
    }

    // Clear range highlighting
    for (let i = 0; i < arr.length; i++) {
      arr[i].isInRange = false;
    }
    updateArray(arr);

    toast({ description: `${target} not found in array (${compCount} comparisons)`, variant: "destructive" });
  };

  const jumpSearch = async (target: number) => {
    const arr = [...array];
    const n = arr.length;
    let stepSize = Math.floor(Math.sqrt(n));
    let prev = 0;
    let compCount = 0;

    // Find the block where element is present
    while (arr[Math.min(stepSize, n) - 1].value < target) {
      // Highlight current position
      const currentPos = Math.min(stepSize, n) - 1;
      arr[currentPos].isChecking = true;
      updateArray(arr);
      compCount++;
      setComparisons(compCount);
      await sleep(speed);

      arr[currentPos].isChecking = false;
      prev = stepSize;
      stepSize += Math.floor(Math.sqrt(n));
      
      if (prev >= n) {
        updateArray(arr);
        toast({ description: `${target} not found in array (${compCount} comparisons)`, variant: "destructive" });
        return;
      }
      updateArray(arr);
      await sleep(speed / 2);
    }

    // Linear search in the identified block
    for (let i = prev; i < Math.min(stepSize, n); i++) {
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

  const startSearch = async () => {
    const target = parseInt(searchValue);
    if (isNaN(target)) {
      toast({ description: "Please enter a valid number", variant: "destructive" });
      return;
    }

    setIsSearching(true);
    resetSearch();

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
    } catch (error) {
      console.error("Search error:", error);
    }

    setIsSearching(false);
  };

  const getElementStyle = (element: ArrayElement, index: number) => {
    let className = "w-16 h-16 rounded-lg border-2 transition-all duration-300 flex items-center justify-center font-bold text-sm";
    
    if (element.isFound) {
      className += " bg-green-500 border-green-400 text-white shadow-lg scale-110";
    } else if (element.isChecking) {
      className += " bg-primary border-primary-glow text-primary-foreground shadow-neon scale-105";
    } else if (element.isInRange) {
      className += " bg-accent/30 border-accent text-foreground";
    } else {
      className += " bg-card border-border/40 text-foreground hover:border-primary/40";
    }
    
    return className;
  };

  const algorithms = [
    { value: "linear", label: "Linear Search", complexity: "O(n)", requiresSorted: false },
    { value: "binary", label: "Binary Search", complexity: "O(log n)", requiresSorted: true },
    { value: "jump", label: "Jump Search", complexity: "O(√n)", requiresSorted: true },
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
                  <CardTitle>
                    {algorithms.find(a => a.value === algorithm)?.label} Visualization
                  </CardTitle>
                  <div className="flex gap-2">
                    <Badge variant="outline" className="border-primary/20">
                      {algorithms.find(a => a.value === algorithm)?.complexity}
                    </Badge>
                    {algorithms.find(a => a.value === algorithm)?.requiresSorted && (
                      <Badge variant="secondary">Requires Sorted Array</Badge>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="bg-code rounded-lg p-6 min-h-[300px]">
                  <div className="flex flex-wrap gap-3 justify-center">
                    {array.map((element, index) => (
                      <div key={element.id} className="flex flex-col items-center gap-2">
                        <div className={getElementStyle(element, index)}>
                          {element.value}
                        </div>
                        <div className="text-xs text-muted-foreground font-mono">
                          [{index}]
                        </div>
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
          </div>

          {/* Control Panel */}
          <div className="space-y-6">
            {/* Algorithm Selection */}
            <Card className="bg-gradient-card border-border/40">
              <CardHeader>
                <CardTitle className="text-lg">Search Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Algorithm</label>
                  <Select 
                    value={algorithm} 
                    onValueChange={(value: SearchAlgorithm) => setAlgorithm(value)} 
                    disabled={isSearching}
                  >
                    <SelectTrigger>
                      <SelectValue />
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
                    <Button
                      variant="accent"
                      onClick={startSearch}
                      disabled={isSearching || !searchValue}
                    >
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
                    onChange={(e) => setSpeed(1100 - parseInt(e.target.value))}
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
                <Button
                  variant="neon"
                  onClick={() => generateSortedArray()}
                  disabled={isSearching}
                  className="w-full"
                >
                  <RotateCcw className="w-4 h-4" />
                  Generate Sorted Array
                </Button>

                <Button
                  variant="control"
                  onClick={() => generateRandomArray()}
                  disabled={isSearching}
                  className="w-full"
                >
                  <Shuffle className="w-4 h-4" />
                  Generate Random Array
                </Button>

                <Button
                  variant="control"
                  onClick={resetSearch}
                  disabled={isSearching}
                  className="w-full"
                >
                  Clear Results
                </Button>
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
                  <span>{algorithms.find(a => a.value === algorithm)?.complexity}</span>
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