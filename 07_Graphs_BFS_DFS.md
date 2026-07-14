# 07 — Graphs: BFS, DFS, Shortest Path 🕸️

## 🧠 Core Idea
Graphs: nodes + edges. Master graph representation, DFS/BFS traversal, cycle detection, topological sort, and shortest path algorithms.

**Recognize when:** islands, connected components, shortest path, dependencies, cycle detection, bipartite

---

## 📐 Visual
```
Graph representations:
Adjacency List (sparse): adj[0]=[1,2], adj[1]=[3], adj[2]=[3]
Adjacency Matrix (dense): matrix[i][j]=1 if edge i→j

BFS: explore level by level (shortest path in unweighted)
DFS: go deep first, backtrack (cycle detection, topo sort)

4-directional grid: dr[]={0,0,1,-1}, dc[]={1,-1,0,0}
```

---

## ✅ Template 1: Graph Representation
```cpp
// Build adjacency list from edge list
int n; // number of nodes
vector<vector<int>> buildGraph(int n, vector<vector<int>>& edges) {
    vector<vector<int>> adj(n);             // adj[i] = list of neighbors
    for (auto& e : edges) {
        adj[e[0]].push_back(e[1]);          // directed edge
        adj[e[1]].push_back(e[0]);          // add this for undirected
    }
    return adj;
}

// Weighted graph
vector<vector<pair<int,int>>> buildWeighted(int n, vector<vector<int>>& edges) {
    vector<vector<pair<int,int>>> adj(n);   // adj[i] = {neighbor, weight}
    for (auto& e : edges) {
        adj[e[0]].push_back({e[1], e[2]}); // directed weighted
    }
    return adj;
}
```

## ✅ Template 2: DFS on Graph (Iterative & Recursive)
```cpp
// Recursive DFS
void dfs(int node, vector<vector<int>>& adj, vector<bool>& visited) {
    visited[node] = true;                   // mark before exploring
    for (int neighbor : adj[node]) {
        if (!visited[neighbor]) {           // only visit unvisited
            dfs(neighbor, adj, visited);
        }
    }
}

// Iterative DFS (stack)
void dfsIterative(int start, vector<vector<int>>& adj, int n) {
    vector<bool> visited(n, false);
    stack<int> st;
    st.push(start);
    while (!st.empty()) {
        int node = st.top(); st.pop();
        if (visited[node]) continue;        // skip if already visited
        visited[node] = true;
        for (int nb : adj[node]) {
            if (!visited[nb]) st.push(nb);
        }
    }
}

// Count connected components
int countComponents(int n, vector<vector<int>>& adj) {
    vector<bool> vis(n, false);
    int count = 0;
    for (int i=0; i<n; i++) {
        if (!vis[i]) {                      // unvisited node = new component
            dfs(i, adj, vis);
            count++;
        }
    }
    return count;
}
```

## ✅ Template 3: BFS on Graph
```cpp
vector<int> bfs(int start, vector<vector<int>>& adj, int n) {
    vector<int> dist(n, -1);               // -1 = not visited
    queue<int> q;
    q.push(start);
    dist[start] = 0;                       // source distance = 0
    
    while (!q.empty()) {
        int node = q.front(); q.pop();
        for (int nb : adj[node]) {
            if (dist[nb] == -1) {          // not visited
                dist[nb] = dist[node] + 1; // distance = parent dist + 1
                q.push(nb);
            }
        }
    }
    return dist;                           // shortest distances from start
} // O(V+E) time
```

## ✅ Template 4: Grid BFS/DFS (Number of Islands)
```cpp
int numIslands(vector<vector<char>>& grid) {
    int m=grid.size(), n=grid[0].size(), islands=0;
    int dr[]={0,0,1,-1};                   // 4 directions: right,left,down,up
    int dc[]={1,-1,0,0};
    
    for (int r=0; r<m; r++) {
        for (int c=0; c<n; c++) {
            if (grid[r][c] == '1') {       // found unvisited land
                islands++;
                // BFS to mark entire island
                queue<pair<int,int>> q;
                q.push({r,c});
                grid[r][c] = '0';          // mark visited (in-place)
                while (!q.empty()) {
                    auto [row,col] = q.front(); q.pop();
                    for (int d=0; d<4; d++) {
                        int nr=row+dr[d], nc=col+dc[d];
                        if (nr>=0&&nr<m&&nc>=0&&nc<n&&grid[nr][nc]=='1') {
                            grid[nr][nc]='0'; // mark before pushing (avoid dupes)
                            q.push({nr,nc});
                        }
                    }
                }
            }
        }
    }
    return islands;
} // O(m*n) time, O(min(m,n)) space (BFS queue)
```

