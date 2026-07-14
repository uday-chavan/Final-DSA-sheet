# 15 — Bit Manipulation 🔢

## 🧠 Core Idea
Operate directly on binary representations. O(1) space, fast operations. Essential for competitive programming and system-level problems.

---

## 📐 Bit Tricks Reference Table
```
Operation          | Expression        | Example (a=6=110, b=3=011)
-------------------|-------------------|---------------------------------
AND                | a & b             | 110 & 011 = 010 = 2
OR                 | a | b             | 110 | 011 = 111 = 7
XOR                | a ^ b             | 110 ^ 011 = 101 = 5
NOT                | ~a                | ~110 = ...11111001 (flip all)
Left shift         | a << k            | 110 << 1 = 1100 = 12 (×2^k)
Right shift        | a >> k            | 110 >> 1 = 011 = 3 (÷2^k)
Check bit k        | (a >> k) & 1      | (6>>1)&1 = 1 (bit 1 is set)
Set bit k          | a | (1 << k)      | 6 | (1<<3) = 1110 = 14
Clear bit k        | a & ~(1 << k)     | 6 & ~(1<<1) = 100 = 4
Toggle bit k       | a ^ (1 << k)      | 6 ^ (1<<0) = 111 = 7
Lowest set bit     | a & (-a)          | 6 & (-6) = 010 = 2
Clear lowest bit   | a & (a-1)         | 6 & 5 = 110 & 101 = 100 = 4
Count set bits     | __builtin_popcount(a) | popcount(6) = 2
Is power of 2      | a>0 && (a&(a-1))==0 | 8: 1000 & 0111 = 0 → true
XOR self           | a ^ a = 0         | any number XOR itself = 0
XOR zero           | a ^ 0 = a         | any number XOR 0 = itself
```

---

## ✅ Template 1: Single Number (XOR trick)
```cpp
int singleNumber(vector<int>& nums) {
    int result = 0;
    for (int n : nums) result ^= n;   // XOR all: pairs cancel (a^a=0), single remains
    return result;
} // O(n) time, O(1) space

// Single Number III (two singles): LC 260
vector<int> singleNumberIII(vector<int>& nums) {
    int xorAll = 0;
    for (int n : nums) xorAll ^= n;   // xorAll = a ^ b (the two singles)
    
    int diffBit = xorAll & (-xorAll); // any bit where a and b differ (lowest set bit)
    int a=0, b=0;
    for (int n : nums) {
        if (n & diffBit) a ^= n;      // group by this bit: a will XOR to first single
        else             b ^= n;      // b will XOR to second single
    }
    return {a, b};
}
```

## ✅ Template 2: Counting Bits
```cpp
vector<int> countBits(int n) {
    vector<int> dp(n+1, 0);
    for (int i=1; i<=n; i++) {
        dp[i] = dp[i>>1] + (i&1);   // right shift removes last bit; add if last bit was 1
        // Equivalent: dp[i] = dp[i & (i-1)] + 1  (remove lowest set bit + count it)
    }
    return dp;
} // O(n) time, O(n) space
```

## ✅ Template 3: Power of Two / N / X
```cpp
bool isPowerOfTwo(int n) { return n > 0 && (n & (n-1)) == 0; }
bool isPowerOfFour(int n) {
    // Power of 4: power of 2 AND the set bit is at even position
    return n>0 && (n&(n-1))==0 && (n & 0xAAAAAAAA)==0; // 0xA...=only odd bits
}

// Reverse bits of 32-bit integer
uint32_t reverseBits(uint32_t n) {
    uint32_t result=0;
    for (int i=0; i<32; i++) {
        result = (result<<1) | (n&1); // shift result left, add last bit of n
        n >>= 1;                      // shift n right
    }
    return result;
}
```

## ✅ Template 4: Missing Number / Find Duplicate (XOR)
```cpp
int missingNumber(vector<int>& nums) {
    int xorAll = 0;
    for (int i=0; i<=(int)nums.size(); i++) xorAll ^= i;    // XOR with all expected
    for (int n : nums) xorAll ^= n;                          // XOR with actual
    return xorAll;                    // missing number remains
} // O(n) time, O(1) space

// Alternative (math): expected_sum - actual_sum
int missingNumberMath(vector<int>& nums) {
    int n=nums.size();
    return n*(n+1)/2 - accumulate(nums.begin(),nums.end(),0);
}
```

