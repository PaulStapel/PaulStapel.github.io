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
  const input = document.querySelector(".search-container input");
  const resultsContainer = document.createElement("div");
  resultsContainer.classList.add("search-results");
  document.querySelector(".search-container").appendChild(resultsContainer);

  // Fetch your index.json
  const response = await fetch("/index.json");
  const pages = await response.json();

  // Configure Fuse.js to search title, summary, and tags
  const fuse = new Fuse(pages, {
    keys: ["title", "description", "categories"],
    threshold: 0.4,
  });

  input.addEventListener("input", () => {
    const query = input.value.trim();
    resultsContainer.innerHTML = "";

    if (!query) return;

    const results = fuse.search(query);

    results.forEach(result => {
      const item = document.createElement("div");
      item.classList.add("search-item");
      item.innerHTML = `<a href="${result.item.url}">${result.item.title}</a>`;
      resultsContainer.appendChild(item);
    });
  });

  // Optional: hide results when clicking outside
  document.addEventListener("click", (e) => {
    if (!input.contains(e.target) && !resultsContainer.contains(e.target)) {
      resultsContainer.innerHTML = "";
    }
  });
});


