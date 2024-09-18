// script.js

// Get canvas and context
const canvas = document.getElementById('fireCanvas');
const ctx = canvas.getContext('2d');

// Variables for fire grid dimensions
let fireWidth = 300;
let fireHeight = 200;

// Fire properties
let fireIntensity = 25; // Initial intensity (0-50)

// Display current intensity
const intensitySlider = document.getElementById('intensity');
const intensityValue = document.getElementById('intensityValue');
intensityValue.textContent = fireIntensity;

// Create a pixel array initialized to 0
let firePixels = new Array(fireWidth * fireHeight).fill(0);

// Expanded color palette for fire (0-50)
const fireColors = [
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
  // Additional colors for higher intensities
  { r: 255, g: 200, b: 0 },
  { r: 255, g: 220, b: 0 },
  { r: 255, g: 240, b: 0 },
  { r: 255, g: 255, b: 0 },
  { r: 255, g: 255, b: 100 },
  { r: 255, g: 255, b: 150 },
  { r: 255, g: 255, b: 200 },
  { r: 255, g: 255, b: 250 },
  { r: 255, g: 255, b: 255 },
  { r: 255, g: 255, b: 255 }, // Extend as needed
];

// Ensure fireColors array is correctly defined
console.log(`fireColors length: ${fireColors.length}`);

// Initialize fire by setting the bottom row to fireIntensity
function initializeFire() {
  console.log('Initializing fire...');
  for (let x = 0; x < fireWidth; x++) {
    const index = (fireHeight - 1) * fireWidth + x;
    firePixels[index] = fireIntensity;
    // Debug: Log the initial intensity
    if (x === 0 || x === fireWidth - 1) {
      console.log(`firePixels[${index}] = ${firePixels[index]}`);
    }
  }
}

// Define wind parameters
let wind = 0; // Positive values for right wind, negative for left wind

// Fire propagation algorithm with wind effect
function propagateFire() {
  for (let y = 0; y < fireHeight - 1; y++) {
    for (let x = 0; x < fireWidth; x++) {
      const currentIndex = y * fireWidth + x;
      const belowIndex = (y + 1) * fireWidth + x;

      const decay = Math.floor(Math.random() * 4); // Random decay between 0-3
      let newIntensity = firePixels[belowIndex] - decay;

      // Apply wind effect
      let windShift = Math.floor(wind);
      let shiftedIndex = currentIndex + windShift;

      // Ensure shiftedIndex is within bounds
      if (shiftedIndex < y * fireWidth || shiftedIndex >= (y + 1) * fireWidth) {
        shiftedIndex = currentIndex;
      }

      // Ensure the new intensity is within bounds
      const clampedIntensity = newIntensity > 0 ? newIntensity : 0;

      // Update the shifted pixel with the new intensity
      firePixels[shiftedIndex] = clampedIntensity;

      // Debug: Log some updates
      if (y === 0 && (x === 0 || x === fireWidth - 1)) {
        console.log(`firePixels[${shiftedIndex}] updated to ${firePixels[shiftedIndex]}`);
      }
    }
  }

  // Optionally, vary wind over time for dynamic effects
  wind += (Math.random() - 0.5) * 0.05; // Slight random variation
  wind = Math.max(Math.min(wind, 1), -1); // Clamp wind between -1 and 1
}

// Render the fire to the canvas
function renderFire() {
  // Create ImageData object
  const imageData = ctx.createImageData(fireWidth, fireHeight);

  for (let i = 0; i < firePixels.length; i++) {
    const colorIndex = firePixels[i];

    // Ensure colorIndex is within the fireColors array
    if (colorIndex >= fireColors.length) {
      console.warn(`colorIndex ${colorIndex} out of bounds at firePixels[${i}]`);
      continue;
    }

    const color = fireColors[colorIndex] || { r: 0, g: 0, b: 0 };

    imageData.data[i * 4] = color.r;     // Red
    imageData.data[i * 4 + 1] = color.g; // Green
    imageData.data[i * 4 + 2] = color.b; // Blue
    imageData.data[i * 4 + 3] = 255;     // Alpha (fully opaque)
  }

  // Disable image smoothing to maintain pixelated look
  ctx.imageSmoothingEnabled = false;

  // Create a temporary canvas to hold the fire image
  const tempCanvas = document.createElement('canvas');
  tempCanvas.width = fireWidth;
  tempCanvas.height = fireHeight;
  const tempCtx = tempCanvas.getContext('2d');

  // Put the image data onto the temporary canvas
  tempCtx.putImageData(imageData, 0, 0);

  // Clear the main canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Calculate scaling factors to maintain aspect ratio
  const scaleX = canvas.width / fireWidth;
  const scaleY = canvas.height / fireHeight;
  const scale = Math.min(scaleX, scaleY) * 1.5; // Increased scale factor for larger flames

  // Calculate positioning to center the fire
  const offsetX = (canvas.width - fireWidth * scale) / 2;
  const offsetY = (canvas.height - fireHeight * scale) / 2;

  // Draw the temporary canvas onto the main canvas with scaling
  ctx.drawImage(
    tempCanvas,
    0,
    0,
    fireWidth,
    fireHeight,
    offsetX,
    offsetY,
    fireWidth * scale,
    fireHeight * scale
  );
}

