# 18 — 🎯 Interview Master Sheet
> **The final boss: Pattern recognition in < 2 minutes**

---

## ⚡ INSTANT PATTERN RECOGNITION

### Step 1: What kind of data?
```
Array/String     → Two Pointers, Sliding Window, Binary Search, DP
Linked List      → Slow-Fast Pointer, Reversal, Dummy Node
Tree             → DFS (pre/in/post), BFS (level order)
Graph            → BFS/DFS, Topo Sort, Dijkstra
Stack            → Monotonic Stack, Parentheses
Heap             → Top-K, Median
String           → Hashing, Sliding Window, KMP, Trie
Numbers          → Bit Manipulation, Math
```

### Step 2: What's the goal?
```
Find a PAIR/TRIPLE with target     → Two Pointers (if sorted) / HashMap
Find SUBARRAY with constraint      → Sliding Window
Find POSITION in sorted            → Binary Search
ALL combinations/permutations      → Backtracking
MIN/MAX with choices               → DP or Greedy
SHORTEST path unweighted           → BFS
SHORTEST path weighted             → Dijkstra
COUNT ways to reach                → DP
CONNECTED components               → DSU / BFS / DFS
PREFIX operations with updates     → BIT / Segment Tree
```

---

## 🗺️ DECISION FLOWCHART

```
Is input SORTED?
├── YES → Two Pointers or Binary Search
│         "find element" → Binary Search
│         "find pair" → Two Pointers
└── NO  → Can we sort it? Cost matters?
          If sorting is OK → Sort first, then above
          If can't sort → HashMap / Sliding Window

Is it a SUBARRAY/SUBSTRING problem?
├── Fixed size k    → Fixed Sliding Window
├── Constraint (≤k, sum=X) → Variable Sliding Window
└── Exactly k      → atMost(k) - atMost(k-1)

Is it a TREE/GRAPH problem?
├── Find path/cycle/order    → DFS
├── Shortest/level-by-level  → BFS
├── BST operations           → Use BST property
└── Connected components     → DSU or BFS/DFS

Does it ask for ALL solutions?
└── YES → Backtracking (with pruning)

Does it ask for OPTIMAL (min/max/count)?
├── Overlapping subproblems? → DP
├── Greedy choice property?  → Greedy
└── Try DP first if unsure

Top K / Kth element?
└── YES → Heap (min heap of size K for largest)
```

---

## 📋 COMPLEXITY CHEAT SHEET

| Algorithm | Time | Space |
|-----------|------|-------|
| Sorting | O(n log n) | O(1) to O(n) |
| Binary Search | O(log n) | O(1) |
| Two Pointers | O(n) | O(1) |
| Sliding Window | O(n) | O(k) |
| BFS/DFS | O(V+E) | O(V) |
| Dijkstra | O((V+E)log V) | O(V) |
| Heap push/pop | O(log n) | O(n) |
| DP (1D) | O(n) | O(n)→O(1) |
| DP (2D) | O(m×n) | O(m×n)→O(n) |
| Backtracking | O(k^n) or O(n!) | O(n) |
| Trie | O(L) per op | O(N×L) |
| DSU (per op) | O(α(n)) ≈ O(1) | O(n) |

---

## 🔑 30 MUST-KNOW PATTERNS (Quick Reference)

