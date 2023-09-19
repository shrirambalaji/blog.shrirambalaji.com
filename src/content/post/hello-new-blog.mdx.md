---
title: Moving a blog from hashnode to astro in a day
description: Building this website with Astro and Tailwind, moving away from hashnode and setting up Obsidian Git Sync for publishing blogs from anywhere.
publishDate: "{{date: MMM DD YYYY}}"
tags: 
draft: "true"
---
import { Tweet } from "astro-embed";

I've been using hashnode.dev for the last couple of years as my primary blogging platform. It served well for the last couple of years, but I think it's time for a change.

## Why I'm moving away from hashnode

Don't get me wrong, hashnode.dev is great to get started, and helps build a habit of writing. But over time I've realized that I don't really write a lot, but when I do - I want it to look the way I want.

The main problem:
- Hashnode had custom CSS for a couple of years, and I've raved about in the past. 
  
  <Tweet id="https://x.com/shrirambalaji/status/1341662028843241474?s=20" />
  
  But over time, as with custom stylesheets - _things broke_. The theming was inconsistent with my site at shrirambalaji.com and it was hard to keep track.
- I couldn't find extensive theming options on hashnode, and felt it to be limiting. 
  
  (whether or not I write often - atleast the site should look consistent 😅)

- Another issue I've had was with code highlighting. The default code highlighting theme wasn't something I liked, and also the code theme didn't switch when going from Dark to Light.

I wanted to move for a couple more reasons:
- I've started using [Obsidian](https://obsidian.md) as my primary way to write down notes. With iCloud and Git sync, its much easier for me to take my notes everywhere and I wanted to experiment with this for blogging. 
- I've tried Astro for some projects, but wanted to try it out since their 3.0 release. [Content Collections](https://docs.astro.build/en/guides/content-collections/) also seemed like a very cool way to manage content.

## The Process

- Export documents from hashnode.dev
- Setup Astro, (preferably use a starter)
- Update theming, setup syntax highlighting with support for theme switching
- Setup Obsidian