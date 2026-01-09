
document.addEventListener('DOMContentLoaded', function() {
  // === 1. PRELOADER ===
  const preloader = document.getElementById('preloader');
  
  if (preloader) {
    const MIN_SHOW_TIME = 1200; // minimum display time
    const FADE_TIME = 600;
    const startTime = performance.now();
    
   // Block scroll only for preloader
    document.body.classList.add('preloader-active');
    
    function hidePreloader() {
      const elapsed = performance.now() - startTime;
      const delay = Math.max(0, MIN_SHOW_TIME - elapsed);
      
      setTimeout(() => {
        preloader.classList.add('loaded');
        
        setTimeout(() => {
          preloader.remove();
          // Unlock scroll
          document.body.classList.remove('preloader-active');
        }, FADE_TIME);
      }, delay);
    }
    
    // Main scenario
    if (document.readyState === 'complete') {
      hidePreloader();
    } else {
      window.addEventListener('load', hidePreloader, { once: true });
    }
    
    // Fallback (if load doesn't work)
    setTimeout(hidePreloader, 6000);
  }
  
  // === 2. BURGER MENU ===
  const burgerMenu = document.getElementById('burgerMenu');
  const mainNav = document.getElementById('mainNav');
  
  if (burgerMenu && mainNav) {
    burgerMenu.addEventListener('click', function() {
      burgerMenu.classList.toggle('active');
      mainNav.classList.toggle('active');
      document.body.classList.toggle('menu-open');
      
      // Block scroll only when menu is open on mobile devices
      if (mainNav.classList.contains('active') && window.innerWidth <= 768) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = '';
      }
    });
    
    // Close menu when clicking on a link
    const navLinks = document.querySelectorAll('.nav a');
    navLinks.forEach(link => {
      link.addEventListener('click', function() {
        burgerMenu.classList.remove('active');
        mainNav.classList.remove('active');
        document.body.classList.remove('menu-open');
        document.body.style.overflow = ''; // Unlock scroll
      });
    });
    
    // Close menu when clicking outside its area
    document.addEventListener('click', function(event) {
      if (!mainNav.contains(event.target) && !burgerMenu.contains(event.target)) {
        burgerMenu.classList.remove('active');
        mainNav.classList.remove('active');
        document.body.classList.remove('menu-open');
        document.body.style.overflow = ''; // Unlock scroll
      }
    });
    
    // Close menu when pressing Escape
    document.addEventListener('keydown', function(event) {
      if (event.key === 'Escape' && mainNav.classList.contains('active')) {
        burgerMenu.classList.remove('active');
        mainNav.classList.remove('active');
        document.body.classList.remove('menu-open');
        document.body.style.overflow = ''; // Unlock scroll
      }
    });
    
    // Unlock scroll on resize if menu is closed
    window.addEventListener('resize', function() {
      if (!mainNav.classList.contains('active')) {
        document.body.style.overflow = '';
      }
    });
  }
  
  // === 3. SMOOTH SCROLL TO ANCHORS ===
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        // Close the menu if it is open (for mobile devices)
        if (mainNav && mainNav.classList.contains('active')) {
          burgerMenu.classList.remove('active');
          mainNav.classList.remove('active');
          document.body.classList.remove('menu-open');
          document.body.style.overflow = '';
        }
        
        window.scrollTo({
          top: targetElement.offsetTop - 70, // Take header height into account
          behavior: 'smooth'
        });
      }
    });
  });
  
  // === 4. FIX FOR SECONDARY SCROLL BAR ===
  function fixHorizontalScroll() {
    // Global fixes to prevent horizontal scrolling
    document.documentElement.style.overflowX = 'hidden';
    document.body.style.overflowX = 'hidden';
    
    // Check elements that may cause horizontal scrolling
    const allElements = document.querySelectorAll('*');
    
    allElements.forEach(el => {
      const rect = el.getBoundingClientRect();
      
      // If element is wider than window and not body/html
      if (rect.width > window.innerWidth && 
          !['BODY', 'HTML'].includes(el.tagName)) {
        
        // Automatically fix common issues
        if (el.tagName === 'IMG' && !el.style.maxWidth) {
          el.style.maxWidth = '100%';
        }
        
        if (el.tagName === 'TABLE' && !el.style.tableLayout) {
          el.style.tableLayout = 'fixed';
          el.style.width = '100%';
        }
      }
    });
    
    return true;
  }
  
  // Run check after page load
  setTimeout(fixHorizontalScroll, 100);
  
  // === 5. SCROLL UNLOCK GUARANTEE ===
  // Just in case, unlock scroll after 10 seconds
  setTimeout(() => {
    document.body.classList.remove('preloader-active');
    document.body.classList.remove('menu-open');
    document.body.style.overflow = '';
  }, 10000);
});