# 16 — Math & Number Theory 🔢

## 🧠 Core Idea
Mathematical patterns that reduce complex problems to formulas or algorithms. Must-know: GCD, primes, modular arithmetic, combinatorics.

---

## ✅ Essential Math Toolkit

### GCD & LCM
```cpp
int gcd(int a, int b) { return b==0 ? a : gcd(b, a%b); } // Euclidean algorithm O(log n)
int lcm(int a, int b) { return a / gcd(a,b) * b; }        // avoid overflow: divide first
// C++17: __gcd(a,b) or std::gcd(a,b) from <numeric>
```

### Fast Power (Modular Exponentiation)
```cpp
long long fastPow(long long base, long long exp, long long mod) {
    long long result=1;
    base %= mod;                           // reduce base first
    while (exp > 0) {
        if (exp & 1) result = result*base % mod; // odd exponent → multiply result
        base = base*base % mod;            // square the base
        exp >>= 1;                         // halve the exponent
    }
    return result;
} // O(log exp) time
```

### Sieve of Eratosthenes (All Primes up to N)
```cpp
vector<bool> sieve(int n) {
    vector<bool> isPrime(n+1, true);
    isPrime[0]=isPrime[1]=false;
    for (int i=2; i*i<=n; i++) {          // only need to check up to sqrt(n)
        if (isPrime[i]) {
            for (int j=i*i; j<=n; j+=i)  // start from i*i (smaller multiples already marked)
                isPrime[j]=false;
        }
    }
    return isPrime;
} // O(n log log n) time, O(n) space
```

### Modular Inverse (Fermat's Little Theorem — only when mod is prime)
```cpp
long long modInverse(long long a, long long mod) {
    return fastPow(a, mod-2, mod);         // a^(p-2) mod p = a^(-1) mod p
}

// nCr mod prime (Combinatorics)
const int MOD=1e9+7;
vector<long long> fact(n+1), inv_fact(n+1);
void precompute(int n) {
    fact[0]=1;
    for (int i=1; i<=n; i++) fact[i]=fact[i-1]*i%MOD;
    inv_fact[n]=modInverse(fact[n], MOD);
    for (int i=n-1; i>=0; i--) inv_fact[i]=inv_fact[i+1]*(i+1)%MOD;
}
long long nCr(int n, int r) {
    if (r<0||r>n) return 0;
    return fact[n]*inv_fact[r]%MOD*inv_fact[n-r]%MOD;
}
```

### Prime Factorization
```cpp
map<int,int> primeFactors(int n) {
    map<int,int> factors;
    for (int i=2; i*i<=n; i++) {          // trial division up to sqrt(n)
        while (n%i==0) { factors[i]++; n/=i; } // divide out all i
    }
    if (n>1) factors[n]++;                // remaining n > 1 is prime factor
    return factors;
} // O(sqrt(n)) time
```

---

## 📊 Key Formulas
| Formula | Expression |
|---------|-----------|
| Sum 1..n | n(n+1)/2 |
| Sum of squares 1..n | n(n+1)(2n+1)/6 |
| nCr | n! / (r! × (n-r)!) |
| Catalan number | C(n) = nC2n / (n+1) |
| Euler's totient φ(n) | n × ∏(1 - 1/p) for each prime p|n |

---

## 🔥 Progressive Problems
### 🟢 Easy
1. LC 204 — Count Primes (Sieve of Eratosthenes)
2. LC 1979 — Find GCD of Array
3. LC 231 — Power of Two (bit: n>0 && n&(n-1)==0)

### 🟡 Medium
4. LC 50 — Pow(x, n) (fast power, handle negative n)
5. LC 372 — Super Pow (modular exponentiation)
6. LC 523 — Continuous Subarray Sum (prefix sum mod k)
7. LC 670 — Maximum Swap (greedy: swap largest digit from right)

### 🔴 Hard
8. LC 878 — Nth Magical Number (LCM + binary search)
9. LC 1250 — Check If It Is a Good Array (GCD of all = 1)

---

## 💡 Key Solutions

### LC 50 — Pow(x, n)
```cpp
double myPow(double x, long long n) {
    if (n < 0) { x=1.0/x; n=-n; }        // handle negative exponent
    double result=1;
    while (n) {
        if (n&1) result *= x;             // odd: multiply result
        x *= x; n >>= 1;                  // square x, halve n
    }
    return result;
}
```

### LC 523 — Continuous Subarray Sum (Multiple of k)
```cpp
bool checkSubarraySum(vector<int>& nums, int k) {
    unordered_map<int,int> prefModIdx; prefModIdx[0]=-1; // prefix mod 0 at -1
    int sum=0;
    for (int i=0; i<(int)nums.size(); i++) {
        sum = (sum+nums[i]) % k;
        if (prefModIdx.count(sum)) {
            if (i-prefModIdx[sum] >= 2) return true; // subarray length >= 2
        } else prefModIdx[sum]=i;                     // store first occurrence
    }
    return false;
} // Key: if prefSum[i]%k == prefSum[j]%k, then sum[i+1..j] is divisible by k
```

---

## 🎓 Key Facts for Interviews
```
GCD(a,0) = a
GCD(a,b) = GCD(b, a%b)  [Euclidean]
LCM(a,b) = a*b / GCD(a,b)
a^p ≡ a (mod p) for prime p  [Fermat's little theorem]
Catalan: parentheses combinations, BST shapes, polygon triangulation
sqrt(n) primality check: check divisors up to sqrt(n)
Overflow guard: use long long, or (a/b)*b + (a%b) instead of a*b/b
MOD arithmetic: (a+b)%m, (a*b)%m, (a-b+m)%m  [always add m before subtraction]
```

---
*Next → [17_StringPatterns.md](./17_StringPatterns.md)*
