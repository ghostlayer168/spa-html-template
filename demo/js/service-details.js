
document.addEventListener('DOMContentLoaded', function() {
    
    // Image gallery
    const thumbnails = document.querySelectorAll('.thumbnail');
    const mainImage = document.getElementById('mainImage');
    const zoomBtn = document.getElementById('zoomBtn');
    const imageModal = document.getElementById('imageModal');
    const modalImage = document.getElementById('modalImage');
    const modalClose = document.getElementById('modalClose');
    
    // Switching thumbnails
    thumbnails.forEach(thumb => {
        thumb.addEventListener('click', function() {
            // Remove active class from all thumbnails
            thumbnails.forEach(t => t.classList.remove('active'));
            
            // Add active class to current thumbnail
            this.classList.add('active');
            
            // Change main image
            const newImage = this.getAttribute('data-image');
            mainImage.src = newImage;
            mainImage.alt = this.querySelector('img').alt;
        });
    });
    
    // Opening modal window with image
    zoomBtn.addEventListener('click', function() {
        modalImage.src = mainImage.src;
        modalImage.alt = mainImage.alt;
        imageModal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    });
    
    // Closing modal window
    modalClose.addEventListener('click', closeModal);
    imageModal.addEventListener('click', function(e) {
        if (e.target === imageModal) {
            closeModal();
        }
    });
    
    // Close on ESC
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && imageModal.style.display === 'flex') {
            closeModal();
        }
    });
    
    function closeModal() {
        imageModal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
    
    // FAQ accordion
    const faqQuestions = document.querySelectorAll('.faq-question');
    
    faqQuestions.forEach(question => {
        question.addEventListener('click', function() {
            const answer = this.nextElementSibling;
            const isActive = this.classList.contains('active');
            
            // Close all open questions
            faqQuestions.forEach(q => {
                q.classList.remove('active');
                q.nextElementSibling.style.maxHeight = null;
            });
            
            
            if (!isActive) {
                this.classList.add('active');
                answer.style.maxHeight = answer.scrollHeight + 'px';
            }
        });
    });
    
    // Smooth image loading
    const images = document.querySelectorAll('img[data-src]');
    const imageOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px 50px 0px'
    };
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.getAttribute('data-src');
                img.removeAttribute('data-src');
                observer.unobserve(img);
            }
        });
    }, imageOptions);
    
    images.forEach(img => imageObserver.observe(img));
    
    // Dynamic page title update on scroll
    let originalTitle = document.title;
    let isScrolled = false;
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 100 && !isScrolled) {
            document.title = "Hot Stone Therapy - Book Now | Élan Spa";
            isScrolled = true;
        } else if (window.scrollY <= 100 && isScrolled) {
            document.title = originalTitle;
            isScrolled = false;
        }
    });
    
    // Animation of elements appearing on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);
    
    // Observe all sections
    document.querySelectorAll('.service-content > section, .service-sidebar > *').forEach(el => {
        observer.observe(el);
    });
});