---
title: "How I Manage Player Input: Design and Code"
date: "2025-04-23T16:05:05+02:00"
draft: true
description: "An extensible way to handle user input in MonoGame"
categories: 
    - gameDev
    - Coding
    - C#
ToC: true
---

So I have slowly been working on a game lately, and I wanted to share some of the problems I face and my solutions to those problems. I find that a definitive guide to input handling was something I could not really find online, and although simple input handling is quite simple, there are some tricks you can use to make your input handling much more robust. I wanted to share my implementation here, as I think it works quite well. If you have any feedback, or if you would implement things differently, I'd love to hear about it!

## My requirements
For input handling, I would love to be able to have mappable inputs. This means that a player should be able to configure their own controls if they want, and if I were to change up the keymapping, I would want to be able to do that in a very simple way. Besides this, I want the controls to support multiple game states, like dialogue, gameplay and menu navigation. Lastly, I don't want to have to remember which button was mapped to what. This means that I should be able to query the "jump" action from my keymapping in order to check whether the spacebar was pressed instead of having to refer to the spacebar directly. 

## Actions and States
Whenever I want to check for an action, I would like to do a lookup based on the action I need to perform and the state that I am currently in. Ideally, I would have a dictionary with the controls for each gamestate, such that for a given gamestate, I can query the action I want to take. If I also want to allow multiple buttons to do the same thing, It could look something like this: 

```JSON
{
    "Gameplay": {
        "MoveUp": ["W", "Up"],
        "MoveDown": ["S", "Down"],
        "MoveLeft": ["A", "Left"],
        "MoveRight": ["D", "Right"],
        "Jump": ["Space"]
    },
    "Global": {
        "Pause": ["P"]
    },
    "GameOver": {
        "NewGame": ["Enter", "N"]
    },
    "Menu": {
        "MoveUp": ["W", "Up"],
        "MoveDown": ["S", "Down"],
        "Select": ["Enter"]
    }
}
```
I have made the state and action enums in my code, as strings would be too costly to use as keys. 