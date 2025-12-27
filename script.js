// Theme Toggle Functionality
const themeToggle = document.getElementById('theme-toggle');
const themeIcon = document.getElementById('theme-icon');
const html = document.documentElement;

// Check for saved theme preference or default to light mode
const currentTheme = localStorage.getItem('theme') || 'light';
html.setAttribute('data-theme', currentTheme);
updateThemeIcon(currentTheme);

function updateThemeIcon(theme) {
    if (themeIcon) {
        themeIcon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
    }
}

if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        const currentTheme = html.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        html.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(newTheme);
        
        // Add animation class
        themeToggle.style.transform = 'rotate(360deg) scale(1.2)';
        setTimeout(() => {
            themeToggle.style.transform = '';
        }, 300);
    });
}

// Typing Animation
const typingTexts = [
    'AI/ML Researcher',
    'Data Scientist',
    'Computer Vision Specialist',
    'LLM Enthusiast',
    'Student Tutor'
];

let currentTextIndex = 0;
let currentCharIndex = 0;
let isDeleting = false;
const typingElement = document.getElementById('typing-text');

function typeText() {
    const currentText = typingTexts[currentTextIndex];
    
    if (isDeleting) {
        typingElement.textContent = currentText.substring(0, currentCharIndex - 1);
        currentCharIndex--;
        
        if (currentCharIndex === 0) {
            isDeleting = false;
            currentTextIndex = (currentTextIndex + 1) % typingTexts.length;
        }
    } else {
        typingElement.textContent = currentText.substring(0, currentCharIndex + 1);
        currentCharIndex++;
        
        if (currentCharIndex === currentText.length) {
            isDeleting = true;
            setTimeout(typeText, 2000);
            return;
        }
    }
    
    setTimeout(typeText, isDeleting ? 50 : 100);
}

// Start typing animation
if (typingElement) {
    typeText();
}

// Navbar scroll effect
const navbar = document.getElementById('navbar');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
    
    lastScroll = currentScroll;
});

// Mobile menu toggle
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('nav-menu');

if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        hamburger.classList.toggle('active');
    });

    // Close menu when clicking on a link
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            hamburger.classList.remove('active');
        });
    });
}

// Smooth scroll for navigation links
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

// Enhanced Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
            // Stop observing once animated
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe all sections with staggered animation
document.querySelectorAll('section').forEach((section, index) => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(30px)';
    section.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
    observer.observe(section);
});

// Observe cards and timeline items with delay
document.querySelectorAll('.experience-card, .project-card, .skill-category').forEach((item, index) => {
    item.style.opacity = '0';
    observer.observe(item);
});

// Observe timeline items
document.querySelectorAll('.timeline-item').forEach((item, index) => {
    item.style.opacity = '0';
    observer.observe(item);
});

// Animate doodle art on scroll
const doodleObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animationPlayState = 'running';
        } else {
            entry.target.style.animationPlayState = 'paused';
        }
    });
}, { threshold: 0.1 });

document.querySelectorAll('.doodle-art').forEach(doodle => {
    doodleObserver.observe(doodle);
});

// Project Filter and Search Functionality
const projectSearch = document.getElementById('project-search');
const clearSearchBtn = document.getElementById('clear-search');
const filterButtons = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');
const projectsGrid = document.getElementById('projects-grid');

let currentFilter = 'all';
let currentSearch = '';

// Filter functionality
filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        // Update active state
        filterButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        currentFilter = btn.dataset.filter;
        filterProjects();
    });
});

// Search functionality
if (projectSearch) {
    projectSearch.addEventListener('input', (e) => {
        currentSearch = e.target.value.toLowerCase().trim();
        
        if (currentSearch) {
            clearSearchBtn.style.display = 'block';
        } else {
            clearSearchBtn.style.display = 'none';
        }
        
        filterProjects();
    });
}

// Clear search
if (clearSearchBtn) {
    clearSearchBtn.addEventListener('click', () => {
        projectSearch.value = '';
        currentSearch = '';
        clearSearchBtn.style.display = 'none';
        filterProjects();
    });
}

function filterProjects() {
    let visibleCount = 0;
    
    projectCards.forEach(card => {
        const tech = card.dataset.tech || '';
        const title = card.dataset.title || '';
        const cardText = (tech + ' ' + title).toLowerCase();
        
        const matchesFilter = currentFilter === 'all' || tech.includes(currentFilter);
        const matchesSearch = !currentSearch || cardText.includes(currentSearch);
        
        if (matchesFilter && matchesSearch) {
            card.classList.remove('hidden');
            card.classList.add('fade-in');
            visibleCount++;
        } else {
            card.classList.add('hidden');
            card.classList.remove('fade-in');
        }
    });
    
    // Show no results message if needed
    let noResults = document.getElementById('no-results');
    if (visibleCount === 0) {
        if (!noResults) {
            noResults = document.createElement('div');
            noResults.id = 'no-results';
            noResults.className = 'no-results';
            noResults.innerHTML = '<i class="fas fa-search"></i><p>No projects found matching your criteria.</p>';
            projectsGrid.appendChild(noResults);
        }
    } else {
        if (noResults) {
            noResults.remove();
        }
    }
}

