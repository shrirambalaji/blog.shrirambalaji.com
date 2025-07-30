---
title: "Advent of Code 2020 - Day 08"
description: "Solving Day 08 / Advent of Code 2020 in Rust"
publishDate: "Dec 8 2020"
tags: ["rust", "adventofcode"]
slug: rust-aoc/2020/day-08
series: "Advent of Code 2020"
---

Hello! We are on [Day 08](https://adventofcode.com/2020/day/8) of our Advent of Code journey. Today's puzzle involves a lot of jumping, let's see if we can hop around and solve it 😀.

Spoilers Ahead! The full solution to the problem below is available [here](https://www.github.com/Shriram-Balaji/rust-advent-of-code-2020/tree/main/day-08%2Fsrc%2Fmain.rs).

**Problem - Part 01**

The input is a sequence of bootcode instructions, wherein each instruction consists of an operation (acc, jmp, or nop) and an argument (a signed number like +4 or -20).

- `acc` increases or decreases a single global value called the accumulator by the value given in the argument. For example, acc +7 would increase the accumulator by 7. The accumulator starts at 0. After an acc instruction, the instruction immediately below it is executed next.
- `jmp` jumps to a new instruction relative to itself. The next instruction to execute is found using the argument as an offset from the jmp instruction; for example, jmp +2 would skip the next instruction and jmp -20 would cause the instruction 20 lines above to be executed next.
- `nop` stands for No Operation - it does nothing. The instruction immediately below it is executed next.

Given the above input, for Part 01 we have an instruction that causes an infinite loop, and doesn't allow the program to terminate. The solution for Part 01, is to return the value of the global `accumulator` right before going into an infinite loop.

Let's see how we can solve this. The algorithm would look something like:

- Parse the input text file into a sequence of instructions ie an array / vector of (operation, argument).

- Then we can write a function that processes these instructions. Initialize an accumulator varible to 0. Initialize a `curr` index, and use that inside a loop to iterate through every (operation, argument) pair in instructions.

- In order to keep track of instructions that we have been already processed, we have a HashSet that stores the index.

- If the operation is `acc`we add the argument to it, and also increment the current index.

- If the operation is `jmp` we move curr index to curr_index + argument. This moves the current instruction to execute above or below the current line of execution.

- If the operation is `nop` we don't do anything. We have to increment the current index however, as this is a valid instruction.

- While iterating through all the instructions, and performing the operations mentioned above, we also check if the HashSet has the current index. If so, that means we are going to go into an infinite loop, as we are starting to process an instruction that's already been processed. So we break and return the global `accumulator` value.

The following snippet shows how we can parse the input into an array of instructions.

```rust

fn parse_instruction(line: &str) -> (&str, i32) {
    let instruction = line.split_whitespace().collect::<Vec<&str>>();
    let operation = match instruction.get(0) {
        Some(operation) => operation,
        None => {
            panic!("Invalid operation")
        }
    };

    let argument = match instruction.get(1) {
        Some(argument) => argument.parse::<i32>().unwrap(),
        None => {
            panic!("Invalid argument");
        }
    };

    (operation, argument)
}

fn parse(input: &str) -> Vec<(&str, i32)> {
    let lines = input
        .lines()
        .map(|l| l.trim())
        .filter(|l| !l.is_empty())
        .map(parse_instruction)
        .collect::<Vec<(&str, i32)>>();

    lines
}

```

The `parse` function trims the input lines, and then calls the `parse_instruction` function which returns a tuple of (operation, argument). For example this would look like `("acc", 9)`.

Let's write function that actually processes these instructions.

```rust
fn process_instructions(instructions: &Vec<(&str, i32)>) -> Result<i32, i32> {
    let mut processed: HashSet<isize> = HashSet::new();
    let mut accumulator = 0;
    let mut curr: isize = 0;

    loop {
        // bounds check
        if curr > instructions.len() as isize || curr < 0 {
            panic!("Invalid index. Out of bounds of Instruction Set");
        }

        // if the instruction has already been processed, then its an infinite loop. So break with an error, with the acc's value
        if processed.contains(&curr) {
            break Err(accumulator);
        }

        // we have reached the end of the bootcode. so the program can terminate.
        if curr == instructions.len() as isize {
            break Ok(accumulator);
        }

        processed.insert(curr);
        match instructions[curr as usize] {
            ("acc", argument) => {
                curr = curr + 1;
                accumulator = accumulator + argument;
            }
            ("jmp", argument) => {
                // we shouldn't increment the current index during a jump, so we decrement it by 1, before adding the argument.
                curr = curr + argument as isize;
            }
            ("nop", _) => {
                curr = curr + 1;
            }

            _ => {}
        }
    }
}

```

Alright! Once we call this function with the instructions, we would break right before the infinite loop, and return the acc value.

The line `if curr == instructions.len() as isize {
            break Ok(accumulator);
        }
` is not useful for Part 01, but will be for Part 02.

**Problem - Part 02**

Part 02 is an extension to Part 01, wherein we need to check if we can avoid the infinite loop, by changing either a nop instruction -> jmp or vice versa and are able to get the program to terminate.

We write a function that fixes the bootcode by iterating through our instructions and swapping jmp and nop with each other in a new copy of our instruction set, processing these new instructions again and checking if that swap resulted in a successful program termination.

```rust

fn fix_bootcode_by_swap(instructions: &Vec<(&str, i32)>) -> i32 {
    // iterate through all instructions
    // swap out a single nop -> jmp, and a jmp -> nop
    // if the program is able to terminate sucssefully, we get an Ok(acc) with the accumulator value.
    for (index, &instruction) in instructions.iter().enumerate() {
        match instruction {
            ("acc", _) => continue,
            ("nop", val) => {
                let mut instructions = instructions.clone();
                instructions[index] = ("jmp", val);
                if let Ok(accumulator) = process_instructions(&instructions) {
                    return accumulator;
                }
            }
            ("jmp", val) => {
                let mut instructions = instructions.clone();
                instructions[index] = ("nop", val);
                if let Ok(accumulator) = process_instructions(&instructions) {
                    return accumulator;
                }
            }
            _ => continue,
        }
    }
    return 0;
}

```

The result of this function returns the answer to Part 02. That's all for today. Ciao 👋
