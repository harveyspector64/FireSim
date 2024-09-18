// Get the canvas and context
const canvas = document.getElementById('fireCanvas');
const ctx = canvas.getContext('2d');

// Set canvas size to window size
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resizeCanvas();

// Handle window resize
window.addEventListener('resize', resizeCanvas);

// Particle array
let particles = [];

// Mouse/touch interaction coordinates
let interactX = canvas.width / 2;
let interactY = canvas.height;

// Detecting user interaction
let isInteracting = false;

// Particle constructor
function Particle(x, y) {
    this.x = x;
    this.y = y;
    this.speedX = (Math.random() - 0.5) * 1;
    this.speedY = -Math.random() * 3 - 1;
    this.size = Math.random() * 5 + 2;
    this.life = Math.random() * 30 + 30;
}

// Update particle position and properties
Particle.prototype.update = function() {
    // Apply interaction force
    if (isInteracting) {
        const dx = this.x - interactX;
        const dy = this.y - interactY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 100) {
            const angle = Math.atan2(dy, dx);
            const force = (100 - dist) / 100;
            this.speedX += Math.cos(angle) * force;
            this.speedY += Math.sin(angle) * force;
        }
    }

    // Update position
    this.x += this.speedX;
    this.y += this.speedY;

    // Apply gravity
    this.speedY += 0.05;

    // Reduce life
    this.life--;

    // Shrink size
    if (this.size > 0.2) this.size -= 0.05;
};

// Draw particle
Particle.prototype.draw = function() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);

    // Set color based on life
    const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size);
    gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
    gradient.addColorStop(0.1, 'rgba(255, 226, 89, 1)');
    gradient.addColorStop(0.4, 'rgba(255, 161, 0, 1)');
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = gradient;

    ctx.fill();
};

// Create particles at the bottom of the screen
function createParticles() {
    for (let i = 0; i < 5; i++) {
        const x = interactX + (Math.random() - 0.5) * 50;
        const y = canvas.height + 10;
        particles.push(new Particle(x, y));
    }
}

// Animate particles
function animate() {
    // Clear canvas
    ctx.globalCompositeOperation = 'source-over';
    ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Change composite mode for glowing effect
    ctx.globalCompositeOperation = 'lighter';

    // Update and draw particles
    particles.forEach((particle, index) => {
        particle.update();
        particle.draw();

        // Remove particles that are dead
        if (particle.life <= 0 || particle.size <= 0) {
            particles.splice(index, 1);
        }
    });

    // Create new particles
    createParticles();

    requestAnimationFrame(animate);
}

// Handle mouse movement
canvas.addEventListener('mousemove', function(event) {
    interactX = event.clientX;
    interactY = event.clientY;
    isInteracting = true;
});

// Handle touch movement
canvas.addEventListener('touchmove', function(event) {
    const touch = event.touches[0];
    interactX = touch.clientX;
    interactY = touch.clientY;
    isInteracting = true;
});

// Reset interaction when not moving
canvas.addEventListener('mouseleave', function() {
    isInteracting = false;
});
canvas.addEventListener('touchend', function() {
    isInteracting = false;
});

// Start animation
animate();
