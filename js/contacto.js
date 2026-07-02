/* =========================================
   CONTACTO JS - Warm Coffee
   ========================================= */

document.addEventListener("DOMContentLoaded", () => {
    // 1. Inicializar animaciones de scroll
    initScrollAnimation();
    
    // 2. Inicializar lógica del formulario y modal
    initContactForm();
});

/**
 * Función para manejar la aparición de elementos al hacer scroll (Fade-in)
 */
function initScrollAnimation() {
    const fadeElements = document.querySelectorAll('.fade-in');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Dejar de observar el elemento una vez que ya apareció
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1, // Se activa cuando el 10% del elemento es visible
        rootMargin: "0px 0px -50px 0px"
    });

    fadeElements.forEach(el => observer.observe(el));
}

/**
 * Función para manejar la validación del formulario y el modal de éxito
 */
function initContactForm() {
    const form = document.getElementById('contactoForm');
    const modal = document.getElementById('modalExito');
    const closeBtn = document.querySelector('.modal-close-btn');
    const okBtn = document.querySelector('.btn-modal-ok');

    if (!form || !modal) return;

    // Manejar el evento submit del formulario
    form.addEventListener('submit', (e) => {
        e.preventDefault(); // Evitar recarga de la página y envío real
        
        // Comprobar la validación nativa de HTML5
        if (form.checkValidity()) {
            // El formulario es válido:
            // 1. Mostrar modal elegante
            abrirModal();
            
            // 2. Limpiar el formulario
            form.reset();
            
            // 3. Quitar estado de validación si existía
            form.classList.remove('was-validated');
        } else {
            // El formulario es inválido: 
            // Agregar la clase para mostrar los estilos y mensajes de error
            form.classList.add('was-validated');
        }
    });

    // Función para abrir el modal
    function abrirModal() {
        modal.classList.add('show');
        document.body.style.overflow = 'hidden'; // Evitar scroll de fondo
    }

    // Función para cerrar el modal
    function cerrarModal() {
        modal.classList.remove('show');
        document.body.style.overflow = ''; // Restaurar scroll
    }

    // Eventos para cerrar el modal
    closeBtn.addEventListener('click', cerrarModal);
    okBtn.addEventListener('click', cerrarModal);

    // Cerrar al hacer clic fuera del contenido del modal
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            cerrarModal();
        }
    });
}
