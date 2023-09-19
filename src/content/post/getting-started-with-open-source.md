---
title: "Getting started with Open Source"
description: "Learning about how to get started contributing to open source."
publishDate: "Jan 2 2021"
tags: ["open-source", "FOSS"]
---

![pexels-negative-space-97077.jpg](https://cdn.hashnode.com/res/hashnode/image/upload/v1609583881817/z9XjczAxu.jpeg)

Open Source software is a great way for a lot of people to come together and contribute to something that they feel is meaningful to them. It can also help growing developers to understand how software at scale is written, and how bigger projects tend to operate in general. It might also help to see clear patterns of doing things in a more idiomatic way, for programmers of all skill levels.

However contributing to open source is useful to both contributors and maintainers when done the right way. In my limited experience contributing to some projects and interacting with maintainers, there are some things that helped me not feel overwhelmed while getting started with contributions.

Once you have found a project that excites you to contribute, here are some things to keep in mind right before you start contributing:

## 1. Find the right issue to contribute

If you have found a "good first issue" or something tagged beginner friendly, great - that's our starting point. It's also a good practice to mention in the issue that you would like to try fixing it. This helps other contributors not work on the same issue, and avoids competing PRs.

![Find](https://media.giphy.com/media/3orieUe6ejxSFxYCXe/giphy.gif)

## 2. Squash some bugs to start off with

While approaching any new codebase I try to start off by squashing some bugs. Why? Well that's what gives you a chance to get some basic understanding of a very specific workflow wherein the issue exists. Once you make some bugfixes, you can progress towards looking at features.

<img src="https://media.giphy.com/media/d3FA4wImIpTgm892/giphy.gif" alt="Squash Bugs">

## 3. Research

Depending on your limited **research** you should be able to identify if the the issue can be resolved pretty quickly or if it requires some more digging. Search through the codebase for keywords either mentioned in the issue or comments mentioned by others. This is definitely not a foolproof approach, so YMMV.

![Research](https://media.giphy.com/media/ZVik7pBtu9dNS/giphy.gif)

## 4. Reach Out for help

Feel free to **reach out** to maintainers, and ask concise questions on where to look for the bug, and please be polite while doing so. Most maintainers will be able to point you in a direction, but you should be ready to work with the directions given (although they might be vague) but make sure you do some code walk-through and have some understanding before asking questions. It's not necessarily a bad thing to ask questions right away, but it makes it much more easier to communicate when you know what you are looking for.

![Help me Out](https://media.giphy.com/media/l378t21NuMhiz9Kqk/giphy.gif)

## 5. One bite at a time

It is at this stage that you should **NOT** try to understand the whole codebase all at once. Take a step by step approach, your goal is to first fix the issue, only focus on parts of the code that you _think_ might be relevant. It definitely is similar to hack-until-you-fix approach in finding the right spot that causes your bug, but you would get to it at some point.

![Chew slowly](https://media.giphy.com/media/10OQWTQjJmwbXa/giphy.gif)

## 6. Make the Pull Request

Once you find the bug, fix it and take a breath. It's also recommended to read through the contribution guidelines, and check if you have everything in place before submitting your pull request. This [Interactive Pull Request tutorial](https://makeapullrequest.com/) by @[Kent C. Dodds](@kentcdodds) is a great place to learn how to make your first PR if you are unfamiliar.

![Pull Commit Push](https://media.giphy.com/media/cnhpl4IeYgU7MCBdV2/giphy.gif)

## 7. Diving Deeper

Cool! Now that you have made your fix, it's time to dive a little deeper into the code, to get better understanding. This is not necessary if you are looking to make a one-off bugfix of course. If you are keen on contributing more however - this might be an absolute necessity.

- Find the function invocation from wherein the bug you just fixed originate
- Step above the function call stack, to find where this function was called from
- Repeat until you reach anything that feels like an entrypoint of the project.
- Read comments / documentation of the feature relevant to which you fixed the bug now.
- Setting up a debugger to step through code saves a lot of time in the long run, and helps you visualize the function call stack better. If not something as simple as logging to console should be good enough.

![Deep Dive](https://media.giphy.com/media/mtUQxyq3Ez5OvJtcae/giphy.gif)

Let's make the world a better place, by building better open source software.

Good luck with your open source journey! Feel free to reach out to me on [twitter](https://twitter.com/__shriram) for any questions / suggestions / feedback regarding this blog post or anything open source.

Until next time 👋
