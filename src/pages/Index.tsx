import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { 
  Database, 
  Link2, 
  Layers3, 
  GitBranch, 
  ArrowUpDown, 
  Search, 
  Binary, 
  Network,
  Code2,
  Zap
} from "lucide-react";

const topics = [
  {
    id: "arrays",
    title: "Arrays",
    description: "Visualize array operations, indexing, and manipulations",
    icon: Database,
    difficulty: "Beginner",
    algorithms: ["Linear Search", "Binary Search", "Insertion", "Deletion"],
    color: "from-blue-500 to-cyan-500"
  },
  {
    id: "linked-lists", 
    title: "Linked Lists",
    description: "Explore singly, doubly, and circular linked lists",
    icon: Link2,
    difficulty: "Beginner",
    algorithms: ["Insertion", "Deletion", "Traversal", "Reversal"],
    color: "from-cyan-500 to-teal-500"
  },
  {
    id: "stacks-queues",
    title: "Stacks & Queues",
    description: "Understand LIFO and FIFO data structures",
    icon: Layers3,
    difficulty: "Beginner", 
    algorithms: ["Push/Pop", "Enqueue/Dequeue", "Peek", "Implementation"],
    color: "from-teal-500 to-green-500"
  },
  {
    id: "sorting",
    title: "Sorting Algorithms", 
    description: "Watch sorting algorithms in action with step-by-step visualization",
    icon: ArrowUpDown,
    difficulty: "Intermediate",
    algorithms: ["Bubble Sort", "Quick Sort", "Merge Sort", "Heap Sort"],
    color: "from-green-500 to-yellow-500"
  },
  {
    id: "searching",
    title: "Search Algorithms",
    description: "Master linear and binary search techniques",
    icon: Search,
    difficulty: "Intermediate", 
    algorithms: ["Linear Search", "Binary Search", "Jump Search", "Interpolation"],
    color: "from-yellow-500 to-orange-500"
  },
  {
    id: "trees",
    title: "Trees",
    description: "Explore binary trees, BST, AVL, and tree traversals",
    icon: Binary,
    difficulty: "Advanced",
    algorithms: ["Insertion", "Deletion", "Traversal", "Balancing"],
    color: "from-orange-500 to-red-500"
  },
  {
    id: "graphs",
    title: "Graphs", 
    description: "Visualize graph algorithms and pathfinding",
    icon: Network,
    difficulty: "Advanced",
    algorithms: ["DFS", "BFS", "Dijkstra", "A* Search"],
    color: "from-red-500 to-pink-500"
  }
];

const getDifficultyColor = (difficulty: string) => {
  switch (difficulty) {
    case "Beginner": return "bg-green-500/20 text-green-400 border-green-500/30";
    case "Intermediate": return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
    case "Advanced": return "bg-red-500/20 text-red-400 border-red-500/30";
    default: return "bg-gray-500/20 text-gray-400 border-gray-500/30";
  }
};

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/40 bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-primary rounded-lg">
                <Code2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                  DSA Visualizer
                </h1>
                <p className="text-sm text-muted-foreground">Interactive Algorithm Learning</p>
              </div>
            </div>
            <Button variant="neon" size="sm">
              <Zap className="w-4 h-4" />
              Get Started
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto text-center max-w-4xl">
          <div className="animate-fade-in">
            <h2 className="text-5xl font-bold mb-6 leading-tight">
              Master Data Structures &{" "}
              <span className="bg-gradient-primary bg-clip-text text-transparent">
                Algorithms
              </span>
            </h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Visualize, learn, and master computer science fundamentals through interactive animations and step-by-step explanations.
            </p>
            <div className="flex gap-4 justify-center">
              <Button variant="neon" size="lg" className="animate-glow-pulse">
                Start Learning
              </Button>
              <Button variant="outline" size="lg">
                View Documentation
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Topics Grid */}
      <section className="py-20 px-6">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h3 className="text-3xl font-bold mb-4">Explore Topics</h3>
            <p className="text-lg text-muted-foreground">
              Choose a data structure or algorithm to start visualizing
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {topics.map((topic, index) => (
              <Card 
                key={topic.id} 
                className={`group hover:shadow-card border-border/40 bg-gradient-card hover:border-primary/20 transition-all duration-300 animate-slide-up`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className={`p-3 rounded-lg bg-gradient-to-r ${topic.color} mb-4`}>
                      <topic.icon className="w-6 h-6 text-white" />
                    </div>
                    <Badge 
                      variant="outline" 
                      className={`border ${getDifficultyColor(topic.difficulty)}`}
                    >
                      {topic.difficulty}
                    </Badge>
                  </div>
                  <CardTitle className="text-xl group-hover:text-primary transition-colors">
                    {topic.title}
                  </CardTitle>
                  <CardDescription className="text-muted-foreground">
                    {topic.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="mb-4">
                    <p className="text-sm font-medium text-foreground mb-2">Key Algorithms:</p>
                    <div className="flex flex-wrap gap-1">
                      {topic.algorithms.map((algo) => (
                        <Badge key={algo} variant="secondary" className="text-xs">
                          {algo}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <Button 
                    asChild 
                    variant="code" 
                    className="w-full group-hover:shadow-neon"
                  >
                    <Link to={`/${topic.id}`}>
                      Explore {topic.title}
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/40 bg-card/30 py-12">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-3 mb-4 md:mb-0">
              <div className="p-2 bg-gradient-primary rounded-lg">
                <Code2 className="w-5 h-5 text-white" />
              </div>
              <span className="font-semibold">DSA Visualizer</span>
            </div>
            <p className="text-sm text-muted-foreground text-center md:text-right">
              Interactive learning platform for computer science fundamentals
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;