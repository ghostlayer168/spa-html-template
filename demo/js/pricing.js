// Pricing Tab Functionality
function initPricingTabs() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    if (!tabBtns.length) return;
    
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const tabId = btn.getAttribute('data-tab');
            
            // Remove active class from all buttons and contents
            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));
            
            // Add active class to clicked button and corresponding content
            btn.classList.add('active');
            document.getElementById(tabId).classList.add('active');
        });
    });
}

// Price Calculator (Optional)
function initPriceCalculator() {
    const serviceCards = document.querySelectorAll('.pricing-card');
    
    serviceCards.forEach(card => {
        const bookBtn = card.querySelector('.btn, .btn-outline');
        
        bookBtn.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Get service details from the card
            const serviceName = card.querySelector('h3').textContent;
            const priceText = card.querySelector('.amount').textContent;
            const duration = card.querySelector('.duration').textContent;
            
            // Store in session storage for booking page
            sessionStorage.setItem('selectedService', JSON.stringify({
                name: serviceName,
                price: parseInt(priceText),
                duration: duration
            }));
            
            // Redirect to booking page
            window.location.href = 'booking-page.html';
        });
    });
}

// Initialize pricing features when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initPricingTabs();
    initPriceCalculator();
});