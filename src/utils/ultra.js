// PromoHive Ultra Advanced Interactive JavaScript

class UltraAnimations {
  constructor() {
    this.particles = [];
    this.neuralNodes = [];
    this.isInitialized = false;
    this.animationId = null;
    this.mousePosition = { x: 0, y: 0 };
    this.scrollPosition = 0;
  }

  // Initialize ultra animations
  init() {
    if (this.isInitialized) return;
    
    this.createUltraParticles();
    this.createUltraNeuralNetwork();
    this.setupUltraEffects();
    this.startUltraAnimationLoop();
    this.setupUltraEventListeners();
    
    this.isInitialized = true;
  }

  // Create ultra particles
  createUltraParticles() {
    const containers = document.querySelectorAll('.quantum-particles');
    
    containers.forEach(container => {
      const particleCount = parseInt(container.getAttribute('data-particles') || '30');
      
      for (let i = 0; i < particleCount; i++) {
        const particle = this.createUltraParticle(container);
        this.particles.push(particle);
      }
    });
  }

  // Create individual ultra particle
  createUltraParticle(container) {
    const particle = document.createElement('div');
    particle.className = 'quantum-particle';
    
    // Random properties
    particle.style.left = Math.random() * 100 + '%';
    particle.style.animationDelay = Math.random() * 8 + 's';
    particle.style.animationDuration = (Math.random() * 4 + 4) + 's';
    
    // Random color and size
    const colors = ['#00d4ff', '#ff0080', '#00ff88', '#ffaa00', '#ff00ff', '#00ffff'];
    const color = colors[Math.floor(Math.random() * colors.length)];
    particle.style.background = color;
    
    // Random size
    const size = Math.random() * 4 + 2;
    particle.style.width = size + 'px';
    particle.style.height = size + 'px';
    
    container.appendChild(particle);
    
    return {
      element: particle,
      container: container,
      x: Math.random() * container.offsetWidth,
      y: container.offsetHeight,
      vx: (Math.random() - 0.5) * 3,
      vy: -Math.random() * 3 - 1,
      life: 1,
      color: color,
      size: size
    };
  }

  // Create ultra neural network
  createUltraNeuralNetwork() {
    const containers = document.querySelectorAll('.neural-network');
    
    containers.forEach(container => {
      const nodeCount = parseInt(container.getAttribute('data-nodes') || '15');
      
      for (let i = 0; i < nodeCount; i++) {
        const node = this.createUltraNeuralNode(container);
        this.neuralNodes.push(node);
      }
    });
  }

  // Create ultra neural node
  createUltraNeuralNode(container) {
    const node = document.createElement('div');
    node.className = 'neural-node';
    
    // Random position
    node.style.left = Math.random() * 100 + '%';
    node.style.top = Math.random() * 100 + '%';
    
    // Random animation delay
    node.style.animationDelay = Math.random() * 2 + 's';
    
    // Random size
    const size = Math.random() * 6 + 4;
    node.style.width = size + 'px';
    node.style.height = size + 'px';
    
    container.appendChild(node);
    
    return {
      element: node,
      container: container,
      x: Math.random() * container.offsetWidth,
      y: Math.random() * container.offsetHeight,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      connections: [],
      size: size
    };
  }

  // Setup ultra effects
  setupUltraEffects() {
    // Ultra quantum entanglement effect
    this.setupUltraQuantumEntanglement();
    
    // Ultra holographic projection effect
    this.setupUltraHolographicProjection();
    
    // Ultra cyberpunk grid effect
    this.setupUltraCyberpunkGrid();
    
    // Ultra quantum tunneling effect
    this.setupUltraQuantumTunneling();
    
    // Ultra neural interface effect
    this.setupUltraNeuralInterface();
  }

  // Setup ultra quantum entanglement
  setupUltraQuantumEntanglement() {
    const elements = document.querySelectorAll('.quantum-entangled');
    
    elements.forEach(element => {
      element.addEventListener('mouseenter', () => {
        element.classList.add('quantum-entangled-active');
        this.createUltraQuantumRipple(element);
      });
      
      element.addEventListener('mouseleave', () => {
        element.classList.remove('quantum-entangled-active');
      });
      
      element.addEventListener('click', () => {
        this.createUltraQuantumExplosion(element);
      });
    });
  }

