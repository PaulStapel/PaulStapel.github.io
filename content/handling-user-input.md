---
title: "How to Manage Player Input - Part 1: Polling"
date: "2025-07-06T12:10:42+02:00"
draft: false
description: "Exploring input handling inside of games"
categories: 
    - coding
    - gameDev
    - C#
---

So I have slowly been working on a game lately, and I wanted to share some of the problems I face and my solutions to those problems. I find that a definitive guide to input handling was something I could not really find online, and although input handling can be done in simple ways, I'd like to make a system to make it more robust and extensible. I wanted to share my findings and opinions here, as I have found that there is not enough information about this topic online. If you have any feedback, or if you would implement things differently, I'd love to hear about it!

## The problem
In this article, I will assume that we already have some API that can query the state of the input-device that we are using. We can call it to find the state of for example a button or a joystick. From there, we wish to translate this state towards some effect on a player character or other interactable element in our game. 

We wish to do this in a way that is:
- **configurable**: modern games should have mappable controls among other accessibility options
- **extensible**: we should be able to easily add new controls without having to change the whole codebase
- **efficient**: input-lag is a sure-fire way to make a lame game
- **decoupled**: we want to make our system as versatile and testable as possible

The solution(s) that we will look at here may also bring some additional benefits, but in my opinion any good input system satisfies at least these four requirements. First, however, we will discuss a very standard implementation and all the ways in which this can go wrong. I aim to make these techniques language-agnostic, but for my examples I will be writing in C#. 

## The naive approach
Let us assume that we have a simple program that has a main loop like 
```C#
// Simple main loop
public static class Game
{
    public static void Main()
    {
        var inputAPI = new InputAPI();
        var player = new Player(inputAPI);
        var entities = new List<GameEntity> { player };

        while (true) 
        {
            foreach (var entity in entities)
            {
                entity.Update();
                entity.Draw();
            }
        }
    }
}
```

From this, we call for each entity an update, and inside of the update for player, we have code that looks a bit like

```C#
// Naive implementation
public class Player : GameEntity
{
    private InputAPI inputAPI;

    // .. some other code
     
    public void Update()
    {
        if(inputAPI.GetInput() == "Button A")
        {
            // Do A press input
        }
        if(inputAPI.GetInput() == "Button B")
        {
            // Do B press input
        }
        // ... etc.
    }
}
```
Let's look at our four criteria. It lacks any configurability, as we have hard-coded the buttons inside of our Player class. In terms of extensibility, we can easily add another if-statement to this code. But imagine for a second that we have a game with different characters, spells and other options. Each of these has their own control scheme and effects mapped to different buttons. Suddenly, we have to go through a plethora of classes just to add a single control. And heavens forbid you want to add combination input in your game, as composite inputs will become a conditional nightmare to implement. 

Finally, we can see that it is quite coupled to the inputAPI that we use. Suppose that we decide to use our mouse and keyboard instead of a standard controller. Now, we would have to add another check for our inputAPI to check if either a key or button is pressed. 

The only things we have going for us are simplicity and efficiency. Let's slowly work towards a better implementation. 

## Keybindings
For our first step, we will introduce keybindings to our implementation. We would like our game to become data-driven, so that we can manipulate the keybindings at runtime. In order to do this, we will first introduce some abstractions to make dealing with our code a bit easier. 

Our first abstraction is that of states inside of our game. Depending on what is happening on-screen, we may have different controls and actions that we can perform. In your main menu, pressin the up-arrow has a different result from pressing that same button during the final boss. Because of this, we wish to make our controls depend on the state of the game. 

For our second abstraction, we wish to seperate the action from the input, such that the final action that occurs is independent of the source from which it got the input. The system should not couple the button A with the action Jump. Some input manager should know that the button A (in this context) maps to Jump, and it should then send a Jump command to the player. This also lets us buffer input if we wish, and it is an easy way to bind keys to a certain command or action. 

Using this, keybindings become quite simple. Take a look at the following JSON we may use to define commands inside of a mock game. 

