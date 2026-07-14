# 10 — Dynamic Programming 🧩

## 🧠 Core Idea
DP = Recursion + Memoization (or bottom-up tabulation). Break problem into overlapping subproblems with optimal substructure.

**4 Steps to solve any DP:**
1. **Define** the state: what does dp[i] (or dp[i][j]) represent?
2. **Recurrence**: how does dp[i] relate to previous states?
3. **Base cases**: smallest valid inputs
4. **Order**: fill table in correct dependency order

**Recognize when:** count ways, min/max cost, feasibility with choices, optimal subsequence

---

## 📐 DP Patterns Map
```
1D DP:       dp[i] depends on dp[i-1], dp[i-2], ...
2D DP:       dp[i][j] depends on dp[i-1][j], dp[i][j-1], dp[i-1][j-1]
Knapsack:    include/exclude item i with weight/value
LCS:         two sequences, match or skip
Interval DP: dp[i][j] = best answer for subarray [i..j]
DP on Trees: answer for subtree rooted at node
DP on Graphs: shortest path, longest path in DAG
Bitmask DP:  dp[mask] = state for subset of elements
```

---

## ✅ Template 1: Fibonacci / Climbing Stairs (1D)
```cpp
int climbStairs(int n) {
    if (n <= 2) return n;
    int prev2=1, prev1=2;                  // dp[1]=1, dp[2]=2
    for (int i=3; i<=n; i++) {
        int curr = prev1 + prev2;          // dp[i] = dp[i-1] + dp[i-2] (1 or 2 steps)
        prev2 = prev1;                     // slide window
        prev1 = curr;
    }
    return prev1;
} // O(n) time, O(1) space after optimization
```

## ✅ Template 2: House Robber (1D, skip adjacent)
```cpp
int rob(vector<int>& nums) {
    int prev2=0, prev1=0;                  // dp before index 0, dp[0]
    for (int num : nums) {
        int curr = max(prev1, prev2+num);  // either skip current OR rob current + prev2
        prev2 = prev1;                     // shift window
        prev1 = curr;
    }
    return prev1;                          // dp[n-1] = max money robbed
} // O(n) time, O(1) space
```

## ✅ Template 3: Longest Increasing Subsequence (LIS)
```cpp
// O(n²) DP approach
int lisNSquared(vector<int>& nums) {
    int n=nums.size();
    vector<int> dp(n, 1);                  // dp[i] = LIS ending at index i (min 1)
    int ans=1;
    for (int i=1; i<n; i++) {
        for (int j=0; j<i; j++) {
            if (nums[j] < nums[i]) {       // can extend LIS ending at j with nums[i]
                dp[i] = max(dp[i], dp[j]+1);
            }
        }
        ans = max(ans, dp[i]);
    }
    return ans;
}

// O(n log n) Patience Sorting (binary search)
int lengthOfLIS(vector<int>& nums) {
    vector<int> tails;                     // tails[i] = smallest tail of LIS of length i+1
    for (int num : nums) {
        auto it = lower_bound(tails.begin(), tails.end(), num); // find first tail >= num
        if (it == tails.end()) tails.push_back(num); // extend LIS
        else *it = num;                    // replace to maintain smallest tail
    }
    return tails.size();
} // O(n log n) time, O(n) space
```

## ✅ Template 4: 0/1 Knapsack
```cpp
int knapsack(int W, vector<int>& weights, vector<int>& values, int n) {
    // dp[i][w] = max value using first i items with capacity w
    vector<vector<int>> dp(n+1, vector<int>(W+1, 0));
    
    for (int i=1; i<=n; i++) {
        for (int w=0; w<=W; w++) {
            dp[i][w] = dp[i-1][w];        // exclude item i
            if (weights[i-1] <= w) {       // can we include item i?
                dp[i][w] = max(dp[i][w], dp[i-1][w-weights[i-1]] + values[i-1]); // include
            }
        }
    }
    return dp[n][W];
}

// Space-optimized (1D)
int knapsack1D(int W, vector<int>& wt, vector<int>& val, int n) {
    vector<int> dp(W+1, 0);
    for (int i=0; i<n; i++) {
        for (int w=W; w>=wt[i]; w--) {   // traverse RIGHT TO LEFT to avoid using item twice
            dp[w] = max(dp[w], dp[w-wt[i]] + val[i]);
        }
    }
    return dp[W];
} // O(n*W) time, O(W) space
```

