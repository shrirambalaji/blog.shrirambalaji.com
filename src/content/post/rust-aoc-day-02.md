---
title: "Advent of Code 2020 - Day 02"
description: "Solving Day 02 / Advent of Code 2020 in Rust"
publishDate: "Dec 2 2020"
tags: ["rust", "adventofcode"]
slug: rust-advent-of-code-2020-day-02
---

Hello Again! We'll be looking at the solution for [puzzles on Day-02](https://adventofcode.com/2020/day/2) of Advent of Code using rust.

Spoilers Ahead! The full solution available to this puzzle is available [here](https://github.com/Shriram-Balaji/rust-advent-of-code-2020/tree/main/day-02)

**Puzzle Part 01:**

Given a list of passwords find the number of passwords that match a password policy, wherein the input looks like:

```rust
1-3 a: abcde
1-3 b: cdefg
2-9 c: ccccccccc
....
```

On line 1: `1-3` represents the minimum(1)-maximum(3) number of occurences of the letter `a`. Similarly on line 3: `2-9` represents the minimum(2)-maximum(9) number of occurences of the character `c`. The is our password policy.

The problem is to evaluate if the password string on the right, (for eg. abcde on line1) is valid based on the policy provided on a given line and if so, how many such passwords we have in the input. (if this is slightly confusing, going through the problem statement in the link mentioned above, might help).

Now that we have the problem out of the way, let's break this down into how we could solve it.

The algorithm to solve the problem would look something like:

- Parse the input.txt file and convert that into an array of lines
- Each line represents a `policy : password` combination. So let's parse these values into variables. We denote this combination using the variable `policy_password` in the code snippets below.
- Find the frequency of all characters in the password. For our usecase we can use a `HashMap<char, i32>` in order to keep track of all the occurences of a specified character.
- Then we can lookup the hashmap for the letter mentioned in our policy, and if it meets our min-max bounds. If it meets these conditions, hurray! the password is valid, else it is not.
- Finally, return a `count` of all such valid passwords.

Now that we know how to go about the validation, let's write some basic logic to parse the values into variables, setup some structs and traits for better extensibility. If you think about it, a Password Policy is something that **could** change in the future. (you'll see in part 02, that it does change, in fact.)

```rust
struct PasswordPolicy {
    min: i32,
    max: i32,
    letter: char,
}

// a trait can be thought as an `interface` that are implemented for other structs.
pub trait ValidatePassword {
    fn validate(&self, password: &str) -> bool;
}

```

Let's write some logic to parse the input line. The logic uses basic string `.split` and indices to parse values, because the input is deterministic and all values are valid inputs (although, the error handling could be slightly bettter 😅)

```rust
    // policy_password -> 1-3 a: abcde
    let values: Vec<&str> = policy_password.split(" ").collect::<Vec<&str>>();
    // get the range as a vec: `[1, 3]`
    let allowed_password_range = values[0].split("-").collect::<Vec<&str>>();
    // get the letter in the policy -> `a`
    let letter = crop_letters_after(&values[1], 1);
    // if you are from JS Land, this might look weird - redeclaring `letter`
    // but this is valid rust syntax, and is called shadowing.
    // https://en.wikipedia.org/wiki/Variable_shadowing
    let letter = letter
        .parse::<char>()
        .expect("policy letter should be a char.");

    // get the actual password to validate the password against.
    let password = &values[2];
    let range_min = allowed_password_range[0]
                              .parse::<i32>()
                              .expect("invalid range min");

    let range_max = allowed_password_range[1]
                              .parse::<i32>()
                              .expect("invalid range max");

    let policy = PasswordPolicy {
                min: range_min,
                max: range_max,
                letter,
            };

```

The `crop_letters_after` function takes in a string slice and a position, and returns a cropped string with characters from `0 to position`:

```rust
fn crop_letters_after(s: &str, pos: usize) -> &str {
    match s.char_indices().nth(pos) {
        Some((pos, _)) => &s[..pos],
        None => "",
    }
}
```

