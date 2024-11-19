export function startApp(THREE, ARButton) {
  // Basic Three.js setup
  const container = document.getElementById('container');
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.xr.enabled = true;
  container.appendChild(renderer.domElement);

  // Add AR button
  document.body.appendChild(ARButton.createButton(renderer));

  // Lighting
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
  scene.add(ambientLight);

  const pointLight = new THREE.PointLight(0xffffff, 1);
  pointLight.position.set(5, 5, 5);
  scene.add(pointLight);

  // Add Solar System
  const solarSystem = new THREE.Object3D();
  scene.add(solarSystem);

  // Sun
  const sunMaterial = new THREE.MeshBasicMaterial({ color: 0xffcc00 });
  const sun = new THREE.Mesh(new THREE.SphereGeometry(0.2, 32, 32), sunMaterial); // Reduced size
  solarSystem.add(sun);

  // Planets
  const planets = [];
  const planetMaterials = [
    new THREE.MeshBasicMaterial({ color: 0x3366ff }), // Blue planet
    new THREE.MeshBasicMaterial({ color: 0x00cc44 }), // Green planet
    new THREE.MeshBasicMaterial({ color: 0xcc4400 }), // Red planet
  ];

  for (let i = 0; i < 3; i++) {
    const planetOrbit = new THREE.Object3D();
    const planet = new THREE.Mesh(new THREE.SphereGeometry(0.05, 16, 16), planetMaterials[i]); // Smaller planets
    planet.position.set((i + 1) * 0.5, 0, 0); // Spread planets closer to the sun
    planetOrbit.add(planet);
    solarSystem.add(planetOrbit);
    planets.push({ planet, orbit: planetOrbit });
  }

  // Add Flying Saucer
  const saucerMaterial = new THREE.MeshBasicMaterial({ color: 0x888888 });
  const saucer = new THREE.Mesh(new THREE.SphereGeometry(0.05, 16, 16), saucerMaterial); // Reduced size
  saucer.position.set(1, 0.2, 0);
  scene.add(saucer);

  // Interactive Card
  const cardMaterial = new THREE.MeshStandardMaterial({ color: 0x001f3f, side: THREE.DoubleSide });
  const card = new THREE.Mesh(new THREE.PlaneGeometry(0.8, 0.5), cardMaterial); // Smaller card
  card.position.set(0, 0.2, -1); // Lowered card position
  scene.add(card);

  // Add text to card
  const loader = new THREE.FontLoader();
  loader.load('https://threejs.org/examples/fonts/helvetiker_regular.typeface.json', (font) => {
    const textGeometry = new THREE.TextGeometry('Brandon Montezuma', {
      font: font,
      size: 0.05, // Smaller text
      height: 0.01,
    });

    const textMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff });
    const textMesh = new THREE.Mesh(textGeometry, textMaterial);
    textMesh.position.set(-0.35, 0.1, 0.01); // Adjust position on the card
    card.add(textMesh);
  });

  // Add tabs
  const tabNames = ['ArtStation', 'Website', 'GitHub', 'Contact'];
  const tabs = [];

  tabNames.forEach((name, i) => {
    const tab = new THREE.Mesh(
      new THREE.PlaneGeometry(0.3, 0.1), // Smaller tabs
      new THREE.MeshStandardMaterial({ color: 0x0066cc })
    );
    tab.position.set(-0.35 + i * 0.4, -0.15, 0.01);
    card.add(tab);

    loader.load('https://threejs.org/examples/fonts/helvetiker_regular.typeface.json', (font) => {
      const tabTextGeometry = new THREE.TextGeometry(name, {
        font: font,
        size: 0.03, // Smaller text for tabs
        height: 0.01,
      });
      const tabTextMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff });
      const tabText = new THREE.Mesh(tabTextGeometry, tabTextMaterial);
      tabText.position.set(-0.1, -0.03, 0.02);
      tab.add(tabText);
      tabs.push(tab);
    });
  });

  // Add background music
  const audio = new Audio('path/to/music.mp3'); // Replace with your music file
  audio.loop = true;
  audio.play();

  // Animation
  function animate() {
    solarSystem.rotation.y += 0.01; // Rotate the solar system
    planets.forEach(({ planet, orbit }) => {
      orbit.rotation.y += 0.02; // Orbit the planet
      planet.rotation.y += 0.03; // Rotate the planet on its axis
    });

    saucer.rotation.y += 0.02; // Rotate the saucer
    saucer.position.x = Math.sin(Date.now() * 0.001) * 0.8; // Move saucer back and forth

    renderer.render(scene, camera);
  }

  renderer.setAnimationLoop(animate);

  // Handle resizing
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
}

