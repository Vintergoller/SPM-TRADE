const burger = document.getElementById('burger');
const nav = document.getElementById('nav');
const body = document.body;

// Сохраняем позицию скролла
let scrollPosition = 0;

function openMenu() {
    scrollPosition = window.pageYOffset || document.documentElement.scrollTop;
    body.classList.add('no-scroll');
    body.style.top = `-${scrollPosition}px`; // Фиксируем позицию
    nav.classList.add('nav--open');
    burger.classList.add('burger--active');
}

function closeMenu() {
    body.classList.remove('no-scroll');
    body.style.top = '';
    window.scrollTo(0, scrollPosition); // Возвращаем позицию
    nav.classList.remove('nav--open');
    burger.classList.remove('burger--active');
}

// Открыть/закрыть по клику на бургер
burger.addEventListener('click', () => {
    const isOpen = nav.classList.contains('nav--open');
    if (isOpen) {
        closeMenu();
    } else {
        openMenu();
    }
});

// Закрыть при клике на ссылку
document.querySelectorAll('.nav__link').forEach(link => {
    link.addEventListener('click', () => {
        closeMenu();
    });
});

// Закрыть по Esc
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeMenu();
    }
});
document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('pdfModal');
    const iframe = document.getElementById('pdfFrame');
    const downloadBtn = document.getElementById('pdfDownload');
    const closeBtn = document.getElementById('modalClose');
    const overlay = document.getElementById('modalOverlay');
    const certCards = document.querySelectorAll('.certificate-card');

    // Открытие модального окна
    certCards.forEach(card => {
        card.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Получаем путь к PDF из дата-атрибута карточки
            const pdfPath = card.getAttribute('data-pdf');
            
            if (pdfPath) {
                iframe.src = pdfPath;
                downloadBtn.href = pdfPath;
                
                modal.classList.add('pdf-modal--active');
                document.body.classList.add('modal-open');
            }
        });
    });

    // Функция закрытия окна
    function closeModal() {
        modal.classList.remove('pdf-modal--active');
        document.body.classList.remove('modal-open');
        iframe.src = ''; // Обнуляем src, чтобы файл не продолжал грузиться/играть в фоне
    }

    // Обработчики кликов для закрытия
    closeBtn.addEventListener('click', closeModal);
    overlay.addEventListener('click', closeModal);

    // Закрытие по кнопке Escape для удобства (B2B стандарт)
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('pdf-modal--active')) {
            closeModal();
        }
    });
});
document.addEventListener('DOMContentLoaded', () => {
    // Настройка Intersection Observer
    const revealOptions = {
        threshold: 0.15, // Анимация начнется, когда элемент покажется на 15%
        rootMargin: "0px 0px -50px 0px" // Небольшой отступ снизу для плавности
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Добавляем класс, который запускает CSS-анимацию
                entry.target.classList.add('reveal--active');
                // Отключаем слежку за элементом, чтобы анимация сработала только один раз
                observer.unobserve(entry.target);
            }
        });
    }, revealOptions);

    // Ищем все элементы для анимации
    const elementsToReveal = document.querySelectorAll('.reveal');
    elementsToReveal.forEach(el => revealObserver.observe(el));
});