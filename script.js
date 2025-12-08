// ===================================
// MOBILE NAVIGATION
// ===================================

const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-link');

// Toggle mobile menu
if (navToggle) {
    navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
    });
}

// Close mobile menu when clicking on a link
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navToggle.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// ===================================
// NAVBAR SCROLL EFFECT
// ===================================

const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// ===================================
// ACTIVE NAVIGATION LINK
// ===================================

const sections = document.querySelectorAll('section[id]');

function updateActiveLink() {
    const scrollY = window.pageYOffset;

    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 100;
        const sectionId = section.getAttribute('id');
        const navLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);

        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            navLinks.forEach(link => link.classList.remove('active'));
            if (navLink) {
                navLink.classList.add('active');
            }
        }
    });
}

window.addEventListener('scroll', updateActiveLink);

// ===================================
// THEME TOGGLE
// ===================================

const themeToggle = document.getElementById('themeToggle');
const htmlElement = document.documentElement;

// Check for saved theme preference or default to 'dark'
const currentTheme = localStorage.getItem('theme') || 'dark';
htmlElement.setAttribute('data-theme', currentTheme);

themeToggle.addEventListener('click', () => {
    const theme = htmlElement.getAttribute('data-theme');
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    
    htmlElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    
    // Animate theme transition
    gsap.from('body', {
        opacity: 1.8,
        duration: 0.3
    });
    
    // Track theme change in analytics
    if (typeof gtag !== 'undefined') {
        gtag('event', 'theme_change', {
            'theme': newTheme
        });
    }

    requestAnimationFrame(()=> {
        positionLoader();
        appleTextAnimation("Kareem Gabr", "animatedName");
    });
});

// ===================================
// SCROLL PROGRESS INDICATOR
// ===================================

const scrollProgress = document.querySelector('.scroll-progress');

window.addEventListener('scroll', () => {
    const scrollTop = window.pageYOffset;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = (scrollTop / docHeight) * 100;
    
    if (scrollProgress) {
        scrollProgress.style.width = scrollPercent + '%';
    }
});

// ===================================
// APPLE-STYLE NAME ANIMATION
// ===================================


function appleTextAnimation(text, elementId, options = {}) {
  const chars = options.chars || "AB#$%CDLuvwxyMNOPQRSTEFGHIZa%bcd012efghijklmnopqrstuvwxyz345JKLMNOPQRSTUVWXY6789!@#$%&?";
  const letterDelay = options.letterDelay || 120;
  const frameDelay = options.frameDelay || 50;
  const cyclesMin = options.cyclesMin || 6;
  const cyclesMax = options.cyclesMax || 12;
  
  const textEl = document.getElementById(elementId);
  
  if (!textEl) {
    console.error(`Element with id "${elementId}" not found`);
    return;
  }

  const output = Array(text.length).fill("");
  const revealed = Array(text.length).fill(false);

  function randomChar() {
    return chars[Math.floor(Math.random() * chars.length)];
  }

  function animateLetter(i) {
    let cycles = 0;
    const maxCycles = cyclesMin + Math.random() * (cyclesMax - cyclesMin);

    const interval = setInterval(() => {
      if (revealed[i]) {
        clearInterval(interval);
        return;
      }

      output[i] = randomChar();
      textEl.textContent = output.join("");

      cycles++;
      if (cycles > maxCycles) {
        revealed[i] = true;
        output[i] = text[i];
        textEl.textContent = output.join("");
        clearInterval(interval);
      }
    }, frameDelay);
  }

  [...text].forEach((_, i) => {
    setTimeout(() => animateLetter(i), i * letterDelay);
  });
}


// Run animation on page load
window.addEventListener('load', () => {
    requestAnimationFrame(appleTextAnimation("Kareem Gabr", "animatedName"));
});

