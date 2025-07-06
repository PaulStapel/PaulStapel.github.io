---
title: "How to Manage Player Input - Part 2: Events"
date: "2025-07-06T20:16:21+02:00"
draft: false
description: "Exploring input handling inside of games using events"
categories: 
    - coding
    - gameDev
    - C#
---

Here we are again, back with the second part of this 2-part series on input handling. Last time, we looked into how to use polling, commands and states to represent a lot of what can be done with inputs. Complex games, however, operate in a slightly different way. We will be looking at three ways to use events in our input handling, and how this can further elevate our engine. 

## Quick recap

We wish to have a system that is:
- **configurable**: modern games should have mappable controls among other accessibility options
- **extensible**: we should be able to easily add new controls without having to change the whole codebase
- **efficient**: input-lag is a sure-fire way to make a lame game
- **decoupled**: we want to make our system as versatile and testable as possible

Furthermore, we will assume a simple API exists from which we can extract the inputs of our device, and that we have a mainloop that looks roughly like 

```C#
// An overly simplified main loop for illustration purposes
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

Let's now get into the meat of our system. 

## Event-Based Input Handling

Instead of processing a command each time a button is pressed, we will be seperating the input updates from the standard updates that happen inside of an entity. Inside of an ECS architecture, we have Entities, Components and Systems. Each system should know only about itself, and events are the abstraction that helps us achieve this. An event encapsulates a request, and delegates that task to another system. 

For example, whenever the phsyics system detects that an entity hits the ground, it may send an event EntityHitGround to the even manager. This can then be picked up on by the sound system, which will play a thunk sound in response. This way, the physics engine does not need to know anything about the sound system, and it doesn't even care if a sound is played because of its event. It simply sends out the event, and other systems can figure out if they want to deal with it. 

The way this is managed is by a subscriber/publisher pattern. You could make every system in your game a publisher, but this becomes very hairy if you employ a lot of systems. Instead, you create one large EventManager that acts as a central publisher with different event-types which can be subscribed to. A system notifies the publisher of an event, and then the publisher distributes it to every system that wants to listen to it. 

An implementation would look someting like:

```C#
public interface IEventListener
{
    public void OnEvent(Event evt);
}

public abstract class Event
{
    public EventType type;
    // ... Possibly other data like time or ID, depending on game
}

public enum EventType
{
    InputEvent, 
    // ... etc. 
}

public static class EventManager 
{
    // Here, EventType is an enum for demonstration purpose. 
    // It would usually be better to use generics on concrete Event classes. 
    private static Dictionary<EventType, List<IEventListener>> _listeners = new();

    public static void Subscribe(EventType type, IEventListener listener)
    {
        if (!_listeners.ContainsKey(type))
            _listeners[type] = new List<IEventListener>();

        if (!_listeners[type].Contains(listener))
            _listeners[type].Add(listener);
    }

    // Rather expensive depending on amount of listeners per event type !
    public static void UnSubscribe(EventType type, IEventListener listener)
    {
        if (_listeners.TryGetValue(type, out var list))
        {
            list.Remove(listener);

            if (list.Count == 0)
                _listeners.Remove(type);
        }
    }

    public static void Publish(Event evt)
    {
        EventType type = event.type;
        if (_listeners.TryGetValue(type, out var list))
        {
            foreach (var listener in list.ToArray())
            {
                listener.OnEvent(evt);
            }
        }
    }
}
```

Most importantly, we can call for each of our Player in our game the Subscribe call at initialisation to, for example, subscribe to all InputEvents. Then, we would create a InputSystem that sends InputEvent which the player can pick up on. The InputSystem could then handle all the logic for what inputs get routed to which player, and we have then effectively decoupled our Entities from our Inputs. The player class could look something like:

```C#
// Event implementation
public class Player : GameEntity, IEventListener
{
    public Player()
    {
        EventManager.Subscribe(EventType.InputEvent, this);
    }

    // .. some other code

    public void OnEvent(Event evt)
    {
        if (e is InputEvent inputEvent)
        {
            inputEvent.command.Execute(this);
        }
    }
     
    public void Update()
    {
        // Internal logic for updating outside of input (Using components for example)
    }
}
```

And there you have it, a robust way to handle inputs using events. The events are dispatched immediately once called, and can be handled by some InputSystem however you see fit. 

This system is still configurable, as we can have the InputSystem handle all of the logic in the user inputs. It may even delay some actions and only fire them off when a combo is completely finished for example. It doesn't care about the Player at all, and can just keep doing its own thing. 

The system is also extensible, as we can create different InputEvents holding different commands. When we want to implement some new control, we need only implement the command and add it to our InputSystem. 

The system is the slowest we have seen so far, as we route our events via the eventmanager this time, having to search for all listeners to the event and all. It may occur that some listener actually isn't going to do anything with the event we send, and thus, this takes some extra time. This would usually not be a bottleneck however, and this is not much to worry about. 

Finally, we can see that the system is decoupled, as we don't even have to use a Dependency Injection of the InputSystem into our Player class in order to get it to read inputs. We only need one large central EventManager, but this can be a very clean way to couple the different systems in your game safely.

In this system, we must keep in mind that infinite loops may occur where A responds to B responds to A responds to B etc. You could ensure Events never trigger new events, but this may be unavoidable. You could also track call depth or event ID to ensure you don't infinitely recurse. 

We may improve upon this design still though, while also solving this infinite loop in the process. 

## Event-Based Input Handling With Queueing
We create a double-buffered event queue inside of our EventManger, like so:

```C#
public static class EventManager 
{
    // Here, EventType is an enum for demonstration purpose. 
    // It would usually be better to use generics on concrete Event classes. 
    private static Dictionary<EventType, List<IEventListener>> _listeners = new();
    private static Queue<Event> FrontQueue = new(); // For adding
    private static Queue<Event> BackQueue = new(); // For processing

