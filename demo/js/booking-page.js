// Configuration
const CONFIG = {
    taxRate: 0.08,
    stripePublicKey: 'pk_test_YOUR_STRIPE_PUBLIC_KEY', // Replace with your Stripe key
    apiEndpoint: 'https://your-api.com/bookings'
};

// Services data
const SERVICES = [
    {
        id: 'hot-stone',
        name: 'Hot Stone Therapy',
        description: 'Deep muscle relaxation with warm stones',
        price: 89,
        duration: 60,
        icon: 'fas fa-hot-tub'
    },
    {
        id: 'aroma',
        name: 'Aroma Therapy',
        description: 'Essential oils for mental & physical relaxation',
        price: 79,
        duration: 60,
        icon: 'fas fa-wind'
    },
    {
        id: 'thai',
        name: 'Thai Massage',
        description: 'Traditional stretching & pressure points',
        price: 95,
        duration: 75,
        icon: 'fas fa-hands'
    },
    {
        id: 'deep-tissue',
        name: 'Deep Tissue',
        description: 'Targeted therapy for muscle tension',
        price: 85,
        duration: 60,
        icon: 'fas fa-hand-paper'
    },
    {
        id: 'couples',
        name: 'Couples Massage',
        description: 'Shared relaxation experience',
        price: 165,
        duration: 90,
        icon: 'fas fa-heart'
    },
    {
        id: 'facial',
        name: 'Relaxing Facial',
        description: 'Rejuvenating facial treatment',
        price: 75,
        duration: 50,
        icon: 'fas fa-smile'
    }
];

// Booking state
let bookingState = {
    service: null,
    date: null,
    time: null,
    duration: 60,
    details: {},
    paymentMethod: 'card',
    total: 0,
    subtotal: 0,
    tax: 0
};

// Stripe elements
let stripe, elements, cardNumber, cardExpiry, cardCvc;

// Initialize booking page
function initializeBooking() {
    populateServices();
    setupDatePicker();
    setupTimeSlots();
    setupStripe();
    setupPayPal();
    updateSummary();
    attachEventListeners();
}

// Populate services grid
function populateServices() {
    const grid = document.querySelector('.services-grid');
    if (!grid) return;
    
    grid.innerHTML = SERVICES.map(service => `
        <div class="service-option" data-service="${service.id}" onclick="selectService('${service.id}')">
            <div class="service-icon">
                <i class="${service.icon}"></i>
            </div>
            <h4>${service.name}</h4>
            <p class="service-desc">${service.description}</p>
            <p class="service-price">$${service.price}</p>
            <p class="service-duration">${service.duration} min</p>
        </div>
    `).join('');
    
    // Select first service by default
    selectService(SERVICES[0].id);
}

// Select service
function selectService(serviceId) {
    const service = SERVICES.find(s => s.id === serviceId);
    if (!service) return;
    
    // Update UI
    document.querySelectorAll('.service-option').forEach(el => {
        el.classList.remove('active');
    });
    document.querySelector(`[data-service="${serviceId}"]`).classList.add('active');
    
    // Update state
    bookingState.service = service;
    bookingState.duration = service.duration;
    bookingState.subtotal = service.price;
    bookingState.tax = service.price * CONFIG.taxRate;
    bookingState.total = bookingState.subtotal + bookingState.tax;
    
    // Update summary
    updateSummary();
}

// Setup date picker
function setupDatePicker() {
    const dateInput = document.getElementById('bookingDate');
    if (!dateInput) return;
    
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    dateInput.min = today.toISOString().split('T')[0];
    dateInput.value = tomorrow.toISOString().split('T')[0];
    
    dateInput.addEventListener('change', function() {
        bookingState.date = this.value;
        updateSummary();
    });
    
    bookingState.date = dateInput.value;
}

// Setup time slots
function setupTimeSlots() {
    const slotsContainer = document.getElementById('timeSlots');
    if (!slotsContainer) return;
    
    // Generate time slots (10 AM to 8 PM, every hour)
    const times = [];
    for (let hour = 10; hour <= 20; hour++) {
        const time = `${hour}:00`;
        times.push(time);
    }
    
    slotsContainer.innerHTML = times.map(time => `
        <div class="time-option" onclick="selectTime('${time}')">${formatTime(time)}</div>
    `).join('');
    
    // Select first time by default
    selectTime('14:00');
}

// Select time
function selectTime(time) {
    // Update UI
    document.querySelectorAll('.time-option').forEach(el => {
        el.classList.remove('selected');
    });
    
    const selectedEl = Array.from(document.querySelectorAll('.time-option'))
        .find(el => el.textContent === formatTime(time));
    
    if (selectedEl) {
        selectedEl.classList.add('selected');
    }
    
    // Update state
    bookingState.time = time;
    updateSummary();
}

