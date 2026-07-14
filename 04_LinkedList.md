# 04 — Linked List 🔗

## 🧠 Core Idea
Linked list problems use **pointer manipulation**. Master these patterns: slow-fast (Floyd's), reversal, merge, dummy node, and recursion.

**Recognize when:** detect cycle, find middle, reverse, merge two lists, kth from end, palindrome list

---

## 📐 Visual
```
Slow-Fast (cycle):    1→2→3→4→5→3 (cycle)
                      S              F moves 2x
                      S=F → cycle exists

Reversal:   1→2→3→4→null
            prev=null, curr=1
            Each step: save next, point back, advance

Dummy node: dummy→1→2→3   ← dummy.next = head of result
```

---

## ✅ Template 1: Detect Cycle (Floyd's Algorithm)
```cpp
bool hasCycle(ListNode* head) {
    ListNode *slow=head, *fast=head;      // both start at head
    while (fast && fast->next) {          // fast needs 2 steps each time
        slow = slow->next;                // slow moves 1 step
        fast = fast->next->next;          // fast moves 2 steps
        if (slow == fast) return true;    // they meet → cycle exists
    }
    return false;                         // fast hit null → no cycle
} // O(n) time, O(1) space
```

## ✅ Template 2: Find Cycle Start
```cpp
ListNode* detectCycle(ListNode* head) {
    ListNode *slow=head, *fast=head;
    while (fast && fast->next) {
        slow=slow->next; fast=fast->next->next;
        if (slow==fast) {                  // cycle detected
            ListNode* finder = head;       // second pointer from head
            while (finder != slow) {       // move both 1 step until they meet
                finder=finder->next;
                slow=slow->next;
            }
            return slow;                   // meeting point = cycle start
        }
    }
    return nullptr;
// Math: dist(head→cycle_start) = dist(meeting_point→cycle_start)
}
```

## ✅ Template 3: Find Middle of Linked List
```cpp
ListNode* findMiddle(ListNode* head) {
    ListNode *slow=head, *fast=head;
    while (fast && fast->next) {           // fast stops at end
        slow=slow->next;                   // slow moves 1
        fast=fast->next->next;             // fast moves 2
    }
    return slow;                           // slow is at middle
// For even length: slow = second middle (use fast->next for first middle)
} // O(n) time, O(1) space
```

## ✅ Template 4: Reverse Linked List
```cpp
ListNode* reverseList(ListNode* head) {
    ListNode *prev=nullptr, *curr=head;
    while (curr) {
        ListNode* next = curr->next;       // save next before overwriting
        curr->next = prev;                 // reverse the pointer
        prev = curr;                       // advance prev to current
        curr = next;                       // advance curr to saved next
    }
    return prev;                           // prev is new head (last node)
} // O(n) time, O(1) space

// Recursive version:
ListNode* reverseListRecursive(ListNode* head) {
    if (!head || !head->next) return head; // base: 0 or 1 node
    ListNode* newHead = reverseListRecursive(head->next); // reverse rest
    head->next->next = head;               // point next node back to head
    head->next = nullptr;                  // disconnect head from forward
    return newHead;                        // new head is last original node
}
```

## ✅ Template 5: Merge Two Sorted Lists (Dummy Node)
```cpp
ListNode* mergeTwoLists(ListNode* l1, ListNode* l2) {
    ListNode dummy(0);                     // dummy head to simplify edge cases
    ListNode* curr = &dummy;              // curr builds the merged list
    
    while (l1 && l2) {                    // while both lists have nodes
        if (l1->val <= l2->val) {
            curr->next = l1;              // attach smaller node
            l1 = l1->next;               // advance that list
        } else {
            curr->next = l2;
            l2 = l2->next;
        }
        curr = curr->next;               // advance merged list pointer
    }
    curr->next = l1 ? l1 : l2;          // attach remaining nodes
    return dummy.next;                   // skip dummy, return real head
} // O(m+n) time, O(1) space
```

## ✅ Template 6: Kth Node from End
```cpp
ListNode* removeNthFromEnd(ListNode* head, int n) {
    ListNode dummy(0);
    dummy.next = head;                    // dummy before head
    ListNode *fast=&dummy, *slow=&dummy;
    
    // Move fast n+1 steps ahead
    for (int i=0; i<=n; i++) fast=fast->next;
    
    // Move both until fast is null
    while (fast) {
        slow=slow->next;
        fast=fast->next;
    }
    // slow is now at node BEFORE the kth from end
    slow->next = slow->next->next;        // remove kth from end
    return dummy.next;
} // O(n) time, O(1) space — one pass!
```

## ✅ Template 7: Palindrome Linked List
```cpp
bool isPalindrome(ListNode* head) {
    // Step 1: Find middle
    ListNode *slow=head, *fast=head;
    while (fast && fast->next) { slow=slow->next; fast=fast->next->next; }
    
    // Step 2: Reverse second half
    ListNode *prev=nullptr, *curr=slow;
    while (curr) {
        ListNode* next=curr->next;
        curr->next=prev;
        prev=curr; curr=next;
    }
    
    // Step 3: Compare both halves
    ListNode *left=head, *right=prev;
    while (right) {                        // right half is shorter or equal
        if (left->val != right->val) return false;
        left=left->next; right=right->next;
    }
    return true;
} // O(n) time, O(1) space
```

## ✅ Template 8: Merge K Sorted Lists (Heap)
```cpp
struct Cmp {
    bool operator()(ListNode* a, ListNode* b) { return a->val > b->val; }
};
ListNode* mergeKLists(vector<ListNode*>& lists) {
    priority_queue<ListNode*,vector<ListNode*>,Cmp> pq; // min-heap by value
    for (auto l : lists) if (l) pq.push(l);             // push all heads
    
    ListNode dummy(0); ListNode* curr=&dummy;
    while (!pq.empty()) {
        auto node = pq.top(); pq.pop();    // get min node
        curr->next = node;                 // attach to result
        curr = curr->next;
        if (node->next) pq.push(node->next); // push next node from same list
    }
    return dummy.next;
} // O(n log k) time, O(k) space
```

## ✅ Template 9: Reverse Nodes in K-Group
```cpp
ListNode* reverseKGroup(ListNode* head, int k) {
    // Check if k nodes available
    ListNode* check = head;
    for (int i=0; i<k; i++) {
        if (!check) return head;           // fewer than k nodes → don't reverse
        check = check->next;
    }
    // Reverse k nodes
    ListNode *prev=nullptr, *curr=head;
    for (int i=0; i<k; i++) {
        ListNode* next=curr->next;
        curr->next=prev;
        prev=curr; curr=next;
    }
    // head is now tail of reversed group → connect to result of next group
    head->next = reverseKGroup(curr, k);  // recursive: process rest
    return prev;                           // prev is new head of this group
} // O(n) time, O(n/k) recursion stack
```

---

## 📊 Complexity Table
| Problem | Time | Space |
|---------|------|-------|
| Detect cycle | O(n) | O(1) |
| Find middle | O(n) | O(1) |
| Reverse list | O(n) | O(1) |
| Merge two sorted | O(m+n) | O(1) |
| Kth from end | O(n) | O(1) |
| Palindrome check | O(n) | O(1) |
| Merge K sorted | O(n log k) | O(k) |
| Reverse K groups | O(n) | O(n/k) |

---

## 🔥 Progressive Problems
### 🟢 Easy
1. LC 206 — Reverse Linked List (Template 4)
2. LC 21 — Merge Two Sorted Lists (Template 5)
3. LC 141 — Linked List Cycle (Template 1)
4. LC 876 — Middle of Linked List (Template 3)
5. LC 234 — Palindrome Linked List (Template 7)

### 🟡 Medium
6. LC 142 — Linked List Cycle II (Template 2, find start)
7. LC 19 — Remove Nth Node from End (Template 6)
8. LC 2 — Add Two Numbers (traverse simultaneously)
9. LC 328 — Odd Even Linked List (two pointers, relink)
10. LC 143 — Reorder List (find mid + reverse + merge)
11. LC 148 — Sort List (merge sort on linked list)
12. LC 92 — Reverse Linked List II (partial reversal)

### 🔴 Hard
13. LC 25 — Reverse Nodes in K-Group (Template 9)
14. LC 23 — Merge K Sorted Lists (Template 8)
15. LC 146 — LRU Cache (doubly linked list + hash map)

---

## 💡 Key Problem Walkthroughs

### LC 143 — Reorder List (Combines 3 patterns)
```cpp
void reorderList(ListNode* head) {
    // Step 1: Find middle
    ListNode *slow=head, *fast=head;
    while (fast->next && fast->next->next) { slow=slow->next; fast=fast->next->next; }
    
    // Step 2: Reverse second half
    ListNode *second=slow->next, *prev=nullptr;
    slow->next=nullptr;                     // split at middle
    while (second) {
        auto next=second->next; second->next=prev;
        prev=second; second=next;
    }
    second=prev;                            // second is now reversed second half
    
    // Step 3: Merge alternately
    ListNode *first=head;
    while (second) {
        auto tmp1=first->next, tmp2=second->next;
        first->next=second;
        second->next=tmp1;
        first=tmp1; second=tmp2;            // advance both
    }
}
```

### LC 148 — Sort List (Merge Sort)
```cpp
ListNode* sortList(ListNode* head) {
    if (!head || !head->next) return head; // 0 or 1 node → sorted
    
    // Find middle and split
    ListNode *slow=head, *fast=head->next;
    while (fast && fast->next) { slow=slow->next; fast=fast->next->next; }
    ListNode* mid = slow->next;
    slow->next = nullptr;                  // split list in half
    
    ListNode* left = sortList(head);       // sort left half
    ListNode* right = sortList(mid);       // sort right half
    return mergeTwoLists(left, right);     // merge sorted halves
} // O(n log n) time, O(log n) space (recursion)
```

---

## ⚠️ Common Mistakes
```
❌ Not checking fast && fast->next before fast->next->next
   Fix: always check both in while condition for fast pointer

❌ Losing track of next pointer during reversal
   Fix: save next = curr->next BEFORE changing curr->next

❌ Not using dummy node for merge/delete operations
   Fix: dummy node eliminates edge case when head changes

❌ Floyd's cycle start: starting finder from wrong position
   Fix: one pointer from head, one from meeting point, advance 1 step each

❌ Reverse K-group: not handling when fewer than k nodes remain
   Fix: count k nodes first, return head unchanged if not enough
```

## 🎓 Interview Tips
- **Dummy node**: always use when head can change (merge, delete head)
- **Slow-fast**: fast moves 2x → when fast hits end, slow is at middle
- **Cycle start math**: distance from head = distance from meeting point to start
- **Draw it**: linked list problems are much clearer when drawn on paper
- **LRU Cache**: doubly linked list (O(1) remove) + hash map (O(1) lookup)

---
*Next → [05_Stack_Queue_Monotonic.md](./05_Stack_Queue_Monotonic.md)*