  // Setup ultra holographic projection
  setupUltraHolographicProjection() {
    const elements = document.querySelectorAll('.holographic-projection');
    
    elements.forEach(element => {
      element.addEventListener('mousemove', (e) => {
        const rect = element.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width;
        const y = (e.clientY - rect.top) / rect.height;
        
        element.style.setProperty('--mouse-x', x);
        element.style.setProperty('--mouse-y', y);
        
        // Create holographic particles
        this.createHolographicParticles(element, e.clientX, e.clientY);
      });
    });
  }

  // Setup ultra cyberpunk grid
  setupUltraCyberpunkGrid() {
    const elements = document.querySelectorAll('.cyberpunk-grid');
    
    elements.forEach(element => {
      element.addEventListener('mouseenter', () => {
        element.classList.add('cyberpunk-grid-active');
      });
      
      element.addEventListener('mouseleave', () => {
        element.classList.remove('cyberpunk-grid-active');
      });
      
      element.addEventListener('mousemove', (e) => {
        const rect = element.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width;
        const y = (e.clientY - rect.top) / rect.height;
        
        element.style.setProperty('--grid-x', x);
        element.style.setProperty('--grid-y', y);
      });
    });
  }

  // Setup ultra quantum tunneling
  setupUltraQuantumTunneling() {
    const elements = document.querySelectorAll('.quantum-tunnel');
    
    elements.forEach(element => {
      element.addEventListener('click', () => {
        element.classList.add('quantum-tunnel-active');
        this.createUltraQuantumTunnel(element);
        
        setTimeout(() => {
          element.classList.remove('quantum-tunnel-active');
        }, 2000);
      });
    });
  }

  // Setup ultra neural interface
  setupUltraNeuralInterface() {
    const elements = document.querySelectorAll('.neural-interface');
    
    elements.forEach(element => {
      element.addEventListener('mouseenter', () => {
        element.classList.add('neural-interface-active');
      });
      
      element.addEventListener('mouseleave', () => {
        element.classList.remove('neural-interface-active');
      });
      
      element.addEventListener('mousemove', (e) => {
        const rect = element.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width;
        const y = (e.clientY - rect.top) / rect.height;
        
        element.style.setProperty('--neural-x', x);
        element.style.setProperty('--neural-y', y);
      });
    });
  }

  // Setup ultra event listeners
  setupUltraEventListeners() {
    // Mouse movement
    document.addEventListener('mousemove', (e) => {
      this.mousePosition.x = e.clientX;
      this.mousePosition.y = e.clientY;
    });
    
    // Scroll events
    window.addEventListener('scroll', () => {
      this.scrollPosition = window.pageYOffset;
    });
    
    // Resize events
    window.addEventListener('resize', () => {
      this.updateUltraDimensions();
    });
    
    // Keyboard events
    document.addEventListener('keydown', (e) => {
      this.handleUltraKeyboard(e);
    });
  }

  // Start ultra animation loop
  startUltraAnimationLoop() {
    const animate = () => {
      this.updateUltraParticles();
      this.updateUltraNeuralNetwork();
      this.updateUltraEffects();
      this.updateUltraMouseEffects();
      
      this.animationId = requestAnimationFrame(animate);
    };
    
    animate();
  }

