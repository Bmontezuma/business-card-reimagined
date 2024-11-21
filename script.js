// Initialize Three.js Scene
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.xr.enabled = true;

// Append renderer to body when AR session starts
document.getElementById('start-ar').addEventListener('click', () => {
    document.body.appendChild(renderer.domElement);
    document.getElementById('container').style.display = 'none';
    document.body.appendChild(ARButton.createButton(renderer));
    startAR();
});

// AR Content
function startAR() {
    // Add a floating card
    const cardGeometry = new THREE.PlaneGeometry(0.4, 0.2);
    const cardMaterial = new THREE.MeshBasicMaterial({ color: 0x5555ff });
    const card = new THREE.Mesh(cardGeometry, cardMaterial);
    scene.add(card);

    // Position the card in front of the camera
    card.position.set(0, 0, -1);

    // Render Loop
    renderer.setAnimationLoop(() => {
        renderer.render(scene, camera);
    });
}

