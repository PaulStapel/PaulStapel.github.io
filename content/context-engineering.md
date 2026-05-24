---
title: "Some views on AI"
date: "2026-05-24T15:21:47+02:00"
draft: false
description: "And the importance of context engineering"
categories: 
    - coding
    - AI
    - architecture
---

AI, you may love it, you may hate it, but it's here. Just like the rest of the world, I have been exposed to Large Language Models for a few years now, but only recently have I been able to see through the hype or criticism to actually form a coherent stand on what I think AI can and can't do. Most importantly, despite initial criticism, I have come to appreciate that there is quite some craftsmanship in getting AI to actually do what you want it to, and that boils down most strongly to context engineering. 

## My history with AI
I have been using AI on and off for the past three years to see what it is capable of. It was a neat novelty at first, but within the first year it would already be able to assist at programming, and it only got better from there. However, as I am still a student, I decided not to use it too much. Its main use to me was as a glorified search engine when I had to look up things that I didn't know I didn't know, and I took most of the output with a grain of salt. 

Back then, we already had some evangelists screaming on about what capabilities these AI models would have, and how they would take over all thinking and programming. Off course, I was skeptical, not only because I experienced firsthand that these models could not even solve my bachelor level computer science problems, but also because I wanted to believe that I would stay ahead of the curve. I tried to ignore most AI because of this, trying to stay competitive, but I also did not feel much heat from it growing so quickly. 

Then, about a year ago, I started to notice that it could actually do some things better than me. When it came to writing SQL, Javascript or most boilerplate code, it found ways of doing things that I had not yet thought of. This was the first time I actually started understanding what the fuss was all about. Around this time, companies like Google, OpenAI and Anthropic started gaining traction with their models, and new paradigms of coding started emerging.

As I started experimenting with AI, I also started seeing what it could and couldn't do. It was great at reducing boilerplate code and having conversations to give inspiration for my thinking about certain problems, but actually thinking out of the box itself or solving problems that were multifaceted it could not yet do. Having context was also a big problem, and usually it just didn't understand all of the context around the problems it was trying to solve. 

As of now, I use AI mainly for generating quick prototypes to see if an idea would work, finding out examples of how to use something / creating examples from bare-bones documentation and being an upgraded rubber ducky to talk to when I'm stuck in my own head. In using AI, I have become more critical of its future, but also more accepting of its strengths. 

## So where do I stand now? 
I believe AI is a great tool, but not a fix-all. We are obsessing a bit too much over all of the possibilities of AI that we forget to look at what it is actually strong at: being average. Average is good!

A lot of companies are trying to offload all thinking and work to AI. I get it, AI is this autonomous workforce that (thanks to agentic AI) can do anything on a computer that a human could (theoretically). Especially when coding, they could just write a lot of code fast, and replace human engineers, saving a bunch o' bucks. But as I said, AI is good at being average. It computes results based on what has been seen and approved, and the more something is seen and the more something works, the more common it is and the more AI will take from that, thus becoming average. That is the entire idea on which they operate, so how can we blame those lil' large language guys? 

But we humans are always forward facing, trying to work on and invent new things. Then, laying new connections, building new products, thinking up new ideas. When it comes to innovation, we are operating (per definition) beyond average. AI to me should not ever be a tool for inventing, creating complex systems or tying things together in ways that have never been done before. I think they are best put to use in the fields where they excel by being average. 

For my current usage, AI fits best as a mentor. I face forward, and am able to stand on the shoulder of giants, elevated further by advancements in AI that can summarize, evaluate and serve all of this knowledge in a way not possible before. Besides this, we are able to create ideas and work through difficult problems, while employing AI to do the things we don't have the time for. Finally, AI can serve as a simple mind that processes big sets of data and draws results from them. We don't need these to be groundbreaking conclusions, they just need to be good enough. Art in all forms can also be generated for ideating, prototyping and the likes, as long as we ourselves keep pushing the needle of imagination and actually create beyond this. 

