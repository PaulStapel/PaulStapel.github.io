---
title: "Creating Table of Contents"
date: "2025-04-16T15:15:55+02:00"
draft: false
description: "The simplest code necessary to implement a ToC."
categories: 
    - coding
    - webDev
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

This is where things get a bit more interesting. I want to query from my post all headers that I want to include. Then, the first step looks something like this. We query the area where content is located, and look for the header files inside this content and for the location of the ToC (If there are no headings or there is no toc, I do nothing).  

```Javascript
const contentArea = document.querySelector('.singleContent');
const headings = contentArea.querySelectorAll("h2, h3, h4, h5");
const toc = document.getElementById("toc");
  
// Only proceed if there are headings and a TOC element
if (headings.length === 0 || !toc) return;
```

Next, I go over each of these headings and create a list item for them, with the text of this item matching that of the heading. I then turn this list item into a link and make it reference the heading. I then add each of these links to the ToC. 

```Javascript
headings.forEach(heading => {
    // Create list item
    const li = document.createElement("li");
    li.textContent = heading.textContent;
    
    // Create link
    const link = document.createElement("a");
    link.href = "#" + heading.id;
    link.appendChild(li);

    // Add to ToC
    toc.appendChild(link);
```

Finally, to make the links a little more fancy, I indent them based on the level of the heading. I extract the heading number and multiply it by a certain indentation. I then pad the link with that indentation. 

```Javascript
const level = parseInt(heading.tagName.charAt(1)) - 2; // h2 = 0, h3 = 1, etc.
const indentation = level * 24
link.style.paddingLeft = indentation + 'px';
link.style.position = 'relative';
```

And that concludes the Javascript for this ToC. At first, I wanted to make this element sticky and have it follow the movement of the user, so that you could dynamically see where you are at inside of the page. This, however, felt a bit overkill for such a simple blog, and it was rather difficult to exactly tell at what heading you were at as some of the paragraphs where only a few lines long and because there is not much room to scroll further at the bottom of the page. Altogether, the Javascript would look like this:

```Javascript
document.addEventListener("DOMContentLoaded", function() {
  // Get headings and TOC element
  const contentArea = document.querySelector('.singleContent');
  const headings = contentArea.querySelectorAll("h2, h3, h4, h5");
  const toc = document.getElementById("toc");
  
  // Only proceed if there are headings and a TOC element
  if (headings.length === 0 || !toc) return;
  
  // Create TOC items from headings
  headings.forEach(heading => {
    // Create list item
    const li = document.createElement("li");
    li.textContent = heading.textContent;
    
    // Create link
    const link = document.createElement("a");
    link.href = "#" + heading.id;
    link.appendChild(li);
    
    // Set indentation based on heading level
    const level = parseInt(heading.tagName.charAt(1)) - 2; // h2 = level 0, h3 = level 1, etc.
    const indentation = level * 24;
    link.style.paddingLeft = indentation + 'px';
    link.style.position = 'relative';
    
    // Add to TOC
    toc.appendChild(link);
  });
});
```

## The CSS

Finally, I needed to style my ToC. This wasn't all that hard to do. First, I styled the container to be moved to the left in the default screen-size. This ensured that the content on the page would not be made too small because of the ToC. I gave it some colors in line with my blogs style, and made a little border for some extra flare. Next, I also styled the title and list elements to make give them a little effect on hovering, and to ensure everything felt right. Finally, I made sure that smaller screens (below 1024 px in width) showed the ToC above the content instead of besides it, as it would take up too much screen real-estate otherwise. I won't bother you any longer with the CSS, but if you're interested, here it is: 

```CSS
.toc-container {
  display: inline-block;
  position: relative;
  top: 30px;
  max-width: 225px; 
  overflow-y: auto;
  margin-right: 25px;
  padding: 16px;
  border-radius: 10px;
  background-color: var(--ToC); 
  border: 1px solid #3a3e47;
  margin-left: -200px;
}

.toc-title {
  font-size: 24px;
  margin-top: 0;
  margin-bottom: 15px;
  color: var(--text);
  text-align: center;
}

#toc {
  list-style: none;
  padding-left: 0;
  position: relative;
  text-align: left;
}

#toc a {
  display: block;
  text-decoration: none;
  padding: 8px 0;
  color: var(--text); 
  font-size: 16px;
  line-height: 1.2;
}

#toc a:hover {
  color: var(--textSoft);
  font-weight: bold;
}

#toc li:hover {
  margin: 0;
  padding: 0;
}

/* for small screens */
@media (max-width: 1024px) {
  .toc-container {
    width: 100%;
    max-width: none;
    margin-left: auto;
    margin-right: auto;
    position: relative;
    margin-bottom: 20px;
  }
  
  .singleBottom {
    display: flex;
    flex-direction: column;
  }

  .toc-title {
    font-size: 32px;
  }

  #toc a {
    font-size: 20px;
  }
}
```
## Final remarks
So this is my (very simple) ToC. I have been wanting to write a bit more about how my website works, and I am testing the waters a bit with this small component. If you want to see more of this type of content, be sure to let me know, and I will post more of it in the future. I would love to share more, and things like the code-blocks that I just recently updated are also very interesting to talk about. Signing off, have a lovely day!!!