// Format time for display
function formatTime(time24) {
    const [hours, minutes] = time24.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
}

// Setup Stripe
function setupStripe() {
    stripe = Stripe(CONFIG.stripePublicKey);
    elements = stripe.elements();
    
    const style = {
        base: {
            fontSize: '16px',
            color: '#32325d',
            fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
            '::placeholder': {
                color: '#aab7c4'
            }
        },
        invalid: {
            color: '#fa755a'
        }
    };
    
    cardNumber = elements.create('cardNumber', { style });
    cardExpiry = elements.create('cardExpiry', { style });
    cardCvc = elements.create('cardCvc', { style });
    
    cardNumber.mount('#cardNumber');
    cardExpiry.mount('#cardExpiry');
    cardCvc.mount('#cardCvc');
    
    // Handle real-time validation errors
    cardNumber.addEventListener('change', handleCardErrors);
    cardExpiry.addEventListener('change', handleCardErrors);
    cardCvc.addEventListener('change', handleCardErrors);
}

// Setup PayPal
function setupPayPal() {
    if (!window.paypal) return;
    
    paypal.Buttons({
        style: {
            layout: 'vertical',
            color: 'blue',
            shape: 'rect',
            label: 'paypal'
        },
        createOrder: function(data, actions) {
            return actions.order.create({
                purchase_units: [{
                    amount: {
                        value: bookingState.total.toFixed(2)
                    }
                }]
            });
        },
        onApprove: function(data, actions) {
            return actions.order.capture().then(function(details) {
                completeBooking('paypal', details.id);
            });
        },
        onError: function(err) {
            showError('PayPal payment failed. Please try again.');
        }
    }).render('#paypal-button');
}

// Handle card errors
function handleCardErrors(event) {
    const displayError = document.getElementById('card-errors');
    if (event.error) {
        displayError.textContent = event.error.message;
    } else {
        displayError.textContent = '';
    }
}

// Update booking summary
function updateSummary() {
    // Update sidebar
    document.getElementById('sidebar-service').textContent = 
        bookingState.service ? bookingState.service.name : '-';
    
    document.getElementById('sidebar-date').textContent = 
        bookingState.date ? formatDate(bookingState.date) : '-';
    
    document.getElementById('sidebar-time').textContent = 
        bookingState.time ? formatTime(bookingState.time) : '-';
    
    document.getElementById('sidebar-duration').textContent = 
        bookingState.duration ? `${bookingState.duration} min` : '-';
    
    document.getElementById('sidebar-subtotal').textContent = 
        `$${bookingState.subtotal.toFixed(2)}`;
    
    document.getElementById('sidebar-tax').textContent = 
        `$${bookingState.tax.toFixed(2)}`;
    
    document.getElementById('sidebar-total').textContent = 
        `$${bookingState.total.toFixed(2)}`;
}

// Format date for display
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

// Form navigation
function nextStep(step) {
    // Validate current step
    if (!validateStep(step - 1)) {
        return;
    }
    
    // Hide all steps
    document.querySelectorAll('.form-step').forEach(el => {
        el.classList.remove('active');
    });
    
    // Show target step
    document.getElementById(`step${step}`).classList.add('active');
    
    // Update steps indicator
    document.querySelectorAll('.step').forEach((el, index) => {
        el.classList.remove('active');
        if (index < step) {
            el.classList.add('active');
        }
    });
    
    // Scroll to top of form
    document.querySelector('.form-card').scrollIntoView({ behavior: 'smooth' });
}

function prevStep(step) {
    // Hide all steps
    document.querySelectorAll('.form-step').forEach(el => {
        el.classList.remove('active');
    });
    
    // Show target step
    document.getElementById(`step${step}`).classList.add('active');
    
    // Update steps indicator
    document.querySelectorAll('.step').forEach((el, index) => {
        el.classList.remove('active');
        if (index < step) {
            el.classList.add('active');
        }
    });
}

// Validate step
function validateStep(step) {
    switch(step) {
        case 1:
            if (!bookingState.service) {
                showError('Please select a service');
                return false;
            }
            break;
            
        case 2:
            if (!bookingState.date || !bookingState.time) {
                showError('Please select date and time');
                return false;
            }
            break;
            
        case 3:
            const form = document.getElementById('bookingForm');
            if (!form.checkValidity()) {
                form.reportValidity();
                return false;
            }
            
            // Save form data
            bookingState.details = {
                name: document.getElementById('fullName').value,
                email: document.getElementById('email').value,
                phone: document.getElementById('phone').value,
                message: document.getElementById('message').value
            };
            break;
    }
    
    return true;
}

