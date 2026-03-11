---
title: "Designing An Algorithm Framework for A/B testing"
date: "2026-03-10T10:42:39+01:00"
draft: false
description: "Some considerations on how to test algorithms"
categories: 
    - coding
    - C#
    - architecture
---

This week, I worked on writing some code to abstract out algorithms for the purpose of making continuous development of these algorithms possible, as well as the A/B testing to compare different parameters or implementations. This was quite a considerable design choice for our program, and because of this, I wanted to share my thought process and the challenges I faced when building this. 

## Defining "algorithm" 
First off, we had to create some definition of an algorithm. Usually, this could be some pure function that takes an input and handles those inputs to finally return some output. This way, you could assure algorithms were stateless and thus easy to swap without having any nasty side effects. This was thus the first idea that came to mind as to what I would abstract out of the code. 

While thinking this problem through a bit more, however, I came to the realisation that abstracting out pure logic was less important than abstracting out the entire pipeline that the algorithm has to run. Some algorithms may need different preprocessing steps as they base their results on different inputs. Because of this, the entire call to do something that requires an algorithm would be the better thing to abstract, as then we can simply call some algorithm each time we need it and be done with it. 

**As an example**, suppose on algorithm is supposed to evaluate the user preference in shows to watch. We may want to A/B test an algorithm that looks at all watched shows and then evaluates the show that has most metrics in common with those shows. Another one might match a profile to the user (that will then be stored in the database), and match shows based on users with the same profile. 

The first algorithm would need to collect all shows that have matching metrics, while the second one must collect all users with similar profiles (and from there the shows they watched).

If we we were to have our algorithms be pure functions, we would need to run large conditional statements to preprocess the inputs of these algorithms in order to make A/B testing work, which makes it a clunky solution. On the other hand, if we allow each algorithm to read data from a database, we don't have this problem, and some method ```algorithm.Run()``` can be called regardless of the way it handles data. Then, the output can be used (or updated into the database) by the program that calls the algorithm, and the algorithm only concerns itself with what to calculate and how. 

In that sense, the algorithm is still pure, as it has read-only database access. What it does lose is that algorithms are now very much dependent on state, which is more difficult to debug. This trade-off, however, facilitates the algorithm to be as generic as possible. 

## My requirements
Now that we have defined the algorithms we wish to implement, let us look at what we want to be able to do with them. The simplest way to implement algorithms would be to simply inline them in the code. Then, we must have some serious gain in functionality in return for the added complexity from the way we handle these algorithms. Let's define what we require from the implementation: 

- The program must be indifferent to different implementations of the same type of algorithm.
- The system must be able to select an implementation at runtime.
- When a new algorithm is created, it should be callable without any other changes to de codebase being necessary.
- Different implementations should be able to use different data to come to their results

If we have an implementation that satisfies these 4 requirements in an efficient way, the implementation is considered sufficient. The first two requirements make it easy to swap algorithms and A/B test them. The second two requirements make development of algorithms easier and more flexible. 

## The strategy design pattern
In order to now make it easy to swap the implementation of the algorithm, we employed a strategy design pattern. The main idea is that we can design different implementations of some function, as long as the type signature is the same and only internal logic is changed. Then, we allow our program to "select" a strategy of implementation. 

The way this is implemented is using a simple interface for each "goal" for an algorithm. To stay with our example, we would include something like

```C#

public interface IRecommendationAlgorithm
{
    showId RecommendShow(int userId); 
}

public class HistoryBasedRecommendation(Context context) : IRecommendationAlgorithm
{
    public showId RecommendShow(int userId)
    {
        // Logic here
    }
}

public class ProfileBasedRecommendation(Context context) : IRecommendationAlgorithm
{
    public showId RecommendShow(int userId)
    { 
        // Different logic here
    }
}
```

Then, when a service needs an algorithm, we only need to change the algorithm we instantiate, and keep the rest of the code unchanged. Off course, this is still a bit ugly, as you need to instantiate an algorithm each time, and there is no real way for the algorithm to be selected at runtime. This marks our 1st requirement. 

