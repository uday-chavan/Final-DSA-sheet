# 09 — Recursion & Backtracking 🔄

## 🧠 Core Idea
Backtracking = DFS with undo. Build solution incrementally, abandon (backtrack) when constraint is violated. Template: choose → explore → unchoose.

**Recognize when:** generate ALL combinations/permutations/subsets, Sudoku/N-Queens, word search, partition string

---

## 📐 Visual
```
Subsets of [1,2,3]:
                    []
          /          |          \
        [1]         [2]         [3]
       /   \          \
    [1,2] [1,3]      [2,3]
      |
   [1,2,3]

At each step: CHOOSE to include or exclude current element
```

---

## ✅ Template 1: Subsets (All 2^n subsets)
```cpp
void backtrack(vector<int>& nums, int start, vector<int>& curr, vector<vector<int>>& result) {
    result.push_back(curr);                // add current subset (including empty)
    
    for (int i = start; i < (int)nums.size(); i++) {
        curr.push_back(nums[i]);           // CHOOSE: include nums[i]
        backtrack(nums, i+1, curr, result); // EXPLORE: recurse with next elements
        curr.pop_back();                   // UNCHOOSE: remove nums[i] (backtrack)
    }
}
vector<vector<int>> subsets(vector<int>& nums) {
    vector<vector<int>> result;
    vector<int> curr;
    backtrack(nums, 0, curr, result);
    return result;
} // O(2^n * n) time, O(n) extra space
```

## ✅ Template 2: Combinations (Choose k from n)
```cpp
void backtrack(int n, int k, int start, vector<int>& curr, vector<vector<int>>& result) {
    if ((int)curr.size() == k) {           // found valid combination of size k
        result.push_back(curr);
        return;
    }
    // Pruning: need (k-curr.size()) more elements, at most (n-i+1) available
    for (int i = start; i <= n-(k-curr.size())+1; i++) { // pruning optimization
        curr.push_back(i);                 // CHOOSE
        backtrack(n, k, i+1, curr, result); // EXPLORE
        curr.pop_back();                   // UNCHOOSE
    }
}
vector<vector<int>> combine(int n, int k) {
    vector<vector<int>> result;
    vector<int> curr;
    backtrack(n, k, 1, curr, result);
    return result;
}
```

## ✅ Template 3: Permutations (All n! orderings)
```cpp
void backtrack(vector<int>& nums, vector<bool>& used, vector<int>& curr, vector<vector<int>>& res) {
    if ((int)curr.size() == (int)nums.size()) { // used all elements
        res.push_back(curr);
        return;
    }
    for (int i = 0; i < (int)nums.size(); i++) {
        if (used[i]) continue;             // skip already used elements
        used[i] = true;                    // CHOOSE: mark as used
        curr.push_back(nums[i]);
        backtrack(nums, used, curr, res);  // EXPLORE
        curr.pop_back();                   // UNCHOOSE
        used[i] = false;                   // unmark
    }
}
vector<vector<int>> permute(vector<int>& nums) {
    vector<vector<int>> res;
    vector<bool> used(nums.size(), false);
    vector<int> curr;
    backtrack(nums, used, curr, res);
    return res;
} // O(n! * n) time

// Permutations with duplicates
void backtrackUniq(vector<int>& nums, vector<bool>& used, vector<int>& curr, vector<vector<int>>& res) {
    if (curr.size() == nums.size()) { res.push_back(curr); return; }
    for (int i=0; i<(int)nums.size(); i++) {
        if (used[i]) continue;
        if (i>0 && nums[i]==nums[i-1] && !used[i-1]) continue; // skip duplicate at same level
        used[i]=true; curr.push_back(nums[i]);
        backtrackUniq(nums, used, curr, res);
        curr.pop_back(); used[i]=false;
    }
}
```