> There are some other ways of parsing the input. For eg. we could also use [regex](https://docs.rs/regex/1.4.2/regex/) to parse the string, into named capture groups (or) if you want to go the extra mile use a custom parser combinator like [nom](https://github.com/Geal/nom).

Now let's implement the `ValidatePassword` trait for our PasswordPolicy. The `validate` function returns true / false depending on whether the given password, meets the criteria.

```rust

impl ValidatePassword for PasswordPolicy {
    // &self refers to policy that we have initialized.
    fn validate(&self, password: &str) -> bool {
        let mut occurences: HashMap<char, i32> = HashMap::new();


        for character in password.chars() {
            // increments entry by 1, if exists else inserts 1.
            occurences
                .entry(character)
                .and_modify(|e| *e += 1)
                .or_insert(1);
        }

        let has_letter = occurences.contains_key(&self.letter);

        if !has_letter {
            return false;
        } else {
            let count = occurences.get(&self.letter).unwrap();
            if count < &self.min {
                return false;
            }
            if count > &self.max {
                return false;
            }
        }
        true
    }
}

```

Finally, we have a simple counter that increments for every `.validate` that returns true. The value of the counter represents the number of valid passwords.

**Puzzle Part 02**

As I hinted upon earlier, the Part 02 the input passwords are still the same, but the policy is different. Let's look at the sample input again:

```rust
1-3 a: abcde
1-3 b: cdefg
2-9 c: ccccccccc
....
```

The main difference from Part 01, here is: **On line 1: `1-3` no longer represents the number of occurences of letter 'a', but rather represents the index at which the letter 'a' should be present in the given password string.** Note that the password is **NOT zero-indexed** but indexed from 1.

Let's rename our `PasswordPolicy` struct to `OldPasswordPolicy` define a new struct called `NewPasswordPolicy`.

```rust

struct OldPasswordPolicy {
   min: i32,
   max: i32,
   letter: char,
}

struct NewPasswordPolicy {
  first_position: usize,
  last_position: usize,
  letter: char,
}

```

Alright! Now lets initial the new Password Policy. Since we have two `PolicyTypes` we can have an `enum` that can be later used to switch between implementations, as necessary.

```rust
#[derive(PartialEq)]
enum PolicyType {
    Old,
    New,
}
```

The `PartialEq` trait is derived here, so that we can match / equate enum values.

The logic we used to parse the input is still the same, as the input hasn't changed. However our `policy` should be an instance of `NewPasswordPolicy` and we wrap the logic inside a function `is_valid` which abstracts away the implementation details of the validation performed for a given PolicyType.

```rust
fn is_valid(policy_password: &str, policy_type: &PolicyType) -> bool {
    let values: Vec<&str> = policy_password.split(" ").collect::<Vec<&str>>();
    let allowed_password_range = values[0].split("-").collect::<Vec<&str>>();
    let letter = crop_letters_after(&values[1], 1);
    let letter = letter
        .parse::<char>()
        .expect("policy letter should be a char.");

    let password = &values[2];

    match *policy_type {
        PolicyType::Old => {
            // range_min, range_max, define OldPasswordPolicy from above
        }
        PolicyType::New => {
            let first_position = allowed_password_range[0]
                .parse::<usize>()
                .expect("invalid first position");

            let last_position = allowed_password_range[1]
                .parse::<usize>()
                .expect("invalid last position");

            let policy = NewPasswordPolicy {
                first_position: first_position - 1,
                last_position: last_position - 1,
                letter,
            };

            return policy.validate(password);
        }
    }
}

```

Now let's implement our `ValidatePassword` trait for the new policy.

```rust
impl ValidatePassword for NewPasswordPolicy {
    fn validate(&self, password: &str) -> bool {
        let mut has_char_at_first_position = false;
        let mut has_char_at_last_position = false;

       // checks if the character at the first position
        match password.chars().nth(self.first_position) {
            Some(char_at_first_position) => {
                has_char_at_first_position = char_at_first_position == self.letter;
            }
            None => {}
        }

       // checks if the character at the last position
        match password.chars().nth(self.last_position) {
            Some(char_at_last_position) => {
                has_char_at_last_position = char_at_last_position == self.letter;
            }
            None => {}
        }

        if has_char_at_first_position && has_char_at_last_position {
            return false;
        } else if has_char_at_first_position && !has_char_at_last_position {
            return true;
        } else if !has_char_at_first_position && has_char_at_last_position {
            return true;
        }

        false
    }
}
```

There's some glue code required to call these functions, and to parse the input file which can be found in the full solution linked above.

That's all for AOC Day 02. See you tomorrow!
