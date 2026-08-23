// Part B: Linked List, Trees, Heap
// All statements, formats and tests are authored for ChainCode (stdin/stdout judging).
export const problemsB = [
  // ---------- Linked List (array-encoded) ----------
  // Convention: Line 1: n. Line 2: n values, head -> tail.
  {
    title: "Reverse Linked List",
    difficulty: "Easy",
    topics: "Linked List, Recursion",
    statement:
      "Given the head of a singly linked list, reverse the list and print the resulting sequence from the new head to the tail.",
    input: "Line 1: integer `n`.\nLine 2: `n` space-separated values — list values from head to tail.",
    output: "Print the reversed list's values, space-separated on one line.",
    constraints: ["1 <= n <= 5000"],
    hint: "Walk the list once flipping each node's next pointer — keep three pointers: prev, curr, next.",
    tests: [
      { input: "5\n1 2 3 4 5", output: "5 4 3 2 1" },
      { input: "2\n1 2", output: "2 1" },
      { input: "1\n7", output: "7" },
    ],
  },
  {
    title: "Merge Two Sorted Lists",
    difficulty: "Easy",
    topics: "Linked List, Recursion",
    statement:
      "Two sorted linked lists are given. Splice their nodes together into one sorted list made of the original nodes and print it.",
    input: "Line 1: `n1`, Line 2: `n1` values (list A). If `n1` is 0 no value line follows.\nLine 3: `n2`, Line 4: `n2` values (list B). Same empty rule applies.\nBoth lists are sorted ascending.",
    output: "Print the merged list's values, space-separated on one line.",
    constraints: ["0 <= n1, n2 <= 50", "-100 <= value <= 100"],
    hint: "Keep a dummy head; always attach the smaller front node and advance that list.",
    tests: [
      { input: "3\n1 2 4\n3\n1 3 4", output: "1 1 2 3 4 4" },
      { input: "0\n1\n0", output: "0" },
      { input: "2\n-5 0\n2\n7 9", output: "-5 0 7 9" },
    ],
  },
  {
    title: "Linked List Cycle",
    difficulty: "Easy",
    topics: "Linked List, Two Pointers",
    statement:
      "`pos` is the index of the node that the tail points back to (`pos = -1` means no cycle — the tail's next is null). Determine whether the list contains a cycle.",
    input: "Line 1: integer `n`.\nLine 2: `n` space-separated values.\nLine 3: integer `pos` (-1 or a valid 0-based index).",
    output: "Print `true` if a cycle exists, otherwise `false`.",
    constraints: ["1 <= n <= 10^4", "-1 <= pos < n"],
    hint: "Floyd's tortoise and hare: a fast pointer moving two steps meets a slow one exactly when a cycle exists.",
    tests: [
      { input: "4\n3 2 0 -4\n1", output: "true" },
      { input: "2\n1 2\n0", output: "true" },
      { input: "1\n1\n-1", output: "false" },
    ],
  },
  {
    title: "Middle of the Linked List",
    difficulty: "Easy",
    topics: "Linked List, Two Pointers",
    statement:
      "Return the middle node of the list. When the length is even, return the **second** of the two middle nodes. Print the remaining chain starting at that middle node.",
    input: "Line 1: integer `n`.\nLine 2: `n` space-separated values.",
    output: "Print the values from the middle node to the end, space-separated on one line.",
    constraints: ["1 <= n <= 100"],
    hint: "Fast pointer steps twice as far; when it lands on or past the end, slow sits on the middle.",
    tests: [
      { input: "5\n1 2 3 4 5", output: "3 4 5" },
      { input: "4\n1 2 3 4", output: "3 4" },
      { input: "1\n1", output: "1" },
    ],
  },
  {
    title: "Remove Nth Node From End of List",
    difficulty: "Medium",
    topics: "Linked List, Two Pointers",
    statement:
      "Delete the `k`-th node counting from the **end** of the list (k is always valid) in one pass if you can, then print the surviving list.",
    input: "Line 1: integer `n`.\nLine 2: `n` space-separated values.\nLine 3: integer `k` (1 <= k <= n).",
    output: "Print the list after deletion, space-separated on one line. Deleting the only node leaves an empty line.",
    constraints: ["1 <= n <= 30", "1 <= k <= n"],
    hint: "Advance one pointer k nodes ahead, then move both until the lead hits the end — the follower sits just before the victim.",
    tests: [
      { input: "5\n1 2 3 4 5\n2", output: "1 2 3 5" },
      { input: "2\n1 2\n1", output: "1" },
      { input: "2\n1 2\n2", output: "2" },
    ],
  },
  {
    title: "Reorder List",
    difficulty: "Medium",
    topics: "Linked List, Stack, Two Pointers",
    statement:
      "Rewire the list into the zig-zag order L0 → Ln → L1 → Ln−1 → L2 → … without changing any node values, then print it. You may not take values, only re-link nodes.",
    input: "Line 1: integer `n`.\nLine 2: `n` space-separated values.",
    output: "Print the rewired order, space-separated on one line.",
    constraints: ["1 <= n <= 5*10^4"],
    hint: "Find the middle, reverse the second half, then interleave the two halves node by node.",
    tests: [
      { input: "4\n1 2 3 4", output: "1 4 2 3" },
      { input: "5\n1 2 3 4 5", output: "1 5 2 4 3" },
      { input: "2\n10 20", output: "10 20" },
    ],
  },
  {
    title: "Add Two Numbers",
    difficulty: "Medium",
    topics: "Linked List, Math, Recursion",
    statement:
      "Two non-negative integers are stored with digits in reverse order (each node holds one digit). Add them and print the sum in the same reversed representation. No leading zeros except the number 0 itself.",
    input: "Line 1: `n1`, Line 2: digits of number A least-significant first (if `n1` is 0 skip this line).\nLine 3: `n2`, Line 4: digits of number B likewise.",
    output: "Print the digit sequence of A+B least-significant first, space-separated on one line.",
    constraints: ["1 <= n1, n2 <= 100"],
    hint: "Add digit by digit carrying the overflow; don't forget a trailing carry node like the final 1 in 9999999 + 9999.",
    tests: [
      { input: "3\n2 4 3\n3\n5 6 4", output: "7 0 8" },
      { input: "1\n0\n1\n0", output: "0" },
      { input: "7\n9 9 9 9 9 9 9\n4\n9 9 9 9", output: "8 9 9 9 0 0 0 1" },
    ],
  },
  {
    title: "Copy List with Random Pointer",
    difficulty: "Medium",
    topics: "Hash Table, Linked List",
    statement:
      "Each node carries `next` plus a `random` pointer to any node (or null). Deep-copy the whole list — new nodes, no shared objects — and print the clone encoded the same way.",
    input: "Line 1: integer `n`.\nNext `n` lines: `val r` where `val` is the node value and `r` the 0-based index its random pointer targets, or `-1` for null.",
    output: "Print `n` lines describing the cloned list in the same `val r` format (indices refer to the clone, which mirrors the original structure).",
    constraints: ["0 <= n <= 1000", "-10^4 <= val <= 10^4"],
    hint: "Weave clones between originals so copy.random = orig.random.next; then unweave — O(1) extra space, no hash map needed.",
    tests: [
      { input: "5\n7 -1\n13 0\n11 4\n10 2\n1 0", output: "7 -1\n13 0\n11 4\n10 2\n1 0" },
      { input: "2\n1 1\n2 1", output: "1 1\n2 1" },
      { input: "3\n3 -1\n3 0\n3 -1", output: "3 -1\n3 0\n3 -1" },
    ],
  },
  {
    title: "LRU Cache",
    difficulty: "Medium",
    topics: "Hash Table, Linked List, Design",
    statement:
      "Simulate an LRU cache with fixed capacity. `get key` returns the value (or −1) and marks the key most-recently-used; `put key value` inserts/updates and evicts the least-recently-used entry when over capacity. Both operations should be O(1) average.",
    input: "Line 1: integers `capacity q`.\nNext `q` lines: either `get k` or `put k v`. `put` never stores negative values.",
    output: "For every `get`, print the result on its own line, in order.",
    constraints: ["1 <= capacity <= 3000", "1 <= q <= 10^4", "0 <= key <= 10^4", "0 <= value <= 10^5"],
    hint: "A hash map onto a doubly linked list gives both O(1) lookup and O(1) reordering/eviction.",
    tests: [
      {
        input: "2 9\nput 1 1\nput 2 2\nget 1\nput 3 3\nget 2\nput 4 4\nget 1\nget 3\nget 4",
        output: "1\n-1\n-1\n3\n4",
      },
      {
        input: "1 4\nput 5 50\nget 5\nput 6 60\nget 5",
        output: "50\n-1",
      },
    ],
  },

  // ---------- Trees ----------
  // Convention: level-order tokens on ONE line, "null" for missing children (trailing nulls trimmed).
  {
    title: "Maximum Depth of Binary Tree",
    difficulty: "Easy",
    topics: "Tree, BFS, DFS",
    statement:
      "Return the depth of a binary tree — the number of nodes along the longest root-to-leaf path.",
    input: "One line: level-order tokens separated by spaces, using `null` for absent children (e.g. `3 9 20 null null 15 7`). The tree is non-empty.",
    output: "Print the maximum depth as an integer.",
    constraints: ["1 <= number of nodes <= 10^4", "-100 <= Node.val <= 100"],
    hint: "depth(node) = 1 + max(depth(left), depth(right)) — recursion writes itself.",
    tests: [
      { input: "3 9 20 null null 15 7", output: "3" },
      { input: "1 null 2", output: "2" },
      { input: "1 2 3 4 5", output: "3" },
    ],
  },
  {
    title: "Invert Binary Tree",
    difficulty: "Easy",
    topics: "Tree, BFS, DFS",
    statement:
      "Swap the left and right subtree of every node, then print the inverted tree in level-order form (space-separated tokens, trailing `null`s omitted).",
    input: "One line: level-order tokens with `null` markers.",
    output: "Level-order tokens of the inverted tree, space-separated, trailing nulls removed.",
    constraints: ["1 <= number of nodes <= 100", "-100 <= Node.val <= 100"],
    hint: "Recursion: swap the children at every node on the way down (or up) — order of operations doesn't matter.",
    tests: [
      { input: "4 2 7 1 3 6 9", output: "4 7 2 9 6 3 1" },
      { input: "2 1 3", output: "2 3 1" },
      { input: "1", output: "1" },
    ],
  },
  {
    title: "Same Tree",
    difficulty: "Easy",
    topics: "Tree, DFS, BFS",
    statement:
      "Two binary trees are given. Decide whether they are structurally identical and every corresponding pair of nodes holds equal values.",
    input: "Line 1: level-order tokens of tree `p`.\nLine 2: level-order tokens of tree `q`. (`null` marks absent children.)",
    output: "Print `true` if the trees match, else `false`.",
    constraints: ["1 <= nodes in each tree <= 100", "-10^4 <= Node.val <= 10^4"],
    hint: "Recurse pairwise: both null → true; one null or values differ → false; otherwise compare both subtrees.",
    tests: [
      { input: "1 2 3\n1 2 3", output: "true" },
      { input: "1 2\n1 null 2", output: "false" },
      { input: "1 2 1\n1 1 2", output: "false" },
    ],
  },
  {
    title: "Symmetric Tree",
    difficulty: "Easy",
    topics: "Tree, DFS, BFS",
    statement:
      "Check whether a binary tree is a mirror image of itself around its root (left subtree mirrored equals right subtree).",
    input: "One line: level-order tokens with `null` markers.",
    output: "Print `true` if the tree is symmetric, else `false`.",
    constraints: ["1 <= number of nodes <= 1000", "-100 <= Node.val <= 100"],
    hint: "Mirror-compare two pointers that descend together: left.left vs right.right and left.right vs right.left.",
    tests: [
      { input: "1 2 2 3 4 4 3", output: "true" },
      { input: "1 2 2 null 3 null 3", output: "false" },
      { input: "1", output: "true" },
    ],
  },
  {
    title: "Path Sum",
    difficulty: "Easy",
    topics: "Tree, DFS, BFS",
    statement:
      "Decide whether the tree has any root-to-leaf path whose node values add up exactly to `targetSum`.",
    input: "Line 1: level-order tokens of the tree with `null` markers.\nLine 2: integer `targetSum`.",
    output: "Print `true` if such a path exists, else `false`.",
    constraints: ["1 <= number of nodes <= 5000", "-1000 <= Node.val <= 1000", "-1000 <= targetSum <= 1000"],
    hint: "Subtract the node's value as you descend; success is hitting 0 exactly at a leaf.",
    tests: [
      { input: "5 4 8 11 null 13 4 7 2 null null null 1\n22", output: "true" },
      { input: "1 2 3\n5", output: "false" },
      { input: "1 2\n1", output: "false" },
    ],
  },
  {
    title: "Diameter of Binary Tree",
    difficulty: "Easy",
    topics: "Tree, DFS",
    statement:
      "The diameter is the number of edges on the longest path between any two nodes (it may pass through the root or not). Compute it.",
    input: "One line: level-order tokens with `null` markers.",
    output: "Print the diameter measured in edges.",
    constraints: ["1 <= number of nodes <= 10^4", "-100 <= Node.val <= 100"],
    hint: "For each node the best path through it is leftDepth + rightDepth; answer = max over all nodes while computing depths.",
    tests: [
      { input: "1 2 3 4 5", output: "3" },
      { input: "1 2", output: "1" },
      { input: "1", output: "0" },
    ],
  },
  {
    title: "Balanced Binary Tree",
    difficulty: "Easy",
    topics: "Tree, DFS",
    statement:
      "A tree is height-balanced when every node's two subtrees differ in height by at most 1. Decide balance.",
    input: "One line: level-order tokens with `null` markers.",
    output: "Print `true` if balanced, else `false`.",
    constraints: ["1 <= number of nodes <= 5000", "-10^4 <= Node.val <= 10^4"],
    hint: "Compute heights bottom-up; return a failure marker the instant any imbalance appears instead of recomputing heights everywhere.",
    tests: [
      { input: "3 9 20 null null 15 7", output: "true" },
      { input: "1 2 2 3 3 null null 4 4", output: "false" },
      { input: "1 2 2 3 null null 3", output: "true" },
    ],
  },
  {
    title: "Binary Tree Level Order Traversal",
    difficulty: "Medium",
    topics: "Tree, BFS",
    statement:
      "Traverse the tree level by level, left to right, printing each level's values on its own line.",
    input: "One line: level-order tokens with `null` markers.",
    output: "One line per level containing that level's values, space-separated.",
    constraints: ["1 <= number of nodes <= 2000", "-1000 <= Node.val <= 1000"],
    hint: "A queue sized by the current level processes exactly one generation per sweep.",
    tests: [
      { input: "3 9 20 null null 15 7", output: "3\n9 20\n15 7" },
      { input: "1", output: "1" },
      { input: "1 2 3 4 5", output: "1\n2 3\n4 5" },
    ],
  },
  {
    title: "Validate Binary Search Tree",
    difficulty: "Medium",
    topics: "Tree, DFS, BST",
    statement:
      "Verify that the tree is a valid BST: every node's left subtree holds only smaller values and the right subtree only larger ones — not just locally, but globally down the tree. Equal values invalidate it.",
    input: "One line: level-order tokens with `null` markers.",
    output: "Print `true` if the tree is a valid BST, else `false`.",
    constraints: ["1 <= number of nodes <= 10^4", "-2^31 <= Node.val <= 2^31 - 1"],
    hint: "Carry an open interval (min, max) downward, or check that an in-order traversal is strictly increasing.",
    tests: [
      { input: "2 1 3", output: "true" },
      { input: "5 1 4 null null 3 6", output: "false" },
      { input: "2 2 2", output: "false" },
    ],
  },
  {
    title: "Kth Smallest Element in a BST",
    difficulty: "Medium",
    topics: "Tree, DFS, BST",
    statement:
      "In a BST, find the `k`-th smallest value among all nodes (k is 1-based). Follow-up: frequent insert/delete should stay cheap — think about how an augmented structure would help.",
    input: "Line 1: level-order tokens with `null` markers.\nLine 2: integer `k`.",
    output: "Print the k-th smallest value.",
    constraints: ["1 <= number of nodes <= 10^4", "1 <= k <= number of nodes", "All node values are distinct."],
    hint: "An iterative in-order walk pauses precisely at the k-th popped value.",
    tests: [
      { input: "3 1 4 null 2\n1", output: "1" },
      { input: "5 3 6 2 4 null null 1\n3", output: "3" },
      { input: "2 1\n2", output: "2" },
    ],
  },
  {
    title: "Lowest Common Ancestor of a BST",
    difficulty: "Medium",
    topics: "Tree, DFS, BST",
    statement:
      "Find the lowest common ancestor node of two given values `p` and `q` in a BST — the deepest node having both as descendants (a node counts as its own descendant). Print its value.",
    input: "Line 1: level-order tokens with `null` markers; all values distinct; `p` and `q` are guaranteed present.\nLine 2: integers `p q`.",
    output: "Print the value of the LCA node.",
    constraints: ["2 <= number of nodes <= 10^5", "1 <= Node.val <= 10^7", "p != q"],
    hint: "Both targets split left/right around the LCA — the first node where p and q fall on opposite sides (or equals one of them) is the answer.",
    tests: [
      { input: "6 2 8 0 4 7 9 null null 3 5\n2 8", output: "6" },
      { input: "6 2 8 0 4 7 9 null null 3 5\n2 4", output: "2" },
      { input: "2 1\n2 1", output: "2" },
    ],
  },
  {
    title: "Binary Tree Right Side View",
    difficulty: "Medium",
    topics: "Tree, DFS, BFS",
    statement:
      "Standing to the right of the tree, you see the outermost node of every level. Report the visible values top to bottom.",
    input: "One line: level-order tokens with `null` markers.",
    output: "Print the right-side view values, space-separated on one line.",
    constraints: ["1 <= number of nodes <= 100", "-100 <= Node.val <= 100"],
    hint: "BFS keeps the last survivor of each level; DFS can too by visiting right before left and taking the first arrival per depth.",
    tests: [
      { input: "1 2 3 null 5 null 4", output: "1 3 4" },
      { input: "1 null 3", output: "1 3" },
      { input: "1 2 3 4", output: "1 3 4" },
    ],
  },
  {
    title: "Construct Binary Tree from Preorder and Inorder",
    difficulty: "Medium",
    topics: "Array, Tree, Divide and Conquer",
    statement:
      "Two traversals of a tree with **distinct** values are given: preorder and inorder. Rebuild the unique tree and print its postorder traversal.",
    input: "Line 1: preorder traversal, space-separated distinct integers.\nLine 2: inorder traversal of the same tree.",
    output: "Print the postorder traversal, space-separated on one line.",
    constraints: ["1 <= number of nodes <= 3000", "All values distinct", "preorder and inorder describe the same tree."],
    hint: "Preorder hands you the root first; its position splits inorder into the two subtrees — recurse with index maps, not array slices.",
    tests: [
      { input: "3 9 20 15 7\n9 3 15 20 7", output: "9 15 7 20 3" },
      { input: "1 2\n2 1", output: "2 1" },
      { input: "1 2 3\n1 2 3", output: "3 2 1" },
    ],
  },
  {
    title: "Sum Root to Leaf Numbers",
    difficulty: "Medium",
    topics: "Tree, DFS",
    statement:
      "Each root-to-leaf path spells out a number by concatenating node values (each 0–9). Return the total of all such numbers.",
    input: "One line: level-order tokens with `null` markers. Values are single digits 0–9.",
    output: "Print the sum of all root-to-leaf numbers.",
    constraints: ["1 <= number of nodes <= 1500", "Node.val is a single digit 0..9", "The answer fits in 32-bit."],
    hint: "Descend with accumulated value acc*10 + node.val; add to the total whenever you reach a leaf.",
    tests: [
      { input: "1 2 3", output: "25" },
      { input: "4 9 0 5 1", output: "1026" },
      { input: "1 0", output: "10" },
    ],
  },
  {
    title: "Count Good Nodes in Binary Tree",
    difficulty: "Medium",
    topics: "Tree, DFS, BFS",
    statement:
      "A node X in the tree is called good if, on the path from the root down to X, no node has a value greater than X (X counts). Count the good nodes.",
    input: "One line: level-order tokens with `null` markers.",
    output: "Print the number of good nodes.",
    constraints: ["1 <= number of nodes <= 2000", "-10^4 <= Node.val <= 10^4"],
    hint: "DFS carrying the running maximum: a node is good iff its value ≥ everything above it.",
    tests: [
      { input: "3 1 4 3 null 1 5", output: "4" },
      { input: "3 3 null 4 2", output: "3" },
      { input: "1", output: "1" },
    ],
  },

  // ---------- Heap / Priority Queue ----------
  {
    title: "Last Stone Weight",
    difficulty: "Easy",
    topics: "Array, Heap",
    statement:
      "Stones have weights. Each turn, take the two heaviest stones x ≤ y and smash them: if x == y both shatter, otherwise y−x remains. Repeat until at most one stone is left; print its weight, or `0` if none.",
    input: "Line 1: integer `n`.\nLine 2: `n` space-separated stone weights.",
    output: "Print the weight of the last stone, or `0`.",
    constraints: ["1 <= n <= 30", "1 <= stones[i] <= 1000"],
    hint: "A max-heap makes 'two heaviest' trivial; push the remainder back until fewer than two stones remain.",
    tests: [
      { input: "6\n2 7 4 1 8 1", output: "1" },
      { input: "1\n1", output: "1" },
      { input: "2\n2 2", output: "0" },
    ],
  },
  {
    title: "Kth Largest Element in an Array",
    difficulty: "Medium",
    topics: "Array, Heap, Quickselect",
    statement:
      "Return the k-th largest element in the array counting duplicates separately (the 2nd largest of [3,3] is 3). Solve without sorting fully — heapsort-style selection or quickselect.",
    input: "Line 1: integers `n k`.\nLine 2: `n` space-separated integers.",
    output: "Print the k-th largest element.",
    constraints: ["1 <= k <= n <= 10^5", "-10^4 <= nums[i] <= 10^4"],
    hint: "Keep a min-heap of size k; the heap's root ends up as the k-th largest.",
    tests: [
      { input: "6 2\n3 2 1 5 6 4", output: "5" },
      { input: "9 4\n3 2 3 1 2 4 5 5 6", output: "4" },
      { input: "1 1\n9", output: "9" },
    ],
  },
  {
    title: "K Closest Points to Origin",
    difficulty: "Medium",
    topics: "Array, Heap, Math, Sorting",
    statement:
      "Report the `k` points closest to the origin (0,0), where distance is Euclidean. Output them sorted by distance squared; break ties by x, then y (both ascending). Squared distances may be used throughout.",
    input: "Line 1: integers `n k`.\nNext `n` lines: two integers `x y` per point.",
    output: "Print `k` lines `x y` — the chosen points ordered by (distance², x, y) ascending.",
    constraints: ["1 <= k <= n <= 10^4", "-10^4 <= x, y <= 10^4", "Coordinates are integers."],
    hint: "Sort by the tuple (x²+y², x, y) and slice — or bound a max-heap at size k for better memory behaviour.",
    tests: [
      { input: "2 1\n1 3\n-2 2", output: "-2 2" },
      { input: "3 2\n3 3\n5 -1\n-2 4", output: "3 3\n-2 4" },
      { input: "2 2\n1 0\n-1 0", output: "-1 0\n1 0" },
    ],
  },
  {
    title: "Top K Frequent Elements",
    difficulty: "Medium",
    topics: "Array, Hash Table, Heap, Bucket Sort",
    statement:
      "Return the `k` most frequent elements. Order them by frequency descending; ties resolve toward the **smaller value** first. Guaranteed a unique valid answer exists under these rules.",
    input: "Line 1: integers `n k`.\nLine 2: `n` space-separated integers.",
    output: "Print the `k` chosen values, space-separated, in the defined order.",
    constraints: ["1 <= k <= number of distinct values <= n <= 10^5", "-10^4 <= nums[i] <= 10^4"],
    hint: "Frequency-count, then either a size-k heap or bucket-by-frequency array beats full sorting.",
    tests: [
      { input: "6 2\n1 1 1 2 2 3", output: "1 2" },
      { input: "1 1\n1", output: "1" },
      { input: "9 2\n4 4 4 6 6 7 7 7 7", output: "7 4" },
    ],
  },
  {
    title: "Find Median from Data Stream",
    difficulty: "Hard",
    topics: "Heap, Design, Sorting",
    statement:
      "Numbers stream in one at a time. After chosen points you must report the median of everything seen so far: the middle value (odd count) or the mean of the two middles (even count). Design a structure supporting both operations efficiently.",
    input: "Line 1: integer `q`.\nNext `q` lines: `add x` to insert, or `median` to query. `median` is never asked with zero numbers.",
    output: "For each `median`, print the median: an integer if the count is odd, otherwise a decimal with `.5` when needed (e.g. `1.5`) — plain integer if halves divide evenly.",
    constraints: ["1 <= q <= 5*10^4", "-10^5 <= x <= 10^5"],
    hint: "A max-heap below the median and a min-heap above it, kept within one size of each other, answers instantly.",
    tests: [
      { input: "5\nadd 1\nadd 2\nmedian\nadd 3\nmedian", output: "1.5\n2" },
      { input: "4\nadd 5\nmedian\nadd 3\nmedian", output: "5\n4" },
    ],
  },
];
