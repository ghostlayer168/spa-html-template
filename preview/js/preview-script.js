// Создание плавающих частиц
function createParticles() {
    const particlesContainer = document.getElementById('particles');
    const particleCount = 30;
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.classList.add('particle');
        
        const size = Math.random() * 8 + 4;
        const left = Math.random() * 100;
        const duration = Math.random() * 20 + 10;
        const delay = Math.random() * 10;
        
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.left = `${left}vw`;
        particle.style.animationDuration = `${duration}s`;
        particle.style.animationDelay = `${delay}s`;
        
        particlesContainer.appendChild(particle);
    }
}

// Анимация цифр счетчика
function animateCounters() {
    const statBoxes = document.querySelectorAll('.stat-box');
    
    statBoxes.forEach((box, index) => {
        const countElement = box.querySelector('.count-up');
        const target = box.getAttribute('data-count');
        const delay = box.getAttribute('data-delay');
        
        setTimeout(() => {
            box.classList.add('animate');
            box.style.setProperty('--i', index);
            
            if (target !== '0') {
                let current = 0;
                const increment = target / 20;
                const timer = setInterval(() => {
                    current += increment;
                    if (current >= target) {
                        current = target;
                        clearInterval(timer);
                    }
                    countElement.textContent = target === '100' ? 
                        Math.floor(current) + '%' : Math.floor(current); // Без плюса!
                }, 50);
            }
        }, delay * 300);
    });
}

// Анимация появления карточек при скролле
function animateOnScroll() {
    const demoCards = document.querySelectorAll('.demo-card');
    const featureItems = document.querySelectorAll('.feature-item');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const delay = entry.target.getAttribute('data-delay') || 0;
                setTimeout(() => {
                    entry.target.classList.add('animate');
                    entry.target.style.setProperty('--i', delay);
                }, delay * 300);
            }
        });
    }, {
        threshold: 0.2,
        rootMargin: '0px 0px -50px 0px'
    });
    
    demoCards.forEach(card => observer.observe(card));
    featureItems.forEach(item => observer.observe(item));
}

// Эффект параллакс для карточек (упрощенный)
function addParallaxEffect() {
    const cards = document.querySelectorAll('.demo-card');
    
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateY = (x - centerX) / 25;
            const rotateX = (centerY - y) / 25;
            
            // НЕ применяем параллакс к кнопке внутри
            card.style.transform = `
                perspective(1000px) 
                rotateX(${rotateX}deg) 
                rotateY(${rotateY}deg) 
                translateY(-20px)
            `;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(-20px)';
        });
    });
}

// Делаем бейдж кликабельным
function makeBadgeClickable() {
    const badge = document.querySelector('.template-badge');
    if (badge) {
        // Создаем ссылку
        const link = document.createElement('a');
        link.href = '#demoGrid';
        link.className = 'template-badge';
        link.textContent = 'WEBSITE TEMPLATE PREVIEW';
        link.style.cursor = 'pointer';
        
        // Заменяем бейдж на ссылку
        badge.parentNode.replaceChild(link, badge);
        
        // Плавная прокрутка при клике
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    }
}

// ФИКС: Предотвращаем уезжание кнопки при наведении
function fixButtonParallax() {
    const demoCards = document.querySelectorAll('.demo-card');
    
    demoCards.forEach(card => {
        const demoBtn = card.querySelector('.demo-btn');
        
        if (demoBtn) {
            // При наведении на кнопку - отключаем параллакс для карточки
            demoBtn.addEventListener('mouseenter', function(e) {
                // Останавливаем всплытие события
                e.stopPropagation();
                
                // Замораживаем текущую трансформацию карточки
                card.style.transform = card.style.transform || 'perspective(1000px) rotateX(0) rotateY(0) translateY(-20px)';
                
                // Добавляем класс для фиксации
                card.classList.add('no-parallax');
            });
            
            demoBtn.addEventListener('mouseleave', function(e) {
                e.stopPropagation();
                card.classList.remove('no-parallax');
            });
        }
    });
}

// Эффект наведения на кнопки (ripple эффект)
function addButtonEffects() {
    const buttons = document.querySelectorAll('.action-btn, .demo-btn');
    
    buttons.forEach(btn => {
        btn.addEventListener('mouseenter', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const ripple = document.createElement('span');
            ripple.style.position = 'absolute';
            ripple.style.width = '0';
            ripple.style.height = '0';
            ripple.style.borderRadius = '50%';
            ripple.style.background = 'rgba(255,255,255,0.3)';
            ripple.style.transform = 'translate(-50%, -50%)';
            ripple.style.left = `${x}px`;
            ripple.style.top = `${y}px`;
            ripple.style.animation = 'ripple 0.6s linear';
            ripple.style.zIndex = '1';
            
            btn.appendChild(ripple);
            
            setTimeout(() => {
                if (ripple.parentNode === btn) {
                    btn.removeChild(ripple);
                }
            }, 600);
        });
    });
    
    // Добавляем стиль для ripple эффекта если его нет
    if (!document.querySelector('#ripple-style')) {
        const style = document.createElement('style');
        style.id = 'ripple-style';
        style.textContent = `
            @keyframes ripple {
                to {
                    width: 300px;
                    height: 300px;
                    opacity: 0;
                }
            }
            
            /* Отключаем параллакс для карточки при наведении на кнопку */
            .demo-card.no-parallax {
                transform: perspective(1000px) rotateX(5deg) rotateY(5deg) translateY(-20px) !important;
                transition: transform 0.3s ease !important;
            }
        `;
        document.head.appendChild(style);
    }
}

// Анимация при загрузке страницы
function initPageAnimations() {
    setTimeout(() => {
        const badge = document.querySelector('.template-badge');
        if (badge) badge.style.animationPlayState = 'running';
    }, 500);
    
    setTimeout(() => {
        animateCounters();
    }, 1500);
    
    createParticles();
    animateOnScroll();
    addParallaxEffect();
    makeBadgeClickable();
    addButtonEffects();
    fixButtonParallax(); // Фиксируем проблему с кнопкой
    
    // Эффект прокрутки для ссылок
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Запуск при загрузке DOM
document.addEventListener('DOMContentLoaded', initPageAnimations);

// Эффект параллакс при скролле
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const rate = scrolled * -0.5;
    
    const animatedBg = document.querySelector('.animated-bg');
    if (animatedBg) {
        animatedBg.style.backgroundPosition = `50% ${50 + rate * 0.05}%`;
    }
    
    const statBoxes = document.querySelectorAll('.stat-box');
    statBoxes.forEach((box, index) => {
        const speed = 0.3 + index * 0.1;
        const translateY = rate * speed * 0.1;
        if (box.classList.contains('animate')) {
            box.style.transform = `translateY(${translateY}px)`;
        }
    });
});