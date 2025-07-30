---
title: "Advent of Code 2020 - Day 09"
description: "Solving Day 09 / Advent of Code 2020 in Rust"
publishDate: "Dec 9 2020"
tags: ["rust", "adventofcode"]
slug: rust-aoc/2020/day-09
series: "Advent of Code 2020"
---

Hello! We are on [Day 09](https://adventofcode.com/2020/day/9) of Advent of Code 2020.

Spoilers Ahead! The full solution to the problem is available [here](https://github.com/Shriram-Balaji/rust-advent-of-code-2020/blob/main/day-09/src/main.rs).

**Problem - Part 01**

Given a list of numbers, wherein the first `n` numbers is called a **preamble**, and the numbers after the preamble have to be a sum of any of the numbers within the preamble. Find the first number (called invalid number) in the list of numbers that defies this rule.

To solve this we would have to do the following:

- Get all the numbers after the preamble.
- Initialize a `start` -> 0 and `end` -> `n` (or) preamble length to keep track of the elements in the preamble.
- Loop through all the numbers after the preamble, and check if the current number is possibly a sum of any two elements in the preamble from start -> end, if not return false using a function `has_sum(num, preamble`
- The first number after the preamble that returns false for `has_sum` is our invalid number.

```rust
/// a number that disobeys the preamble, is a number who's value doesnt equal to any of the
/// the preamble is an array of numbers from 0..=preamble_len
fn find_number_that_disobeys_preamble(numbers: &Vec<u64>, preamble_len: usize) -> u64 {
    // rest of all the numbers that follow the preamble.
    let numbers_after_preamble = &numbers[preamble_len..];
    for (index, num) in numbers_after_preamble.iter().enumerate() {
        let start = 0 + index;
        let end = index + preamble_len;

        let preamble = &numbers[start..end];
        if has_target_sum(*num as u64, preamble) {
            continue;
        } else {
            return *num;
        }
    }

    return 0;
}


```

The `has_sum` function that checks if a target sum is present when adding any of the two numbers in a given list, would look like:

```rust
fn has_target_sum(target: u64, numbers: &[u64]) -> bool {
    for num in numbers {
        let complement = (target as i64 - *num as i64) as u64;
        if numbers.contains(&complement) && &complement != num {
            return true;
        } else {
            continue;
        }
    }
    false
}

```

The result of the `find_number_that_disobeys_preamble` function is the invalid number ie. the answer to Part 01.

**Problem - Part 02**

For Part 02, we use the invalid number from Part 01, and we need to find if a contiguous sequence of numbers in the given number list, equal to the invalid number. Let's call this contiguos sequence of numbers `[a..b..]`. The sum of smallest of `[a..b..`] and the largest of `[a..b..]` is the answer to the Part 02 of this puzzle.

- To find the contiguous sum, we use a similar two pointer approach, `start` and `end`, initialized to 0 and 1 referring to the zeroth and the first element in the `numbers` array.
- We loop through and get the sum of all values in the numbers array between the indices `start` -> `end`.
- If the sum equals our target sum ie. our invalid number, we break from the loop and returning a slice of the array of numbers from start to end in the numbers list.
- If the current sum is lesser our target, that means we need to expand the window ie. add more numbers so we increment the `end` pointer.
- If the current sum is greater than our target, that means we need to shrink the window from the left.

```rust
fn find_contiguos_sum(target: u64, numbers: &Vec<u64>) -> Vec<u64> {
    let mut start = 0;
    let mut end = 1;
    loop {
        let sum: u64 = numbers[start..=end].iter().sum();
        if sum == target {
            // TODO: can we return a slice instead of a .to_vec?
            break numbers[start..=end].to_vec();
        } else if sum < target {
            end += 1;
        } else {
            start += 1;
        }

        continue;
    }
}


```

Now, all that's left to do is find the smallest and largest values in this contiguous subsequence, and add them.

```rust
/// if n = contiguous numbers that add-up to invalid_number, weakness score -> smallest(n) + largest(n)
fn get_encryption_weakness_score(invalid_number: u64, numbers: &Vec<u64>) -> u64 {
    let mut numbers_with_contiguous_sum = find_contiguous_sum(invalid_number, numbers);
    numbers_with_contiguous_sum.sort();

    let len = numbers_with_contiguous_sum.len();
    let smallest = numbers_with_contiguous_sum[0];
    let largest = numbers_with_contiguous_sum[len - 1];

    return smallest + largest;
}

```

That's all for Day 09. Thanking you for taking time to read this blogpost, and see you tomorrow!