## ✅ Template 5: Unbounded Knapsack / Coin Change
```cpp
// Minimum coins to make amount (each coin usable many times)
int coinChange(vector<int>& coins, int amount) {
    vector<int> dp(amount+1, INT_MAX);    // dp[i] = min coins for amount i
    dp[0] = 0;                            // base: 0 coins for amount 0
    
    for (int i=1; i<=amount; i++) {
        for (int coin : coins) {
            if (coin <= i && dp[i-coin] != INT_MAX) { // can use this coin
                dp[i] = min(dp[i], dp[i-coin]+1);     // use one more coin
            }
        }
    }
    return dp[amount] == INT_MAX ? -1 : dp[amount];
} // O(amount * coins) time, O(amount) space

// Count ways to make amount (LC 518 — Coin Change II)
int change(int amount, vector<int>& coins) {
    vector<int> dp(amount+1, 0);
    dp[0] = 1;                            // one way to make 0
    for (int coin : coins) {              // outer: coin (ensures no duplicate combinations)
        for (int i=coin; i<=amount; i++) {
            dp[i] += dp[i-coin];          // include this coin
        }
    }
    return dp[amount];
} // Note: reverse loops for combinations, inner=amount for permutations
```

## ✅ Template 6: Longest Common Subsequence (LCS)
```cpp
int longestCommonSubsequence(string a, string b) {
    int m=a.size(), n=b.size();
    vector<vector<int>> dp(m+1, vector<int>(n+1, 0));
    // dp[i][j] = LCS of a[0..i-1] and b[0..j-1]
    
    for (int i=1; i<=m; i++) {
        for (int j=1; j<=n; j++) {
            if (a[i-1] == b[j-1]) {       // chars match → extend LCS
                dp[i][j] = dp[i-1][j-1] + 1;
            } else {                       // no match → take best of skip either
                dp[i][j] = max(dp[i-1][j], dp[i][j-1]);
            }
        }
    }
    return dp[m][n];
} // O(m*n) time and space
```

## ✅ Template 7: Edit Distance (DP on 2 strings)
```cpp
int minDistance(string word1, string word2) {
    int m=word1.size(), n=word2.size();
    vector<vector<int>> dp(m+1, vector<int>(n+1));
    // dp[i][j] = min ops to convert word1[0..i-1] to word2[0..j-1]
    
    for (int i=0; i<=m; i++) dp[i][0]=i;  // delete all i chars from word1
    for (int j=0; j<=n; j++) dp[0][j]=j;  // insert all j chars into empty
    
    for (int i=1; i<=m; i++) {
        for (int j=1; j<=n; j++) {
            if (word1[i-1] == word2[j-1]) {
                dp[i][j] = dp[i-1][j-1];  // chars match → no operation needed
            } else {
                dp[i][j] = 1 + min({dp[i-1][j],    // delete from word1
                                    dp[i][j-1],    // insert into word1
                                    dp[i-1][j-1]}); // replace
            }
        }
    }
    return dp[m][n];
} // O(m*n) time and space
```

