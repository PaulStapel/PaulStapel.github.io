const mode = localStorage.getItem("mode") || "";
const toggle = document.querySelector(".toggle");
const body = document.querySelector("body");

if (mode) {
  body.classList.add(mode);
}

toggle.addEventListener("click", () => {
  if (body.classList.contains("light")) {
    body.classList.remove("light");
    localStorage.removeItem("mode");
  } else {
    body.classList.add("light");
    localStorage.setItem("mode", "light");
  }
    // Update particles background color when mode changes
  updateParticlesBackground();
});

document.addEventListener('DOMContentLoaded', () => {
  // Find all code blocks
  const codeBlocks = document.querySelectorAll('pre:has(code)');
  
  codeBlocks.forEach((pre) => {
    const code = pre.querySelector('code');
    
    // Get language from code block class (variable you set at ```Language )
    let language = 'Text';
    if (code.className) {
      const match = code.className.match(/language-(.+)/);
      if (match) {
        language = match[1].charAt(0).toUpperCase() + match[1].slice(1);
      }
    }
    
    // Set language attribute for the ::before pseudo-element
    pre.setAttribute('data-language', language);
    
    // Create and append copy button
    const copyButton = document.createElement('button');
    copyButton.textContent = 'Copy Code';
    copyButton.className = 'copy-button';
    copyButton.addEventListener('click', () => {
      navigator.clipboard.writeText(code.textContent)
        .then(() => {
          copyButton.textContent = 'Copied!';
          setTimeout(() => {
            copyButton.textContent = 'Copy Code';
          }, 2000);
        })
        .catch(err => {
          console.error('Could not copy text: ', err);
        });
    });
    
    pre.appendChild(copyButton);
  });
});

function getIsLightMode() {
  return document.body.classList.contains("light");
}

async function updateParticlesBackground() {
  await tsParticles.load({
    id: "tsparticles",
    options: {
      preset: "stars",
      background: {
        color: getIsLightMode() ? "#9A510D" : "#395452",
      }
    }
  });
}

// Initialize particles on page load
(async () => {
  await loadStarsPreset(tsParticles);
  await updateParticlesBackground(); // Initial background setup
})();

// Listen for theme changes and update particles accordingly
const observer = new MutationObserver(() => {
  updateParticlesBackground();
});

// Observe class changes on the body element
observer.observe(document.body, {
  attributes: true,
  attributeFilter: ['class']
});


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
    const ul = document.createElement("ul");
    ul.style.listStyleType = 'none';
    
    // Create link
    const link = document.createElement("a");
    link.href = "#" + heading.id;
    link.textContent = heading.textContent;
    
    // Set indentation based on heading level
    const level = parseInt(heading.tagName.charAt(1)) - 2; // h2 = level 0, h3 = level 1, etc.
    const indentation = level * 24;
    link.style.paddingLeft = indentation + 'px';
    link.style.position = 'relative';
    
    // Add to TOC
    link.appendChild(ul);
    toc.appendChild(link);
  });
});