## The algorithm registry
The way I solved the problem of run time selection of algorithms is using an AlgorithmRegistry class that saves an instance of each of the algorithms in a dictionary at compile time, so that this registry can then be queried at compile time. For each type of algorithm (remember! we've given this an interface), we can create an instance of a registry to get algorithms from. Initially, the key would be some Name attribute that is defined inside of each implementation of an algorithm (a string for example). This could be implemented as follows: 

```C#
using System.Reflection;

public interface IAlgorithmRegistry<T>
{
    T Get(String key);
}

public class AlgorithmRegistry<T> : IAlgorithmRegistry<T>
{
    private readonly IReadOnlyDictionary<string, T> _registry;

    public AlgorithmRegistry(IEnumerable<T> algorithms)
    {
        _registry = algorithms
            .Where(a => a != null)
            .ToDictionary(a => a.Name);
    }
    
    public T Get(String key) => _registry.TryGetValue(key, out var algorithm) // TryGetValue is a safe way to query the registry
        ? algorithm : throw new KeyNotFoundException("Algorithm not found");
}
```

Where we'd need to keep in mind to have each interface also implement some getter for the name of the algorithm. Having this, we can easily select different algorithms at runtime by selecting the key with which we read from the registry, solving our 2nd requirement. 

A nice way to make the name "key" cleaner is to use Attributes that mark each algorithm as an algorithm with some name that we then give as an argument of the attribute. This way, each algorithm class does not need to know that it is going to be stored in some registry, and it becomes easier to read what part of the code is being put into the registry. This is the approach I took in some project I implemented this in, but it is by no means necessary. 

## Small Note; Dependency Injection
If you looked at the constructor of the previous class, you can see that there is still some mysterious IEnumerable<T> that is passed into the registry. This is achieved by dependency injection in .NET, which is a large part of Microsoft's .NET ecosystem. Dependency injection is a way to instantiate objects without the using class needing to know anything about the construction. Instead of manually creating instances and passing them around, you register types with a DI container up front, and the container takes responsibility for constructing and providing them wherever they are needed. 

Although .NET has tools to do this, any language that supports reflection can implement this abstraction in principle. You use reflection to scan for all implementations of a known interface (our algorithm) and then instantiate each one and collect them into some container that is passed along in the entry point of your program. 

As dependency injection allows all implementations to be passed into the registry, this solves our 3rd requirement. 

## The input of our algorithms
Finally, the problem of what input to give to our algorithms. As previously mentioned in the example, different algorithms that share a same goal may need a very different context to work with. In order to satisfy our first point (that we solved with the strategy pattern), we wish to make sure that each implementation has the same input signature. This means that we should give our algorithms an input that is as broad as possible. The most logical conclusion we reached is that we give it read-only access to the database where data about your program is stored. This way, any algorithm can work out what preprocessing it needs to do on its own, and different data may be used by different implementations. 

The only problems this may face is that querying may generally be slow and that there may be some code duplication in the preprocessing. The first should only really be solved if this becomes a noticable problem, as usually database queries are not in the same timescale as the actual calculations of an algorithm. The second problem could also easily be mitigated by using abstract classes or helper methods. 

Then, this solves our final 4th requirement. 

## Putting it together and A/B testing
Putting things together, using algorithms becomes really simple. To use an algorithm, inject `IAlgorithmRegistry<T>` and call `registry.Get("Key Name")`:

```csharp
public class SomeService(IAlgorithmRegistry<ISomeAlgorithm> registry)
{
    public async Task DoWork(Input input)
    {
        var algorithm = registry.Get("Some Implementation");
        await algorithm.DoSomething(input);
    }
}
```

By default, the algorithm is handled inline by the key we use in the factory, but having some key resolving service automatically makes it easy to apply A/B testing to this as well. As a simple example, consider the following: 

```csharp
public class AbTestingKeyResolver(IAbTestingService abTesting) 
    : IAlgorithmKeyResolver
{
    public string Resolve(int userId)
    {
        return abTesting.GetVariant(userId, "algorithm-variant");
    }
}
```

The body of "DoWork()" would then look something like

```C#
var key = keyResolver.Resolve(userId); // Uses A/B testing parameters
var algorithm = registry.Get(key); 
await algorithm.DoSomething(input); 
```

Thus, this system seems to easily lend itself to A/B testing as well. 

## Conclusion
I always find it interesting to write down my considerations when designing architecture. It is often rather difficult to get the right architecture right away, and I often find myself over-engineering stuff that doesn't actually need to be overengineered. What I tried to do this time is to actually start with the reasons behind the abstraction and architecture, and from there backward engineer an implementation that is as simple as possible while giving me all my requirements. I find it really interesting how this topic of backward engineering has come up independently for both my research thesis as well as for this software architecture I built, and I take it as a sign to keep this approach in mind next time I start designing something. 

