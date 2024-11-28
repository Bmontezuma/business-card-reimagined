import * as THREE from "https://unpkg.com/three@0.126.0/build/three.module.js";

// Wait for the DOM content to be loaded
document.addEventListener("DOMContentLoaded", () => {
  // Initialize particles.js for background effects
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

  // When "Start AR" is clicked, hide the particles and main content, then start the AR session
  document.getElementById("start-ar").addEventListener("click", () => {
    document.getElementById("particles-js").style.display = "none"; // Hide particles
    document.querySelector(".container").style.display = "none"; // Hide main content
    startARSession(); // Start AR session
  });
});

// List of hotspots with links and their 3D position in the AR scene
const hotspots = [
  { label: "ArtStation", link: "https://www.artstation.com/brandonmontezuma6", position: new THREE.Vector3(-0.5, 0, 2) },
  { label: "GitHub", link: "https://github.com/Bmontezuma", position: new THREE.Vector3(0, 0, 2) },
  { label: "Instagram", link: "https://www.instagram.com/montezumashare/", position: new THREE.Vector3(0.5, 0, 2) },
  { label: "Email", link: "mailto:brandon.montezuma@yahoo.com", position: new THREE.Vector3(-0.5, -0.5, 2) },
  { label: "Wix", link: "https://brandonmontezuma.wixsite.com/brandon-montezuma-3", position: new THREE.Vector3(0, -0.5, 2) },
  { label: "LinkedIn", link: "https://www.linkedin.com/in/brandon-montezuma/", position: new THREE.Vector3(0.5, -0.5, 2) },
  // New example links
  { label: "Spotify", link: "https://spotify.com", position: new THREE.Vector3(0, 1, 2) },
  { label: "YouTube", link: "https://www.youtube.com", position: new THREE.Vector3(0.5, 1, 2) }
];

// Hotspot image mapping
const imageMap = {
  "ArtStation": "./assets/icons/artstation_icon.png",
  "GitHub": "./assets/icons/github_icon.png",
  "Instagram": "./assets/icons/instagram_icon.png",
  "Email": "./assets/icons/email_icon.png",
  "Wix": "./assets/icons/wix_icon.png",
  "LinkedIn": "./assets/icons/linkedin_icon.png",
  "Spotify": "./assets/icons/spotify_icon.png", // New example icon
  "YouTube": "./assets/icons/youtube_icon.png" // New example icon
};

// Function to create hotspots
function createHotspot(label, position, link, image) {
  const hotspot = document.createElement("div");
  hotspot.classList.add("hotspot");
  hotspot.style.left = `${position.x * 100}px`; // Position in 3D space
  hotspot.style.top = `${position.y * 100}px`;  // Position in 3D space

  const img = document.createElement("img");
  img.src = image; // Set the icon image

  const text = document.createElement("span");
  text.innerText = label;

  hotspot.appendChild(img);
  hotspot.appendChild(text);

  // Open the link when hotspot is clicked
  hotspot.addEventListener("click", () => {
    window.open(link, "_blank");
  });

  return hotspot;
}

// Function to start AR session
function startARSession() {
  const arPage = document.querySelector(".ar-page");
  arPage.style.display = "block"; // Show AR page

  const hotspotsContainer = document.getElementById("hotspots-container");
  hotspots.forEach(spot => {
    const hotspot = createHotspot(spot.label, spot.position, spot.link, imageMap[spot.label]);
    hotspotsContainer.appendChild(hotspot);
  });
}