    public static void Subscribe(EventType type, IEventListener listener)
    {
        if (!_listeners.ContainsKey(type))
            _listeners[type] = new List<IEventListener>();

        if (!_listeners[type].Contains(listener))
            _listeners[type].Add(listener);
    }

    // Rather expensive depending on amount of listeners per event type !
    public static void UnSubscribe(EventType type, IEventListener listener)
    {
        if (_listeners.TryGetValue(type, out var list))
        {
            list.Remove(listener);

            if (list.Count == 0)
                _listeners.Remove(type);
        }
    }

    public static void PublishEvent(Event evt)
    {
        FrontQueue.Enqueue(evt); 
    }

    // Imediately process the event. 
    public static void Fire(Event evt)
    {
        EventType type = evt.Type;
        if (_listeners.TryGetValue(type, out var list))
        {
            foreach (var listener in list.ToArray())
            {
                listener.OnEvent(evt);
            }
        }
    }

    public static void ProcessEventQueue()
    {
        // Swap front and back queues
        (FrontQueue, BackQueue) = (BackQueue, FrontQueue);

        while (BackQueue.Count > 0)
        {
            var evt = BackQueue.Dequeue();
            Fire(evt); // Dispatch immediately from queue
        }
    }
}
```

This has the same benefits as our previous event based input handling, at the cost of a little extra complexity in managing the Events and working with the queue. 

What we gain is the ability to very easily delay our commands based on time and the ability to have full control over when Events will be handled. For inputs, this can be useful for charged attacks for example. A charged attack may send a StartCharging Event as well as a timed ReleaseCharge Event. This way, all logic that needs to be handled for that charge can be handled inside of that charging command. 

Be mindful if you wish to use this pattern, as it ads complexity where it may be critical for your game to have none. However, if you know that your game will have a plethora of moving parts that need to communicate temporally with eachother, than this type of input handling would fit perfectly. 

## Fucntional Event-Based Input Handling
Finally, we can take advantage of a feature of C# to make our event and thus input handling functional. 

```C#
public static class EventManager
{
    private static readonly Dictionary<EventType, Action<Event>> _listeners = new();

    public static void Subscribe(EventType type, Action<Event> handler)
    {
        if (_listeners.ContainsKey(type))
            _listeners[type] += handler; // Syntactic sugar for adding listeners
        else
            _listeners[type] = handler;
    }

    public static void Unsubscribe(EventType type, Action<Event> handler)
    {
        if (_listeners.ContainsKey(type))
        {
            _listeners[type] -= handler; // Syntactic sugar for removing listeners
            if (_listeners[type] == null)
                _listeners.Remove(type);
        }
    }

    public static void Publish(Event evt)
    {
        if (_listeners.TryGetValue(evt.Type, out var handler))
        {
            handler?.Invoke(evt);
        }
    }
}
```

Here, we have used the Action delegates to let us specify handler functions that deal with the events inside of a class. 

For example, for a player, it would then look like:

```C#
public class Player : GameEntity
{
    public Player()
    {
        EventManager.Subscribe(EventType.InputEvent, HandleInput);
    }

    private void HandleInput(Event evt)
    {
        if (evt is InputEvent inputEvent)
        {
            inputEvent.Command.Execute(this);
        }
    }

    public void Update()
    {
        // Update logic here
    }
}
```

This approach frees us from that pesky IEventListener interface, and cleans up our code quite a bit. It is a little more advanced however, so sticking with the familiar OOP approach is also valid. Besides that, it allows you to pass a Lambda function as a listener, which can be ideal for testing and logging. All with all, this is also a very clean way of handling inputs for your game system. 

## Final remarks
We have gone over quite a few ways to handle input. From humble beginnings with our naive approach to Functional Event-Based Input Handling, we have seen quite some different techniques. This article was a way for me to sort out my thoughts about this topic, as I have been struggling with it quite a bit this weekend, and I felt that it finally began to click after having implemented and played around with these. 

Note that none of these input systems are exactly plug-and-play for any engine, as a lot of how your Inputs work depends on the kind of game you are making. I do hope that this has helped enumerate some of the most important options you should consider when creating such a system, and that it has taught you a thing or two about (high-level) game engine architecture. 

There are many ways to go from here. Maybe you want to use some of this, but the Command pattern for your inputs doesn't sit right with you. Or maybe you want to use components, with only certain components dealing with the inputs inside of a Player class. Maybe you want to ditch all of this alltogether and create a new and contemporary input handling method. Whatever it may be, feel free to reach out with possible improvements or alternate designs that you find interesting enough to mention. I'd love to hear about them, and maybe I'll write about those as well in the future. 

## Signing off, have a lovely day!