// ===================================
// SMOOTH SCROLL FOR ANCHOR LINKS
// ===================================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        
        // Don't prevent default for empty hash or just #
        if (href === '#' || href === '') return;
        
        const target = document.querySelector(href);
        if (target) {
            e.preventDefault();
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ===================================
// HIDE FEATURED PROJECTS IF EMPTY
// ===================================

function checkFeaturedProjects() {
    const featuredSection = document.getElementById('featured-projects-section');
    if (featuredSection) {
        const featuredProjects = featuredSection.querySelectorAll('.featured-project, .main-project-container');
        
        if (featuredProjects.length === 0) {
            featuredSection.style.display = 'none';
        } else {
            featuredSection.style.display = 'block';
        }
    }
}

// Run on page load
document.addEventListener('DOMContentLoaded', checkFeaturedProjects);

// Update PROJECT FILTERS to also check featured section visibility
const filterButtons = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');
const featuredProjects = document.querySelectorAll('.featured-project');
const mainProjectContainers = document.querySelectorAll('.main-project-container');

filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Remove active class from all buttons
        filterButtons.forEach(btn => btn.classList.remove('active'));
        // Add active class to clicked button
        button.classList.add('active');
        
        const filterValue = button.getAttribute('data-filter');
        
        // Filter regular project cards
        projectCards.forEach(card => {
            const categories = card.getAttribute('data-category').split(' ');
            
            if (filterValue === 'all' || categories.includes(filterValue)) {
                card.style.display = 'block';
                setTimeout(() => {
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                }, 10);
            } else {
                card.style.opacity = '0';
                card.style.transform = 'translateY(20px)';
                setTimeout(() => {
                    card.style.display = 'none';
                }, 300);
            }
        });
        
        // Filter featured projects
        featuredProjects.forEach(project => {
            const categories = project.getAttribute('data-category').split(' ');
            
            if (filterValue === 'all' || categories.includes(filterValue)) {
                project.style.display = 'grid';
                setTimeout(() => {
                    project.style.opacity = '1';
                    project.style.transform = 'translateY(0)';
                }, 10);
            } else {
                project.style.opacity = '0';
                project.style.transform = 'translateY(20px)';
                setTimeout(() => {
                    project.style.display = 'none';
                }, 300);
            }
        });
        
        // Filter main project containers
        mainProjectContainers.forEach(container => {
            const categories = container.getAttribute('data-category').split(' ');
            
            if (filterValue === 'all' || categories.includes(filterValue)) {
                container.style.display = 'block';
                setTimeout(() => {
                    container.style.opacity = '1';
                    container.style.transform = 'translateY(0)';
                }, 10);
            } else {
                container.style.opacity = '0';
                container.style.transform = 'translateY(20px)';
                setTimeout(() => {
                    container.style.display = 'none';
                }, 300);
            }
        });
        
        // Check if featured section should be visible after filtering
        setTimeout(checkFeaturedProjects, 350);
        
        // Track filter change in analytics
        if (typeof gtag !== 'undefined') {
            gtag('event', 'filter_projects', {
                'filter_type': filterValue
            });
        }
    });
});

// ===================================
// SKILL LEVEL ANIMATION
// ===================================

const skillLevels = document.querySelectorAll('.skill-level');

const observerOptions = {
    threshold: 0.5,
    rootMargin: '0px 0px -100px 0px'
};

const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            skillObserver.unobserve(entry.target);
        }
    });
}, observerOptions);

skillLevels.forEach(level => {
    skillObserver.observe(level);
});

// ===================================
// SCROLL ANIMATIONS (GSAP)
// ===================================

