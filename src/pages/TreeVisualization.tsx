import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Plus, Minus, RotateCcw, Search } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { JSX } from "react/jsx-runtime";

interface TreeNode {
  value: number;
  left: TreeNode | null;
  right: TreeNode | null;
  x?: number;
  y?: number;
  id: string;
}

class BST {
  root: TreeNode | null = null;

  insert(value: number): void {
    this.root = this.insertNode(this.root, value);
  }

  private insertNode(node: TreeNode | null, value: number): TreeNode {
    if (node === null) {
      return {
        value,
        left: null,
        right: null,
        id: Math.random().toString(36).substr(2, 9)
      };
    }

    if (value < node.value) {
      node.left = this.insertNode(node.left, value);
    } else if (value > node.value) {
      node.right = this.insertNode(node.right, value);
    }

    return node;
  }

  search(value: number): boolean {
    return this.searchNode(this.root, value);
  }

  private searchNode(node: TreeNode | null, value: number): boolean {
    if (node === null) return false;
    if (node.value === value) return true;
    if (value < node.value) return this.searchNode(node.left, value);
    return this.searchNode(node.right, value);
  }

  delete(value: number): void {
    this.root = this.deleteNode(this.root, value);
  }

  private deleteNode(node: TreeNode | null, value: number): TreeNode | null {
    if (node === null) return null;

    if (value < node.value) {
      node.left = this.deleteNode(node.left, value);
    } else if (value > node.value) {
      node.right = this.deleteNode(node.right, value);
    } else {
      if (node.left === null) return node.right;
      if (node.right === null) return node.left;

      const minRight = this.findMin(node.right);
      node.value = minRight.value;
      node.right = this.deleteNode(node.right, minRight.value);
    }

    return node;
  }

  private findMin(node: TreeNode): TreeNode {
    while (node.left !== null) {
      node = node.left;
    }
    return node;
  }

  calculatePositions(): void {
    if (this.root) {
      this.assignPositions(this.root, 400, 80, 200);
    }
  }

  private assignPositions(node: TreeNode, x: number, y: number, offset: number): void {
    node.x = x;
    node.y = y;

    if (node.left) {
      this.assignPositions(node.left, x - offset, y + 80, offset / 2);
    }
    if (node.right) {
      this.assignPositions(node.right, x + offset, y + 80, offset / 2);
    }
  }
}