// Quotes
document.addEventListener("DOMContentLoaded", function () {
  document.querySelectorAll("blockquote").forEach(block => {
    let text = block.innerHTML;

    // Replace // with <br> for line breaks
    text = text.replace(/\/\//g, "<br>");

    const match = text.match(/\[(.*?)\]/);

    if (match) {
      const author = match[1];
      text = text.replace(/\[(.*?)\]/, "").trim();
      
      block.innerHTML = text; // Set updated text with <br>

      const authorElement = document.createElement("div");
      authorElement.className = "quote-author";
      authorElement.textContent = author;
      block.appendChild(authorElement);
    } else {
      block.innerHTML = text; 
    }

    // Add corners
    ["left_top", "right_top", "left_bottom", "right_bottom"].forEach(id => {
      const corner = document.createElement("div");
      corner.className = "corner";
      corner.id = id;
      block.appendChild(corner);
    });
  });
});

// Search! 

document.addEventListener("DOMContentLoaded", async () => {
  const container = document.querySelector(".search-container");
  const input = container.querySelector("input");
  const resultsContainer = document.createElement("div");
  resultsContainer.className = "search-results";
  container.appendChild(resultsContainer);

  const response = await fetch("/index.json");
  const pages = await response.json();

  const fuse = new Fuse(pages, {
    keys: ["title", "categories", "url"],
    threshold: 0.2,
    ignoreLocation: true
  });

  // Debounce utility
  function debounce(fn, delay = 200) {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => fn(...args), delay);
    };
  }

  const runSearch = debounce((query) => {
    resultsContainer.innerHTML = "";
    if (!query) return;

    const results = fuse.search(query);
    if (results.length === 0) {
      resultsContainer.innerHTML = `<div class="search-item no-results">No results found</div>`;
      return;
    }

    results.forEach(({ item }) => {
      const itemLink = document.createElement("div");
      itemLink.className = "search-item";
      itemLink.textContent = item.title;
      resultsContainer.appendChild(itemLink);

      itemLink.addEventListener("mousedown", () => {
        window.location.href = item.url;
      });
    });
  }, 150);

  input.addEventListener("input", () => {
    runSearch(input.value.trim());
  });

  document.addEventListener("click", (e) => {
    if (!container.contains(e.target)) {
      input.value = "";
      resultsContainer.innerHTML = "";
    }
  });
});

function createRaindrop(){
  const raindrop = document.createElement('div')
  raindrop.classList.add('raindrop')

  raindrop.style.left = Math.random() * window.innerWidth + 'px';

  const duration = Math.random() * 10 + 5;

  raindrop.style.animationDuration = duration + 's';

  document.body.appendChild(raindrop);

  setTimeout(() => {
    raindrop.remove();
  }, duration * 5000); 
}

if (window.location.pathname.includes('/daily-drop/')) {
  setInterval(createRaindrop, 50);
} 

// Blocks Needs fixes!

function isMobile() {
  const regex = /Mobi|Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
  return regex.test(navigator.userAgent);
}

document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("contentBlocks");
  const elements = Array.from(container.children);
  let blocks = [];
  let currentBlock = null;

  // Split content into blocks by H2
  elements.forEach(el => {
    if (el.tagName === "H2") {
      if (currentBlock) blocks.push(currentBlock);
      currentBlock = document.createElement("div");
      currentBlock.classList.add("block");
      currentBlock.appendChild(el.cloneNode(true));
    } else if (currentBlock) {
      currentBlock.appendChild(el.cloneNode(true));
    }
  });

  if (currentBlock) blocks.push(currentBlock);

  container.innerHTML = "";

  const columns = 3; 
  if(isMobile()){
    columns = 1;
  }

  const colHeights = Array(columns).fill(0);
  const colCounts = Array(columns).fill(0); // track number of blocks per column

  // Shuffle blocks for random placement
  blocks.sort(() => Math.random() - 0.5);


  blocks.forEach(block => {
    const minCount = Math.min(...colCounts);
    const allowedCols = colCounts.map((count, i) => count - minCount < 2 ? i : -1).filter(i => i >= 0);
    if(isMobile()){
      allowedCols = [0];
    }
    const col = allowedCols[Math.floor(Math.random() * allowedCols.length)];
    if (col === 0) {
      xShift = Math.random() * 3; 
    } else if (col === columns - 1) {
      xShift = -(Math.random() * 3); 
    } else {
      xShift = Math.random() * 3 - 3;
    }
    const yShift = Math.random() * 3; 

    // Ensure block fits within container width
    block.style.position = "absolute";
    block.style.width = `calc(${100 / columns}% - 20px)`; 
    block.style.left = `calc(${col * 33.33}% + 10px + ${xShift}%)`; 
    block.style.top = `calc(${yShift}% + ${colHeights[col]}px)`;
    block.style.transform = `rotate(${Math.random() * 3 - 1}deg)`;
    block.style.padding = "10px";

    container.appendChild(block);

    colHeights[col] += block.offsetHeight + 40; // spacing
    colCounts[col] += 1;
  });

  container.style.position = "relative";
  container.style.minHeight = Math.max(...colHeights) + "px";
});


