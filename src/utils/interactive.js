// PromoHive Interactive JavaScript

// Initialize interactive features
document.addEventListener('DOMContentLoaded', function() {
  initializeInteractiveFeatures();
  initializeScrollAnimations();
  initializeTouchEffects();
  initializePerformanceOptimizations();
});

// Interactive Features
function initializeInteractiveFeatures() {
  // Add ripple effect to buttons
  addRippleEffect();
  
  // Add parallax scrolling
  addParallaxScrolling();
  
  // Add typing animation
  addTypingAnimation();
  
  // Add counter animation
  addCounterAnimation();
  
  // Add progress bar animation
  addProgressBarAnimation();
}

// Ripple Effect for Buttons
function addRippleEffect() {
  const buttons = document.querySelectorAll('.btn-primary, .btn-secondary, button');
  
  buttons.forEach(button => {
    button.addEventListener('click', function(e) {
      const ripple = document.createElement('span');
      const rect = this.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top - size / 2;
      
      ripple.style.width = ripple.style.height = size + 'px';
      ripple.style.left = x + 'px';
      ripple.style.top = y + 'px';
      ripple.classList.add('ripple');
      
      this.appendChild(ripple);
      
      setTimeout(() => {
        ripple.remove();
      }, 600);
    });
  });
}

// Parallax Scrolling Effect
function addParallaxScrolling() {
  const parallaxElements = document.querySelectorAll('.float-animation, .parallax');
  
  window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const rate = scrolled * -0.5;
    
    parallaxElements.forEach(element => {
      element.style.transform = `translateY(${rate}px)`;
    });
  });
}

// Typing Animation
function addTypingAnimation() {
  const typingElements = document.querySelectorAll('.typing-animation');
  
  typingElements.forEach(element => {
    const text = element.textContent;
    element.textContent = '';
    element.style.borderRight = '2px solid #00d4ff';
    
    let i = 0;
    const typeWriter = () => {
      if (i < text.length) {
        element.textContent += text.charAt(i);
        i++;
        setTimeout(typeWriter, 100);
      } else {
        element.style.borderRight = 'none';
      }
    };
    
    // Start typing animation when element is in view
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          typeWriter();
          observer.unobserve(entry.target);
        }
      });
    });
    
    observer.observe(element);
  });
}

// Counter Animation
function addCounterAnimation() {
  const counters = document.querySelectorAll('.counter');
  
  counters.forEach(counter => {
    const target = parseInt(counter.getAttribute('data-target'));
    const duration = 2000; // 2 seconds
    const increment = target / (duration / 16); // 60fps
    let current = 0;
    
    const updateCounter = () => {
      if (current < target) {
        current += increment;
        counter.textContent = Math.floor(current);
        requestAnimationFrame(updateCounter);
      } else {
        counter.textContent = target;
      }
    };
    
    // Start counter animation when element is in view
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          updateCounter();
          observer.unobserve(entry.target);
        }
      });
    });
    
    observer.observe(counter);
  });
}

// Progress Bar Animation
function addProgressBarAnimation() {
  const progressBars = document.querySelectorAll('.progress-fill');
  
  progressBars.forEach(bar => {
    const width = bar.getAttribute('data-width') || '0%';
    
    // Start progress animation when element is in view
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            bar.style.width = width;
          }, 200);
          observer.unobserve(entry.target);
        }
      });
    });
    
    observer.observe(bar);
  });
}

// Scroll Animations
function initializeScrollAnimations() {
  const animatedElements = document.querySelectorAll('.animate-on-scroll');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-fade-in');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });
  
  animatedElements.forEach(el => observer.observe(el));
}

// Touch Effects
function initializeTouchEffects() {
  // Add touch feedback
  const touchElements = document.querySelectorAll('.btn-touch, .card-interactive, .hover-lift');
  
  touchElements.forEach(element => {
    element.addEventListener('touchstart', function() {
      this.classList.add('touch-active');
    });
    
    element.addEventListener('touchend', function() {
      setTimeout(() => {
        this.classList.remove('touch-active');
      }, 150);
    });
  });
  
  // Add swipe gestures
  let startX, startY, endX, endY;
  
  document.addEventListener('touchstart', function(e) {
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
  });
  
  document.addEventListener('touchend', function(e) {
    endX = e.changedTouches[0].clientX;
    endY = e.changedTouches[0].clientY;
    
    const diffX = startX - endX;
    const diffY = startY - endY;
    
    // Horizontal swipe
    if (Math.abs(diffX) > Math.abs(diffY)) {
      if (diffX > 50) {
        // Swipe left
        handleSwipeLeft();
      } else if (diffX < -50) {
        // Swipe right
        handleSwipeRight();
      }
    }
    
    // Vertical swipe
    if (Math.abs(diffY) > Math.abs(diffX)) {
      if (diffY > 50) {
        // Swipe up
        handleSwipeUp();
      } else if (diffY < -50) {
        // Swipe down
        handleSwipeDown();
      }
    }
  });
}

// Swipe Handlers
function handleSwipeLeft() {
  // Handle swipe left
  console.log('Swipe left detected');
}

function handleSwipeRight() {
  // Handle swipe right
  console.log('Swipe right detected');
}

function handleSwipeUp() {
  // Handle swipe up
  console.log('Swipe up detected');
}

function handleSwipeDown() {
  // Handle swipe down
  console.log('Swipe down detected');
}

// Performance Optimizations
function initializePerformanceOptimizations() {
  // Lazy load images
  const images = document.querySelectorAll('img[data-src]');
  
  const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.getAttribute('data-src');
        img.removeAttribute('data-src');
        imageObserver.unobserve(img);
      }
    });
  });
  
  images.forEach(img => imageObserver.observe(img));
  
  // Debounce scroll events
  let scrollTimeout;
  window.addEventListener('scroll', function() {
    if (scrollTimeout) {
      clearTimeout(scrollTimeout);
    }
    scrollTimeout = setTimeout(handleScroll, 10);
  });
  
  // Throttle resize events
  let resizeTimeout;
  window.addEventListener('resize', function() {
    if (resizeTimeout) {
      clearTimeout(resizeTimeout);
    }
    resizeTimeout = setTimeout(handleResize, 100);
  });
}

// Scroll Handler
function handleScroll() {
  // Update scroll progress
  const scrollProgress = window.pageYOffset / (document.documentElement.scrollHeight - window.innerHeight);
  document.documentElement.style.setProperty('--scroll-progress', scrollProgress);
  
  // Update header background
  const header = document.querySelector('header');
  if (header) {
    if (window.pageYOffset > 100) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }
}

// Resize Handler
function handleResize() {
  // Update viewport height for mobile
  const vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty('--vh', `${vh}px`);
  
  // Update responsive classes
  updateResponsiveClasses();
}

// Update Responsive Classes
function updateResponsiveClasses() {
  const width = window.innerWidth;
  const body = document.body;
  
  // Remove existing responsive classes
  body.classList.remove('mobile', 'tablet', 'desktop');
  
  // Add appropriate class
  if (width < 768) {
    body.classList.add('mobile');
  } else if (width < 1024) {
    body.classList.add('tablet');
  } else {
    body.classList.add('desktop');
  }
}

// Utility Functions
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

function throttle(func, limit) {
  let inThrottle;
  return function() {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

// Export functions for use in components
window.PromoHiveInteractive = {
  debounce,
  throttle,
  addRippleEffect,
  addTypingAnimation,
  addCounterAnimation
};