```JSON
{
    "Gameplay": {
        "MoveUp": ["W", "Up"],
        "MoveDown": ["S", "Down"],
        "MoveLeft": ["A", "Left"],
        "MoveRight": ["D", "Right"],
        "Shoot": ["Space"]
    },
    "Global": { 
        "Quit": ["Escape"]
    },
    "GameOver": {
        "NewGame": ["Enter", "Space"]
    },
    "Menu": {
        "MoveUp": ["W", "Up"],
        "MoveDown": ["S", "Down"],
        "Select": ["Enter", "Space"]
    }
}
```
We can then simply parse this JSON and store it in a nested dictionary. Depending on your implementation, the key-value pair would either be Input-Command or Command-Input. Command-Input would work using an enum for your commands, and is probably the easiest way to go. Input-Command is more powerful, and is what we will be using for the rest of this article. 

## Polling Based Input Handling
Now that we have this infrastructure ready, let's look at a better way to handle our inputs. We create a new abstract class "CommandProvider" from which we can create concrete instances for each Player character or Enemy. The power of this approach is that enemy AI and player input are all treated as just a provider of commands, and that they don't care about the actual way these commands where achieved. As an example, we could have this implementation of a CommandProvider for a human player:

```C#
public class PlayerCommandProvider : CommandProvider
{
    // For each player, we can use a different input API (keyboard, controller, DDR pad...)
    private InputAPI inputAPI;
    // We may even set configurable keybindings for each player individually. 
    private Dictionary<GameState, <Input, Command>> keybindings;
     
    public Command GetCommand()
    {
        Input input = inputAPI.GetInput(); 

        // ... Do some logic on input (based on keybindings)

        return command
    }
}
```

Our player code could then be reduced to:
```C#
// Polling implementation
public class Player : GameEntity
{
    private CommandProvider commandProvider;

    public Player(CommandProvider commandProvider)
    {
        this.commandProvider = commandProvider; 
    }

    // .. some other code
     
    public void Update()
    {
        Command command = commandProvider.GetCommand(); // Poll the command
        command.Execute(this); // Execute command on this entity. 
    }
}
```
Let us look at our four main criteria for building an input handler. 

Firstly, we can see that this design is configurable, as we are able to change the commands loaded in our JSON and each input provider may even have their own configuration. The way a GameEntity behaves can be entirely controlled by the InputProvider that guides it. 

We can also see that this method is very extensible. For a player, we can simply add a new command to the controls.json and write the command implementation for it. Still, however, we have some small problems when it comes to more complex inputs. Say for example we wish to adjust jump-height based on the duration of a button press. In our case, there is no simple way to do this. Besides that, we have only one command to execute per game cycle (although this can be resolved easily by returning a list of commands instead of a single command). 

Performance is about the same as for the naive implementation, although we have added quite some classes to accomodate this abstraction, meaning that there is a little more overhead. This should not be a problem if this is implemented well however. 

Finally, we have succesfully decoupled our input device from our player. Furthermore, the logic of what input to return and the GameEntity are also seperate, giving us a kind of plug-and-play system where we can easily exchange one input with another. 

## Extending this system
We can do quite a lot with this simple framework. We could for example introduce a more ECS (Entity, Component, System) based structure where each Entity is composed of Components that define what it can do. We can build reactive components for the entity and let our inputs only use those for example. 

We can also create an undo-system by storing the commands used and giving each command not only an execute() function call, but also an undo() call. This could even be used to implement a playback feature. 

We can now also read these commands for online multiplayer. For each command I use, I send it to a remote player, which uses some RemotePlayerInputProvider to sync the character on their screen. In a game where you can control enemies, this structure also makes it very easy. 

Finally, I see two ways to extend this method to allow for more complex inputs like combos or stateful commands. We could upgrade our JSON to allow form more complex inputs to be used as keys, which can for example be handled by using an enum for long presses and short presses, or by using a list of inputs as a key for a combo-action. Secondly, we could introduce PLAYER states inside of the JSON and seperate player controls from global controls. Then, we could have a player be in the "airborne" state, unlocking new controls or moves to be used. This also helps prevent the problem of being able to jump while airborne in quite an elegant way, and makes state something data-driven. 

I am afraid that there are some limits to this system however. In my next article, I will be going over an alternative (and more widely used) approach that solves a lot of the problems this polling approach has. 

## Signing off, have a lovely day!