var canvas = document.getElementById("particleCanvas");
var ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

var particlesArray = [];
var particleCount = 150; // Decreased particle count for performance reasons
var maxParticleSize = 5;
var minDistance = 100; // Min distance to draw a line between particles

var mouse = {
  x: null,
  y: null,
};

window.addEventListener("mousemove", function (event) {
  mouse.x = event.x;
  mouse.y = event.y;
});

class Particle {
  constructor() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.size = Math.random() * maxParticleSize;
    this.speedX = Math.random() * 3 - 1.5;
    this.speedY = Math.random() * 3 - 1.5;
    this.color = 'white';
  }

  update() {
    this.x += this.speedX;
    this.y += this.speedY;

    if (this.size > 0.2) this.size -= 0.1;
  }

  draw() {
    ctx.fillStyle = this.color;
    ctx.strokeStyle = this.color;
    ctx.lineWidth = 2;

    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.closePath();

    ctx.fill();
    ctx.stroke();
  }
}

function createParticles() {
  for (var i = 0; i < particleCount; i++) {
    particlesArray.push(new Particle());
  }
}

createParticles();

function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (var i = 0; i < particlesArray.length; i++) {
    particlesArray[i].update();
    particlesArray[i].draw();

    if (mouse.x && mouse.y) {
      var dx = particlesArray[i].x - mouse.x;
      var dy = particlesArray[i].y - mouse.y;
      var dist = Math.sqrt(dx * dx + dy * dy);

      // The particles are attracted to the mouse instead of being repelled
      if (dist < 200) {
        particlesArray[i].x -= dx / 20;
        particlesArray[i].y -= dy / 20;
      }

      // Particles change color as they approach the mouse
      particlesArray[i].color = `hsl(${dist / 2}, 100%, 50%)`;
    }

    // Inter-particle lines
    for (var j = i; j < particlesArray.length; j++) {
      var dx = particlesArray[i].x - particlesArray[j].x;
      var dy = particlesArray[i].y - particlesArray[j].y;
      var dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < minDistance) {
        ctx.beginPath();
        ctx.strokeStyle = particlesArray[i].color;
        ctx.lineWidth = 0.2;
        ctx.moveTo(particlesArray[i].x, particlesArray[i].y);
        ctx.lineTo(particlesArray[j].x, particlesArray[j].y);
        ctx.stroke();
        ctx.closePath();
      }
    }

    if (
      particlesArray[i].size <= 0.2 ||
      particlesArray[i].x < 0 ||
      particlesArray[i].x > canvas.width ||
      particlesArray[i].y < 0 ||
      particlesArray[i].y > canvas.height
    ) {
      particlesArray.splice(i, 1);
      i--;
    }
  }

  if (particlesArray.length < particleCount) {
    particlesArray.push(new Particle());
  }

  requestAnimationFrame(animateParticles);
}

animateParticles();