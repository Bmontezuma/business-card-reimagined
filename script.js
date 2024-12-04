
// Particle System
const container = document.getElementById('particle-container');
const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');
container.appendChild(canvas);

let bubbles = [];
const colors = [
  '#ff6f61', '#6fffb3', '#61a6ff', '#f4ff61', '#a661ff', '#ff61a6', 
  '#ffa500', '#40e0d0', '#ff6347', '#7b68ee', '#00fa9a', '#ba55d3', 
  '#f08080', '#4682b4', '#ffd700', '#2e8b57', '#d2691e', '#dc143c', 
  '#4169e1', '#32cd32', '#8a2be2', '#ff4500', '#ff1493', '#1e90ff', 
  '#00ced1', '#adff2f', '#ffb6c1', '#6495ed', '#deb887', '#ff00ff'
];
let colorShift = 0;

// Responsive Canvas
function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// Bubble Object
class Bubble {
  constructor(x = Math.random() * canvas.width, y = Math.random() * canvas.height) {
    this.x = x;
    this.y = y;
    this.radius = Math.random() * 10 + 5;
    this.speedX = Math.random() * 2 - 1;
    this.speedY = Math.random() * 2 - 1;
    this.color = colors[Math.floor(Math.random() * colors.length)];
  }

  update(mouseX, mouseY) {
    this.x += this.speedX;
    this.y += this.speedY;
    if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
    if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;

    const dx = this.x - mouseX;
    const dy = this.y - mouseY;
    const distance = Math.sqrt(dx * dx + dy * dy);
    if (distance < 100) {
      const angle = Math.atan2(dy, dx);
      this.speedX += Math.cos(angle) * 0.5;
      this.speedY += Math.sin(angle) * 0.5;
    }

    colorShift += 0.00002;
    const hue = Math.sin(colorShift) * 360;
    this.color = `hsl(${hue}, 100%, 50%)`;
  }

  draw() {
    ctx.globalAlpha = 0.7;
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.closePath();
    ctx.fill();
  }
}

// Initialize Bubbles
function initBubbles(count = 100) {
  for (let i = 0; i < count; i++) {
    bubbles.push(new Bubble());
  }
}
initBubbles();

// Animate Bubbles
let mouseX = -500;
let mouseY = -500;
canvas.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
});

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  bubbles.forEach((bubble) => {
    bubble.update(mouseX, mouseY);
    bubble.draw();
  });
  requestAnimationFrame(animate);
}
animate();

// Start AR Function
function startAR() {
  window.location.href = 'ar.html';
}

