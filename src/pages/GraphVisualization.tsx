import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Plus, Minus, RotateCcw, Play } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "@/hooks/use-toast";

interface GraphNode {
  id: string;
  label: string;
  x: number;
  y: number;
  isVisited?: boolean;
  isCurrently?: boolean;
  isPath?: boolean;
}

interface GraphEdge {
  from: string;
  to: string;
  weight?: number;
  isActive?: boolean;
}

type Algorithm = "dfs" | "bfs" | "dijkstra";

const GraphVisualization = () => {
  const [nodes, setNodes] = useState<GraphNode[]>([]);
  const [edges, setEdges] = useState<GraphEdge[]>([]);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [algorithm, setAlgorithm] = useState<Algorithm>("bfs");
  const [isRunning, setIsRunning] = useState(false);
  const [startNode, setStartNode] = useState("");
  const [endNode, setEndNode] = useState("");

  const addNode = () => {
    const newNode: GraphNode = {
      id: `node_${nodes.length + 1}`,
      label: `${nodes.length + 1}`,
      x: 150 + (nodes.length % 6) * 100,
      y: 100 + Math.floor(nodes.length / 6) * 100,
    };
    setNodes([...nodes, newNode]);
    toast({ description: `Added node ${newNode.label}` });
  };

  const removeNode = (nodeId: string) => {
    setNodes(nodes.filter(n => n.id !== nodeId));
    setEdges(edges.filter(e => e.from !== nodeId && e.to !== nodeId));
    if (selectedNode === nodeId) setSelectedNode(null);
    toast({ description: "Node removed" });
  };

  const addEdge = () => {
    if (!selectedNode) {
      toast({ description: "Select a node first", variant: "destructive" });
      return;
    }

    const targetNodeId = prompt("Enter target node number:");
    if (!targetNodeId) return;

    const targetNode = nodes.find(n => n.label === targetNodeId);
    if (!targetNode) {
      toast({ description: "Target node not found", variant: "destructive" });
      return;
    }

    if (selectedNode === targetNode.id) {
      toast({ description: "Cannot connect node to itself", variant: "destructive" });
      return;
    }

    const existingEdge = edges.find(e => 
      (e.from === selectedNode && e.to === targetNode.id) ||
      (e.from === targetNode.id && e.to === selectedNode)
    );

    if (existingEdge) {
      toast({ description: "Edge already exists", variant: "destructive" });
      return;
    }

    const newEdge: GraphEdge = {
      from: selectedNode,
      to: targetNode.id,
      weight: Math.floor(Math.random() * 10) + 1,
    };

    setEdges([...edges, newEdge]);
    toast({ description: `Added edge between nodes` });
  };

  const clearGraph = () => {
    setNodes([]);
    setEdges([]);
    setSelectedNode(null);
    resetVisualization();
    toast({ description: "Graph cleared" });
  };

  const resetVisualization = () => {
    setNodes(nodes.map(node => ({
      ...node,
      isVisited: false,
      isCurrently: false,
      isPath: false,
    })));
    setEdges(edges.map(edge => ({
      ...edge,
      isActive: false,
    })));
  };

  const createSampleGraph = () => {
    const sampleNodes: GraphNode[] = [
      { id: "1", label: "1", x: 200, y: 100 },
      { id: "2", label: "2", x: 350, y: 100 },
      { id: "3", label: "3", x: 500, y: 100 },
      { id: "4", label: "4", x: 200, y: 250 },
      { id: "5", label: "5", x: 350, y: 250 },
      { id: "6", label: "6", x: 500, y: 250 },
    ];

    const sampleEdges: GraphEdge[] = [
      { from: "1", to: "2", weight: 4 },
      { from: "1", to: "4", weight: 2 },
      { from: "2", to: "3", weight: 3 },
      { from: "2", to: "5", weight: 1 },
      { from: "3", to: "6", weight: 2 },
      { from: "4", to: "5", weight: 5 },
      { from: "5", to: "6", weight: 3 },
    ];

    setNodes(sampleNodes);
    setEdges(sampleEdges);
    setSelectedNode(null);
    toast({ description: "Sample graph loaded" });
  };

  const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const runBFS = async (start: string) => {
    if (!start) return;
    
    resetVisualization();
    const queue = [start];
    const visited = new Set<string>();

    while (queue.length > 0) {
      const current = queue.shift()!;
      
      if (visited.has(current)) continue;
      
      // Mark as currently processing
      setNodes(prev => prev.map(node => ({
        ...node,
        isCurrently: node.id === current,
        isVisited: visited.has(node.id),
      })));
      
      await sleep(1000);
      
      visited.add(current);
      
      // Mark as visited
      setNodes(prev => prev.map(node => ({
        ...node,
        isCurrently: false,
        isVisited: visited.has(node.id),
      })));

      // Find neighbors
      const neighbors = edges
        .filter(edge => edge.from === current || edge.to === current)
        .map(edge => edge.from === current ? edge.to : edge.from)
        .filter(neighbor => !visited.has(neighbor));

      // Highlight edges to neighbors
      setEdges(prev => prev.map(edge => ({
        ...edge,
        isActive: neighbors.includes(edge.from === current ? edge.to : edge.from) && 
                  (edge.from === current || edge.to === current)
      })));

      queue.push(...neighbors);
      await sleep(500);

      // Remove edge highlighting
      setEdges(prev => prev.map(edge => ({ ...edge, isActive: false })));
    }
  };

  const runDFS = async (start: string) => {
    if (!start) return;
    
    resetVisualization();
    const visited = new Set<string>();

    const dfsRecursive = async (nodeId: string) => {
      if (visited.has(nodeId)) return;
      
      visited.add(nodeId);
      
      // Mark as currently processing
      setNodes(prev => prev.map(node => ({
        ...node,
        isCurrently: node.id === nodeId,
        isVisited: visited.has(node.id),
      })));
      
      await sleep(1000);
      
      // Mark as visited
      setNodes(prev => prev.map(node => ({
        ...node,
        isCurrently: false,
        isVisited: visited.has(node.id),
      })));

      // Find neighbors
      const neighbors = edges
        .filter(edge => edge.from === nodeId || edge.to === nodeId)
        .map(edge => edge.from === nodeId ? edge.to : edge.from);

      for (const neighbor of neighbors) {
        if (!visited.has(neighbor)) {
          // Highlight edge
          setEdges(prev => prev.map(edge => ({
            ...edge,
            isActive: (edge.from === nodeId && edge.to === neighbor) ||
                      (edge.from === neighbor && edge.to === nodeId)
          })));
          
          await sleep(500);
          await dfsRecursive(neighbor);
          
          // Remove edge highlighting
          setEdges(prev => prev.map(edge => ({ ...edge, isActive: false })));
          await sleep(300);
        }
      }
    };

    await dfsRecursive(start);
  };

  const runAlgorithm = async () => {
    if (!startNode) {
      toast({ description: "Please select a start node", variant: "destructive" });
      return;
    }

    const startNodeObj = nodes.find(n => n.label === startNode);
    if (!startNodeObj) {
      toast({ description: "Start node not found", variant: "destructive" });
      return;
    }

    setIsRunning(true);

    try {
      switch (algorithm) {
        case "bfs":
          await runBFS(startNodeObj.id);
          break;
        case "dfs":
          await runDFS(startNodeObj.id);
          break;
        case "dijkstra":
          toast({ description: "Dijkstra's algorithm - coming soon!" });
          break;
      }
    } catch (error) {
      console.error("Algorithm error:", error);
    }

    setIsRunning(false);
  };

  const getNodeStyle = (node: GraphNode) => {
    let className = "absolute w-12 h-12 rounded-full border-2 flex items-center justify-center font-bold text-sm cursor-pointer transition-all duration-300";
    
    if (selectedNode === node.id) {
      className += " bg-accent border-accent-glow shadow-accent scale-110";
    } else if (node.isCurrently) {
      className += " bg-primary border-primary-glow shadow-neon animate-pulse scale-110";
    } else if (node.isVisited) {
      className += " bg-green-500 border-green-400 text-white";
    } else {
      className += " bg-card border-border/40 text-foreground hover:border-primary/40";
    }
    
    return className;
  };

  const algorithms = [
    { value: "bfs", label: "Breadth-First Search", complexity: "O(V + E)" },
    { value: "dfs", label: "Depth-First Search", complexity: "O(V + E)" },
    { value: "dijkstra", label: "Dijkstra's Algorithm", complexity: "O(V log V)" },
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
            <h1 className="text-3xl font-bold">Graph Algorithms</h1>
            <p className="text-muted-foreground">Visualize graph traversal and pathfinding algorithms</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Visualization Panel */}
          <div className="lg:col-span-3">
            <Card className="bg-gradient-card border-border/40">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Graph Visualization</CardTitle>
                  <div className="flex gap-2">
                    <Badge variant="outline" className="border-primary/20">
                      {nodes.length} nodes, {edges.length} edges
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="bg-code rounded-lg p-6 min-h-[400px] relative overflow-hidden">
                  {nodes.length === 0 ? (
                    <div className="flex items-center justify-center h-full">
                      <div className="text-center">
                        <p className="text-muted-foreground mb-4">No graph created yet</p>
                        <Button variant="neon" onClick={createSampleGraph}>
                          Load Sample Graph
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <svg className="absolute inset-0 w-full h-full pointer-events-none">
                      {/* Render edges */}
                      {edges.map((edge, index) => {
                        const fromNode = nodes.find(n => n.id === edge.from);
                        const toNode = nodes.find(n => n.id === edge.to);
                        if (!fromNode || !toNode) return null;

                        return (
                          <g key={index}>
                            <line
                              x1={fromNode.x}
                              y1={fromNode.y}
                              x2={toNode.x}
                              y2={toNode.y}
                              stroke={edge.isActive ? "hsl(var(--primary))" : "hsl(var(--border))"}
                              strokeWidth={edge.isActive ? "3" : "2"}
                              className="transition-all duration-300"
                            />
                            {edge.weight && (
                              <text
                                x={(fromNode.x + toNode.x) / 2}
                                y={(fromNode.y + toNode.y) / 2 - 10}
                                textAnchor="middle"
                                fill="hsl(var(--foreground))"
                                fontSize="12"
                                className="font-mono"
                              >
                                {edge.weight}
                              </text>
                            )}
                          </g>
                        );
                      })}
                    </svg>
                  )}

                  {/* Render nodes */}
                  {nodes.map(node => (
                    <div
                      key={node.id}
                      className={getNodeStyle(node)}
                      style={{
                        left: node.x - 24,
                        top: node.y - 24,
                      }}
                      onClick={() => setSelectedNode(selectedNode === node.id ? null : node.id)}
                    >
                      {node.label}
                    </div>
                  ))}

                  {selectedNode && (
                    <div className="absolute bottom-4 left-4">
                      <Badge variant="outline" className="border-accent/30">
                        Selected: Node {nodes.find(n => n.id === selectedNode)?.label}
                      </Badge>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Control Panel */}
          <div className="space-y-6">
            {/* Graph Construction */}
            <Card className="bg-gradient-card border-border/40">
              <CardHeader>
                <CardTitle className="text-lg">Build Graph</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-2">
                  <Button variant="accent" onClick={addNode} disabled={isRunning}>
                    <Plus className="w-4 h-4" />
                    Add Node
                  </Button>
                  <Button variant="code" onClick={addEdge} disabled={isRunning || !selectedNode}>
                    Add Edge
                  </Button>
                </div>

                {selectedNode && (
                  <Button 
                    variant="destructive" 
                    onClick={() => removeNode(selectedNode)}
                    disabled={isRunning}
                    className="w-full"
                  >
                    <Minus className="w-4 h-4" />
                    Remove Selected Node
                  </Button>
                )}

                <div className="grid grid-cols-2 gap-2">
                  <Button variant="control" onClick={createSampleGraph} disabled={isRunning}>
                    Sample Graph
                  </Button>
                  <Button variant="control" onClick={clearGraph} disabled={isRunning}>
                    <RotateCcw className="w-4 h-4" />
                    Clear
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Algorithm Controls */}
            <Card className="bg-gradient-card border-border/40">
              <CardHeader>
                <CardTitle className="text-lg">Algorithm</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Select value={algorithm} onValueChange={(value: Algorithm) => setAlgorithm(value)} disabled={isRunning}>
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

                <div className="space-y-2">
                  <Input
                    placeholder="Start node (e.g., 1)"
                    value={startNode}
                    onChange={(e) => setStartNode(e.target.value)}
                    disabled={isRunning}
                  />
                  {algorithm === "dijkstra" && (
                    <Input
                      placeholder="End node (e.g., 6)"
                      value={endNode}
                      onChange={(e) => setEndNode(e.target.value)}
                      disabled={isRunning}
                    />
                  )}
                </div>

                <Button
                  variant="neon"
                  onClick={runAlgorithm}
                  disabled={isRunning || nodes.length === 0}
                  className="w-full"
                >
                  {isRunning ? "Running..." : <><Play className="w-4 h-4" />Run {algorithm.toUpperCase()}</>}
                </Button>

                <Button
                  variant="control"
                  onClick={resetVisualization}
                  disabled={isRunning}
                  className="w-full"
                >
                  Reset Colors
                </Button>
              </CardContent>
            </Card>

            {/* Legend */}
            <Card className="bg-gradient-card border-border/40">
              <CardHeader>
                <CardTitle className="text-lg">Legend</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-card rounded-full border-2 border-border/40"></div>
                  <span className="text-sm">Unvisited Node</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-accent rounded-full border-2 border-accent-glow"></div>
                  <span className="text-sm">Selected Node</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-primary rounded-full border-2 border-primary-glow"></div>
                  <span className="text-sm">Currently Processing</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-green-500 rounded-full border-2 border-green-400"></div>
                  <span className="text-sm">Visited Node</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-4 h-1 bg-border rounded"></div>
                  <span className="text-sm">Edge</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GraphVisualization;