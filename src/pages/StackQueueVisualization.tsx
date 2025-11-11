import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowLeft,
  Plus,
  Minus,
  RotateCcw,
  ArrowUp,
  ArrowDown,
  ArrowRight,
} from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "@/hooks/use-toast";

// 🔗 Theory imports
import TheoryPanel, { type TheorySection } from "@/components/TheoryPanel";
import {
  stackTheory,
  type StackTheoryEntry,
  type StackTopic,
} from "../theory/stack";
import {
  queueTheory,
  type QueueTheoryEntry,
  type QueueTopic,
} from "@/theory/queue";

/* =========================
   Types & Data Structures
========================= */
interface StackNode {
  value: number;
  id: string;
}

interface QueueNode {
  value: number;
  id: string;
}

/**
 * Helper type to match your theory records’ minimal shape
 * (title, optional intro, list of topics).
 */
type MinimalTheoryEntry = {
  title: string;
  intro?: string;
  topics?: Array<{ heading: string; body: string | JSX.Element }>;
};

/* =========================
   Small Utilities
========================= */
function uid(): string {
  // Safer slice (substr is deprecated)
  return Math.random().toString(36).slice(2, 11);
}

/**
 * Build TheoryPanel sections from a typed record (no `any`).
 */
function buildSectionsFromRecord<T extends MinimalTheoryEntry>(
  rec: Record<string, T>
): TheorySection[] {
  const sections: TheorySection[] = [];
  Object.values(rec).forEach((entry) => {
    const pieces: JSX.Element[] = [];

    if (entry.intro) {
      pieces.push(
        <p key="intro" className="mb-2">
          {entry.intro}
        </p>
      );
    }

    if (entry.topics && entry.topics.length > 0) {
      pieces.push(
        <ul key="topics" className="list-disc pl-5 space-y-1">
          {entry.topics.map((t, i) => (
            <li key={i}>
              <b>{t.heading}:</b> {t.body}
            </li>
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

/* =========================
   Stack Implementation
========================= */
class Stack {
  private items: StackNode[] = [];

  push(value: number): void {
    this.items.push({
      value,
      id: uid(),
    });
  }

  pop(): number | null {
    const item = this.items.pop();
    return item ? item.value : null;
  }

  peek(): number | null {
    const item = this.items[this.items.length - 1];
    return item ? item.value : null;
  }

  isEmpty(): boolean {
    return this.items.length === 0;
  }

  size(): number {
    return this.items.length;
  }

  toArray(): StackNode[] {
    // Display with top element first
    return [...this.items].reverse();
  }

  clear(): void {
    this.items = [];
  }
}

/* =========================
   Queue Implementation
========================= */
class Queue {
  private items: QueueNode[] = [];

  enqueue(value: number): void {
    this.items.push({
      value,
      id: uid(),
    });
  }

  dequeue(): number | null {
    const item = this.items.shift();
    return item ? item.value : null;
  }

  front(): number | null {
    const item = this.items[0];
    return item ? item.value : null;
  }

  isEmpty(): boolean {
    return this.items.length === 0;
  }

  size(): number {
    return this.items.length;
  }

  toArray(): QueueNode[] {
    return [...this.items];
  }

  clear(): void {
    this.items = [];
  }
}

/* =========================
   Component
========================= */
const StackQueueVisualization = () => {
  const [stack] = useState(new Stack());
  const [queue] = useState(new Queue());

  const [stackItems, setStackItems] = useState<StackNode[]>([]);
  const [queueItems, setQueueItems] = useState<QueueNode[]>([]);
  const [newValue, setNewValue] = useState("");
  const [highlightedItem, setHighlightedItem] = useState<string | null>(null);

  // Build theory sections (intro-level) for each tab
  const stackSections = buildSectionsFromRecord<StackTheoryEntry>(stackTheory);
  const queueSections = buildSectionsFromRecord<QueueTheoryEntry>(queueTheory);

  const updateStackVisualization = () => {
    setStackItems([...stack.toArray()]);
  };

  const updateQueueVisualization = () => {
    setQueueItems([...queue.toArray()]);
  };

  const handleStackPush = () => {
    const value = parseInt(newValue);
    if (!isNaN(value)) {
      stack.push(value);
      updateStackVisualization();
      setNewValue("");
      toast({ description: `Pushed ${value} onto stack` });

      // Highlight the new top item
      const newItems = stack.toArray();
      if (newItems.length > 0) {
        setHighlightedItem(newItems[0].id);
        setTimeout(() => setHighlightedItem(null), 1000);
      }
    }
  };

  const handleStackPop = () => {
    const value = stack.pop();
    if (value !== null) {
      updateStackVisualization();
      toast({ description: `Popped ${value} from stack` });
    } else {
      toast({ description: "Stack is empty!", variant: "destructive" });
    }
  };

  const handleQueueEnqueue = () => {
    const value = parseInt(newValue);
    if (!isNaN(value)) {
      queue.enqueue(value);
      updateQueueVisualization();
      setNewValue("");
      toast({ description: `Enqueued ${value} to queue` });

      // Highlight the new rear item
      const newItems = queue.toArray();
      if (newItems.length > 0) {
        setHighlightedItem(newItems[newItems.length - 1].id);
        setTimeout(() => setHighlightedItem(null), 1000);
      }
    }
  };

  const handleQueueDequeue = () => {
    const value = queue.dequeue();
    if (value !== null) {
      updateQueueVisualization();
      toast({ description: `Dequeued ${value} from queue` });
    } else {
      toast({ description: "Queue is empty!", variant: "destructive" });
    }
  };

  const resetStack = () => {
    stack.clear();
    updateStackVisualization();
    setHighlightedItem(null);
    toast({ description: "Stack cleared" });
  };

  const resetQueue = () => {
    queue.clear();
    updateQueueVisualization();
    setHighlightedItem(null);
    toast({ description: "Queue cleared" });
  };

  const initSampleStack = () => {
    stack.clear();
    [1, 2, 3, 4, 5].forEach((value) => stack.push(value));
    updateStackVisualization();
    toast({ description: "Sample stack loaded" });
  };

  const initSampleQueue = () => {
    queue.clear();
    [1, 2, 3, 4, 5].forEach((value) => queue.enqueue(value));
    updateQueueVisualization();
    toast({ description: "Sample queue loaded" });
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
            <h1 className="text-3xl font-bold">Stacks & Queues</h1>
            <p className="text-muted-foreground">
              LIFO and FIFO data structure visualization
            </p>
          </div>
        </div>

        <Tabs defaultValue="stack" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="stack">Stack (LIFO)</TabsTrigger>
            <TabsTrigger value="queue">Queue (FIFO)</TabsTrigger>
          </TabsList>

          {/* ============ Stack Tab ============ */}
          <TabsContent value="stack">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <Card className="bg-gradient-card border-border/40">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>Stack Structure (LIFO)</CardTitle>
                      <Badge variant="outline" className="border-primary/20">
                        Size: {stack.size()}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-code rounded-lg p-6 min-h-[400px] flex flex-col items-center justify-end">
                      {stackItems.length > 0 ? (
                        <div className="flex flex-col gap-2 items-center">
                          {/* Top indicator */}
                          <div className="flex items-center gap-2 text-sm text-muted-foreground font-mono mb-2">
                            <ArrowUp className="w-4 h-4" />
                            <span>TOP</span>
                          </div>

                          {stackItems.map((item) => (
                            <div
                              key={item.id}
                              className={`w-32 h-16 rounded-lg border-2 transition-all duration-300 flex items-center justify-center font-bold text-lg
                              ${
                                highlightedItem === item.id
                                  ? "bg-primary border-primary-glow shadow-neon scale-105 text-primary-foreground"
                                  : "bg-card border-border/40 text-foreground hover:border-primary/40"
                              }`}
                            >
                              {item.value}
                            </div>
                          ))}

                          {/* Bottom indicator */}
                          <div className="w-32 h-4 border-t-2 border-muted-foreground/40 mt-2"></div>
                          <div className="text-sm text-muted-foreground font-mono">
                            BOTTOM
                          </div>
                        </div>
                      ) : (
                        <div className="text-center">
                          <p className="text-muted-foreground mb-4">
                            Stack is empty
                          </p>
                          <Button variant="neon" onClick={initSampleStack}>
                            Load Sample Stack
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Stack Controls */}
              <div className="space-y-6">
                <Card className="bg-gradient-card border-border/40">
                  <CardHeader>
                    <CardTitle className="text-lg">Stack Operations</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Input
                        type="number"
                        placeholder="Enter value"
                        value={newValue}
                        onChange={(e) => setNewValue(e.target.value)}
                      />

                      <Button
                        variant="accent"
                        onClick={handleStackPush}
                        disabled={!newValue}
                        className="w-full"
                      >
                        <Plus className="w-4 h-4" />
                        Push
                      </Button>

                      <Button
                        variant="destructive"
                        onClick={handleStackPop}
                        disabled={stack.isEmpty()}
                        className="w-full"
                      >
                        <Minus className="w-4 h-4" />
                        Pop
                      </Button>
                    </div>

                    <Button
                      variant="control"
                      onClick={resetStack}
                      className="w-full"
                    >
                      <RotateCcw className="w-4 h-4" />
                      Clear Stack
                    </Button>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-card border-border/40">
                  <CardHeader>
                    <CardTitle className="text-lg">Stack Info</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Top element:</span>
                      <span>{stack.peek() ?? "None"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Size:</span>
                      <span>{stack.size()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Push time:</span>
                      <span>O(1)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Pop time:</span>
                      <span>O(1)</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Stack Theory (intro-level) */}
            <div className="mt-8">
              <TheoryPanel title="Stack — Theory" sections={stackSections} />
            </div>
          </TabsContent>

          {/* ============ Queue Tab ============ */}
          <TabsContent value="queue">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <Card className="bg-gradient-card border-border/40">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>Queue Structure (FIFO)</CardTitle>
                      <Badge variant="outline" className="border-primary/20">
                        Size: {queue.size()}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-code rounded-lg p-6 min-h-[300px] flex items-center justify-center overflow-x-auto">
                      {queueItems.length > 0 ? (
                        <div className="flex items-center gap-4 min-w-max">
                          {/* Front indicator */}
                          <div className="flex flex-col items-center gap-2">
                            <span className="text-sm text-muted-foreground font-mono">
                              FRONT
                            </span>
                            <ArrowDown className="w-4 h-4 text-muted-foreground" />
                          </div>

                          {queueItems.map((item, index) => (
                            <div key={item.id} className="flex items-center gap-2">
                              <div
                                className={`w-20 h-20 rounded-lg border-2 transition-all duration-300 flex items-center justify-center font-bold text-lg
                                ${
                                  highlightedItem === item.id
                                    ? "bg-primary border-primary-glow shadow-neon scale-105 text-primary-foreground"
                                    : "bg-card border-border/40 text-foreground hover:border-primary/40"
                                }`}
                              >
                                {item.value}
                              </div>

                              {index < queueItems.length - 1 && (
                                <ArrowRight className="w-6 h-6 text-accent flex-shrink-0" />
                              )}
                            </div>
                          ))}

                          {/* Rear indicator */}
                          <div className="flex flex-col items-center gap-2 ml-4">
                            <span className="text-sm text-muted-foreground font-mono">
                              REAR
                            </span>
                            <ArrowDown className="w-4 h-4 text-muted-foreground" />
                          </div>
                        </div>
                      ) : (
                        <div className="text-center">
                          <p className="text-muted-foreground mb-4">
                            Queue is empty
                          </p>
                          <Button variant="neon" onClick={initSampleQueue}>
                            Load Sample Queue
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Queue Controls */}
              <div className="space-y-6">
                <Card className="bg-gradient-card border-border/40">
                  <CardHeader>
                    <CardTitle className="text-lg">Queue Operations</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Input
                        type="number"
                        placeholder="Enter value"
                        value={newValue}
                        onChange={(e) => setNewValue(e.target.value)}
                      />

                      <Button
                        variant="accent"
                        onClick={handleQueueEnqueue}
                        disabled={!newValue}
                        className="w-full"
                      >
                        <Plus className="w-4 h-4" />
                        Enqueue
                      </Button>

                      <Button
                        variant="destructive"
                        onClick={handleQueueDequeue}
                        disabled={queue.isEmpty()}
                        className="w-full"
                      >
                        <Minus className="w-4 h-4" />
                        Dequeue
                      </Button>
                    </div>

                    <Button
                      variant="control"
                      onClick={resetQueue}
                      className="w-full"
                    >
                      <RotateCcw className="w-4 h-4" />
                      Clear Queue
                    </Button>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-card border-border/40">
                  <CardHeader>
                    <CardTitle className="text-lg">Queue Info</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        Front element:
                      </span>
                      <span>{queue.front() ?? "None"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Size:</span>
                      <span>{queue.size()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        Enqueue time:
                      </span>
                      <span>O(1)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        Dequeue time:
                      </span>
                      <span>O(1)</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Queue Theory (intro-level) */}
            <div className="mt-8">
              <TheoryPanel title="Queue — Theory" sections={queueSections} />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default StackQueueVisualization;
