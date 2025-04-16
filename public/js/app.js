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

document.addEventListener("DOMContentLoaded", function() {
  const codeContainers = document.querySelectorAll(".highlight");

  codeContainers.forEach(container => {
      const copyButton = document.createElement("button");
      copyButton.innerText = "Copy";
      copyButton.classList.add("copy-button");
      copyButton.addEventListener("click", function() {
          const codeBlock = container.querySelector("code");
          copyCodeToClipboard(codeBlock.innerText);
          this.innerText = "Copied!";
          setTimeout(() => {
              this.innerText = "Copy";
          }, 2000);
      });

      container.appendChild(copyButton);
  });

  function copyCodeToClipboard(code) {
      const textarea = document.createElement("textarea");
      textarea.value = code;
      textarea.style.position = "fixed"; // Prevent scrolling to bottom
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
  }
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

  
  // Track items for updating the path
  const tocItems = [];
  
  // Make sure headings have IDs
  headings.forEach((heading, index) => {
    if (!heading.id) {
      heading.id = `heading-${index}`;
    }
  });
  
  // Create TOC items from headings
  headings.forEach(heading => {
    // Create TOC item
    const li = document.createElement("li");
    li.textContent = heading.textContent;
    
    // Create link
    const link = document.createElement("a");
    link.href = "#" + heading.id;
    link.appendChild(li);
    
    // Set indentation based on heading level
    const level = parseInt(heading.tagName.charAt(1)) - 2; // h2 = level 0, h3 = level 1, etc.
    const indentation = level * 24; // Reduced indentation
    link.style.paddingLeft = indentation + 'px';
    link.style.position = 'relative';
    
    // Add to TOC
    toc.appendChild(link);
    
    // Store this item for path calculation
    tocItems.push({
      element: link,
      level: level
    });
  });

  // Add click handlers to TOC items
  tocItems.forEach(item => {
    item.element.addEventListener('click', function(e) {
      // Remove active class from all items
      tocItems.forEach(i => i.element.classList.remove('active'));
      
      // Add active class to clicked item
      this.classList.add('active');
    });
  });
});