// Animation loop
function animate() {
  propagateFire();
  renderFire();
  requestAnimationFrame(animate);
}

// Handle intensity changes
intensitySlider.addEventListener('input', (e) => {
  fireIntensity = parseInt(e.target.value, 10);
  intensityValue.textContent = fireIntensity;
  console.log(`Intensity changed to ${fireIntensity}`);
  initializeFire();
});

// Handle interactions (mouse and touch)
function addInteraction(x, y) {
  const canvasRect = canvas.getBoundingClientRect();
  const scaleX = fireWidth / canvasRect.width;
  const scaleY = fireHeight / canvasRect.height;

  const fireX = Math.floor((x - canvasRect.left) * scaleX);
  const fireY = Math.floor((y - canvasRect.top) * scaleY);
  const index = fireY * fireWidth + fireX;

  if (index >= 0 && index < firePixels.length) {
    // Inject heat for realistic interaction
    injectHeat(fireX, fireY, fireIntensity);
    // Debug: Log interaction
    console.log(`Interaction at (${fireX}, ${fireY}) - injected heat with intensity ${fireIntensity}`);
  }
}

// Function to inject heat into the fire grid
function injectHeat(x, y, intensity) {
  const spread = 5; // Increased spread for more natural heat distribution

  for (let dy = -spread; dy <= spread; dy++) {
    for (let dx = -spread; dx <= spread; dx++) {
      const newX = x + dx;
      const newY = y + dy;
      if (newX >= 0 && newX < fireWidth && newY >= 0 && newY < fireHeight) {
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance <= spread) { // Only affect pixels within the spread radius
          const factor = (spread - distance) / spread; // Heat diminishes with distance
          const index = newY * fireWidth + newX;
          // Increase intensity with a higher cap
          firePixels[index] = Math.min(firePixels[index] + Math.floor(intensity * factor * 2), fireColors.length - 1);
        }
      }
    }
  }

  // Create a visual ripple effect
  createRipple(x, y, spread);
}

// Function to create a ripple effect on the canvas
function createRipple(x, y, spread) {
  const rippleCanvas = document.createElement('canvas');
  rippleCanvas.width = fireWidth;
  rippleCanvas.height = fireHeight;
  const rippleCtx = rippleCanvas.getContext('2d');

  // Draw a semi-transparent white circle to simulate a ripple
  rippleCtx.fillStyle = `rgba(255, 255, 255, 0.3)`;
  rippleCtx.beginPath();
  rippleCtx.arc(x, y, spread, 0, Math.PI * 2);
  rippleCtx.fill();

  // Composite the ripple onto the firePixels array
  const imageData = rippleCtx.getImageData(0, 0, fireWidth, fireHeight).data;
  for (let i = 0; i < firePixels.length; i++) {
    const alpha = imageData[i * 4 + 3];
    if (alpha > 0) {
      // Enhance the intensity based on the ripple's alpha
      firePixels[i] = Math.min(firePixels[i] + Math.floor(alpha / 255 * 5), fireColors.length - 1);
    }
  }
}

// Fullscreen toggle functionality
const fullscreenBtn = document.getElementById('fullscreenBtn');
fullscreenBtn.addEventListener('click', () => {
  if (!document.fullscreenElement) {
    canvas.requestFullscreen().catch(err => {
      console.error(`Error attempting to enable fullscreen mode: ${err.message}`);
    });
  } else {
    document.exitFullscreen();
  }
});

// Mouse events
canvas.addEventListener('mousedown', (e) => {
  addInteraction(e.clientX, e.clientY);
  canvas.addEventListener('mousemove', onMouseMove);
});
canvas.addEventListener('mouseup', () => {
  canvas.removeEventListener('mousemove', onMouseMove);
});
function onMouseMove(e) {
  addInteraction(e.clientX, e.clientY);
}

// Touch events for mobile
canvas.addEventListener('touchstart', (e) => {
  e.preventDefault();
  Array.from(e.touches).forEach(touch => {
    addInteraction(touch.clientX, touch.clientY);
  });
});
canvas.addEventListener('touchmove', (e) => {
  e.preventDefault();
  Array.from(e.touches).forEach(touch => {
    addInteraction(touch.clientX, touch.clientY);
  });
});

// Resize canvas and adjust fire grid
function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  console.log(`Canvas resized to ${canvas.width}x${canvas.height}`);

  // Dynamically adjust fire grid size based on canvas dimensions
  fireWidth = Math.floor(canvas.width / 4); // Adjust the divisor to change grid resolution
  fireHeight = Math.floor(canvas.height / 4);

  // Reinitialize fire pixels
  firePixels = new Array(fireWidth * fireHeight).fill(0);
  initializeFire();
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

// Initialize and start animation
initializeFire();
animate();
