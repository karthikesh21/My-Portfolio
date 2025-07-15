
// DOM Elements
const loadingScreen = document.getElementById('loading-screen');
const header = document.getElementById('header');
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const mobileMenu = document.getElementById('mobile-menu');
const backToTopBtn = document.getElementById('back-to-top');
const typingText = document.getElementById('typing-text');
const contactForm = document.getElementById('contact-form');
const particleCanvas = document.getElementById('particle-canvas');
const currentYearSpan = document.getElementById('current-year');
const darkModeToggle = document.getElementById('dark-mode-toggle');
const darkModeToggleMobile = document.getElementById('dark-mode-toggle-mobile');

// Typing Animation
const roles = ["Full-Stack Developer", "Open Source Contributor", "Problem Solver"];
let currentRole = "";
let roleIndex = 0;
let charIndex = 0;
let isDeleting = false;

function typeText() {
  const fullText = roles[roleIndex];
  
  if (!isDeleting && charIndex < fullText.length) {
    currentRole = fullText.slice(0, charIndex + 1);
    charIndex++;
  } else if (isDeleting && charIndex > 0) {
    currentRole = fullText.slice(0, charIndex - 1);
    charIndex--;
  } else if (!isDeleting && charIndex === fullText.length) {
    setTimeout(() => isDeleting = true, 2000);
  } else if (isDeleting && charIndex === 0) {
    isDeleting = false;
    roleIndex = (roleIndex + 1) % roles.length;
  }
  
  if (typingText) {
    typingText.textContent = currentRole;
  }
  
  const typeSpeed = isDeleting ? 50 : 100;
  setTimeout(typeText, typeSpeed);
}

// Particle Background
class Particle {
  constructor(canvas) {
    this.canvas = canvas;
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.vx = (Math.random() - 0.5) * 0.5;
    this.vy = (Math.random() - 0.5) * 0.5;
    this.size = Math.random() * 2 + 1;
    this.opacity = Math.random() * 0.5 + 0.2;
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;

    if (this.x < 0 || this.x > this.canvas.width) this.vx *= -1;
    if (this.y < 0 || this.y > this.canvas.height) this.vy *= -1;
  }

  draw(ctx) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(34, 211, 238, ${this.opacity})`;
    ctx.fill();
  }
}

function initParticleBackground() {
  if (!particleCanvas) return;
  
  const ctx = particleCanvas.getContext('2d');
  let particles = [];

  function resizeCanvas() {
    particleCanvas.width = window.innerWidth;
    particleCanvas.height = window.innerHeight;
    
    // Recreate particles on resize
    const particleCount = Math.min(50, Math.floor(particleCanvas.width * particleCanvas.height / 15000));
    particles = [];
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle(particleCanvas));
    }
  }

  function animate() {
    ctx.clearRect(0, 0, particleCanvas.width, particleCanvas.height);
    
    particles.forEach(particle => {
      particle.update();
      particle.draw(ctx);
    });

    // Draw connections
    particles.forEach((particle, i) => {
      particles.slice(i + 1).forEach(otherParticle => {
        const dx = particle.x - otherParticle.x;
        const dy = particle.y - otherParticle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 100) {
          ctx.beginPath();
          ctx.moveTo(particle.x, particle.y);
          ctx.lineTo(otherParticle.x, otherParticle.y);
          ctx.strokeStyle = `rgba(34, 211, 238, ${0.1 * (1 - distance / 100)})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      });
    });

    requestAnimationFrame(animate);
  }

  resizeCanvas();
  animate();
  
  window.addEventListener('resize', resizeCanvas);
}

// Smooth Scrolling
function scrollToSection(sectionId) {
  const element = document.getElementById(sectionId);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' });
    
    // Close mobile menu if open
    if (mobileMenu) {
      mobileMenu.classList.remove('open');
      const icon = mobileMenuBtn?.querySelector('i');
      if (icon) {
        icon.className = 'fas fa-bars';
      }
    }
  }
}

// Header Scroll Effect
function handleScroll() {
  if (window.scrollY > 50) {
    header?.classList.add('scrolled');
  } else {
    header?.classList.remove('scrolled');
  }
  
  // Back to top button
  if (window.scrollY > 300) {
    backToTopBtn?.classList.add('visible');
  } else {
    backToTopBtn?.classList.remove('visible');
  }
}

// Mobile Menu Toggle
function toggleMobileMenu() {
  if (mobileMenu) {
    mobileMenu.classList.toggle('open');
    const icon = mobileMenuBtn?.querySelector('i');
    if (icon) {
      icon.className = mobileMenu.classList.contains('open') ? 'fas fa-times' : 'fas fa-bars';
    }
  }
}