// Animate Progress Bars on Scroll
const progressObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const progressFill = entry.target.querySelector('.progress-fill');
            const progress = progressFill.dataset.progress;
            
            setTimeout(() => {
                progressFill.style.width = progress + '%';
            }, 100);
            
            progressObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

document.querySelectorAll('.skill-progress-item').forEach(item => {
    progressObserver.observe(item);
});

// Back to Top Button
const backToTopBtn = document.getElementById('back-to-top');

window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
        backToTopBtn.classList.add('visible');
    } else {
        backToTopBtn.classList.remove('visible');
    }
});

if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Enhanced Contact Form Validation
const contactForm = document.getElementById('contact-form');
const submitBtn = document.getElementById('submit-btn');
const btnText = submitBtn.querySelector('.btn-text');
const btnLoader = submitBtn.querySelector('.btn-loader');
const formFeedback = document.getElementById('form-feedback');

// Validation rules
const validationRules = {
    name: {
        required: true,
        minLength: 2,
        pattern: /^[a-zA-Z\s]+$/,
        message: 'Name must be at least 2 characters and contain only letters'
    },
    email: {
        required: true,
        pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        message: 'Please enter a valid email address'
    },
    subject: {
        required: true,
        minLength: 3,
        message: 'Subject must be at least 3 characters'
    },
    message: {
        required: true,
        minLength: 10,
        message: 'Message must be at least 10 characters'
    }
};

function validateField(fieldName, value) {
    const rules = validationRules[fieldName];
    const field = document.getElementById(fieldName);
    const errorElement = document.getElementById(`${fieldName}-error`);
    
    // Remove previous states
    field.classList.remove('error', 'success');
    errorElement.classList.remove('show');
    errorElement.textContent = '';
    
    // Check required
    if (rules.required && !value.trim()) {
        showError(field, errorElement, 'This field is required');
        return false;
    }
    
    // Check min length
    if (rules.minLength && value.trim().length < rules.minLength) {
        showError(field, errorElement, rules.message);
        return false;
    }
    
    // Check pattern
    if (rules.pattern && !rules.pattern.test(value.trim())) {
        showError(field, errorElement, rules.message);
        return false;
    }
    
    // Success
    field.classList.add('success');
    return true;
}

function showError(field, errorElement, message) {
    field.classList.add('error');
    errorElement.textContent = message;
    errorElement.classList.add('show');
}

function showFormFeedback(message, type) {
    formFeedback.textContent = message;
    formFeedback.className = `form-feedback ${type} show`;
    
    setTimeout(() => {
        formFeedback.classList.remove('show');
        setTimeout(() => {
            formFeedback.textContent = '';
            formFeedback.className = 'form-feedback';
        }, 300);
    }, 5000);
}

// Real-time validation
Object.keys(validationRules).forEach(fieldName => {
    const field = document.getElementById(fieldName);
    if (field) {
        field.addEventListener('blur', () => {
            validateField(fieldName, field.value);
        });
        
        field.addEventListener('input', () => {
            if (field.classList.contains('error')) {
                validateField(fieldName, field.value);
            }
        });
    }
});

// Form submission
if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Validate all fields
        let isValid = true;
        const formData = {};
        
        Object.keys(validationRules).forEach(fieldName => {
            const field = document.getElementById(fieldName);
            const value = field.value;
            formData[fieldName] = value;
            
            if (!validateField(fieldName, value)) {
                isValid = false;
            }
        });
        
        if (!isValid) {
            showFormFeedback('Please fix the errors in the form', 'error');
            return;
        }
        
        // Show loading state
        btnText.style.display = 'none';
        btnLoader.style.display = 'inline-block';
        submitBtn.disabled = true;
        
        // Simulate form submission (replace with actual API call)
        try {
            // Create mailto link
            const mailtoLink = `mailto:pratek.aiml@gmail.com?subject=${encodeURIComponent(formData.subject)}&body=${encodeURIComponent(`Name: ${formData.name}\nEmail: ${formData.email}\n\nMessage:\n${formData.message}`)}`;
            
            // Simulate delay
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            // Open email client
            window.location.href = mailtoLink;
            
            // Show success message
            showFormFeedback('Message sent successfully! I\'ll get back to you soon.', 'success');
            
            // Reset form
            contactForm.reset();
            Object.keys(validationRules).forEach(fieldName => {
                const field = document.getElementById(fieldName);
                field.classList.remove('error', 'success');
                document.getElementById(`${fieldName}-error`).classList.remove('show');
            });
            
        } catch (error) {
            showFormFeedback('An error occurred. Please try again or email me directly.', 'error');
        } finally {
            // Reset button state
            btnText.style.display = 'inline';
            btnLoader.style.display = 'none';
            submitBtn.disabled = false;
        }
    });
}

