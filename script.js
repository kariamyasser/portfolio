// ===================================
// GSAP ANIMATIONS & SCROLL TRIGGERS
// ===================================

gsap.registerPlugin(ScrollTrigger);

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
// NAVBAR & NAVIGATION
// ===================================

const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Mobile menu toggle
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');

navToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    navToggle.classList.toggle('active');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        navToggle.classList.remove('active');
    });
});

// Active nav link on scroll
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (window.scrollY >= (sectionTop - 200)) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').slice(1) === current) {
            link.classList.add('active');
        }
    });
});

// ===================================
// GSAP SCROLL ANIMATIONS - FIXED
// ===================================

// Fade in sections - FIXED: Only animate sections that need it
const animatedSections = gsap.utils.toArray('.about, .skills, .experience, .projects, .education, .blog, .contact');

animatedSections.forEach(section => {
    gsap.from(section, {
        opacity: 1,
        y: 30,
        duration: 0.8,
        ease: 'power2.out',
        scrollTrigger: {
            trigger: section,
            start: 'top 85%',
            end: 'top 60%',
            toggleActions: 'play none none reverse',
            // markers: true // Uncomment for debugging
        }
    });
});

// Skills items animation with stagger - FIXED
const skillItems = document.querySelectorAll('.skill-item');
if (skillItems.length > 0) {
    gsap.from(skillItems, {
        opacity: 1,
        y: 20,
        stagger: 0.03,
        duration: 0.5,
        ease: 'power2.out',
        scrollTrigger: {
            trigger: '.skills-grid',
            start: 'top 80%',
            toggleActions: 'play none none reverse'
        }
    });
}

// Skill level bars animation - FIXED
const skillLevels = document.querySelectorAll('.skill-level');
if (skillLevels.length > 0) {
    ScrollTrigger.create({
        trigger: '.skills-grid',
        start: 'top 80%',
        onEnter: () => {
            skillLevels.forEach((bar, index) => {
                setTimeout(() => {
                    bar.style.opacity = '1';
                }, index * 30);
            });
        }
    });
}

// Timeline items animation - FIXED
const timelineItems = document.querySelectorAll('.timeline-item');
if (timelineItems.length > 0) {
    gsap.from(timelineItems, {
        opacity: 1,
        x: -30,
        stagger: 0.15,
        duration: 0.6,
        ease: 'power2.out',
        scrollTrigger: {
            trigger: '.timeline',
            start: 'top 75%',
            toggleActions: 'play none none reverse'
        }
    });
}

// Project cards animation - FIXED
const projectCards = document.querySelectorAll('.project-card');
if (projectCards.length > 0) {
    gsap.from(projectCards, {
        opacity: 1,
        y: 30,
        stagger: 0.1,
        duration: 0.6,
        ease: 'power2.out',
        scrollTrigger: {
            trigger: '.projects-grid',
            start: 'top 80%',
            toggleActions: 'play none none reverse'
        }
    });
}

// Education cards animation - FIXED
const educationCards = document.querySelectorAll('.education-card');
if (educationCards.length > 0) {
    gsap.from(educationCards, {
        opacity: 1,
        scale: 0.95,
        stagger: 0.1,
        duration: 0.5,
        ease: 'power2.out',
        scrollTrigger: {
            trigger: '.education-grid',
            start: 'top 80%',
            toggleActions: 'play none none reverse'
        }
    });
}

// Blog cards animation - FIXED
const blogCards = document.querySelectorAll('.blog-card');
if (blogCards.length > 0) {
    gsap.from(blogCards, {
        opacity: 1,
        y: 20,
        stagger: 0.08,
        duration: 0.5,
        ease: 'power2.out',
        scrollTrigger: {
            trigger: '.blog-grid',
            start: 'top 80%',
            toggleActions: 'play none none reverse'
        }
    });
}

// ===================================
// PROJECT FILTERING
// ===================================

const filterButtons = document.querySelectorAll('.filter-btn');
const allProjectCards = document.querySelectorAll('.project-card');

filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Track filter in analytics
        if (typeof gtag !== 'undefined') {
            gtag('event', 'filter_projects', {
                'filter_type': button.getAttribute('data-filter')
            });
        }
        
        // Remove active class from all buttons
        filterButtons.forEach(btn => btn.classList.remove('active'));
        // Add active class to clicked button
        button.classList.add('active');
        
        const filterValue = button.getAttribute('data-filter');
        
        allProjectCards.forEach(card => {
            if (filterValue === 'all') {
                gsap.to(card, {
                    opacity: 1,
                    scale: 1,
                    duration: 0.3,
                    display: 'block',
                    ease: 'power2.out'
                });
            } else {
                const categories = card.getAttribute('data-category').split(' ');
                if (categories.includes(filterValue)) {
                    gsap.to(card, {
                        opacity: 1,
                        scale: 1,
                        duration: 0.3,
                        display: 'block',
                        ease: 'power2.out'
                    });
                } else {
                    gsap.to(card, {
                        opacity: 1,
                        scale: 0.8,
                        duration: 0.3,
                        ease: 'power2.in',
                        onComplete: () => {
                            card.style.display = 'none';
                        }
                    });
                }
            }
        });
    });
});

