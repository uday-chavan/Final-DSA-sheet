# 02 — Sliding Window 🪟

## 🧠 Core Idea
Maintain a window [left, right] over an array/string. Expand right, shrink left when constraint violated. Avoids re-computing overlapping subproblems.

**Recognize when:** subarray/substring + constraint (≤k distinct, sum=target, at most, at least), "contiguous", "window of size k"

**Two types:**
- **Fixed size**: window is always k wide
- **Variable size**: expand until invalid, shrink until valid

---

## 📐 Visual
```
Fixed k=3:   [a, b, c, d, e]   →window→   slides right
              [___]  [___]

Variable:    [a, b, c, b, a]
              L     R           expand R until invalid, shrink L
```

---

## ✅ Template 1: Fixed Window (Max/Sum of k elements)
```cpp
int maxSumK(vector<int>& arr, int k) {
    int windowSum = 0, maxSum = 0;
    
    // Build first window
    for (int i = 0; i < k; i++) windowSum += arr[i]; // sum first k elements
    maxSum = windowSum;                                // initial max
    
    // Slide window: add new right element, remove old left element
    for (int i = k; i < (int)arr.size(); i++) {
        windowSum += arr[i];       // add element entering window from right
        windowSum -= arr[i-k];    // remove element leaving window from left
        maxSum = max(maxSum, windowSum); // update max
    }
    return maxSum;
} // O(n) time, O(1) space
```

## ✅ Template 2: Variable Window — Longest with Constraint
```cpp
int longestSubarray(vector<int>& arr, int maxSum) {
    int left = 0, currSum = 0, maxLen = 0;
    
    for (int right = 0; right < (int)arr.size(); right++) {
        currSum += arr[right];               // expand: include right element
        
        while (currSum > maxSum) {           // constraint violated
            currSum -= arr[left];            // shrink: remove left element
            left++;                          // move left boundary right
        }
        maxLen = max(maxLen, right-left+1);  // window size = right-left+1
    }
    return maxLen;
} // O(n) time, O(1) space
```

## ✅ Template 3: Variable Window — At Most K Distinct Characters
```cpp
int lengthOfLongestSubstringKDistinct(string s, int k) {
    unordered_map<char,int> freq;            // frequency map for window
    int left = 0, maxLen = 0;
    
    for (int right = 0; right < (int)s.size(); right++) {
        freq[s[right]]++;                    // add right char to window
        
        while ((int)freq.size() > k) {       // more than k distinct → shrink
            freq[s[left]]--;                 // remove left char freq
            if (freq[s[left]] == 0) freq.erase(s[left]); // remove if count=0
            left++;                          // shrink window from left
        }
        maxLen = max(maxLen, right-left+1);  // update max valid window
    }
    return maxLen;
} // O(n) time, O(k) space
```

## ✅ Template 4: Minimum Window Substring (Hard)
```cpp
string minWindow(string s, string t) {
    unordered_map<char,int> need;             // chars needed from t
    for (char c : t) need[c]++;              // count each char in t
    
    int left=0, have=0, total=need.size();   // have=satisfied chars, total=needed distinct
    int minLen=INT_MAX, minStart=0;
    unordered_map<char,int> window;           // current window freq
    
    for (int right=0; right < (int)s.size(); right++) {
        char c = s[right];
        window[c]++;                          // add right char to window
        // if this char's count satisfies the need exactly, increment have
        if (need.count(c) && window[c]==need[c]) have++;
        
        while (have == total) {               // all chars satisfied → try to shrink
            if (right-left+1 < minLen) {      // update minimum window
                minLen = right-left+1;
                minStart = left;
            }
            window[s[left]]--;               // remove left char from window
            if (need.count(s[left]) && window[s[left]] < need[s[left]]) have--; // unsatisfied
            left++;                          // shrink from left
        }
    }
    return minLen==INT_MAX ? "" : s.substr(minStart, minLen);
} // O(n+m) time, O(n+m) space
```

## ✅ Template 5: Fixed Window with Hash (Anagram / Permutation)
```cpp
bool findAnagram(string s, string p) {
    if (s.size() < p.size()) return false;
    vector<int> pCount(26,0), wCount(26,0); // frequency arrays
    
    // Count first window and pattern
    for (int i=0; i < (int)p.size(); i++) {
        pCount[p[i]-'a']++;    // pattern freq
        wCount[s[i]-'a']++;    // first window freq
    }
    
    for (int i=p.size(); i < (int)s.size(); i++) {
        if (pCount == wCount) return true; // window matches pattern
        wCount[s[i]-'a']++;               // add new right char
        wCount[s[i-p.size()]-'a']--;      // remove old left char (slide)
    }
    return pCount == wCount;              // check last window
} // O(n) time, O(1) space (26 chars)
```

