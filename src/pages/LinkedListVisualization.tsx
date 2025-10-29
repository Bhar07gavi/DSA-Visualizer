import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Plus, Minus, RotateCcw, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "@/hooks/use-toast";

interface ListNode {
  value: number;
  next: ListNode | null;
  id: string;
}

class LinkedList {
  head: ListNode | null = null;
  size: number = 0;

  append(value: number): void {
    const newNode: ListNode = {
      value,
      next: null,
      id: Math.random().toString(36).substr(2, 9)
    };

    if (!this.head) {
      this.head = newNode;
    } else {
      let current = this.head;
      while (current.next) {
        current = current.next;
      }
      current.next = newNode;
    }
    this.size++;
  }

  prepend(value: number): void {
    const newNode: ListNode = {
      value,
      next: this.head,
      id: Math.random().toString(36).substr(2, 9)
    };
    this.head = newNode;
    this.size++;
  }

  delete(value: number): boolean {
    if (!this.head) return false;

    if (this.head.value === value) {
      this.head = this.head.next;
      this.size--;
      return true;
    }

    let current = this.head;
    while (current.next && current.next.value !== value) {
      current = current.next;
    }

    if (current.next) {
      current.next = current.next.next;
      this.size--;
      return true;
    }

    return false;
  }

  toArray(): ListNode[] {
    const result: ListNode[] = [];
    let current = this.head;
    while (current) {
      result.push(current);
      current = current.next;
    }
    return result;
  }

  clear(): void {
    this.head = null;
    this.size = 0;
  }
}

const LinkedListVisualization = () => {
  const [linkedList] = useState(new LinkedList());
  const [nodes, setNodes] = useState<ListNode[]>([]);
  const [newValue, setNewValue] = useState("");
  const [highlightedNode, setHighlightedNode] = useState<string | null>(null);

  const updateVisualization = () => {
    setNodes([...linkedList.toArray()]);
  };

  const handleAppend = () => {
    const value = parseInt(newValue);
    if (!isNaN(value)) {
      linkedList.append(value);
      updateVisualization();
      setNewValue("");
      toast({ description: `Added ${value} to the end of the list` });
    }
  };

  const handlePrepend = () => {
    const value = parseInt(newValue);
    if (!isNaN(value)) {
      linkedList.prepend(value);
      updateVisualization();
      setNewValue("");
      toast({ description: `Added ${value} to the beginning of the list` });
    }
  };

  const handleDelete = (value: number) => {
    if (linkedList.delete(value)) {
      updateVisualization();
      toast({ description: `Deleted ${value} from the list` });
    } else {
      toast({ description: `${value} not found in the list`, variant: "destructive" });
    }
  };

  const handleReset = () => {
    linkedList.clear();
    updateVisualization();
    setHighlightedNode(null);
    toast({ description: "List cleared" });
  };

  const initSampleList = () => {
    linkedList.clear();
    [1, 2, 3, 4, 5].forEach(value => linkedList.append(value));
    updateVisualization();
    toast({ description: "Sample list loaded" });
  };

  const highlightNode = (nodeId: string) => {
    setHighlightedNode(nodeId);
    setTimeout(() => setHighlightedNode(null), 2000);
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
            <h1 className="text-3xl font-bold">Linked List Visualization</h1>
            <p className="text-muted-foreground">Interactive singly linked list operations</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Visualization Panel */}
          <div className="lg:col-span-2">
            <Card className="bg-gradient-card border-border/40">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Linked List Structure</CardTitle>
                  <Badge variant="outline" className="border-primary/20">
                    Size: {linkedList.size}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="bg-code rounded-lg p-6 min-h-[300px] flex items-center justify-center overflow-x-auto">
                  {nodes.length > 0 ? (
                    <div className="flex items-center gap-4 min-w-max">
                      {/* HEAD Label */}
                      <div className="text-sm text-muted-foreground font-mono">HEAD</div>
                      <ArrowRight className="w-4 h-4 text-muted-foreground" />
                      
                      {nodes.map((node, index) => (
                        <div key={node.id} className="flex items-center gap-2">
                          {/* Node */}
                          <div 
                            className={`
                              flex items-center gap-2 p-4 rounded-lg border-2 transition-all duration-300 cursor-pointer
                              ${highlightedNode === node.id 
                                ? 'bg-primary border-primary-glow shadow-neon scale-105' 
                                : 'bg-card border-border/40 hover:border-primary/40'
                              }
                            `}
                            onClick={() => highlightNode(node.id)}
                          >
                            <div className={`
                              w-12 h-12 rounded-lg flex items-center justify-center font-bold text-lg
                              ${highlightedNode === node.id 
                                ? 'bg-primary-glow text-primary-foreground' 
                                : 'bg-secondary text-foreground'
                              }
                            `}>
                              {node.value}
                            </div>
                            <div className="w-8 h-8 flex items-center justify-center">
                              {node.next ? (
                                <div className="w-2 h-2 bg-accent rounded-full"></div>
                              ) : (
                                <div className="text-xs text-muted-foreground">NULL</div>
                              )}
                            </div>
                          </div>
                          
                          {/* Arrow to next node */}
                          {node.next && (
                            <ArrowRight className="w-6 h-6 text-accent flex-shrink-0" />
                          )}
                          
                          {/* Delete button */}
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDelete(node.value)}
                            className="opacity-0 group-hover:opacity-100 transition-opacity ml-2"
                          >
                            <Minus className="w-3 h-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center">
                      <p className="text-muted-foreground mb-4">List is empty</p>
                      <Button variant="neon" onClick={initSampleList}>
                        Load Sample List
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Control Panel */}
          <div className="space-y-6">
            {/* List Operations */}
            <Card className="bg-gradient-card border-border/40">
              <CardHeader>
                <CardTitle className="text-lg">List Operations</CardTitle>
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
                      onClick={handlePrepend}
                      disabled={!newValue}
                      size="sm"
                    >
                      <Plus className="w-4 h-4" />
                      Prepend
                    </Button>
                    <Button 
                      variant="code" 
                      onClick={handleAppend}
                      disabled={!newValue}
                      size="sm"
                    >
                      <Plus className="w-4 h-4" />
                      Append
                    </Button>
                  </div>
                </div>

                <Button 
                  variant="control" 
                  onClick={handleReset}
                  className="w-full"
                >
                  <RotateCcw className="w-4 h-4" />
                  Clear List
                </Button>
              </CardContent>
            </Card>

            {/* Properties */}
            <Card className="bg-gradient-card border-border/40">
              <CardHeader>
                <CardTitle className="text-lg">Properties</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Size:</span>
                  <span>{linkedList.size}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Access time:</span>
                  <span>O(n)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Insert time:</span>
                  <span>O(1)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Delete time:</span>
                  <span>O(n)</span>
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
                  <span className="text-sm">Node Value</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-accent rounded-full"></div>
                  <span className="text-sm">Next Pointer</span>
                </div>
                <div className="flex items-center gap-3">
                  <ArrowRight className="w-4 h-4 text-accent" />
                  <span className="text-sm">Connection</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LinkedListVisualization;