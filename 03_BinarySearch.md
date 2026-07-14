# 03 — Binary Search 🔍

## 🧠 Core Idea
Eliminate half the search space each step. Works on **monotonic** (sorted / answer-space) data.

**Recognize when:** sorted array/matrix, "find target", "minimum that satisfies", "maximum that satisfies", "kth element", "peak element"

**Two variants:**
- **Classic**: search in sorted array for a value
- **On Answer**: search in answer space (min/max feasibility)

---

## 📐 Visual
```
Classic:  [1, 3, 5, 7, 9, 11, 13]
           L       M            R   → compare mid to target
                   too small   → L = M+1
           too big ←            → R = M-1

On Answer: answer ∈ [lo, hi], check if mid is feasible
           feasible → try smaller (or larger) → shrink range
```

---

## ✅ Template 1: Classic Binary Search
```cpp
int binarySearch(vector<int>& arr, int target) {
    int left = 0, right = arr.size()-1;     // inclusive bounds
    while (left <= right) {                 // = because single element is valid
        int mid = left + (right-left)/2;    // avoid overflow (NOT (l+r)/2)
        if (arr[mid] == target) return mid; // found
        else if (arr[mid] < target) left = mid+1;  // target in right half
        else right = mid-1;                         // target in left half
    }
    return -1;                              // not found
} // O(log n) time, O(1) space
```

## ✅ Template 2: Find First True (Lower Bound)
```cpp
// Find leftmost position where condition is true
// Array looks like: [F, F, F, T, T, T, T]
//                              ^ find this
int firstTrue(vector<int>& arr) {
    int left=0, right=arr.size()-1, ans=-1;
    while (left <= right) {
        int mid = left + (right-left)/2;
        if (isValid(arr[mid])) {    // condition true → remember, try left half
            ans = mid;              // potential answer
            right = mid-1;         // search left for earlier true
        } else {
            left = mid+1;          // condition false → go right
        }
    }
    return ans;
} // O(log n) — same structure, just save answer and continue
```

## ✅ Template 3: Find Last True (Upper Bound)
```cpp
// Array looks like: [T, T, T, T, F, F, F]
//                            ^ find this
int lastTrue(vector<int>& arr) {
    int left=0, right=arr.size()-1, ans=-1;
    while (left <= right) {
        int mid = left + (right-left)/2;
        if (isValid(arr[mid])) {    // condition true → remember, try right half
            ans = mid;              // potential answer
            left = mid+1;          // search right for later true
        } else {
            right = mid-1;         // condition false → go left
        }
    }
    return ans;
}
```

## ✅ Template 4: Binary Search on Answer (Feasibility)
```cpp
// Pattern: minimize/maximize some value subject to a constraint
// Example: split array into m groups minimizing largest group sum

bool canSplit(vector<int>& nums, int m, int maxSum) { // feasibility check
    int groups=1, currSum=0;
    for (int x : nums) {
        if (currSum + x > maxSum) {   // current group too large
            groups++;                  // start new group
            currSum = x;
        } else {
            currSum += x;
        }
    }
    return groups <= m;               // can we do it within m groups?
}

int splitArray(vector<int>& nums, int m) {
    int lo = *max_element(nums.begin(),nums.end()); // min possible answer
    int hi = accumulate(nums.begin(),nums.end(),0); // max possible answer
    
    int ans = hi;
    while (lo <= hi) {
        int mid = lo + (hi-lo)/2;
        if (canSplit(nums, m, mid)) { // mid is feasible → try smaller
            ans = mid;
            hi = mid-1;
        } else {
            lo = mid+1;               // not feasible → need larger max
        }
    }
    return ans;
} // O(n log(sum)) time
```

## ✅ Template 5: Search in Rotated Sorted Array
```cpp
int search(vector<int>& nums, int target) {
    int l=0, r=nums.size()-1;
    while (l <= r) {
        int mid = l + (r-l)/2;
        if (nums[mid] == target) return mid;
        
        // Determine which half is sorted
        if (nums[l] <= nums[mid]) {          // left half is sorted
            if (nums[l] <= target && target < nums[mid]) {
                r = mid-1;                   // target in left sorted half
            } else {
                l = mid+1;                   // target in right half
            }
        } else {                             // right half is sorted
            if (nums[mid] < target && target <= nums[r]) {
                l = mid+1;                   // target in right sorted half
            } else {
                r = mid-1;                   // target in left half
            }
        }
    }
    return -1;
} // O(log n) time
```

## ✅ Template 6: Find Peak Element
```cpp
int findPeakElement(vector<int>& nums) {
    int l=0, r=nums.size()-1;
    while (l < r) {                          // stop when l==r (that's peak)
        int mid = l + (r-l)/2;
        if (nums[mid] > nums[mid+1]) {       // descending → peak is left or at mid
            r = mid;                          // include mid (could be peak)
        } else {                             // ascending → peak is right of mid
            l = mid+1;
        }
    }
    return l;                                // l == r == peak
} // O(log n) time
```

## ✅ Template 7: Binary Search on 2D Matrix
```cpp
bool searchMatrix(vector<vector<int>>& matrix, int target) {
    int m=matrix.size(), n=matrix[0].size();
    int l=0, r=m*n-1;                        // treat as 1D array
    while (l <= r) {
        int mid = l+(r-l)/2;
        int val = matrix[mid/n][mid%n];       // convert 1D index to 2D
        if (val == target) return true;
        else if (val < target) l = mid+1;
        else r = mid-1;
    }
    return false;
} // O(log(m*n)) time
```