## ✅ Template 8: Matrix Chain / Interval DP
```cpp
// Matrix Chain Multiplication: minimize multiplications
int matrixChain(vector<int>& dims) {
    int n=dims.size()-1;                   // n matrices
    vector<vector<int>> dp(n, vector<int>(n, 0));
    // dp[i][j] = min cost to multiply matrices i..j
    
    for (int len=2; len<=n; len++) {       // increasing chain length
        for (int i=0; i<=n-len; i++) {
            int j=i+len-1;
            dp[i][j] = INT_MAX;
            for (int k=i; k<j; k++) {      // split point
                int cost = dp[i][k] + dp[k+1][j] + dims[i]*dims[k+1]*dims[j+1];
                dp[i][j] = min(dp[i][j], cost);
            }
        }
    }
    return dp[0][n-1];
} // O(n³) time, O(n²) space — general interval DP pattern
```

## ✅ Template 9: DP on Strings — Palindrome
```cpp
// Longest Palindromic Subsequence
int longestPalindromeSubseq(string s) {
    int n=s.size();
    string rev=s; reverse(rev.begin(),rev.end());
    return longestCommonSubsequence(s, rev); // LPS = LCS(s, reverse(s))
}

// Minimum insertions to make palindrome
int minInsertions(string s) {
    return s.size() - longestPalindromeSubseq(s); // insert what's missing
}

// Count palindromic substrings
int countSubstrings(string s) {
    int n=s.size(), count=0;
    vector<vector<bool>> dp(n, vector<bool>(n, false));
    for (int i=n-1; i>=0; i--) {          // fill bottom-up, shorter substrings first
        for (int j=i; j<n; j++) {
            if (s[i]==s[j] && (j-i<=2 || dp[i+1][j-1])) { // match + inner is palindrome
                dp[i][j]=true; count++;
            }
        }
    }
    return count;
}
```

## ✅ Template 10: DP on Trees
```cpp
// Max path sum in binary tree (process subtrees before node)
pair<int,int> dpOnTree(TreeNode* node) {
    if (!node) return {0, INT_MIN};        // {max single path, answer}
    auto [lPath, lAns] = dpOnTree(node->left);
    auto [rPath, rAns] = dpOnTree(node->right);
    
    int singlePath = node->val + max(0, max(lPath, rPath)); // extend one side
    int throughNode = node->val + max(0,lPath) + max(0,rPath); // use both sides
    int ans = max({lAns, rAns, throughNode}); // update global answer
    return {singlePath, ans};
}
```

---

## 📊 DP Patterns Quick Reference
| Pattern | State Definition | Recurrence |
|---------|-----------------|------------|
| 1D (stairs) | dp[i] = ways to reach i | dp[i] = dp[i-1]+dp[i-2] |
| House Robber | dp[i] = max money up to i | dp[i] = max(dp[i-1], dp[i-2]+nums[i]) |
| 0/1 Knapsack | dp[i][w] = max value | include or exclude item i |
| Coin Change | dp[i] = min coins | dp[i] = min(dp[i-coin])+1 |
| LCS | dp[i][j] = LCS length | match: +1; else: max(skip either) |
| Edit Distance | dp[i][j] = min ops | match: dp[i-1][j-1]; else: 1+min(3 ops) |
| LIS | dp[i] = LIS ending at i | max(dp[j]+1) for all j<i where nums[j]<nums[i] |
| Palindrome | dp[i][j] = is palindrome | s[i]==s[j] && dp[i+1][j-1] |

---

## 🔥 Progressive Problems
### 🟢 Easy
1. LC 70 — Climbing Stairs (Template 1)
2. LC 198 — House Robber (Template 2)
3. LC 338 — Counting Bits (dp[i] = dp[i>>1] + (i&1))
4. LC 746 — Min Cost Climbing Stairs
5. LC 509 — Fibonacci Number

### 🟡 Medium
6. LC 300 — LIS (Template 3, O(n log n) solution)
7. LC 322 — Coin Change (Template 5)
8. LC 518 — Coin Change II (count combinations)
9. LC 1143 — LCS (Template 6)
10. LC 72 — Edit Distance (Template 7)
11. LC 416 — Partition Equal Subset Sum (0/1 knapsack)
12. LC 647 — Palindromic Substrings (Template 9)
13. LC 152 — Maximum Product Subarray (track min & max)
14. LC 91 — Decode Ways (1D DP, check 1 and 2 digit)
15. LC 139 — Word Break (DP + dictionary lookup)

