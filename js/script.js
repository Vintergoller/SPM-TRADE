// ===== Sticky header =====
const header = document.getElementById('header');
window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 40);
});

// ===== Burger menu =====
const burger = document.getElementById('burger');
const navLinks = document.getElementById('navLinks');
burger.addEventListener('click', () => navLinks.classList.toggle('open'));
navLinks.querySelectorAll('a').forEach(a =>
  a.addEventListener('click', () => navLinks.classList.remove('open'))
);

// ===== Reveal on scroll =====
const io = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      io.unobserve(e.target);
    }
  });
}, { threshold: 0.15 });
document.querySelectorAll('.reveal').forEach(el => io.observe(el));

// ===== Animated counters =====
const counters = document.querySelectorAll('[data-count]');
const cio = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    const el = e.target;
    const target = +el.dataset.count;
    let cur = 0;
    const step = target / 60;
    const timer = setInterval(() => {
      cur += step;
      if (cur >= target) {
        el.textContent = target + (target === 98 ? '%' : '+');
        clearInterval(timer);
      } else {
        el.textContent = Math.floor(cur);
      }
    }, 20);
    cio.unobserve(el);
  });
}, { threshold: 0.5 });
counters.forEach(c => cio.observe(c));



/* ===== Калькулятор освещённости ===== */
const calcForm = document.getElementById('calcForm');

if (calcForm) {
  const typeSel = document.getElementById('calcType');
  const areaInput = document.getElementById('calcArea');
  const heightIn = document.getElementById('calcHeight');
  const powerSel = document.getElementById('calcPower');
  const outLamps = document.getElementById('calcLamps');
  const outPower = document.getElementById('calcTotalPower');
  const outPrice = document.getElementById('calcPrice');

  // Стоимость за 1 Вт LED-светильника (условно, ₽)
  const PRICE_PER_WATT = 55;

  // Поправочный коэффициент на высоту потолка
  function heightFactor(h) {
    if (h <= 3) return 1.0;
    if (h <= 4) return 1.15;
    if (h <= 6) return 1.35;
    if (h <= 8) return 1.55;
    if (h <= 12) return 1.85;
    return 2.2;
  }

  function calc() {
    const lux = +typeSel.value;      // требуемая освещённость, лк
    const area = +areaInput.value;    // м²
    const height = +heightIn.value;     // м
    const lampPower = +powerSel.value;     // Вт

    if (!area || area <= 0 || !height || height <= 0) {
      outLamps.textContent = '—';
      outPower.textContent = '—';
      outPrice.textContent = '—';
      return;
    }

    // Упрощённая формула: N = (E × S × k) / (F × η)
    // где F ≈ 100 лм/Вт (световой поток светильника), η ≈ 0.5 (КПД использования)
    const lumenPerWatt = 100;
    const utilization = 0.5;
    const k = heightFactor(height);

    const totalLumens = lux * area * k;
    const lumensPerLamp = lampPower * lumenPerWatt * utilization;
    let lamps = Math.ceil(totalLumens / lumensPerLamp);

    // Минимум 1 светильник
    lamps = Math.max(lamps, 1);

    const totalPower = lamps * lampPower; // Вт
    const price = totalPower * PRICE_PER_WATT; // ₽

    outLamps.textContent = lamps.toLocaleString('ru-RU') + ' шт';
    outPower.textContent = (totalPower / 1000).toFixed(2).replace('.', ',') + ' кВт';
    outPrice.textContent = '≈ ' + Math.round(price).toLocaleString('ru-RU') + ' ₽';
  }

  // Слушаем все поля
  [typeSel, areaInput, heightIn, powerSel].forEach(el => {
    el.addEventListener('input', calc);
    el.addEventListener('change', calc);
  });

  // Первый расчёт при загрузке
  calc();
}

/* ===== Модальное окно сертификата ===== */
const certModal = document.getElementById('certModal');
const certModalPreview = document.getElementById('certModalPreview');
const certModalTitle = document.getElementById('certModalTitle');