## ✅ Template 4: Combination Sum (Reuse allowed)
```cpp
void backtrack(vector<int>& candidates, int target, int start, vector<int>& curr, vector<vector<int>>& res) {
    if (target == 0) {                     // found valid combination
        res.push_back(curr);
        return;
    }
    for (int i = start; i < (int)candidates.size(); i++) {
        if (candidates[i] > target) break; // pruning: sorted, no point continuing
        curr.push_back(candidates[i]);
        backtrack(candidates, target-candidates[i], i, curr, res); // i not i+1 (reuse allowed)
        curr.pop_back();
    }
}
vector<vector<int>> combinationSum(vector<int>& candidates, int target) {
    sort(candidates.begin(), candidates.end()); // sort for pruning
    vector<vector<int>> res;
    vector<int> curr;
    backtrack(candidates, target, 0, curr, res);
    return res;
}
```

## ✅ Template 5: Word Search (Grid Backtracking)
```cpp
bool dfs(vector<vector<char>>& board, string& word, int idx, int r, int c) {
    if (idx == (int)word.size()) return true; // all chars matched
    if (r<0||r>=(int)board.size()||c<0||c>=(int)board[0].size()) return false; // out of bounds
    if (board[r][c] != word[idx]) return false; // wrong char
    
    char temp = board[r][c];
    board[r][c] = '#';                     // CHOOSE: mark visited (in-place)
    
    // EXPLORE all 4 directions
    bool found = dfs(board,word,idx+1,r+1,c) || dfs(board,word,idx+1,r-1,c) ||
                 dfs(board,word,idx+1,r,c+1) || dfs(board,word,idx+1,r,c-1);
    
    board[r][c] = temp;                    // UNCHOOSE: restore
    return found;
}
bool exist(vector<vector<char>>& board, string word) {
    for (int r=0; r<(int)board.size(); r++)
        for (int c=0; c<(int)board[0].size(); c++)
            if (dfs(board, word, 0, r, c)) return true;
    return false;
}
```

## ✅ Template 6: N-Queens
```cpp
bool isSafe(vector<string>& board, int row, int col, int n) {
    for (int i=0; i<row; i++) if (board[i][col]=='Q') return false; // same column
    for (int i=row-1,j=col-1; i>=0&&j>=0; i--,j--) if (board[i][j]=='Q') return false; // diagonal
    for (int i=row-1,j=col+1; i>=0&&j<n;  i--,j++) if (board[i][j]=='Q') return false; // anti-diagonal
    return true;
}
void solve(int row, int n, vector<string>& board, vector<vector<string>>& res) {
    if (row == n) { res.push_back(board); return; } // placed all queens
    for (int col=0; col<n; col++) {
        if (isSafe(board, row, col, n)) {
            board[row][col] = 'Q';         // CHOOSE: place queen
            solve(row+1, n, board, res);   // EXPLORE: next row
            board[row][col] = '.';         // UNCHOOSE: remove queen
        }
    }
}
vector<vector<string>> solveNQueens(int n) {
    vector<string> board(n, string(n,'.'));
    vector<vector<string>> res;
    solve(0, n, board, res);
    return res;
}
```

## ✅ Template 7: Palindrome Partitioning
```cpp
bool isPalin(string& s, int l, int r) {
    while (l<r) if (s[l++]!=s[r--]) return false;
    return true;
}
void backtrack(string& s, int start, vector<string>& curr, vector<vector<string>>& res) {
    if (start == (int)s.size()) { res.push_back(curr); return; } // partitioned whole string
    for (int end=start; end<(int)s.size(); end++) {
        if (isPalin(s, start, end)) {           // only branch if palindrome
            curr.push_back(s.substr(start, end-start+1)); // CHOOSE
            backtrack(s, end+1, curr, res);     // EXPLORE
            curr.pop_back();                    // UNCHOOSE
        }
    }
}
```

---

## 📊 Complexity Table
| Problem | Time | Space |
|---------|------|-------|
| Subsets | O(2^n × n) | O(n) |
| Permutations | O(n! × n) | O(n) |
| Combinations (k of n) | O(C(n,k) × k) | O(k) |
| Word Search | O(m×n×4^L) | O(L) |
| N-Queens | O(n!) | O(n²) |

---

## 🔥 Progressive Problems
### 🟢 Easy
1. LC 78 — Subsets (Template 1)
2. LC 77 — Combinations (Template 2)
3. LC 784 — Letter Case Permutation (backtrack on each char)