const TreeVisualization = () => {
  const [bst] = useState(new BST());
  const [tree, setTree] = useState<TreeNode | null>(null);
  const [newValue, setNewValue] = useState("");
  const [searchValue, setSearchValue] = useState("");
  const [highlightedNode, setHighlightedNode] = useState<string | null>(null);

  const updateTree = () => {
    bst.calculatePositions();
    setTree(bst.root ? { ...bst.root } : null);
  };

  const insertValue = () => {
    const value = parseInt(newValue);
    if (!isNaN(value)) {
      bst.insert(value);
      updateTree();
      setNewValue("");
      toast.success(`Inserted ${value} into the tree`);
    }
  };

  const deleteValue = () => {
    const value = parseInt(newValue);
    if (!isNaN(value)) {
      if (bst.search(value)) {
        bst.delete(value);
        updateTree();
        setNewValue("");
        toast.success(`Deleted ${value} from the tree`);
      } else {
        toast.error(`${value} not found in tree`);
      }
    }
  };

  const searchInTree = () => {
    const value = parseInt(searchValue);
    if (!isNaN(value)) {
      const found = bst.search(value);
      if (found) {
        // Find and highlight the node
        const findNodeId = (node: TreeNode | null): string | null => {
          if (!node) return null;
          if (node.value === value) return node.id;
          if (value < node.value) return findNodeId(node.left);
          return findNodeId(node.right);
        };
        
        const nodeId = findNodeId(tree);
        setHighlightedNode(nodeId);
        toast.success(`Found ${value} in the tree!`);
        
        setTimeout(() => setHighlightedNode(null), 2000);
      } else {
        toast.error(`${value} not found in tree`);
      }
    }
  };

  const resetTree = () => {
    bst.root = null;
    setTree(null);
    setHighlightedNode(null);
    toast.success("Tree reset");
  };

  const initSampleTree = () => {
    bst.root = null;
    [50, 30, 70, 20, 40, 60, 80].forEach(value => bst.insert(value));
    updateTree();
    toast.success("Sample tree loaded");
  };

  const renderNode = (node: TreeNode): JSX.Element => {
    const isHighlighted = highlightedNode === node.id;
    
    return (
      <g key={node.id}>
        {/* Left connection */}
        {node.left && (
          <line
            x1={node.x}
            y1={node.y}
            x2={node.left.x}
            y2={node.left.y}
            stroke="hsl(var(--border))"
            strokeWidth="2"
            className="opacity-60"
          />
        )}
        
        {/* Right connection */}
        {node.right && (
          <line
            x1={node.x}
            y1={node.y}
            x2={node.right.x}
            y2={node.right.y}
            stroke="hsl(var(--border))"
            strokeWidth="2"
            className="opacity-60"
          />
        )}
        
        {/* Node circle */}
        <circle
          cx={node.x}
          cy={node.y}
          r="25"
          fill={isHighlighted ? "hsl(var(--accent))" : "hsl(var(--primary))"}
          stroke={isHighlighted ? "hsl(var(--accent-glow))" : "hsl(var(--primary-glow))"}
          strokeWidth="2"
          className={`transition-all duration-300 ${isHighlighted ? 'animate-glow-pulse' : ''}`}
        />
        
        {/* Node value */}
        <text
          x={node.x}
          y={node.y + 6}
          textAnchor="middle"
          fill={isHighlighted ? "hsl(var(--accent-foreground))" : "hsl(var(--primary-foreground))"}
          fontSize="14"
          fontWeight="bold"
        >
          {node.value}
        </text>
        
        {/* Recursively render children */}
        {node.left && renderNode(node.left)}
        {node.right && renderNode(node.right)}
      </g>
    );
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
            <h1 className="text-3xl font-bold">Binary Search Tree</h1>
            <p className="text-muted-foreground">Interactive BST operations and visualization</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Visualization Panel */}
          <div className="lg:col-span-3">
            <Card className="bg-gradient-card border-border/40">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Binary Search Tree Structure</CardTitle>
                  <Badge variant="outline" className="border-primary/20">
                    {tree ? "Interactive" : "Empty"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="bg-code rounded-lg p-6 min-h-[400px] flex items-center justify-center">
                  {tree ? (
                    <svg width="800" height="400" className="overflow-visible">
                      {renderNode(tree)}
                    </svg>
                  ) : (
                    <div className="text-center">
                      <p className="text-muted-foreground mb-4">Tree is empty</p>
                      <Button variant="neon" onClick={initSampleTree}>
                        Load Sample Tree
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Control Panel */}
          <div className="space-y-6">
            {/* Tree Operations */}
            <Card className="bg-gradient-card border-border/40">
              <CardHeader>
                <CardTitle className="text-lg">Operations</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Input
                    type="number"
                    placeholder="Enter value"
                    value={newValue}
                    onChange={(e) => setNewValue(e.target.value)}
                  />
                  
                  <div className="grid grid-cols-2 gap-2">
                    <Button 
                      variant="accent" 
                      onClick={insertValue}
                      disabled={!newValue}
                      size="sm"
                    >
                      <Plus className="w-4 h-4" />
                      Insert
                    </Button>
                    <Button 
                      variant="destructive" 
                      onClick={deleteValue}
                      disabled={!newValue}
                      size="sm"
                    >
                      <Minus className="w-4 h-4" />
                      Delete
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Input
                    type="number"
                    placeholder="Search value"
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                  />
                  <Button
                    variant="code"
                    onClick={searchInTree}
                    disabled={!searchValue || !tree}
                    className="w-full"
                  >
                    <Search className="w-4 h-4" />
                    Search
                  </Button>
                </div>

                <Button 
                  variant="control" 
                  onClick={resetTree}
                  className="w-full"
                >
                  <RotateCcw className="w-4 h-4" />
                  Reset
                </Button>
              </CardContent>
            </Card>

            {/* Properties */}
            <Card className="bg-gradient-card border-border/40">
              <CardHeader>
                <CardTitle className="text-lg">BST Properties</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Left subtree:</span>
                  <span>Smaller values</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Right subtree:</span>
                  <span>Larger values</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Search time:</span>
                  <span>O(log n)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Insert time:</span>
                  <span>O(log n)</span>
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
                  <div className="w-4 h-4 bg-primary rounded-full border-2 border-primary-glow"></div>
                  <span className="text-sm">Tree Node</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-accent rounded-full border-2 border-accent-glow animate-pulse"></div>
                  <span className="text-sm">Found Node</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-4 h-1 bg-border rounded"></div>
                  <span className="text-sm">Parent-Child Link</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TreeVisualization;