## ✅ Template 5: Topological Sort (BFS/Kahn's Algorithm)
```cpp
vector<int> topoSort(int n, vector<vector<int>>& adj) {
    vector<int> indegree(n, 0);            // count incoming edges
    for (int u=0; u<n; u++)
        for (int v : adj[u]) indegree[v]++;
    
    queue<int> q;
    for (int i=0; i<n; i++)
        if (indegree[i]==0) q.push(i);    // nodes with no dependencies first
    
    vector<int> order;
    while (!q.empty()) {
        int u = q.front(); q.pop();
        order.push_back(u);
        for (int v : adj[u]) {
            if (--indegree[v] == 0)        // remove edge: decrease indegree
                q.push(v);                 // now v has no dependencies → add to queue
        }
    }
    return order.size()==n ? order : vector<int>{}; // empty if cycle exists
} // O(V+E) time
```

## ✅ Template 6: Topological Sort (DFS)
```cpp
void dfsTopoSort(int u, vector<vector<int>>& adj, vector<int>& state, stack<int>& st) {
    state[u] = 1;                          // 0=unvisited, 1=visiting, 2=done
    for (int v : adj[u]) {
        if (state[v]==1) { /* cycle! */ return; }
        if (state[v]==0) dfsTopoSort(v, adj, state, st);
    }
    state[u] = 2;                          // fully processed
    st.push(u);                            // push after all neighbors done
}
vector<int> topoSortDFS(int n, vector<vector<int>>& adj) {
    vector<int> state(n, 0);
    stack<int> st;
    for (int i=0; i<n; i++)
        if (state[i]==0) dfsTopoSort(i, adj, state, st);
    vector<int> order;
    while (!st.empty()) { order.push_back(st.top()); st.pop(); }
    return order;
}
```

## ✅ Template 7: Dijkstra's Algorithm (Weighted Shortest Path)
```cpp
vector<int> dijkstra(int src, int n, vector<vector<pair<int,int>>>& adj) {
    vector<int> dist(n, INT_MAX);
    priority_queue<pair<int,int>, vector<pair<int,int>>, greater<>> pq; // min-heap
    dist[src] = 0;
    pq.push({0, src});                     // {distance, node}
    
    while (!pq.empty()) {
        auto [d, u] = pq.top(); pq.pop();
        if (d > dist[u]) continue;         // stale entry → skip
        
        for (auto [v, w] : adj[u]) {       // explore neighbors
            if (dist[u] + w < dist[v]) {   // found shorter path
                dist[v] = dist[u] + w;
                pq.push({dist[v], v});     // push updated distance
            }
        }
    }
    return dist;
} // O((V+E) log V) time, O(V+E) space
```

## ✅ Template 8: Bellman-Ford (Negative Weights)
```cpp
vector<int> bellmanFord(int src, int n, vector<vector<int>>& edges) {
    vector<int> dist(n, INT_MAX);
    dist[src] = 0;
    
    // Relax all edges n-1 times
    for (int i=0; i<n-1; i++) {
        for (auto& e : edges) {            // e = {u, v, weight}
            int u=e[0], v=e[1], w=e[2];
            if (dist[u]!=INT_MAX && dist[u]+w < dist[v]) {
                dist[v] = dist[u]+w;       // relax edge
            }
        }
    }
    // nth iteration: if any relaxation → negative cycle
    for (auto& e : edges) {
        if (dist[e[0]]!=INT_MAX && dist[e[0]]+e[2] < dist[e[1]])
            return {};                     // negative cycle detected
    }
    return dist;
} // O(V*E) time
```

## ✅ Template 9: Floyd-Warshall (All Pairs Shortest Path)
```cpp
void floydWarshall(vector<vector<int>>& dist, int n) {
    // dist[i][j] = initial edge weight (INF if no edge)
    for (int k=0; k<n; k++) {             // intermediate node
        for (int i=0; i<n; i++) {
            for (int j=0; j<n; j++) {
                if (dist[i][k]!=INT_MAX && dist[k][j]!=INT_MAX)
                    dist[i][j] = min(dist[i][j], dist[i][k]+dist[k][j]); // via k
            }
        }
    }
} // O(V³) time, O(V²) space
```

## ✅ Template 10: Cycle Detection in Directed Graph
```cpp
bool hasCycleDFS(int u, vector<vector<int>>& adj, vector<int>& state) {
    state[u] = 1;                          // currently in recursion stack
    for (int v : adj[u]) {
        if (state[v]==1) return true;      // back edge → cycle
        if (state[v]==0 && hasCycleDFS(v, adj, state)) return true;
    }
    state[u] = 2;                          // done, no cycle through u
    return false;
}
bool detectCycle(int n, vector<vector<int>>& adj) {
    vector<int> state(n, 0);
    for (int i=0; i<n; i++)
        if (state[i]==0 && hasCycleDFS(i, adj, state)) return true;
    return false;
}
```

---

