const canvas = document.getElementById('background');
const ctx = canvas.getContext('2d');

// Set canvas size
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Ensure canvas is behind content
canvas.style.position = 'fixed';
canvas.style.top = '0';
canvas.style.left = '0';
canvas.style.zIndex = '-1';

// Array to hold cells and sites
let sites = [];
let cells = [];
let edges = [];

// Site constructor (center points of Voronoi cells)
class Site {
    constructor(x, y, speedX, speedY) {
        this.x = x;
        this.y = y;
        this.originalX = x;
        this.originalY = y;
        this.speedX = speedX;
        this.speedY = speedY;
    }

    // Update site position with subtle movement
    update(time) {
        // Very subtle oscillation around original position
        this.x = this.originalX + Math.sin(time * this.speedX) * 10;
        this.y = this.originalY + Math.cos(time * this.speedY) * 10;
    }
}

// Compute Voronoi cells using a simple algorithm
// Note: This is a simplified version. For production, use a library like d3-delaunay
function computeVoronoi() {
    edges = [];
    
    // Create a grid of points to check
    const gridStep =5; // Resolution of the Voronoi approximation
    
    // For each point in our grid
    for (let y = 0; y < canvas.height; y += gridStep) {
        for (let x = 0; x < canvas.width; x += gridStep) {
            // Find the closest site
            let minDist = Infinity;
            let closestSite = null;
            let secondClosestSite = null;
            let secondMinDist = Infinity;
            
            for (const site of sites) {
                const dist = Math.sqrt((x - site.x) ** 2 + (y - site.y) ** 2);
                
                if (dist < minDist) {
                    secondMinDist = minDist;
                    secondClosestSite = closestSite;
                    minDist = dist;
                    closestSite = site;
                } else if (dist < secondMinDist) {
                    secondMinDist = dist;
                    secondClosestSite = site;
                }
            }
            
            // If we're close to the boundary between cells
            const boundaryThreshold = 2;
            if (Math.abs(minDist - secondMinDist) < boundaryThreshold && closestSite && secondClosestSite) {
                // This is approximately on the edge between two cells
                edges.push({
                    x: x,
                    y: y,
                    dist: minDist
                });
            }
        }
    }
}

// Create sites
function createSites() {
    sites = [];
    // Balance between too few and too many cells
    const cellDensity = 0.005; // Cells per pixel
    const minCells = 8;
    const maxCells = 25;
    const numberOfSites = Math.min(maxCells, 
                                   Math.max(minCells, 
                                           Math.floor(canvas.width * canvas.height * cellDensity)));
    
    for (let i = 0; i < numberOfSites; i++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        
        // Very slow movement for subtle animation
        const speedX = 0.2 + Math.random() * 0.1;
        const speedY = 0.2 + Math.random() * 0.1;
        
        sites.push(new Site(x, y, speedX, speedY));
    }
}

// Draw the Voronoi diagram
function drawVoronoi() {
    // Draw edges
    for (const edge of edges) {
        // Vary opacity based on distance from cell center for subtle gradients
        const opacity = 0.2+ (edge.dist / 500) * 0.2;
        ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
        ctx.fillRect(edge.x, edge.y, 2,2);
    }
    
    // Occasionally add subtle highlights at site locations
    if (Math.random() > 0.95) {
        const site = sites[Math.floor(Math.random() * sites.length)];
        ctx.beginPath();
        ctx.arc(site.x, site.y, 2, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
        ctx.fill();
        
        // Add glow
        ctx.shadowBlur = 15;
        ctx.shadowColor = 'rgba(255, 255, 255, 0.3)';
        ctx.beginPath();
        ctx.arc(site.x, site.y, 3, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
        ctx.fill();
        ctx.shadowBlur = 0;
    }
}

// Animation loop
function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Current time for animation
    const time = Date.now() * 0.001;
    
    // Update sites
    for (const site of sites) {
        site.update(time);
    }
    
    // Recompute Voronoi every few frames for performance
    if (Math.floor(time * 20) % 2 === 0) {
        computeVoronoi();
    }
    
    // Draw the diagram
    drawVoronoi();
    
    requestAnimationFrame(animate);
}

// Handle window resize
window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    createSites();
    computeVoronoi();
});

// Initialize
createSites();
computeVoronoi();
animate();