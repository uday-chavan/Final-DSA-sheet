# 12 — Tries (Prefix Trees) 🌲

## 🧠 Core Idea
Trie = tree for string prefix operations. Each node has children[26] (for lowercase). Enables O(L) insert/search/prefix where L = word length.

**Recognize when:** autocomplete, prefix matching, word dictionary, longest common prefix, word search with many queries

---

## 📐 Visual
```
Insert: "cat", "car", "care", "bat"

root
├── c
│   └── a
│       ├── t (end)
│       └── r (end)
│           └── e (end)
└── b
    └── a
        └── t (end)

Search "car"  → root→c→a→r → is_end=true → found
Prefix "ca"  → root→c→a → exists → true
```

---

## ✅ Template 1: Basic Trie (Insert, Search, StartsWith)
```cpp
struct TrieNode {
    TrieNode* children[26];                // pointer to each letter
    bool isEnd;                            // marks end of a word
    TrieNode() : isEnd(false) { fill(children, children+26, nullptr); }
};

class Trie {
    TrieNode* root;
public:
    Trie() { root = new TrieNode(); }
    
    void insert(string word) {
        TrieNode* node = root;
        for (char c : word) {
            int idx = c-'a';               // index 0-25
            if (!node->children[idx])      // node doesn't exist → create
                node->children[idx] = new TrieNode();
            node = node->children[idx];    // move to child
        }
        node->isEnd = true;                // mark end of word
    }
    
    bool search(string word) {
        TrieNode* node = root;
        for (char c : word) {
            int idx = c-'a';
            if (!node->children[idx]) return false; // path breaks → not found
            node = node->children[idx];
        }
        return node->isEnd;                // must be marked end (exact match)
    }
    
    bool startsWith(string prefix) {
        TrieNode* node = root;
        for (char c : prefix) {
            int idx = c-'a';
            if (!node->children[idx]) return false;
            node = node->children[idx];
        }
        return true;                       // any word starts with prefix (don't check isEnd)
    }
};
// O(L) insert/search/prefix, O(26*N*L) space where N=words
```

## ✅ Template 2: Word Dictionary (Wildcard '.')
```cpp
class WordDictionary {
    TrieNode* root;
    bool dfs(TrieNode* node, string& word, int idx) {
        if (idx == (int)word.size()) return node->isEnd;
        char c = word[idx];
        if (c == '.') {                    // wildcard: try all 26 children
            for (int i=0; i<26; i++)
                if (node->children[i] && dfs(node->children[i], word, idx+1))
                    return true;
            return false;
        } else {
            int i = c-'a';
            return node->children[i] && dfs(node->children[i], word, idx+1);
        }
    }
public:
    WordDictionary() { root = new TrieNode(); }
    void addWord(string word) { /* same as Trie insert */ }
    bool search(string word) { return dfs(root, word, 0); }
};
```

## ✅ Template 3: Word Search II (Trie + Backtracking)
```cpp
void dfs(vector<vector<char>>& board, TrieNode* node, int r, int c,
         string& curr, vector<string>& result) {
    if (r<0||r>=(int)board.size()||c<0||c>=(int)board[0].size()) return;
    char ch = board[r][c];
    if (ch=='#' || !node->children[ch-'a']) return; // visited or no trie path
    
    node = node->children[ch-'a'];        // move down trie
    curr += ch;                            // add char to current word
    if (node->isEnd) {                    // found a word
        result.push_back(curr);
        node->isEnd = false;              // avoid duplicate results
    }
    board[r][c]='#';                      // mark visited
    dfs(board,node,r+1,c,curr,result);
    dfs(board,node,r-1,c,curr,result);
    dfs(board,node,r,c+1,curr,result);
    dfs(board,node,r,c-1,curr,result);
    board[r][c]=ch;                       // restore
    curr.pop_back();
}
vector<string> findWords(vector<vector<char>>& board, vector<string>& words) {
    TrieNode* root = new TrieNode();
    for (auto& w : words) { /* insert w into trie */ }
    vector<string> result; string curr;
    for (int r=0; r<(int)board.size(); r++)
        for (int c=0; c<(int)board[0].size(); c++)
            dfs(board, root, r, c, curr, result);
    return result;
} // O(m*n*4^L) time
```

## ✅ Template 4: Maximum XOR of Two Numbers (XOR Trie)
```cpp
struct XorTrie {
    XorTrie* ch[2];                        // binary: 0 or 1
    XorTrie() { ch[0]=ch[1]=nullptr; }
    
    void insert(int num) {
        XorTrie* node=this;
        for (int i=31; i>=0; i--) {        // MSB first
            int bit=(num>>i)&1;
            if (!node->ch[bit]) node->ch[bit]=new XorTrie();
            node=node->ch[bit];
        }
    }
    int maxXor(int num) {
        XorTrie* node=this;
        int xorVal=0;
        for (int i=31; i>=0; i--) {
            int bit=(num>>i)&1, want=1-bit; // want opposite bit for max XOR
            if (node->ch[want]) { xorVal|=(1<<i); node=node->ch[want]; }
            else if (node->ch[bit]) node=node->ch[bit];
        }
        return xorVal;
    }
};
int findMaximumXOR(vector<int>& nums) {
    XorTrie trie;
    for (int n : nums) trie.insert(n);
    int ans=0;
    for (int n : nums) ans=max(ans, trie.maxXor(n));
    return ans;
} // O(32n) time
```

---

## 🔥 Progressive Problems
### 🟢 Easy
1. LC 14 — Longest Common Prefix (insert all + find min depth with one child)
2. LC 648 — Replace Words (use trie to find shortest root)

### 🟡 Medium
3. LC 208 — Implement Trie (Template 1)
4. LC 211 — Design Add and Search Words (Template 2)
5. LC 820 — Short Encoding of Words (reverse words in trie)
6. LC 1268 — Search Suggestions System (prefix search + collect top 3)

### 🔴 Hard
7. LC 212 — Word Search II (Template 3)
8. LC 421 — Maximum XOR of Two Numbers (Template 4)
9. LC 745 — Prefix and Suffix Search (composite key trie)

---

## ⚠️ Common Mistakes
```
❌ Checking isEnd in startsWith → returns false for valid prefixes
   Fix: startsWith only traverses, doesn't check isEnd

❌ Not deleting duplicate words in Word Search II
   Fix: set node->isEnd=false after finding to avoid re-adding

❌ XOR trie: starting from LSB instead of MSB
   Fix: always start from bit 31 down to 0

❌ Memory leaks with raw pointers
   Fix: use smart pointers or implement destructor
```

## 🎓 Interview Tips
- **Trie vs HashMap**: Trie wins for prefix queries; HashMap for exact match
- **Space**: Trie uses O(26×N×L); can optimize with unordered_map<char, TrieNode*>
- **Trie of reversed strings**: enables suffix queries
- **Pruning in Word Search II**: remove words from trie as found → huge speedup

---
*Next → [13_UnionFind_DSU.md](./13_UnionFind_DSU.md)*
