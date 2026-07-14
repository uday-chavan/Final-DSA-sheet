# 01 — Arrays & Two Pointers 🔁

## 🧠 Core Idea
Two pointers reduce O(n²) brute force to **O(n)**. One pointer at each end (converging) or both moving forward (slow-fast).

**Recognize when:** sorted array, pair/triplet sum, palindrome, remove duplicates, partition

---

## 📐 Visual
```
Converging:  [1, 2, 3, 4, 5]   L→      ←R
Same-dir:    [1, 1, 2, 3, 3]   S(write)  F(scan)→
```

---

## ✅ Template 1: Two Sum (Sorted)

**Problem:** Find if there exist two elements in a sorted array that sum up to a target value.

- **Example Input:** `arr = [2, 3, 5]`, `target = 8`
- **Example Output:** `1` (representing true / found)

```cpp
int twoSum(vector<int>& arr, int target) {
    int left = 0, right = arr.size()-1;  // one at each end
    while (left < right) {               // stop when they meet
        int sum = arr[left] + arr[right];
        if (sum == target) return 1;     // found
        else if (sum < target) left++;   // too small -> move left right
        else right--;                    // too large -> move right left
    }
    return -1;
}
```

### Dry Run Trace
| Line | Trace / State Explanation |
| :--- | :--- |
| 2 | Initialize `left = 0` (val 2), `right = 2` (val 5). |
| 3 | `0 < 2` is true. Loop starts. |
| 4 | `sum = 2 + 5 = 7`. |
| 5 | `7 == 8` is false. |
| 6 | `7 < 8` is true. Increment `left` to `1` (val 3). |
| 3 | `1 < 2` is true. Loop continues. |
| 4 | `sum = 3 + 5 = 8`. |
| 5 | `8 == 8` is true. Target found! Return `1`. |

---

## ✅ Template 2: Three Sum

**Problem:** Find all unique triplets in an array that sum to zero.

- **Example Input:** `nums = [-1, 0, 1]`
- **Example Output:** `[[-1, 0, 1]]`

```cpp
vector<vector<int>> threeSum(vector<int>& nums) {
    sort(nums.begin(), nums.end());      // sort first (mandatory)
    vector<vector<int>> res;
    for (int i = 0; i < (int)nums.size()-2; i++) {
        if (i > 0 && nums[i] == nums[i-1]) continue; // skip dup for i
        int l = i+1, r = nums.size()-1;
        while (l < r) {
            int s = nums[i]+nums[l]+nums[r];
            if (s == 0) {
                res.push_back({nums[i],nums[l],nums[r]});
                while (l<r && nums[l]==nums[l+1]) l++;  // skip dup left
                while (l<r && nums[r]==nums[r-1]) r--;  // skip dup right
                l++; r--;                               // move both inward
            } else if (s < 0) l++;   // need bigger sum
            else r--;                // need smaller sum
        }
    }
    return res;
}
```

### Dry Run Trace
| Line | Trace / State Explanation |
| :--- | :--- |
| 2 | Sort: `nums` remains `[-1, 0, 1]`. |
| 3 | Initialize empty result vector `res`. |
| 4 | Outer loop starts: `i = 0` (`nums[0] = -1`). |
| 5 | `i > 0` is false. Continue to next line. |
| 6 | Initialize two pointers: `l = 1` (val 0), `r = 2` (val 1). |
| 7 | Check condition: `1 < 2` is true. Enter inner loop. |
| 8 | Calculate sum `s = -1 + 0 + 1 = 0`. |
| 9 | Sum is 0, enter block. |
| 10 | Record triplet `[-1, 0, 1]` in `res`. |
| 11 | `nums[1] == nums[2]` (0 == 1) is false. Loop doesn't run. |
| 12 | `nums[2] == nums[1]` (1 == 0) is false. Loop doesn't run. |
| 13 | Increment `l` to `2`, decrement `r` to `1`. |
| 7 | Check condition: `2 < 1` is false. Exit inner loop. |
| 4 | Increment `i` to `1`. Loop condition `1 < 1` is false. Exit outer loop. |
| 18 | Return result list containing `[[-1, 0, 1]]`. |

