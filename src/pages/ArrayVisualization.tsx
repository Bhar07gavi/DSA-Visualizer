// src/pages/ArrayVisualization.tsx
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Play, Pause, RotateCcw, Plus, Minus, Search } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";

import TheoryPanel, { type TheorySection } from "@/components/TheoryPanel";
// Your new array theory record (default export from src/theory/array/index.ts)
import arrayTheory from "@/theory/array";

/* ---------------------- Types to map theory safely ---------------------- */

type ArrayTopic = {
  heading: string;
  body: string | React.ReactNode;
};

type ArrayEntry = {
  title: string;
  intro?: string;
  topics: ArrayTopic[];
  // optional fields your other pages/components may use
  pseudocode?: string;
  best?: string;
  avg?: string;
  worst?: string;
  space?: string;
  stable?: string;
  notes?: string[];
};

type ArrayTheoryIndex = Record<string, ArrayEntry>;

/** Convert your arrayTheory record into TheoryPanel sections (no `any`). */
function buildArraySections(theory: ArrayTheoryIndex): TheorySection[] {
  const sections: TheorySection[] = [];

  Object.values(theory).forEach((entry) => {
    const pieces: React.ReactNode[] = [];

    if (entry.intro) {
      pieces.push(
        <p key={`${entry.title}-intro`} className="mb-2">
          {entry.intro}
        </p>
      );
    }

    if (entry.pseudocode) {
      pieces.push(
        <pre
          key={`${entry.title}-code`}
          className="bg-muted p-3 rounded-md overflow-x-auto whitespace-pre"
        >
{entry.pseudocode}
        </pre>
      );
    }

    if (entry.topics?.length) {
      pieces.push(
        <ul key={`${entry.title}-topics`} className="list-disc pl-5 space-y-1">
          {entry.topics.map((t, i) => (
            <li key={`${entry.title}-topic-${i}`}>
              <b>{t.heading}:</b>{" "}
              {typeof t.body === "string" ? <span>{t.body}</span> : t.body}
            </li>
          ))}
        </ul>
      );
    }

    if (entry.notes?.length) {
      pieces.push(
        <ul key={`${entry.title}-notes`} className="list-disc pl-5 space-y-1">
          {entry.notes.map((n, i) => (
            <li key={`${entry.title}-note-${i}`}>{n}</li>
          ))}
        </ul>
      );
    }

    sections.push({
      heading: entry.title,
      body: <div className="prose prose-invert">{pieces}</div>,
    });
  });

  return sections;
}

/* ---------------------- Component ---------------------- */

const ArrayVisualization: React.FC = () => {
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
      await new Promise((resolve) => setTimeout(resolve, 1200));

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
        await new Promise((resolve) => setTimeout(resolve, 1000));

        if (arr[j] > arr[j + 1]) {
          [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
          setArray([...arr]);
          await new Promise((resolve) => setTimeout(resolve, 600));
        }
      }
    }

    setCurrentIndex(-1);
    setCompareIndex(-1);
    setIsPlaying(false);
    toast.success("Array sorted successfully!");
  };

  const addElement = () => {
    const value = parseInt(newValue, 10);
    if (!Number.isNaN(value)) {
      setArray((prev) => [...prev, value]);
      setNewValue("");
      toast.success(`Added ${value} to array`);
    }
  };

  const removeElement = (index: number) => {
    setArray((prev) => prev.filter((_, i) => i !== index));
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
    const target = parseInt(searchValue, 10);
    if (!Number.isNaN(target)) {
      void linearSearch(target);
    }
  };

  const getElementStyle = (index: number) => {
    const baseClass =
      "flex items-center justify-center h-16 w-16 rounded-lg transition-all duration-300 font-bold text-lg border-2";

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

  // Build TheoryPanel sections from your arrayTheory record
  const theorySections: TheorySection[] = buildArraySections(arrayTheory as ArrayTheoryIndex);

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
            <p className="text-muted-foreground">
              Interactive array operations and algorithms
            </p>
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
                    <div key={index} className="flex flex-col items-center gap-2 group">
                      <div className={getElementStyle(index)}>{value}</div>
                      <div className="text-xs text-muted-foreground font-mono">
                        [{index}]
                      </div>
                      <Button
                        variant="destructive"
                        size="sm"
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => removeElement(index)}
                        disabled={isPlaying}
                        aria-label={`Remove element at index ${index}`}
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
                    disabled={isPlaying || newValue.trim() === ""}
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
                      disabled={isPlaying || searchValue.trim() === ""}
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
                    onClick={() => void bubbleSort()}
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
                  <div className="w-4 h-4 bg-primary rounded border-2 border-primary-glow" />
                  <span className="text-sm">Current Element</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-accent rounded border-2 border-accent-glow" />
                  <span className="text-sm">Comparing Element</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-green-500 rounded border-2 border-green-400" />
                  <span className="text-sm">Found Element</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Theory Panel (built from your /theory/array files) */}
        <div className="mt-8">
          <TheoryPanel title="Arrays — Core Concepts" sections={theorySections} />
        </div>
      </div>
    </div>
  );
};

export default ArrayVisualization;
