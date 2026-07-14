# 11 — Greedy Algorithms 💰

## 🧠 Core Idea
Greedy makes the locally optimal choice at each step, hoping it leads to globally optimal. Works when greedy choice property + optimal substructure hold.

**Recognize when:** interval scheduling, jump game, minimum platforms, fractional knapsack, Huffman, meeting rooms

**Key insight:** Prove greedy correctness via exchange argument ("swapping any two choices can't improve the answer")

---

## ✅ Template 1: Activity Selection / Meeting Rooms
```cpp
// Maximum non-overlapping intervals
int eraseOverlapIntervals(vector<vector<int>>& intervals) {
    sort(intervals.begin(), intervals.end(),
         [](auto& a, auto& b){ return a[1] < b[1]; }); // sort by END time (key insight)
    
    int count=0, end=INT_MIN;             // count of intervals removed
    for (auto& iv : intervals) {
        if (iv[0] >= end) {               // no overlap: current starts after last end
            end = iv[1];                  // greedily select interval with earliest end
        } else {
            count++;                      // overlap: remove this interval
        }
    }
    return count;
} // O(n log n) time — sort by end time to free up room ASAP
```

## ✅ Template 2: Jump Game
```cpp
// Can you reach the last index?
bool canJump(vector<int>& nums) {
    int maxReach = 0;                     // farthest index we can reach
    for (int i=0; i<(int)nums.size(); i++) {
        if (i > maxReach) return false;   // can't even reach current index
        maxReach = max(maxReach, i+nums[i]); // update farthest reachable
    }
    return true;
} // O(n) time, O(1) space

// Minimum jumps to reach last index
int jump(vector<int>& nums) {
    int jumps=0, currEnd=0, farthest=0;
    for (int i=0; i<(int)nums.size()-1; i++) { // don't process last index
        farthest = max(farthest, i+nums[i]);    // track farthest in current jump
        if (i == currEnd) {                     // reached end of current jump range
            jumps++;                            // must make another jump
            currEnd = farthest;                 // new range = farthest we can reach
        }
    }
    return jumps;
} // O(n) time — BFS-like level thinking
```

## ✅ Template 3: Gas Station (Circular)
```cpp
int canCompleteCircuit(vector<int>& gas, vector<int>& cost) {
    int total=0, tank=0, start=0;
    for (int i=0; i<(int)gas.size(); i++) {
        int gain = gas[i]-cost[i];        // net gain at station i
        total += gain;                    // track total (determines if solution exists)
        tank  += gain;
        if (tank < 0) {                   // can't continue from current start
            start = i+1;                  // try next station as starting point
            tank  = 0;                    // reset tank
        }
    }
    return total >= 0 ? start : -1;       // if total gain ≥ 0, solution exists at start
} // O(n) time — key: if total gas ≥ total cost, solution always exists
```

## ✅ Template 4: Fractional Knapsack
```cpp
double fractionalKnapsack(int W, vector<pair<int,int>>& items) {
    // Sort by value/weight ratio (descending)
    sort(items.begin(), items.end(),
         [](auto& a, auto& b){ return (double)a.first/a.second > (double)b.first/b.second; });
    
    double value=0;
    for (auto& [v,w] : items) {
        if (W >= w) {                     // take whole item
            value += v; W -= w;
        } else {                          // take fraction
            value += (double)v/w * W;    // fill remaining capacity
            break;
        }
    }
    return value;
} // O(n log n) time
```

## ✅ Template 5: Minimum Platforms / Meeting Rooms II
```cpp
int minMeetingRooms(vector<vector<int>>& intervals) {
    vector<int> starts, ends;
    for (auto& iv : intervals) { starts.push_back(iv[0]); ends.push_back(iv[1]); }
    sort(starts.begin(), starts.end());   // sort start times
    sort(ends.begin(), ends.end());       // sort end times separately
    
    int rooms=0, maxRooms=0, ep=0;
    for (int sp=0; sp<(int)starts.size(); sp++) {
        if (starts[sp] < ends[ep]) {      // new meeting starts before earliest end
            rooms++;                      // need new room
        } else {
            ep++;                         // reuse room that freed up
        }
        maxRooms = max(maxRooms, rooms);
    }
    return maxRooms;
} // O(n log n) time — two pointers on sorted starts and ends
```

## ✅ Template 6: Candy Distribution
```cpp
int candy(vector<int>& ratings) {
    int n=ratings.size();
    vector<int> candies(n, 1);           // everyone gets at least 1
    
    // Left pass: if rating > left neighbor, get one more than left
    for (int i=1; i<n; i++) {
        if (ratings[i] > ratings[i-1]) candies[i] = candies[i-1]+1;
    }
    // Right pass: if rating > right neighbor, take max with right+1
    for (int i=n-2; i>=0; i--) {
        if (ratings[i] > ratings[i+1]) candies[i] = max(candies[i], candies[i+1]+1);
    }
    return accumulate(candies.begin(), candies.end(), 0);
} // O(n) time — two-pass greedy
```

