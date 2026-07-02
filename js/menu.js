document.addEventListener("DOMContentLoaded", () => {

    // ==========================================
    // 1. LÓGICA DE FILTROS (La que ya tenías)
    // ==========================================
    const buttons = document.querySelectorAll(".filter-btn");
    const categories = document.querySelectorAll(".menu-section[data-category]");

    buttons.forEach(button => {
        button.addEventListener("click", () => {
            buttons.forEach(btn => btn.classList.remove("active"));
            button.classList.add("active");

            const filter = button.dataset.filter;

            if(filter === "all"){
                categories.forEach(category => {
                    category.style.display = "block";
                });
                return;
            }

            categories.forEach(category => {
                if(category.dataset.category === filter){
                    category.style.display = "block";
                } else {
                    category.style.display = "none";
                }
            });
        });
    });

    // ==========================================
    // 2. LÓGICA DE ANIMACIÓN (NUEVA)
    // ==========================================
    
    // A. Crear el efecto "cascada" (retraso) para las tarjetas
    // Buscamos cada bloque de productos para que la cascada se reinicie en cada sección
    const grids = document.querySelectorAll('.products-grid');
    grids.forEach(grid => {
        const cards = grid.querySelectorAll('.product-card');
        cards.forEach((card, index) => {
            // Multiplicamos por 0.15 segundos según la posición de la tarjeta
            card.style.transitionDelay = `${index * 0.15}s`; 
        });
    });

    // B. Configurar el vigilante (IntersectionObserver)
    const fadeElements = document.querySelectorAll('.fade-in');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            // Cuando el elemento entra en la pantalla
            if (entry.isIntersecting) {
                entry.target.classList.add('visible'); // Añade la clase que lo hace aparecer
                observer.unobserve(entry.target); // Deja de vigilarlo para no repetir la animación
            }
        });
    }, {
        threshold: 0.1 // Se activa cuando asoma el 10% del elemento
    });

    // Le decimos al observador que vigile todos los elementos con la clase .fade-in
    fadeElements.forEach(el => observer.observe(el));

});

// menu.js

document.addEventListener('DOMContentLoaded', () => {
    // 1. Actualizar el numerito rojo del carrito al cargar la página
    actualizarContadorCarrito();

    // 2. Seleccionar todos los botones "+" del menú
    const botonesAnadir = document.querySelectorAll('.add-btn');

    // 3. Asignarle una acción a cada botón
    botonesAnadir.forEach(boton => {
        boton.addEventListener('click', (e) => {
            // Encontrar la tarjeta del producto al que se le hizo clic
            const card = e.target.closest('.product-card');
            
            // Extraer la información del HTML
            const id = card.dataset.productId;
            const nombre = card.querySelector('h3').textContent;
            const imagen = card.querySelector('img').src;
            
            // Extraer el precio y limpiarlo (Convertir "S/ 14.00" a número 14.00)
            const precioTexto = card.querySelector('.product-footer span').textContent;
            const precio = parseFloat(precioTexto.replace('S/', '').trim());

            // Crear el objeto del producto
            const producto = { 
                id: id, 
                nombre: nombre, 
                precio: precio, 
                imagen: imagen, 
                cantidad: 1 
            };

            // Ejecutar la función para guardarlo
            anadirAlCarrito(producto);

            // Efecto visual: cambiar el botón a verde temporalmente para dar feedback al usuario
            const botonOriginal = e.target.textContent;
            e.target.textContent = '✓';
            e.target.style.backgroundColor = '#4caf50'; // Color verde
            e.target.style.color = 'white';
            e.target.style.border = 'none';
            
            // Regresar el botón a la normalidad después de 1 segundo
            setTimeout(() => {
                e.target.textContent = botonOriginal;
                e.target.style.backgroundColor = '';
                e.target.style.color = '';
                e.target.style.border = '';
            }, 1000);
        });
    });
});

// Función para gestionar el guardado en localStorage
function anadirAlCarrito(productoNuevo) {
    // Traer el carrito actual o crear un arreglo vacío si no hay nada
    let carrito = JSON.parse(localStorage.getItem('warmCoffeeCart')) || [];
    
    // Buscar si el producto ya está en el carrito
    const indiceExistente = carrito.findIndex(p => p.id === productoNuevo.id);
    
    if (indiceExistente !== -1) {
        // Si ya existe, le sumamos 1 a la cantidad
        carrito[indiceExistente].cantidad += 1;
    } else {
        // Si es nuevo, lo metemos al carrito
        carrito.push(productoNuevo);
    }
    
    // Guardar el carrito actualizado en la memoria del navegador
    localStorage.setItem('warmCoffeeCart', JSON.stringify(carrito));
    
    // Actualizar el numerito del icono flotante
    actualizarContadorCarrito();
}

// Función para actualizar el icono del carrito en el header
function actualizarContadorCarrito() {
    const carrito = JSON.parse(localStorage.getItem('warmCoffeeCart')) || [];
    // Sumar todas las cantidades de los productos
    const totalItems = carrito.reduce((total, producto) => total + producto.cantidad, 0);
    
    const contadorDOM = document.querySelector('.cart-count');
    if (contadorDOM) {
        contadorDOM.textContent = totalItems;
    }
}