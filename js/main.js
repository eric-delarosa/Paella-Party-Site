/**
 * Paella Party NJ - Main JavaScript
 * Handles interactive elements like navigation, gallery filtering, and form validation
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initNavigation();
    initMenuTabs();
    initGalleryFilter();
    initContactForm();
    initScrollAnimation();
    
    // Add smooth scrolling to all links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                window.scrollTo({
                    top: target.offsetTop - 70, // Adjust for fixed header
                    behavior: 'smooth'
                });
            }
        });
    });
});

/**
 * Mobile Navigation
 */
function initNavigation() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            hamburger.classList.toggle('active');
        });
        
        // Close menu when clicking on a nav link
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', function() {
                navMenu.classList.remove('active');
                hamburger.classList.remove('active');
            });
        });
    }
    
    // Add active class to current nav item
    const currentLocation = window.location.pathname;
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        const linkPath = link.getAttribute('href');
        // Check if the current location ends with the link path for a more precise match
        // Check if the current location exactly matches the link path or ends with the link path preceded by a slash
        if (linkPath !== '#' && (currentLocation === linkPath || currentLocation.endsWith('/' + linkPath))) {
            link.classList.add('active');
        } else if (currentLocation.endsWith('/') && linkPath === 'index.html') {
            // Special case for index.html when the URL is just the root
            link.classList.add('active');
        }
    });
}

/**
 * Menu Tabs
 */
function initMenuTabs() {
    const menuTabs = document.querySelectorAll('.menu-tab');
    const menuContents = document.querySelectorAll('.menu-content');
    
    if (menuTabs.length && menuContents.length) {
        menuTabs.forEach(tab => {
            tab.addEventListener('click', function() {
                // Remove active class from all tabs and contents
                menuTabs.forEach(t => t.classList.remove('active'));
                menuContents.forEach(c => c.classList.remove('active'));
                
                // Add active class to current tab and corresponding content
                this.classList.add('active');
                const target = this.getAttribute('data-target');
                document.querySelector(`.menu-content[data-id="${target}"]`).classList.add('active');
            });
        });
    }
}

/**
 * Gallery Filter
 */
function initGalleryFilter() {
    const filterBtns = document.querySelectorAll('.gallery-filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    if (filterBtns.length && galleryItems.length) {
        filterBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                // Remove active class from all buttons
                filterBtns.forEach(b => b.classList.remove('active'));
                
                // Add active class to current button
                this.classList.add('active');
                
                const filter = this.getAttribute('data-filter');
                
                // Show/hide gallery items based on filter
                galleryItems.forEach(item => {
                    if (filter === 'all' || item.classList.contains(filter)) {
                        item.style.display = 'block';
                    } else {
                        item.style.display = 'none';
                    }
                });
            });
        });
    }
}

/**
 * Contact Form Validation
 */
function initContactForm() {
    const contactForm = document.querySelector('.contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            // Prevent default form submission
            e.preventDefault();
            
            // Get form fields
            const nameInput = document.getElementById('name');
            const emailInput = document.getElementById('email');
            const phoneInput = document.getElementById('phone');
            const messageInput = document.getElementById('message');
            const eventTypeInput = document.getElementById('event-type');
            const eventDateInput = document.getElementById('event-date');
            const guestsInput = document.getElementById('guests');
            
            // Simple validation
            let isValid = true;
            
            if (!nameInput.value.trim()) {
                showError(nameInput, 'Please enter your name');
                isValid = false;
            } else {
                removeError(nameInput);
            }
            
            if (!emailInput.value.trim()) {
                showError(emailInput, 'Please enter your email');
                isValid = false;
            } else if (!isValidEmail(emailInput.value)) {
                showError(emailInput, 'Please enter a valid email');
                isValid = false;
            } else {
                removeError(emailInput);
            }
            
            if (phoneInput && !isValidPhone(phoneInput.value) && phoneInput.value.trim()) {
                showError(phoneInput, 'Please enter a valid phone number');
                isValid = false;
            } else if (phoneInput) {
                removeError(phoneInput);
            }
            
            if (!messageInput.value.trim()) {
                showError(messageInput, 'Please enter your message');
                isValid = false;
            } else {
                removeError(messageInput);
            }
            
            // If form is valid, submit via AJAX
            if (isValid) {
                const formData = new FormData(contactForm);
                
                fetch(contactForm.action, {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Accept': 'application/json'
                    }
                })
                .then(response => {
                    if (response.ok) {
                        // Show success message
                        contactForm.innerHTML = `
                            <div class="form-success">
                                <h3>Thank you for your message!</h3>
                                <p>We'll get back to you as soon as possible.</p>
                            </div>
                        `;
                    } else {
                        // Handle errors
                        response.json().then(data => {
                            if (Object.hasOwn(data, 'errors')) {
                                // Handle Formspree errors
                                alert(data["errors"].map(error => error["message"]).join(", "));
                            } else {
                                alert('Oops! There was a problem submitting your form');
                            }
                        });
                    }
                })
                .catch(error => {
                    alert('Oops! There was a problem submitting your form');
                });
            }
        });
    }
}

/**
 * Show error message for form field
 */
function showError(input, message) {
    const formGroup = input.closest('.form-group');
    const errorElement = formGroup.querySelector('.error-message') || document.createElement('div');
    
    errorElement.className = 'error-message';
    errorElement.textContent = message;
    
    if (!formGroup.querySelector('.error-message')) {
        formGroup.appendChild(errorElement);
    }
    
    input.classList.add('is-invalid');
}

/**
 * Remove error message from form field
 */
function removeError(input) {
    const formGroup = input.closest('.form-group');
    const errorElement = formGroup.querySelector('.error-message');
    
    if (errorElement) {
        formGroup.removeChild(errorElement);
    }
    
    input.classList.remove('is-invalid');
}

/**
 * Validate email format
 */
function isValidEmail(email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

/**
 * Validate phone number format
 */
function isValidPhone(phone) {
    const re = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
    return re.test(String(phone));
}

/**
 * Scroll Animation
 */
function initScrollAnimation() {
    const elements = document.querySelectorAll('.fade-in, .fade-up, .fade-right');
    
    // Create intersection observer
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1
    });
    
    // Observe each element
    elements.forEach(element => {
        observer.observe(element);
    });
}

/**
 * Lightbox for Gallery
 */
function openLightbox(imgSrc) {
    const lightbox = document.createElement('div');
    lightbox.className = 'lightbox';
    
    const img = document.createElement('img');
    img.src = imgSrc;
    
    const closeBtn = document.createElement('span');
    closeBtn.className = 'lightbox-close';
    closeBtn.innerHTML = '&times;';
    closeBtn.addEventListener('click', () => {
        document.body.removeChild(lightbox);
    });
    
    lightbox.appendChild(img);
    lightbox.appendChild(closeBtn);
    
    document.body.appendChild(lightbox);
    
    // Close lightbox when clicking outside the image
    lightbox.addEventListener('click', function(e) {
        if (e.target === this) {
            document.body.removeChild(lightbox);
        }
    });
}