if (certModal) {
  document.querySelectorAll('.cert').forEach(cert => {
    cert.addEventListener('click', () => {
      const svg = cert.querySelector('.cert-svg');
      const title = cert.dataset.cert || 'Сертификат';

      certModalPreview.innerHTML = '';
      if (svg) certModalPreview.appendChild(svg.cloneNode(true));
      certModalTitle.textContent = title;

      certModal.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
  });

  // Закрытие по клику на backdrop / кнопку / крестик
  certModal.querySelectorAll('[data-close]').forEach(el => {
    el.addEventListener('click', () => {
      certModal.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  // Закрытие по Escape
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && certModal.classList.contains('open')) {
      certModal.classList.remove('open');
      document.body.style.overflow = '';
    }
  });
}

/* ===== Калькулятор окупаемости ЭЗС ===== */
const evCalcForm = document.getElementById('evCalcForm');

if (evCalcForm) {
  const evLocation = document.getElementById('evLocation');
  const evSession = document.getElementById('evSession');
  const evTariff = document.getElementById('evTariff');
  const evLoad = document.getElementById('evLoad');
  const evIncome = document.getElementById('evIncome');
  const evIncomeY = document.getElementById('evIncomeYear');
  const evPayback = document.getElementById('evPayback');

  // Стоимость ЭЗС 150 кВт «под ключ» (условно, ₽)
  const STATION_COST = 6_500_000;
  // Себестоимость электроэнергии для оператора, ₽/кВт·ч
  const COST_PER_KWH = 6;

  function calcEV() {
    const sessionKwh = +evSession.value || 0;
    const tariff = +evTariff.value || 0;
    const load = +evLoad.value || 0;

    if (!sessionKwh || !tariff || !load) {
      evIncome.textContent = '—';
      evIncomeY.textContent = '—';
      evPayback.textContent = '—';
      return;
    }

    // Доход с одной сессии (наценка над себестоимостью)
    const profitPerSession = (tariff - COST_PER_KWH) * sessionKwh;
    const incomeMonth = profitPerSession * load * 30;
    const incomeYear = incomeMonth * 12;

    let paybackMonths = incomeMonth > 0
      ? Math.ceil(STATION_COST / incomeMonth)
      : Infinity;

    const fmt = n => Math.round(n).toLocaleString('ru-RU') + ' ₽';

    evIncome.textContent = fmt(incomeMonth);
    evIncomeY.textContent = fmt(incomeYear);

    if (!isFinite(paybackMonths)) {
      evPayback.textContent = '—';
    } else if (paybackMonths <= 12) {
      evPayback.textContent = paybackMonths + ' мес';
    } else {
      const years = (paybackMonths / 12).toFixed(1).replace('.', ',');
      evPayback.textContent = years + ' лет';
    }
  }

  // Автоподстановка загрузки при выборе локации
  evLocation.addEventListener('change', () => {
    evLoad.value = evLocation.value;
    calcEV();
  });

  [evSession, evTariff, evLoad].forEach(el => {
    el.addEventListener('input', calcEV);
  });

  calcEV();
}

/* ===== Форма заявки на ЭЗС ===== */
const evLeadForm = document.getElementById('evLeadForm');
const evFormMsg = document.getElementById('evFormMsg');

if (evLeadForm) {
  evLeadForm.addEventListener('submit', async e => {
    e.preventDefault();

    const nameInput = evLeadForm.querySelector('[name="name"]');
    const phoneInput = evLeadForm.querySelector('[name="phone"]');
    const locInput = evLeadForm.querySelector('[name="location"]');
    const typeInput = evLeadForm.querySelector('[name="objectType"]');

    const data = {
      name: nameInput.value.trim(),
      phone: phoneInput.value.trim(),
      location: locInput.value.trim(),
      objectType: typeInput.value,
      source: 'ЭЗС 150 кВт'
    };

    if (data.name.length < 2) { alert('Введите имя'); return; }
    if (data.phone.length < 6) { alert('Введите корректный телефон'); return; }

    // await fetch('/api/lead', {
    //   method:'POST',
    //   headers:{'Content-Type':'application/json'},
    //   body: JSON.stringify(data)
    // });

    console.log('Заявка на ЭЗС:', data);
    evFormMsg.style.display = 'block';
    evLeadForm.reset();
    setTimeout(() => evFormMsg.style.display = 'none', 5000);
  });
}
/* ===== Частицы пыли в hero ===== */
const particlesBox = document.getElementById('particles');

if (particlesBox) {
  const PARTICLE_COUNT = 18; // количество частиц

  function createParticle() {
    const p = document.createElement('span');
    p.className = 'particle';

    // Случайная позиция старта (по ширине светового конуса)
    const startX = 30 + Math.random() * 40; // 30%–70% ширины
    p.style.left = startX + '%';
    p.style.top = (55 + Math.random() * 15) + '%';

    // Размер
    const size = 2 + Math.random() * 3;
    p.style.width = size + 'px';
    p.style.height = size + 'px';

    // Длительность и задержка
    const duration = 6 + Math.random() * 6;
    p.style.animationDuration = duration + 's';
    p.style.animationDelay = (Math.random() * duration) + 's';

    // Смещение по горизонтали (для плавного дрейфа)
    p.style.setProperty('--drift', (Math.random() * 60 - 30) + 'px');
    p.style.setProperty('--drift2', (Math.random() * 100 - 50) + 'px');

    // Яркость
    p.style.opacity = 0.3 + Math.random() * 0.7;

    particlesBox.appendChild(p);
  }

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    createParticle();
  }
}
/* ============================================
   ГЛОБАЛЬНЫЕ ЭФФЕКТЫ
   ============================================ */

/* 1. Прогресс-бар чтения */
const scrollProgress = document.getElementById('scrollProgress');
function updateProgress() {
  const h = document.documentElement;
  const scrolled = (h.scrollTop / (h.scrollHeight - h.clientHeight)) * 100;
  scrollProgress.style.width = scrolled + '%';
}
window.addEventListener('scroll', updateProgress, { passive: true });
updateProgress();

/* 2. Курсор-подсветка */
const cursorGlow = document.getElementById('cursorGlow');
if (cursorGlow && window.matchMedia('(hover:hover)').matches) {
  let mx = window.innerWidth / 2, my = window.innerHeight / 2;
  let cx = mx, cy = my;

  document.addEventListener('mousemove', e => {
    mx = e.clientX;
    my = e.clientY;
  });

  function animateCursor() {
    cx += (mx - cx) * 0.12;
    cy += (my - cy) * 0.12;
    cursorGlow.style.left = cx + 'px';
    cursorGlow.style.top = cy + 'px';
    requestAnimationFrame(animateCursor);
  }
  animateCursor();
}

/* 3. Кнопка «наверх» */
const toTop = document.getElementById('scrollTop');
if (toTop) {
  window.addEventListener('scroll', () => {
    toTop.classList.toggle('visible', window.scrollY > 600);
  }, { passive: true });

  toTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}
/* 4. Расширенный reveal (left / right / zoom) */
const revealIO = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      revealIO.unobserve(e.target);
    }
  });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-zoom')
  .forEach(el => revealIO.observe(el));

