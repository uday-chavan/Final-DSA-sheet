# 06 — Trees & BST 🌳

## 🧠 Core Idea
Trees: hierarchical structure. Master DFS (preorder/inorder/postorder) and BFS (level order). BST: left < root < right.

**Recognize when:** path sum, height/depth, LCA, serialize/deserialize, BST validation, level-by-level

---

## 📐 Visual
```
       1
      / \
     2   3
    / \   \
   4   5   6

Preorder:  1,2,4,5,3,6   (root → left → right)
Inorder:   4,2,5,1,3,6   (left → root → right) ← BST sorted order!
Postorder: 4,5,2,6,3,1   (left → right → root)
Level:     1,2,3,4,5,6   (BFS)
```

---

## ✅ Template 1: All Tree Traversals
```cpp
// Recursive (natural and clean)
void preorder(TreeNode* root, vector<int>& res) {
    if (!root) return;
    res.push_back(root->val);   // ROOT first
    preorder(root->left, res);
    preorder(root->right, res);
}
void inorder(TreeNode* root, vector<int>& res) {
    if (!root) return;
    inorder(root->left, res);
    res.push_back(root->val);   // ROOT in middle → sorted for BST
    inorder(root->right, res);
}
void postorder(TreeNode* root, vector<int>& res) {
    if (!root) return;
    postorder(root->left, res);
    postorder(root->right, res);
    res.push_back(root->val);   // ROOT last → process children before parent
}

// Iterative Inorder (common in interviews)
vector<int> inorderIterative(TreeNode* root) {
    stack<TreeNode*> st;
    vector<int> res;
    TreeNode* curr = root;
    while (curr || !st.empty()) {
        while (curr) {              // go as far left as possible
            st.push(curr);
            curr = curr->left;
        }
        curr = st.top(); st.pop(); // process leftmost unvisited
        res.push_back(curr->val);
        curr = curr->right;        // move to right subtree
    }
    return res;
}
```

## ✅ Template 2: Level Order (BFS)
```cpp
vector<vector<int>> levelOrder(TreeNode* root) {
    if (!root) return {};
    vector<vector<int>> result;
    queue<TreeNode*> q;
    q.push(root);                  // start with root
    
    while (!q.empty()) {
        int levelSize = q.size();  // nodes in current level
        vector<int> level;
        
        for (int i=0; i<levelSize; i++) { // process exactly this level
            auto node = q.front(); q.pop();
            level.push_back(node->val);
            if (node->left)  q.push(node->left);  // enqueue children for next level
            if (node->right) q.push(node->right);
        }
        result.push_back(level);
    }
    return result;
} // O(n) time, O(n) space (queue holds one level at a time)
```

## ✅ Template 3: Tree Height / Depth
```cpp
int maxDepth(TreeNode* root) {
    if (!root) return 0;                           // base case: empty = 0
    int left  = maxDepth(root->left);              // height of left subtree
    int right = maxDepth(root->right);             // height of right subtree
    return 1 + max(left, right);                   // current node + taller child
} // O(n) time, O(h) space (h = height, worst O(n) for skewed)
```

## ✅ Template 4: Path Sum Problems
```cpp
// Check if path from root to leaf sums to target
bool hasPathSum(TreeNode* root, int target) {
    if (!root) return false;
    if (!root->left && !root->right)        // leaf node
        return root->val == target;         // check remaining sum
    return hasPathSum(root->left,  target-root->val) ||  // check left path
           hasPathSum(root->right, target-root->val);    // check right path
}

// Maximum path sum (any path, not just root-to-leaf)
int maxSum;
int maxPathSumHelper(TreeNode* root) {
    if (!root) return 0;
    int left  = max(0, maxPathSumHelper(root->left));  // ignore negative paths
    int right = max(0, maxPathSumHelper(root->right));
    maxSum = max(maxSum, root->val+left+right);         // path through this node
    return root->val + max(left, right);                // return max single branch
}
int maxPathSum(TreeNode* root) {
    maxSum = INT_MIN;
    maxPathSumHelper(root);
    return maxSum;
}
```