// Skill Progress Animation
function animateSkillBars() {
  const skillBars = document.querySelectorAll('.skill-progress');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const width = entry.target.getAttribute('data-width');
        entry.target.style.width = width + '%';
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  skillBars.forEach(bar => observer.observe(bar));
}

// Contact Form Handling
function handleContactForm(e) {
  e.preventDefault();
  
  const formData = new FormData(contactForm);
  const name = formData.get('name');
  const email = formData.get('email');
  const subject = formData.get('subject');
  const message = formData.get('message');
  
  // Create mailto link
  const mailtoLink = `mailto:karthikes004h@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(`From: ${name} (${email})\n\n${message}`)}`;
  
  // Open email client
  window.location.href = mailtoLink;
  
  // Reset form
  contactForm.reset();
  
  // Show success message (you can customize this)
  alert('Thank you for your message! Let\'s Get In Touch.');
}

// Navigation Link Handling
function setupNavigation() {
  // Desktop navigation
  const navLinks = document.querySelectorAll('.nav-link');
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = link.getAttribute('href').substring(1);
      scrollToSection(targetId);
    });
  });

  // Mobile navigation
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
  mobileNavLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = link.getAttribute('href').substring(1);
      scrollToSection(targetId);
    });
  });

  // Footer navigation
  const footerLinks = document.querySelectorAll('.footer-links a');
  footerLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = link.getAttribute('href').substring(1);
      scrollToSection(targetId);
    });
  });
}

// Loading Screen
function hideLoadingScreen() {
  setTimeout(() => {
    if (loadingScreen) {
      loadingScreen.style.opacity = '0';
      setTimeout(() => {
        loadingScreen.style.display = 'none';
      }, 500);
    }
  }, 2000);
}

// Dark Mode Logic
function setDarkMode(enabled) {
  if (enabled) {
    document.body.classList.add('dark-mode');
    localStorage.setItem('darkMode', 'enabled');
    updateDarkModeIcons(true);
  } else {
    document.body.classList.remove('dark-mode');
    localStorage.setItem('darkMode', 'disabled');
    updateDarkModeIcons(false);
  }
}

function updateDarkModeIcons(isDark) {
  if (darkModeToggle) {
    const icon = darkModeToggle.querySelector('i');
    if (icon) icon.className = isDark ? 'fas fa-sun' : 'fas fa-moon';
    darkModeToggle.setAttribute('aria-label', isDark ? 'Switch to light mode' : 'Switch to dark mode');
  }
  if (darkModeToggleMobile) {
    const icon = darkModeToggleMobile.querySelector('i');
    if (icon) icon.className = isDark ? 'fas fa-sun' : 'fas fa-moon';
    darkModeToggleMobile.setAttribute('aria-label', isDark ? 'Switch to light mode' : 'Switch to dark mode');
    const span = darkModeToggleMobile.querySelector('span');
    if (span) span.textContent = isDark ? 'Light Mode' : 'Dark Mode';
  }
}

function toggleDarkMode() {
  const isDark = !document.body.classList.contains('dark-mode');
  setDarkMode(isDark);
}

function initDarkMode() {
  // Check localStorage or system preference
  const stored = localStorage.getItem('darkMode');
  let enableDark = false;
  if (stored === 'enabled') enableDark = true;
  else if (stored === 'disabled') enableDark = false;
  else enableDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  setDarkMode(enableDark);

  if (darkModeToggle) {
    darkModeToggle.addEventListener('click', toggleDarkMode);
  }
  if (darkModeToggleMobile) {
    darkModeToggleMobile.addEventListener('click', () => {
      toggleDarkMode();
      // Also close mobile menu after toggling
      if (mobileMenu) {
        mobileMenu.classList.remove('open');
        const icon = mobileMenuBtn?.querySelector('i');
        if (icon) {
          icon.className = 'fas fa-bars';
        }
      }
    });
  }
}

// Initialize Everything
function init() {
  // Set current year
  if (currentYearSpan) {
    currentYearSpan.textContent = new Date().getFullYear();
  }
  
  // Start animations and interactions
  hideLoadingScreen();
  typeText();
  initParticleBackground();
  animateSkillBars();
  setupNavigation();
  initDarkMode();
  
  // Event Listeners
  window.addEventListener('scroll', handleScroll);
  
  if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', toggleMobileMenu);
  }
  
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
  
  if (contactForm) {
    contactForm.addEventListener('submit', handleContactForm);
  }
}

// Start when DOM is loaded
document.addEventListener('DOMContentLoaded', init);

// Handle window resize
window.addEventListener('resize', () => {
  // Close mobile menu on resize
  if (window.innerWidth > 768 && mobileMenu) {
    mobileMenu.classList.remove('open');
    const icon = mobileMenuBtn?.querySelector('i');
    if (icon) {
      icon.className = 'fas fa-bars';
    }
  }
});
