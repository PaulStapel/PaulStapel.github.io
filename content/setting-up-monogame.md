---
title: "Setting Up A (MonoGame) .NET Project"
date: "2025-07-20T15:33:42+02:00"
draft: false
description: "A simple approach to a n project structure"
categories: 
    - coding
    - GameDev
    - C#
---

In the spirit of working on Game Development, I wanted to quickly share with you my current directory structure. Creating a good structure for your projects can be quite the task, as there are many ways to go about it. Besides that, there isn't really any clear guidance to be found online (in my opinion). Therefore, I wanted to share my approach. It may not be perfect, but it works for me. 

This approach should be quite applicable to non-game projects in .NET (or even outside of .NET), but my specific example will be applied to MonoGame. If you want to use this project structure, [you can find it at my public github](https://github.com/PaulStapel/MonogameSetup). 

## My requirements

I wanted to create a project that is: 
- **Flexible**: I need to easily add new directories when needed. 
- **Clean**: I want my build files to be stored away neatly.
- **Easy**: Code can be hard to read, so I don't want this to be as well. 
- **Decoupled**: So that I can recycle code and keep things clean. 

In order to achieve this, this is what I came up with. 

## The structure

As you probably know, .NET works with solution files (extension .sln). This is basically a file that specify how related projects within a larger project are organised and managed. Each of these projects is then further defined inside of a .csproj file. The nice thing about this format is that we can define different related yet decoupled projects to serve different purposes, thus achieving our wish for the project to be decoupled. 

I define in my project 4 main sub-projects, though more may be used. I use a "Core" project for the game logic, and "Engine" for re-usable systems for the game, a "Tools" project for creating game developing tools like a level-editor or character builder and a "Tests" project for unit testing. Here, your "Core" is a monogame project, while the others can just be libraries or tests. 

Here, Tests should know about the Core, Engine and Tools; and the Core should know about the Tools and Engine. The dependencies of your tools depend on what you are creating. 

Furthermore, I add a few directories that can store useful information. Namely "Assets" for the unprocessed art used in the game and "Docs" for design documents. All of these directories should be straightforward in terms of what they are used for, and in an actual implementation of a game, the "Core" directory may be more aptly named after the game you are creating. 

## Seperating Build files

When making a c# project, you would create a new csproj and place it inside a directory like: 

```CLI
dotnet new classlib -n CoolLibrary - CoolLibrary
``` 

Then, if you were to build this project, you would obtain build files inside of "obj" and "bin" directories. This is nice and all, but usually these will be ignored in your gitignore, and I find that it interrupts my zen when these build directories clutter your nice and clean directory. Therefore, you create a separate build directory at the top level of your project. You can then redirect all build files into this directory by adding the following file to the root of your project: 

```Directory.Build.props
<Project>
  <PropertyGroup>
    <!-- Set intermediate (obj) output path -->
    <BaseIntermediateOutputPath>../Build/Intermediate/$(MSBuildProjectName)/</BaseIntermediateOutputPath>
  </PropertyGroup>

  <PropertyGroup Condition="'$(Configuration)'=='Debug'">
    <!-- Final compiled output (bin) path for Debug -->
    <OutputPath>../Build/$(MSBuildProjectName)/Debug/</OutputPath>
  </PropertyGroup>

  <PropertyGroup Condition="'$(Configuration)'=='Release'">
    <!-- Final compiled output (bin) path for Release -->
    <OutputPath>../Build/$(MSBuildProjectName)/Release/</OutputPath>
  </PropertyGroup>

  <!-- Add extra Conditions along the way if necessary -->
</Project>
```

Basically, this tells your program to store intermediate and compiled files into a Build directory, and it even splits them up depending on if you run a release build or a debug build (with the ability to add more kinds of builds easily). 

With this, the structure is quite complete. 

## Review our criteria

Let's see. First of all, our design is quite flexible. We can just add a new project whenever, and other directories are also really easy to add. We didn't specifies how our Core and Engine must operate, and thus we can quite easily design them any way we want. 

In terms of cleanliness, we can see that build files are neatly stored, making each directory nice and minimal. 

This design is also quite easy to use and initiate (if you know the .NET CLI), and the naming works well for me (and can be easily changed in an IDE). 

Lastly, the different projects are nicely decoupled thanks to the way solutions work in .NET. 

I conclude that this project structure works quite nicely. Again, if you want to take a look, [check out the public repository](https://github.com/PaulStapel/MonogameSetup).

## Signing off, have a lovely day!!