## ✅ Template 6: Longest Repeating Character Replacement (Tricky)
```cpp
int characterReplacement(string s, int k) {
    vector<int> freq(26, 0);              // freq of chars in window
    int left=0, maxFreq=0, ans=0;
    
    for (int right=0; right < (int)s.size(); right++) {
        freq[s[right]-'A']++;             // add right char
        maxFreq = max(maxFreq, freq[s[right]-'A']); // track max freq in window
        
        // window invalid if: (window_size - max_freq) > k
        // i.e., chars to replace > k
        while ((right-left+1) - maxFreq > k) {
            freq[s[left]-'A']--;          // shrink: remove left char
            left++;
            // Note: maxFreq is NOT updated here (optimization — valid because
            // we only care when maxFreq increases, not when it decreases)
        }
        ans = max(ans, right-left+1);    // update max valid window
    }
    return ans;
} // O(n) time, O(1) space
```

---

## 📊 Complexity Table
| Problem | Time | Space |
|---------|------|-------|
| Fixed window max sum | O(n) | O(1) |
| Longest subarray (sum ≤ k) | O(n) | O(1) |
| K distinct chars | O(n) | O(k) |
| Min window substring | O(n+m) | O(n+m) |
| Anagram / permutation | O(n) | O(1) |
| Char replacement | O(n) | O(1) |

---

## 🔥 Progressive Problems
### 🟢 Easy
1. LC 643 — Maximum Average Subarray I (fixed k window)
2. LC 1876 — Substrings of Size 3 with Distinct Chars (fixed k=3)
3. LC 1343 — Number of Sub-arrays of Size K with Average ≥ Threshold

### 🟡 Medium
4. LC 3 — Longest Substring Without Repeating Chars (variable, set/map)
5. LC 424 — Longest Repeating Char Replacement (Template 6)
6. LC 567 — Permutation in String (fixed window anagram, Template 5)
7. LC 438 — Find All Anagrams in a String (same as 567, collect starts)
8. LC 904 — Fruit Into Baskets (at most 2 distinct, Template 3)
9. LC 1004 — Max Consecutive Ones III (at most k zeros, Template 2)
10. LC 992 — Subarrays with K Different Integers (at-most-k trick)

### 🔴 Hard
11. LC 76 — Minimum Window Substring (Template 4)
12. LC 239 — Sliding Window Maximum (monotonic deque — see file 05)
13. LC 30 — Substring with Concatenation of All Words (fixed multi-word window)

---

## 💡 Key Problem Walkthroughs

### LC 3 — Longest Substring Without Repeating Chars
```cpp
int lengthOfLongestSubstring(string s) {
    unordered_set<char> window;             // chars currently in window
    int left=0, maxLen=0;
    for (int right=0; right < (int)s.size(); right++) {
        while (window.count(s[right])) {    // duplicate found → shrink
            window.erase(s[left++]);        // remove leftmost char
        }
        window.insert(s[right]);            // add new char to window
        maxLen = max(maxLen, right-left+1); // update max
    }
    return maxLen;
}
```

### LC 992 — Subarrays with K Different Integers (at-most trick)
```cpp
// Key insight: exactly(k) = atMost(k) - atMost(k-1)
int atMost(vector<int>& A, int k) {
    unordered_map<int,int> freq;
    int left=0, res=0;
    for (int right=0; right < (int)A.size(); right++) {
        if (!freq[A[right]]++) k--;          // new distinct element → decrease k
        while (k < 0) {                      // too many distinct → shrink
            if (!--freq[A[left]]) k++;       // removing a distinct → increase k
            left++;
        }
        res += right-left+1;                 // all subarrays ending at right
    }
    return res;
}
int subarraysWithKDistinct(vector<int>& A, int K) {
    return atMost(A,K) - atMost(A,K-1);
}
```

---

## ⚠️ Common Mistakes
```
❌ Fixed window: forgetting to remove arr[i-k] when sliding
   Fix: windowSum += arr[right] - arr[right-k]

❌ Variable window: using if instead of while to shrink
   Fix: use while(constraint_violated) to fully shrink

❌ Char replacement: updating maxFreq when shrinking
   Fix: don't decrement maxFreq when shrinking (safe optimization)

❌ Anagram check: comparing strings instead of freq arrays
   Fix: compare int[26] arrays — O(1) per comparison

❌ Minimum window: not checking all chars when have==total
   Fix: inner while loop tries to shrink as much as possible
```

## 🎓 Interview Tips
- "Contiguous subarray/substring" + some constraint → Sliding Window
- **Exactly k** problems → use "atMost(k) - atMost(k-1)" trick
- Fixed window: compute first window, then slide (add right, remove left)
- Variable window: expand freely, shrink when violated
- Use frequency array (int[26]) for lowercase letters — faster than map

---
*Next → [03_BinarySearch.md](./03_BinarySearch.md)*