## ✅ Template 7: Partition Labels
```cpp
vector<int> partitionLabels(string s) {
    vector<int> last(26, 0);
    for (int i=0; i<(int)s.size(); i++) last[s[i]-'a']=i; // last occurrence of each char
    
    vector<int> result;
    int start=0, end=0;
    for (int i=0; i<(int)s.size(); i++) {
        end = max(end, last[s[i]-'a']);   // extend partition to include last occurrence
        if (i == end) {                   // reached the end of current partition
            result.push_back(end-start+1);
            start = i+1;                  // new partition starts here
        }
    }
    return result;
} // O(n) time
```

---

## 📊 Greedy vs DP Decision
| Problem | Greedy | DP |
|---------|--------|-----|
| Interval scheduling (max non-overlap) | ✅ Sort by end | ❌ |
| Fractional knapsack | ✅ Sort by ratio | ❌ |
| 0/1 Knapsack | ❌ | ✅ |
| Coin change (specific coins) | ❌ (may fail) | ✅ |
| Activity selection | ✅ | ✅ (but greedy simpler) |
| Jump game | ✅ | ✅ (but greedy simpler) |

---

## 🔥 Progressive Problems
### 🟢 Easy
1. LC 455 — Assign Cookies (sort both, greedy match)
2. LC 860 — Lemonade Change (greedy: prefer using larger bills first)
3. LC 1005 — Maximize Sum After K Negations (flip smallest negatives)

### 🟡 Medium
4. LC 55 — Jump Game (Template 2)
5. LC 45 — Jump Game II (min jumps, Template 2)
6. LC 134 — Gas Station (Template 3)
7. LC 435 — Non-overlapping Intervals (Template 1)
8. LC 452 — Min Arrows to Burst Balloons (sort by end, count distinct groups)
9. LC 763 — Partition Labels (Template 7)
10. LC 621 — Task Scheduler (greedy + heap, see file 08)
11. LC 135 — Candy (Template 6)
12. LC 1029 — Two City Scheduling (sort by cost difference)

### 🔴 Hard
13. LC 630 — Course Schedule III (greedy + max heap on deadlines)
14. LC 1353 — Max Number of Events to Attend (greedy + min heap)
15. LC 871 — Minimum Number of Refueling Stops (greedy + max heap)

---

## 💡 Key Problem Walkthroughs

### LC 452 — Min Arrows to Burst Balloons
```cpp
int findMinArrowShots(vector<vector<int>>& points) {
    sort(points.begin(), points.end(),
         [](auto& a, auto& b){ return a[1] < b[1]; }); // sort by end (same as activity selection)
    int arrows=1, end=points[0][1];
    for (int i=1; i<(int)points.size(); i++) {
        if (points[i][0] > end) {         // balloon doesn't overlap → need new arrow
            arrows++;
            end = points[i][1];
        }
        // else: current arrow bursts this balloon too (start ≤ end)
    }
    return arrows;
}
```

### LC 871 — Min Refueling Stops (Greedy + Max Heap)
```cpp
int minRefuelStops(int target, int startFuel, vector<vector<int>>& stations) {
    priority_queue<int> pq;               // max heap of available fuel amounts
    int fuel=startFuel, stops=0, prev=0;
    
    for (auto& st : stations) {
        int pos=st[0], gallons=st[1];
        fuel -= (pos-prev);               // use fuel to reach this station
        prev = pos;
        
        while (fuel < 0 && !pq.empty()) { // not enough fuel → refuel from best past station
            fuel += pq.top(); pq.pop();
            stops++;
        }
        if (fuel < 0) return -1;          // can't reach even with all past stations
        pq.push(gallons);                 // add this station's fuel as option
    }
    fuel -= (target-prev);               // fuel needed for final stretch
    while (fuel < 0 && !pq.empty()) { fuel+=pq.top(); pq.pop(); stops++; }
    return fuel>=0 ? stops : -1;
} // Greedy insight: always pick the largest available fuel when you run out
```

---

## ⚠️ Common Mistakes
```
❌ Greedy on 0/1 Knapsack → wrong answer
   Fix: greedy doesn't work for 0/1; use DP

❌ Meeting rooms: sorting by start time (wrong for min rooms)
   Fix: sort starts and ends SEPARATELY, use two pointers

❌ Jump game II: decrementing jumps at wrong position
   Fix: jump when i==currEnd, update currEnd to farthest

❌ Gas station: resetting start correctly
   Fix: start=i+1 (not i) when tank becomes negative

❌ Interval problems: using ≤ vs < for overlap check
   Fix: [a,b] and [c,d] overlap if a<d && c<b (strictly)
        For endpoint touching: depends on problem definition
```

## 🎓 Interview Tips
- **Exchange argument**: to prove greedy, show swapping any two choices doesn't help
- **Sort first**: almost every greedy problem requires sorting by some criterion
- **Greedy often needs a clever sorting key**: end time, ratio, difference, etc.
- **If greedy fails → think DP**
- **Meeting rooms = minimum platforms**: two sorted arrays + two pointers

---
*Next → [12_Tries.md](./12_Tries.md)*
