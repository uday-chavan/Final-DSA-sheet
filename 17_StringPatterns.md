# 17 — String Patterns 🔤

## 🧠 Core Idea
String problems: hashing (anagram/palindrome), KMP (pattern matching), Z-algorithm, rolling hash, Manacher's (palindromes).

**Recognize when:** pattern in text, anagram, palindrome, string parsing, substring matching

---

## ✅ Template 1: KMP (Knuth-Morris-Pratt) — O(n+m) Pattern Matching
```cpp
vector<int> buildLPS(string pattern) {   // Longest Proper Prefix = Suffix
    int m=pattern.size();
    vector<int> lps(m, 0);              // lps[i] = length of longest proper prefix-suffix
    int len=0, i=1;
    while (i < m) {
        if (pattern[i] == pattern[len]) {
            lps[i++] = ++len;            // match: extend prefix-suffix, advance both
        } else if (len) {
            len = lps[len-1];            // mismatch: use last known prefix-suffix (don't advance i)
        } else {
            lps[i++] = 0;               // no prefix-suffix: lps=0, advance i
        }
    }
    return lps;
}
vector<int> kmpSearch(string text, string pattern) {
    int n=text.size(), m=pattern.size();
    vector<int> lps=buildLPS(pattern);
    vector<int> matches;                 // start indices of matches
    int i=0, j=0;                        // i=text idx, j=pattern idx
    while (i < n) {
        if (text[i]==pattern[j]) { i++; j++; }
        if (j==m) {                      // full match found
            matches.push_back(i-j);      // start of match
            j=lps[j-1];                  // continue searching (overlapping matches)
        } else if (i<n && text[i]!=pattern[j]) {
            j ? j=lps[j-1] : i++;       // mismatch: use lps or advance text
        }
    }
    return matches;
} // O(n+m) time, O(m) space
```

## ✅ Template 2: Rolling Hash (Rabin-Karp)
```cpp
vector<int> rabinKarp(string text, string pattern) {
    long long MOD=1e9+7, BASE=31;
    int n=text.size(), m=pattern.size();
    vector<int> matches;
    
    auto hash=[&](string& s, int l, int r) { // compute hash of s[l..r]
        long long h=0, pw=1;
        for (int i=r; i>=l; i--) {
            h=(h+(s[i]-'a'+1)*pw)%MOD;
            pw=pw*BASE%MOD;
        }
        return h;
    };
    
    long long pHash=hash(pattern,0,m-1);
    for (int i=0; i<=n-m; i++) {
        if (hash(text,i,i+m-1)==pHash) {  // hash match → verify (avoid collision)
            if (text.substr(i,m)==pattern) matches.push_back(i);
        }
    }
    return matches;
} // O(n*m) worst case (with naive verify), O(n+m) expected

// Efficient rolling hash (precomputed)
struct RollingHash {
    vector<long long> h, pw;
    long long MOD=1e9+7, BASE=31;
    RollingHash(string& s) : h(s.size()+1,0), pw(s.size()+1,1) {
        for (int i=0; i<(int)s.size(); i++) {
            h[i+1]=(h[i]*BASE+(s[i]-'a'+1))%MOD;
            pw[i+1]=pw[i]*BASE%MOD;
        }
    }
    long long get(int l, int r) { // hash of s[l..r] (0-indexed)
        return (h[r+1]-h[l]*pw[r-l+1]%MOD+MOD)%MOD;
    }
};
```

## ✅ Template 3: Z-Algorithm (Pattern in String)
```cpp
vector<int> zFunction(string s) {         // z[i] = length of longest match starting at i with prefix
    int n=s.size();
    vector<int> z(n, 0);
    z[0]=n;                                // whole string matches prefix
    int l=0, r=0;
    for (int i=1; i<n; i++) {
        if (i<r) z[i]=min(r-i, z[i-l]);  // use previously computed z values
        while (i+z[i]<n && s[z[i]]==s[i+z[i]]) z[i]++; // extend match
        if (i+z[i]>r) { l=i; r=i+z[i]; } // update rightmost z-box
    }
    return z;
}
// Pattern matching: concat pattern+"#"+text, find z[i]>=m
```

## ✅ Template 4: Manacher's Algorithm (All Palindromic Substrings in O(n))
```cpp
string manacher(string s) {
    // Transform: "abc" → "#a#b#c#" (handles even-length palindromes)
    string t="#";
    for (char c : s) { t+=c; t+='#'; }
    int n=t.size();
    vector<int> p(n, 0);                  // p[i] = radius of palindrome centered at i
    int c=0, r=0;                         // center and right boundary of rightmost palindrome
    for (int i=0; i<n; i++) {
        int mirror=2*c-i;                 // mirror of i around center c
        if (i<r) p[i]=min(r-i, p[mirror]); // use mirror's value (bounded by r)
        while (i+p[i]+1<n && i-p[i]-1>=0 && t[i+p[i]+1]==t[i-p[i]-1])
            p[i]++;                       // try to expand
        if (i+p[i]>r) { c=i; r=i+p[i]; } // update rightmost palindrome
    }
    int maxLen=0, center=0;
    for (int i=0; i<n; i++) if (p[i]>maxLen) { maxLen=p[i]; center=i; }
    return s.substr((center-maxLen)/2, maxLen); // extract longest palindromic substring
} // O(n) time
```

