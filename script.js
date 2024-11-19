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
  const sun = new THREE.Mesh(new THREE.SphereGeometry(0.5, 32, 32), sunMaterial);
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
    const planet = new THREE.Mesh(new THREE.SphereGeometry(0.1, 16, 16), planetMaterials[i]);
    planet.position.set((i + 1) * 1.5, 0, 0);
    planetOrbit.add(planet);
    solarSystem.add(planetOrbit);
    planets.push({ planet, orbit: planetOrbit });
  }

  // Add Flying Saucer
  const saucerMaterial = new THREE.MeshBasicMaterial({ color: 0x888888 });
  const saucer = new THREE.Mesh(new THREE.SphereGeometry(0.1, 16, 16), saucerMaterial);
  saucer.position.set(3, 0.5, 0);
  scene.add(saucer);

  // Interactive Card
  const cardMaterial = new THREE.MeshStandardMaterial({ color: 0x001f3f, side: THREE.DoubleSide });
  const card = new THREE.Mesh(new THREE.PlaneGeometry(1.5, 1), cardMaterial);
  card.position.set(0, 0.5, -1);
  scene.add(card);

  // Add text to card
  const loader = new THREE.FontLoader();
  loader.load('https://threejs.org/examples/fonts/helvetiker_regular.typeface.json', (font) => {
    const textGeometry = new THREE.TextGeometry('Brandon Montezuma', {
      font: font,
      size: 0.1,
      height: 0.01,
    });

    const textMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff });
    const textMesh = new THREE.Mesh(textGeometry, textMaterial);
    textMesh.position.set(-0.7, 0.3, 0.01);
    card.add(textMesh);
  });

  // Add tabs
  const tabNames = ['ArtStation', 'Website', 'GitHub', 'Contact'];
  const tabs = [];

  tabNames.forEach((name, i) => {
    const tab = new THREE.Mesh(
      new THREE.PlaneGeometry(0.5, 0.2),
      new THREE.MeshStandardMaterial({ color: 0x0066cc })
    );
    tab.position.set(-0.6 + i * 0.4, -0.2, 0.01);
    card.add(tab);

    loader.load('https://threejs.org/examples/fonts/helvetiker_regular.typeface.json', (font) => {
      const tabTextGeometry = new THREE.TextGeometry(name, {
        font: font,
        size: 0.05,
        height: 0.01,
      });
      const tabTextMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff });
      const tabText = new THREE.Mesh(tabTextGeometry, tabTextMaterial);
      tabText.position.set(-0.2, -0.05, 0.02);
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
    solarSystem.rotation.y += 0.002; // Rotate the solar system
    planets.forEach(({ planet, orbit }) => {
      orbit.rotation.y += 0.005; // Orbit the planet
      planet.rotation.y += 0.01; // Rotate the planet on its axis
    });

    saucer.rotation.y += 0.01; // Rotate the saucer
    saucer.position.x = Math.sin(Date.now() * 0.001) * 3; // Move saucer back and forth

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

