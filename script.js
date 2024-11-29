// Register the shader for slow LED-like color transitions
AFRAME.registerShader('ledColor', {
  schema: {
    time: { type: 'time', is: 'uniform' },
  },
  vertexShader: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    precision mediump float;
    uniform float time;
    varying vec2 vUv;

    void main() {
      float slowTime = time * 0.001; // Slower transition
      float r = sin(slowTime) * 0.5 + 0.5;
      float g = sin(slowTime + 2.094) * 0.5 + 0.5;
      float b = sin(slowTime + 4.188) * 0.5 + 0.5;
      gl_FragColor = vec4(r, g, b, 1.0);
    }
  `
});

// Register the generate-bubbles component
AFRAME.registerComponent('generate-bubbles', {
  init: function () {
    const container = this.el; // The entity with this component
    const numBubbles = 50; // Total bubbles
    const bubbleRadius = 0.1; // Bubble size
    const area = 5; // Range for random positions

    for (let i = 0; i < numBubbles; i++) {
      const bubble = document.createElement('a-sphere');
      bubble.setAttribute('radius', bubbleRadius);
      bubble.setAttribute('material', 'shader: ledColor');
      bubble.setAttribute('position', {
        x: (Math.random() - 0.5) * area,
        y: (Math.random() - 0.5) * area,
        z: (Math.random() - 0.5) * area,
      });

      // Add animation for random movements
      bubble.setAttribute('animation', {
        property: 'position',
        to: {
          x: (Math.random() - 0.5) * area,
          y: (Math.random() - 0.5) * area,
          z: (Math.random() - 0.5) * area,
        },
        loop: true,
        dur: 4000 + Math.random() * 2000,
      });

      container.appendChild(bubble);
    }
  },
});

// Attach the component to the bubble-container
document.querySelector('#bubble-container').setAttribute('generate-bubbles', '');

