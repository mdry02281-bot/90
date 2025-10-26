// PromoHive Quantum Interactive JavaScript

class QuantumAnimations {
  constructor() {
    this.particles = [];
    this.neuralNodes = [];
    this.isInitialized = false;
    this.animationId = null;
  }

  // Initialize quantum animations
  init() {
    if (this.isInitialized) return;
    
    this.createQuantumParticles();
    this.createNeuralNetwork();
    this.setupQuantumEffects();
    this.startAnimationLoop();
    
    this.isInitialized = true;
  }

  // Create quantum particles
  createQuantumParticles() {
    const containers = document.querySelectorAll('.quantum-particles');
    
    containers.forEach(container => {
      const particleCount = parseInt(container.getAttribute('data-particles') || '20');
      
      for (let i = 0; i < particleCount; i++) {
        const particle = this.createParticle(container);
        this.particles.push(particle);
      }
    });
  }

  // Create individual particle
  createParticle(container) {
    const particle = document.createElement('div');
    particle.className = 'quantum-particle';
    
    // Random properties
    particle.style.left = Math.random() * 100 + '%';
    particle.style.animationDelay = Math.random() * 8 + 's';
    particle.style.animationDuration = (Math.random() * 4 + 4) + 's';
    
    // Random color
    const colors = ['#00d4ff', '#ff0080', '#00ff88', '#ffaa00'];
    particle.style.background = colors[Math.floor(Math.random() * colors.length)];
    
    container.appendChild(particle);
    
    return {
      element: particle,
      container: container,
      x: Math.random() * container.offsetWidth,
      y: container.offsetHeight,
      vx: (Math.random() - 0.5) * 2,
      vy: -Math.random() * 2 - 1,
      life: 1
    };
  }

  // Create neural network
  createNeuralNetwork() {
    const containers = document.querySelectorAll('.neural-network');
    
    containers.forEach(container => {
      const nodeCount = parseInt(container.getAttribute('data-nodes') || '10');
      
      for (let i = 0; i < nodeCount; i++) {
        const node = this.createNeuralNode(container);
        this.neuralNodes.push(node);
      }
    });
  }

  // Create neural node
  createNeuralNode(container) {
    const node = document.createElement('div');
    node.className = 'neural-node';
    
    // Random position
    node.style.left = Math.random() * 100 + '%';
    node.style.top = Math.random() * 100 + '%';
    
    // Random animation delay
    node.style.animationDelay = Math.random() * 2 + 's';
    
    container.appendChild(node);
    
    return {
      element: node,
      container: container,
      x: Math.random() * container.offsetWidth,
      y: Math.random() * container.offsetHeight,
      connections: []
    };
  }

  // Setup quantum effects
  setupQuantumEffects() {
    // Quantum entanglement effect
    this.setupQuantumEntanglement();
    
    // Holographic projection effect
    this.setupHolographicProjection();
    
    // Cyberpunk grid effect
    this.setupCyberpunkGrid();
    
    // Quantum tunneling effect
    this.setupQuantumTunneling();
  }

  // Setup quantum entanglement
  setupQuantumEntanglement() {
    const elements = document.querySelectorAll('.quantum-entangled');
    
    elements.forEach(element => {
      element.addEventListener('mouseenter', () => {
        element.classList.add('quantum-entangled-active');
      });
      
      element.addEventListener('mouseleave', () => {
        element.classList.remove('quantum-entangled-active');
      });
    });
  }

  // Setup holographic projection
  setupHolographicProjection() {
    const elements = document.querySelectorAll('.holographic-projection');
    
    elements.forEach(element => {
      element.addEventListener('mousemove', (e) => {
        const rect = element.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width;
        const y = (e.clientY - rect.top) / rect.height;
        
        element.style.setProperty('--mouse-x', x);
        element.style.setProperty('--mouse-y', y);
      });
    });
  }

  // Setup cyberpunk grid
  setupCyberpunkGrid() {
    const elements = document.querySelectorAll('.cyberpunk-grid');
    
    elements.forEach(element => {
      element.addEventListener('mouseenter', () => {
        element.classList.add('cyberpunk-grid-active');
      });
      
      element.addEventListener('mouseleave', () => {
        element.classList.remove('cyberpunk-grid-active');
      });
    });
  }

