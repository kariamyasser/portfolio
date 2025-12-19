/**
 * Star Particle System with Parallax Effect
 * Creates multiple layers of animated stars
 */

class StarParticleSystem {
  constructor() {
    this.layers = [
      {
        canvas: document.getElementById('stars-layer-1'),
        ctx: null,
        stars: [],
        count: 150,
        speed: 0.8,
        size: { min: 1, max: 3 },
        twinkleSpeed: 0.02,
        parallaxFactor: 1.2 // Fastest layer
      },
      {
        canvas: document.getElementById('stars-layer-2'),
        ctx: null,
        stars: [],
        count: 100,
        speed: 0.5,
        size: { min: 0.8, max: 2 },
        twinkleSpeed: 0.015,
        parallaxFactor: 0.8 // Medium layer
      },
      {
        canvas: document.getElementById('stars-layer-3'),
        ctx: null,
        stars: [],
        count: 80,
        speed: 0.3,
        size: { min: 0.5, max: 1.5 },
        twinkleSpeed: 0.01,
        parallaxFactor: 0.5 // Slowest layer
      }
    ];

    this.scrollX = 0;
    this.animationFrame = null;

    this.init();
  }

  init() {
    // Initialize each layer
    this.layers.forEach(layer => {
      if (!layer.canvas) {
        console.error('Canvas not found for star layer');
        return;
      }

      layer.ctx = layer.canvas.getContext('2d');
      this.resizeCanvas(layer);
      this.createStars(layer);
    });

    // Start animation
    this.animate();

    // Handle window resize
    window.addEventListener('resize', () => this.handleResize());
  }

  resizeCanvas(layer) {
    layer.canvas.width = window.innerWidth;
    layer.canvas.height = window.innerHeight;
  }

  createStars(layer) {
    layer.stars = [];
    for (let i = 0; i < layer.count; i++) {
      layer.stars.push(this.createStar(layer));
    }
  }

  createStar(layer) {
    return {
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      size: Math.random() * (layer.size.max - layer.size.min) + layer.size.min,
      opacity: Math.random() * 0.5 + 0.5,
      twinkleDirection: Math.random() > 0.5 ? 1 : -1,
      baseX: Math.random() * window.innerWidth, // Original X position
      velocityX: (Math.random() - 0.5) * layer.speed,
      velocityY: (Math.random() - 0.5) * layer.speed * 0.3
    };
  }

  updateScroll(scrollX) {
    this.scrollX = scrollX;
  }

  animate() {
    this.layers.forEach(layer => {
      this.updateLayer(layer);
      this.drawLayer(layer);
    });

    this.animationFrame = requestAnimationFrame(() => this.animate());
  }

  updateLayer(layer) {
    const scrollOffset = this.scrollX * layer.parallaxFactor;

    layer.stars.forEach(star => {
      // Horizontal movement (drift + parallax)
      star.x += star.velocityX;

      // Vertical movement (subtle drift)
      star.y += star.velocityY;

      // Twinkle effect
      star.opacity += star.twinkleDirection * layer.twinkleSpeed;
      if (star.opacity >= 1 || star.opacity <= 0.3) {
        star.twinkleDirection *= -1;
      }

      // Wrap around screen edges (with parallax offset)
      const effectiveX = star.x - scrollOffset;
      
      if (effectiveX > window.innerWidth + 50) {
        star.x = scrollOffset - 50;
      } else if (effectiveX < -50) {
        star.x = scrollOffset + window.innerWidth + 50;
      }

      if (star.y > window.innerHeight + 50) {
        star.y = -50;
      } else if (star.y < -50) {
        star.y = window.innerHeight + 50;
      }
    });
  }

  drawLayer(layer) {
    const ctx = layer.ctx;
    const scrollOffset = this.scrollX * layer.parallaxFactor;

    // Clear canvas
    ctx.clearRect(0, 0, layer.canvas.width, layer.canvas.height);

    // Draw stars
    layer.stars.forEach(star => {
      const x = star.x - scrollOffset;
      const y = star.y;

      // Only draw if visible on screen
      if (x >= -50 && x <= window.innerWidth + 50 && 
          y >= -50 && y <= window.innerHeight + 50) {
        
        ctx.beginPath();
        ctx.arc(x, y, star.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`;
        ctx.fill();

        // Add glow effect for larger stars
        if (star.size > 1.5) {
          ctx.beginPath();
          ctx.arc(x, y, star.size * 2, 0, Math.PI * 2);
          const gradient = ctx.createRadialGradient(x, y, 0, x, y, star.size * 2);
          gradient.addColorStop(0, `rgba(255, 255, 255, ${star.opacity * 0.3})`);
          gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
          ctx.fillStyle = gradient;
          ctx.fill();
        }
      }
    });
  }

  handleResize() {
    this.layers.forEach(layer => {
      this.resizeCanvas(layer);
      // Redistribute stars for new canvas size
      this.createStars(layer);
    });
  }

  destroy() {
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
    }
  }
}

// Initialize star system when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.starSystem = new StarParticleSystem();
  });
} else {
  window.starSystem = new StarParticleSystem();
}