## ✅ Template 5: Lowest Common Ancestor (LCA)
```cpp
TreeNode* lowestCommonAncestor(TreeNode* root, TreeNode* p, TreeNode* q) {
    if (!root || root==p || root==q) return root; // found p or q or reached null
    
    TreeNode* left  = lowestCommonAncestor(root->left,  p, q); // search left
    TreeNode* right = lowestCommonAncestor(root->right, p, q); // search right
    
    if (left && right) return root;  // p and q in different subtrees → LCA = root
    return left ? left : right;       // both in same subtree → return that side
} // O(n) time, O(h) space
```

## ✅ Template 6: BST Operations
```cpp
// Validate BST
bool isValidBST(TreeNode* root, long min=LONG_MIN, long max=LONG_MAX) {
    if (!root) return true;
    if (root->val <= min || root->val >= max) return false; // out of range
    return isValidBST(root->left,  min, root->val) &&      // left: update max
           isValidBST(root->right, root->val, max);         // right: update min
}

// BST Search
TreeNode* searchBST(TreeNode* root, int val) {
    if (!root || root->val==val) return root;
    return val < root->val ? searchBST(root->left,val) : searchBST(root->right,val);
}

// BST Insert
TreeNode* insertIntoBST(TreeNode* root, int val) {
    if (!root) return new TreeNode(val);  // found correct position
    if (val < root->val) root->left  = insertIntoBST(root->left,  val);
    else                 root->right = insertIntoBST(root->right, val);
    return root;
}

// BST Delete
TreeNode* deleteNode(TreeNode* root, int key) {
    if (!root) return nullptr;
    if (key < root->val) root->left  = deleteNode(root->left,  key);
    else if (key > root->val) root->right = deleteNode(root->right, key);
    else {                                 // found node to delete
        if (!root->left)  return root->right; // replace with right child
        if (!root->right) return root->left;  // replace with left child
        // has both children: replace with inorder successor (min of right subtree)
        TreeNode* succ = root->right;
        while (succ->left) succ = succ->left; // find min in right subtree
        root->val = succ->val;                 // copy successor value
        root->right = deleteNode(root->right, succ->val); // delete successor
    }
    return root;
}
```

## ✅ Template 7: Tree Diameter
```cpp
int diameter = 0;
int diameterHelper(TreeNode* root) {
    if (!root) return 0;
    int left  = diameterHelper(root->left);
    int right = diameterHelper(root->right);
    diameter = max(diameter, left+right);  // path through root = left+right edges
    return 1 + max(left, right);           // return max depth for parent's calculation
}
int diameterOfBinaryTree(TreeNode* root) {
    diameter = 0;
    diameterHelper(root);
    return diameter;
} // O(n) time, O(h) space
```

## ✅ Template 8: Serialize and Deserialize Binary Tree
```cpp
string serialize(TreeNode* root) {
    if (!root) return "null,";              // null marker
    return to_string(root->val)+","
         + serialize(root->left)
         + serialize(root->right);          // preorder serialization
}
TreeNode* deserialize(string data) {
    queue<string> q;
    stringstream ss(data);
    string token;
    while (getline(ss,token,',')) q.push(token); // tokenize by comma
    return build(q);
}
TreeNode* build(queue<string>& q) {
    string val = q.front(); q.pop();
    if (val == "null") return nullptr;      // null → no node
    TreeNode* node = new TreeNode(stoi(val));
    node->left  = build(q);               // rebuild left subtree
    node->right = build(q);               // rebuild right subtree
    return node;
} // O(n) time and space
```

---

## 📊 Complexity Table
| Operation | Average | Worst (Skewed) |
|-----------|---------|----------------|
| BST search/insert/delete | O(log n) | O(n) |
| DFS traversal | O(n) | O(n) |
| BFS (level order) | O(n) | O(n) |
| LCA | O(n) | O(n) |
| Height/diameter | O(n) | O(n) |

---

