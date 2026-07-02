document.addEventListener("DOMContentLoaded", () => {
    
    // ==========================================
    // 1. VARIABLES GLOBALES Y SELECTORES
    // ==========================================
    const CART_KEY = "warmCoffeeCart";
    const IGV_RATE = 0; // 18%

    const emptyState = document.getElementById("empty-cart-state");
    const activeState = document.getElementById("active-cart-state");
    const cartItemsContainer = document.getElementById("cart-items-container");
    
    const summarySubtotal = document.getElementById("summary-subtotal");
    const summaryIgv = document.getElementById("summary-igv");
    const summaryDiscount = document.getElementById("summary-discount");
    const summaryTotal = document.getElementById("summary-total");
    
    const btnCheckout = document.getElementById("btn-checkout");
    const cartCountBadge = document.querySelector(".cart-count");

    let cartData = [];

    // ==========================================
    // 2. FUNCIONES PRINCIPALES
    // ==========================================

    function loadCart() {
        const storedCart = localStorage.getItem(CART_KEY);
        cartData = storedCart ? JSON.parse(storedCart) : [];
        console.log("Datos cargados del carrito:", cartData); // Ayuda para depurar en consola
        updateHeaderCartCount();
        renderCart();
    }

    function saveCart() {
        localStorage.setItem(CART_KEY, JSON.stringify(cartData));
        updateHeaderCartCount();
    }

    function renderCart() {
        cartItemsContainer.innerHTML = "";

        if (cartData.length === 0) {
            emptyState.style.display = "flex";
            activeState.style.display = "none";
        } else {
            emptyState.style.display = "none";
            activeState.style.display = "flex";

            cartData.forEach(product => {
                // Validación rápida por si faltan datos en el objeto guardado
                const precio = parseFloat(product.precio) || 0;
                const cantidad = parseInt(product.cantidad) || 1;
                const subtotal = precio * cantidad;
                
                const itemHTML = `
                    <div class="cart-item" data-id="${product.id}">
                        <div class="col-product item-info">
                            <img src="${product.imagen || '../img/default.jpg'}" alt="${product.nombre}" class="item-img">
                            <span class="item-name">${product.nombre || 'Producto'}</span>
                        </div>
                        
                        <div class="col-price item-price">
                            S/ ${precio.toFixed(2)}
                        </div>
                        
                        <div class="col-qty item-qty">
                            <div class="qty-controls">
                                <button class="qty-btn btn-minus" data-id="${product.id}">-</button>
                                <input type="text" class="qty-input" value="${cantidad}" readonly>
                                <button class="qty-btn btn-plus" data-id="${product.id}">+</button>
                            </div>
                        </div>
                        
                        <div class="col-subtotal item-subtotal">
                            S/ ${subtotal.toFixed(2)}
                        </div>
                        
                        <div class="col-action">
                            <button class="btn-remove" data-id="${product.id}">✕</button>
                        </div>
                    </div>
                `;
                cartItemsContainer.insertAdjacentHTML('beforeend', itemHTML);
            });

            calculateTotals();
        }
    }

    // CORRECCIÓN: Se usa String() para asegurar que la comparación no falle
    function increaseQuantity(id) {
        const productIndex = cartData.findIndex(item => String(item.id) === String(id));
        if (productIndex !== -1) {
            cartData[productIndex].cantidad += 1;
            saveCart();
            renderCart();
        }
    }

    // CORRECCIÓN: Uso de String() para id
    function decreaseQuantity(id) {
        const productIndex = cartData.findIndex(item => String(item.id) === String(id));
        if (productIndex !== -1) {
            if (cartData[productIndex].cantidad > 1) {
                cartData[productIndex].cantidad -= 1;
                saveCart();
                renderCart();
            }
        }
    }

    // CORRECCIÓN: Uso de String() para id
    function removeProduct(id) {
        cartData = cartData.filter(item => String(item.id) !== String(id));
        saveCart();
        renderCart();
    }

    function calculateTotals() {
        let totalPagar = 0;
        let descuento = 0.00; 

        // Sumamos todo asumiendo que los precios de tu menú YA INCLUYEN IGV (lo estándar)
        cartData.forEach(product => {
            const precio = parseFloat(product.precio) || 0;
            const cantidad = parseInt(product.cantidad) || 1;
            totalPagar += (precio * cantidad);
        });

        totalPagar -= descuento;

        // Extraemos el subtotal y el IGV del total a pagar
        const subtotalBruto = totalPagar / (1 + IGV_RATE);
        const igvCalculado = totalPagar - subtotalBruto;

        summarySubtotal.textContent = `S/ ${subtotalBruto.toFixed(2)}`;
        summaryIgv.textContent = `S/ ${igvCalculado.toFixed(2)}`;
        summaryDiscount.textContent = `- S/ ${descuento.toFixed(2)}`;
        summaryTotal.textContent = `S/ ${totalPagar.toFixed(2)}`;
    }

    function updateHeaderCartCount() {
        if(cartCountBadge) {
            const totalItems = cartData.reduce((acc, item) => acc + (parseInt(item.cantidad) || 0), 0);
            cartCountBadge.textContent = totalItems;
        }
    }

    // ==========================================
    // 3. EVENT LISTENERS
    // ==========================================

    cartItemsContainer.addEventListener("click", (e) => {
        const target = e.target;
        
        const productId = target.getAttribute("data-id");
        if (!productId) return;

        if (target.classList.contains("btn-plus")) {
            increaseQuantity(productId);
        } 
        else if (target.classList.contains("btn-minus")) {
            decreaseQuantity(productId);
        } 
        else if (target.classList.contains("btn-remove")) {
            removeProduct(productId);
        }
    });

    if (btnCheckout) {
        btnCheckout.addEventListener("click", () => {
            alert("Función próximamente: Integración con pasarela de pago.");
        });
    }

    // ==========================================
    // 4. INICIALIZACIÓN
    // ==========================================
    loadCart();
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
});