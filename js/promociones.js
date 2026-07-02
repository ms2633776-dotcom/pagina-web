// DATOS DE LAS PROMOCIONES (Simulando una base de datos o API)
const promocionesData = [
    {
        id: 1,
        badge: "TODOS LOS MARTES",
        title: "2x1 en Cappuccino",
        shortDesc: "Comparte dos cappuccinos cremosos pagando solo uno durante la tarde.",
        fullDesc: "Ven a Warm Coffee todos los martes y disfruta de nuestro clásico Cappuccino preparado con granos recién tostados. Perfecto para compartir una charla agradable. Válido en tamaño mediano y grande.",
        validity: "Todos los martes de 2:00 PM a 8:00 PM",
        // Usando una imagen elegante de Unsplash como placeholder
        imgUrl: "../img/cappuccino.jpg"
    },
    {
        id: 2,
        badge: "POSTRES DE AUTOR",
        title: "15% de descuento en postres",
        shortDesc: "Endulza tu visita con cheesecakes, brownies y piezas artesanales seleccionadas.",
        fullDesc: "Nuestra vitrina de repostería tiene un 15% de descuento. Elige entre nuestro famoso Cheesecake de frutos rojos, Brownie melcochudo o tarta de manzana. Horneados frescos cada mañana.",
        validity: "De Lunes a Viernes",
        imgUrl: "../img/cheesecake.jpg"
    },
    {
        id: 3,
        badge: "HASTA LAS 11:00 A.M.",
        title: "Combo desayuno especial",
        shortDesc: "Café americano, sándwich artesanal y jugo natural para comenzar mejor.",
        fullDesc: "La manera perfecta de empezar el día. Incluye un café americano (caliente o frío), un sándwich de jamón de pavo y queso en pan de masa madre, y un jugo de naranja recién exprimido.",
        validity: "Todos los días desde apertura hasta las 11:00 A.M.",
        imgUrl: "../img/combo.jpg"
    }
];

// ELEMENTOS DEL DOM
const container = document.getElementById('promociones-container');
const counter = document.getElementById('promo-counter');
const modal = document.getElementById('promo-modal');
const closeModalBtn = document.querySelector('.close-modal');

// RENDERIZADO DINÁMICO DE TARJETAS
function renderPromociones() {
    // Actualizar contador
    counter.textContent = promocionesData.length;

    // Generar HTML
    promocionesData.forEach((promo, index) => {
        const card = document.createElement('article');
        card.className = 'promo-card fade-in';
        // Alternar un poco el orden de la animación
        card.style.transitionDelay = `${index * 0.15}s`; 
        
        card.innerHTML = `
            <div class="promo-content">
                <span class="promo-badge">${promo.badge}</span>
                <h2 class="promo-title">${promo.title}</h2>
                <p class="promo-desc">${promo.shortDesc}</p>
                <button class="btn-primary" onclick="openModal(${promo.id})">Ver promoción</button>
            </div>
            <div class="promo-image">
                <img src="${promo.imgUrl}" alt="${promo.title}" loading="lazy">
            </div>
        `;
        container.appendChild(card);
    });

    // Iniciar el observer para las animaciones al hacer scroll
    initScrollAnimation();
}

// FUNCIONES DEL MODAL
window.openModal = function(id) {
    const promo = promocionesData.find(p => p.id === id);
    if (!promo) return;

    // Poblar modal
    document.getElementById('modal-badge').textContent = promo.badge;
    document.getElementById('modal-title').textContent = promo.title;
    document.getElementById('modal-desc').textContent = promo.fullDesc;
    document.getElementById('modal-date').textContent = promo.validity;

    // Mostrar modal
    modal.classList.add('active');
    document.body.style.overflow = 'hidden'; // Evitar scroll del fondo
}

function closeModal() {
    modal.classList.remove('active');
    document.body.style.overflow = 'auto'; // Restaurar scroll
}

// CERRAR MODAL CON EVENTOS
closeModalBtn.addEventListener('click', closeModal);

modal.addEventListener('click', (e) => {
    if (e.target === modal) {
        closeModal();
    }
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
        closeModal();
    }
});

// ANIMACIÓN FADE-IN CON SCROLL
function initScrollAnimation() {
    const fadeElements = document.querySelectorAll('.fade-in');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Opcional: dejar de observar una vez que ya apareció
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1, // Se activa cuando el 10% del elemento es visible
        rootMargin: "0px 0px -50px 0px"
    });

    fadeElements.forEach(el => observer.observe(el));
}

// INICIALIZAR CUANDO CARGUE EL DOM
document.addEventListener('DOMContentLoaded', renderPromociones);