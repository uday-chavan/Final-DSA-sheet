# 14 — Segment Tree & Binary Indexed Tree (BIT/Fenwick) 🌲

## 🧠 Core Idea
Both support **range queries** and **point updates** in O(log n).
- **Segment Tree**: more flexible (range update, any aggregate: sum/min/max)
- **BIT/Fenwick**: simpler code, faster constants (only prefix sum/XOR)

**Recognize when:** range sum query with updates, range minimum/maximum, count inversions, dynamic prefix sums

---

## ✅ Template 1: Segment Tree (Sum)
```cpp
class SegTree {
    int n;
    vector<int> tree;                      // tree[1] = root, tree[i] = sum of range
public:
    SegTree(int n) : n(n), tree(4*n, 0) {} // 4n size is safe
    
    void build(vector<int>& arr, int node, int start, int end) {
        if (start==end) { tree[node]=arr[start]; return; } // leaf
        int mid=(start+end)/2;
        build(arr, 2*node, start, mid);    // build left child
        build(arr, 2*node+1, mid+1, end);  // build right child
        tree[node] = tree[2*node]+tree[2*node+1]; // merge
    }
    
    void update(int node, int start, int end, int idx, int val) {
        if (start==end) { tree[node]=val; return; } // leaf → update
        int mid=(start+end)/2;
        if (idx<=mid) update(2*node, start, mid, idx, val);   // go left
        else          update(2*node+1, mid+1, end, idx, val); // go right
        tree[node]=tree[2*node]+tree[2*node+1];               // update current
    }
    
    int query(int node, int start, int end, int l, int r) {
        if (r<start || end<l) return 0;    // completely outside → identity (0 for sum)
        if (l<=start && end<=r) return tree[node]; // completely inside → return node
        int mid=(start+end)/2;
        return query(2*node,start,mid,l,r) + query(2*node+1,mid+1,end,l,r);
    }
    
    // Public wrappers:
    void build(vector<int>& a) { build(a, 1, 0, n-1); }
    void update(int i, int v)  { update(1, 0, n-1, i, v); }
    int  query(int l, int r)   { return query(1, 0, n-1, l, r); }
};
// O(n) build, O(log n) update, O(log n) query
```

## ✅ Template 2: Binary Indexed Tree / Fenwick Tree
```cpp
class BIT {
    int n;
    vector<int> bit;                       // 1-indexed
public:
    BIT(int n) : n(n), bit(n+1, 0) {}
    
    void update(int i, int delta) {        // add delta to index i (1-indexed)
        for (; i<=n; i+=i&(-i))            // i & (-i) = lowest set bit = jump amount
            bit[i] += delta;
    }
    
    int query(int i) {                     // prefix sum [1..i]
        int sum=0;
        for (; i>0; i-=i&(-i))            // subtract lowest set bit to move up
            sum += bit[i];
        return sum;
    }
    
    int rangeQuery(int l, int r) {         // range sum [l..r] (both 1-indexed)
        return query(r) - query(l-1);
    }
};
// O(n) build (n updates), O(log n) update, O(log n) query
// Key: i & (-i) = rightmost set bit of i
```

## ✅ Application: Count Inversions (BIT)
```cpp
int countInversions(vector<int>& arr) {
    int n=arr.size();
    // Coordinate compress to [1..n]
    vector<int> sorted=arr; sort(sorted.begin(),sorted.end());
    auto compress=[&](int v){ return lower_bound(sorted.begin(),sorted.end(),v)-sorted.begin()+1; };
    
    BIT bit(n);
    int inversions=0;
    for (int i=n-1; i>=0; i--) {          // traverse right to left
        int rank=compress(arr[i]);
        inversions += bit.query(rank-1);   // count elements < arr[i] already seen on right
        bit.update(rank, 1);               // mark arr[i] as seen
    }
    return inversions;
}
```

---

## 📊 Comparison
| | Build | Update | Range Query |
|-|-------|--------|-------------|
| Naive array | O(n) | O(1) | O(n) |
| Prefix sum | O(n) | O(n) | O(1) |
| BIT | O(n log n) | O(log n) | O(log n) |
| Segment Tree | O(n) | O(log n) | O(log n) |

---

## 🔥 Progressive Problems
### 🟡 Medium
1. LC 307 — Range Sum Query Mutable (BIT or Segment Tree, Template 1/2)
2. LC 315 — Count of Smaller Numbers After Self (BIT + coordinate compression)
3. LC 493 — Reverse Pairs (merge sort or BIT)

### 🔴 Hard
4. LC 308 — Range Sum Query 2D Mutable (2D BIT)
5. LC 327 — Count of Range Sum (merge sort / segment tree)

---

## 🎓 Interview Tips
- **BIT simpler to code** in interviews → prefer over Segment Tree when possible
- **Segment Tree** needed for min/max range queries or lazy propagation
- **BIT is 1-indexed** → convert 0-indexed inputs by adding 1
- **Coordinate compress** when values are large but count is small

---
*Next → [15_BitManipulation.md](./15_BitManipulation.md)*
