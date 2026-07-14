# 13 — Union-Find (DSU) 🔗

## 🧠 Core Idea
Disjoint Set Union tracks connected components. With path compression + union by rank: nearly O(1) per operation (amortized O(α(n)) ≈ O(1)).

**Recognize when:** connected components, detect cycle in undirected graph, redundant connection, number of provinces, Kruskal's MST

---

## ✅ Template (Full DSU with Rank + Path Compression)
```cpp
class DSU {
    vector<int> parent, rank_;
public:
    DSU(int n) : parent(n), rank_(n, 0) {
        iota(parent.begin(), parent.end(), 0); // parent[i] = i initially
    }
    
    int find(int x) {
        if (parent[x] != x)                // not root → recursively find root
            parent[x] = find(parent[x]);   // PATH COMPRESSION: point directly to root
        return parent[x];
    }
    
    bool unite(int x, int y) {
        int rx=find(x), ry=find(y);        // find roots of both sets
        if (rx == ry) return false;         // already in same set → would create cycle
        if (rank_[rx] < rank_[ry]) swap(rx, ry); // UNION BY RANK: attach smaller to larger
        parent[ry] = rx;                   // make rx the root of merged set
        if (rank_[rx] == rank_[ry]) rank_[rx]++; // increase rank if equal
        return true;                       // successfully united
    }
    
    bool connected(int x, int y) { return find(x) == find(y); }
};
// O(α(n)) per operation ≈ O(1) amortized
```

## ✅ Application 1: Number of Connected Components
```cpp
int countComponents(int n, vector<vector<int>>& edges) {
    DSU dsu(n);
    int components = n;                    // start: each node is its own component
    for (auto& e : edges) {
        if (dsu.unite(e[0], e[1]))         // united two different components
            components--;                  // one less component
    }
    return components;
}
```

## ✅ Application 2: Redundant Connection (Detect Cycle)
```cpp
vector<int> findRedundantConnection(vector<vector<int>>& edges) {
    DSU dsu(edges.size()+1);              // nodes 1..n
    for (auto& e : edges) {
        if (!dsu.unite(e[0], e[1]))        // unite fails → same component → cycle
            return e;                      // this edge is redundant
    }
    return {};
}
```

## ✅ Application 3: Accounts Merge (DSU on strings)
```cpp
vector<vector<string>> accountsMerge(vector<vector<string>>& accounts) {
    unordered_map<string,int> emailToId;  // email → DSU node
    unordered_map<string,string> emailToName;
    int id=0;
    DSU dsu(10001);                       // enough nodes
    
    for (auto& acc : accounts) {
        string name=acc[0];
        int firstId=-1;
        for (int i=1; i<(int)acc.size(); i++) {
            if (!emailToId.count(acc[i])) {
                emailToId[acc[i]] = id++;
                emailToName[acc[i]] = name;
            }
            if (firstId==-1) firstId=emailToId[acc[i]];
            dsu.unite(firstId, emailToId[acc[i]]); // connect all emails in account
        }
    }
    unordered_map<int,vector<string>> groups;
    for (auto& [email,eid] : emailToId)
        groups[dsu.find(eid)].push_back(email); // group by root
    
    vector<vector<string>> result;
    for (auto& [root, emails] : groups) {
        sort(emails.begin(), emails.end());
        emails.insert(emails.begin(), emailToName[emails[0]]); // prepend name
        result.push_back(emails);
    }
    return result;
}
```

## ✅ Application 4: Kruskal's MST (Minimum Spanning Tree)
```cpp
int kruskalMST(int n, vector<vector<int>>& edges) {
    sort(edges.begin(), edges.end(),
         [](auto& a, auto& b){ return a[2]<b[2]; }); // sort by weight
    DSU dsu(n);
    int totalWeight=0, edgesAdded=0;
    
    for (auto& e : edges) {
        if (dsu.unite(e[0], e[1])) {       // connects two different components
            totalWeight += e[2];           // add edge to MST
            edgesAdded++;
            if (edgesAdded == n-1) break;  // MST complete (n-1 edges)
        }
    }
    return edgesAdded==n-1 ? totalWeight : -1; // -1 if not connected
} // O(E log E) time
```

---

## 🔥 Progressive Problems
### 🟢 Easy
1. LC 1971 — Find if Path Exists (basic DSU connect + query)
2. LC 547 — Number of Provinces (Template: count components)

### 🟡 Medium
3. LC 684 — Redundant Connection (Application 2)
4. LC 721 — Accounts Merge (Application 3)
5. LC 1061 — Lexicographically Smallest Equivalent String
6. LC 990 — Satisfiability of Equality Equations

### 🔴 Hard
7. LC 685 — Redundant Connection II (directed graph)
8. LC 1202 — Smallest String With Swaps (DSU + sort within groups)
9. LC 952 — Largest Component Size by Common Factor

---

## ⚠️ Common Mistakes
```
❌ Forgetting path compression → O(log n) instead of O(α(n))
   Fix: parent[x] = find(parent[x]) in find()

❌ Union without rank → O(log n) with tall trees
   Fix: always attach smaller rank tree under larger

❌ Using find() result directly as ID without path compression
   Fix: always call find() fresh when comparing

❌ 1-indexed vs 0-indexed confusion
   Fix: initialize DSU with correct size and check indices
```

## 🎓 Interview Tips
- **Cycle detection**: if unite() returns false, edge creates a cycle
- **DSU = best for offline queries** (all edges known upfront)
- **Path compression alone**: O(log n) | **rank alone**: O(log n) | **both**: O(α(n))
- **Weighted DSU**: store weight relative to parent for ratio problems

---
*Next → [14_SegmentTree_BIT.md](./14_SegmentTree_BIT.md)*
