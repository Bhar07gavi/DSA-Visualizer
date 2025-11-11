import type { GraphTheoryEntry } from "./types";

const intro: GraphTheoryEntry = {
  title: "Introduction to Graphs",
  intro:
    "A graph is a collection of nodes (vertices) connected by edges. It is used to represent relationships, networks, and connections between entities.",

  topics: [
    {
      heading: "Vertices (Nodes)",
      body: "These represent entities or points in the graph. Examples: cities, users, devices.",
    },
    {
      heading: "Edges (Links)",
      body: "Edges represent the connection or relationship between two nodes.",
    },
    {
      heading: "Undirected Graph",
      body: "Edges have no direction. A connection A—B means A is connected to B and also B to A.",
    },
    {
      heading: "Directed Graph (Digraph)",
      body: "Edges have direction. A → B means movement or dependency flows from A to B.",
    },
    {
      heading: "Weighted Graph",
      body: "Each edge has a cost or weight. Common in shortest-path problems.",
    },
    {
      heading: "Applications",
      body: `• Social networks  
• Roadmaps and navigation  
• Internet routing  
• Recommendations  
• Dependency resolution`,
    },
  ],
};

export default intro;