---

## 📊 Complexity Table
| Problem | Time | Space |
|---------|------|-------|
| Classic binary search | O(log n) | O(1) |
| Lower/upper bound | O(log n) | O(1) |
| BS on answer | O(n log(range)) | O(1) |
| Rotated sorted array | O(log n) | O(1) |
| 2D matrix search | O(log(mn)) | O(1) |

---

## 🔥 Progressive Problems
### 🟢 Easy
1. LC 704 — Binary Search (classic Template 1)
2. LC 374 — Guess Number Higher or Lower (classic)
3. LC 69 — Sqrt(x) (BS on answer: max k where k²≤x)
4. LC 278 — First Bad Version (Template 2: first true)
5. LC 35 — Search Insert Position (lower_bound)

### 🟡 Medium
6. LC 33 — Search in Rotated Sorted Array (Template 5)
7. LC 153 — Find Minimum in Rotated Sorted Array (which half is out of order)
8. LC 162 — Find Peak Element (Template 6)
9. LC 74 — Search a 2D Matrix (Template 7)
10. LC 875 — Koko Eating Bananas (BS on speed, feasibility check)
11. LC 1011 — Capacity to Ship Packages (BS on capacity)
12. LC 540 — Single Element in Sorted Array (even/odd index trick)

### 🔴 Hard
13. LC 4 — Median of Two Sorted Arrays (BS on partition)
14. LC 410 — Split Array Largest Sum (Template 4, classic BS on answer)
15. LC 774 — Minimize Max Distance to Gas Station (BS on answer + greedy check)
16. LC 1231 — Divide Chocolate (BS on answer: maximize min sum)

---

## 💡 Key Problem Solutions

### LC 875 — Koko Eating Bananas
```cpp
bool canEat(vector<int>& piles, int speed, int h) {
    long long hours = 0;
    for (int p : piles) hours += (p + speed - 1) / speed; // ceil(p/speed)
    return hours <= h;                  // can she finish in h hours?
}
int minEatingSpeed(vector<int>& piles, int h) {
    int lo=1, hi=*max_element(piles.begin(),piles.end()), ans=hi;
    while (lo <= hi) {
        int mid = lo+(hi-lo)/2;
        if (canEat(piles,mid,h)) { ans=mid; hi=mid-1; } // feasible, try slower
        else lo = mid+1;               // too slow, need faster
    }
    return ans;
}
```

### LC 4 — Median of Two Sorted Arrays
```cpp
double findMedianSortedArrays(vector<int>& A, vector<int>& B) {
    if (A.size() > B.size()) swap(A,B);   // ensure A is smaller
    int m=A.size(), n=B.size();
    int lo=0, hi=m;
    while (lo <= hi) {
        int partA = lo+(hi-lo)/2;         // partition A: partA elements on left
        int partB = (m+n+1)/2 - partA;   // partition B: remaining on left
        
        int Aleft  = partA ? A[partA-1] : INT_MIN;
        int Aright = partA<m ? A[partA]  : INT_MAX;
        int Bleft  = partB ? B[partB-1] : INT_MIN;
        int Bright = partB<n ? B[partB]  : INT_MAX;
        
        if (Aleft <= Bright && Bleft <= Aright) { // valid partition found
            if ((m+n)%2 == 1) return max(Aleft,Bleft);
            return (max(Aleft,Bleft)+min(Aright,Bright))/2.0;
        } else if (Aleft > Bright) hi=partA-1;  // too many from A on left
        else lo=partA+1;                          // too few from A on left
    }
    return 0;
}
```

### LC 540 — Single Element in Sorted Array
```cpp
int singleNonDuplicate(vector<int>& nums) {
    int l=0, r=nums.size()-1;
    while (l < r) {
        int mid = l+(r-l)/2;
        if (mid%2==1) mid--;             // make mid even (pair starts at even)
        if (nums[mid]==nums[mid+1]) l=mid+2; // pair is correct → single is right
        else r=mid;                      // pair broken → single is here or left
    }
    return nums[l];
} // Key insight: before single element, pairs start at even indices
```

---

## ⚠️ Common Mistakes
```
❌ Overflow: int mid = (left+right)/2 → use left+(right-left)/2
❌ Infinite loop with left<right when not updating mid properly
   Fix: ensure at least one of l,r changes each iteration
❌ Rotated array: assuming which half is sorted wrong
   Fix: check nums[l] <= nums[mid] (left is sorted)
❌ BS on answer: wrong lo/hi initial values
   Fix: lo = minimum valid answer, hi = maximum valid answer
❌ Off by one: using l<r vs l<=r
   Rule: l<=r for find exact; l<r for find boundary
```

## 🎓 Interview Tips
- **mid overflow**: always use `left + (right-left)/2`
- **"Minimize maximum" or "Maximize minimum"** → Binary search on answer
- **Rotated array**: first check which half is sorted (compare nums[l] vs nums[mid])
- **Peak element**: think "go toward the higher neighbor"
- **Lower bound** = first position where val ≥ target → same as `std::lower_bound`

---
*Next → [04_LinkedList.md](./04_LinkedList.md)*
