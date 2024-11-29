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
      float slowTime = time * 0.002; // Slower transition
      float r = sin(slowTime) * 0.5 + 0.5;
      float g = sin(slowTime + 2.094) * 0.5 + 0.5;
      float b = sin(slowTime + 4.188) * 0.5 + 0.5;
      gl_FragColor = vec4(r, g, b, 1.0);
    }
  `
});

AFRAME.registerComponent('generate-bubbles', {
  init: function () {
    const container = this.el;
    const numBubbles = 50;
    const bubbleRadius = 0.1;
    const planeSize = 5;

    for (let i = 0; i < numBubbles; i++) {
      const bubble = document.createElement('a-sphere');
      bubble.setAttribute('class', 'bubble');
      bubble.setAttribute('radius', bubbleRadius);
      bubble.setAttribute('material', 'shader: ledColor');
      container.appendChild(bubble);

      bubble.setAttribute('position', {
        x: (Math.random() - 0.5) * planeSize,
        y: (Math.random() - 0.5) * planeSize,
        z: 0
      });

      const speedX = (Math.random() - 0.5) * 0.02;
      const speedY = (Math.random() - 0.5) * 0.02;

      bubble.setAttribute('animation__move', {
        property: 'position',
        dir: 'alternate',
        dur: 2000 + Math.random() * 2000,
        loop: true,
        to: `${bubble.object3D.position.x + speedX} ${bubble.object3D.position.y + speedY} 0`
      });
    }
  }
});

document.querySelector('#bubble-container').setAttribute('generate-bubbles', '');