### 🟡 Medium
4. LC 46 — Permutations (Template 3)
5. LC 39 — Combination Sum (Template 4, reuse)
6. LC 40 — Combination Sum II (no reuse, handle duplicates)
7. LC 131 — Palindrome Partitioning (Template 7)
8. LC 90 — Subsets II (handle duplicates, sort+skip)
9. LC 79 — Word Search (Template 5)
10. LC 22 — Generate Parentheses (add '(' if open<n, ')' if close<open)
11. LC 17 — Letter Combinations Phone Number (product of choices)

### 🔴 Hard
12. LC 51 — N-Queens (Template 6)
13. LC 52 — N-Queens II (count solutions only)
14. LC 37 — Sudoku Solver (grid backtracking, 9x9)
15. LC 212 — Word Search II (Trie + backtracking)

---

## 💡 Key Problem Walkthroughs

### LC 22 — Generate Parentheses
```cpp
void backtrack(int n, int open, int close, string curr, vector<string>& res) {
    if ((int)curr.size() == 2*n) { res.push_back(curr); return; } // used all brackets
    if (open < n) backtrack(n, open+1, close, curr+'(', res);   // can add '(' if open < n
    if (close < open) backtrack(n, open, close+1, curr+')', res); // add ')' only if close < open
}
vector<string> generateParenthesis(int n) {
    vector<string> res;
    backtrack(n, 0, 0, "", res);
    return res;
} // Key insight: valid if at any point close <= open <= n
```

### LC 40 — Combination Sum II (No Reuse, With Duplicates)
```cpp
void backtrack(vector<int>& nums, int target, int start, vector<int>& curr, vector<vector<int>>& res) {
    if (target==0) { res.push_back(curr); return; }
    for (int i=start; i<(int)nums.size(); i++) {
        if (i>start && nums[i]==nums[i-1]) continue; // skip duplicate AT SAME LEVEL
        if (nums[i]>target) break;                   // pruning
        curr.push_back(nums[i]);
        backtrack(nums, target-nums[i], i+1, curr, res); // i+1: no reuse
        curr.pop_back();
    }
}
vector<vector<int>> combinationSum2(vector<int>& candidates, int target) {
    sort(candidates.begin(), candidates.end());
    vector<vector<int>> res; vector<int> curr;
    backtrack(candidates, target, 0, curr, res);
    return res;
}
```

### LC 37 — Sudoku Solver
```cpp
bool isValid(vector<vector<char>>& board, int r, int c, char num) {
    for (int i=0; i<9; i++) {
        if (board[r][i]==num) return false;           // row check
        if (board[i][c]==num) return false;           // col check
        if (board[3*(r/3)+i/3][3*(c/3)+i%3]==num) return false; // 3x3 box
    }
    return true;
}
bool solve(vector<vector<char>>& board) {
    for (int r=0; r<9; r++) for (int c=0; c<9; c++) {
        if (board[r][c]=='.') {
            for (char num='1'; num<='9'; num++) {
                if (isValid(board,r,c,num)) {
                    board[r][c]=num;                  // CHOOSE
                    if (solve(board)) return true;    // EXPLORE
                    board[r][c]='.';                  // UNCHOOSE
                }
            }
            return false;                             // no valid number → backtrack
        }
    }
    return true;                                      // no empty cell → solved
}
```

---

## ⚠️ Common Mistakes
```
❌ Forgetting to remove element after recursion (not backtracking)
   Fix: curr.pop_back() after recursive call

❌ Duplicate subsets/combinations: not skipping same-level duplicates
   Fix: sort + if(i>start && nums[i]==nums[i-1]) continue

❌ Permutations: reusing elements
   Fix: use boolean used[] array

❌ Word search: modifying board but not restoring it
   Fix: save char, set to '#', restore after all 4 directions

❌ Combination sum with reuse: using i+1 instead of i
   Fix: pass i (not i+1) to allow reuse of same element
```

## 🎓 Interview Tips
- **Template is universal**: choose → explore → unchoose
- **Pruning** is key to performance: sort + break when value > remaining
- **Duplicates**: sort + skip `if(i>start && nums[i]==nums[i-1])`
- **Visited array** for permutations (can't reuse), `start` index for combinations
- **State space tree**: draw first 2-3 levels to understand branching

---
*Next → [10_DynamicProgramming.md](./10_DynamicProgramming.md)*
