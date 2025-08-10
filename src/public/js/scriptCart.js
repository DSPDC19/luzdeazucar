document.addEventListener('DOMContentLoaded', function () {
    const cartItemsContainer = document.getElementById('cart-items');
    const cartTotalElement = document.getElementById('cart-total-price');
    const buyButton = document.getElementById('buy-button');
    let messageBox = document.getElementById('add-to-cart-message');

    // Asegurar que exista el contenedor de mensaje (toast)
    if (!messageBox) {
        messageBox = document.createElement('div');
        messageBox.id = 'add-to-cart-message';
        document.body.appendChild(messageBox);
    }

    // Estilos inyectados (grid para columnas y estilos para botones/toast)
    if (!document.getElementById('cart-toast-style')) {
        const style = document.createElement('style');
        style.id = 'cart-toast-style';
        style.textContent = `
        /* Grid: cabecera + filas (4 columnas: nombre, cantidad, subtotal, acción) */
        .cart-header {
            display: grid;
            grid-template-columns: 2fr 1fr 1fr 120px;
            gap: 12px;
            align-items: center;
            padding: 10px 0;
            font-weight: 700;
            border-bottom: 2px solid #e6e6e6;
        }

        /* Cada fila con la misma estructura que la cabecera */
        .cart-items .cart-row {
            display: grid;
            grid-template-columns: 2fr 1fr 1fr 120px;
            gap: 12px;
            align-items: center;
            padding: 12px 0;
            border-bottom: 1px solid #f0f0f0;
            text-align: left;
        }

        .cart-items .cart-row .item-name { cursor: pointer; }
        .cart-items .cart-row:nth-child(even) { background: #fafafa; }

        /* Botón eliminar (rojo, estilizado) */
        .remove-item {
            justify-self: end;
            background-color: #dc3545;
            color: white;
            border: none;
            padding: 8px 12px;
            border-radius: 6px;
            cursor: pointer;
            font-weight: 600;
            transition: background-color .18s ease, transform .06s ease;
        }
        .remove-item:hover { background-color: #b02a37; transform: translateY(-1px); }

        /* Total y botón */
        .cart-total { margin-top: 14px; font-size: 18px; text-align:right; }
        .cart-button { margin-top: 12px; text-align:right; }
        #buy-button { padding: 10px 18px; background:#9BC855; color:#fff; border:none; border-radius:6px; cursor:pointer; }

        /* Toast (mensaje) */
        #add-to-cart-message {
            position: fixed;
            top: 20px;
            right: -400px;
            opacity: 0;
            padding: 10px 16px;
            border-radius: 8px;
            color: #fff;
            z-index: 9999;
            box-shadow: 0 8px 24px rgba(0,0,0,0.12);
            transition: right .33s ease, opacity .33s ease;
            font-family: sans-serif;
            font-weight: 600;
        }
        #add-to-cart-message.show { right: 20px; opacity: 1; }

        /* colores para toast */
        #add-to-cart-message.success { background: #28a745; }
        #add-to-cart-message.error   { background: #dc3545; }
        `;
        document.head.appendChild(style);
    }

    // Gestion del toast (mismo para añadir y eliminar, cambia la clase para color)
    let toastTimeout = null;
    function showToast(text, type = 'success') {
        messageBox.textContent = text;
        messageBox.classList.remove('success', 'error');
        messageBox.classList.add(type, 'show');
        if (toastTimeout) clearTimeout(toastTimeout);
        toastTimeout = setTimeout(() => {
            messageBox.classList.remove('show');
        }, 2200);
    }

    // Cargar carrito
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    function saveCart() {
        localStorage.setItem('cart', JSON.stringify(cart));
    }

    // Render del carrito (alineado con la cabecera)
    function renderCart() {
        if (!cartItemsContainer || !cartTotalElement) return;

        cartItemsContainer.innerHTML = '';
        let total = 0;

        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p class="empty-cart-message">Tu carrito está vacío.</p>';
            cartTotalElement.textContent = 'RD$ 0.00';
            return;
        }

        cart.forEach((item, index) => {
            const row = document.createElement('div');
            row.className = 'cart-row';
            row.dataset.index = index;

            row.innerHTML = `
                <div class="item-name" title="Doble clic para eliminar"><strong>${escapeHtml(item.name)}</strong></div>
                <div class="item-quantity">x${item.quantity}</div>
                <div class="item-price">RD$ ${(item.price * item.quantity).toFixed(2)}</div>
                <div class="item-action"><button class="remove-item" data-index="${index}">Eliminar</button></div>
            `;

            cartItemsContainer.appendChild(row);
            total += item.price * item.quantity;
        });

        cartTotalElement.textContent = `RD$ ${total.toFixed(2)}`;
        localStorage.setItem('cartTotal', total.toFixed(2));

        // Agregar listeners a botones eliminar
        const removeBtns = cartItemsContainer.querySelectorAll('.remove-item');
        removeBtns.forEach(btn => {
            btn.addEventListener('click', function (e) {
                const idx = parseInt(this.dataset.index, 10);
                if (isNaN(idx)) return;
                const removed = cart.splice(idx, 1);
                saveCart();
                renderCart();
                // mostrar mensaje igual al anterior solicitado
                showToast('¡Su producto ha sido eliminado!', 'error');
            });
        });

        // Agregar dblclick al nombre para eliminar
        const nameEls = cartItemsContainer.querySelectorAll('.item-name');
        nameEls.forEach(el => {
            el.addEventListener('dblclick', function (e) {
                // encontrar índice de la fila
                const row = this.closest('.cart-row');
                if (!row) return;
                const idx = parseInt(row.dataset.index, 10);
                if (isNaN(idx)) return;
                cart.splice(idx, 1);
                saveCart();
                renderCart();
                showToast('¡Su producto ha sido eliminado!', 'error');
            });
        });
    }

    // función auxiliar para escapar HTML (seguridad básica si nombres vienen del DOM)
    function escapeHtml(str) {
        if (typeof str !== 'string') return str;
        return str.replace(/[&<>"'`=\/]/g, function (s) {
            return ({
                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;',
                '"': '&quot;',
                "'": '&#39;',
                '/': '&#47;',
                '`': '&#96;',
                '=': '&#61;'
            })[s];
        });
    }

    // Si tu otra parte del proyecto llama a window.addToCart, no la sobrescribimos aquí.
    // Pero si quieres exponerla, la podrías definir aquí. (Asumo que ya la tienes en otro script.)

    // Comprar
    if (buyButton) {
        buyButton.addEventListener('click', function () {
            if (!cart || cart.length === 0) {
                alert('Tu carrito está vacío.');
                return;
            }
            window.location.href = "/Compra";
            cart = [];
            saveCart();
            renderCart();
        });
    }

    // render inicial
    renderCart();
});
