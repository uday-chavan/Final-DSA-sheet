# 08 — Heaps & Priority Queue ⛰️

## 🧠 Core Idea
Heap gives O(log n) insert/delete and O(1) min/max access. Use for "Top K", "Kth largest/smallest", "median of stream", "merge K sorted".

**Recognize when:** Top K elements, Kth largest/smallest, continuously sorted stream, merge K lists, scheduling tasks

---

## 📐 Visual
```
Min Heap (C++ default with greater<>):   Max Heap (default):
       1                                        9
      / \                                      / \
     3   2                                    7   8
    / \                                      / \
   5   4                                    5   6

priority_queue<int> → max heap (largest on top)
priority_queue<int, vector<int>, greater<int>> → min heap
```

---

## ✅ Template 1: Kth Largest Element
```cpp
int findKthLargest(vector<int>& nums, int k) {
    // Min heap of size k: maintains k largest elements
    priority_queue<int, vector<int>, greater<int>> minHeap; // min heap
    
    for (int num : nums) {
        minHeap.push(num);                 // add element
        if ((int)minHeap.size() > k) {
            minHeap.pop();                 // remove smallest if size > k
        }
        // Invariant: heap has k largest elements seen so far
    }
    return minHeap.top();                  // smallest of k largest = kth largest
} // O(n log k) time, O(k) space
```

## ✅ Template 2: Top K Frequent Elements
```cpp
vector<int> topKFrequent(vector<int>& nums, int k) {
    unordered_map<int,int> freq;
    for (int n : nums) freq[n]++;          // count frequencies
    
    // Min heap of {frequency, value} — keep top k by frequency
    priority_queue<pair<int,int>, vector<pair<int,int>>, greater<>> pq;
    
    for (auto& [val, cnt] : freq) {
        pq.push({cnt, val});               // push {freq, value}
        if ((int)pq.size() > k) pq.pop(); // remove least frequent
    }
    
    vector<int> result;
    while (!pq.empty()) {
        result.push_back(pq.top().second);
        pq.pop();
    }
    return result;
} // O(n log k) time, O(n) space

// Alternative: Bucket Sort O(n)
vector<int> topKFrequentBucket(vector<int>& nums, int k) {
    unordered_map<int,int> freq;
    for (int n : nums) freq[n]++;
    vector<vector<int>> buckets(nums.size()+1);  // index = frequency
    for (auto& [val, cnt] : freq) buckets[cnt].push_back(val);
    vector<int> result;
    for (int i=nums.size(); i>=0 && (int)result.size()<k; i--)
        for (int v : buckets[i]) if ((int)result.size()<k) result.push_back(v);
    return result;
}
```

## ✅ Template 3: Find Median from Data Stream
```cpp
class MedianFinder {
    priority_queue<int> maxHeap;                       // lower half (max on top)
    priority_queue<int,vector<int>,greater<int>> minHeap; // upper half (min on top)
public:
    void addNum(int num) {
        maxHeap.push(num);                             // always push to max heap first
        minHeap.push(maxHeap.top()); maxHeap.pop();    // balance: push max to min heap
        
        if (minHeap.size() > maxHeap.size()) {         // keep maxHeap >= minHeap size
            maxHeap.push(minHeap.top()); minHeap.pop();
        }
    }
    double findMedian() {
        if (maxHeap.size() > minHeap.size()) return maxHeap.top(); // odd total
        return (maxHeap.top() + minHeap.top()) / 2.0;  // even total → average of tops
    }
};
// O(log n) add, O(1) findMedian
```

## ✅ Template 4: K Closest Points to Origin
```cpp
vector<vector<int>> kClosest(vector<vector<int>>& points, int k) {
    // Max heap of size k — keeps k closest (smallest distance)
    auto cmp = [](vector<int>& a, vector<int>& b) {
        return a[0]*a[0]+a[1]*a[1] < b[0]*b[0]+b[1]*b[1]; // max heap by distance
    };
    priority_queue<vector<int>,vector<vector<int>>,decltype(cmp)> pq(cmp);
    
    for (auto& p : points) {
        pq.push(p);
        if ((int)pq.size() > k) pq.pop();  // remove farthest if size > k
    }
    vector<vector<int>> result;
    while (!pq.empty()) { result.push_back(pq.top()); pq.pop(); }
    return result;
} // O(n log k) time
```

## ✅ Template 5: Merge K Sorted Arrays
```cpp
vector<int> mergeKSortedArrays(vector<vector<int>>& arrays) {
    // Min heap: {value, array_index, element_index}
    using T = tuple<int,int,int>;
    priority_queue<T, vector<T>, greater<T>> pq;
    
    for (int i=0; i<(int)arrays.size(); i++) {
        if (!arrays[i].empty())
            pq.push({arrays[i][0], i, 0});  // push first element of each array
    }
    
    vector<int> result;
    while (!pq.empty()) {
        auto [val, ai, ei] = pq.top(); pq.pop();
        result.push_back(val);              // take minimum
        if (ei+1 < (int)arrays[ai].size()) // if more in this array
            pq.push({arrays[ai][ei+1], ai, ei+1}); // push next element
    }
    return result;
} // O(n log k) where n=total elements
```

