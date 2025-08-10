document.addEventListener('DOMContentLoaded', function () {
    // ==============================
    // Carousel
    // ==============================
    const track = document.querySelector('.carousel-track');
    const prevBtn = document.querySelector('.carousel-btn1');
    const nextBtn = document.querySelector('.carousel-btn2');
    const cardWidth = 510;
    let index = 0;

    if (nextBtn && track) {
        nextBtn.addEventListener('click', () => {
            const maxScroll = track.scrollWidth - track.clientWidth;
            const move = (index + 1) * cardWidth;
            if (move <= maxScroll) {
                index++;
                track.style.transform = `translateX(-${index * cardWidth}px)`;
            }
        });
    }

    if (prevBtn && track) {
        prevBtn.addEventListener('click', () => {
            if (index > 0) {
                index--;
                track.style.transform = `translateX(-${index * cardWidth}px)`;
            }
        });
    }

    // ==============================
    // Carrito + Mensaje
    // ==============================
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    // Función para normalizar nombres
    function normalizeName(name) {
        return name
            .trim()
            .toLowerCase()
            .replace(/\s+/g, ' ') // espacios extra
            .replace(/s$/, '');  // quitar plural simple
    }

    // Fusionar duplicados al cargar
    function mergeCartDuplicates() {
        let seen = {};
        cart.forEach(item => {
            const key = normalizeName(item.name);
            if (seen[key]) {
                seen[key].quantity += item.quantity;
            } else {
                seen[key] = { ...item };
            }
        });
        cart = Object.values(seen);
        localStorage.setItem('cart', JSON.stringify(cart));
    }

    mergeCartDuplicates();

    // Crear caja de mensaje si no existe
    let messageBox = document.getElementById('add-to-cart-message');
    if (!messageBox) {
        messageBox = document.createElement('div');
        messageBox.id = 'add-to-cart-message';
        messageBox.className = 'add-to-cart-message';
        document.body.appendChild(messageBox);
    }

    // Inyectar CSS mínimo para el toast
    if (!document.getElementById('toast-style')) {
        const style = document.createElement('style');
        style.id = 'toast-style';
        style.textContent = `
            .add-to-cart-message {
                position: fixed;
                top: 20px;
                right: -360px;
                background: #28a745;
                color: #fff;
                padding: 10px 16px;
                border-radius: 6px;
                box-shadow: 0 6px 20px rgba(0,0,0,.2);
                transition: right .3s ease, opacity .3s ease;
                opacity: 0;
                z-index: 9999;
                font-family: sans-serif;
            }
            .add-to-cart-message.show {
                right: 20px;
                opacity: 1;
            }
        `;
        document.head.appendChild(style);
    }

    function showAddToCartMessage(name) {
        messageBox.textContent = `¡${name} añadido al carrito!`;
        messageBox.classList.add('show');
        setTimeout(() => {
            messageBox.classList.remove('show');
        }, 2000);
    }

    // Función global para agregar al carrito (evita duplicados)
    window.addToCart = function (productName, productPrice) {
        if (productPrice !== undefined) {
            const normalizedName = normalizeName(productName);

            const existingItemIndex = cart.findIndex(item =>
                normalizeName(item.name) === normalizedName
            );

            if (existingItemIndex !== -1) {
                cart[existingItemIndex].quantity++;
            } else {
                cart.push({
                    name: productName.trim(),
                    price: productPrice,
                    quantity: 1
                });
            }

            localStorage.setItem('cart', JSON.stringify(cart));
            showAddToCartMessage(productName.trim());
        } else {
            console.warn(`Price not defined for ${productName}`);
        }
    };

    // ==============================
    // Botones de productos
    // ==============================
    const productCards = document.querySelectorAll('.card');
    productCards.forEach(card => {
        const addButton = card.querySelector('.LabelAdd');
        if (addButton) {
            addButton.addEventListener('click', function () {
                const nameProductDiv = card.querySelector('.NameProduct, #NameProduct, .name-product');
                const productName = (nameProductDiv?.dataset.name || "Producto").trim();
                const productPrice = parseFloat(nameProductDiv?.dataset.price || 0);
                addToCart(productName, productPrice);
            });
        }
    });

    // ==============================
    // Botones dentro del carousel (opcional)
    // ==============================
    const carouselButtons = document.querySelectorAll('.LabelCarrusel');
    carouselButtons.forEach((button, idx) => {
        button.addEventListener('click', () => {
            const name = `Producto Carousel ${idx + 1}`;
            const price = 0; // puedes poner un precio real si lo tienes
            addToCart(name.trim(), price);
        });
    });
});