/* 5. Магнитные кнопки */
document.querySelectorAll('.btn-magnetic').forEach(btn => {
  btn.addEventListener('mousemove', e => {
    const r = btn.getBoundingClientRect();
    const x = e.clientX - r.left - r.width / 2;
    const y = e.clientY - r.top - r.height / 2;
    btn.style.transform = `translate(
x
∗
0.25
p
x
,
x∗0.25px,{y * 0.4}px) scale(1.03)`;
  });
  btn.addEventListener('mouseleave', () => {
    btn.style.transform = '';
  });
});

/* 6. Фоновые частицы */
const bgBox = document.getElementById('bgParticles');
if (bgBox) {
  const COUNT = 30;
  for (let i = 0; i < COUNT; i++) {
    const p = document.createElement('span');
    p.className = 'bg-particle';
    p.style.left = Math.random() * 100 + '%';
    p.style.animationDuration = (12 + Math.random() * 18) + 's';
    p.style.animationDelay = (Math.random() * 20) + 's';
    p.style.setProperty('--drift', (Math.random() * 200 - 100) + 'px');
    const size = 1 + Math.random() * 2;
    p.style.width = size + 'px';
    p.style.height = size + 'px';
    bgBox.appendChild(p);
  }
}

/* 7. Плавное появление hero при загрузке */
window.addEventListener('load', () => {
  document.body.classList.add('loaded');
});