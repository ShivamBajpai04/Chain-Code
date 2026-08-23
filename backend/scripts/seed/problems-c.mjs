// Part C: Backtracking, Graphs, Dynamic Programming, Greedy & Bits
// All statements, formats and tests are authored for ChainCode (stdin/stdout judging).
export const problemsC = [
  // ---------- Backtracking ----------
  {
    title: "Subsets",
    difficulty: "Medium",
    topics: "Array, Backtracking, Bit Manipulation",
    statement:
      "Given an array of distinct integers, enumerate every subset (the power set). Sort the array first; then output all **non-empty** subsets grouped by size ascending, and lexicographically within each size.",
    input: "Line 1: integer `n`.\nLine 2: `n` distinct space-separated integers.",
    output: "Line 1: the count `2^n − 1`. Then one line per non-empty subset (values space-separated), ordered by size then lexicographically as defined above.",
    constraints: ["1 <= n <= 12", "-10 <= nums[i] <= 10", "All values distinct."],
    hint: "At every index you face a take-or-skip choice — recursion over that decision enumerates all subsets naturally.",
    tests: [
      { input: "3\n1 2 3", output: "7\n1\n2\n3\n1 2\n1 3\n2 3\n1 2 3" },
      { input: "2\n5 2", output: "3\n2\n5\n2 5" },
      { input: "1\n0", output: "1\n0" },
    ],
  },
  {
    title: "Combination Sum",
    difficulty: "Medium",
    topics: "Array, Backtracking",
    statement:
      "Distinct candidate numbers are given; each may be used an unlimited number of times. Collect all unique combinations summing to the target (same set of values in different orders counts once). Output them sorted: within a combination ascending, combinations in lexicographic order.",
    input: "Line 1: integers `m target`.\nLine 2: `m` distinct space-separated candidates.",
    output: "Line 1: the number of combinations. Then one combination per line, values space-separated, in the defined order.",
    constraints: ["1 <= m <= 30", "2 <= candidates[i] <= 40", "1 <= target <= 40"],
    hint: "Recurse with a starting index so combinations stay non-decreasing and duplicates never form.",
    tests: [
      { input: "4 7\n2 3 6 7", output: "2\n2 2 3\n7" },
      { input: "3 8\n2 3 5", output: "3\n2 2 2 2\n2 3 3\n3 5" },
      { input: "1 1\n2", output: "0" },
    ],
  },
  {
    title: "Permutations",
    difficulty: "Medium",
    topics: "Array, Backtracking",
    statement:
      "List every permutation of an array of distinct integers in **lexicographic order of indices after sorting the values**. Concretely: sort the input first, then enumerate permutations lexicographically.",
    input: "Line 1: integer `n`.\nLine 2: `n` distinct space-separated integers.",
    output: "Line 1: the count n!. Then n! lines, each a permutation (values space-separated) in lexicographic order.",
    constraints: ["1 <= n <= 6", "-10 <= nums[i] <= 10"],
    hint: "Backtrack by choosing each unused value in sorted order at every position — recursion emits them already sorted.",
    tests: [
      { input: "3\n1 2 3", output: "6\n1 2 3\n1 3 2\n2 1 3\n2 3 1\n3 1 2\n3 2 1" },
      { input: "2\n1 0", output: "2\n0 1\n1 0" },
      { input: "1\n9", output: "1\n9" },
    ],
  },
  {
    title: "Subsets II",
    difficulty: "Medium",
    topics: "Array, Backtracking, Sorting",
    statement:
      "Like Subsets, but the input may contain duplicate values. Enumerate every **distinct** non-empty subset without duplicates, sorted by size then lexicographically.",
    input: "Line 1: integer `n`.\nLine 2: `n` space-separated integers (duplicates possible).",
    output: "Line 1: the number of distinct non-empty subsets. Then one subset per line in the defined order.",
    constraints: ["1 <= n <= 12", "-10 <= nums[i] <= 10"],
    hint: "Sort first; at each depth skip a value equal to the one just tried on this level to prune duplicate branches.",
    tests: [
      { input: "3\n1 2 2", output: "5\n1\n2\n1 2\n2 2\n1 2 2" },
      { input: "1\n0", output: "1\n0" },
      { input: "4\n1 1 2 2", output: "9\n1\n2\n1 1\n1 2\n2 2\n1 1 2\n1 2 2\n1 1 2 2" },
    ],
  },
  {
    title: "Word Search",
    difficulty: "Medium",
    topics: "Matrix, Backtracking",
    statement:
      "A grid of uppercase letters and a word are given. Decide whether the word can be traced by moving between horizontally/vertically adjacent cells, using each cell at most once per path.",
    input: "Line 1: integers `r c`.\nNext `r` lines: strings of exactly `c` uppercase letters.\nLast line: the word (uppercase letters).",
    output: "Print `true` if the word exists in the grid, else `false`.",
    constraints: ["1 <= r, c <= 6", "1 <= word length <= 15"],
    hint: "DFS from every cell matching the first letter; mark visited cells temporarily and unmark when backtracking.",
    tests: [
      { input: "3 4\nABCE\nSFCS\nADEE\nABCCED", output: "true" },
      { input: "3 4\nABCE\nSFCS\nADEE\nSEE", output: "true" },
      { input: "3 4\nABCE\nSFCS\nADEE\nABCB", output: "false" },
    ],
  },
  {
    title: "Generate Parentheses",
    difficulty: "Medium",
    topics: "String, Backtracking, DP",
    statement:
      "For `n` pairs of parentheses, produce every string of `n` opens and `n` closes that is properly balanced, listed in lexicographic order.",
    input: "One line: integer `n`.",
    output: "Line 1: how many valid strings there are. Then one string per line in lexicographic order.",
    constraints: ["1 <= n <= 8"],
    hint: "Build character by character: add '(' while any remain, add ')' only if it wouldn't orphan an open.",
    tests: [
      { input: "3", output: "5\n((()))\n(()())\n(())()\n()(())\n()()()" },
      { input: "1", output: "1\n()" },
      { input: "2", output: "2\n(())\n()()" },
    ],
  },
  {
    title: "Letter Combinations of a Phone Number",
    difficulty: "Medium",
    topics: "String, Backtracking, Hash Table",
    statement:
      "Classic phone keypad mapping: 2→abc, 3→def, 4→ghi, 5→jkl, 6→mno, 7→pqrs, 8→tuv, 9→wxyz. For a digit string, list every possible letter combination in lexicographic order.",
    input: "One line: digits '2'–'9' only.",
    output: "Line 1: the number of combinations. Then one combination per line in lexicographic order.",
    constraints: ["1 <= digits.length <= 4"],
    hint: "Recursively consume one digit at a time, fanning out over its letters — appending in keypad order yields lex order for free.",
    tests: [
      { input: "23", output: "9\nad\nae\naf\nbd\nbe\nbf\ncd\nce\ncf" },
      { input: "2", output: "3\na\nb\nc" },
      { input: "79", output: "12\npw\npx\npy\npz\nqw\nqx\nqy\nqz\nrw\nrx\nry\nrz" },
    ],
  },

  // ---------- Graphs ----------
  {
    title: "Number of Islands",
    difficulty: "Medium",
    topics: "Matrix, BFS, DFS, Union Find",
    statement:
      "A map is a grid of '1' (land) and '0' (water); land connects only horizontally/vertically. Count the islands — maximal connected groups of land surrounded by water.",
    input: "Line 1: integers `r c`.\nNext `r` lines: strings of exactly `c` characters, each '0' or '1'.",
    output: "Print the number of islands.",
    constraints: ["1 <= r, c <= 300"],
    hint: "Flood-fill each unvisited land cell and increment a counter; BFS or DFS both work — remember to sink the island as you go.",
    tests: [
      { input: "1 5\n10101", output: "3" },
      { input: "4 5\n11000\n11000\n00100\n00011", output: "3" },
      { input: "2 2\n11\n11", output: "1" },
    ],
  },
  {
    title: "Course Schedule",
    difficulty: "Medium",
    topics: "Graph, Topological Sort, BFS, DFS",
    statement:
      "`numCourses` labelled courses and prerequisite pairs `(a, b)` meaning b must be taken before a. Decide whether every course can be finished — i.e. the prerequisite graph has no cycle.",
    input: "Line 1: integers `n m`.\nNext `m` lines: two integers `a b` — course b must precede course a.",
    output: "Print `true` if all courses can be completed in some order, else `false`.",
    constraints: ["1 <= n <= 2000", "0 <= m <= 5000", "Prerequisite pairs are unique."],
    hint: "Kahn's algorithm: repeatedly remove courses whose prerequisites count hit zero; if some never free up, a cycle blocks them.",
    tests: [
      { input: "2 1\n1 0", output: "true" },
      { input: "2 2\n1 0\n0 1", output: "false" },
      { input: "4 4\n1 0\n2 0\n3 1\n3 2", output: "true" },
    ],
  },
  {
    title: "Rotting Oranges",
    difficulty: "Medium",
    topics: "Matrix, BFS",
    statement:
      "Grid cells hold a rotten orange (`2`), fresh orange (`1`) or nothing (`0`). Every minute rot spreads from each rotten cell to 4-directional fresh neighbours. How many whole minutes until no fresh orange remains? If some fresh orange can never be reached, print `-1`; if none exist from the start, `0`.",
    input: "Line 1: integers `r c`.\nNext `r` lines: `c` space-separated values, each 0, 1 or 2.",
    output: "Print minutes until all oranges are rotten, `-1` if impossible, `0` if no fresh oranges.",
    constraints: ["1 <= r, c <= 15"],
    hint: "Multi-source BFS from all initially rotten cells; track time layers and fresh count simultaneously.",
    tests: [
      { input: "3 3\n2 1 1\n1 1 0\n0 1 1", output: "4" },
      { input: "3 3\n2 1 1\n0 1 1\n1 0 1", output: "-1" },
      { input: "1 2\n0 2", output: "0" },
    ],
  },
  {
    title: "Network Delay Time",
    difficulty: "Medium",
    topics: "Graph, Dijkstra, Heap, Shortest Path",
    statement:
      "A signal leaves node `k` and travels directed weighted edges. Find the time until **every** node has received it — the maximum shortest-path distance — or `-1` if some node is unreachable.",
    input: "Line 1: integers `n m k`.\nNext `m` lines: `u v w` — a directed edge u→v taking w time (w ≥ 0). Nodes are numbered 1..n.",
    output: "Print the total propagation time, or `-1`.",
    constraints: ["1 <= k <= n <= 100", "1 <= m <= 6000", "1 <= w <= 100"],
    hint: "Dijkstra from k with a priority queue; the answer is the largest settled distance across all nodes.",
    tests: [
      { input: "4 3 2\n2 1 1\n2 3 1\n3 4 1", output: "2" },
      { input: "2 1 1\n1 2 1", output: "1" },
      { input: "2 1 2\n1 2 1", output: "-1" },
    ],
  },
  {
    title: "Word Ladder",
    difficulty: "Hard",
    topics: "Hash Table, String, BFS",
    statement:
      "Transform `beginWord` into `endWord` changing **one letter at a time**, where every intermediate word must be in the dictionary. Each change costs one step. Print the length of the shortest transformation sequence (counting begin and end words), or `0` if impossible.",
    input: "Line 1: beginWord.\nLine 2: endWord.\nLine 3: integer `m`.\nLine 4: `m` space-separated dictionary words. All words are lowercase and equal length.",
    output: "Print the number of words in the shortest sequence, or `0`.",
    constraints: ["1 <= beginWord.length <= 10", "endWord is lowercase, same length", "1 <= m <= 5000"],
    hint: "BFS level by level; generating wildcard buckets like h*t makes neighbour lookup O(length²) instead of scanning the dictionary.",
    tests: [
      { input: "hit\ncog\n6\nhot dot dog lot log cog", output: "5" },
      { input: "hit\ncog\n5\nhot dot dog lot log", output: "0" },
      { input: "a\nc\n1\nc", output: "2" },
    ],
  },
  {
    title: "Graph Valid Tree",
    difficulty: "Medium",
    topics: "Graph, Union Find, DFS",
    statement:
      "Decide whether an undirected graph on `n` nodes forms a tree: exactly connected and acyclic. A tree needs precisely `n−1` edges and full connectivity.",
    input: "Line 1: integers `n m`.\nNext `m` lines: undirected edge endpoints `u v`.",
    output: "Print `true` if the graph is a valid tree, else `false`.",
    constraints: ["1 <= n <= 2000", "0 <= m <= min(5000, n*(n-1)/2)"],
    hint: "Two checks suffice: edge count equals n−1 AND one flood covers every node (or union-find never merges two already-connected nodes).",
    tests: [
      { input: "5 4\n0 1\n0 2\n0 3\n1 4", output: "true" },
      { input: "5 5\n0 1\n1 2\n2 3\n1 3\n1 4", output: "false" },
      { input: "4 2\n0 1\n2 3", output: "false" },
    ],
  },
  {
    title: "Number of Connected Components in Undirected Graph",
    difficulty: "Medium",
    topics: "Graph, Union Find, BFS, DFS",
    statement:
      "Count the connected components of an undirected graph with nodes `0..n-1` given its edge list.",
    input: "Line 1: integers `n m`.\nNext `m` lines: edges `u v`.",
    output: "Print the number of components.",
    constraints: ["1 <= n <= 2000", "0 <= m <= 5000"],
    hint: "Start with n singleton components; every successful union (or first visit to a node) decreases the count by one.",
    tests: [
      { input: "5 3\n0 1\n1 2\n3 4", output: "2" },
      { input: "5 4\n0 1\n1 2\n2 3\n3 4", output: "1" },
      { input: "4 3\n0 1\n2 3\n1 2", output: "1" },
    ],
  },

  // ---------- Dynamic Programming ----------
  {
    title: "Climbing Stairs",
    difficulty: "Easy",
    topics: "DP, Math, Memoization",
    statement:
      "You climb `n` stairs, taking steps of 1 or 2 at a time. In how many distinct ways do you reach the top?",
    input: "One line: integer `n`.",
    output: "Print the number of ways.",
    constraints: ["1 <= n <= 45"],
    hint: "Ways(n) = Ways(n−1) + Ways(n−2): the last move was either a single or a double step.",
    tests: [
      { input: "2", output: "2" },
      { input: "3", output: "3" },
      { input: "10", output: "89" },
    ],
  },
  {
    title: "Min Cost Climbing Stairs",
    difficulty: "Easy",
    topics: "Array, DP",
    statement:
      "Each step i charges `cost[i]` once you step off it. From a step you climb one or two. You may start at index 0 or 1; the top sits one past the last step. Minimise total cost to reach the top.",
    input: "Line 1: integer `n`.\nLine 2: `n` space-separated costs.",
    output: "Print the minimum total cost.",
    constraints: ["2 <= n <= 1000", "0 <= cost[i] <= 999"],
    hint: "minCost(i) = cost[i] + min(minCost(i+1), minCost(i+2)) — answer is min of starting at step 0 or 1.",
    tests: [
      { input: "3\n10 15 20", output: "15" },
      { input: "10\n1 100 1 1 1 100 1 1 100 1", output: "6" },
      { input: "2\n1 100", output: "1" },
    ],
  },
  {
    title: "House Robber",
    difficulty: "Medium",
    topics: "Array, DP",
    statement:
      "Houses hold loot amounts; robbing two adjacent houses trips the alarm. Maximise the haul without ever choosing neighbouring houses.",
    input: "Line 1: integer `n`.\nLine 2: `n` non-negative amounts.",
    output: "Print the maximum loot.",
    constraints: ["1 <= n <= 100", "0 <= nums[i] <= 400"],
    hint: "rob(i) = max(rob(i−1), rob(i−2) + money(i)) — rolling two variables suffice.",
    tests: [
      { input: "4\n1 2 3 1", output: "4" },
      { input: "5\n2 7 9 3 1", output: "12" },
      { input: "4\n2 1 1 2", output: "4" },
    ],
  },
  {
    title: "House Robber II",
    difficulty: "Medium",
    topics: "Array, DP",
    statement:
      "Same rule as House Robber, but the houses stand in a circle — the first and last houses are neighbours too. Maximise the haul.",
    input: "Line 1: integer `n` (≥ 1).\nLine 2: `n` non-negative amounts arranged in a circle.",
    output: "Print the maximum loot.",
    constraints: ["1 <= n <= 100", "0 <= nums[i] <= 1000"],
    hint: "The circle forces house 0 and house n−1 apart — answer = best linear robbery excluding 0 plus best excluding n−1.",
    tests: [
      { input: "3\n2 3 2", output: "3" },
      { input: "4\n1 2 3 1", output: "4" },
      { input: "3\n1 2 3", output: "3" },
    ],
  },
  {
    title: "Coin Change",
    difficulty: "Medium",
    topics: "DP, BFS, Array",
    statement:
      "Coin denominations are unlimited in supply. Find the fewest coins summing exactly to `amount`, or report `-1` when impossible (amount 0 needs zero coins).",
    input: "Line 1: integers `m amount`.\nLine 2: `m` distinct coin denominations.",
    output: "Print the minimum coin count, or `-1`.",
    constraints: ["1 <= m <= 12", "0 <= amount <= 10^4", "1 <= coins[i] <= 2^31 - 1"],
    hint: "Bottom-up: fewest(amount) = 1 + min over coins of fewest(amount − coin); fill upward from 0.",
    tests: [
      { input: "3 11\n1 2 5", output: "3" },
      { input: "1 3\n2", output: "-1" },
      { input: "1 0\n1", output: "0" },
    ],
  },
  {
    title: "Unique Paths",
    difficulty: "Medium",
    topics: "DP, Math, Combinatorics",
    statement:
      "A robot starts at the top-left cell of an m×n grid and walks only right or down toward the bottom-right corner. Count the distinct paths.",
    input: "One line: integers `m n`.",
    output: "Print the number of distinct paths.",
    constraints: ["1 <= m, n <= 100", "The answer fits in 32-bit."],
    hint: "paths(i,j) = paths(i−1,j) + paths(i,j−1); the first row and column have exactly one route each.",
    tests: [
      { input: "3 7", output: "28" },
      { input: "3 2", output: "3" },
      { input: "1 1", output: "1" },
    ],
  },
  {
    title: "Minimum Path Sum",
    difficulty: "Medium",
    topics: "Matrix, DP, Array",
    statement:
      "From the top-left of a grid of non-negative numbers walk right or down to the bottom-right, collecting every visited value. Minimise the collected total.",
    input: "Line 1: integers `m n`.\nNext `m` lines: `n` space-separated values.",
    output: "Print the minimal path total.",
    constraints: ["1 <= m, n <= 200", "0 <= grid[i][j] <= 200"],
    hint: "Reuse the grid itself: each cell becomes its value plus the cheaper of arriving-from-top / arriving-from-left.",
    tests: [
      { input: "3 3\n1 3 1\n1 5 1\n4 2 1", output: "7" },
      { input: "2 3\n1 2 3\n4 5 6", output: "12" },
      { input: "1 1\n5", output: "5" },
    ],
  },
  {
    title: "Longest Increasing Subsequence",
    difficulty: "Medium",
    topics: "Array, DP, Binary Search",
    statement:
      "Find the length of the longest strictly increasing subsequence. Can you also produce the O(n log n) patience/binary-search variant?",
    input: "Line 1: integer `n`.\nLine 2: `n` space-separated integers.",
    output: "Print the LIS length.",
    constraints: ["1 <= n <= 2500", "-10^4 <= nums[i] <= 10^4"],
    hint: "dp[i] = longest ending at i via inner scan; or keep tails[] where binary search finds the slot to lower.",
    tests: [
      { input: "8\n10 9 2 5 3 7 101 18", output: "4" },
      { input: "6\n0 1 0 3 2 3", output: "4" },
      { input: "4\n7 7 7 7", output: "1" },
    ],
  },
  {
    title: "Word Break",
    difficulty: "Medium",
    topics: "String, DP, Trie",
    statement:
      "Can the string `s` be split into a sequence of dictionary words? Words may be reused any number of times.",
    input: "Line 1: integer `m`, Line 2: `m` space-separated dictionary words.\nLine 3: the string `s` (lowercase letters).",
    output: "Print `true` if such a segmentation exists, else `false`.",
    constraints: ["1 <= m <= 12", "1 <= s.length <= 300", "Words are lowercase and non-empty."],
    hint: "reachable(i): prefix of length i is segmentable iff some earlier reachable j has dict(j..i). Sweep forward.",
    tests: [
      { input: "2\nleet code\nleetcode", output: "true" },
      { input: "4\ncats og and dog\ncatsandog", output: "false" },
      { input: "3\napple pen apple\napplepenapple", output: "true" },
    ],
  },
  {
    title: "Partition Equal Subset Sum",
    difficulty: "Medium",
    topics: "Array, DP, Bitmask",
    statement:
      "Split the array into two groups with equal sums. Report whether such a partition exists.",
    input: "Line 1: integer `n`.\nLine 2: `n` positive integers.",
    output: "Print `true` if an equal split exists, else `false`.",
    constraints: ["1 <= n <= 200", "1 <= nums[i] <= 100"],
    hint: "Odd totals fail instantly; otherwise run subset-sum DP up to total/2 with a boolean bitset.",
    tests: [
      { input: "4\n1 5 11 5", output: "true" },
      { input: "4\n1 2 3 5", output: "false" },
      { input: "4\n2 2 2 2", output: "true" },
    ],
  },
  {
    title: "Decode Ways",
    difficulty: "Medium",
    topics: "String, DP",
    statement:
      "Letters A–Z encode as 1–26 respectively. A digit string may decode several ways ('12' → AB or L). Count the decodings; leading zeros make prefixes invalid ('06' decodes zero ways).",
    input: "One line: the digit string `s`.",
    output: "Print the number of possible decodings.",
    constraints: ["1 <= s.length <= 100", "s consists of digits only."],
    hint: "ways(i) uses ways(i−1) when s[i] ≠ '0', plus ways(i−2) when the two-digit slice lands in 10..26.",
    tests: [
      { input: "12", output: "2" },
      { input: "226", output: "3" },
      { input: "06", output: "0" },
      { input: "11106", output: "2" },
    ],
  },
  {
    title: "Edit Distance",
    difficulty: "Medium",
    topics: "String, DP",
    statement:
      "Minimum number of insertions, deletions or replacements turning word1 into word2.",
    input: "Line 1: word1 (lowercase).\nLine 2: word2 (lowercase).",
    output: "Print the minimal operation count.",
    constraints: ["0 <= lengths <= 500"],
    hint: "Classic table: equal chars inherit diagonally; otherwise 1 + min(insert, delete, replace).",
    tests: [
      { input: "horse\nros", output: "3" },
      { input: "intention\nexecution", output: "5" },
      { input: "abc\nabc", output: "0" },
    ],
  },
  {
    title: "Longest Common Subsequence",
    difficulty: "Medium",
    topics: "String, DP",
    statement:
      "Find the length of the longest subsequence common to two strings (characters need not be contiguous, but order must hold).",
    input: "Line 1: text1.\nLine 2: text2 (both lowercase letters).",
    output: "Print the LCS length.",
    constraints: ["1 <= lengths <= 1000"],
    hint: "Matching characters extend the diagonal; otherwise carry the better of dropping one char from either side.",
    tests: [
      { input: "abcde\nace", output: "3" },
      { input: "abc\nabc", output: "3" },
      { input: "abc\ndef", output: "0" },
    ],
  },
  {
    title: "Burst Balloons",
    difficulty: "Hard",
    topics: "Array, DP, Divide and Conquer",
    statement:
      "Balloons in a row hold values. Popping balloon i scores nums[left]*nums[i]*nums[right] using current neighbours (imaginary 1s flank the row), and removes it. Maximise the total score.",
    input: "Line 1: integer `n`.\nLine 2: `n` positive values.",
    output: "Print the maximum obtainable coins.",
    constraints: ["1 <= n <= 300", "1 <= nums[i] <= 100"],
    hint: "Think about which balloon bursts LAST in an interval rather than first — interval DP around padded borders.",
    tests: [
      { input: "4\n3 1 5 8", output: "167" },
      { input: "2\n1 5", output: "10" },
      { input: "1\n7", output: "7" },
    ],
  },

  // ---------- Greedy & Bit Manipulation ----------
  {
    title: "Jump Game",
    difficulty: "Medium",
    topics: "Array, Greedy, DP",
    statement:
      "Standing on index i lets you jump forward 1..nums[i] steps. Starting at index 0, decide whether the last index is reachable.",
    input: "Line 1: integer `n`.\nLine 2: `n` non-negative jump lengths.",
    output: "Print `true` if the end is reachable, else `false`.",
    constraints: ["1 <= n <= 10^4", "0 <= nums[i] <= 10^5"],
    hint: "Sweep left to right maintaining the furthest index yet reachable; getting stuck before the end means failure.",
    tests: [
      { input: "5\n2 3 1 1 4", output: "true" },
      { input: "5\n3 2 1 0 4", output: "false" },
      { input: "1\n0", output: "true" },
    ],
  },
  {
    title: "Gas Station",
    difficulty: "Medium",
    topics: "Array, Greedy",
    statement:
      "Circular route: station i sells gas[i]; the leg i→i+1 burns cost[i]. You start empty-handed at some station. Return the smallest starting index from which the full circuit completes, or `-1` if none exists. The answer is unique whenever it exists.",
    input: "Line 1: integer `n`.\nLine 2: `n` gas amounts.\nLine 3: `n` travel costs.",
    output: "Print the 0-based start index, or `-1`.",
    constraints: ["1 <= n <= 10^5", "0 <= gas[i], cost[i] <= 10^4"],
    hint: "Total surplus decides feasibility; a running tank going negative disqualifies everything up through the current station as a start.",
    tests: [
      { input: "5\n1 2 3 4 5\n3 4 5 1 2", output: "3" },
      { input: "3\n2 3 4\n3 4 3", output: "-1" },
      { input: "1\n5\n4", output: "0" },
    ],
  },
  {
    title: "Partition Labels",
    difficulty: "Medium",
    topics: "String, Greedy, Two Pointers",
    statement:
      "Split the string into as many parts as possible so that no letter appears in more than one part. Print each part's length in order.",
    input: "One line: lowercase string `s`.",
    output: "Print the part sizes space-separated on one line.",
    constraints: ["1 <= s.length <= 500"],
    hint: "Record each letter's final occurrence; extend the current cut to cover the furthest reach of anything seen inside.",
    tests: [
      { input: "ababcbacadefegdehijhklij", output: "9 7 8" },
      { input: "eccbbbbdec", output: "10" },
      { input: "abcabc", output: "6" },
    ],
  },
  {
    title: "Single Number",
    difficulty: "Easy",
    topics: "Array, Bit Manipulation",
    statement:
      "Every element appears exactly twice except one which appears once. Find that loner in linear time using constant extra memory.",
    input: "Line 1: odd integer `n`.\nLine 2: `n` space-separated integers.",
    output: "Print the single number.",
    constraints: ["1 <= n <= 3*10^4", "-3*10^4 <= nums[i] <= 3*10^4", "Exactly one element appears once; the rest appear twice."],
    hint: "XOR is its own inverse and commutes — xoring everything erases pairs and keeps the singleton.",
    tests: [
      { input: "3\n2 2 1", output: "1" },
      { input: "5\n4 1 2 1 2", output: "4" },
      { input: "1\n1", output: "1" },
    ],
  },
  {
    title: "Number of 1 Bits",
    difficulty: "Easy",
    topics: "Bit Manipulation, Divide and Conquer",
    statement:
      "Count the set bits ('1's) in the 32-bit binary representation of a non-negative integer.",
    input: "One line: non-negative integer `n` (< 2^32).",
    output: "Print the popcount.",
    constraints: ["0 <= n < 2^32"],
    hint: "n & (n−1) clears the lowest set bit — loop until zero, counting iterations.",
    tests: [
      { input: "11", output: "3" },
      { input: "128", output: "1" },
      { input: "4294967293", output: "31" },
    ],
  },
  {
    title: "Pow(x, n)",
    difficulty: "Medium",
    topics: "Math, Recursion, Binary Exponentiation",
    statement:
      "Compute x raised to the integer power n. Negative exponents invert the base. Implement fast exponentiation yourself — no library pow. Output fixed to five decimal places.",
    input: "Line 1: real number `x` (-100.0 <= x <= 100.0).\nLine 2: integer `n` (-2^31 <= n <= 2^31 - 1, treat n = -2^31 as out of scope: not present in tests).",
    output: "Print x^n rounded/fixed to exactly 5 decimal places.",
    constraints: ["-100.0 <= x <= 100.0", "-2^30 < n < 2^31 - 1", "|result| stays within 10^4 in all tests."],
    hint: "Square-and-multiply: halve the exponent recursively; negate at the end for negative powers.",
    tests: [
      { input: "2.0\n10", output: "1024.00000" },
      { input: "2.1\n3", output: "9.26100" },
      { input: "2.0\n-2", output: "0.25000" },
    ],
  },
];
