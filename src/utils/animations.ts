// PromoHive Advanced Interactive TypeScript

export interface AnimationConfig {
  duration: number;
  easing: string;
  delay?: number;
  iterations?: number;
}

export interface TouchEvent {
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  deltaX: number;
  deltaY: number;
}

export interface ScrollPosition {
  x: number;
  y: number;
  progress: number;
}

export class PromoHiveAnimations {
  private static instance: PromoHiveAnimations;
  private observers: Map<string, IntersectionObserver> = new Map();
  private scrollListeners: Set<Function> = new Set();
  private resizeListeners: Set<Function> = new Set();

  static getInstance(): PromoHiveAnimations {
    if (!PromoHiveAnimations.instance) {
      PromoHiveAnimations.instance = new PromoHiveAnimations();
    }
    return PromoHiveAnimations.instance;
  }

  // Initialize all animations
  init(): void {
    this.setupScrollAnimations();
    this.setupIntersectionObservers();
    this.setupEventListeners();
    this.setupPerformanceOptimizations();
  }

  // Setup scroll-based animations
  private setupScrollAnimations(): void {
    let ticking = false;
    
    const updateScrollAnimations = () => {
      const scrollY = window.pageYOffset;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollProgress = scrollY / (documentHeight - windowHeight);
      
      // Update CSS custom property
      document.documentElement.style.setProperty('--scroll-progress', scrollProgress.toString());
      
      // Update header
      const header = document.querySelector('header');
      if (header) {
        if (scrollY > 100) {
          header.classList.add('scrolled');
        } else {
          header.classList.remove('scrolled');
        }
      }
      
      // Update parallax elements
      const parallaxElements = document.querySelectorAll('.parallax');
      parallaxElements.forEach((element, index) => {
        const speed = parseFloat(element.getAttribute('data-speed') || '0.5');
        const yPos = -(scrollY * speed);
        (element as HTMLElement).style.transform = `translateY(${yPos}px)`;
      });
      
      ticking = false;
    };

    const requestTick = () => {
      if (!ticking) {
        requestAnimationFrame(updateScrollAnimations);
        ticking = true;
      }
    };

    window.addEventListener('scroll', requestTick, { passive: true });
  }

