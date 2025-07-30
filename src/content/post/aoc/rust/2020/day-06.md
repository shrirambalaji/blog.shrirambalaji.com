---
title: "Advent of Code 2020 - Day 06"
description: "Solving Day 06 / Advent of Code 2020 in Rust"
publishDate: "Dec 6 2020"
tags: ["rust", "adventofcode"]
slug: rust-aoc/2020/day-06
series: "Advent of Code 2020"
---

Hello! We are on [Day 06](https://adventofcode.com/2020/day/6) of Advent of Code. Let's explore how we can solve this puzzle.

Spoilers ahead! The full solution to the problem is available [here](https://github.com/Shriram-Balaji/rust-advent-of-code-2020/blob/main/day-06/src/main.rs).

**Problem - Part 01**:

Given a batch of inputs (groups) separated by an empty line, where every character in each line represents a question which is answered as "yes". We need find the sum of counts of the unique questions answered by anyone in the group.

Sample Input:

```rust
abc

a
b
c

ab
ac

a
a
a
a

b
```

This list represents answers from five groups:

    The first group contains one person who answered "yes" to 3 questions: a, b, and c.
    The second group contains three people; combined, they answered "yes" to 3 questions: a, b, and c.
    The third group contains two people; combined, they answered "yes" to 3 questions: a, b, and c.
    The fourth group contains four people; combined, they answered "yes" to only 1 question, a.
    The last group contains one person who answered "yes" to only 1 question, b.

In this example, the sum of these counts is 3 + 3 + 3 + 1 + 1 = 11.

Let's write the function that counts the answers by anyone. The algorithm for this function would be as follows:

- Iterate through every line in the input batch. Initialize an empty_index that keeps track of the last line index which is empty.
- If the current line is empty, we get all the lines before the current index, and then join them together into a String. The joined String will have duplicate characters which we need to ignore, so we need to deduplicate the String.
- The length of the deduped string is the count for the answer.
- Once we have the counts for all the answers, we can sum them all to get the `sum_of_counts`.

```rust

fn count_answers_by_anyone(input: &str) -> u32 {
    let mut answered: Vec<String> = Vec::new();

    // Empty index tracks the last index that is an empty line.
    let mut empty_index = 0;
    let lines = input.lines().collect::<Vec<&str>>();

    for (index, line) in lines.iter().enumerate() {
        if line.is_empty() {
            // lines from the previous empty_index till the current index
            let until = lines[empty_index..index].to_vec();
           // collect all the answers in the group into a String
           let answers_in_group = until.join("");
           // remove all duplicate answers from the group
s answer
            let deduped = dedup_chars(until.join(""));
            if !deduped.is_empty() {
                answered.push(deduped);
            }

            empty_index = index;
        }
    }

    let sum_of_counts: u32 = answered
        .iter()
        .fold(0, |acc, group| acc + group.len() as i32);

    sum_of_counts
}


```

In order to remove duplicate characters, we write a `dedup_chars` function that uses a [HashSet](https://doc.rust-lang.org/std/collections/struct.HashSet.html).

```rust

// remove duplicate characters from a String
fn dedup_chars(s: String) -> String {
    let mut set: HashSet<char> = HashSet::from(s.chars().collect());
    let deduped = set.drain().collect::<String>();
    return deduped;
}


```

That's all for Part 01. Let's move on to Part 02.

**Problem - Part 02 **

Given a batch of inputs (groups) separated by an empty line, where every character in each line represents a question which is answered as "yes". We need find the sum of counts of the **questions answered commonly** by everyone in the group.

Although the problem statement looks similar, the approach to solving this is slightly different.

Let's write the function that counts the answers by everon. The algorithm for this function would be as follows:

- Iterate through every line in the input batch. Initialize an empty_index that keeps track of the last line index which is empty.
- If the current line is empty, we get all the lines before the current index and collect them into a vector representing the group. If the group only has one person, the number of unique characters in the answers, represent its count.
- If the group has more than person, we need to find the answer common within the group. Since the group is represented as a vec, we can find the intersection of the values in the vec.
- Once we have the counts for all the answers, we can sum them all to get the `sum_of_counts`.

````rust

fn count_answers_by_everyone(input: &str) -> u32 {
    let mut sum: u32 = 0;
    let lines = input.lines().collect::<Vec<&str>>();

    // keeps track of the last empty line index
    let mut empty_index = 0;

    for (index, line) in lines.iter().enumerate() {
        if line.is_empty() {
            // lines from the previous empty_index till the current index
            let mut until = lines[empty_index..index].to_vec();

            // remove empty strings
            until.retain(|x| !x.is_empty());

           // when the group has only 1 person, we need to return the number of unique answers by 1 person as count.
            if until.len() == 1 {
                let deduped = dedup_chars(until.join(""));
                sum = sum + deduped.len() as u32;
            } else {
               // count common answers by intersection across the answers.
                let count = count_common_answers(until);
                sum = sum + count;
            }
            empty_index = index;
        }
    }

    return sum;
}

Let's write a function to find the answers common to a group.

```rust
fn count_common_answers(answers: Vec<&str>) -> u32 {
    if answers.is_empty() {
        return 0;
    }

    // initialize the answers to be the first value.
    let starting_answers: Vec<char> = answers[0].chars().collect();
    answers
        .iter()
        .fold(starting_answers, |common_answers, answer_by_person| {
            common_answers.intersect(answer_by_person.chars().collect())
        })
        .len() as u32
}

````

The sum returned by the `count_answers_by_everyone` is the answer for Part 02 of today's puzzle.

That's all for Day 06. See you tomorrow 👋
