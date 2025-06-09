document.addEventListener('DOMContentLoaded', function() {
    // Datos de los testimonios
    const testimonios = [
        {
            nombre: "Roberto Casado",
            cita: "LOS MEJORES BIZCOCHOS",
            contenido: "El sabor y la textura son simplemente perfectos. Totalmente recomendado.",
            imagen: "../img/usuario.png"
        },
        {
            nombre: "Carlos Méndez",
            cita: "POSTRES QUE ALEGRAN EL DÍA",
            contenido: "Nunca había probado algo tan rico. ¡Volveré pronto por más!",
            imagen: "../img/usuario.png"
        },
        {
            nombre: "Lucía Romero",
            cita: "SABOR CASERO INIGUALABLE",
            contenido: "Cada pastel tiene ese toque especial que te hace sentir como en casa.",
            imagen: "../img/usuario.png"
        },
        {
            nombre: "Ana García",
            cita: "CALIDAD INSUPERABLE",
            contenido: "La frescura de los ingredientes se nota en cada bocado.",
            imagen: "../img/usuario.png"
        },
        {
            nombre: "Esteban Duarte",
            cita: "UNA EXPERIENCIA DULCE Y MEMORABLE",
            contenido: "Desde la primera mordida supe que volvería. ¡Todo está hecho con amor y calidad!",
            imagen: "../img/usuario.png"
        }
    ];
    
    // Elementos del DOM
    const carousel = document.getElementById('testimonios-carousel');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    
    // Generar testimonios
    function renderTestimonios() {
        carousel.innerHTML = '';
        
        testimonios.forEach(testimonio => {
            const testimonioElement = document.createElement('div');
            
            testimonioElement.innerHTML = `
                <img src="${testimonio.imagen}" alt="${testimonio.nombre}">
                <h4>${testimonio.nombre}</h4>
                <h3>“${testimonio.cita}”</h3>
                <p>${testimonio.contenido}</p>
            `;
            
            carousel.appendChild(testimonioElement);
        });
    }
    
    // Inicializar testimonios
    renderTestimonios();
    
    // Funcionalidad del carrusel
    let currentIndex = 0;
    let items = document.querySelectorAll('.testimonios-carousel > div');
    let itemCount = items.length;
    let isDragging = false;
    let startPos = 0;
    let currentTranslate = 0;
    let prevTranslate = 0;
    let animationID;
    let currentSlide = 0;
    
    // Actualizar elementos después de renderizar
    function updateCarouselElements() {
        items = document.querySelectorAll('.testimonios-carousel > div');
        itemCount = items.length;
    }
    
    // Actualizar carrusel
    function updateCarousel() {
        const itemWidth = items[0].offsetWidth + 30; // Ancho del item + gap
        carousel.scrollTo({
            left: currentIndex * itemWidth,
            behavior: 'smooth'
        });
        
        // Actualizar estado de los botones
        prevBtn.disabled = currentIndex === 0;
        nextBtn.disabled = currentIndex >= itemCount - 1;
    }
    
    // Event listeners para botones
    prevBtn.addEventListener('click', () => {
        if (currentIndex > 0) {
            currentIndex--;
            updateCarousel();
        }
    });
    
    nextBtn.addEventListener('click', () => {
        if (currentIndex < itemCount - 1) {
            currentIndex++;
            updateCarousel();
        }
    });
    
    // Touch events para móviles
    carousel.addEventListener('touchstart', touchStart, { passive: true });
    carousel.addEventListener('touchend', touchEnd, { passive: false });
    carousel.addEventListener('touchmove', touchMove, { passive: true });
    
    // Mouse events para desktop
    carousel.addEventListener('mousedown', touchStart);
    carousel.addEventListener('mouseup', touchEnd);
    carousel.addEventListener('mouseleave', touchEnd);
    carousel.addEventListener('mousemove', touchMove);
    
    // Funciones para el desplazamiento táctil
    function touchStart(e) {
        if (e.type === 'touchstart') {
            startPos = e.touches[0].clientX;
        } else {
            startPos = e.clientX;
            e.preventDefault();
        }
        
        isDragging = true;
        animationID = requestAnimationFrame(animation);
        carousel.classList.add('grabbing');
    }
    
    function touchMove(e) {
        if (isDragging) {
            const currentPosition = e.type === 'touchmove' ? e.touches[0].clientX : e.clientX;
            const diff = currentPosition - startPos;
            carousel.scrollLeft = prevTranslate - diff;
        }
    }
    
    function touchEnd() {
        isDragging = false;
        cancelAnimationFrame(animationID);
        carousel.classList.remove('grabbing');
        
        const itemWidth = items[0].offsetWidth + 30;
        const newIndex = Math.round(carousel.scrollLeft / itemWidth);
        
        if (newIndex !== currentIndex) {
            currentIndex = newIndex;
            updateCarousel();
        }
    }
    
    function animation() {
        setSliderPosition();
        if (isDragging) requestAnimationFrame(animation);
    }
    
    function setSliderPosition() {
        carousel.style.transform = `translateX(${currentTranslate}px)`;
    }
    
    // Inicializar
    updateCarouselElements();
    updateCarousel();
    
    // Recalcular en redimensionamiento
    window.addEventListener('resize', () => {
        updateCarouselElements();
        updateCarousel();
    });
});