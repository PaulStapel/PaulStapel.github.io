---
title: "Creating Table of Contents"
date: "2025-04-16T15:15:55+02:00"
draft: true
description: "The simplest code necessary to implement a ToC."
categories: 
    - Coding
    - WebDev
ToC: true
---

Ok, so as my blog has been growing recently, I decided it was about time I started implementing some more features. One of the things I wanted to add was a little floating table of contents. From there, users would be able to more easily navigate through a given page, and as I have just recently implemented my [codex](https://paulstapel.com/codex/codex-meae-mentis/), I felt it was about time to create this. As I found it rather difficult to find things about this online, I wanted to quickly share my implementation. I will be using HTML, Javascript and CSS. 

## The HTML 
For the HTML, I have quite a simple (single) page file template that I use for all my articles. It looks something like this: 

```HTML
<div class="single">
   <div class="singleHead">
      <div class="singleHeadText">
        <h1 class="singleHeadTitle">{{.Title}}</h1> 
        <p class="singleHeadDesc">{{.Params.description}}</p>
        <time class="singleDate"><em>{{ dateFormat .Site.Params.dateFormat .Date }}</em></time>
        <div class="singleCategories">
            {{ range (.GetTerms "categories")}}
            <a class="singleCategory" href={{ .Permalink }}>{{ .Name}}</a> 
            {{end}}
        </div>
      </div>
   </div>
   <div class="singleBottom">
    <div class="singleContent">{{.Content}}</div>
   </div>
</div>
{{ end }}
```
Here, I simply create everything inside of a "single" div, and create two main sections. The Header and the Bottom that contains all of the content. The header uses some parameters I can set in the header of my markdown file, and the bottom is also found inside of a content block that I can write in markdown. 

Then, I simply want to add a div between the header and content, in the bottom div. It eventually looks something like this. 

```HTML
<div class="singleBottom">
    {{ if .Params.ToC }}
      <div class="toc-container">
        <h2 class="toc-title">Table of Contents</h2>
        <div id="toc" class="toc"></div>
      </div>
    {{ end }}
    <div class="singleContent">{{.Content}}</div>
</div>
{{ end }}
```
Here, I created a parameter (for HUGO) to make me able to toggle ToC's for different pages. 

## The Javascript

This is where things get a bit more interesting. I want to query from my post all headers that I want to include. Then, the first step looks something like this. 

```Javascript
  const contentArea = document.querySelector('.singleContent');
  const headings = contentArea.querySelectorAll("h2, h3, h4, h5");
  const toc = document.getElementById("toc");
  
  // Only proceed if there are headings and a TOC element
  if (headings.length === 0 || !toc) return;
```
