// Function to start AR when button is clicked
function startAR() {
    // Show the AR scene
    const arScene = document.querySelector('a-scene');
    arScene.style.display = 'block'; // Show AR scene
    document.getElementById('start-ar').style.display = 'none'; // Hide the Start AR button
}

// Particle.js configuration for background particles
particlesJS('particles-js', {
    particles: {
        number: { value: 80, density: { enable: true, value_area: 800 } },
        color: { value: '#ffffff' },
        shape: { type: 'circle', stroke: { width: 0, color: '#000000' } },
        opacity: { value: 0.5, random: true, anim: { enable: false, speed: 1, opacity_min: 0 } },
        size: { value: 3, random: true, anim: { enable: false, speed: 40, size_min: 0.1 } },
        line_linked: { enable: true, distance: 150, color: '#ffffff', opacity: 0.4, width: 1 },
        move: { enable: true, speed: 2, direction: 'none', random: false, straight: false, out_mode: 'out', bounce: false, attract: { enable: false, rotateX: 600, rotateY: 1200 } }
    },
    interactivity: {
        events: { onhover: { enable: true, mode: 'repulse' }, onclick: { enable: true, mode: 'push' } },
        modes: { repulse: { distance: 100, duration: 1 }, push: { particles_nb: 4 } }
    },
    retina_detect: true
});