// Submit payment
async function submitPayment() {
    if (bookingState.paymentMethod === 'card') {
        await processCardPayment();
    }
}

// Process card payment
async function processCardPayment() {
    showLoading(true);
    
    try {
        // Validate card
        const { token, error } = await stripe.createToken(cardNumber, {
            name: document.getElementById('cardName').value
        });
        
        if (error) {
            showError(error.message);
            showLoading(false);
            return;
        }
        
        // Here you would send the token to your server
       
        setTimeout(() => {
            completeBooking('card', `tok_${Date.now()}`);
        }, 1500);
        
    } catch (error) {
        showError('Payment processing failed');
        showLoading(false);
    }
}

// Complete booking
function completeBooking(paymentMethod, paymentId) {
    // Generate booking ID
    const bookingId = `ELAN-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    
    // Update confirmation page
    document.getElementById('summary-id').textContent = bookingId;
    document.getElementById('summary-service').textContent = bookingState.service.name;
    document.getElementById('summary-datetime').textContent = 
        `${formatDate(bookingState.date)} at ${formatTime(bookingState.time)}`;
    document.getElementById('summary-duration').textContent = `${bookingState.duration} minutes`;
    document.getElementById('summary-client').textContent = bookingState.details.name;
    document.getElementById('summary-total').textContent = `$${bookingState.total.toFixed(2)}`;
    
    // Show confirmation
    showLoading(false);
    nextStep(5);
    
    // Here you would send booking data to your server
    sendBookingToServer(bookingId, paymentId);
}

// Send booking to server (mock)
function sendBookingToServer(bookingId, paymentId) {
    const bookingData = {
        ...bookingState,
        bookingId,
        paymentId,
        timestamp: new Date().toISOString()
    };
    
    console.log('Booking data:', bookingData);
    // In production: fetch(CONFIG.apiEndpoint, { method: 'POST', body: JSON.stringify(bookingData) })
}

// Start new booking
function startNewBooking() {
    // Reset state
    bookingState = {
        service: null,
        date: null,
        time: null,
        duration: 60,
        details: {},
        paymentMethod: 'card',
        total: 0,
        subtotal: 0,
        tax: 0
    };
    
    // Reset form
    document.getElementById('bookingForm').reset();
    document.querySelectorAll('.service-option, .time-option').forEach(el => {
        el.classList.remove('active', 'selected');
    });
    
    // Go to step 1
    document.querySelectorAll('.form-step').forEach(el => {
        el.classList.remove('active');
    });
    document.getElementById('step1').classList.add('active');
    
    // Reset steps indicator
    document.querySelectorAll('.step').forEach((el, index) => {
        el.classList.remove('active');
        if (index === 0) {
            el.classList.add('active');
        }
    });
    
    // Reinitialize
    initializeBooking();
}

// Show/hide loading modal
function showLoading(show) {
    const modal = document.getElementById('loadingModal');
    if (show) {
        modal.classList.add('active');
    } else {
        modal.classList.remove('active');
    }
}

// Show error message
function showError(message) {
    alert(message); // In production, use a better error display
}

// Attach event listeners
function attachEventListeners() {
    // Payment method selection
    document.querySelectorAll('.payment-method').forEach(el => {
        el.addEventListener('click', function() {
            const method = this.dataset.method;
            
            // Update UI
            document.querySelectorAll('.payment-method').forEach(m => {
                m.classList.remove('active');
            });
            this.classList.add('active');
            
            // Show/hide forms
            if (method === 'card') {
                document.querySelector('.card-payment-form').style.display = 'block';
                document.querySelector('.paypal-payment-form').style.display = 'none';
            } else {
                document.querySelector('.card-payment-form').style.display = 'none';
                document.querySelector('.paypal-payment-form').style.display = 'block';
            }
            
            bookingState.paymentMethod = method;
        });
    });
    
    // Submit payment button
    document.getElementById('submitPayment').addEventListener('click', submitPayment);
    
    // Form validation on input
    document.querySelectorAll('#bookingForm input, #bookingForm textarea').forEach(input => {
        input.addEventListener('blur', function() {
            validateField(this);
        });
    });
}

// Validate field
function validateField(field) {
    const errorElement = field.parentElement.querySelector('.error-message');
    
    if (!field.checkValidity()) {
        errorElement.textContent = field.validationMessage;
        field.style.borderColor = '#e74c3c';
    } else {
        errorElement.textContent = '';
        field.style.borderColor = '#eee';
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initializeBooking);