## ✅ Template 5: Anagram & Frequency Matching
```cpp
bool isAnagram(string s, string t) {
    if (s.size()!=t.size()) return false;
    vector<int> count(26,0);
    for (char c : s) count[c-'a']++;       // count chars in s
    for (char c : t) count[c-'a']--;       // subtract chars in t
    for (int c : count) if (c!=0) return false; // any non-zero → not anagram
    return true;
}

// Group anagrams
vector<vector<string>> groupAnagrams(vector<string>& strs) {
    unordered_map<string,vector<string>> mp;
    for (auto& s : strs) {
        string key=s; sort(key.begin(),key.end()); // sort letters = canonical form
        mp[key].push_back(s);
    }
    vector<vector<string>> result;
    for (auto& [k,v] : mp) result.push_back(v);
    return result;
}
```

---

## 📊 String Algorithm Complexity
| Algorithm | Time | Space | Use Case |
|-----------|------|-------|----------|
| KMP | O(n+m) | O(m) | Pattern matching |
| Z-function | O(n) | O(n) | Pattern matching |
| Rabin-Karp | O(n+m) expected | O(1) | Multiple patterns |
| Manacher | O(n) | O(n) | Longest palindrome |
| Rolling hash | O(n) precompute | O(n) | Substring comparison |

---

## 🔥 Progressive Problems
### 🟢 Easy
1. LC 242 — Valid Anagram (Template 5)
2. LC 387 — First Unique Character (frequency count)
3. LC 409 — Longest Palindrome (count chars, odd chars can be center)

### 🟡 Medium
4. LC 49 — Group Anagrams (Template 5, sort key)
5. LC 647 — Palindromic Substrings (expand around center or DP)
6. LC 5 — Longest Palindromic Substring (Manacher or expand)
7. LC 459 — Repeated Substring Pattern (KMP: check if n divides (n-lps[n-1]))
8. LC 1143 — LCS (see file 10 DP)

### 🔴 Hard
9. LC 28 — Find the Index of First Occurrence (KMP, Template 1)
10. LC 214 — Shortest Palindrome (Z-function or KMP)
11. LC 336 — Palindrome Pairs (Trie or hash map approach)

---

## 💡 Key Solutions

### LC 459 — Repeated Substring Pattern
```cpp
bool repeatedSubstringPattern(string s) {
    string doubled = s+s;                  // concatenate s with itself
    string sub = doubled.substr(1, doubled.size()-2); // remove first and last char
    return sub.find(s) != string::npos;   // if s found in middle → repeated pattern
} // KMP insight: lps[n-1] > 0 && n%(n-lps[n-1])==0
```

### LC 5 — Longest Palindromic Substring (Expand Around Center)
```cpp
string longestPalindrome(string s) {
    int n=s.size(), start=0, maxLen=1;
    auto expand=[&](int l, int r) {
        while (l>=0 && r<n && s[l]==s[r]) { l--; r++; } // expand
        if (r-l-1 > maxLen) { maxLen=r-l-1; start=l+1; }
    };
    for (int i=0; i<n; i++) {
        expand(i,i);   // odd length
        expand(i,i+1); // even length
    }
    return s.substr(start, maxLen);
} // O(n²) time — use Manacher for O(n)
```

---

## ⚠️ Common Mistakes
```
❌ KMP: wrong lps construction (advancing i when you should use lps[len-1])
   Fix: when mismatch and len>0, set len=lps[len-1] WITHOUT advancing i

❌ Anagram: not checking equal length first
   Fix: if(s.size()!=t.size()) return false;

❌ Rolling hash: forgetting to handle modular subtraction (negative values)
   Fix: (a - b + MOD) % MOD to prevent negatives

❌ Palindrome expansion: checking s[l]==s[r] BEFORE boundary check
   Fix: while(l>=0 && r<n && s[l]==s[r])
```

## 🎓 Interview Tips
- **KMP > Brute Force** for pattern matching: mention it shows algorithmic knowledge
- **Rolling hash**: allows O(1) substring comparison after O(n) preprocessing
- **Palindrome**: "expand around center" is O(n²) and easiest; Manacher is O(n)
- **Anagram sorting key**: sort the string → canonical key for hash map grouping

---
*Next → [18_InterviewMasterSheet.md](./18_InterviewMasterSheet.md)*
