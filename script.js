import * as THREE from "https://unpkg.com/three@0.126.0/build/three.module.js";
import { GLTFLoader } from "https://unpkg.com/three@0.126.0/examples/jsm/loaders/GLTFLoader.js";

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
    document.getElementById("particles-js").style.display = "none"; // Hide particles
    document.querySelector(".container").style.display = "none"; // Hide main content
    startARSession();
  });
});

let raycaster = new THREE.Raycaster();
let pointer = new THREE.Vector2();
let clickableObjects = []; // To store clickable hotspots

async function startARSession() {
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.xr.enabled = true;
  document.body.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 10);
  const light = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 1);
  scene.add(light);

  // Load Business Card Model
  const loader = new GLTFLoader();
  loader.load("./assets/models/business-card.glb", (gltf) => {
    const card = gltf.scene;
    card.scale.set(0.1, 0.1, 0.1);
    card.position.set(0, 0, -1); // Place in front of the user
    scene.add(card);
  });

  // Add Hotspots
  const hotspots = [
    { label: "ArtStation", link: "https://www.artstation.com/brandonmontezuma6", position: new THREE.Vector3(-0.5, 0, -1) },
    { label: "GitHub", link: "https://github.com/Bmontezuma", position: new THREE.Vector3(0, 0, -1) },
    { label: "Instagram", link: "https://www.instagram.com/montezumashare/", position: new THREE.Vector3(0.5, 0, -1) },
    { label: "Email", link: "mailto:brandon.montezuma@yahoo.com", position: new THREE.Vector3(-0.5, -0.5, -1) },
    { label: "Wix", link: "https://brandonmontezuma.wixsite.com/brandon-montezuma-3", position: new THREE.Vector3(0, -0.5, -1) },
    { label: "LinkedIn", link: "https://www.linkedin.com/in/brandon-montezuma/", position: new THREE.Vector3(0.5, -0.5, -1) },
  ];

  const imageMap = {
    "ArtStation": "./assets/icons/4373281_artstation_logo_logos_icon.png",
    "GitHub": "./assets/icons/317712_code repository_github_repository_resource_icon.png",
    "Instagram": "./assets/icons/1298747_instagram_brand_logo_social media_icon.png",
    "Email": "./assets/icons/2613310_chat_email_messenger_social media_web service_icon.png",
    "Wix": "./assets/icons/8547120_wix_icon.png",
    "LinkedIn": "./assets/icons/5296501_linkedin_network_linkedin logo_icon.png"
  };

  hotspots.forEach((spot) => {
    const hotspot = createHotspot(
      spot.label,
      spot.position,
      spot.link,
      imageMap[spot.label] // Use the specific filename for each label
    );
    scene.add(hotspot);
  });

  const session = await navigator.xr.requestSession("immersive-ar", {
    requiredFeatures: ["local-floor"],
  });
  renderer.xr.setSession(session);

  renderer.setAnimationLoop(() => {
    renderer.render(scene, camera);
  });
}

// Create a hotspot with a clickable image
function createHotspot(label, position, link, imagePath) {
  const group = new THREE.Group();

  // Plane with the image for hotspot
  const textureLoader = new THREE.TextureLoader();
  const texture = textureLoader.load(imagePath); // Load the image
  const geometry = new THREE.PlaneGeometry(0.2, 0.2); // Plane size for the image
  const material = new THREE.MeshBasicMaterial({ map: texture, transparent: true });
  const plane = new THREE.Mesh(geometry, material);
  plane.userData = { link, label }; // Store link and label for interaction

  // Optional Label under the image
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  canvas.width = 256;
  canvas.height = 64;
  context.fillStyle = "black";
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.fillStyle = "white";
  context.font = "20px Arial";
  context.fillText(label, 10, 40);

  const labelTexture = new THREE.CanvasTexture(canvas);
  const labelMaterial = new THREE.SpriteMaterial({ map: labelTexture });
  const labelSprite = new THREE.Sprite(labelMaterial);
  labelSprite.scale.set(0.5, 0.125, 1);
  labelSprite.position.y = -0.15;

  group.add(plane, labelSprite);
  group.position.copy(position);

  clickableObjects.push(plane); // Add the plane to the clickable objects array

  return group;
}

// Detect pointer events
window.addEventListener("pointerdown", onPointerDown);

function onPointerDown(event) {
  // Convert the pointer position to normalized device coordinates
  pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
  pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;

  // Update the raycaster with the camera and pointer
  raycaster.setFromCamera(pointer, camera);

  // Check if any object is intersected
  const intersects = raycaster.intersectObjects(clickableObjects);

  if (intersects.length > 0) {
    const object = intersects[0].object;
    const { link, label } = object.userData;

    const infoBox = document.getElementById("info-box");
    infoBox.textContent = `Opening ${label}...`;
    infoBox.style.display = "block";
    setTimeout(() => {
      window.open(link, "_blank");
      infoBox.style.display = "none";
    }, 1000);
  }
}