---

## ✅ Template 3: Remove Duplicates (Slow-Fast)

**Problem:** Remove duplicates from a sorted array in-place, returning the new length of unique elements.

- **Example Input:** `nums = [1, 1, 2]`
- **Example Output:** `2` (array becomes `[1, 2, ...]`)

```cpp
int removeDuplicates(vector<int>& nums) {
    int slow = 0;                         // slow = write head
    for (int fast = 1; fast < (int)nums.size(); fast++) { // fast scans
        if (nums[fast] != nums[slow]) {   // new unique element found
            nums[++slow] = nums[fast];    // write at next slow position
        }
    }
    return slow + 1;                      // length of unique portion
}
```

### Dry Run Trace
| Line | Trace / State Explanation |
| :--- | :--- |
| 2 | `slow = 0`. First element is always unique. |
| 3 | Loop starts with `fast = 1` (`nums[1] = 1`). |
| 4 | `nums[1] (1) != nums[0] (1)` is false. Duplicate detected, do nothing. |
| 3 | Next iteration: `fast = 2` (`nums[2] = 2`). |
| 4 | `nums[2] (2) != nums[0] (1)` is true. New unique element found! |
| 5 | `slow` becomes `1`. Set `nums[1] = nums[2]` (which is `2`). Array is `[1, 2, 2]`. |
| 8 | Loop finished. Return `slow + 1 = 2` (unique length). |

---

## ✅ Template 4: Trapping Rain Water

**Problem:** Given an array representing elevation heights, compute how much water can be trapped after raining.

- **Example Input:** `h = [2, 0, 2]`
- **Example Output:** `2` (2 units of water can be trapped above index 1)

```cpp
int trap(vector<int>& h) {
    int l=0, r=h.size()-1, lMax=0, rMax=0, water=0;
    while (l < r) {
        if (h[l] < h[r]) {                      // process smaller side
            h[l] >= lMax ? lMax=h[l] : water+=lMax-h[l]; // update max or add water
            l++;
        } else {
            h[r] >= rMax ? rMax=h[r] : water+=rMax-h[r];
            r--;
        }
    }
    return water;
}
```

### Dry Run Trace
| Line | Trace / State Explanation |
| :--- | :--- |
| 2 | Initialize `l = 0` (val 2), `r = 2` (val 2), `lMax = 0`, `rMax = 0`, `water = 0`. |
| 3 | `0 < 2` is true. Loop starts. |
| 4 | `h[0] (2) < h[2] (2)` is false. Go to `else`. |
| 8 | `h[2] (2) >= rMax (0)` is true. Update `rMax = 2`. |
| 9 | Decrement `r` to `1` (val 0). |
| 3 | `0 < 1` is true. |
| 4 | `h[0] (2) < h[1] (0)` is false. Go to `else`. |
| 8 | `h[1] (0) >= rMax (2)` is false. Add water: `water += 2 - 0 = 2`. |
| 9 | Decrement `r` to `0` (val 2). |
| 3 | `0 < 0` is false. Loop ends. |
| 12 | Returns `water = 2`. |

---

## ✅ Template 5: Dutch National Flag (0s,1s,2s)

**Problem:** Sort an array containing only 0s, 1s, and 2s in-place.

- **Example Input:** `nums = [2, 0, 1]`
- **Example Output:** `[0, 1, 2]`

```cpp
void sortColors(vector<int>& nums) {
    int low=0, mid=0, high=nums.size()-1; // 3 boundaries
    while (mid <= high) {
        if (nums[mid]==0) { swap(nums[low++],nums[mid++]); } // 0→front
        else if (nums[mid]==1) { mid++; }                    // 1→stay
        else { swap(nums[mid],nums[high--]); }               // 2→back, don't advance mid!
    }
}
```

