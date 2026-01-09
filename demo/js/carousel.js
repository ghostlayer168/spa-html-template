

class LuxuryTestimonialsCarousel {
  constructor() {
    this.container = document.querySelector('.luxury-carousel-container');
    if (!this.container) return;
    
    // Main elements
    this.mainTestimonial = this.container.querySelector('.main-testimonial');
    this.testimonialText = this.container.querySelector('.testimonial-text');
    this.clientAvatar = this.container.querySelector('.client-avatar img');
    this.clientName = this.container.querySelector('.client-details h4');
    this.clientRole = this.container.querySelector('.client-role');
    this.clientRating = this.container.querySelector('.client-rating');
    this.testimonialBg = this.container.querySelector('.testimonial-bg');
    
    // Mini carousel
    this.miniCards = this.container.querySelectorAll('.mini-card');
    this.miniTrack = this.container.querySelector('.mini-track');
    this.prevBtn = this.container.querySelector('.prev-btn');
    this.nextBtn = this.container.querySelector('.next-btn');
    
    // Review data
    this.testimonials = [
      {
        text: "The hot stone therapy was absolutely transformative. Every muscle tension dissolved into pure relaxation. Anna's expertise made this the best spa experience of my life!",
        name: "Sarah Johnson",
        role: "Regular Client • 12 Visits",
        rating: 5.0,
        image: "images/client-1.webp",
        service: "Hot Stone Therapy",
        bgImage: "images/testimonial-bg-1.webp"
      },
      {
        text: "Michael's Thai massage was exactly what my body needed after years of desk work. The stretching techniques improved my flexibility immediately. Truly a master of his craft!",
        name: "Michael Smith",
        role: "First Visit • Office Worker",
        rating: 4.5,
        image: "images/client-2.webp",
        service: "Thai Massage",
        bgImage: "images/hot-stone-3.webp"
      },
      {
        text: "Sophia's aroma therapy session transported me to another world. The essential oils selection was perfect for my stress levels. I left feeling lighter and more centered than ever.",
        name: "Emma Davis",
        role: "Monthly Member • 8 Sessions",
        rating: 5.0,
        image: "images/client-3.webp",
        service: "Aroma Therapy",
        bgImage: "images/testimonial-bg-1.webp"
      },
      {
        text: "The couples massage was our perfect anniversary gift. Professional, intimate, and the atmosphere was magical. We're already planning our next visit together!",
        name: "Robert & Maria",
        role: "Couples Package • Anniversary",
        rating: 5.0,
        image: "images/client-4.webp",
        service: "Couples Massage",
        bgImage: "images/hot-stone-3.webp"
      },
      {
        text: "As a yoga instructor, I'm very particular about bodywork. David's deep tissue massage was exactly what my overworked muscles needed. Precision and power in perfect balance.",
        name: "Lisa Yang",
        role: "Yoga Instructor • 6 Visits",
        rating: 5.0,
        image: "images/client-5.webp",
        service: "Deep Tissue",
        bgImage: "images/testimonial-bg-1.webp"
      },
      {
        text: "After my marathon, the sports recovery package was a lifesaver. The combination of techniques had me back on my feet faster than I thought possible. Essential for any athlete!",
        name: "David Miller",
        role: "Marathon Runner • 3 Sessions",
        rating: 5.0,
        image: "images/client-6.webp",
        service: "Sports Recovery",
        bgImage: "images/hot-stone-3.webp"
      }
    ];
    
    this.currentIndex = 0;
    this.autoPlayInterval = null;
    this.isAnimating = false;
    
    this.init();
  }
  
  init() {
    // First review initialization
    this.updateMainTestimonial();
    
    // Handlers for mini cards
    this.miniCards.forEach((card, index) => {
      card.addEventListener('click', () => this.goToTestimonial(index));
      card.addEventListener('mouseenter', () => this.previewTestimonial(index));
    });
    
    // Navigation buttons
    this.prevBtn.addEventListener('click', () => this.prevTestimonial());
    this.nextBtn.addEventListener('click', () => this.nextTestimonial());
    
    // Autoplay
    this.startAutoPlay();
    
    // Stop autoplay on hover
    this.container.addEventListener('mouseenter', () => this.stopAutoPlay());
    this.container.addEventListener('mouseleave', () => this.startAutoPlay());
    
    // Adding swipe for mobile
    this.addSwipeSupport();
    
    // Adding keyboard navigation
    this.addKeyboardSupport();
  }
  
  updateMainTestimonial() {
    if (this.isAnimating) return;
    this.isAnimating = true;
    
    const testimonial = this.testimonials[this.currentIndex];
    
    // Fade out animation
    this.mainTestimonial.style.opacity = '0';
    this.mainTestimonial.style.transform = 'translateY(20px)';
    
    setTimeout(() => {
      // Обновление контента
      this.testimonialText.textContent = testimonial.text;
      this.clientAvatar.src = testimonial.image;
      this.clientName.textContent = testimonial.name;
      this.clientRole.textContent = testimonial.role;
      this.testimonialBg.style.backgroundImage = `url('${testimonial.bgImage}')`;
      
      // Обновление рейтинга
      this.updateRating(testimonial.rating);
      
      // Обновление активной мини-карточки
      this.updateMiniCards();
      
      // Анимация появления
      setTimeout(() => {
        this.mainTestimonial.style.opacity = '1';
        this.mainTestimonial.style.transform = 'translateY(0)';
        this.isAnimating = false;
      }, 50);
    }, 300);
  }
  