// Check if GSAP is loaded
if (typeof gsap !== 'undefined') {
    // Register ScrollTrigger plugin
    gsap.registerPlugin(ScrollTrigger);

    // Animate sections on scroll
    gsap.utils.toArray('section').forEach(section => {
        gsap.from(section, {
            opacity: 0,
            y: 50,
            duration: 1,
            scrollTrigger: {
                trigger: section,
                start: 'top 80%',
                end: 'top 50%',
                toggleActions: 'play none none reverse'
            }
        });
    });

    // Animate timeline items
    gsap.utils.toArray('.timeline-item').forEach((item, index) => {
        gsap.from(item, {
            opacity: 0,
            x: -50,
            duration: 0.8,
            delay: index * 0.1,
            scrollTrigger: {
                trigger: item,
                start: 'top 85%',
                toggleActions: 'play none none reverse'
            }
        });
    });

    // Animate project cards
    gsap.utils.toArray('.project-card').forEach((card, index) => {
        gsap.from(card, {
            opacity: 0,
            y: 30,
            duration: 0.6,
            delay: index * 0.1,
            scrollTrigger: {
                trigger: card,
                start: 'top 85%',
                toggleActions: 'play none none reverse'
            }
        });
    });

    // Animate skill categories
    gsap.utils.toArray('.skill-category').forEach((category, index) => {
        gsap.from(category, {
            opacity: 0,
            scale: 0.9,
            duration: 0.6,
            delay: index * 0.1,
            scrollTrigger: {
                trigger: category,
                start: 'top 85%',
                toggleActions: 'play none none reverse'
            }
        });
    });

    // Animate education cards
    gsap.utils.toArray('.education-card').forEach((card, index) => {
        gsap.from(card, {
            opacity: 0,
            y: 30,
            duration: 0.6,
            delay: index * 0.1,
            scrollTrigger: {
                trigger: card,
                start: 'top 85%',
                toggleActions: 'play none none reverse'
            }
        });
    });

    // Animate blog cards
    gsap.utils.toArray('.blog-card').forEach((card, index) => {
        gsap.from(card, {
            opacity: 0,
            y: 30,
            duration: 0.6,
            delay: index * 0.1,
            scrollTrigger: {
                trigger: card,
                start: 'top 85%',
                toggleActions: 'play none none reverse'
            }
        });
    });

    // Animate hero content
    gsap.from('.hero-content', {
        opacity: 0,
        y: 50,
        duration: 1,
        delay: 0.5
    });

    gsap.from('.hero-visual', {
        opacity: 0,
        x: 50,
        duration: 1,
        delay: 0.7
    });
}


// ===================================
// WEB3FORMS CONTACT FORM INTEGRATION
// ===================================
// Add this at the top of your script.js
let formLoadTime = Date.now();

const contactForm = document.getElementById('contactForm');

if (contactForm) {
    contactForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const formData = new FormData(contactForm);
        
        // ===================================
        // ADVANCED BOT CHECKS
        // ===================================
        
        // 1. Honeypot Check
        const botcheck = formData.get('botcheck');
        if (botcheck) {
            console.warn('Bot detected (honeypot)! Form submission blocked.');
            showNotification('⚠️ Suspicious activity detected.', 'error');
            return;
        }
        
        // 2. Time-Based Check (bots submit too fast)
        const timeSinceLoad = Date.now() - formLoadTime;
        if (timeSinceLoad < 2000) { // Less than 2 seconds
            console.warn('Bot detected (too fast)! Form submission blocked.');
            showNotification('⚠️ Please take your time filling out the form.', 'error');
            return;
        }
        
        // 3. Check if all required fields are filled
        const name = formData.get('name');
        const email = formData.get('email');
        const message = formData.get('message');
        
        if (!name || !email || !message) {
            showNotification('⚠️ Please fill in all required fields.', 'error');
            return;
        }
        
        // 4. Basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            showNotification('⚠️ Please enter a valid email address.', 'error');
            return;
        }
        
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalBtnText = submitBtn.innerHTML;
        
        submitBtn.innerHTML = '<span>Sending...</span> <i class="fas fa-spinner fa-spin"></i>';
        submitBtn.disabled = true;
        
        try {
            const response = await fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                body: formData
            });
            
            const data = await response.json();
            
            if (data.success) {
                showNotification('✅ Thank you! Your message has been sent successfully.', 'success');
                contactForm.reset();
                formLoadTime = Date.now(); // Reset timer after successful submission
                
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'form_submit', {
                        'event_category': 'Contact',
                        'event_label': 'Contact Form Submission'
                    });
                }
            } else {
                throw new Error(data.message || 'Submission failed');
            }
        } catch (error) {
            console.error('Form submission error:', error);
            showNotification('❌ Oops! There was a problem sending your message. Please try again or email me directly.', 'error');
        } finally {
            submitBtn.innerHTML = originalBtnText;
            submitBtn.disabled = false;
        }
    });
}

