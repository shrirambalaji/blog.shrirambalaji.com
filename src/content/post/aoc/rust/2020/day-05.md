---
title: "Advent of Code 2020 - Day 05"
description: "Solving Day 05 / Advent of Code 2020 in Rust"
publishDate: "Dec 5 2020"
tags: ["rust", "adventofcode"]
slug: rust-aoc/2020/day-05
series: "Advent of Code 2020"
---

Hello! Let's continue with our advent of code 2020 streak. We're now at [Day 05](https://adventofcode.com/2020/day/5).

Spoilers Ahead! The full solution for the problem is available [here](https://github.com/Shriram-Balaji/rust-advent-of-code-2020/blob/main/day-05/src/main.rs).

Given a string input referring to a seat in an airline, where in each character is one of (F, B, L, R) a seat might be specified like "FBFBBFFRLR", where F means "front", B means "back", L means "left", and R means "right". Every character in the string, denotes a way of finding the right row and column in which your seat is present.

This involves binary partitioning -> which just means that given a range of numbers, partition that into two (0..middle, middle..end). Read through the examples in the problem statement linked above, to get a better idea and be back here for how we can solve this problem.

The core idea required to solve this problem is to parse the seat input, and return a row and a column. The algorithm for that would look like:

- Split the input into first 7 characters that represent the row, and the last 3 that represent the column (using a regex / the usual string indexing).

- Initialize a range, from 0 -> 128 for rows, and 0 -> 7 for the columns. Iterate through the characters in the string.

- If the current character is `B` or `R`, partition the range and use the upper partition. This is can be done by moving the range start to the middle of the partition: `range.start = range.start + (range.end - range.start) / 2`.

- Similarly if the current character is `F` or `L` partition the range, and use the lower partition. This can be done by reducing the range end towards the middle of: `range.end = (range.start + range.end) / 2;`

Alright! Now that we have the algorithm in place, let's define some structs to hold the Seat, Range.

```rust
#[derive(Debug)]
struct Seat {
    row: i32,
    column: i32,
}

// In our case the delimiter is a character that determines if the range should be partitioned, and whether to use the upper or the lower partition.

#[derive(Debug)]
struct RangeDelimiters {
    upper: char,
    lower: char,
}

// Seat Range is what hold's the range values during the partitioning process.
struct SeatRange {
    start: i32,
    end: i32,
}

```

Let's also define some constants denoting the total number of possible rows and columns in the airline.

```rust
const TOTAL_ROWS: i32 = 128;
const TOTAL_COLUMNS: i32 = 7;

```

Now let's create a function to parse the seat string, and return the row and column.

```rust
fn parse_seat(seat: &str) -> Result<Seat, String> {
    lazy_static! {
        // the regex parses the string, into a letters of length 7, 3
        static ref SEAT_REGEX: Regex = Regex::new(r"(\w{7})(\w{3})").unwrap();
    }

    if seat.len() < 10 {
        return Err("Invalid seat".to_owned());
    }

    let captures = SEAT_REGEX.captures(seat).unwrap();
    let rows: &str = &captures[1];
    let columns: &str = &captures[2];

    if rows.len() < 7 || columns.len() < 3 {
        return Err("Invalid seat".to_owned());
    }

    let row_range_delimiters = RangeDelimiters {
        upper: 'B',
        lower: 'F',
    };

    let column_range_delimiters = RangeDelimiters {
        upper: 'R',
        lower: 'L',
    };

    let SeatRange {
        start: seat_row, ..
    } = get_range_from_seat(rows, row_range_delimiters, TOTAL_ROWS);

    let SeatRange {
        end: seat_column, ..
    } = get_range_from_seat(columns, column_range_delimiters, TOTAL_COLUMNS);

    let seat = Seat {
        row: seat_row,
        column: seat_column,
   };

    Ok(seat)
}

```

Since we need to partition the range for both rows, and columns we have abstracted out that logic into a separate function `get_range_from_seat`, which looks like:

```rust
fn get_range_from_seat(seat: &str, delimeters: RangeDelimiters, max_count: i32) -> SeatRange {

   // initialize range from 0 to maximum value.
    let mut range = SeatRange {
        start: 0,
        end: max_count,
    };

    let RangeDelimiters { lower, upper } = delimeters;

    // perform the actual binary partitioning
    for char in seat.chars() {
        if char == lower {
            range.end = (range.start + range.end) / 2;
        } else if char == upper {
            range.start = range.start + (range.end - range.start) / 2;
        }
    }

    // return the range
    range
}

```

Now that we have a row, column pair the conversion to seatID is straightforward based on the problem statement:

```rust
fn get_seat_id(seat: Seat) -> i32 {
    seat.row * 8 + seat.column
}
```

For part 01 of the problem, the requirement is to find the highest possible seatId when given a batch on inputs where every line is a seat (string of FBLR characters).

Let's write the `process` function which would act as the driver, to parse the seat Input, retrieve seatIDs and then find the maximum value.

```rust
fn process(input: &str) -> (i32, i32) {
    let ids: Vec<i32> = input
        .lines()
        .map(|line| {
            let seat = match parse_seat(line) {
                Ok(seat) => seat,
                Err(e) => {
                    eprintln!("Error: {}", e);
                    process::exit(1);
                }
            };

            get_seat_id(seat)
        })
        .collect::<Vec<i32>>();

    let max = *ids.iter().max().unwrap();
    return max;
}
```

Cool! That's all for Part 01.

**Part 02**

Part 02 is an extension to part 1, where we also need to return a specific missing seatId that meets a specific condition -> the missing element has both it's +1 and -1 in our id list.

```rust
fn get_missing_id(mut ids: Vec<i32>) -> i32 {
    ids.sort();

    let mut prev = ids[0];
    let ids: Vec<i32> = ids[1..].to_vec();
    for curr in ids {
        if prev != curr - 1 {
            break;
        }
        prev += 1;
    }
    prev + 1
}
```

The `process` function would feed in the `ids` to get the missingId.

Awesome! That's all for Day 05. See ya 👋