I believe AI will replace us like the marketing and hype-cycles are trying to convince us, and I don't think AI is useless and a bane to our existence. The truth is just that a lot of manual work that was necessary previously is now being offloaded to averages, meaning that craftsmanship and ideation becomes more and more important. And craftsmanship lies in more than just art, as good architecture for code or good methodology for science are in their own ways a craft that we can't yet (and won't still) go without. 

## Case: future of AI in games
As an example of what I think will and won't happen with the future of AI. I think vibecoded games will never take off. Coding without knowing what you are doing will at best lead to average. Code is a craft, and good code extends beyond just getting something to work. You need to be able to patch problems, extend code, have code produce something that feels good, and you need to be able to test and adjust this until it passes the bar. 

So then where does AI fit into the whole game creation pipeline? Well, for one, developers can use generative AI for rapid asset creation for prototyping purposes, while the artists actually develop the final assets to be used in the game. Decoupling artists and developers in this is beneficial in an obvious way, and usually developers don't need good art to prototype something. 

Besides this, in the codebase, AI has a number of useful places. First off all, having an AI be able to index a large codebase like that of a game and be able to point people into the right direction can be invaluable to larger project. Imagine if a new hire is able to chat with a bot that knows everything about a codebase and can point them in the right direction when they are working on a problem or new feature. Generating boilerplate code, learning external documentation and implementing trivial tasks is also something AI can do that speeds up development by a lot. 

Finally, runtime AI can be something that has a lot of promise in games. Current generative AI is simply smarter and more robust (though heavier) than what is currently being used for game AI, and having access to these larger models for tasks that can not be solved algorithmically has a lot of promise in making games more adaptive. 

## Contained AI
So the pattern I see with AI is that it is contained. It is not running free, but instead
sits inside of a neat bubble, where it uses its "intelligence" to perform tasks in a 
predictable way to assist humans with their own tasks. This isolation can still be agentic,
but only if we allow it a defined context wherein it is allowed to operate. 

AI is really good at doing average things, and so we should not expect it to operate autonomously and unsupervised, lest we create things both beyond our understanding and thus beyond our control. If software by AI breaks, we have no control to fix it, if it misbehaves, we have no control to correct it, if it creates something we don't want, we have no control to improve it. That is exactly why we should want AI to be contained, to be understood and to make it as deterministic as possible without getting more deterministic than necessary. 

Because of this, it is all the more important that we focus not on prompt engineering and getting AI to do marvelous things with the prompts we give it, but on context engineering and giving the AI exactly the context and environment to do its job and nothing more. In my opinion, this is what differentiates vibe coding and AI slop from actual engineering. 

## Context engineering
At work, I am currently working on a context engineering task involving the MCP framework. MCP stands for Model Context Protocol, and it is a way to define tools a AI application is allowed to use. Tools here are functions or requests with deterministic outcomes, either producing extra context or performing stateful actions. With MCP, we can then standardize the way tools are called and handled, making it easy to extend and implement across a wide variety of tools and applications. 

The tools are handled by MCP servers, endpoints that have a set of methods that can be called. The host uses clients to communicate with these servers, all via a standardized JSON format. The nice thing is that without tools, the host is only able to generate text. The clients of our host expose it to tools that it can call, and these can all be controlled and authorized to better contain what an AI is capable of. If you want it to read the time or set a stopwatch for example, you can set up a timer MCP server and let our AI model access that. 

Another way of context engineering are the more recent skills.md files you may see popping up here and there. The main idea is that instead of giving AI a large system prompt, you let it know the skills it could read into, and only have it read those files when it predicts that it needs those skills. This prevents context overload, and makes an AI model in charge of the knowledge it has. This can also be combined with MCP, for example by letting an AI discover tools through the skills.md files that it reads. 

Again, what is nice is that deterministic code can be employed to limit AI or help make its context more robust. In this way, token usage can be limited, context can be made to be exactly what you need it to be, and results will match more closely what you need them to be. If employed well, AI becomes a tool that can elevate almost any project if you are creative enough in its usage. 

I believe that this is one of the best directions AI can take. It limits for ourselves the AI craze of using it for anything and everything by making us think more clearly about the contexts, thus making AI a smaller component (and thus variable) to deal with. On top of that, it is one of the safer ways to keep AI in control to avoid the dreaded (and maybe exaggerated) "singularity" we might be barreling towards. 

## Conclusions
So those where some quick reflections on AI. While it is a tool I use almost daily, and it can assist us in numerous ways, we need to stop and think about what AI actually is, and how we can best employ it to our benefits. Mindlessly using AI will only limit your forward-thinkingness and ability to solve complex problems, but ignoring AI and hating on it for no reason means you will miss out on all the amazing things it does have to offer. The answer, as always, always lies somewhere in the middle. If there is one skill I think will be timeless when it comes to AI, it is that of context engineering. With AI being as variable as it is, staying in control and keeping it in the loop may be the most valuable thing you can do. 

## Signing off, have a lovely day!!

