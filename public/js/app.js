// ! Dark and light mode

const mode = localStorage.getItem("mode") || "";
const toggle = document.querySelector(".toggle");
const body = document.querySelector("body");

if (mode) {
  body.classList.add(mode);
}

// Add event listener for the toggle button
toggle.addEventListener("click", () => {
  if (body.classList.contains("light")) {
    body.classList.remove("light");
    localStorage.removeItem("mode");
  } else {
    body.classList.add("light");
    localStorage.setItem("mode", "light");
  }
});

// ! Copy code to clipboard;

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