## ✅ Template 5: Subsets Using Bitmask
```cpp
vector<vector<int>> subsetsWithBitmask(vector<int>& nums) {
    int n=nums.size();
    vector<vector<int>> result;
    for (int mask=0; mask<(1<<n); mask++) { // 2^n subsets
        vector<int> subset;
        for (int i=0; i<n; i++) {
            if (mask & (1<<i))             // bit i is set → include nums[i]
                subset.push_back(nums[i]);
        }
        result.push_back(subset);
    }
    return result;
} // O(2^n * n) time — iterative, no recursion needed

// Bitmask DP template
// dp[mask] = answer for subset represented by mask
int n=4;
vector<int> dp(1<<n, 0);              // 2^n states
for (int mask=0; mask<(1<<n); mask++) {
    for (int i=0; i<n; i++) {
        if (mask & (1<<i)) {          // i is in current subset
            // transition: dp[mask] from dp[mask ^ (1<<i)]
        }
    }
}
```

## ✅ Template 6: Number of 1 Bits / Hamming Distance
```cpp
int hammingWeight(uint32_t n) {
    int count=0;
    while (n) { count++; n &= (n-1); } // clear lowest set bit each time
    return count;
    // Or: return __builtin_popcount(n);
}

int hammingDistance(int x, int y) {
    return __builtin_popcount(x ^ y);  // XOR gives differing bits, count them
}
```

---

## 🔥 Progressive Problems
### 🟢 Easy
1. LC 136 — Single Number (Template 1: XOR all)
2. LC 191 — Number of 1 Bits (Template 6)
3. LC 461 — Hamming Distance (Template 6)
4. LC 338 — Counting Bits (Template 2)
5. LC 268 — Missing Number (Template 4)

### 🟡 Medium
6. LC 371 — Sum of Two Integers (add without + operator)
7. LC 190 — Reverse Bits (Template 3)
8. LC 78 — Subsets (Template 5: bitmask)
9. LC 137 — Single Number II (appears 3 times, one appears 1 time)

### 🔴 Hard
10. LC 260 — Single Number III (Template 1: two singles)
11. LC 421 — Maximum XOR (Trie approach, see file 12)

---

## 💡 Key Solutions

### LC 371 — Sum Without + Operator
```cpp
int getSum(int a, int b) {
    while (b) {
        int carry = (unsigned)(a & b) << 1; // carry bits (shift left)
        a = a ^ b;                           // sum without carry (XOR)
        b = carry;                           // carry becomes next b
    }
    return a;
} // Simulate binary addition
```

### LC 137 — Single Number II (appears 3 times)
```cpp
int singleNumber(vector<int>& nums) {
    int ones=0, twos=0;
    for (int n : nums) {
        ones = (ones ^ n) & ~twos;  // bits in ones: appeared 1 time mod 3
        twos = (twos ^ n) & ~ones;  // bits in twos: appeared 2 times mod 3
        // bits appeared 3 times: not in ones or twos → reset
    }
    return ones;
}
```

---

## ⚠️ Common Mistakes
```
❌ Signed integer overflow when shifting
   Fix: use unsigned or cast: (unsigned)a << k

❌ Priority of & and | vs comparisons
   Fix: use parentheses: if ((n & mask) == 0) not if (n & mask == 0)

❌ Checking power of 2 without checking n>0
   Fix: always add n>0 || n>0LL check

❌ XOR to find missing: forgetting to XOR both [0..n] and nums
   Fix: XOR with index i AND value nums[i] in same loop
```

## 🎓 Interview Tips
- **XOR = swap without temp**: `a^=b; b^=a; a^=b;`
- **a & (a-1)**: clears lowest set bit — use to count 1-bits, check power of 2
- **a & (-a)**: isolates lowest set bit — used in BIT, grouping
- **Bitmask DP**: use when n ≤ 20 (2^20 = 1M states manageable)
- **__builtin_popcount()**: use freely in interviews (it's standard GCC)

---
*Next → [16_MathAndNumberTheory.md](./16_MathAndNumberTheory.md)*