### 🔴 Hard
16. LC 312 — Burst Balloons (Interval DP)
17. LC 1235 — Max Profit in Job Scheduling (DP + binary search)
18. LC 87 — Scramble String (3D interval DP)
19. LC 10 — Regular Expression Matching (2D DP)
20. LC 115 — Distinct Subsequences (2D DP on strings)

---

## 💡 Key Problem Solutions

### LC 416 — Partition Equal Subset Sum (0/1 Knapsack as boolean)
```cpp
bool canPartition(vector<int>& nums) {
    int sum=accumulate(nums.begin(),nums.end(),0);
    if (sum%2) return false;               // odd sum → impossible
    int target=sum/2;
    vector<bool> dp(target+1, false);
    dp[0]=true;                            // can always make sum 0
    for (int num : nums) {
        for (int j=target; j>=num; j--) { // right to left (0/1 knapsack)
            dp[j] = dp[j] || dp[j-num];   // include or exclude num
        }
    }
    return dp[target];
}
```

### LC 312 — Burst Balloons (Interval DP)
```cpp
int maxCoins(vector<int>& nums) {
    nums.insert(nums.begin(),1); nums.push_back(1); // add boundary 1s
    int n=nums.size();
    vector<vector<int>> dp(n, vector<int>(n, 0));
    // dp[i][j] = max coins from bursting all balloons between i and j (exclusive)
    
    for (int len=2; len<n; len++) {       // window length
        for (int i=0; i<n-len; i++) {
            int j=i+len;
            for (int k=i+1; k<j; k++) {  // k = LAST balloon to burst in [i+1..j-1]
                dp[i][j] = max(dp[i][j], dp[i][k]+nums[i]*nums[k]*nums[j]+dp[k][j]);
            }
        }
    }
    return dp[0][n-1];
} // Key insight: think of k as LAST to burst, so boundaries nums[i] and nums[j] still exist
```

### LC 139 — Word Break
```cpp
bool wordBreak(string s, vector<string>& wordDict) {
    unordered_set<string> dict(wordDict.begin(), wordDict.end());
    int n=s.size();
    vector<bool> dp(n+1, false);
    dp[0]=true;                            // empty string can always be segmented
    for (int i=1; i<=n; i++) {
        for (int j=0; j<i; j++) {
            if (dp[j] && dict.count(s.substr(j, i-j))) { // s[j..i-1] is a word
                dp[i]=true; break;
            }
        }
    }
    return dp[n];
}
```

---

## ⚠️ Common Mistakes
```
❌ Wrong base cases (dp[0] not initialized)
   Fix: trace through base case manually

❌ 0/1 Knapsack: traversing left to right (allows reuse)
   Fix: traverse RIGHT TO LEFT for 0/1 (no reuse)

❌ Unbounded Knapsack: traversing right to left (limits reuse)
   Fix: traverse LEFT TO RIGHT for unbounded

❌ Interval DP: wrong loop order (longer before shorter)
   Fix: outer loop = length, inner = start position

❌ LCS: off-by-one indexing (1-indexed dp vs 0-indexed string)
   Fix: dp[i][j] corresponds to s1[i-1] and s2[j-1]
```

## 🎓 Interview Tips
- **State = "what info do I need to make optimal decisions at this point?"**
- **Top-down (memoization)** = easier to implement, start here
- **Bottom-up (tabulation)** = better constants, no recursion overhead
- **Space optimization**: if dp[i] only needs dp[i-1], use 2 variables
- **Drawing the table** for 2D DP helps find the recurrence visually
- **Coin change = bottom-up unbounded knapsack** (learn both interpretations)

---
*Next → [11_Greedy.md](./11_Greedy.md)*