  // Update ultra particles
  updateUltraParticles() {
    this.particles.forEach(particle => {
      // Update position
      particle.x += particle.vx;
      particle.y += particle.vy;
      
      // Update life
      particle.life -= 0.008;
      
      // Mouse interaction
      const dx = this.mousePosition.x - particle.x;
      const dy = this.mousePosition.y - particle.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance < 100) {
        const force = (100 - distance) / 100;
        particle.vx += (dx / distance) * force * 0.1;
        particle.vy += (dy / distance) * force * 0.1;
      }
      
      // Reset if dead
      if (particle.life <= 0) {
        particle.x = Math.random() * particle.container.offsetWidth;
        particle.y = particle.container.offsetHeight;
        particle.life = 1;
        particle.vx = (Math.random() - 0.5) * 3;
        particle.vy = -Math.random() * 3 - 1;
      }
      
      // Update element
      particle.element.style.left = particle.x + 'px';
      particle.element.style.top = particle.y + 'px';
      particle.element.style.opacity = particle.life;
      particle.element.style.transform = `scale(${particle.life})`;
    });
  }

  // Update ultra neural network
  updateUltraNeuralNetwork() {
    this.neuralNodes.forEach(node => {
      // Random movement
      node.x += node.vx;
      node.y += node.vy;
      
      // Keep within bounds
      node.x = Math.max(0, Math.min(node.x, node.container.offsetWidth));
      node.y = Math.max(0, Math.min(node.y, node.container.offsetHeight));
      
      // Bounce off edges
      if (node.x <= 0 || node.x >= node.container.offsetWidth) {
        node.vx *= -1;
      }
      if (node.y <= 0 || node.y >= node.container.offsetHeight) {
        node.vy *= -1;
      }
      
      // Update element
      node.element.style.left = node.x + 'px';
      node.element.style.top = node.y + 'px';
    });
  }

  // Update ultra effects
  updateUltraEffects() {
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
    
    // Update cyberpunk neon
    const cyberpunkNeons = document.querySelectorAll('.cyberpunk-neon');
    cyberpunkNeons.forEach(neon => {
      const time = Date.now() * 0.001;
      neon.style.setProperty('--time', time);
    });
  }

  // Update ultra mouse effects
  updateUltraMouseEffects() {
    // Update mouse position for all elements
    document.querySelectorAll('.holographic-projection, .cyberpunk-grid, .neural-interface').forEach(element => {
      const rect = element.getBoundingClientRect();
      const x = (this.mousePosition.x - rect.left) / rect.width;
      const y = (this.mousePosition.y - rect.top) / rect.height;
      
      if (x >= 0 && x <= 1 && y >= 0 && y <= 1) {
        element.style.setProperty('--mouse-x', x);
        element.style.setProperty('--mouse-y', y);
      }
    });
  }

  // Update ultra dimensions
  updateUltraDimensions() {
    // Update viewport height
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
    
    // Update responsive classes
    const width = window.innerWidth;
    const body = document.body;
    
    body.classList.remove('mobile', 'tablet', 'desktop');
    
    if (width < 768) {
      body.classList.add('mobile');
    } else if (width < 1024) {
      body.classList.add('tablet');
    } else {
      body.classList.add('desktop');
    }
  }

  // Handle ultra keyboard
  handleUltraKeyboard(e) {
    // Quantum shortcuts
    if (e.ctrlKey || e.metaKey) {
      switch (e.key) {
        case 'q':
          e.preventDefault();
          this.toggleQuantumMode();
          break;
        case 'h':
          e.preventDefault();
          this.toggleHolographicMode();
          break;
        case 'n':
          e.preventDefault();
          this.toggleNeuralMode();
          break;
      }
    }
  }

  // Toggle quantum mode
  toggleQuantumMode() {
    document.body.classList.toggle('quantum-mode');
  }

  // Toggle holographic mode
  toggleHolographicMode() {
    document.body.classList.toggle('holographic-mode');
  }

  // Toggle neural mode
  toggleNeuralMode() {
    document.body.classList.toggle('neural-mode');
  }

  // Create ultra quantum ripple
  createUltraQuantumRipple(element) {
    const ripple = document.createElement('div');
    ripple.className = 'quantum-ripple';
    
    const rect = element.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = this.mousePosition.x - rect.left - size / 2;
    const y = this.mousePosition.y - rect.top - size / 2;
    
    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';
    
    element.appendChild(ripple);
    
    setTimeout(() => {
      ripple.remove();
    }, 1000);
  }

  // Create ultra quantum explosion
  createUltraQuantumExplosion(element) {
    const explosion = document.createElement('div');
    explosion.className = 'quantum-explosion';
    
    element.appendChild(explosion);
    
    setTimeout(() => {
      explosion.remove();
    }, 2000);
  }

  // Create ultra quantum tunnel
  createUltraQuantumTunnel(element) {
    const tunnel = document.createElement('div');
    tunnel.className = 'quantum-tunnel-effect';
    
    element.appendChild(tunnel);
    
    setTimeout(() => {
      tunnel.remove();
    }, 3000);
  }

  // Create holographic particles
  createHolographicParticles(element, x, y) {
    for (let i = 0; i < 5; i++) {
      const particle = document.createElement('div');
      particle.className = 'holographic-particle';
      
      particle.style.left = x + 'px';
      particle.style.top = y + 'px';
      particle.style.animationDelay = Math.random() * 0.5 + 's';
      
      document.body.appendChild(particle);
      
      setTimeout(() => {
        particle.remove();
      }, 1000);
    }
  }

  // Destroy ultra animations
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

// Initialize ultra animations
const ultraAnimations = new UltraAnimations();

// Initialize on DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    ultraAnimations.init();
  });
} else {
  ultraAnimations.init();
}

// Export for use in components
window.UltraAnimations = ultraAnimations;