// ===================================
// NOTIFICATION SYSTEM
// ===================================

function showNotification(message, type = 'info') {
    // Remove any existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
        <span>${message}</span>
        <button class="notification-close" onclick="this.parentElement.remove()">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    document.body.appendChild(notification);
    
    // Trigger animation
    setTimeout(() => notification.classList.add('show'), 100);
    
    // Auto-remove after 6 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 6000);
}
// ===================================
// PARTICLE BURST TRAIL
// ===================================

/* if (window.innerWidth > 1024) {
    const trailContainer = document.querySelector('.cursor-trail-container');
    
    if (trailContainer) {
        let lastTrailTime = 0;
        const trailDelay = 40;
        const colors = ['color-red', 'color-orange', 'color-yellow', 'color-green', 'color-blue', 'color-purple', 'color-pink'];
        const particles = ['particle-1', 'particle-2', 'particle-3', 'particle-4'];
        
        document.addEventListener('mousemove', (e) => {
            const currentTime = Date.now();
            
            if (currentTime - lastTrailTime < trailDelay) return;
            lastTrailTime = currentTime;
            
            // Create multiple particles in a burst
            for (let i = 0; i < 4; i++) {
                setTimeout(() => {
                    const trail = document.createElement('div');
                    trail.className = 'cursor-trail';
                    trail.classList.add(particles[i]);
                    trail.classList.add(colors[Math.floor(Math.random() * colors.length)]);
                    
                    trail.style.left = e.clientX + 'px';
                    trail.style.top = e.clientY + 'px';
                    
                    trailContainer.appendChild(trail);
                    
                    setTimeout(() => trail.remove(), 800);
                }, i * 10);
            }
        });
        
        // Cleanup
        setInterval(() => {
            const trails = trailContainer.querySelectorAll('.cursor-trail');
            if (trails.length > 100) {
                trails[0].remove();
            }
        }, 100);
    }
} */
// ===================================
// TYPING EFFECT FOR HERO SUBTITLE
// ===================================

// Store the timeout ID globally so we can cancel it
let typewriterTimeout = null;

function typeWriter(element, text, speed = 100) {
    let i = 0;
    element.textContent = '';
    
    function type() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            typewriterTimeout = setTimeout(type, speed);
        }
    }
    
    type();
}

function positionLoader() {
    const subtitle = document.querySelector('.hero-subtitle');
    if (subtitle) {
        // Cancel any ongoing typewriter animation
        if (typewriterTimeout) {
            clearTimeout(typewriterTimeout);
            typewriterTimeout = null;
        }
        
        subtitle.textContent = '';
        const text = 'Senior Frontend Engineer';
        typeWriter(subtitle, text, 80);
    }
}

window.addEventListener('load', () => requestAnimationFrame(positionLoader));



// ===================================
// LAZY LOADING IMAGES
// ===================================

const images = document.querySelectorAll('img[data-src]');

const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            img.classList.add('loaded');
            observer.unobserve(img);
        }
    });
});

images.forEach(img => imageObserver.observe(img));

// ===================================
// DOWNLOAD RESUME BUTTON
// ===================================

const downloadBtn = document.querySelector('.btn-download');

if (downloadBtn) {
    downloadBtn.addEventListener('click', (e) => {
        // Add your resume file path here
        const resumePath = 'assets/resume.pdf';
        
        // Optional: Track download with analytics
        if (typeof gtag !== 'undefined') {
            gtag('event', 'download', {
                'event_category': 'Resume',
                'event_label': 'Resume Download'
            });
        }
        
        console.log('Resume download initiated');
    });
}

// ===================================
// PARTICLE BACKGROUND EFFECT (Optional)
// ===================================

