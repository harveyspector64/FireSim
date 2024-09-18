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

// Fire intensity (0 to 100)
let fireIntensity = 50;

// Slider element
const intensitySlider = document.getElementById('intensitySlider');

// Update fireIntensity when slider changes
intensitySlider.addEventListener('input', function() {
    fireIntensity = parseInt(this.value);
});

// For mobile, track touch position to adjust intensity
let isTouching = false;
let startY = 0;
let currentY = 0;

canvas.addEventListener('touchstart', function(event) {
    isTouching = true;
    startY = event.touches[0].clientY;
});

canvas.addEventListener('touchmove', function(event) {
    if (isTouching) {
        currentY = event.touches[0].clientY;
        // Calculate the difference
        const deltaY = startY - currentY;
        // Adjust fireIntensity based on deltaY
        fireIntensity += deltaY * 0.1; // Adjust sensitivity as needed
        fireIntensity = Math.max(0, Math.min(100, fireIntensity));
        startY = currentY; // Reset startY for the next move
    }
});

canvas.addEventListener('touchend', function() {
    isTouching = false;
});

// Particle constructor
function Particle(x, y) {
    this.x = x;
    this.y = y;
    const intensityFactor = fireIntensity / 100;
    this.speedX = (Math.random() - 0.5) * 1;
    this.speedY = -Math.random() * (2 + 3 * intensityFactor) - 1;
    this.size = Math.random() * (3 + 5 * intensityFactor) + 2;
    this.life = Math.random() * 30 + 30;
}

// Update particle position and properties
Particle.prototype.update = function() {
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
    const numParticles = Math.floor(fireIntensity / 2); // Adjust number of particles based on intensity
    for (let i = 0; i < numParticles; i++) {
        const x = Math.random() * canvas.width;
        const y = canvas.height - 10;
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
    if (fireIntensity > 0) {
        createParticles();
    }

    requestAnimationFrame(animate);
}

// Start animation
animate();