### Dry Run Trace
| Line | Trace / State Explanation |
| :--- | :--- |
| 2 | Initialize `low = 0`, `mid = 0`, `high = 2`. |
| 3 | `0 <= 2` is true. Loop starts. |
| 6 | `nums[0]` is 2. Swap `nums[0]` and `nums[2]`. `nums` is `[1, 0, 2]`. Decrement `high` to `1`. |
| 3 | `0 <= 1` is true. |
| 5 | `nums[0]` is 1. Increment `mid` to `1`. |
| 3 | `1 <= 1` is true. |
| 4 | `nums[1]` is 0. Swap `nums[0]` and `nums[1]`. `nums` is `[0, 1, 2]`. Increment `low` to `1`, `mid` to `2`. |
| 3 | `2 <= 1` is false. Loop terminates. Array is sorted: `[0, 1, 2]`. |

---

## 📊 Complexity Table
| Problem | Time | Space |
|---------|------|-------|
| Two Sum sorted | O(n) | O(1) |
| 3Sum | O(n²) | O(1) |
| Remove Dups | O(n) | O(1) |
| Rain Water | O(n) | O(1) |
| Dutch Flag | O(n) | O(1) |

---

## 🔥 Progressive Problems
### 🟢 Easy
1. LC 167 — Two Sum II (sorted → converging)
2. LC 125 — Valid Palindrome (converging, skip non-alnum)
3. LC 977 — Squares of Sorted Array (fill from back, two ends)
4. LC 344 — Reverse String (swap converging)
5. LC 283 — Move Zeroes (slow-fast partition)

### 🟡 Medium
6. LC 15 — 3Sum (sort + fix + converging)
7. LC 16 — 3Sum Closest (same, track min diff)
8. LC 11 — Container With Most Water (move shorter wall)
9. LC 75 — Sort Colors (Dutch flag)
10. LC 80 — Remove Duplicates II (allow ≤2, slow=2 start)
11. LC 18 — 4Sum (2 nested loops + converging)

### 🔴 Hard
12. LC 42 — Trapping Rain Water (Template 4 above)
13. LC 84 — Largest Rectangle in Histogram (monotonic stack — see file 05)

---

## 💡 Key Problem Solutions

### LC 977 — Squares of Sorted Array
```cpp
vector<int> sortedSquares(vector<int>& nums) {
    int l=0, r=nums.size()-1, pos=r;    // fill result from back
    vector<int> res(nums.size());
    while (l <= r) {
        int ls=nums[l]*nums[l], rs=nums[r]*nums[r];
        if (ls > rs) { res[pos--]=ls; l++; }  // left square bigger → place it
        else { res[pos--]=rs; r--; }           // right square bigger/equal
    }
    return res;
} // Insight: extremes always have largest absolute values
```

### LC 11 — Container With Most Water
```cpp
int maxArea(vector<int>& h) {
    int l=0, r=h.size()-1, ans=0;
    while (l < r) {
        ans = max(ans, (r-l)*min(h[l],h[r])); // area = width × min height
        h[l]<h[r] ? l++ : r--;                // move shorter wall (only hope to improve)
    }
    return ans;
}
```

---

## ⚠️ Common Mistakes
```
❌ Skip duplicates in 3Sum/4Sum → add while-loop after finding triplet
❌ Dutch Flag: advancing mid after swap with high → DON'T (recheck)
❌ Two pointers on unsorted array → must sort first OR use hashmap
❌ Container water: moving wrong (taller) wall → always move SHORTER
```

## 🎓 Interview Tips
- Ask: "Is array sorted?" → if yes, two pointers; if no, consider sorting or hashmap
- Duplicate triplets: always skip duplicates at all pointer levels
- "In-place" keyword → slow-fast pointer (O(1) space)
- Draw the pointer movement on paper in interview

---
*Next → [02_SlidingWindow.md](./02_SlidingWindow.md)*
