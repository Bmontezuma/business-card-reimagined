document.addEventListener("DOMContentLoaded", () => {
  // Handle "Start AR" button click
  document.getElementById("start-ar").addEventListener("click", () => {
    // Hide the normal content (particles, links, icons)
    document.querySelector(".container").style.display = "none";

    // Show the AR scene
    document.getElementById("ar-scene").style.display = "block";
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
});