## 📊 Complexity Table
| Algorithm | Time | Space | Use Case |
|-----------|------|-------|----------|
| DFS/BFS | O(V+E) | O(V) | Traversal, components |
| Topo Sort (Kahn's) | O(V+E) | O(V) | Scheduling, DAG |
| Dijkstra | O((V+E)logV) | O(V) | Weighted shortest path |
| Bellman-Ford | O(VE) | O(V) | Negative weights |
| Floyd-Warshall | O(V³) | O(V²) | All-pairs shortest |

---

## 🔥 Progressive Problems
### 🟢 Easy
1. LC 997 — Find Town Judge (indegree/outdegree)
2. LC 1971 — Find if Path Exists in Graph (DFS/BFS/Union-Find)
3. LC 733 — Flood Fill (grid DFS, Template 4 variant)

### 🟡 Medium
4. LC 200 — Number of Islands (Template 4)
5. LC 207 — Course Schedule (cycle detection, Template 10)
6. LC 210 — Course Schedule II (topological sort, Template 5)
7. LC 417 — Pacific Atlantic Water Flow (BFS from both oceans)
8. LC 130 — Surrounded Regions (BFS from border)
9. LC 994 — Rotting Oranges (multi-source BFS with time)
10. LC 695 — Max Area of Island (DFS, return area)
11. LC 684 — Redundant Connection (Union-Find, see file 13)
12. LC 133 — Clone Graph (DFS with hash map)

### 🔴 Hard
13. LC 743 — Network Delay Time (Dijkstra, Template 7)
14. LC 787 — Cheapest Flights within K Stops (Bellman-Ford variant)
15. LC 127 — Word Ladder (BFS, words as graph nodes)
16. LC 269 — Alien Dictionary (topological sort from string constraints)
17. LC 1192 — Critical Connections (Tarjan's bridge algorithm)

---

## 💡 Key Problem Walkthroughs

### LC 994 — Rotting Oranges (Multi-source BFS)
```cpp
int orangesRotting(vector<vector<int>>& grid) {
    int m=grid.size(), n=grid[0].size(), fresh=0, time=0;
    queue<pair<int,int>> q;
    int dr[]={0,0,1,-1}, dc[]={1,-1,0,0};
    
    for (int r=0; r<m; r++) for (int c=0; c<n; c++) {
        if (grid[r][c]==2) q.push({r,c}); // all rotten oranges = sources
        if (grid[r][c]==1) fresh++;        // count fresh
    }
    while (!q.empty() && fresh>0) {
        int sz=q.size(); time++;           // one minute passes
        while (sz--) {
            auto [r,c]=q.front(); q.pop();
            for (int d=0; d<4; d++) {
                int nr=r+dr[d], nc=c+dc[d];
                if (nr>=0&&nr<m&&nc>=0&&nc<n&&grid[nr][nc]==1) {
                    grid[nr][nc]=2; fresh--; q.push({nr,nc});
                }
            }
        }
    }
    return fresh==0 ? time : -1;          // if fresh remains → impossible
}
```

### LC 127 — Word Ladder (BFS on word graph)
```cpp
int ladderLength(string begin, string end, vector<string>& wordList) {
    unordered_set<string> wordSet(wordList.begin(), wordList.end());
    if (!wordSet.count(end)) return 0;
    queue<string> q;
    q.push(begin); wordSet.erase(begin);
    int steps=1;
    while (!q.empty()) {
        int sz=q.size(); steps++;
        while (sz--) {
            string word=q.front(); q.pop();
            for (int i=0; i<(int)word.size(); i++) {
                char orig=word[i];
                for (char c='a'; c<='z'; c++) {  // try all 26 letters at position i
                    word[i]=c;
                    if (word==end) return steps;
                    if (wordSet.count(word)) { wordSet.erase(word); q.push(word); }
                }
                word[i]=orig;                      // restore
            }
        }
    }
    return 0;
}
```

---

## ⚠️ Common Mistakes
```
❌ Not marking visited BEFORE pushing to BFS queue
   Fix: mark visited when enqueuing, not when dequeuing (prevents duplicates)

❌ Dijkstra with negative weights → wrong answer
   Fix: use Bellman-Ford for negative weights

❌ Topo sort: not detecting cycles (returning partial order)
   Fix: check if result size == n (fewer = cycle)

❌ Grid BFS: going out of bounds
   Fix: always check 0<=nr<m && 0<=nc<n

❌ DFS cycle detection in undirected: treating parent as cycle
   Fix: pass parent to DFS, skip neighbor if it's the parent
```

## 🎓 Interview Tips
- **BFS = shortest path** in unweighted graphs
- **Dijkstra = shortest path** in weighted (non-negative) graphs  
- **Multi-source BFS**: push ALL sources first, then BFS → finds nearest source
- **Grid = implicit graph**: no need to build adj list, use direction arrays
- **Topo sort**: course schedule = prerequisite graph, use Kahn's (BFS) for cycle detection
- **State = (node, extra_info)**: e.g., (city, stops_remaining) for K-stops problems

---
*Next → [08_Heaps_PriorityQueue.md](./08_Heaps_PriorityQueue.md)*
