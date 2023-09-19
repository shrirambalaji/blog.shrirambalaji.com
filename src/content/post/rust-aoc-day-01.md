---
title: "Advent of Code 2020 - Day 01"
description: "Solving Day 01 / Advent of Code 2020 in Rust"
publishDate: "Dec 1 2020"
tags: ["rust", "adventofcode"]
slug: rust-advent-of-code-2020-day-01
---

Hello there!

Spoilers ahead for the solutions of Advent of Code 2020 - Day 01 in Rust. The full solution is available [here](https://github.com/Shriram-Balaji/rust-advent-of-code-2020/tree/main/day-one).

> If you are unfamiliar, Advent of Code is an Advent calendar of small programming puzzles for a variety of skill sets and skill levels that can be solved in any programming language you like. People use them as a speed contest, interview prep, company training, university coursework, practice problems, or to challenge each other.

The puzzle usually has a story, but we'd be looking at the actual problem we need to solve.

**Part 1**: Given an array of numbers, find two values that sum to 2020. Once you find the two values, multiply them. This might sound familiar to many, and if it does - yes, its the popular Two Sum problem for folks used to leetcode-ing.

The solution looks something like this:

```rust

   /**
   The algorithm:
   * initialize a map
   * go through the array of the elements ie. entries, and calculate its complement.
   * insert (complement, index) into the map if it doesnt exist.
   * if it doest exist, yay! we've found the indices that sum to 2020. Get the values from entries at those indices and return.
   **/


    let mut map: HashMap<i32, usize> = HashMap::new();
   // `.iter()` returns an iterator, and `.enumerate` returns a tuple of (index, value) of every entry.
    for (index, entry) in entries.iter().enumerate() {
        let complement = TARGET_SUM - entry;
        // NOTE: `HashMap.contains_key` and `HashMap.get` take a reference and return a reference.
        if map.contains_key(&complement) {
            let chosen_one_index = map.get(&complement).unwrap();
            let chosen_two_index = &index;

            // we need to a deref here as `chosen_one_index` returns a pointer to a pointer.
            let chosen_one = entries.get(*chosen_one_index as usize).unwrap();
            let chosen_two = entries.get(*chosen_two_index as usize).unwrap();

            println!("2 entries that sum to 2020: {}, {}", chosen_one, chosen_two);
            println!("Product Of two entries: {}", chosen_one * chosen_two);
        } else {
            map.insert(*entry, index);
        }
    }

```

**Part 1: Extended**

Given an array of numbers, find three values that sum to 2020, and multiply them. The naive solution for this using a nested loop and then trying to find all possible triplets that sum to 2020. However, the complexity for something like that would be `O(n^3)` and we probably don't want that.

A better solution could be to sort the array, and then use a **Two pointer approach** with a sliding window approach. The complexity for this solution would be `O(n log(n))` worst case, due to the sort.

```rust

    entries.sort();

    for (i, entry) in entries.iter().enumerate() {
        // initialize the `low` pointer to the start, `high` to the end of the array.
        // the window in the beginning, is the entire array
        let mut low = i + 1;
        let mut high = entries.len() - 1;

        // bounds check
        while low < high {
            // calculate sum at the current index
            let current_sum = &entries[low] + &entries[high] + entry;
            // since there's only one such entry based on the question, we can break here.
            // otherwise we'd typically push these into a Vec<u8> | HashSet<u8> to deal with duplicates.
            if current_sum == TARGET_SUM {
                println!(
                    "3 Entries that sum to 2020: {}, {}, {}",
                    &entries[low], &entries[high], entry
                );

                println!(
                    "Product of 3 Entries: {}",
                    &entries[low] * &entries[high] * entry
                );

                break;

            } else if current_sum < TARGET_SUM {
                // since the array is sorted, if the current sum is lesser we need to minimize / slide the window from the left.
               // so we increment the lower bound.
                low += 1;
            } else {
                // the current sum is greater, lets reduce the upper bound instead.
                high -= 1;
            }
        }
    }


```