| # | Pattern | Key Code Snippet |
|---|---------|-----------------|
| 1 | Two Sum (sorted) | `while(l<r): l++ or r--` |
| 2 | Three Sum | `sort + fix i + two ptr` |
| 3 | Sliding Window fixed | `sum+=arr[i]-arr[i-k]` |
| 4 | Sliding Window variable | `expand r, shrink l while violated` |
| 5 | Binary Search | `mid=l+(r-l)/2` |
| 6 | BS on Answer | `lo=min,hi=max; check feasibility(mid)` |
| 7 | Linked List cycle | `slow=slow->next; fast=fast->next->next` |
| 8 | Reverse linked list | `next=curr->next; curr->next=prev; prev=curr; curr=next` |
| 9 | Tree DFS | `dfs(left); dfs(right); process(root)` |
| 10 | Tree BFS | `queue; while(!empty): level loop` |
| 11 | LCA | `if(!root||root==p||root==q) return root` |
| 12 | Monotonic Stack (NGE) | `while(!st.empty()&&nums[i]>top): result[top]=nums[i]` |
| 13 | Histogram largest rect | `mono stack; width=st.empty()?i:i-top-1` |
| 14 | Graph BFS shortest | `dist[start]=0; push start; expand neighbors` |
| 15 | Topo Sort (Kahn's) | `indegree; push 0-indegree; process + decrease` |
| 16 | Dijkstra | `min-heap {dist,node}; relax if better` |
| 17 | Heap top-K | `min heap size K; pop if size>K` |
| 18 | Two heap median | `maxHeap(lower) + minHeap(upper); rebalance` |
| 19 | Backtrack template | `choose; explore; unchoose` |
| 20 | Subsets bitmask | `for mask in 0..2^n: extract bits` |
| 21 | 0/1 Knapsack | `for j=W..wt[i]: dp[j]=max(dp[j],dp[j-w]+v)` |
| 22 | Coin Change | `for j=coin..amount: dp[j]+=dp[j-coin]` |
| 23 | LCS | `if(match): dp[i][j]=dp[i-1][j-1]+1; else: max(skip either)` |
| 24 | LIS O(n log n) | `lower_bound in tails; replace or extend` |
| 25 | Greedy intervals | `sort by end; take if no overlap` |
| 26 | DSU | `find(path compress) + unite(rank)` |
| 27 | Trie | `TrieNode*children[26]; insert char by char` |
| 28 | BIT | `update: i+=i&(-i); query: i-=i&(-i)` |
| 29 | XOR single number | `result ^= all numbers` |
| 30 | KMP | `build lps; match with fallback via lps` |

---

## 💊 INTERVIEW SURVIVAL TIPS

### When stuck (in order):
1. **Brute force first** → articulate it, then optimize
2. **Draw examples** → at least 2-3 test cases
3. **Think about sorted version** → does sorting help?
4. **Think about hash map** → can we trade space for time?
5. **Recognize subproblem** → can we break into smaller same problems?
6. **Check for greedy** → is local optimal = global optimal?
7. **Try DP** → does it have overlapping subproblems?

### Time management:
```
0-5 min:   Understand + clarify + examples
5-10 min:  Brute force + identify pattern
10-30 min: Optimal solution + code
30-40 min: Test + edge cases + complexity
40-45 min: Questions for interviewer
```

### Things to always say:
- "Let me start with a brute force approach..."
- "I notice this is sorted, so I can use binary search / two pointers..."
- "The time complexity is O(...) because..."
- "Edge cases I should handle: empty input, single element, duplicates, overflow..."

---

## 🧪 EDGE CASES CHECKLIST

```
□ Empty array/string/tree
□ Single element
□ All same elements
□ Negative numbers
□ Integer overflow (use long long)
□ Circular arrays (mod by n)
□ Disconnected graphs
□ Tree is a line (skewed)
□ k > array size
□ Target not in array (BS: return -1 or insertion point?)
□ Duplicate elements (handle in 3Sum, combinations, etc.)
```

---

## 🔥 TOP 50 MUST-SOLVE PROBLEMS (Curated)

### Arrays & Two Pointers
- LC 1 — Two Sum | LC 15 — 3Sum | LC 11 — Container Water | LC 42 — Trapping Rain

### Sliding Window
- LC 3 — Longest No-Repeat | LC 76 — Min Window | LC 239 — Sliding Window Max

### Binary Search
- LC 33 — Rotated Search | LC 875 — Koko | LC 4 — Median Two Arrays

### Linked List
- LC 206 — Reverse | LC 141 — Cycle | LC 23 — Merge K Lists | LC 25 — K-Group Reverse

### Stack/Queue
- LC 20 — Parentheses | LC 84 — Histogram | LC 739 — Daily Temps

### Trees
- LC 104 — Max Depth | LC 236 — LCA | LC 102 — Level Order | LC 124 — Max Path Sum | LC 297 — Serialize

### Graphs
- LC 200 — Islands | LC 207 — Course Schedule | LC 743 — Network Delay | LC 127 — Word Ladder

### Heaps
- LC 215 — Kth Largest | LC 295 — Median Stream | LC 347 — Top K Frequent

### Backtracking
- LC 46 — Permutations | LC 78 — Subsets | LC 39 — Combination Sum | LC 51 — N-Queens

### Dynamic Programming
- LC 70 — Stairs | LC 198 — House Robber | LC 300 — LIS | LC 322 — Coin Change
- LC 1143 — LCS | LC 72 — Edit Distance | LC 312 — Burst Balloons | LC 10 — Regex Match

### Greedy
- LC 55 — Jump Game | LC 435 — Non-overlap Intervals | LC 134 — Gas Station

### Tries & DSU
- LC 208 — Trie | LC 212 — Word Search II | LC 684 — Redundant Connection

### Bit Manipulation
- LC 136 — Single Number | LC 338 — Counting Bits | LC 191 — Hamming Weight

---

## 📈 DIFFICULTY PROGRESSION GUIDE

```
MONTH 1: Master foundations
  Week 1: Arrays, Two Pointers (LC 1,15,11,42,283)
  Week 2: Sliding Window, Binary Search (LC 3,76,33,875)
  Week 3: Linked List, Stack (LC 206,141,23,84,739)
  Week 4: Trees BFS/DFS (LC 104,226,102,124,236)

MONTH 2: Intermediate patterns
  Week 5: Graphs (LC 200,207,210,743)
  Week 6: Heaps (LC 215,295,347)
  Week 7: Backtracking (LC 46,78,39,51)
  Week 8: DP 1D+2D (LC 70,198,300,322,518)

MONTH 3: Advanced + polish
  Week 9:  DP hard (LC 1143,72,312,10)
  Week 10: Greedy, Tries, DSU
  Week 11: Bit manipulation, Math, Strings
  Week 12: Mock interviews, timed sessions, weak areas
```

---

## 🏆 C++ STL QUICK REFERENCE

```cpp
// Containers
vector<int> v;          v.push_back(x); v.pop_back(); v[i]; v.size();
stack<int> st;          st.push(x); st.top(); st.pop(); st.empty();
queue<int> q;           q.push(x); q.front(); q.pop(); q.empty();
deque<int> dq;          dq.push_front/back(); dq.pop_front/back(); dq.front/back();
priority_queue<int> pq; // max heap by default
priority_queue<int,vector<int>,greater<int>> pq2; // min heap
unordered_map<int,int> mp; mp[k]=v; mp.count(k); mp.erase(k);
unordered_set<int> st;  st.insert(x); st.count(x); st.erase(x);
set<int> s;             s.insert(x); s.begin(); *s.begin(); s.lower_bound(x);

// Algorithms
sort(v.begin(),v.end());                          // O(n log n)
sort(v.begin(),v.end(),greater<int>());           // reverse sort
sort(v.begin(),v.end(),[](int a,int b){return a>b;}); // custom
binary_search(v.begin(),v.end(),x);               // O(log n), needs sorted
lower_bound(v.begin(),v.end(),x);                 // first element >= x
upper_bound(v.begin(),v.end(),x);                 // first element > x
max_element(v.begin(),v.end());                   // returns iterator
accumulate(v.begin(),v.end(),0);                  // sum, from <numeric>
reverse(v.begin(),v.end());
fill(v.begin(),v.end(),0);
iota(v.begin(),v.end(),0);                        // fill 0,1,2,...
__gcd(a,b);                                       // GCD
__builtin_popcount(x);                            // count set bits
```

---

## 🧠 MENTAL MODELS (What to Think, Not Just Do)

```
Two Pointers:   "I need O(n) on sorted data. Eliminate impossible states."
Sliding Window: "I need optimal contiguous subarray. Maintain valid window."
Binary Search:  "The answer space is monotonic. Bisect on feasibility."
DP:             "This problem has overlapping subproblems. Cache + recurse."
Greedy:         "The locally optimal is globally optimal. Prove by exchange."
Backtracking:   "I need ALL valid states. DFS with undo."
BFS:            "Level-by-level = shortest path in unweighted."
Dijkstra:       "Greedily process nearest unvisited node."
Monotonic Stack:"Each element pushed/popped once. Next greater in O(n)."
DSU:            "Group management. Merge + find in near-O(1)."
```

---

> 🎯 **Final Rule**: If you can explain WHY a pattern works (not just WHAT it does), you've truly mastered it. The repetition you're looking for is recognizing the same structure in different disguises.

---
*🔙 Back to [Index](./00_INDEX.md)*