// ===================================
// PROJECT MODAL
// ===================================

function openProjectModal(projectId) {
    // Track project view in analytics
    if (typeof gtag !== 'undefined') {
        gtag('event', 'view_project', {
            'project_id': projectId
        });
    }
    
    alert(`Opening project: ${projectId}\n\nYou can implement a full modal with detailed project information, screenshots, and links here.`);
}

// ===================================
// CONTACT FORM HANDLING
// ===================================

const contactForm = document.getElementById('contactForm');

if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const formData = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            subject: document.getElementById('subject').value,
            message: document.getElementById('message').value
        };
        
        // Track form submission in analytics
        if (typeof gtag !== 'undefined') {
            gtag('event', 'form_submit', {
                'form_name': 'contact_form'
            });
        }
        
        console.log('Form submitted:', formData);
        
        // Show success message
        alert('Thank you for your message! I will get back to you soon.');
        
        // Reset form
        contactForm.reset();
    });
}

// ===================================
// SMOOTH SCROLL
// ===================================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offsetTop = target.offsetTop - 80;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// ===================================
// TYPING EFFECT
// ===================================

const heroSubtitle = document.querySelector('.hero-subtitle');
if (heroSubtitle) {
    const text = heroSubtitle.textContent;
    heroSubtitle.textContent = '';

    let i = 0;
    function typeWriter() {
        if (i < text.length) {
            heroSubtitle.textContent += text.charAt(i);
            i++;
            setTimeout(typeWriter, 100);
        }
    }

    window.addEventListener('load', () => {
        setTimeout(typeWriter, 500);
    });
}

// ===================================
// CURSOR FOLLOWER
// ===================================

const cursor = document.createElement('div');
cursor.className = 'cursor-follower';
document.body.appendChild(cursor);

document.addEventListener('mousemove', (e) => {
    gsap.to(cursor, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.3
    });
});

const cursorStyle = document.createElement('style');
cursorStyle.textContent = `
    .cursor-follower {
        width: 20px;
        height: 20px;
        border: 2px solid var(--primary);
        border-radius: 50%;
        position: fixed;
        pointer-events: none;
        z-index: 9999;
        mix-blend-mode: difference;
        display: none;
    }
    
    @media (min-width: 1024px) {
        .cursor-follower {
            display: block;
        }
    }
`;
document.head.appendChild(cursorStyle);

// ===================================
// SCROLL PROGRESS INDICATOR
// ===================================

const progressBar = document.createElement('div');
progressBar.className = 'scroll-progress';
document.body.appendChild(progressBar);

window.addEventListener('scroll', () => {
    const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (window.scrollY / windowHeight) * 100;
    progressBar.style.width = scrolled + '%';
});

const progressStyle = document.createElement('style');
progressStyle.textContent = `
    .scroll-progress {
        position: fixed;
        top: 0;
        left: 0;
        height: 3px;
        background: var(--gradient-primary);
        z-index: 9999;
        transition: width 0.1s ease;
    }
`;
document.head.appendChild(progressStyle);

// ===================================
// ANALYTICS PAGE VIEW TRACKING
// ===================================

// Track page view
if (typeof gtag !== 'undefined') {
    gtag('config', 'G-XXXXXXXXXX', {
        'page_title': document.title,
        'page_path': window.location.pathname
    });
}

// Track scroll depth
let scrollDepth = 0;
window.addEventListener('scroll', () => {
    const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = Math.round((window.scrollY / windowHeight) * 100);
    
    if (scrolled > scrollDepth && scrolled % 25 === 0) {
        scrollDepth = scrolled;
        if (typeof gtag !== 'undefined') {
            gtag('event', 'scroll_depth', {
                'depth': scrollDepth
            });
        }
    }
});

// Track resume download
const resumeBtn = document.querySelector('.btn-download');
if (resumeBtn) {
    resumeBtn.addEventListener('click', () => {
        if (typeof gtag !== 'undefined') {
            gtag('event', 'download_resume', {
                'file_name': 'Kareem_Gabr_Resume.pdf'
            });
        }
    });
}

console.log('🚀 Portfolio website loaded successfully!');
console.log('Theme:', htmlElement.getAttribute('data-theme'));