## ✅ Template 6: Task Scheduler
```cpp
int leastInterval(vector<char>& tasks, int n) {
    vector<int> freq(26, 0);
    for (char t : tasks) freq[t-'A']++;
    
    priority_queue<int> pq;               // max heap of frequencies
    for (int f : freq) if (f>0) pq.push(f);
    
    int time = 0;
    while (!pq.empty()) {
        vector<int> temp;
        int cycle = n+1;                  // process n+1 tasks per cycle
        while (cycle-- && !pq.empty()) {
            temp.push_back(pq.top()-1);   // reduce frequency by 1 (task done)
            pq.pop();
            time++;
        }
        for (int f : temp) if (f>0) pq.push(f); // re-add unfinished tasks
        if (!pq.empty()) time += cycle+1;  // idle slots = remaining cycle
    }
    return time;
} // O(n log 26) = O(n log 1) = O(n) effectively
```

## ✅ Template 7: Reorganize String (Heap + Greedy)
```cpp
string reorganizeString(string s) {
    vector<int> freq(26, 0);
    for (char c : s) freq[c-'a']++;
    
    priority_queue<pair<int,char>> pq;
    for (int i=0; i<26; i++) if (freq[i]) pq.push({freq[i], 'a'+i});
    
    string result;
    while (pq.size() >= 2) {              // need at least 2 different chars
        auto [f1,c1] = pq.top(); pq.pop();
        auto [f2,c2] = pq.top(); pq.pop();
        result += c1; result += c2;       // alternate most frequent chars
        if (f1-1 > 0) pq.push({f1-1, c1});
        if (f2-1 > 0) pq.push({f2-1, c2});
    }
    if (!pq.empty()) {
        auto [f,c] = pq.top();
        if (f > 1) return "";             // only one char left with freq>1 → impossible
        result += c;
    }
    return result;
}
```

---

## 📊 Complexity Table
| Operation | Min/Max Heap |
|-----------|-------------|
| Push | O(log n) |
| Pop (top) | O(log n) |
| Peek (top) | O(1) |
| Build heap | O(n) |
| Kth largest | O(n log k) |
| Median stream | O(log n) add, O(1) query |

---

## 🔥 Progressive Problems
### 🟢 Easy
1. LC 703 — Kth Largest in Stream (Template 1, continuous)
2. LC 1046 — Last Stone Weight (max heap, simulate)
3. LC 414 — Third Maximum Number (min heap of size 3)

### 🟡 Medium
4. LC 215 — Kth Largest Element in Array (Template 1)
5. LC 347 — Top K Frequent Elements (Template 2)
6. LC 973 — K Closest Points to Origin (Template 4)
7. LC 451 — Sort Characters by Frequency (max heap)
8. LC 621 — Task Scheduler (Template 6)
9. LC 767 — Reorganize String (Template 7)
10. LC 1167 — Minimum Cost to Connect Sticks (min heap, always combine 2 smallest)

### 🔴 Hard
11. LC 295 — Find Median from Data Stream (Template 3)
12. LC 23 — Merge K Sorted Lists (Template 5 variant)
13. LC 502 — IPO (two heaps: available projects + locked by capital)
14. LC 632 — Smallest Range Covering K Lists (heap + sliding window hybrid)

---

## 💡 Key Problem Walkthroughs

### LC 1167 — Minimum Cost to Connect Sticks
```cpp
int connectSticks(vector<int>& sticks) {
    priority_queue<int,vector<int>,greater<int>> pq(sticks.begin(), sticks.end());
    int cost = 0;
    while (pq.size() > 1) {               // until one stick remains
        int a = pq.top(); pq.pop();        // take two smallest
        int b = pq.top(); pq.pop();
        cost += a+b;                       // cost = sum of combined sticks
        pq.push(a+b);                      // push combined stick back
    }
    return cost;
} // Greedy: always combine two smallest → same as Huffman coding
```

### LC 502 — IPO (Two Heaps)
```cpp
int findMaximizedCapital(int k, int w, vector<int>& profits, vector<int>& capital) {
    int n=profits.size();
    vector<pair<int,int>> projects(n);
    for (int i=0; i<n; i++) projects[i]={capital[i], profits[i]};
    sort(projects.begin(), projects.end()); // sort by capital needed
    
    priority_queue<int> available;         // max heap of available profits
    int i=0;
    for (int j=0; j<k; j++) {
        while (i<n && projects[i].first<=w) { // unlock projects we can afford
            available.push(projects[i].second);
            i++;
        }
        if (available.empty()) break;      // no project affordable
        w += available.top(); available.pop(); // pick most profitable
    }
    return w;
}
```

---

## ⚠️ Common Mistakes
```
❌ Using max heap when you need min heap
   Fix: priority_queue<int,vector<int>,greater<int>> for min heap

❌ Kth largest: using max heap instead of min heap of size k
   Fix: min heap of size k → top = kth largest

❌ Median: sizes getting unbalanced
   Fix: after each insert, rebalance so |maxHeap.size()-minHeap.size()| <= 1

❌ Custom comparator: wrong direction
   Fix: for max heap, return a < b; for min heap, return a > b

❌ Building priority_queue from vector: forgetting O(n) heapify
   Fix: pass begin/end iterators to constructor
```

## 🎓 Interview Tips
- **Top K largest** → min heap of size K (counterintuitive but correct)
- **Top K smallest** → max heap of size K
- **Median** → two heaps (max heap for lower half, min heap for upper half)
- **C++ default** is MAX heap — add `greater<int>` for min heap
- **Custom comparator**: use lambda or struct with `operator()`

---
*Next → [09_Recursion_Backtracking.md](./09_Recursion_Backtracking.md)*
