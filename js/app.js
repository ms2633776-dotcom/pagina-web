initScrollAnimation();

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

document.addEventListener("DOMContentLoaded", () => {
    // Buscamos si existe el header especial del index
    const headerHome = document.querySelector('.header-home');
    
    // Si existe (solo en el index), ejecutamos el evento de scroll
    if (headerHome) {
        window.addEventListener('scroll', () => {
            // Si el usuario baja más de 50 pixeles, agregamos la clase 'scrolled'
            if (window.scrollY > 50) {
                headerHome.classList.add('scrolled');
            } else {
                // Si vuelve arriba, se la quitamos para que sea transparente otra vez
                headerHome.classList.remove('scrolled');
            }
        });
    }
});