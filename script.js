let firePixels = [];
const fireWidth = 80;
const fireHeight = 60;
let intensity = 50;

const canvas = document.getElementById('fireCanvas');
const ctx = canvas.getContext('2d');

// Resize canvas to fit the container
function resizeCanvas() {
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas();

// Initialize fire pixels
function initializeFire() {
    for (let i = 0; i < fireWidth * fireHeight; i++) {
        firePixels[i] = 0;
    }

    // Set the bottom row to max intensity
    for (let x = 0; x < fireWidth; x++) {
        firePixels[(fireHeight - 1) * fireWidth + x] = intensity;
    }
}

// Update fire intensity based on slider
const intensitySlider = document.getElementById('intensity');
intensitySlider.addEventListener('input', (e) => {
    intensity = Math.floor(e.target.value);
    initializeFire();
});

// Calculate fire propagation
function calculateFirePropagation() {
    for (let y = 0; y < fireHeight; y++) {
        for (let x = 0; x < fireWidth; x++) {
            updateFireIntensity(x, y);
        }
    }
}

// Update the intensity of each pixel
function updateFireIntensity(x, y) {
    const src = y * fireWidth + x;
    if (y === 0) return; // Skip the top row

    const decay = Math.floor(Math.random() * 3);
    const below = (y - 1) * fireWidth + x;
    const newIntensity = firePixels[below] - decay;
    firePixels[src] = newIntensity >= 0 ? newIntensity : 0;
}

// Render the fire on canvas
function renderFire() {
    const imageData = ctx.createImageData(fireWidth, fireHeight);
    for (let i = 0; i < firePixels.length; i++) {
        const color = fireColorsPalette[firePixels[i]];
        imageData.data[i * 4] = color.r;
        imageData.data[i * 4 + 1] = color.g;
        imageData.data[i * 4 + 2] = color.b;
        imageData.data[i * 4 + 3] = 255; // Alpha
    }

    // Scale the image to fit the canvas
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = fireWidth;
    tempCanvas.height = fireHeight;
    const tempCtx = tempCanvas.getContext('2d');
    tempCtx.putImageData(imageData, 0, 0);

    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(tempCanvas, 0, 0, canvas.width, canvas.height);
}

// Fire color palette
const fireColorsPalette = [
    { r: 7, g: 7, b: 7 },
    { r: 31, g: 7, b: 7 },
    { r: 47, g: 15, b: 7 },
    { r: 71, g: 15, b: 7 },
    { r: 87, g: 23, b: 7 },
    { r: 103, g: 31, b: 7 },
    { r: 119, g: 31, b: 7 },
    { r: 143, g: 39, b: 7 },
    { r: 159, g: 47, b: 7 },
    { r: 175, g: 63, b: 7 },
    { r: 191, g: 71, b: 7 },
    { r: 199, g: 71, b: 7 },
    { r: 223, g: 79, b: 7 },
    { r: 223, g: 87, b: 7 },
    { r: 223, g: 87, b: 7 },
    { r: 215, g: 95, b: 7 },
    { r: 215, g: 95, b: 7 },
    { r: 215, g: 103, b: 15 },
    { r: 207, g: 111, b: 15 },
    { r: 207, g: 119, b: 15 },
    { r: 207, g: 127, b: 15 },
    { r: 207, g: 135, b: 23 },
    { r: 199, g: 135, b: 23 },
    { r: 199, g: 143, b: 23 },
    { r: 199, g: 151, b: 31 },
    { r: 191, g: 159, b: 31 },
    { r: 191, g: 159, b: 31 },
    { r: 191, g: 167, b: 39 },
    { r: 191, g: 167, b: 39 },
    { r: 191, g: 175, b: 47 },
    { r: 183, g: 175, b: 47 },
    { r: 183, g: 183, b: 47 },
    { r: 183, g: 183, b: 55 },
    { r: 207, g: 207, b: 111 },
    { r: 223, g: 223, b: 159 },
    { r: 239, g: 239, b: 199 },
    { r: 255, g: 255, b: 255 },
];

// Animation loop
function animate() {
    calculateFirePropagation();
    renderFire();
    requestAnimationFrame(animate);
}

// Initialize and start animation
initializeFire();
animate();
