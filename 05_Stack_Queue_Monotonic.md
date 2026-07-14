# 05 — Stack, Queue & Monotonic Stack/Queue 📚

## 🧠 Core Idea
Stack (LIFO) and Queue (FIFO) are fundamental. **Monotonic** variants maintain a sorted order to answer "next greater/smaller" queries in O(n).

**Recognize when:**
- Stack: matching brackets, undo operations, DFS iterative
- Monotonic stack: "next greater element", "largest rectangle", "temperatures"
- Monotonic deque: "sliding window maximum/minimum"
- Queue: BFS, task scheduling

---

## 📐 Visual
```
Monotonic Decreasing Stack (Next Greater):
arr: [2, 1, 5, 3, 4]
stack (indices): []
i=0: push 0         → stack: [0]          (val: [2])
i=1: push 1         → stack: [0,1]        (val: [2,1])
i=2: arr[2]=5 > arr[1]=1 → pop 1, NGE[1]=5; 5>arr[0]=2 → pop 0, NGE[0]=5; push 2
     stack: [2]     NGE: [5,5,-]
i=3: push 3         → stack: [2,3]
i=4: arr[4]=4>arr[3]=3 → pop 3, NGE[3]=4; 4<arr[2]=5 → stop; push 4
NGE: [5,5,-1,4,-1]
```

---

## ✅ Template 1: Valid Parentheses
```cpp
bool isValid(string s) {
    stack<char> st;
    unordered_map<char,char> match = {{')','{'}{']}','['},{'('}','{'}};  
    // Corrected:
    unordered_map<char,char> pairs = {{')', '('}, {']', '['}, {'}', '{'}};
    
    for (char c : s) {
        if (c=='(' || c=='[' || c=='{') {
            st.push(c);                    // opening → push
        } else {
            if (st.empty() || st.top() != pairs[c]) return false; // mismatch
            st.pop();                      // matching pair → pop
        }
    }
    return st.empty();                     // all matched if stack empty
} // O(n) time, O(n) space
```

## ✅ Template 2: Next Greater Element (Monotonic Stack)
```cpp
vector<int> nextGreater(vector<int>& nums) {
    int n = nums.size();
    vector<int> result(n, -1);             // default: no greater element
    stack<int> st;                         // monotonic decreasing stack of INDICES
    
    for (int i = 0; i < n; i++) {
        while (!st.empty() && nums[i] > nums[st.top()]) { // current breaks monotonicity
            result[st.top()] = nums[i];   // nums[i] is the NGE for stack top
            st.pop();                      // pop because its NGE is found
        }
        st.push(i);                        // push current index
    }
    return result;                         // remaining in stack → -1 (no NGE)
} // O(n) time, O(n) space — each element pushed/popped once
```

## ✅ Template 3: Daily Temperatures (Classic Monotonic Stack)
```cpp
vector<int> dailyTemperatures(vector<int>& T) {
    int n = T.size();
    vector<int> result(n, 0);             // default: 0 days wait
    stack<int> st;                        // decreasing stack of indices
    
    for (int i = 0; i < n; i++) {
        while (!st.empty() && T[i] > T[st.top()]) {
            int idx = st.top(); st.pop();
            result[idx] = i - idx;        // days waited = current index - stored index
        }
        st.push(i);
    }
    return result;
} // O(n) time, O(n) space
```

## ✅ Template 4: Largest Rectangle in Histogram (Hard)
```cpp
int largestRectangleArea(vector<int>& heights) {
    stack<int> st;                         // monotonic increasing stack (indices)
    int maxArea = 0;
    heights.push_back(0);                  // sentinel: force pop all at end
    
    for (int i = 0; i < (int)heights.size(); i++) {
        while (!st.empty() && heights[i] < heights[st.top()]) {
            int h = heights[st.top()]; st.pop(); // height of bar to process
            int w = st.empty() ? i : i-st.top()-1; // width: from after new top to i
            maxArea = max(maxArea, h*w);   // area = height × width
        }
        st.push(i);
    }
    return maxArea;
} // O(n) time, O(n) space
```

## ✅ Template 5: Sliding Window Maximum (Monotonic Deque)
```cpp
vector<int> maxSlidingWindow(vector<int>& nums, int k) {
    deque<int> dq;                         // stores indices, front = max of window
    vector<int> result;
    
    for (int i = 0; i < (int)nums.size(); i++) {
        // Remove elements outside window from front
        while (!dq.empty() && dq.front() < i-k+1) dq.pop_front();
        
        // Remove smaller elements from back (they can never be max)
        while (!dq.empty() && nums[i] > nums[dq.back()]) dq.pop_back();
        
        dq.push_back(i);                   // add current index
        
        if (i >= k-1) result.push_back(nums[dq.front()]); // window full → record max
    }
    return result;
} // O(n) time, O(k) space
```

## ✅ Template 6: Min Stack (O(1) getMin)
```cpp
class MinStack {
    stack<int> st, minSt;                  // main stack + min-tracking stack
public:
    void push(int val) {
        st.push(val);
        // push to minSt if it's new minimum (or equal, to handle duplicates)
        if (minSt.empty() || val <= minSt.top()) minSt.push(val);
    }
    void pop() {
        if (st.top() == minSt.top()) minSt.pop(); // removing current min → update minSt
        st.pop();
    }
    int top() { return st.top(); }
    int getMin() { return minSt.top(); }  // O(1) min access
};
```

