// src/pages/GraphVisualization.tsx
import { useState } from "react";
import type { ReactElement, ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Plus, Link as LinkIcon, RotateCcw, Search } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "@/hooks/use-toast";

// ✅ Theory imports (folder is singular: /theory/graph)
import TheoryPanel, { type TheorySection } from "@/components/TheoryPanel";
import { graphTheory } from "@/theory/graph";

/* ------------------------ Types ------------------------ */

type GraphNode = {
  id: string;
  label: string;
  x: number;
  y: number;
};

type GraphEdge = {
  from: string; // node id
  to: string;   // node id
};

type Algorithm = "bfs" | "dfs";

/* ---------------------- Component ---------------------- */

const GraphVisualization = () => {
  const [nodes, setNodes] = useState<GraphNode[]>([
    { id: "A", label: "A", x: 150, y: 120 },
    { id: "B", label: "B", x: 300, y: 80 },
    { id: "C", label: "C", x: 300, y: 170 },
    { id: "D", label: "D", x: 480, y: 80 },
    { id: "E", label: "E", x: 480, y: 170 },
  ]);

  const [edges, setEdges] = useState<GraphEdge[]>([
    { from: "A", to: "B" },
    { from: "A", to: "C" },
    { from: "B", to: "D" },
    { from: "C", to: "E" },
  ]);

  const [selectedNode, setSelectedNode] = useState<string>("");
  const [connectTarget, setConnectTarget] = useState<string>("");
  const [newNodeLabel, setNewNodeLabel] = useState<string>("");
  const [algorithm, setAlgorithm] = useState<Algorithm>("bfs");
  const [startNode, setStartNode] = useState<string>("");
  const [endNode, setEndNode] = useState<string>("");

  // Highlights
  const [visited, setVisited] = useState<Set<string>>(new Set());
  const [path, setPath] = useState<string[]>([]);

  /* -------------------- Helpers -------------------- */

  const addNode = (): void => {
    const label = newNodeLabel.trim() || `${nodes.length + 1}`;
    if (nodes.some((n) => n.id === label)) {
      toast({ description: `Node "${label}" already exists`, variant: "destructive" });
      return;
    }
    const newNode: GraphNode = {
      id: label,
      label,
      x: 150 + (nodes.length % 6) * 120,
      y: 100 + Math.floor(nodes.length / 6) * 110,
    };
    setNodes((prev) => [...prev, newNode]);
    setNewNodeLabel("");
    toast({ description: `Node "${label}" added` });
  };

  const addEdge = (): void => {
    if (!selectedNode || !connectTarget) {
      toast({ description: "Select both nodes to connect", variant: "destructive" });
      return;
    }
    if (selectedNode === connectTarget) {
      toast({ description: "Cannot connect a node to itself", variant: "destructive" });
      return;
    }
    if (!nodes.find((n) => n.id === selectedNode) || !nodes.find((n) => n.id === connectTarget)) {
      toast({ description: "One or both nodes do not exist", variant: "destructive" });
      return;
    }
    // Avoid duplicate edges (undirected check)
    const exists = edges.some(
      (e) =>
        (e.from === selectedNode && e.to === connectTarget) ||
        (e.from === connectTarget && e.to === selectedNode)
    );
    if (exists) {
      toast({ description: "Edge already exists", variant: "destructive" });
      return;
    }
    setEdges((prev) => [...prev, { from: selectedNode, to: connectTarget }]);
    toast({ description: `Connected ${selectedNode} ↔ ${connectTarget}` });
  };

  const resetGraph = (): void => {
    setVisited(new Set());
    setPath([]);
    toast({ description: "Highlights cleared" });
  };

  const clearAll = (): void => {
    setNodes([]);
    setEdges([]);
    setVisited(new Set());
    setPath([]);
    setSelectedNode("");
    setConnectTarget("");
    setStartNode("");
    setEndNode("");
    toast({ description: "Graph cleared" });
  };

  const loadSample = (): void => {
    setNodes([
      { id: "A", label: "A", x: 150, y: 120 },
      { id: "B", label: "B", x: 300, y: 80 },
      { id: "C", label: "C", x: 300, y: 170 },
      { id: "D", label: "D", x: 480, y: 80 },
      { id: "E", label: "E", x: 480, y: 170 },
    ]);
    setEdges([
      { from: "A", to: "B" },
      { from: "A", to: "C" },
      { from: "B", to: "D" },
      { from: "C", to: "E" },
    ]);
    setVisited(new Set());
    setPath([]);
    setStartNode("");
    setEndNode("");
    toast({ description: "Sample graph loaded" });
  };

  /* ---------------- Algorithms (unweighted) ---------------- */

  const adjacency = (): Map<string, string[]> => {
    const map = new Map<string, string[]>();
    nodes.forEach((n) => map.set(n.id, []));
    edges.forEach(({ from, to }) => {
      // treat as undirected for simple demos
      map.get(from)?.push(to);
      map.get(to)?.push(from);
    });
    return map;
  };

  const runBFS = (start: string, goal: string): string[] => {
    const adj = adjacency();
    const q: string[] = [start];
    const parent = new Map<string, string | null>();
    parent.set(start, null);
    const seen = new Set<string>([start]);

    while (q.length) {
      const u = q.shift() as string;
      if (u === goal) break;
      for (const v of adj.get(u) ?? []) {
        if (!seen.has(v)) {
          seen.add(v);
          parent.set(v, u);
          q.push(v);
        }
      }
    }

    // Reconstruct
    if (!parent.has(goal)) return [];
    const pathSeq: string[] = [];
    let cur: string | null = goal;
    while (cur) {
      pathSeq.push(cur);
      cur = parent.get(cur) ?? null;
    }
    return pathSeq.reverse();
  };

  const runDFS = (start: string, goal: string): string[] => {
    const adj = adjacency();
    const parent = new Map<string, string | null>();
    const seen = new Set<string>();
    let found = false;

    const dfs = (u: string) => {
      if (found) return;
      seen.add(u);
      if (u === goal) {
        found = true;
        return;
      }
      for (const v of adj.get(u) ?? []) {
        if (!seen.has(v)) {
          parent.set(v, u);
          dfs(v);
          if (found) return;
        }
      }
    };

    parent.set(start, null);
    dfs(start);

    if (!found) return [];
    const pathSeq: string[] = [];
    let cur: string | null = goal;
    while (cur) {
      pathSeq.push(cur);
      cur = parent.get(cur) ?? null;
    }
    return pathSeq.reverse();
  };

  const runSearch = (): void => {
    if (!startNode || !endNode) {
      toast({ description: "Choose both start and end nodes", variant: "destructive" });
      return;
    }
    if (!nodes.find((n) => n.id === startNode) || !nodes.find((n) => n.id === endNode)) {
      toast({ description: "Start or End node does not exist", variant: "destructive" });
      return;
    }

    const resultPath = algorithm === "bfs" ? runBFS(startNode, endNode) : runDFS(startNode, endNode);
    if (resultPath.length === 0) {
      setVisited(new Set());
      setPath([]);
      toast({ description: "No path found", variant: "destructive" });
      return;
    }

    setVisited(new Set(resultPath));
    setPath(resultPath);
    toast({ description: `${algorithm.toUpperCase()} found path: ${resultPath.join(" → ")}` });
  };

  /* ------------------- Rendering helpers ------------------- */

  const getNode = (id: string): GraphNode | undefined => nodes.find((n) => n.id === id);

  const isEdgeOnPath = (e: GraphEdge): boolean => {
    if (path.length < 2) return false;
    for (let i = 0; i < path.length - 1; i++) {
      const a = path[i];
      const b = path[i + 1];
      const undirected =
        (e.from === a && e.to === b) ||
        (e.from === b && e.to === a);
      if (undirected) return true;
    }
    return false;
  };

  const renderSVG = (): ReactElement => {
    return (
      <svg width={800} height={420} className="overflow-visible">
        {/* Edges */}
        {edges.map((e) => {
          const u = getNode(e.from);
          const v = getNode(e.to);
          if (!u || !v) return null as unknown as ReactElement;
          const onPath = isEdgeOnPath(e);
          return (
            <line
              key={`${e.from}-${e.to}`}
              x1={u.x}
              y1={u.y}
              x2={v.x}
              y2={v.y}
              stroke={onPath ? "hsl(var(--accent))" : "hsl(var(--border))"}
              strokeWidth={onPath ? 3 : 2}
              className={onPath ? "opacity-100" : "opacity-70"}
            />
          );
        })}

        {/* Nodes */}
        {nodes.map((n) => {
          const isVisited = visited.has(n.id);
          const isStart = n.id === startNode;
          const isEnd = n.id === endNode;
          return (
            <g key={n.id}>
              <circle
                cx={n.x}
                cy={n.y}
                r={24}
                fill={
                  isVisited
                    ? "hsl(var(--accent))"
                    : isStart || isEnd
                    ? "hsl(var(--primary))"
                    : "hsl(var(--card))"
                }
                stroke={isVisited ? "hsl(var(--accent-glow))" : "hsl(var(--border))"}
                strokeWidth={isVisited ? 3 : 2}
              />
              <text
                x={n.x}
                y={n.y + 5}
                textAnchor="middle"
                fontSize={14}
                fontWeight="bold"
                fill={isVisited ? "hsl(var(--accent-foreground))" : "hsl(var(--foreground))"}
              >
                {n.label}
              </text>
            </g>
          );
        })}
      </svg>
    );
  };

  /* -------------------- Theory builder -------------------- */
  // Accept ReactNode in topics.body to match your /theory/graph types
  function buildSectionsFromRecord(
    rec: Record<
      string,
      { title: string; intro?: string; topics?: { heading: string; body: ReactNode }[] }
    >
  ): TheorySection[] {
    const sections: TheorySection[] = [];
    Object.values(rec).forEach((entry) => {
      const parts: ReactNode[] = [];
      if (entry.intro) {
        parts.push(<p key="intro" className="mb-2">{entry.intro}</p>);
      }
      if (entry.topics && entry.topics.length) {
        parts.push(
          <ul key="topics" className="list-disc pl-5 space-y-1">
            {entry.topics.map((t, i) => (
              <li key={i}>
                <b>{t.heading}:</b>{" "}
                {t.body}
              </li>
            ))}
          </ul>
        );
      }
      sections.push({
        heading: entry.title,
        body: <div className="prose prose-invert">{parts}</div>,
      });
    });
    return sections;
  }

  /* ------------------------- UI ------------------------- */

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
            <h1 className="text-3xl font-bold">Graph Visualization</h1>
            <p className="text-muted-foreground">Build a small graph and run BFS/DFS (intro level)</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Visualization */}
          <div className="lg:col-span-2">
            <Card className="bg-gradient-card border-border/40">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Canvas</CardTitle>
                  <Badge variant="outline" className="border-primary/20">
                    {nodes.length} nodes • {edges.length} edges
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="bg-code rounded-lg p-6 min-h-[420px] flex items-center justify-center overflow-x-auto">
                  {nodes.length ? (
                    renderSVG()
                  ) : (
                    <div className="text-center">
                      <p className="text-muted-foreground mb-4">No nodes yet</p>
                      <Button variant="neon" onClick={loadSample}>Load Sample</Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Controls */}
          <div className="space-y-6">
            {/* Node & Edge ops */}
            <Card className="bg-gradient-card border-border/40">
              <CardHeader>
                <CardTitle className="text-lg">Build Graph</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="New node label (e.g., F)"
                    value={newNodeLabel}
                    onChange={(e) => setNewNodeLabel(e.target.value)}
                  />
                  <Button variant="accent" onClick={addNode}>
                    <Plus className="w-4 h-4" /> Add Node
                  </Button>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <Select value={selectedNode} onValueChange={(v) => setSelectedNode(v)}>
                    <SelectTrigger>
                      <SelectValue placeholder="From node" />
                    </SelectTrigger>
                    <SelectContent>
                      {nodes.map((n) => (
                        <SelectItem key={n.id} value={n.id}>{n.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select value={connectTarget} onValueChange={(v) => setConnectTarget(v)}>
                    <SelectTrigger>
                      <SelectValue placeholder="To node" />
                    </SelectTrigger>
                    <SelectContent>
                      {nodes.map((n) => (
                        <SelectItem key={n.id} value={n.id}>{n.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex gap-2">
                  <Button variant="code" onClick={addEdge}>
                    <LinkIcon className="w-4 h-4" /> Connect
                  </Button>
                  <Button variant="control" onClick={resetGraph}>
                    Clear Highlights
                  </Button>
                  <Button variant="ghost" onClick={clearAll}>
                    <RotateCcw className="w-4 h-4" /> Clear Graph
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Algorithms */}
            <Card className="bg-gradient-card border-border/40">
              <CardHeader>
                <CardTitle className="text-lg">Algorithms</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Select value={algorithm} onValueChange={(v) => setAlgorithm(v as Algorithm)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose algorithm" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bfs">BFS (shortest path in unweighted)</SelectItem>
                    <SelectItem value="dfs">DFS (depth-first walk)</SelectItem>
                  </SelectContent>
                </Select>

                <div className="grid grid-cols-2 gap-2">
                  <Select value={startNode} onValueChange={(v) => setStartNode(v)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Start" />
                    </SelectTrigger>
                    <SelectContent>
                      {nodes.map((n) => (
                        <SelectItem key={n.id} value={n.id}>{n.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select value={endNode} onValueChange={(v) => setEndNode(v)}>
                    <SelectTrigger>
                      <SelectValue placeholder="End" />
                    </SelectTrigger>
                    <SelectContent>
                      {nodes.map((n) => (
                        <SelectItem key={n.id} value={n.id}>{n.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Button variant="neon" onClick={runSearch} className="w-full">
                  <Search className="w-4 h-4" /> Run {algorithm.toUpperCase()}
                </Button>

                {path.length > 0 && (
                  <div className="text-sm text-muted-foreground">
                    Path: <span className="font-mono">{path.join(" → ")}</span>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Theory (intro level) */}
        <div className="mt-8">
          <TheoryPanel
            title="Graphs — Theory (Intro)"
            sections={buildSectionsFromRecord(graphTheory)}
          />
        </div>
      </div>
    </div>
  );
};

export default GraphVisualization;
