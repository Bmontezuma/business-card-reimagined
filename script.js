document.addEventListener("DOMContentLoaded", () => {
  // Initialize particles.js
  particlesJS("particles-js", {
    particles: {
      number: { value: 189, density: { enable: true, value_area: 631 } },
      color: { value: "#043df5" },
      shape: { type: "circle", stroke: { width: 2, color: "#021ffc" } },
      opacity: { value: 0.4 },
      size: { value: 60, random: true },
      line_linked: { enable: true, distance: 150, color: "#000" },
      move: { enable: true, speed: 4, out_mode: "bounce" },
    },
    interactivity: {
      detect_on: "canvas",
      events: { onhover: { enable: true, mode: "repulse" } },
    },
    retina_detect: true,
  });

  // Start AR button logic
  document.getElementById("start-ar").addEventListener("click", () => {
    // Hide the particles background and main content
    document.getElementById("particles-js").style.display = "none";
    document.querySelector(".container").style.display = "none";
    // Show the AR scene (A-Frame)
    document.querySelector("a-scene").style.display = "block";
  });

  // Toggle Info Box Visibility on AR Button Hover
  const infoBox = document.getElementById("info-box");
  document.getElementById("start-ar").addEventListener("mouseenter", () => {
    infoBox.style.display = "block";
    infoBox.innerHTML = "Click to start the AR experience!";
  });
  document.getElementById("start-ar").addEventListener("mouseleave", () => {
    infoBox.style.display = "none";
  });

  // Display info when AR scene is in use (based on events or scene readiness)
  const arScene = document.querySelector("a-scene");
  arScene.addEventListener("loaded", () => {
    infoBox.style.display = "block";
    infoBox.innerHTML = "Welcome to the AR world!";
  });

  // Optional: Add a button to reset the AR scene (if needed)
  // Create a reset functionality if you want users to be able to restart the AR session
  const resetButton = document.createElement("button");
  resetButton.textContent = "Reset AR";
  resetButton.id = "reset-ar";
  resetButton.style.position = "absolute";
  resetButton.style.top = "10px";
  resetButton.style.left = "10px";
  resetButton.style.padding = "10px 20px";
  resetButton.style.background = "#ff5e5e";
  resetButton.style.color = "#fff";
  resetButton.style.border = "none";
  resetButton.style.borderRadius = "5px";
  resetButton.style.cursor = "pointer";
  resetButton.style.zIndex = "101"; // Ensure it shows above other elements
  document.body.appendChild(resetButton);

  resetButton.addEventListener("click", () => {
    document.querySelector("a-scene").style.display = "none";
    document.getElementById("particles-js").style.display = "block";
    document.querySelector(".container").style.display = "block";
    infoBox.style.display = "none"; // Hide info box
  });
});