  // Setup intersection observers for scroll-triggered animations
  private setupIntersectionObservers(): void {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    // Fade in animation observer
    const fadeObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-fade-in');
          fadeObserver.unobserve(entry.target);
        }
      });
    }, observerOptions);

    // Scale in animation observer
    const scaleObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-scale-in');
          scaleObserver.unobserve(entry.target);
        }
      });
    }, observerOptions);

    // Slide up animation observer
    const slideObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-slide-up');
          slideObserver.unobserve(entry.target);
        }
      });
    }, observerOptions);

    // Observe elements
    document.querySelectorAll('.animate-on-scroll').forEach(el => {
      fadeObserver.observe(el);
    });

    document.querySelectorAll('.animate-scale-on-scroll').forEach(el => {
      scaleObserver.observe(el);
    });

    document.querySelectorAll('.animate-slide-on-scroll').forEach(el => {
      slideObserver.observe(el);
    });

    this.observers.set('fade', fadeObserver);
    this.observers.set('scale', scaleObserver);
    this.observers.set('slide', slideObserver);
  }

  // Setup event listeners
  private setupEventListeners(): void {
    // Touch events
    this.setupTouchEvents();
    
    // Resize events
    this.setupResizeEvents();
    
    // Keyboard events
    this.setupKeyboardEvents();
  }

  // Setup touch events for mobile interactions
  private setupTouchEvents(): void {
    let startX = 0;
    let startY = 0;
    let endX = 0;
    let endY = 0;

    document.addEventListener('touchstart', (e) => {
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
    }, { passive: true });

    document.addEventListener('touchend', (e) => {
      endX = e.changedTouches[0].clientX;
      endY = e.changedTouches[0].clientY;
      
      const deltaX = startX - endX;
      const deltaY = startY - endY;
      
      const touchEvent: TouchEvent = {
        startX,
        startY,
        endX,
        endY,
        deltaX,
        deltaY
      };
      
      this.handleTouchEvent(touchEvent);
    }, { passive: true });
  }

  // Handle touch events
  private handleTouchEvent(event: TouchEvent): void {
    const { deltaX, deltaY } = event;
    
    // Horizontal swipe
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      if (deltaX > 50) {
        this.dispatchCustomEvent('swipe-left', event);
      } else if (deltaX < -50) {
        this.dispatchCustomEvent('swipe-right', event);
      }
    }
    
    // Vertical swipe
    if (Math.abs(deltaY) > Math.abs(deltaX)) {
      if (deltaY > 50) {
        this.dispatchCustomEvent('swipe-up', event);
      } else if (deltaY < -50) {
        this.dispatchCustomEvent('swipe-down', event);
      }
    }
  }

  // Setup resize events
  private setupResizeEvents(): void {
    let resizeTimeout: number;
    
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = window.setTimeout(() => {
        this.updateViewportDimensions();
        this.updateResponsiveClasses();
        this.resizeListeners.forEach(listener => listener());
      }, 100);
    };

    window.addEventListener('resize', handleResize);
  }

  // Setup keyboard events
  private setupKeyboardEvents(): void {
    document.addEventListener('keydown', (e) => {
      // Handle keyboard shortcuts
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case 'k':
            e.preventDefault();
            this.dispatchCustomEvent('search-shortcut');
            break;
          case '/':
            e.preventDefault();
            this.dispatchCustomEvent('help-shortcut');
            break;
        }
      }
      
      // Handle escape key
      if (e.key === 'Escape') {
        this.dispatchCustomEvent('escape-pressed');
      }
    });
  }

  // Update viewport dimensions
  private updateViewportDimensions(): void {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
  }

  // Update responsive classes
  private updateResponsiveClasses(): void {
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

  // Setup performance optimizations
  private setupPerformanceOptimizations(): void {
    // Lazy load images
    this.setupLazyLoading();
    
    // Preload critical resources
    this.preloadCriticalResources();
    
    // Setup service worker
    this.setupServiceWorker();
  }

  // Setup lazy loading for images
  private setupLazyLoading(): void {
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target as HTMLImageElement;
          const src = img.getAttribute('data-src');
          if (src) {
            img.src = src;
            img.removeAttribute('data-src');
            imageObserver.unobserve(img);
          }
        }
      });
    });

    document.querySelectorAll('img[data-src]').forEach(img => {
      imageObserver.observe(img);
    });
  }

  // Preload critical resources
  private preloadCriticalResources(): void {
    const criticalImages = [
      '/logo.png',
      '/hero-bg.jpg',
      '/features-bg.jpg'
    ];

    criticalImages.forEach(src => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = src;
      document.head.appendChild(link);
    });
  }

  // Setup service worker
  private setupServiceWorker(): void {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
          .then(registration => {
            console.log('SW registered: ', registration);
          })
          .catch(registrationError => {
            console.log('SW registration failed: ', registrationError);
          });
      });
    }
  }

  // Add scroll listener
  addScrollListener(listener: Function): void {
    this.scrollListeners.add(listener);
  }

  // Remove scroll listener
  removeScrollListener(listener: Function): void {
    this.scrollListeners.delete(listener);
  }

  // Add resize listener
  addResizeListener(listener: Function): void {
    this.resizeListeners.add(listener);
  }

  // Remove resize listener
  removeResizeListener(listener: Function): void {
    this.resizeListeners.delete(listener);
  }

  // Dispatch custom event
  private dispatchCustomEvent(eventName: string, detail?: any): void {
    const event = new CustomEvent(eventName, { detail });
    document.dispatchEvent(event);
  }

  // Animate element
  animateElement(element: HTMLElement, animation: string, config?: AnimationConfig): Promise<void> {
    return new Promise((resolve) => {
      element.style.animation = `${animation} ${config?.duration || 0.3}s ${config?.easing || 'ease-out'} ${config?.delay || 0}s ${config?.iterations || 1}`;
      
      const handleAnimationEnd = () => {
        element.removeEventListener('animationend', handleAnimationEnd);
        resolve();
      };
      
      element.addEventListener('animationend', handleAnimationEnd);
    });
  }

  // Create ripple effect
  createRipple(element: HTMLElement, event: MouseEvent): void {
    const ripple = document.createElement('span');
    const rect = element.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;
    
    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';
    ripple.classList.add('ripple');
    
    element.appendChild(ripple);
    
    setTimeout(() => {
      ripple.remove();
    }, 600);
  }

  // Cleanup
  destroy(): void {
    this.observers.forEach(observer => observer.disconnect());
    this.observers.clear();
    this.scrollListeners.clear();
    this.resizeListeners.clear();
  }
}

// Export singleton instance
export const animations = PromoHiveAnimations.getInstance();

// Initialize on DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    animations.init();
  });
} else {
  animations.init();
}
