import * as THREE from "https://unpkg.com/three@0.126.0/build/three.module.js";
import { ARButton } from "https://unpkg.com/three@0.126.0/examples/jsm/webxr/ARButton.js";

let scene, camera, renderer;

// Start AR session when the button is clicked
document.getElementById("startButton").addEventListener("click", () => {
    document.getElementById("startButton").style.display = "none"; // Hide the button
    startAR();
});

function startAR() {
    // Initialize Renderer
    renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.xr.enabled = true;
    document.body.appendChild(renderer.domElement);

    // Add ARButton for AR session
    document.body.appendChild(ARButton.createButton(renderer));

    // Initialize Scene and Camera
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 100);
    scene.add(camera);

    // Add Lighting
    const light = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 1);
    scene.add(light);

    // Add Business Card (a simple plane)
    const cardGeometry = new THREE.PlaneGeometry(0.2, 0.1); // 20cm x 10cm
    const cardMaterial = new THREE.MeshBasicMaterial({
        color: 0x4CAF50,
        side: THREE.DoubleSide,
    });
    const businessCard = new THREE.Mesh(cardGeometry, cardMaterial);
    businessCard.position.set(0, 0, -0.5); // Place the card 0.5 meters in front of the camera
    scene.add(businessCard);

    // Animation Loop
    renderer.setAnimationLoop(() => {
        renderer.render(scene, camera);
    });
}

