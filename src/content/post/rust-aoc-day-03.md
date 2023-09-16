---
title: "Advent of Code 2020 - Day 03"
description: "Solving Day 03 / Advent of Code 2020 in Rust"
publishDate: "Dec 3 2020"
tags: ["rust", "adventofcode"]
slug: rust-advent-of-code-2020-day-03
---

Hello! Continuing our advent of code journey for 2020, we are at [day 03](https://adventofcode.com/2020/day/3).

Spoilers Ahead! The full solution to the problem is available [here](https://github.com/Shriram-Balaji/rust-advent-of-code-2020/tree/main/day-03/src/main.rs).

**Problem**: Given a grid of #'s and .'s - find the number of #'s while traversing through the grid across a slope.
The `#` are referred to as trees, and `.` are referred to as squares.

The problem has an additional scenario wherein the columns in the grid can extend multiple times, as much as necessary. So essentially we have an **M X N** Grid, where N -> Infinity.

Let's look at a sample input:

```rust
 INPUT:

 ..##.......
 #...#...#..
 .#....#..#.
 ..#.#...#.#
 .#...##..#.
 ..#.##.....
 .#.#.#....#
 .#........#
 #.##...#...
 #...##....#
 .#..#...#.#

 SLOPE: right 3, down 1

```

For the above input, while counting from **(0,0)** through every slope moving 3 columns to the right and 1 row downwards on every step, we can see that the number of #'s (trees) across the slope is 7.

Let's look at how we can solve this problem. The algorithm would look something like:

- Parse the input and convert it into a `Vec<Vec<char>>` ie. a Grid
- Traverse from start of the Grid along the specified slope, by moving across rows and columns
- After reaching the element at the end of a given slope, if the element is a `#`, increment counter.
- Continue moving along till you reach the last row in the Grid.
- While traversing the Grid, if you reach the end of the last column wrap around to the first column using `col[index % col.len()]`.
- This is necessary as the problem mentions that the Grid is not fixed on the right, and can extend as much as necessary.

The grid of characters can be built from the given input:

```rust
fn create_grid<'a>(input: &str) -> Vec<Vec<char>> {
    let mut grid = Vec::new();
    for line in input.lines() {
        let elements_in_row: Vec<char> = line.chars().collect();
        grid.push(elements_in_row);
    }

    grid
}
```

The other input we need to process is the slope, which is of the format `direction steps, direction steps . . .` where each instruction to traverse across the slope is separated by a comma.

Let's parse this, and return the number of rows and columns we need to jump. We'll define a struct `Jump` that will hold these values.

```rust
#[derive(Debug, PartialEq)]
struct Jump {
    column: i32,
    row: i32,
}
```

The logic to parse the slope, would be as follows:

```rust
/// Returns the number of columns and rows to Jump while moving along a Slope
// slope -> right 3, down 1
fn parse_slope(slope: &str) -> Jump {
    let mut jump = Jump { column: 0, row: 0 };
    let navigation_instructions: Vec<&str> = slope.split(",").collect();

    for instruction in navigation_instructions.iter() {
        let slope_vec: Vec<&str> = instruction.split_whitespace().collect();
        let direction = slope_vec.get(0).expect(&format!("Invalid slope direction in {}", slope));
        let step = slope_vec.get(1).expect(&format!("Invalid slope step in {}", slope));
        let step = step.parse::<i32>().unwrap();

        // although the problem deals only with `right / down` directions, supporting all directions allows the problem to be more extensible.
        match *direction {
            "up" => jump.row = -step,
            "right" => jump.column = step,
            "down" => jump.row = step,
            "left" => jump.column = -step,
            _ => {}
        }
    }

    jump
}

```

For the slope `right 3, down 1` the `parse_slope` function returns `Jump { column: 3, row: 1}`.

All that's left to do is implement the core logic to traverse the grid, and find the number of `#`s. We can write the function so that it can also find the count of any character in a grid, across the slope.

```rust
/// Returns the number of characters found while traversing along a given slope.
fn get_character_count_along_slope(grid: &mut Vec<Vec<char>>, slope: &str, character_to_count: char) -> i32 {
    let mut count = 0;
    let jump = parse_slope(slope);
    let col_len = grid[0].len();

    // initialize indices to (0, 0)
    let mut col_index = 0;
    let mut row_index = 0;

    for row in grid.iter() {
        col_index = col_index + jump.column as usize;
        // we should make sure that the row_index stays in bounds
        if row_index >= row.len() {
            row_index = row_index + jump.row as usize % row.len();
        } else {
            row_index = row_index + jump.row as usize;
        }

        if let Some(new_row) = grid.get(row_index) {
		    // make sure that the column wraps around
			// as the problem mentions that the number of columns is not deterministic, and can extend as much as necessary.
            // to avoid actually creating new columns / extending the grid we instead wrap around.
            if let Some(value) = new_row.get(col_index % col_len) {
                if *value == character_to_count {
                    count += 1
                }
            }
        }
    }

    count
}

```

The `process` function is essentially a Driver function, that gets the count for the given `input` string of `#` a `.` along a given slope direction.

```rust
fn process(input: &str, direction: &str) -> i32 {
    let mut grid = create_grid(&input);
    let count = get_character_count_along_slope(&mut grid, direction, TREE);
    count
}

```

For Part 2, the same code essentially can be reused but we just need to find the product of all the number of trees across different slope directions.

```rust
    // -- Part Two --
    let slopes = vec![
        "right 1, down 1",
        "right 3, down 1",
        "right 5, down 1",
        "right 7, down 1",
        "right 1, down 2",
    ];


        // Product of number of trees across slopes
	// `.fold` takes in an initial value (1), and a closure with the accumulator and the current value (direction).
	// `.fold` could be thought to be similar to the `.reduce` function in JavaScript.
    let product: i64 = slopes.iter().fold(1, |acc: i64, direction| {
        let count = process(&input, direction);
        println!("{}: {}", direction, count);
        acc * count as i64
    });

    println!("Product of all slopes: {:?}", product);

```

That's all for Day 03. See you all tomorrow!
