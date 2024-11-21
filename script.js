import * as THREE from "https://unpkg.com/three@0.126.0/build/three.module.js";
import { ARButton } from "https://unpkg.com/three@0.126.0/examples/jsm/webxr/ARButton.js";

let scene, camera, renderer;

function startAR() {
    // Initialize the renderer
    renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.xr.enabled = true;
    document.body.appendChild(renderer.domElement);

    // Add the AR button
    document.body.appendChild(ARButton.createButton(renderer));

    // Initialize the scene and camera
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 100);
    scene.add(camera);

    // Add lighting
    const light = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 1);
    scene.add(light);

    // Add the business card (a simple plane)
    const cardGeometry = new THREE.PlaneGeometry(0.2, 0.1); // 20cm x 10cm
    const cardMaterial = new THREE.MeshBasicMaterial({
        color: 0x4CAF50,
        side: THREE.DoubleSide,
    });
    const businessCard = new THREE.Mesh(cardGeometry, cardMaterial);
    businessCard.position.set(0, 0, -0.5); // Place the card 50cm in front of the user
    scene.add(businessCard);

    // Animation loop
    renderer.setAnimationLoop(() => {
        renderer.render(scene, camera);
    });
}

// Start AR immediately when the page loads
startAR();

