const canvas = document.getElementById('background');
const ctx = canvas.getContext('2d');

// Set canvas size
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Array to hold hexagons
let hexagons = [];

// Hexagon object constructor
class Hexagon {
    constructor(x, y, size, speedX, speedY, opacity, glow) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.speedX = speedX;
        this.speedY = speedY;
        this.opacity = opacity;
        this.glow = glow;
        this.glowIntensity = Math.random() * 5 + 3; // Random glow intensity
        this.glowPhase = Math.random() * Math.PI * 2; // Random starting phase
        this.glowSpeed = 0.02; // How fast the glow pulses
    }

    // Draw a hexagon
    draw() {
        // Update glow effect for selected hexagons
        if (this.glow) {
            this.glowPhase += this.glowSpeed;
            const glowAmount = Math.sin(this.glowPhase) * 0.2 + 0.8; // Oscillate between 0.6 and 1.0
            
            // Add glow effect
            ctx.shadowBlur = this.glowIntensity * glowAmount;
            ctx.shadowColor = `rgba(255, 255, 255, ${this.opacity * 0.7})`;
        } else {
            ctx.shadowBlur = 0;
        }

        ctx.beginPath();
        const sides = 6;
        for (let i = 0; i < sides; i++) {
            const angle = (Math.PI * 2 / sides) * i;
            const xOffset = this.x + this.size * Math.cos(angle);
            const yOffset = this.y + this.size * Math.sin(angle);
            if (i === 0) {
                ctx.moveTo(xOffset, yOffset);
            } else {
                ctx.lineTo(xOffset, yOffset);
            }
        }
        ctx.closePath();
        
        // Varying opacity levels
        ctx.strokeStyle = `rgba(255, 255, 255, ${this.opacity})`; 
        ctx.lineWidth = 1.5;
        ctx.stroke();
        
        // Reset shadow
        ctx.shadowBlur = 0;
    }

    // Update hexagon position
    update() {
        // Slower, more subtle movement
        this.x += this.speedX;
        this.y += this.speedY;

        // Reset position if it goes out of bounds
        if (this.x > canvas.width + this.size) this.x = -this.size;
        if (this.x < -this.size) this.x = canvas.width + this.size;
        if (this.y > canvas.height + this.size) this.y = -this.size;
        if (this.y < -this.size) this.y = canvas.height + this.size;

        // Draw the updated hexagon
        this.draw();
    }
}

// Create multiple hexagons
function createHexagons() {
    hexagons = [];
    const numberOfHexagons = 15; // Slightly more hexagons for depth effect
    
    for (let i = 0; i < numberOfHexagons; i++) {
        const size = Math.random() * (80 - 20) + 20; // Random size between 20 and 80
        const x = Math.random() * canvas.width; // Random x position
        const y = Math.random() * canvas.height; // Random y position
        
        // Slower movement - reduced speed by 60%
        const speedX = (Math.random() - 0.5) * 0.2; 
        const speedY = (Math.random() - 0.5) * 0.2;
        
        // Varying opacity for depth effect
        const opacity = Math.random() * 0.3 + 0.1; // Between 0.1 and 0.4
        
        // Only some hexagons get the glow effect
        const glow = Math.random() > 0.7; // ~30% of hexagons get glow effect
        
        hexagons.push(new Hexagon(x, y, size, speedX, speedY, opacity, glow));
    }
}

// Animation loop
function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas

    // Update and draw each hexagon
    hexagons.forEach((hexagon) => hexagon.update());

    requestAnimationFrame(animate); // Request next frame
}

// Adjust canvas size on window resize
window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    createHexagons(); // Recreate hexagons to fit new dimensions
});

// Initialize animation
createHexagons();
animate();