  // Setup quantum tunneling
  setupQuantumTunneling() {
    const elements = document.querySelectorAll('.quantum-tunnel');
    
    elements.forEach(element => {
      element.addEventListener('click', () => {
        element.classList.add('quantum-tunnel-active');
        
        setTimeout(() => {
          element.classList.remove('quantum-tunnel-active');
        }, 1000);
      });
    });
  }

  // Start animation loop
  startAnimationLoop() {
    const animate = () => {
      this.updateParticles();
      this.updateNeuralNetwork();
      this.updateQuantumEffects();
      
      this.animationId = requestAnimationFrame(animate);
    };
    
    animate();
  }

  // Update particles
  updateParticles() {
    this.particles.forEach(particle => {
      // Update position
      particle.x += particle.vx;
      particle.y += particle.vy;
      
      // Update life
      particle.life -= 0.01;
      
      // Reset if dead
      if (particle.life <= 0) {
        particle.x = Math.random() * particle.container.offsetWidth;
        particle.y = particle.container.offsetHeight;
        particle.life = 1;
        particle.vx = (Math.random() - 0.5) * 2;
        particle.vy = -Math.random() * 2 - 1;
      }
      
      // Update element
      particle.element.style.left = particle.x + 'px';
      particle.element.style.top = particle.y + 'px';
      particle.element.style.opacity = particle.life;
    });
  }

  // Update neural network
  updateNeuralNetwork() {
    this.neuralNodes.forEach(node => {
      // Random movement
      node.x += (Math.random() - 0.5) * 0.5;
      node.y += (Math.random() - 0.5) * 0.5;
      
      // Keep within bounds
      node.x = Math.max(0, Math.min(node.x, node.container.offsetWidth));
      node.y = Math.max(0, Math.min(node.y, node.container.offsetHeight));
      
      // Update element
      node.element.style.left = node.x + 'px';
      node.element.style.top = node.y + 'px';
    });
  }

  // Update quantum effects
  updateQuantumEffects() {
    // Update holographic text
    const holographicTexts = document.querySelectorAll('.holographic-text');
    holographicTexts.forEach(text => {
      const time = Date.now() * 0.001;
      text.style.setProperty('--time', time);
    });
    
    // Update quantum interface
    const quantumInterfaces = document.querySelectorAll('.quantum-interface');
    quantumInterfaces.forEach(element => {
      const time = Date.now() * 0.001;
      element.style.setProperty('--time', time);
    });
  }

  // Create quantum ripple effect
  createQuantumRipple(element, event) {
    const ripple = document.createElement('div');
    ripple.className = 'quantum-ripple';
    
    const rect = element.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;
    
    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';
    
    element.appendChild(ripple);
    
    setTimeout(() => {
      ripple.remove();
    }, 1000);
  }

  // Create quantum explosion effect
  createQuantumExplosion(element) {
    const explosion = document.createElement('div');
    explosion.className = 'quantum-explosion';
    
    element.appendChild(explosion);
    
    setTimeout(() => {
      explosion.remove();
    }, 2000);
  }

  // Create quantum tunnel effect
  createQuantumTunnel(element) {
    const tunnel = document.createElement('div');
    tunnel.className = 'quantum-tunnel-effect';
    
    element.appendChild(tunnel);
    
    setTimeout(() => {
      tunnel.remove();
    }, 3000);
  }

  // Destroy quantum animations
  destroy() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
    
    this.particles.forEach(particle => {
      particle.element.remove();
    });
    
    this.neuralNodes.forEach(node => {
      node.element.remove();
    });
    
    this.particles = [];
    this.neuralNodes = [];
    this.isInitialized = false;
  }
}

// Initialize quantum animations
const quantumAnimations = new QuantumAnimations();

// Initialize on DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    quantumAnimations.init();
  });
} else {
  quantumAnimations.init();
}

// Export for use in components
window.QuantumAnimations = quantumAnimations;