// Enhanced parallax effect with multiple layers
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    const orbs = document.querySelectorAll('.gradient-orb');
    const doodles = document.querySelectorAll('.doodle-art');
    
    if (hero) {
        hero.style.transform = `translateY(${scrolled * 0.3}px)`;
    }
    
    // Parallax for orbs
    orbs.forEach((orb, index) => {
        const speed = (index + 1) * 0.1;
        orb.style.transform = `translateY(${scrolled * speed}px)`;
    });
    
    // Parallax for doodles
    doodles.forEach((doodle, index) => {
        const speed = (index % 2 === 0 ? 1 : -1) * 0.15;
        const currentTransform = doodle.style.transform || '';
        doodle.style.transform = `${currentTransform} translateY(${scrolled * speed}px)`;
    });
});

// Add counter animation for stats
const animateCounter = (element, target, duration = 2000) => {
    let start = 0;
    const increment = target / (duration / 16);
    
    const updateCounter = () => {
        start += increment;
        if (start < target) {
            element.textContent = Math.floor(start) + '+';
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = target + '+';
        }
    };
    
    updateCounter();
};

// Observe stat cards and animate counters
const statObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const statNumber = entry.target.querySelector('.stat-number');
            if (statNumber && !statNumber.dataset.animated) {
                const text = statNumber.textContent;
                const number = parseInt(text.replace(/\D/g, ''));
                if (number) {
                    statNumber.textContent = '0+';
                    animateCounter(statNumber, number);
                    statNumber.dataset.animated = 'true';
                }
            }
        }
    });
}, { threshold: 0.5 });

document.querySelectorAll('.stat-card').forEach(card => {
    statObserver.observe(card);
});

// Enhanced hover effects with animations
document.querySelectorAll('.skill-item').forEach((item, index) => {
    item.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-5px) scale(1.1) rotate(2deg)';
        this.style.transition = 'all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
    });
    
    item.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1) rotate(0deg)';
    });
    
    // Staggered initial animation
    setTimeout(() => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(20px)';
        item.style.transition = 'all 0.4s ease';
        
        setTimeout(() => {
            item.style.opacity = '1';
            item.style.transform = 'translateY(0)';
        }, index * 50);
    }, 100);
});

// Add floating animation to stat cards
document.querySelectorAll('.stat-card').forEach((card, index) => {
    setInterval(() => {
        const randomY = Math.sin(Date.now() / 1000 + index) * 5;
        card.style.transform = `translateY(${randomY}px)`;
    }, 50);
});

// Add mouse tracking effect to project cards
document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('mousemove', function(e) {
        const rect = this.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (y - centerY) / 10;
        const rotateY = (centerX - x) / 10;
        
        this.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px)`;
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
    });
});

// Add ripple effect to buttons
document.querySelectorAll('.btn').forEach(button => {
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

// Add CSS for ripple effect and additional animations
const style = document.createElement('style');
style.textContent = `
    .btn {
        position: relative;
        overflow: hidden;
    }
    
    .ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.6);
        transform: scale(0);
        animation: ripple-animation 0.6s ease-out;
        pointer-events: none;
    }
    
    @keyframes ripple-animation {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
    
    .animate-in {
        opacity: 1 !important;
        transform: translateY(0) !important;
    }
    
    /* Smooth theme transition */
    * {
        transition: background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease;
    }
    
    /* Enhanced scroll animations */
    @keyframes slideInFromBottom {
        from {
            opacity: 0;
            transform: translateY(50px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    /* Pulse animation for interactive elements */
    @keyframes gentlePulse {
        0%, 100% {
            transform: scale(1);
        }
        50% {
            transform: scale(1.05);
        }
    }
    
    .project-card:hover .project-icon {
        animation: gentlePulse 1s ease-in-out infinite;
    }
    
    .experience-card:hover .exp-icon {
        animation: gentlePulse 1s ease-in-out infinite;
    }
`;
document.head.appendChild(style);

// Add cursor trail effect (optional, can be disabled)
let cursorTrail = [];
const maxTrailLength = 10;

document.addEventListener('mousemove', (e) => {
    if (window.innerWidth > 768) { // Only on desktop
        const trail = document.createElement('div');
        trail.className = 'cursor-trail';
        trail.style.left = e.clientX + 'px';
        trail.style.top = e.clientY + 'px';
        document.body.appendChild(trail);
        
        cursorTrail.push(trail);
        
        if (cursorTrail.length > maxTrailLength) {
            const oldTrail = cursorTrail.shift();
            oldTrail.remove();
        }
        
        setTimeout(() => {
            trail.style.opacity = '0';
            trail.style.transform = 'scale(0)';
            setTimeout(() => trail.remove(), 300);
        }, 100);
    }
});

// Add cursor trail styles
const cursorStyle = document.createElement('style');
cursorStyle.textContent = `
    .cursor-trail {
        position: fixed;
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: var(--primary-color);
        pointer-events: none;
        z-index: 9999;
        opacity: 0.6;
        transform: translate(-50%, -50%);
        transition: opacity 0.3s ease, transform 0.3s ease;
    }
    
    [data-theme="dark"] .cursor-trail {
        background: var(--secondary-color);
    }
`;
document.head.appendChild(cursorStyle);