  updateRating(rating) {
    this.clientRating.innerHTML = '';
    
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    // Добавляем полные звезды
    for (let i = 0; i < fullStars; i++) {
      const star = document.createElement('i');
      star.className = 'fas fa-star';
      this.clientRating.appendChild(star);
    }
    
    // Добавляем половину звезды если нужно
    if (hasHalfStar) {
      const halfStar = document.createElement('i');
      halfStar.className = 'fas fa-star-half-alt';
      this.clientRating.appendChild(halfStar);
    }
    
    // Добавляем оставшиеся пустые звезды
    const remainingStars = 5 - Math.ceil(rating);
    for (let i = 0; i < remainingStars; i++) {
      const emptyStar = document.createElement('i');
      emptyStar.className = 'far fa-star';
      this.clientRating.appendChild(emptyStar);
    }
    
    // Добавляем числовой рейтинг
    const ratingSpan = document.createElement('span');
    ratingSpan.textContent = rating.toFixed(1);
    this.clientRating.appendChild(ratingSpan);
  }
  
  updateMiniCards() {
    this.miniCards.forEach((card, index) => {
      card.classList.remove('active');
      if (index === this.currentIndex) {
        card.classList.add('active');
        
        
        // Плавная прокрутка внутри мини-карусели
        if (this.miniTrack) {
          const cardLeft = card.offsetLeft;
          const trackWidth = this.miniTrack.clientWidth;
          const cardWidth = card.clientWidth;
          
          // Центрируем карточку в видимой области
          this.miniTrack.scrollTo({
            left: cardLeft - (trackWidth / 2) + (cardWidth / 2),
            behavior: 'smooth'
          });
        }
      }
    });
  }
  
  goToTestimonial(index) {
    if (index === this.currentIndex || this.isAnimating) return;
    
    this.currentIndex = index;
    this.updateMainTestimonial();
    this.resetAutoPlay();
  }
  
  previewTestimonial(index) {
    if (index === this.currentIndex || this.isAnimating) return;
    
    // Легкое предпросмотр фона
    const testimonial = this.testimonials[index];
    this.testimonialBg.style.opacity = '0.5';
    
    setTimeout(() => {
      this.testimonialBg.style.backgroundImage = `url('${testimonial.bgImage}')`;
      this.testimonialBg.style.opacity = '1';
    }, 200);
  }
  
  nextTestimonial() {
    this.currentIndex = (this.currentIndex + 1) % this.testimonials.length;
    this.updateMainTestimonial();
    this.resetAutoPlay();
  }
  
  prevTestimonial() {
    this.currentIndex = (this.currentIndex - 1 + this.testimonials.length) % this.testimonials.length;
    this.updateMainTestimonial();
    this.resetAutoPlay();
  }
  
  startAutoPlay() {
    this.stopAutoPlay();
    this.autoPlayInterval = setInterval(() => this.nextTestimonial(), 6000);
  }
  
  stopAutoPlay() {
    if (this.autoPlayInterval) {
      clearInterval(this.autoPlayInterval);
      this.autoPlayInterval = null;
    }
  }
  
  resetAutoPlay() {
    this.stopAutoPlay();
    this.startAutoPlay();
  }
  
  addSwipeSupport() {
    let startX = 0;
    let endX = 0;
    const minSwipeDistance = 50;
    
    this.mainTestimonial.addEventListener('touchstart', (e) => {
      startX = e.touches[0].clientX;
    });
    
    this.mainTestimonial.addEventListener('touchmove', (e) => {
      endX = e.touches[0].clientX;
    });
    
    this.mainTestimonial.addEventListener('touchend', () => {
      const distance = startX - endX;
      
      if (Math.abs(distance) > minSwipeDistance) {
        if (distance > 0) {
          this.nextTestimonial(); // Свайп влево
        } else {
          this.prevTestimonial(); // Свайп вправо
        }
      }
    });
  }
  
  addKeyboardSupport() {
    document.addEventListener('keydown', (e) => {
      if (!this.container.contains(document.activeElement)) return;
      
      switch(e.key) {
        case 'ArrowLeft':
          e.preventDefault();
          this.prevTestimonial();
          break;
        case 'ArrowRight':
          e.preventDefault();
          this.nextTestimonial();
          break;
        case 'Home':
          e.preventDefault();
          this.goToTestimonial(0);
          break;
        case 'End':
          e.preventDefault();
          this.goToTestimonial(this.testimonials.length - 1);
          break;
      }
    });
  }
}

// Инициализация при загрузке
document.addEventListener('DOMContentLoaded', () => {
  const carousel = new LuxuryTestimonialsCarousel();
  
  // Экспорт для отладки
  window.luxuryCarousel = carousel;
});
