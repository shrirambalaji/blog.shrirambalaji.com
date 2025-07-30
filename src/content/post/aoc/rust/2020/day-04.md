---
title: "Advent of Code 2020 - Day 04"
description: "Solving Day 04 / Advent of Code 2020 in Rust"
publishDate: "Dec 4 2020"
tags: ["rust", "adventofcode"]
slug: rust-aoc/2020/day-04
series: "Advent of Code 2020"
---

Hello! Let's take a look at solving the problem for [day 04](https://adventofcode.com/2020/day/4).

Spoilers Ahead! The full solution to the problem is available [here](https://github.com/Shriram-Balaji/rust-advent-of-code-2020/blob/main/day-04/src/main.rs).

**Problem**
Given a batch of inputs separated by empty lines, indicating passports with a predefined number of fields, validate the fields in the passport, and return the total number of such valid passports.

**Sample Input**:

```
ecl:gry pid:860033327 eyr:2020 hcl:#fffffd
byr:1937 iyr:2017 cid:147 hgt:183cm

iyr:2013 ecl:amb cid:350 eyr:2023 pid:028048884
hcl:#cfa07d byr:1929

hcl:#ae17e1 iyr:2013
eyr:2024
ecl:brn pid:760753108 byr:1931
hgt:179cm

hcl:#cfa07d eyr:2025 pid:166559648
iyr:2011 ecl:brn hgt:59in
```

wherein the fields are:

```
    byr (Birth Year)
    iyr (Issue Year)
    eyr (Expiration Year)
    hgt (Height)
    hcl (Hair Color)
    ecl (Eye Color)
    pid (Passport ID)
    cid (Country ID)

```

NOTE: Based on the problem, A **valid passport** has all fields mentioned above, and cid alone is optional.

Alright! The problem is pretty straightforward. We have to essentially just perform string parsing, identify if all the required fields are present in a password. An important step distinct to this problem is that each field in the passport input can extend to more than 1 line, and each batch is separated by an empty line.
Unlike previous problems, we need to do some additional things to get our input to validate.

Let's look at how we can process the input.

```rust
// input -> batch file / program input
fn process(input: &str) -> i32 {
   // initialize a passports array
    let mut passports: Vec<String> = Vec::new();
   // empty_index keeps track of the last empty line
    let mut empty_index = 0;
    let lines: Vec<&str> = input.lines().collect::<Vec<&str>>();

    for (index, line) in lines.iter().enumerate() {
        if line.is_empty() {
            // we join all the lines before the empty index and push to a new a string, by joining them using a " " as separator.
            let mut until = lines[empty_index..index].to_vec();
            until.retain(|x| !x.is_empty());
            passports.push(until.join(" "));
            empty_index = index;
        }
    }

    // remove any empty values from the vec
    passports.retain(|x| !x.is_empty());

    // get the count of the valid passports and return
    let count = passports
        .iter()
        .filter(|x| validate_passport(x)
        .count();

    count as i32
}
```

Nice! Now onto the actual validation step. The main algorithm for the validation would be :

- Split a given passport string by space and save as an array.
- Create a hashmap of the required fields. The hashmap would also need to track both the count and the value of the field for later use.
- Iterate through all the fields in the passport, and update the hashmap's count (increment by 1) and set the value. The hashmap has key as the field, and the value is a (count, field_value).
- Now make sure that all fields in the hashmap have a count > 0.

> NOTE: The `should_validate_fields` and the `validate_fields` function are not necessary for part 01 of the problem and will be useful only for part 02.

```rust

fn validate_passport(passport: &str, should_validate_fields: bool) -> bool {

    let passport_fields: Vec<&str> = passport.split_whitespace().collect();
    let mut required_field_map: HashMap<&str, (i32, &str)> = [
        ("byr", (0, "")),
        ("iyr", (0, "")),
        ("eyr", (0, "")),
        ("hgt", (0, "")),
        ("hcl", (0, "")),
        ("ecl", (0, "")),
        ("pid", (0, "")),
    ]
    .iter()
    .cloned()
    .collect();

    for passport_field in passport_fields.iter() {
        let passport_field_vec = passport_field.split(':').collect::<Vec<&str>>();
        let field_key = passport_field_vec.get(0).unwrap();
        let field_value = passport_field_vec.get(1).unwrap();

       // entry -> every hashmap entry
        required_field_map.entry(field).and_modify(|entry| {
            entry.0 = 1; // increment by 1
            entry.1 = field_value; // set the field's value
        });
    }

   // .all makes sure that all the iterations of an iterable return true.
    required_field_map.iter().all(|(field, (count, value))| {
        if !should_validate_fields {
            return count > &0;
        }

        return count > &0 && validate_field(field, value);
    })

```

**Part 02**

The only additional constraint for Part 02 is that every field has some rules that it needs to follow in order for the passport to be marked as valid. So Part 02 is just more validation on top of Part 01. Let's code that up!

```rust

fn validate_field(field: &str, value: &str) -> bool {
    // lazy_static! is an external crate with a macro used to avoid recreating a regex every time.

    lazy_static! {
        static ref HEIGHT_REGEX: Regex = Regex::new(r"(\d+)(\w+)").unwrap();
    }

    let eye_colors = vec!["amb", "blu", "brn", "gry", "grn", "hzl", "oth"];
    match field {
        "byr" => {
           // validate year length and bounds
            value.len() == 4 && {
                let year = value.parse::<i32>().unwrap();
                return year >= 1920 && year <= 2002;
            }
        }
        "iyr" => {
           // validate year length and bounds
            value.len() == 4 && {
                let year = value.parse::<i32>().unwrap();
                return year >= 2010 && year <= 2020;
            }
        }
        "eyr" => {
           // validate year length and bounds
            value.len() == 4 && {
                let year = value.parse::<i32>().unwrap();
                return year >= 2020 && year <= 2030;
            }
        }
        "hgt" => {
            // validate height has the right unit (in / cm) and is within bounds.
            let captures = HEIGHT_REGEX.captures(value).unwrap();
            let height: i32 = captures[1].parse::<i32>().unwrap();
            let unit: &str = &captures[2];

            match unit {
                "in" => height >= 59 && height <= 76,
                "cm" => height >= 150 && height <= 193,
                _ => false,
            }
        }
        "hcl" => {
           // validate if its a valid color
            if !value.starts_with("#") {
                return false;
            }

            // Remove # from start
            let value = crop_letters(value, 1);
            value.len() == 6
                && value.chars().all(|x| {
                    if x.is_alphabetic() {
                        return x <= 'f';
                    }
                    return x.is_digit(10);
                })
        }
        "ecl" => eye_colors.contains(&value.trim()),
        "pid" => value.len() == 9,
        _ => true,
    }
}


```

As we saw earlier our `validate_passport` function would remain the same, and the stricter validation is enforced by the `should_validate_fields` boolean passed as a parameter.

The `process` function would also need to pass in this value, so that would look something like:

```rust
fn process(input: &str, should_validate_fields: bool) -> i32 {

// . . . same as above

let count = passports
    .iter()
    .filter(|x| validate_passport(x, should_validate_fields))
    .count();

count as i32
}

```

That's all for Day 04. See you later 👋