## ✅ Template 7: Implement Queue using Stacks
```cpp
class MyQueue {
    stack<int> in, out;                    // in: push stack, out: pop stack
public:
    void push(int x) { in.push(x); }      // always push to in
    
    int pop() {
        if (out.empty()) {                 // out empty → pour from in
            while (!in.empty()) { out.push(in.top()); in.pop(); }
        }
        int val = out.top(); out.pop();
        return val;
    }
    int peek() {
        if (out.empty()) { while(!in.empty()) { out.push(in.top()); in.pop(); } }
        return out.top();
    }
    bool empty() { return in.empty() && out.empty(); }
}; // Amortized O(1) per operation
```

## ✅ Template 8: Evaluate Reverse Polish Notation
```cpp
int evalRPN(vector<string>& tokens) {
    stack<long long> st;
    for (auto& tok : tokens) {
        if (tok=="+"||tok=="-"||tok=="*"||tok=="/") {
            long long b=st.top(); st.pop(); // second operand
            long long a=st.top(); st.pop(); // first operand
            if (tok=="+") st.push(a+b);
            else if (tok=="-") st.push(a-b);
            else if (tok=="*") st.push(a*b);
            else st.push(a/b);             // truncate toward zero (C++ default)
        } else {
            st.push(stoll(tok));           // number → push onto stack
        }
    }
    return st.top();
} // O(n) time, O(n) space
```

---

## 📊 Complexity Table
| Problem | Time | Space |
|---------|------|-------|
| Valid parentheses | O(n) | O(n) |
| Next greater element | O(n) | O(n) |
| Largest rectangle | O(n) | O(n) |
| Sliding window max | O(n) | O(k) |
| Min stack ops | O(1) | O(n) |
| Queue via stacks | O(1) amort | O(n) |

---

## 🔥 Progressive Problems
### 🟢 Easy
1. LC 20 — Valid Parentheses (Template 1)
2. LC 155 — Min Stack (Template 6)
3. LC 496 — Next Greater Element I (Template 2, smaller input)
4. LC 232 — Implement Queue using Stacks (Template 7)
5. LC 150 — Evaluate Reverse Polish Notation (Template 8)

### 🟡 Medium
6. LC 739 — Daily Temperatures (Template 3)
7. LC 503 — Next Greater Element II (circular, traverse 2n)
8. LC 901 — Online Stock Span (decreasing stack, count span)
9. LC 853 — Car Fleet (sort by position, stack of speeds)
10. LC 1019 — Next Greater Node In Linked List (monotonic stack)
11. LC 402 — Remove K Digits (greedy + monotonic stack)
12. LC 456 — 132 Pattern (stack + tracking min so far)

### 🔴 Hard
13. LC 84 — Largest Rectangle in Histogram (Template 4)
14. LC 239 — Sliding Window Maximum (Template 5)
15. LC 85 — Maximal Rectangle (use histogram approach row by row)
16. LC 42 — Trapping Rain Water (monotonic stack approach)
17. LC 316 — Remove Duplicate Letters (greedy + monotonic stack)

---

## 💡 Key Problem Walkthroughs

### LC 503 — Next Greater Element II (Circular Array)
```cpp
vector<int> nextGreaterElements(vector<int>& nums) {
    int n=nums.size();
    vector<int> res(n,-1);
    stack<int> st;
    for (int i=0; i<2*n; i++) {           // traverse twice to handle circular
        while (!st.empty() && nums[i%n] > nums[st.top()]) {
            res[st.top()] = nums[i%n];
            st.pop();
        }
        if (i < n) st.push(i);            // only push indices from first pass
    }
    return res;
}
```

### LC 85 — Maximal Rectangle (Extension of Histogram)
```cpp
int maximalRectangle(vector<vector<char>>& matrix) {
    if (matrix.empty()) return 0;
    int n=matrix[0].size(), ans=0;
    vector<int> heights(n, 0);
    
    for (auto& row : matrix) {
        for (int j=0; j<n; j++) {
            heights[j] = row[j]=='1' ? heights[j]+1 : 0; // build histogram per row
        }
        ans = max(ans, largestRectangleArea(heights)); // solve histogram problem
    }
    return ans;
} // O(m*n) time — same histogram function from Template 4
```

### LC 402 — Remove K Digits (Greedy + Stack)
```cpp
string removeKdigits(string num, int k) {
    string st;                             // use string as stack
    for (char c : num) {
        while (k>0 && !st.empty() && st.back() > c) { // current digit smaller
            st.pop_back();                 // remove larger digit before it
            k--;
        }
        st.push_back(c);
    }
    while (k--) st.pop_back();            // remove from back if k remaining
    
    // Remove leading zeros
    int start=0;
    while (start<(int)st.size()-1 && st[start]=='0') start++;
    return st.substr(start);
} // Key insight: maintain increasing monotonic stack = smallest number
```

---

## ⚠️ Common Mistakes
```
❌ Monotonic stack: pushing values instead of INDICES
   Fix: push indices → can compute widths/distances

❌ Histogram: wrong width calculation
   Fix: width = st.empty() ? i : i-st.top()-1

❌ Sliding window max: not removing out-of-window indices
   Fix: pop_front if dq.front() < i-k+1

❌ Queue via stacks: pouring on every push (wrong)
   Fix: only pour from in to out when out is empty

❌ Min stack: not pushing equal elements to minSt
   Fix: push when val <= minSt.top() (handle duplicates)
```

## 🎓 Interview Tips
- **"Next greater/smaller"** → monotonic stack (decreasing for NGE, increasing for NSE)
- **Stack stores indices** (not values) when you need position info
- **Circular array**: traverse 2n, use i%n for indexing
- **Monotonic deque**: BOTH ends → pop from front (expiry) + back (smaller/larger)
- **Histogram**: add sentinel 0 at end to force emptying the stack

---
*Next → [06_Trees_BST.md](./06_Trees_BST.md)*
