var canvas = document.getElementById("particleCanvas");
var ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

var particlesArray = [];
var particleCount = 200; // Adjust particle count based on performance
var maxParticleSize = 5;
var minDistance = 100;

var mouse = {
  x: null,
  y: null,
};

window.addEventListener("mousemove", function (event) {
  mouse.x = event.x;
  mouse.y = event.y;
});

canvas.addEventListener("mouseout", function () {
  mouse.x = null;
  mouse.y = null;
});

canvas.addEventListener("click", function () {
  for (var i = 0; i < particlesArray.length; i++) {
    if (mouse.x && mouse.y) {
      var dx = particlesArray[i].x - mouse.x;
      var dy = particlesArray[i].y - mouse.y;

      particlesArray[i].speedX = dx / 20;
      particlesArray[i].speedY = dy / 20;
    }
  }
});

class Particle {
  constructor() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.size = Math.random() * 5 + 1;
    this.speedX = Math.random() * 3 - 1.5;
    this.speedY = Math.random() * 3 - 1.5;
    this.color = `hsl(${Math.random() * 360}, 100%, 50%)`;
  }

  update() {
    this.x += this.speedX;
    this.y += this.speedY;

    if (this.size > maxParticleSize) {
      this.size = 1;
    } else {
      this.size += 0.01;  // Adjust particle growth rate based on preference
    }
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

      if (dist < 200) {
        particlesArray[i].x -= dx / 20;
        particlesArray[i].y -= dy / 20;
      }

      particlesArray[i].color = `hsl(${dist / 2}, 100%, 50%)`;
    }

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
