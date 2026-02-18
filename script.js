document.addEventListener('DOMContentLoaded', () => {

    // --- Mobile Navigation ---
    const navMenu = document.getElementById('nav-menu');
    const navToggle = document.getElementById('nav-toggle');
    const navClose = document.getElementById('nav-close');
    const navLinks = document.querySelectorAll('.nav-link');

    function handleKeyboard(event, callback) {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            callback();
        }
    }

    if (navToggle) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.add('active');
        });
        navToggle.addEventListener('keydown', (e) => handleKeyboard(e, () => navMenu.classList.add('active')));
    }

    if (navClose) {
        navClose.addEventListener('click', () => {
            navMenu.classList.remove('active');
        });
        navClose.addEventListener('keydown', (e) => handleKeyboard(e, () => navMenu.classList.remove('active')));
    }

    // Close menu when clicking a link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
        });
    });

    // --- Modal Functionality ---
    const modal = document.getElementById('modal');
    const modalCloseBtn = document.querySelector('.modal-close');
    const modalOverlay = document.querySelector('.modal-overlay');
    const serviceSelect = document.getElementById('service');

    window.openModal = function (serviceName) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent scrolling

        if (serviceName) {
            // Select the option if it exists
            const option = Array.from(serviceSelect.options).find(opt => opt.value === serviceName);
            if (option) {
                serviceSelect.value = serviceName;
            }
        }
    };

    window.closeModal = function () {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    };

    // Close on outside click
    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) {
            closeModal();
        }
    });

    // --- Scroll Animations (Intersection Observer) ---
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // Only animate once
            }
        });
    }, observerOptions);

    const fadeElements = document.querySelectorAll('.fade-up');
    fadeElements.forEach(el => observer.observe(el));


    // --- FAQ Accordion ---
    const faqQuestions = document.querySelectorAll('.faq-question');

    faqQuestions.forEach(question => {
        question.addEventListener('click', () => {
            const item = question.parentElement;

            // Close others (accordion style) - optional, keeping it open allows comparing
            /*
            document.querySelectorAll('.faq-item').forEach(i => {
                if (i !== item) i.classList.remove('active');
            });
            */

            item.classList.toggle('active');

            // Toggle icon rotation is handled by CSS based on .active class
        });
    });


    // --- Form Handling ---
    const bookingForm = document.getElementById('booking-form');

    if (bookingForm) {
        bookingForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const submitBtn = bookingForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerText;
            submitBtn.innerText = 'Sending...';
            submitBtn.disabled = true;

            const formData = new FormData(bookingForm);

            // Construct Netlify-friendly body
            const params = new URLSearchParams(formData).toString();

            fetch('/', {
                method: 'POST',
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                body: params
            })
                .then(() => {
                    alert('Booking Request Sent! We will contact you shortly.');
                    bookingForm.reset();
                    closeModal();
                })
                .catch((error) => {
                    console.error('Form submission error:', error);

                    // Fallback to WhatsApp
                    const name = formData.get('name');
                    const phone = formData.get('phone');
                    const service = formData.get('service');
                    const location = formData.get('location');

                    const message = `Hi RepairAtHome, I tried booking on your website but it failed. \nName: ${name}\nPhone: ${phone}\nService: ${service}\nLocation: ${location}`;

                    const whatsappUrl = `https://wa.me/919170827626?text=${encodeURIComponent(message)}`;

                    if (confirm('Submission failed due to network issues. Redirect to WhatsApp/Phone to book?')) {
                        window.open(whatsappUrl, '_blank');
                    }
                })
                .finally(() => {
                    submitBtn.innerText = originalText;
                    submitBtn.disabled = false;
                });
        });
    }

});
