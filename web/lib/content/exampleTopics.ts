/**
 * Curated, hand-authored on-ramp topics (HOME-02 / HOME-21) — deliberately
 * NOT personalized or generated: a fixed, cheap, honestly-labeled list, never
 * a per-load model call. Shared by the Welcome screen's "Or start from an
 * example" row and the Dashboard's "Learn next" row so both stay in sync.
 */
export interface ExampleTopic {
  emoji: string;
  bg: string;
  title: string;
  meta: string;
  level: string;
}

export const EXAMPLE_TOPICS: readonly ExampleTopic[] = [
  { emoji: "🧭", bg: "#efe9ff", title: "Dijkstra's algorithm", meta: "Algorithms · beginner", level: "New to graph algorithms; comfortable with basic data structures." },
  { emoji: "🌳", bg: "#e9f7ef", title: "Merkle trees", meta: "Cryptography · intermediate", level: "Comfortable with hashing; new to tree structures and cryptographic proofs." },
  { emoji: "🔍", bg: "#e2ecfb", title: "Binary search", meta: "Algorithms · beginner", level: "Know arrays and loops; new to divide-and-conquer thinking." },
  { emoji: "🌲", bg: "#fdf0e3", title: "Red-black trees", meta: "Data structures · intermediate", level: "Comfortable with binary search trees; new to self-balancing structures." },
  { emoji: "🫧", bg: "#e2f6f7", title: "Bloom filters", meta: "Data structures · beginner", level: "Comfortable with hashing; new to probabilistic data structures." },
  { emoji: "🔗", bg: "#fbe9f0", title: "Consistent hashing", meta: "Systems · intermediate", level: "Comfortable with hashing; new to distributed-systems load balancing." },
];
