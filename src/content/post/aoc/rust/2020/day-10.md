---
title: "Advent of Code 2020 - Day 10"
description: "Solving Day 10 / Advent of Code 2020 in Rust"
publishDate: "Dec 10 2020"
tags: ["rust", "adventofcode"]
slug: rust-aoc/2020/day-10
---

Hello! We're on [Day 10](https://adventofcode.com/2020/day/10) of Advent of Code 2020.

Spoilers Ahead! The full solution to the problem is available [here](https://github.com/Shriram-Balaji/rust-advent-of-code-2020/blob/main/day-10/src/main.rs).

**Problem - Part 01**

Given a list of adapters marked with different joltages (akin to voltages in the real-world), find a chain of all of your adapters to connect them to your device which supports any adapter with a `range -3 <= joltage <= 3`, and connect the device with the adapter to a charger outlet (marked as 0J). Once you find the chain, count the number of joltages with 1 / 3 as difference

Although the problem sounds too wordy, the main idea behind it is to change uniquely identify a list of adapters, that have + or - 3 less than or greater than a specified target joltage. Once we have that we can calculate the adapters with the right difference in joltage.

Let's create a way to count and hold the joltage differences.

```rust
struct JoltageDifference {
    one: u64,
    two: u64,
    three: u64,
}
```

Alright, now that we have a way to store the differences let's write a function to get count of all the adapter differences from the target device joltage.

```rust
fn get_joltage_differences(device_joltage: u64, adapters: &Vec<u64>) -> JoltageDifference {
    let mut difference = JoltageDifference {
        one: 1,
        two: 1,
        three: 1,
    };

    // we use a hashset to keep track of unique joltages here
    let joltages: HashSet<u64> = HashSet::from_iter(adapters.clone());

    // we also need to keep track of whether an adapter was used before, to ensure that we don't reuse an adapter and form a chain of adapters.
    let mut used_adapters: HashSet<u64> = HashSet::new();


    let mut use_joltage_adapter = |joltage: u64, supported_difference: u64| {
        let target = &(joltage + supported_difference);
        // Check if the target joltage is part of the input, and if it has not already been used before, and if the it lies within the range of supported_difference from target joltage
        let is_compatible = joltages.contains(target)
            && !used_adapters.contains(&joltage)
            && *target <= device_joltage;
        if is_compatible {
            used_adapters.insert(joltage);
            match increment {
                1 => difference.one += 1,
                2 => difference.two += 1,
                3 => difference.three += 1,
                _ => {}
            }
        }
    };

    // count all adapters with 1, 2 and 3 difference from the current joltage
    for joltage in &joltages {
        use_joltage_adapter(*joltage, 1);
        use_joltage_adapter(*joltage, 2);
        use_joltage_adapter(*joltage, 3);
    }

    return difference;
}

```

From the problem it is also mentioned that the target device voltage is +3 of the max joltage adapter.

```rust
fn get_input_device_joltage(joltages: &Vec<u64>) -> u64 {
    let max_joltage = joltages.iter().max().unwrap();
    return max_joltage + 3;
}

```

To get the answer for Part 01 of our puzzle, we need to call these functions and find the count joltages with difference of 1 and 3 respectively.

```rust
    let device_joltage = get_input_device_joltage(&adapters);
    let differences = get_joltage_differences(device_joltage, &adapters);

    println!(
        "There are {} differences by 1 jolts and {} differences by 3 jolts",
        differences.one, differences.three
    );

```