## 🔥 Progressive Problems
### 🟢 Easy
1. LC 104 — Maximum Depth of Binary Tree (Template 3)
2. LC 226 — Invert Binary Tree (swap left/right recursively)
3. LC 112 — Path Sum (Template 4 part 1)
4. LC 100 — Same Tree (compare both trees recursively)
5. LC 572 — Subtree of Another Tree (same tree check on every node)
6. LC 543 — Diameter of Binary Tree (Template 7)

### 🟡 Medium
7. LC 102 — Binary Tree Level Order Traversal (Template 2)
8. LC 98 — Validate Binary Search Tree (Template 6)
9. LC 235 — LCA of BST (use BST property: if both < root → go left)
10. LC 236 — LCA of Binary Tree (Template 5)
11. LC 113 — Path Sum II (backtracking, collect all paths)
12. LC 124 — Binary Tree Maximum Path Sum (Template 4 part 2)
13. LC 105 — Construct from Preorder and Inorder (split arrays recursively)
14. LC 230 — Kth Smallest in BST (inorder = sorted, count to k)

### 🔴 Hard
15. LC 297 — Serialize and Deserialize Binary Tree (Template 8)
16. LC 99 — Recover BST (two swapped nodes in inorder)
17. LC 968 — Binary Tree Cameras (greedy DFS, 3 states)
18. LC 1028 — Recover a Tree from Preorder Traversal

---

## 💡 Key Problem Walkthroughs

### LC 105 — Construct Tree from Preorder + Inorder
```cpp
TreeNode* build(vector<int>& pre, int ps, int pe,
                vector<int>& in,  int is, int ie,
                unordered_map<int,int>& idx) {
    if (ps>pe || is>ie) return nullptr;
    int rootVal = pre[ps];                           // first of preorder = root
    TreeNode* root = new TreeNode(rootVal);
    int mid = idx[rootVal];                          // root position in inorder
    int leftSize = mid - is;                         // size of left subtree
    root->left  = build(pre,ps+1,ps+leftSize, in,is,mid-1, idx);   // left
    root->right = build(pre,ps+leftSize+1,pe, in,mid+1,ie, idx);   // right
    return root;
}
TreeNode* buildTree(vector<int>& preorder, vector<int>& inorder) {
    unordered_map<int,int> idx;
    for (int i=0; i<(int)inorder.size(); i++) idx[inorder[i]]=i; // val→index map
    return build(preorder,0,preorder.size()-1, inorder,0,inorder.size()-1, idx);
}
```

### LC 230 — Kth Smallest in BST
```cpp
int kthSmallest(TreeNode* root, int k) {
    int count=0, result=0;
    function<void(TreeNode*)> inorder = [&](TreeNode* node) {
        if (!node || count>=k) return;
        inorder(node->left);                         // go left first
        if (++count == k) result = node->val;        // kth visited = kth smallest
        inorder(node->right);
    };
    inorder(root);
    return result;
} // O(k + h) time with early termination
```

---

## ⚠️ Common Mistakes
```
❌ BST validation: comparing only with direct parent
   Fix: pass min/max bounds down (not just parent value)

❌ Diameter: returning edge count vs node count
   Fix: diameter = left+right (edges), depth = 1+max(l,r)

❌ LCA: returning before checking both subtrees
   Fix: always call both sides, return root if both non-null

❌ Level order: processing all nodes instead of just current level
   Fix: save levelSize = q.size() BEFORE the for loop

❌ Path sum: not stopping at leaf (checking single-child nodes as leaf)
   Fix: leaf = !node->left && !node->right
```

## 🎓 Interview Tips
- **Post-order** = process children before parent → use for delete, height, diameter
- **Inorder of BST** = sorted array → many BST problems reduce to inorder traversal
- **Return value from recursion**: decide what each call returns (height? sum? node?)
- **Global variable**: when answer is path through multiple subtrees (diameter, max path sum)
- **BST property**: always use min/max bounds for validation, NOT just parent comparison

---
*Next → [07_Graphs_BFS_DFS.md](./07_Graphs_BFS_DFS.md)*
