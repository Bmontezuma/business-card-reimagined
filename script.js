let scene, camera, renderer, card, particleSystem;

function startAR() {
  // Hide the intro section
  document.getElementById('intro').style.display = 'none';
  document.getElementById('ar-container').style.display = 'block';

  initARCard();
}

// Initialize Three.js for AR experience
function initARCard() {
  // Scene
  scene = new THREE.Scene();

  // Camera
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.set(0, 0, 5);

  // Renderer
  renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('ar-card'), alpha: true });
  renderer.setSize(window.innerWidth, window.innerHeight);

  // Card Background
  const cardGeometry = new THREE.PlaneGeometry(3, 2);
  const cardMaterial = new THREE.MeshStandardMaterial({
    color: 0x111111,
    transparent: true,
    opacity: 0.7,
    side: THREE.DoubleSide,
  });
  card = new THREE.Mesh(cardGeometry, cardMaterial);
  scene.add(card);

  // Add particle effects
  createParticles();

  // Lights
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
  const pointLight = new THREE.PointLight(0x00d4ff, 1, 100);
  pointLight.position.set(5, 5, 5);
  scene.add(ambientLight, pointLight);

  animate();
}

// Create particle effects
function createParticles() {
  const particleCount = 300;
  const particlesGeometry = new THREE.BufferGeometry();
  const particlesMaterial = new THREE.PointsMaterial({
    color: 0x00d4ff,
    size: 0.05,
    transparent: true,
  });

  const positions = [];
  for (let i = 0; i < particleCount; i++) {
    positions.push((Math.random() - 0.5) * 5);
    positions.push((Math.random() - 0.5) * 5);
    positions.push((Math.random() - 0.5) * 5);
  }

  particlesGeometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  particleSystem = new THREE.Points(particlesGeometry, particlesMaterial);
  scene.add(particleSystem);
}

// Animation loop
function animate() {
  requestAnimationFrame(animate);

  // Rotate particles for effect
  if (particleSystem) {
    particleSystem.rotation.y += 0.005;
  }

  renderer.render(scene, camera);
}

// Handle resizing
window.addEventListener('resize', () => {
  if (camera && renderer) {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  }
});