function createParticles() {
    const hero = document.querySelector('.hero');
    const particleCount = 50;
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.cssText = `
            position: absolute;
            width: 2px;
            height: 2px;
            background: rgba(255, 255, 255, 1);
            border-radius: 50%;
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
            animation: float ${5 + Math.random() * 10}s linear infinite;
            animation-delay: ${Math.random() * 5}s;
        `;
        hero.appendChild(particle);
    }
}

window.addEventListener('load', createParticles);


// ===================================
// CONSOLE MESSAGE
// ===================================

console.log('%c👋 Welcome to my portfolio!', 'color: #ef4444; font-size: 20px; font-weight: bold;');
console.log('%cLooking to hire? Let\'s connect!', 'color: #f59e0b; font-size: 14px;');
console.log('%cEmail: karim.yasser.ahmed@gmail.com', 'color: #10b981; font-size: 12px;');

// ===================================
// PERFORMANCE MONITORING
// ===================================

window.addEventListener('load', () => {
    // Log page load time
    const loadTime = performance.timing.domContentLoadedEventEnd - performance.timing.navigationStart;
    console.log(`Page loaded in ${loadTime}ms`);
    
    // Optional: Send to analytics
    if (typeof gtag !== 'undefined') {
        gtag('event', 'timing_complete', {
            'name': 'load',
            'value': loadTime,
            'event_category': 'Performance'
        });
    }
});


// ===================================
// SHOOTING STARS ANIMATION
// ===================================

class ShootingStarManager {
    constructor() {
        this.container = document.querySelector('.shooting-stars-layout');
        this.maxStars = window.innerWidth < 768 ? 2 : 5;
        this.activeStars = 0;
        this.isVisible = true;
        
        if (this.container) this.init();
    }
    
    init() {
        document.addEventListener('visibilitychange', () => {
            this.isVisible = !document.hidden;
        });
        
        this.startAnimation();
    }
    
    createStar() {
        if (!this.isVisible || this.activeStars >= this.maxStars) return;
        
        this.activeStars++;
        
        const star = document.createElement('div');
        star.className = 'shooting-star';
        
        star.style.left = `${Math.random() * 60}%`;
        star.style.top = `${Math.random() * 60}%`;
        
        const speeds = ['fast', 'medium', 'slow'];
        const colors = ['', 'blue', 'purple', 'pink'];
        
        star.classList.add(speeds[Math.floor(Math.random() * speeds.length)]);
        
        const color = colors[Math.floor(Math.random() * colors.length)];
        if (color) star.classList.add(color);
        
        this.container.appendChild(star);
        
        star.addEventListener('animationend', () => {
            star.remove();
            this.activeStars--;
        });
    }
    
    startAnimation() {
        setInterval(() => {
            if (Math.random() > 0.4) this.createStar();
        }, 2000);
        
        for (let i = 0; i < 3; i++) {
            setTimeout(() => this.createStar(), i * 800);
        }
    }
}

// Initialize shooting stars
document.addEventListener('DOMContentLoaded', () => {
    new ShootingStarManager();
});

// ===================================
// EASTER EGG - KONAMI CODE
// ===================================

let konamiCode = [];
const konamiPattern = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

document.addEventListener('keydown', (e) => {
    konamiCode.push(e.key);
    konamiCode = konamiCode.slice(-10);
    
    if (konamiCode.join('') === konamiPattern.join('')) {
        console.log('%c🎮 KONAMI CODE ACTIVATED!', 'color: #ef4444; font-size: 24px; font-weight: bold;');
        document.body.style.animation = 'rainbow 2s linear infinite';
        
        // Add rainbow animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes rainbow {
                0% { filter: hue-rotate(0deg); }
                100% { filter: hue-rotate(360deg); }
            }
        `;
        document.head.appendChild(style);
        
        setTimeout(() => {
            document.body.style.animation = '';
        }, 5000);
    }
});

// ===================================
// INITIALIZE ALL ON PAGE LOAD
// ===================================

document.addEventListener('DOMContentLoaded', () => {
    // Update active nav link on load
    updateActiveLink();
    
    // Initialize any other components
    console.log('Portfolio initialized successfully! 🚀');
});