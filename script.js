import * as THREE from "https://unpkg.com/three@0.126.0/build/three.module.js";
import { ARButton } from "./js/ARButton.js";

let scene, camera, renderer;

// Start AR when the button is clicked
document.getElementById("startButton").addEventListener("click", () => {
    document.getElementById("startButton").style.display = "none"; // Hide the button
    startAR();
});

function startAR() {
    // Initialize renderer
    renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.xr.enabled = true;
    document.body.appendChild(renderer.domElement);

    // Add AR button
    document.body.appendChild(ARButton.createButton(renderer));

    // Initialize scene and camera
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 100);
    scene.add(camera);

    // Add lighting
    const light = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 1);
    scene.add(light);

    // Create the business card
    const cardGeometry = new THREE.PlaneGeometry(0.2, 0.1); // 20cm x 10cm
    const cardMaterial = new THREE.MeshBasicMaterial({
        color: 0x4CAF50,
        side: THREE.DoubleSide,
    });
    const businessCard = new THREE.Mesh(cardGeometry, cardMaterial);

    // Position the business card directly in front of the camera
    businessCard.position.set(0, 0, -0.5);
    scene.add(businessCard);

    // Animation loop
    renderer.setAnimationLoop(() => {
        renderer.render(scene, camera);
    });
}

