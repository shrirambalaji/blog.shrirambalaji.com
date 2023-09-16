---
title: "Mutability in Rust"
description: "Let's learn how Rust distinguishes between shared and exclusive references, and how interior mutability unlocks controlled mutability while maintaining safety."
publishDate: "Oct 5 2020"
tags: ["rust", "mutability"]
---

## Shared and Exclusive References

When learning Rust's ownership and borrowing system, we come across the terms - mutable and immutable references, wherein `&T` is said to be an **immutable reference** and `&mut T` is called a **mutable reference**.
This works out to be a great starting point, to initially understand how references work in Rust but sometimes falls apart when diving slightly into intermediate territory, say for eg. while building a lib.

Essentially, `&T` is not an "immutable reference" to data of type T — it is a "shared reference". And `&mut T` is not a "mutable reference" — it is an "exclusive reference".

It is necessary to understand this to further make sense of Interior mutability in Rust.

## Exclusive Reference

**An exclusive reference means that there can be not more than one reference to a specified value at a given time** ie. if you have an exclusive reference to a value, it is safe to assume that there can be no other reference at the same time. The Rust borrow checker guarantees that an exclusive reference remains exclusive and doesn't allow the code to be compiled, otherwise.

So why is a mutable reference called exclusive?

When you take a `&mut T` reference to type T, you have exclusive access to it. When you are done making mutations to your exclusive reference however you'd have to return it back to the actual owner. Only you'd have the ability to make modifications to the value you borrowed, and Rust guarantees that you're the only one with an exclusive access to `T`.

## Shared Reference

**A shared reference means that more than one reference to the same value can exist at a given time.** Multiple shared references to the same value can exist across threads or even exist in memory (stack frame) in the current thread of execution.

Why is an immutable reference called as a shared reference?

An immutable reference `&T` denotes that you have access to `T` at the same time as everyone else ie. `T` can be read multiple times, by say different threads even but none of them can actually write (or) modify `T` in anyway. So essentially, `&T` is _shared_ across consumers of `T` but cannot be changed.

## Interior Mutability in Rust

We now know about shared and exclusive references, but from what we have learnt up until now a "shared and mutable reference", should not be possible at all - right?

Rust has some interesting ways of making that happen using what's called Interior Mutability.

Coming back to our original description of a shared reference, the main reasoning behind not allowing mutation of the shared value is because we could not guarantee that not more than one borrower is modifying the value at a given time. This kind of modification leads a data race, and as you might already know - safe Rust doesn't allow data races to happen.

However, what if there were some way of protecting against this, and still allowing mutability. Interior Mutability offers that inner protection mechanism and ensures that a value is not modified by more than one borrower at a given time. Interior Mutability means that when you look from the outside it seems to be immutable, but it has methods to mutate the value in a controlled fashion. The Rust book refers to using interior mutability as a "last resort", but more often that not - new Rustaceans come across them.

Some of the Rust APIs that allow mutating a shared reference are:

- Cell
- RefCell
- Mutex

We'll look at `Cell` and how you can use a `Cell` in this article. Each of these APIs have differing levels of restrictions on what values they can hold, and how the values can be accessed / modified.

## [Cell](https://doc.rust-lang.org/std/cell/)

A `Cell` is a shared-mutable container and is part of the `std:cell` module in Rust.

Important things to know about Cell:

- There's no way to get a pointer to the contents of a Cell. Cell has methods to copy, replace or get the value, but not point to the value inside the Cell itself.

> Take a moment to think of why this is important for allowing Interior Mutability.
> If you cannot get a pointer to a Cell's value - then you are safe make changes to the contents ie. its always safe to mutate a value inside a Cell, because nothing else holds a reference (or) pointer to the value in a Cell.

- A reference to a Cell cannot be passed onto more than one Thread ie. `Cell<T>` is not thread safe. This is because if there are two references to the same `Cell` in two different threads, they could both try to change the value at the same time. `Cell` does this by implementing the [`!Sync trait`](https://doc.rust-lang.org/std/marker/trait.Sync.html#impl-Sync-31) disallowing access to multiple threads at once.

- The value wrapped in a `Cell` needs to implement the `Copy` trait ie. you can freely copy values into and out of the `Cell`. However this means you _cannot_ store a `String` or a `Vec` inside a `Cell` as they don't implement `Copy`. This is one of the reasons why `Cell` is fast, as it allows only simple (or) uncomplicated types to be stored inside it.

- When you call `Cell<T>.get()` a copy of the actual content is returned and it will never return a reference to the content. This is absolutely necessary to ensure that `Cell<T>.set(value)` is always safe to use.

Because of these restrictions we are able to have shareable-mutable containers like Cell.

A Simple (yet contrived) Counter Example using `Cell`:

```rust
use std::cell::Cell;

fn main() {
    struct Counter {
        value: Cell<u8>,
    }

    let counter = Counter {
        value: Cell::new(0),
    };

    for _ in 0..10 {
        // Cell<T>.get() returns a `Copy` of the contained value
        let current = counter.value.get();
        // Cell<T>.set() sets the contained value
        counter.value.set(current + 1);
    }

    assert_eq!(counter.value.get(), 10);
}
```

`Cell` is commonly used when you want to mutate a value safely from different places. Typically the value you are mutating is also lightweight like a number (or) a boolean value and allows mutating these values when wrapped inside a Cell.

When digging into the `Cell` API, you might come across what's called an [UnsafeCell](https://doc.rust-lang.org/std/cell/struct.UnsafeCell.html). **An UnsafeCell holds some type, and allows you to get a raw (and exclusive) pointer to it.** It is upto whoever's implementing UnsafeCell to explicitly cast that into an _exclusive reference_ when you are sure that it is safe to do so. UnsafeCell is the core primitive behind all the above mentioned APIs for Interior Mutability in Rust.

An UnsafeCell is a special type and is the _only_ way in Rust to cast a shared reference to an exclusive reference.

We'll discuss more on the other types of Interior Mutability in an upcoming blog.

Until then, Happy Rusting! 🦀

> This article discusses mutability with respect to writing safe Rust. All guarantees on mutability that Rust Compiler provides no longer uphold when jumping into [unsafe land](https://doc.rust-lang.org/book/ch19-01-unsafe-rust.html)

## References

- [Jon Gjengset's Video on Interior Mutability](https://youtu.be/8O0Nt9qY_vo)
- https://docs.rs/dtolnay/0.0.9/dtolnay/macro._02__reference_types.html
