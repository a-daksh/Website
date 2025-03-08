const canvas = document.getElementById('background');
const ctx = canvas.getContext('2d');

// Set canvas size
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Arrays to hold points and connections
let points = [];
let connections = [];

// Point object constructor
class Point {
    constructor(x, y, size, speedX, speedY) {
        this.x = x;
        this.y = y;
        this.originalX = x; // Store original position for subtle oscillation
        this.originalY = y;
        this.size = size;
        this.speedX = speedX;
        this.speedY = speedY;
        this.twinklePhase = Math.random() * Math.PI * 2; // Random starting phase
        this.twinkleSpeed = 0.03 + Math.random() * 0.03; // Random twinkle speed
        this.connectionRadius = 150; // How far points can connect
    }

    // Draw a point
    draw() {
        // Calculate twinkle effect
        this.twinklePhase += this.twinkleSpeed;
        const twinkleAmount = Math.sin(this.twinklePhase) * 0.5 + 0.5; // Oscillate between 0 and 1
        
        // Draw point with varying opacity based on twinkle
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${0.2 + (twinkleAmount * 0.5)})`; // Opacity varies from 0.2 to 0.7
        ctx.fill();
        
        // Occasional subtle glow on some points
        if (twinkleAmount > 0.8) {
            ctx.shadowBlur = 10 * twinkleAmount;
            ctx.shadowColor = "rgba(255, 255, 255, 0.5)";
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size * 1.2, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 255, 255, ${0.1 * twinkleAmount})`; 
            ctx.fill();
            ctx.shadowBlur = 0;
        }
    }

    // Update point position with subtle movement
    update() {
        // Very subtle oscillation around original position
        const time = Date.now() * 0.001; // Current time in seconds
        this.x = this.originalX + Math.sin(time * this.speedX) * 1;
        this.y = this.originalY + Math.cos(time * this.speedY) * 1;
        
        // Draw the updated point
        this.draw();
        
        // Find and store connections
        connections = [];
        for (let i = 0; i < points.length; i++) {
            const otherPoint = points[i];
            if (otherPoint === this) continue;
            
            const distance = Math.hypot(this.x - otherPoint.x, this.y - otherPoint.y);
            if (distance < this.connectionRadius) {
                // Store connection data for drawing later
                connections.push({
                    pointA: this,
                    pointB: otherPoint,
                    opacity: 1 - (distance / this.connectionRadius) // Fade with distance
                });
            }
        }
    }
}

// Function to draw connections between points
function drawConnections() {
    for (const connection of connections) {
        ctx.beginPath();
        ctx.moveTo(connection.pointA.x, connection.pointA.y);
        ctx.lineTo(connection.pointB.x, connection.pointB.y);
        ctx.strokeStyle = `rgba(255, 255, 255, ${connection.opacity * 0.2})`; // Very subtle lines
        ctx.lineWidth = 0.3;
        ctx.stroke();
    }
}

// Create multiple points
function createPoints() {
    points = [];
    // Calculate number of points based on screen size (more for larger screens)
    const density = 0.00005; // Points per pixel
    const minPoints = 15;
    const maxPoints = 40;
    const numberOfPoints = Math.min(maxPoints, 
                                  Math.max(minPoints, 
                                           Math.floor(canvas.width * canvas.height * density)));
    
    for (let i = 0; i < numberOfPoints; i++) {
        const size = Math.random() * 1.5 + 0.5; // Size between 0.5 and 2
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        
        // Very slow movement for subtle animation
        const speedX = 0.1 + Math.random() * 0.2; // Oscillation speed factors
        const speedY = 0.1 + Math.random() * 0.2;

        points.push(new Point(x, y, size, speedX, speedY));
    }
}

// Animation loop
function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas

    // Update and draw each point
    points.forEach((point) => point.update());
    
    // Draw connections between points (after points are updated)
    drawConnections();

    requestAnimationFrame(animate); // Request next frame
}

// Adjust canvas size on window resize
window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    createPoints(); // Recreate points to fit new dimensions
});

// Initialize animation
createPoints();
animate();