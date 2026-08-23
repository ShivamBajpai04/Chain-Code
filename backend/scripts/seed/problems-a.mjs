// Part A: Arrays & Hashing, Two Pointers / Sliding Window, Stack, Binary Search
// All statements, formats and tests are authored for ChainCode (stdin/stdout judging).
export const problemsA = [
  // ---------- Arrays & Hashing ----------
  {
    title: "Contains Duplicate",
    difficulty: "Easy",
    topics: "Array, Hash Table, Sorting",
    statement:
      "Given an array of integers `nums`, determine whether any value appears **at least twice** in the array. Return `true` if some value repeats, and `false` if every element is distinct.",
    input: "Line 1: integer `n` — the number of elements.\nLine 2: `n` space-separated integers `nums[i]`.",
    output: "Print `true` if a duplicate exists, otherwise print `false`.",
    constraints: ["1 <= n <= 10^5", "-10^9 <= nums[i] <= 10^9"],
    hint: "Insert every value into a hash set; the first insert that already exists answers the question.",
    tests: [
      { input: "4\n1 2 3 1", output: "true" },
      { input: "4\n1 2 3 4", output: "false" },
      { input: "6\n1 1 1 3 3 4", output: "true" },
    ],
  },
  {
    title: "Valid Anagram",
    difficulty: "Easy",
    topics: "String, Hash Table, Sorting",
    statement:
      "Two lowercase strings `s` and `t` are given. Return `true` if `t` is an anagram of `s`, i.e. `t` can be formed by rearranging the letters of `s` exactly; otherwise return `false`.",
    input: "Line 1: string `s`.\nLine 2: string `t`. Both contain only lowercase letters 'a'–'z'.",
    output: "Print `true` or `false`.",
    constraints: ["1 <= s.length, t.length <= 5*10^4"],
    hint: "Count letter frequencies of one string and subtract the other's — all counters must end at zero.",
    tests: [
      { input: "anagram\nnagaram", output: "true" },
      { input: "rat\ncar", output: "false" },
      { input: "aab\nabb", output: "false" },
    ],
  },
  {
    title: "Two Sum II - Sorted Array",
    difficulty: "Medium",
    topics: "Array, Two Pointers, Binary Search",
    statement:
      "An array of integers sorted in non-decreasing order and an integer `target` are given. Exactly one pair of numbers adds up to `target`. Output their **1-based** positions, printing the smaller index first. Your solution should use constant extra space.",
    input: "Line 1: integers `n` and `target`.\nLine 2: `n` space-separated integers given in non-decreasing order. Exactly one valid pair exists.",
    output: "Print two integers — the 1-based indices of the pair, smaller index first, separated by a space.",
    constraints: ["2 <= n <= 3*10^4", "-1000 <= nums[i] <= 1000", "The array is sorted and exactly one solution exists."],
    hint: "Start one pointer at each end; move the left pointer right when the sum is too small and the right pointer left when it is too large.",
    tests: [
      { input: "7 9\n1 3 4 5 7 10 11", output: "3 4" },
      { input: "4 9\n2 7 11 15", output: "1 2" },
      { input: "5 1\n-3 -1 0 2 4", output: "2 4" },
    ],
  },
  {
    title: "Majority Element",
    difficulty: "Easy",
    topics: "Array, Hash Table, Divide and Conquer",
    statement:
      "Find the element that appears **more than ⌊n / 2⌋ times** in the array. You may assume such an element always exists. Can you do it in linear time and O(1) extra space?",
    input: "Line 1: integer `n`.\nLine 2: `n` space-separated integers.",
    output: "Print the majority element.",
    constraints: ["1 <= n <= 5*10^4", "-10^9 <= nums[i] <= 10^9", "A majority element is guaranteed to exist."],
    hint: "Boyer–Moore voting: keep a candidate and a counter; cancel out pairs of different values — the survivor wins.",
    tests: [
      { input: "3\n3 2 3", output: "3" },
      { input: "7\n2 2 1 1 1 2 2", output: "2" },
      { input: "1\n7", output: "7" },
    ],
  },
  {
    title: "Missing Number",
    difficulty: "Easy",
    topics: "Array, Math, Bit Manipulation",
    statement:
      "An array contains `n` **distinct** numbers taken from the range `[0, n]`. Exactly one number from the range is missing. Find it.",
    input: "Line 1: integer `n`.\nLine 2: `n` distinct space-separated integers from the range [0, n].",
    output: "Print the missing number.",
    constraints: ["1 <= n <= 10^4", "All values are distinct and lie in [0, n]."],
    hint: "The sum of 0..n minus the sum of the array is the answer — or XOR every index and value together.",
    tests: [
      { input: "3\n3 0 1", output: "2" },
      { input: "1\n0", output: "1" },
      { input: "9\n9 6 4 2 3 5 7 0 1", output: "8" },
    ],
  },
  {
    title: "Move Zeroes",
    difficulty: "Easy",
    topics: "Array, Two Pointers",
    statement:
      "Move every `0` in the array to the end while keeping the relative order of the non-zero elements. Do it with as few operations as you can (ideally in-place). Print the resulting array.",
    input: "Line 1: integer `n`.\nLine 2: `n` space-separated integers.",
    output: "Print the transformed array as space-separated integers on one line.",
    constraints: ["1 <= n <= 10^4", "-10^9 <= nums[i] <= 10^9"],
    hint: "A slow pointer marks where the next non-zero belongs; scan once with a fast pointer and swap.",
    tests: [
      { input: "5\n0 1 0 3 12", output: "1 3 12 0 0" },
      { input: "1\n0", output: "0" },
      { input: "3\n0 0 1", output: "1 0 0" },
    ],
  },
  {
    title: "Best Time to Buy and Sell Stock",
    difficulty: "Easy",
    topics: "Array, Dynamic Programming, Greedy",
    statement:
      "`prices[i]` is the price of a stock on day `i`. Choose one day to buy and a **later** day to sell to maximise profit. Return the maximum profit, or `0` if no profitable trade exists.",
    input: "Line 1: integer `n`.\nLine 2: `n` space-separated integers `prices[i]`.",
    output: "Print the maximum achievable profit.",
    constraints: ["1 <= n <= 10^5", "0 <= prices[i] <= 10^4"],
    hint: "Track the cheapest price so far while scanning; at each day compute price − minimum-so-far and keep the best.",
    tests: [
      { input: "6\n7 1 5 3 6 4", output: "5" },
      { input: "5\n7 6 4 3 1", output: "0" },
      { input: "4\n2 4 1 7", output: "6" },
    ],
  },
  {
    title: "Maximum Subarray",
    difficulty: "Medium",
    topics: "Array, Dynamic Programming, Divide and Conquer",
    statement:
      "Find the contiguous subarray with the largest sum among an array of integers and return that sum. Try also to solve it with the divide-and-conquer approach in O(n log n).",
    input: "Line 1: integer `n`.\nLine 2: `n` space-separated integers.",
    output: "Print the largest subarray sum.",
    constraints: ["1 <= n <= 10^5", "-10^4 <= nums[i] <= 10^4"],
    hint: "Kadane's algorithm: extend the current run or restart it at the current element — whichever is larger.",
    tests: [
      { input: "9\n-2 1 -3 4 -1 2 1 -5 4", output: "6" },
      { input: "1\n1", output: "1" },
      { input: "5\n5 4 -1 7 8", output: "23" },
      { input: "3\n-1 -2 -3", output: "-1" },
    ],
  },
  {
    title: "Product of Array Except Self",
    difficulty: "Medium",
    topics: "Array, Prefix Sum",
    statement:
      "Return an array `answer` where `answer[i]` equals the product of every element of `nums` except `nums[i]`. Division is forbidden — write an algorithm that runs in O(n) without it.",
    input: "Line 1: integer `n`.\nLine 2: `n` space-separated integers.",
    output: "Print `n` space-separated integers — the products excluding each position.",
    constraints: ["2 <= n <= 10^5", "-30 <= nums[i] <= 30", "Every prefix/suffix product fits in a 32-bit integer."],
    hint: "Two sweeps: first store the product of everything left of i, then multiply in the product of everything right of i.",
    tests: [
      { input: "4\n1 2 3 4", output: "24 12 8 6" },
      { input: "5\n-1 1 0 -3 3", output: "0 0 9 0 0" },
      { input: "2\n2 3", output: "3 2" },
    ],
  },
  {
    title: "Longest Consecutive Sequence",
    difficulty: "Medium",
    topics: "Array, Hash Table, Union Find",
    statement:
      "Find the length of the longest run of consecutive integers contained in the array when the elements can be arranged in any order. An O(n) algorithm is expected.",
    input: "Line 1: integer `n`.\nLine 2: `n` space-separated integers.",
    output: "Print the length of the longest consecutive sequence.",
    constraints: ["0 <= n <= 10^5", "-10^9 <= nums[i] <= 10^9"],
    hint: "Put all values in a set; only start counting from values whose predecessor is absent.",
    tests: [
      { input: "6\n100 4 200 1 3 2", output: "4" },
      { input: "10\n0 3 7 2 5 8 4 6 0 1", output: "9" },
      { input: "4\n1 2 0 1", output: "3" },
    ],
  },
  {
    title: "Merge Intervals",
    difficulty: "Medium",
    topics: "Array, Sorting",
    statement:
      "Given a collection of intervals, merge every group of overlapping intervals and return the non-overlapping intervals that cover all inputs. Overlapping includes touching endpoints (`[1,4]` and `[4,5]` merge).",
    input: "Line 1: integer `n`.\nNext `n` lines: two integers `start end` per interval.",
    output: "Print the merged intervals, one `start end` per line, sorted by start.",
    constraints: ["1 <= n <= 10^4", "0 <= start <= end <= 10^4"],
    hint: "Sort by start, then sweep: either extend the current interval or open a new one.",
    tests: [
      { input: "4\n1 3\n2 6\n8 10\n15 18", output: "1 6\n8 10\n15 18" },
      { input: "2\n1 4\n4 5", output: "1 5" },
      { input: "2\n1 4\n2 3", output: "1 4" },
    ],
  },
  {
    title: "Insert Interval",
    difficulty: "Medium",
    topics: "Array",
    statement:
      "You have a list of disjoint, sorted intervals and one new interval. Insert the new interval into the list, merging wherever needed. The list must stay sorted and disjoint afterwards.",
    input: "Line 1: integer `n`.\nNext `n` lines: two integers `start end` — disjoint intervals sorted by start.\nLast line: two integers `ns ne` — the new interval.",
    output: "Print the resulting intervals, one `start end` per line.",
    constraints: ["0 <= n <= 10^4", "0 <= start <= end <= 10^5"],
    hint: "Everything entirely before the new interval passes through unchanged; merge everything it overlaps; then pass through the rest.",
    tests: [
      { input: "2\n1 3\n6 9\n2 5", output: "1 5\n6 9" },
      { input: "5\n1 2\n3 5\n6 7\n8 10\n12 16\n4 8", output: "1 2\n3 10\n12 16" },
      { input: "1\n1 5\n1 5", output: "1 5" },
    ],
  },
  {
    title: "Non-overlapping Intervals",
    difficulty: "Medium",
    topics: "Array, Greedy, Sorting",
    statement:
      "Intervals may overlap. Find the **minimum number of intervals you must remove** so that the remaining ones do not overlap at all. Intervals that merely touch at an endpoint (`[1,2]` and `[2,3]`) do not count as overlapping.",
    input: "Line 1: integer `n`.\nNext `n` lines: two integers `start end`.",
    output: "Print the minimum number of removals.",
    constraints: ["1 <= n <= 10^5", "-5*10^4 <= start < end <= 5*10^4"],
    hint: "Greedily keep intervals with the smallest end; every clash forces one removal.",
    tests: [
      { input: "4\n1 2\n2 3\n3 4\n1 3", output: "1" },
      { input: "3\n1 2\n1 2\n1 2", output: "2" },
      { input: "2\n1 2\n2 3", output: "0" },
    ],
  },
  {
    title: "Sort Colors",
    difficulty: "Medium",
    topics: "Array, Two Pointers, Sorting",
    statement:
      "An array holds `n` objects coloured `0`, `1` or `2`. Sort them in place so equal colours sit together in the order 0 → 1 → 2, ideally in a single pass using constant memory (the Dutch national flag problem).",
    input: "Line 1: integer `n`.\nLine 2: `n` space-separated integers, each 0, 1 or 2.",
    output: "Print the sorted array as space-separated integers on one line.",
    constraints: ["1 <= n <= 300", "Each element is 0, 1 or 2."],
    hint: "Keep three zones: swap 0s to the front boundary and 2s to the back boundary as you scan.",
    tests: [
      { input: "6\n2 0 2 1 1 0", output: "0 0 1 1 2 2" },
      { input: "3\n2 0 1", output: "0 1 2" },
      { input: "1\n0", output: "0" },
    ],
  },
  {
    title: "Set Matrix Zeroes",
    difficulty: "Medium",
    topics: "Array, Hash Table, Matrix",
    statement:
      "If any cell of an m×n matrix holds `0`, its entire row and column must become `0`. Transform the matrix in place and print it. Can you achieve O(m+n) extra space — or better, O(1)?",
    input: "Line 1: integers `m n`.\nNext `m` lines: `n` space-separated integers each.",
    output: "Print the transformed matrix — `m` lines of `n` space-separated integers.",
    constraints: ["1 <= m, n <= 200", "-10^9 <= matrix[i][j] <= 10^9"],
    hint: "Use the first row and column as free markers recording which rows/columns must be cleared.",
    tests: [
      { input: "3 3\n1 1 1\n1 0 1\n1 1 1", output: "1 0 1\n0 0 0\n1 0 1" },
      { input: "2 2\n0 1\n1 1", output: "0 0\n0 1" },
      { input: "1 3\n1 2 3", output: "1 2 3" },
    ],
  },

  // ---------- Two Pointers / Sliding Window ----------
  {
    title: "Valid Palindrome",
    difficulty: "Easy",
    topics: "String, Two Pointers",
    statement:
      "A phrase is a palindrome if, after lowercasing and removing every non-alphanumeric character, it reads the same forwards and backwards. Decide whether the given phrase is a palindrome.",
    input: "One line containing the phrase (letters, digits, spaces and punctuation possible). Read the whole line.",
    output: "Print `true` or `false`.",
    constraints: ["1 <= length of line <= 2*10^5"],
    hint: "Two pointers closing in from both ends skip anything that isn't alphanumeric and compare lowercased characters.",
    tests: [
      { input: "A man, a plan, a canal: Panama", output: "true" },
      { input: "race a car", output: "false" },
      { input: "0P", output: "false" },
    ],
  },
  {
    title: "Squares of a Sorted Array",
    difficulty: "Easy",
    topics: "Array, Two Pointers, Sorting",
    statement:
      "An array sorted in non-decreasing order may hold negative numbers. Return an array of the squares of every number, also sorted in non-decreasing order — in O(n), not by sorting the squares naively.",
    input: "Line 1: integer `n`.\nLine 2: `n` space-separated integers in non-decreasing order.",
    output: "Print the squares in non-decreasing order, space-separated on one line.",
    constraints: ["1 <= n <= 10^4", "-10^4 <= nums[i] <= 10^4", "Input is sorted non-decreasingly."],
    hint: "The largest square comes from whichever end has the bigger absolute value — fill the answer from the back with two pointers.",
    tests: [
      { input: "5\n-4 -1 0 3 10", output: "0 1 9 16 100" },
      { input: "5\n-7 -3 2 3 11", output: "4 9 9 49 121" },
      { input: "3\n-3 -2 -1", output: "1 4 9" },
    ],
  },
  {
    title: "3Sum",
    difficulty: "Medium",
    topics: "Array, Two Pointers, Sorting",
    statement:
      "Find every unique triplet `(a, b, c)` in the array with `a + b + c = 0`. Within each triplet the values must be non-decreasing and no duplicate triplets may be reported. Print them in lexicographic order.",
    input: "Line 1: integer `n`.\nLine 2: `n` space-separated integers (may include duplicates).",
    output: "Line 1: the number of unique triplets `k`.\nThen `k` lines, each three space-separated values in non-decreasing order; the lines themselves sorted lexicographically.",
    constraints: ["3 <= n <= 3000", "-10^5 <= nums[i] <= 10^5"],
    hint: "Fix the smallest element with a loop, then hunt the complementary pair with two pointers; skip repeated values to keep triplets unique.",
    tests: [
      { input: "6\n-1 0 1 2 -1 -4", output: "2\n-1 -1 2\n-1 0 1" },
      { input: "3\n0 0 0", output: "1\n0 0 0" },
      { input: "6\n1 2 -3 4 -2 -1", output: "2\n-3 -1 4\n-3 1 2" },
    ],
  },
  {
    title: "Container With Most Water",
    difficulty: "Medium",
    topics: "Array, Two Pointers, Greedy",
    statement:
      "Vertical lines stand at indices `0..n-1`; line `i` has height `h[i]`. Pick two lines together with the x-axis to form a container holding water. The area is `min(h[i], h[j]) * (j - i)`. Maximise the area.",
    input: "Line 1: integer `n`.\nLine 2: `n` space-separated heights.",
    output: "Print the maximum area.",
    constraints: ["2 <= n <= 10^5", "0 <= height[i] <= 10^4"],
    hint: "From both ends, always move the pointer at the shorter wall inward — width only shrinks, so only the taller wall can help.",
    tests: [
      { input: "9\n1 8 6 2 5 4 8 3 7", output: "49" },
      { input: "2\n1 1", output: "1" },
      { input: "5\n4 3 2 1 4", output: "16" },
    ],
  },
  {
    title: "Trapping Rain Water",
    difficulty: "Hard",
    topics: "Array, Two Pointers, Stack, DP",
    statement:
      "Bars of unit width stand at every index with height `h[i]`. After it rains, water gathers over the dips. Compute how many units of water the elevation map traps in total.",
    input: "Line 1: integer `n`.\nLine 2: `n` space-separated non-negative heights.",
    output: "Print the total trapped water.",
    constraints: ["1 <= n <= 2*10^4", "0 <= height[i] <= 10^5"],
    hint: "Water above bar i is min(maxLeft(i), maxRight(i)) − h[i]; two pointers let you compute this in one pass without arrays.",
    tests: [
      { input: "12\n0 1 0 2 1 0 1 3 2 1 2 1", output: "6" },
      { input: "6\n4 2 0 3 2 5", output: "9" },
      { input: "3\n1 2 3", output: "0" },
    ],
  },
  {
    title: "Longest Substring Without Repeating Characters",
    difficulty: "Medium",
    topics: "String, Sliding Window, Hash Table",
    statement:
      "Find the length of the longest substring (contiguous) that contains no repeated characters.",
    input: "One line containing the string `s` (any printable ASCII letters/digits). Read the whole line.",
    output: "Print the length of the longest repeat-free substring.",
    constraints: ["0 <= s.length <= 5*10^4"],
    hint: "Slide a window right, storing last seen positions; when a duplicate enters, jump the left edge past its previous occurrence.",
    tests: [
      { input: "abcabcbb", output: "3" },
      { input: "bbbbb", output: "1" },
      { input: "pwwkew", output: "3" },
    ],
  },
  {
    title: "Minimum Size Subarray Sum",
    difficulty: "Medium",
    topics: "Array, Sliding Window, Binary Search",
    statement:
      "Given an array of positive integers and a target, find the minimal length of a contiguous subarray whose sum is at least `target`. If no such subarray exists, return `0`.",
    input: "Line 1: integers `target n`.\nLine 2: `n` positive space-separated integers.",
    output: "Print the minimal window length, or `0`.",
    constraints: ["1 <= target <= 10^9", "1 <= n <= 10^5", "1 <= nums[i] <= 10^4"],
    hint: "Grow the window on the right; while the sum is big enough, record the size and shrink from the left.",
    tests: [
      { input: "7 6\n2 3 1 2 4 3", output: "2" },
      { input: "4 3\n1 4 4", output: "1" },
      { input: "11 8\n1 1 1 1 1 1 1 1", output: "0" },
    ],
  },
  {
    title: "Max Consecutive Ones III",
    difficulty: "Medium",
    topics: "Array, Sliding Window",
    statement:
      "A binary array and an integer `k` are given. You may flip at most `k` zeros to ones. Report the length of the longest contiguous run of ones achievable.",
    input: "Line 1: integers `n k`.\nLine 2: `n` space-separated values, each 0 or 1.",
    output: "Print the longest achievable run of ones.",
    constraints: ["1 <= n <= 10^5", "0 <= k <= n", "Each element is 0 or 1."],
    hint: "Classic sliding window: never let more than k zeros live inside the window.",
    tests: [
      { input: "11 2\n1 1 1 0 0 0 1 1 1 1 0", output: "6" },
      { input: "1 0\n0", output: "0" },
      { input: "3 1\n1 0 1", output: "3" },
    ],
  },

  // ---------- Stack ----------
  {
    title: "Valid Parentheses",
    difficulty: "Easy",
    topics: "String, Stack",
    statement:
      "A bracket string consists only of `()[]{}`. It is valid when every opening bracket closes with the same kind, in the correct order, and nothing is left unclosed. Decide validity.",
    input: "One line containing only bracket characters.",
    output: "Print `true` or `false`.",
    constraints: ["1 <= s.length <= 10^4"],
    hint: "Push opens onto a stack; every closer must match the stack's top, which must be empty at the end.",
    tests: [
      { input: "()[]{}", output: "true" },
      { input: "(]", output: "false" },
      { input: "([)]", output: "false" },
      { input: "{[]}", output: "true" },
    ],
  },
  {
    title: "Evaluate Reverse Polish Notation",
    difficulty: "Medium",
    topics: "Array, Stack, Math",
    statement:
      "An arithmetic expression is given in postfix (reverse Polish) notation with operators `+ - * /`. Evaluate it. Division truncates toward zero; the expression always denotes a valid 32-bit result.",
    input: "One line of space-separated tokens: integers or the operators + - * /.",
    output: "Print the value of the expression.",
    constraints: ["1 <= tokens.length <= 10^4", "|operand| <= 200", "Division truncates toward zero."],
    hint: "Numbers go on a stack; each operator pops two operands — mind the operand order for `-` and `/`.",
    tests: [
      { input: "2 1 + 3 *", output: "6" },
      { input: "4 13 5 / +", output: "6" },
      { input: "10 6 9 3 + -11 * / * 17 + 5 +", output: "22" },
    ],
  },
  {
    title: "Daily Temperatures",
    difficulty: "Medium",
    topics: "Array, Stack, Monotonic Stack",
    statement:
      "`t[i]` is today's temperature. For every day, find how many days you must wait until a warmer day arrives; if none ever does, the answer is 0. Print the answers in order.",
    input: "Line 1: integer `n`.\nLine 2: `n` space-separated temperatures.",
    output: "Print `n` space-separated waiting times.",
    constraints: ["1 <= n <= 10^5", "30 <= t[i] <= 100"],
    hint: "A monotonic decreasing stack of pending days pops the moment a warmer temperature shows up.",
    tests: [
      { input: "8\n73 74 75 71 69 72 76 73", output: "1 1 4 2 1 1 0 0" },
      { input: "4\n30 40 50 60", output: "1 1 1 0" },
      { input: "3\n30 60 90", output: "1 1 0" },
    ],
  },
  {
    title: "Largest Rectangle in Histogram",
    difficulty: "Hard",
    topics: "Array, Stack, Monotonic Stack",
    statement:
      "Histogram bars each have width 1 and height `h[i]`. Find the largest rectangle that fits entirely under the histogram and print its area.",
    input: "Line 1: integer `n`.\nLine 2: `n` space-separated non-negative heights.",
    output: "Print the maximal rectangle area.",
    constraints: ["1 <= n <= 10^5", "0 <= height[i] <= 10^4"],
    hint: "Sweep with an increasing stack; when a shorter bar appears, pop and settle areas with the popped bar as the limiting height.",
    tests: [
      { input: "6\n2 1 5 6 2 3", output: "10" },
      { input: "2\n2 4", output: "4" },
      { input: "4\n1 1 1 1", output: "4" },
    ],
  },
  {
    title: "Simplify Path",
    difficulty: "Medium",
    topics: "String, Stack",
    statement:
      "Turn an absolute Unix-style file path into its canonical form: collapse multiple slashes, resolve `.` and `..`, and drop any trailing slash. The path starts with `/`.",
    input: "One line containing the path.",
    output: "Print the canonical path.",
    constraints: ["1 <= path.length <= 3000", "Path consists of letters, digits, '.', '_' and '/'."],
    hint: "Split on '/', push real names onto a stack, pop on '..', then rejoin.",
    tests: [
      { input: "/home/", output: "/home" },
      { input: "/../", output: "/" },
      { input: "/home//foo/", output: "/home/foo" },
      { input: "/a/./b/../../c/", output: "/c" },
    ],
  },
  {
    title: "Remove K Digits",
    difficulty: "Medium",
    topics: "String, Stack, Greedy",
    statement:
      "A non-negative integer is given as a string along with `k`. Remove exactly `k` digits so the remaining number is as small as possible. Drop leading zeros; if nothing remains the answer is `\"0\"`.",
    input: "Line 1: the number as a string `s` (digits only).\nLine 2: integer `k`.",
    output: "Print the smallest resulting number without leading zeros (print `0` if it becomes empty).",
    constraints: ["1 <= k <= s.length <= 10^5", "s consists of digits only."],
    hint: "Greedily delete any digit bigger than its successor using a monotonic stack; trim leftovers and leading zeros.",
    tests: [
      { input: "1432219\n3", output: "1219" },
      { input: "10200\n1", output: "200" },
      { input: "10\n2", output: "0" },
    ],
  },
  {
    title: "Asteroid Collision",
    difficulty: "Medium",
    topics: "Array, Stack",
    statement:
      "Asteroids move along a line; the sign is the direction (+right, −left) and the absolute value is the size. When two meet, the smaller explodes; equal sizes annihilate both; same-direction meetings are harmless. Report the surviving asteroids left to right.",
    input: "Line 1: integer `n`.\nLine 2: `n` space-signed non-zero integers.",
    output: "Print the survivors as space-separated signed integers (if none survive, print nothing on the line).",
    constraints: ["1 <= n <= 10^4", "-1000 <= a[i] <= 1000", "a[i] != 0"],
    hint: "Only a right-mover followed by a left-mover collides — resolve against a stack of survivors until stable.",
    tests: [
      { input: "3\n5 10 -5", output: "5 10" },
      { input: "3\n10 2 -5", output: "10" },
      { input: "4\n-2 -1 1 2", output: "-2 -1 1 2" },
    ],
  },

  // ---------- Binary Search ----------
  {
    title: "Binary Search",
    difficulty: "Easy",
    topics: "Array, Binary Search",
    statement:
      "A sorted array and a target are given. Return the index of the target, or `-1` if absent. Aim for O(log n).",
    input: "Line 1: integers `n target`.\nLine 2: `n` space-separated integers in ascending order, distinct.",
    output: "Print the 0-based index of `target`, or `-1`.",
    constraints: ["1 <= n <= 10^4", "-10^4 < nums[i], target < 10^4", "Values are distinct and sorted."],
    hint: "Halve the search interval every step; compare the middle element to the target.",
    tests: [
      { input: "6 9\n-1 0 3 5 9 12", output: "4" },
      { input: "6 2\n-1 0 3 5 9 12", output: "-1" },
      { input: "1 5\n5", output: "0" },
    ],
  },
  {
    title: "Search Insert Position",
    difficulty: "Easy",
    topics: "Array, Binary Search",
    statement:
      "In a sorted array of distinct integers, return the index of `target`; if it is absent, return the index where it would be inserted to keep the order. O(log n) expected.",
    input: "Line 1: integers `n target`.\nLine 2: `n` distinct space-separated integers in ascending order.",
    output: "Print the found or insertion index.",
    constraints: ["1 <= n <= 10^4", "-10^4 <= nums[i] <= 10^4"],
    hint: "It is simply the first index whose value is ≥ target — a textbook lower-bound binary search.",
    tests: [
      { input: "4 5\n1 3 5 6", output: "2" },
      { input: "4 2\n1 3 5 6", output: "1" },
      { input: "4 7\n1 3 5 6", output: "4" },
    ],
  },
  {
    title: "Sqrt(x)",
    difficulty: "Easy",
    topics: "Math, Binary Search",
    statement:
      "Compute and truncate toward zero the square root of a non-negative integer `x`. No library power/root functions allowed.",
    input: "One line: integer `x`.",
    output: "Print floor(sqrt(x)).",
    constraints: ["0 <= x <= 2^31 - 1"],
    hint: "Binary-search the answer in [0, x]: the largest y with y*y <= x. Watch for overflow — use 64-bit multiplication.",
    tests: [
      { input: "4", output: "2" },
      { input: "8", output: "2" },
      { input: "2147395599", output: "46339" },
    ],
  },
  {
    title: "Find Minimum in Rotated Sorted Array",
    difficulty: "Medium",
    topics: "Array, Binary Search",
    statement:
      "An array sorted ascending was rotated between 1 and n times at an unknown pivot. All elements are distinct. Find the minimum element in O(log n).",
    input: "Line 1: integer `n`.\nLine 2: `n` distinct space-separated integers (rotated sorted order).",
    output: "Print the minimum element.",
    constraints: ["1 <= n <= 5000", "-5000 <= nums[i] <= 5000"],
    hint: "Compare the middle with the right end: a sorted right half means the minimum hides left of mid.",
    tests: [
      { input: "5\n3 4 5 1 2", output: "1" },
      { input: "7\n4 5 6 7 0 1 2", output: "0" },
      { input: "5\n11 13 15 17 18", output: "11" },
    ],
  },
  {
    title: "Search in Rotated Sorted Array",
    difficulty: "Medium",
    topics: "Array, Binary Search",
    statement:
      "A distinct-values array sorted ascending got rotated at an unknown pivot. Given a target, return its index or `-1`. Required running time O(log n).",
    input: "Line 1: integers `n target`.\nLine 2: `n` distinct space-separated integers in rotated sorted order.",
    output: "Print the index of `target` or `-1`.",
    constraints: ["1 <= n <= 5000", "-10^4 <= nums[i], target <= 10^4"],
    hint: "One half of any split around mid is still perfectly sorted — check which half, then decide where the target can live.",
    tests: [
      { input: "7 0\n4 5 6 7 0 1 2", output: "4" },
      { input: "7 3\n4 5 6 7 0 1 2", output: "-1" },
      { input: "1 0\n1", output: "-1" },
    ],
  },
  {
    title: "Find Peak Element",
    difficulty: "Medium",
    topics: "Array, Binary Search",
    statement:
      "A peak element is strictly greater than its neighbours; positions outside the array count as −∞. The array may contain several peaks — return the index of **the peak reached by binary search**, i.e. apply the classic mid-slope rule; for the tests below this yields a unique answer.",
    input: "Line 1: integer `n`.\nLine 2: `n` space-separated integers.",
    output: "Print the index produced by binary search: repeatedly move toward the larger neighbour until a peak is confirmed.",
    constraints: ["1 <= n <= 1000", "-2^31 <= nums[i] <= 2^31 - 1", "nums[i] != nums[i+1]", "Test arrays are chosen so the binary-search peak is unique."],
    hint: "If nums[mid] < nums[mid+1] a peak lies to the right; otherwise one lies at mid or to the left.",
    tests: [
      { input: "7\n1 3 5 7 6 4 2", output: "3" },
      { input: "5\n5 4 3 2 1", output: "0" },
      { input: "5\n1 2 3 4 5", output: "4" },
    ],
  },
  {
    title: "Koko Eating Bananas",
    difficulty: "Medium",
    topics: "Array, Binary Search",
    statement:
      "Koko loves bananas. Pile `i` holds `piles[i]` bananas and she must finish all piles within `h` hours. Each hour she picks one pile and eats speed `k` bananas from it (if the pile has fewer, she eats it and idles the rest of the hour). Find the minimum integer speed `k` that finishes in time.",
    input: "Line 1: integers `n h`.\nLine 2: `n` space-separated pile sizes.",
    output: "Print the minimal eating speed.",
    constraints: ["1 <= n <= 10^4", "n <= h <= 10^9", "1 <= piles[i] <= 10^9"],
    hint: "Binary search the speed in [1, max(piles)]; hours(k) = Σ ceil(pile/k) must not exceed h.",
    tests: [
      { input: "4 8\n3 6 7 11", output: "4" },
      { input: "5 5\n30 11 23 4 20", output: "30" },
      { input: "5 6\n30 11 23 4 20", output: "23" },
    ],
  },
];
