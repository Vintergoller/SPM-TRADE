
// Анимация появления при прокрутке
const revealElements = document.querySelectorAll('.animate-reveal');

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
        }
    });
}, { threshold: 0.1 });

revealElements.forEach(el => observer.observe(el));

// Анимированные счётчики
const counters = document.querySelectorAll('[data-count]');

const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const counter = entry.target;
            const target = parseInt(counter.getAttribute('data-count'));
            const duration = 2000;
            const step = Math.ceil(target / (duration / 16));
            let current = 0;

            const timer = setInterval(() => {
                current += step;
                if (current >= target) {
                    current = target;
                    clearInterval(timer);
                }
                counter.textContent = current.toLocaleString('ru-RU');
            }, 16);

            counterObserver.unobserve(counter);
        }
    });
}, { threshold: 0.5 });

counters.forEach(counter => counterObserver.observe(counter));

// Плавный скролл для якорей
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

const track = document.getElementById('partnersTrack');
const sliderContainer = document.getElementById('partnersSlider');

let speed = 1; // Скорость (можно менять: 1.5 — быстрее, 0.5 — медленнее)
let currentX = 0;
let isPaused = false;
let resetWidth = 0;



document.querySelector('form').addEventListener('submit', function (e) {
    const checkbox = this.querySelector('input[name="privacy"]');
    if (!checkbox.checked) {
        e.preventDefault();
        alert('Пожалуйста, примите политику конфиденциальности');
    }
});

const burgerBtn = document.getElementById('burger-btn');
const menu = document.getElementById('menu');
// Находим все ссылки внутри нашего меню
const menuLinks = menu.querySelectorAll('.nav-link, a');

// Функция переключения меню
function toggleMenu() {
    burgerBtn.classList.toggle('active');
    menu.classList.toggle('active');
}

// Открытие/закрытие по клику на бургер
burgerBtn.addEventListener('click', toggleMenu);

// Закрытие меню при клику на любую ссылку
menuLinks.forEach(link => {
    link.addEventListener('click', () => {
        // Убираем классы active, если они есть
        burgerBtn.classList.remove('active');
        menu.classList.remove('active');
    });
});
