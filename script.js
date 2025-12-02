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

const finalText = "Kareem Gabr";
const chars = "AB#$%CDLuvwxyMNOPQRSTEFGHIZa%bcd012efghijklmnopqrstuvwxyz345JKLMNOPQRSTUVWXY6789!@#$%&?";
const textEl = document.getElementById("animatedName");

let output = Array(finalText.length).fill("");
let revealed = Array(finalText.length).fill(false);

function randomChar() {
  return chars[Math.floor(Math.random() * chars.length)];
}

function animateLetter(i) {
  let cycles = 0;
  const maxCycles = 6 + Math.random() * 6; // vary per letter for realism

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
      output[i] = finalText[i];
      textEl.textContent = output.join("");
      clearInterval(interval);
    }
  }, 50);
}

function appleTextAnimation() {
  [...finalText].forEach((_, i) => {
    setTimeout(() => animateLetter(i), i * 120); // stagger letters like Apple
  });
}


// Run animation on page load
window.addEventListener('load', () => {
    requestAnimationFrame(appleTextAnimation);
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
// PROJECT FILTERS
// ===================================

const filterButtons = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');

filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Remove active class from all buttons
        filterButtons.forEach(btn => btn.classList.remove('active'));
        // Add active class to clicked button
        button.classList.add('active');
        
        const filterValue = button.getAttribute('data-filter');
        
        projectCards.forEach(card => {
            if (filterValue === 'all' || card.getAttribute('data-category') === filterValue) {
                card.style.display = 'block';
                setTimeout(() => {
                    card.style.opacity = '1';
                    card.style.transform = 'scale(1)';
                }, 10);
            } else {
                card.style.opacity = '0';
                card.style.transform = 'scale(0.8)';
                setTimeout(() => {
                    card.style.display = 'none';
                }, 300);
            }
        });
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
// CONTACT FORM VALIDATION
// ===================================

const contactForm = document.getElementById('contactForm');

if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form values
        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const subject = document.getElementById('subject').value.trim();
        const message = document.getElementById('message').value.trim();
        
        // Simple validation
        if (!name || !email || !subject || !message) {
            alert('Please fill in all fields');
            return;
        }
        
        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            alert('Please enter a valid email address');
            return;
        }
        
        // If validation passes, you can send the form data
        console.log('Form submitted:', { name, email, subject, message });
        
        // Show success message
        alert('Thank you for your message! I will get back to you soon.');
        
        // Reset form
        contactForm.reset();
        
        // Here you would typically send the data to a server
        // Example: fetch('/api/contact', { method: 'POST', body: JSON.stringify({ name, email, subject, message }) })
    });
}

// ===================================
// CURSOR FOLLOWER (Desktop only)
// ===================================

if (window.innerWidth > 1024) {
    const cursorFollower = document.querySelector('.cursor-follower');
    
    if (cursorFollower) {
        let mouseX = 0;
        let mouseY = 0;
        let cursorX = 0;
        let cursorY = 0;
        
        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });
        
        function animateCursor() {
            const speed = 0.2;
            
            cursorX += (mouseX - cursorX) * speed;
            cursorY += (mouseY - cursorY) * speed;
            
            cursorFollower.style.left = cursorX + 'px';
            cursorFollower.style.top = cursorY + 'px';
            
            requestAnimationFrame(animateCursor);
        }
        
        animateCursor();
        
        // Scale cursor on hover
        const hoverElements = document.querySelectorAll('a, button, .project-card, .blog-card');
        
        hoverElements.forEach(element => {
            element.addEventListener('mouseenter', () => {
                cursorFollower.style.transform = 'scale(2)';
            });
            
            element.addEventListener('mouseleave', () => {
                cursorFollower.style.transform = 'scale(1)';
            });
        });
    }
}

// ===================================
// TYPING EFFECT FOR HERO SUBTITLE
// ===================================

function typeWriter(element, text, speed = 100) {
    let i = 0;
    element.textContent = '';
    
    function type() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

// Optional: Add typing effect to subtitle
// Uncomment if you want this effect

window.addEventListener('load', () => {
    const subtitle = document.querySelector('.hero-subtitle');
    if (subtitle) {
        const text = 'Senior Frontend Engineer';
        typeWriter(subtitle, text, 80);
    }
});


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

// Uncomment if you want to add particle effect

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