---
title: "Advent of Code 2020 - Day 07"
description: "Solving Day 07 / Advent of Code 2020 in Rust"
publishDate: "Dec 7 2020"
tags: ["rust", "adventofcode"]
slug: rust-aoc/2020/day-07
series: "Advent of Code 2020"
---

Hola! We're on [Day 07](https://adventofcode.com/2020/day/7) of our Advent of Code Journey 2020. With our trusty rust ferris by our side, we have been able to solve some puzzles in the past couple of days. Let's look at how we can get through today's puzzle.

Spoilers Ahead. The full solution the problem is available [here](https://github.com/Shriram-Balaji/rust-advent-of-code-2020/blob/main/day-07/src/main.rs).

** Problem - Part 01 **

Given a list of rules specifying the bags (color, count) a colored bag can contain inside it, find the number of bags that can hold a specified color ("shiny gold" in our case). Each bag inside a colored bag, can in-turn contain more bags, and the rules for all of it together forms our problem's input.

The input is an exhaustive set of rules, some of which look like:

```rust
light red bags contain 1 bright white bag, 2 muted yellow bags.
dark orange bags contain 3 bright white bags, 4 muted yellow bags.
bright white bags contain 1 shiny gold bag.
muted yellow bags contain 2 shiny gold bags, 9 faded blue bags.
shiny gold bags contain 1 dark olive bag, 2 vibrant plum bags.
dark olive bags contain 3 faded blue bags, 4 dotted black bags.
vibrant plum bags contain 5 faded blue bags, 6 dotted black bags.
faded blue bags contain no other bags.
dotted black bags contain no other bags.

```

In the above rules, the following options are available to hold a shiny gold bag:

```rust
 * A bright white bag, which can hold your shiny gold bag directly.
 * A muted yellow bag, which can hold your shiny gold bag directly, plus some other bags.
 * A dark orange bag, which can hold bright white and muted yellow bags, either of which could then hold your shiny gold bag.
 * A light red bag, which can hold bright white and muted yellow bags, either of which could then hold your shiny gold bag.
```

So, in this example, the number of bag colors that can eventually contain at least one shiny gold bag is 4. From the problem you might be able to make out a data-structure apt for storing this one-way relationship - Graphs. We can use a [directed acyclic graph](https://en.wikipedia.org/wiki/Directed_acyclic_graph) (DAG) to represent this data.

> If DAG sounds complicated, its nothing but a graph wherein there's a connection between a node A => B but NOT B => A, and there are no cycles.

In order to hold both the color and the count, let's define a struct Bag.

```rust
#[derive(Debug, Clone)]
struct Bag {
    color: String,
    count: u32,
}

```

#### Implementing a Graph

Now let's implement a Graph Datastructure. Since this is a graph of bag colors, we call it a BaggyColorGraph :). Let's discuss some key things about the graph we need to implement:

- Graphs typically use an adjacency matrix or an adjacency list to keep track of nodes / vertexes. We will build an adjacency list, which will be a
  `HashMap<String, Vec<Bag>>` wherein each value looks something like `BagColor => ["Color1", "Color2"]`.

- A vertex in our graph, represents a color Bag that may or may not have other bags inside it. An edge in our graph represents, a bag containing another bag of count (x).

- To identify if two vertexes have an edge, we use a Depth First Search Approach, where in we traverse all the vertices connected to a given vertex, and then its neighbors and then its neighbors, and backtrack after there are no neighbors left. The Graph implements a `dfs` method to perform the same.

Alright, let's see how this looks like in code:

```rust
#[derive(Debug)]
struct BaggyColorGraph {
    adjacency_list: HashMap<String, Vec<Bag>>,
}

impl BaggyColorGraph {
    fn new(adjacency_list: HashMap<String, Vec<Bag>>) -> BaggyColorGraph {
        BaggyColorGraph { adjacency_list }
    }

    #[allow(dead_code)]
    fn len(&self) -> usize {
        self.adjacency_list.len()
    }

   // add empty array when adding a new vertex
    fn add_vertex(&mut self, bag: &Bag) {
        let color = &bag.color;
        self.adjacency_list.insert(color.to_owned(), vec![]);
    }

    fn add_edge(&mut self, bag1: &Bag, bag2: &Bag) {
        let color = bag1.color.to_string();
        let bag2 = bag2.clone();

       // NO_COLOR => no colors inside
       // when the color is set NO_COLOR we know that the bag cannot contain any bags inside it. So we insert an empty vec instead.
        if bag2.color != NO_COLOR {
            self.adjacency_list
                .entry(color)
                .and_modify(|e| e.push(bag2))
                .or_insert(vec![]);
        } else {
            self.adjacency_list.entry(color).or_insert(vec![]);
        }
    }

    // iteratively run DFS from source
    fn dfs(&self, source: &str, visited: &mut HashMap<String, bool>) {
       // stack is used as a temporary structure to keep track of insertions
        let mut stack: Vec<&str> = Vec::new();
        stack.push(source);
       // we set visited[source] = true, in order to avoid revisiting the same vertex
        visited.insert(source.to_owned(), true);

        while !stack.is_empty() {
            let node = stack.pop().unwrap();
            if self.adjacency_list.contains_key(node) {
                // get all the neighbors to a given vertex / node
                let bags = self.adjacency_list.get(node).unwrap();
                // iterate through all the neighbors (bags) and get all their neighbors and push them onto the stack, and re-run the loop until stack is empty.
                for bag in bags {
                    if !(visited.contains_key(&bag.color)) {
                        stack.push(&bag.color);
                        let neighbor = bag.color.to_owned();
                        visited.insert(neighbor, true);
                    }
                }
            }
        }
    }

    fn has_edge(&self, source: &str, destination: &str) -> bool {
        let mut visited: HashMap<String, bool> = HashMap::new();
        self.dfs(source, &mut visited);
        visited.contains_key(destination) && visited.get(destination).unwrap() == &true
    }

    // count the number of edges from a vertex to another vertex.
   // we call the has_edge function, which runs an iterative DFS to return true / false
    fn count_edges_to(&mut self, color_to_find: &str) -> u32 {
        let count = self.adjacency_list.keys().fold(0, |acc, color| {
            if color != color_to_find {
                if self.has_edge(color, color_to_find) {
                    return acc + 1;
                }
            }
            acc
        });
        count
    }

}

```

Now that we have a Graph implementation in place, we need to create a graph from the given rules input. The algorithm to process the input and turn it into a graph would be as follows:

- Collect the input lines into a vector, and then iterate over every line. Since we know from the input that every rule is separated clearly by the words "bags contain", lets use that to split the rule into a color string, and a comma separated string specifying the count and color bags inside.

- We can trim additional spaces off from `color` and `count and colors inside` and then further split it by comma into a new vector `bags_inside`. `bags_inside` needs to be further parsed (using regex), into count and the bag color. We can initialize the Bag struct, to hold these values.

- Iterate through `bags_inside`, create a vertex in the graph, create the edges between color and every color bag inside it. Once we are done with all the iterations, our graph is built.

- For colors which have the value "no colors inside", we will add them as an empty value in the graph.

```rust

fn create_graph(input: &str) -> BaggyColorGraph {
    lazy_static! {
        static ref COLOR_BAG_REGEX: Regex = Regex::new(r"(\d+)\s+(\w.*)bag").unwrap();
    }

    let mut graph = BaggyColorGraph::new(HashMap::new());
    let lines: Vec<&str> = input
        .split("\n")
        .filter(|x| !x.is_empty())
        .map(|x| x.trim())
        .collect::<Vec<&str>>();

    lines.iter().for_each(|line| {
        let rules: Vec<&str> = line
            .split("bags contain")
            .filter(|x| !x.is_empty())
            .collect();

        if !rules.is_empty() {
            let color = rules[0].trim();
            let outer_bag = Bag {
                color: color.to_owned(),
                count: 1,
            };

            let bag_colors_inside: Vec<String> = rules[1]
                .split(",")
                .map(|r| r.replace(".", "").trim().to_string())
                .collect();

            if !bag_colors_inside.is_empty() {
                graph.add_vertex(&outer_bag);
                bag_colors_inside.iter().for_each(|count_and_color| {
                    if !count_and_color.contains(NO_COLOR) {
                        let captures = COLOR_BAG_REGEX.captures(count_and_color).unwrap();
                        let count: u32 = captures[1].parse::<u32>().unwrap();
                        let bag_color: &str = &captures[2].trim();
                        let bag = Bag {
                            count,
                            color: bag_color.to_owned(),
                        };
                        graph.add_edge(&outer_bag, &bag);
                    } else {
                        let bag = Bag {
                            count: 0,
                            color: NO_COLOR.to_string(),
                        };
                        graph.add_edge(&outer_bag, &bag);
                    }
                })
            }
        }
    });

    return graph;
}

```

In our main function we can call `create_graph` followed by the `count_edges_to` function to solve Part 01.

```rust
fn main() {
    let args: Vec<String> = env::args().collect::<Vec<String>>();
    let filepath = args.get(1).expect("Input filepath cannot be empty!");
    let input =
        fs::read_to_string(filepath).expect("Something went wrong while reading the input file");

    let mut graph = create_graph(&input);
    let bag_color = "shiny gold";
    let count = graph.count_edges_to(bag_color);
    if count > 0 {
        println!("Number of bags which can contain {}: {}", bag_color, count)
    } else {
        println!("No bags contain the {}", bag_color)
    }

```

**Problem - Part 02**

Since we have our graph built, part 02 would be pretty straightforward. Given a color, find the count of all the possible bags inside. This is essentially recursively going deep into a specified vertex, and counting the bags inside.

Let's add a method to `BaggyGraph` for that:

```rust

    fn count_bags_inside(&self, color: &str, mut count: u32) -> u32 {
        let curr = count;
        if let Some(bags) = self.adjacency_list.get(color) {
            for bag in bags.iter() {
                count += bag.count + (bag.count * self.count_bags_inside(&bag.color, curr));
            }
        }

        count
    }

```

As you can see the recursive function call returns the total possible bag counts inside a specified bag. Invoking this method from our `main` function will get the answer for Part 02.

```rust

fn main() {

// . . . same as above
    let bags_inside = graph.count_bags_inside("shiny gold", 0);
    println!("{} can contain {} other bags", bag_color, bags_inside);
}
```

Whew! Today was a looong one, but hopefully it was helpful to learn how to build a bare-bones DAG in Rust, and also solve Day 07. See you tomorrow!
