import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Play, Pause, RotateCcw, Plus, Minus, Search } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";

const ArrayVisualization = () => {
  const [array, setArray] = useState<number[]>([64, 34, 25, 12, 22, 11, 90]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [compareIndex, setCompareIndex] = useState(-1);
  const [newValue, setNewValue] = useState("");
  const [searchValue, setSearchValue] = useState("");
  const [searchResult, setSearchResult] = useState(-1);

  // Linear search visualization
  const linearSearch = async (target: number) => {
    setSearchResult(-1);
    setCurrentIndex(-1);
    setIsPlaying(true);
    
    for (let i = 0; i < array.length; i++) {
      setCurrentIndex(i);
      await new Promise(resolve => setTimeout(resolve, 1200));
      
      if (array[i] === target) {
        setSearchResult(i);
        setCurrentIndex(-1);
        toast.success(`Found ${target} at index ${i}!`);
        setIsPlaying(false);
        return;
      }
    }
    
    setCurrentIndex(-1);
    setIsPlaying(false);
    toast.error(`${target} not found in array`);
  };

  // Bubble sort visualization  
  const bubbleSort = async () => {
    setIsPlaying(true);
    setSearchResult(-1);
    const arr = [...array];
    const n = arr.length;

    for (let i = 0; i < n - 1; i++) {
      for (let j = 0; j < n - i - 1; j++) {
        setCurrentIndex(j);
        setCompareIndex(j + 1);
        await new Promise(resolve => setTimeout(resolve, 1000));

        if (arr[j] > arr[j + 1]) {
          // Swap
          [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
          setArray([...arr]);
          await new Promise(resolve => setTimeout(resolve, 600));
        }
      }
    }

    setCurrentIndex(-1);
    setCompareIndex(-1);
    setIsPlaying(false);
    toast.success("Array sorted successfully!");
  };

  const addElement = () => {
    const value = parseInt(newValue);
    if (!isNaN(value)) {
      setArray([...array, value]);
      setNewValue("");
      toast.success(`Added ${value} to array`);
    }
  };

  const removeElement = (index: number) => {
    const newArray = array.filter((_, i) => i !== index);
    setArray(newArray);
    toast.success("Element removed");
  };

  const resetArray = () => {
    setArray([64, 34, 25, 12, 22, 11, 90]);
    setCurrentIndex(-1);
    setCompareIndex(-1);
    setSearchResult(-1);
    setIsPlaying(false);
  };

  const handleSearch = () => {
    const target = parseInt(searchValue);
    if (!isNaN(target)) {
      linearSearch(target);
    }
  };

  const getElementStyle = (index: number) => {
    let baseClass = "flex items-center justify-center h-16 w-16 rounded-lg transition-all duration-300 font-bold text-lg border-2";
    
    if (index === searchResult) {
      return `${baseClass} bg-green-500 border-green-400 text-white shadow-lg scale-110`;
    }
    if (index === currentIndex) {
      return `${baseClass} bg-primary border-primary-glow text-white shadow-neon scale-105`;
    }
    if (index === compareIndex) {
      return `${baseClass} bg-accent border-accent-glow text-accent-foreground shadow-accent scale-105`;
    }
    
    return `${baseClass} bg-card border-border/40 text-foreground hover:border-primary/40`;
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
            <h1 className="text-3xl font-bold">Array Visualization</h1>
            <p className="text-muted-foreground">Interactive array operations and algorithms</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Visualization Panel */}
          <div className="lg:col-span-2">
            <Card className="bg-gradient-card border-border/40">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Array Elements</CardTitle>
                  <Badge variant="outline" className="border-primary/20">
                    Length: {array.length}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-3 justify-center p-8 bg-code rounded-lg">
                  {array.map((value, index) => (
                    <div key={index} className="flex flex-col items-center gap-2">
                      <div className={getElementStyle(index)}>
                        {value}
                      </div>
                      <div className="text-xs text-muted-foreground font-mono">
                        [{index}]
                      </div>
                      <Button
                        variant="destructive"
                        size="sm"
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => removeElement(index)}
                        disabled={isPlaying}
                      >
                        <Minus className="w-3 h-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Control Panel */}
          <div className="space-y-6">
            {/* Array Operations */}
            <Card className="bg-gradient-card border-border/40">
              <CardHeader>
                <CardTitle className="text-lg">Array Operations</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    type="number"
                    placeholder="Add element"
                    value={newValue}
                    onChange={(e) => setNewValue(e.target.value)}
                    disabled={isPlaying}
                  />
                  <Button 
                    variant="code" 
                    onClick={addElement}
                    disabled={isPlaying || !newValue}
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>

                <Button 
                  variant="control" 
                  onClick={resetArray}
                  disabled={isPlaying}
                  className="w-full"
                >
                  <RotateCcw className="w-4 h-4" />
                  Reset Array
                </Button>
              </CardContent>
            </Card>

            {/* Algorithms */}
            <Card className="bg-gradient-card border-border/40">
              <CardHeader>
                <CardTitle className="text-lg">Algorithms</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Search */}
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Linear Search
                  </label>
                  <div className="flex gap-2">
                    <Input
                      type="number"
                      placeholder="Search value"
                      value={searchValue}
                      onChange={(e) => setSearchValue(e.target.value)}
                      disabled={isPlaying}
                    />
                    <Button
                      variant="accent"
                      onClick={handleSearch}
                      disabled={isPlaying || !searchValue}
                    >
                      <Search className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {/* Sort */}
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Bubble Sort
                  </label>
                  <Button
                    variant="neon"
                    onClick={bubbleSort}
                    disabled={isPlaying}
                    className="w-full"
                  >
                    {isPlaying ? (
                      <Pause className="w-4 h-4" />
                    ) : (
                      <Play className="w-4 h-4" />
                    )}
                    {isPlaying ? "Sorting..." : "Start Bubble Sort"}
                  </Button>
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
                  <div className="w-4 h-4 bg-primary rounded border-2 border-primary-glow"></div>
                  <span className="text-sm">Current Element</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-accent rounded border-2 border-accent-glow"></div>
                  <span className="text-sm">Comparing Element</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-green-500 rounded border-2 border-green-400"></div>
                  <span className="text-sm">Found Element</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArrayVisualization;