/**
 * =========================================
 * WARM COFFEE - CHECKOUT LOGIC
 * =========================================
 * Este script maneja de manera pura (Vanilla JS) 
 * el flujo de la página de checkout.
 */

document.addEventListener('DOMContentLoaded', () => {
    cargarResumen();
    inicializarEventos();
    mostrarFormularioPago('tarjeta'); // Inicia con tarjeta por defecto
});

/**
 * 1. cargarResumen()
 * Obtiene los datos del carrito almacenados (localStorage) y calcula subtotales.
 */
function cargarResumen() {
    let subtotal = 0;
    let descuento = 0;
    let total = 0;

    // Intentamos recuperar la información del carrito si existe (Simulado o real)
    const cartData = JSON.parse(localStorage.getItem('warmCoffeeCart')) || [];
    
    if (cartData.length > 0) {
        subtotal = cartData.reduce((acc, item) => acc + (item.precio * item.cantidad), 0);
        // Lógica de descuento, ejemplo: S/ 0 por ahora
        descuento = 0; 
        total = subtotal - descuento;
    } else {
        // Valores iniciales en 0.00
        subtotal = 0;
        descuento = 0;
        total = 0;
    }

    // Actualizamos el DOM
    document.getElementById('summary-subtotal').textContent = `S/ ${subtotal.toFixed(2)}`;
    document.getElementById('summary-discount').textContent = `S/ ${descuento.toFixed(2)}`;
    document.getElementById('summary-total').textContent = `S/ ${total.toFixed(2)}`;
}

/**
 * 2. inicializarEventos()
 * Asigna los event listeners a botones, radios y formularios.
 */
function inicializarEventos() {
    // A) Toggle para tipo de pedido (Local vs Llevar)
    const radiosPedido = document.querySelectorAll('input[name="tipo_pedido"]');
    const formReserva = document.getElementById('reservation-wrapper');
    
    radiosPedido.forEach(radio => {
        radio.addEventListener('change', (e) => {
            if (e.target.value === 'local') {
                formReserva.classList.add('show');
                // Hacemos los campos requeridos
                document.getElementById('fecha').required = true;
                document.getElementById('hora').required = true;
                document.getElementById('personas').required = true;
            } else {
                formReserva.classList.remove('show');
                // Quitamos el required
                document.getElementById('fecha').required = false;
                document.getElementById('hora').required = false;
                document.getElementById('personas').required = false;
            }
        });
    });

    // B) Cambio de Método de Pago
    const radiosPago = document.querySelectorAll('input[name="metodo_pago"]');
    const paymentOptionsContainers = document.querySelectorAll('.payment-option');

    radiosPago.forEach((radio, index) => {
        radio.addEventListener('change', (e) => {
            // Remueve la clase active de todos para el estilo del borde
            paymentOptionsContainers.forEach(opt => opt.classList.remove('active'));
            // Agrega active al seleccionado
            paymentOptionsContainers[index].classList.add('active');

            // Muestra el formulario correspondiente
            mostrarFormularioPago(e.target.value);
        });
    });

    // Agregar clase active al primero por defecto
    paymentOptionsContainers[0].classList.add('active');

    // C) Evento de envío del formulario (Confirmar Pago)
    const checkoutForm = document.getElementById('checkout-form');
    checkoutForm.addEventListener('submit', (e) => {
        e.preventDefault(); // Evita recargar la página
        confirmarPago();
    });
}

/**
 * 3. mostrarFormularioPago(metodo)
 * Cambia dinámicamente el HTML del contenedor de pago y ajusta el botón.
 */
function mostrarFormularioPago(metodo) {
    const contenedorForm = document.getElementById('dynamic-payment-form');
    const btnTexto = document.getElementById('btn-text');
    let htmlContent = '';

    // Pequeño truco para forzar el reinicio de la animación "fade-in"
    contenedorForm.classList.remove('fade-in');
    void contenedorForm.offsetWidth; // Trigger reflow
    contenedorForm.classList.add('fade-in');

    if (metodo === 'tarjeta') { // Visa o Mastercard
        htmlContent = `
            <div class="input-group">
                <label for="num_tarjeta">Número de tarjeta</label>
                <input type="text" id="num_tarjeta" placeholder="0000 0000 0000 0000" required>
            </div>
            <div class="input-group">
                <label for="nombre_titular">Nombre del titular</label>
                <input type="text" id="nombre_titular" placeholder="Tal como aparece en la tarjeta" required>
            </div>
            <div class="input-row">
                <div class="input-group">
                    <label for="vencimiento">Vencimiento</label>
                    <input type="text" id="vencimiento" placeholder="MM/AA" required>
                </div>
                <div class="input-group">
                    <label for="cvv">CVV</label>
                    <input type="text" id="cvv" placeholder="123" required>
                </div>
            </div>
        `;
        btnTexto.textContent = 'Confirmar pago';
    } 
    else if (metodo === 'yape' || metodo === 'plin') {
        htmlContent = `
            <div class="input-group">
                <label for="num_celular">Número celular</label>
                <input type="tel" id="num_celular" placeholder="987 654 321" required>
            </div>
            <p style="font-family:'Poppins'; font-size:0.9rem; color:var(--muted); margin-top:1rem;">
                Te enviaremos una notificación a tu app para confirmar el pago.
            </p>
        `;
        btnTexto.textContent = 'Confirmar pago';
    } 
    else if (metodo === 'efectivo') {
        htmlContent = generarQR(); // Llama a la función que genera la vista del QR
        btnTexto.textContent = 'He realizado el pago';
    }

    contenedorForm.innerHTML = htmlContent;
}

/**
 * 4. generarQR()
 * Retorna el HTML para el método de pago en efectivo (sin inputs, solo el código).
 */
function generarQR() {
    return `
        <div class="qr-container fade-in">
            <img src="../img/qr.png" alt="Código QR Cajero" class="qr-image" onerror="this.src='https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=WarmCoffee'">
            <p style="font-family:'Poppins'; font-size:1rem; color:var(--text); font-weight:500;">
                Escanee este código QR y realice el pago en caja.
            </p>
        </div>
    `;
}

/**
 * 5. validarFormulario()
 * Valida que los campos nativos de HTML5 requeridos estén completos.
 * (El propio preventDefault y required de HTML ya hace gran parte del trabajo,
 * pero aquí podemos añadir lógicas extra si se necesita).
 */
function validarFormulario() {
    const form = document.getElementById('checkout-form');
    // form.checkValidity() verifica si todos los required y tipos de input están correctos
    return form.checkValidity(); 
}

/**
 * 6. confirmarPago()
 * Se ejecuta al presionar el botón de submit. Si es válido, muestra el modal.
 */
function confirmarPago() {
    if (validarFormulario()) {
        const metodoSeleccionado = document.querySelector('input[name="metodo_pago"]:checked').value;
        mostrarModal(metodoSeleccionado);
        
        // Limpiamos el carrito post-compra
        localStorage.removeItem('warmCoffeeCart');
    }
}

/**
 * 7. mostrarModal(metodo)
 * Anima y muestra el modal de éxito personalizado generando el número de pedido.
 */
function mostrarModal(metodo) {
    const modal = document.getElementById('success-modal');
    const titulo = document.getElementById('modal-title');
    const desc = document.getElementById('modal-desc');
    const orderNumberElement = document.getElementById('generated-order-number');

    // Generar un número de pedido aleatorio #WC-2026-XXXX
    const randomCode = Math.floor(1000 + Math.random() * 9000);
    orderNumberElement.textContent = `#WC-2026-${randomCode}`;

    if (metodo === 'efectivo') {
        titulo.textContent = '¡Pedido reservado!';
        desc.textContent = 'Por favor, acércate a caja para finalizar el pago.';
    } else {
        titulo.textContent = '¡Pedido confirmado!';
        desc.textContent = 'Gracias por elegir Warm Coffee.';
    }

    modal.classList.add('active');
}

/**
 * 8. Manejo del Modal Secundario (Ver mi pedido)
 */
document.addEventListener('DOMContentLoaded', () => {
    // Escuchar el clic del botón principal del modal
    const btnVerPedido = document.getElementById('btn-ver-pedido');
    if (btnVerPedido) {
        btnVerPedido.addEventListener('click', abrirModalResumen);
    }
});

function abrirModalResumen() {
    // Cierra el modal principal de éxito
    document.getElementById('success-modal').classList.remove('active');
    
    // Extrae los valores del subtotal y total de la vista del checkout
    const subtotal = document.getElementById('summary-subtotal').textContent;
    const total = document.getElementById('summary-total').textContent;
    const container = document.getElementById('modal-summary-content');
    
    // Inyecta el resumen en el modal secundario
    container.innerHTML = `
        <p style="font-family:'Poppins'; font-size:1rem; color:var(--text); margin-bottom: 8px;"><strong>Subtotal:</strong> ${subtotal}</p>
        <p style="font-family:'Poppins'; font-size:1rem; color:var(--text); margin-bottom: 8px;"><strong>Descuento:</strong> S/ 0.00</p>
        <hr style="border: none; border-top: 1px dashed var(--brown-soft, #c4a991); margin: 15px 0;">
        <p style="font-family:'Poppins'; font-size:1.3rem; color:var(--brown-dark); font-weight:600;"><strong>Total:</strong> ${total}</p>
    `;
    
    // Abre el modal secundario
    document.getElementById('summary-modal').classList.add('active');
}

function cerrarModalResumen() {
    document.getElementById('summary-modal').classList.remove('active');
}