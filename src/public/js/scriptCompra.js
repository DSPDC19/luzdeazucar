function comprar() {
    document.getElementById("overlay").style.display = "block";
    setTimeout(() => {
        window.location.href = "/";
    }, 2000); // Ir a otra página después de 2 segundos
}

function cerrarPopup() {
    document.getElementById("overlay").style.display = "none";
}

document.addEventListener('DOMContentLoaded', function () {
    const totalGuardado = localStorage.getItem('cartTotal');
    if (totalGuardado) {
        document.getElementById('total-compra').textContent = `RD$ ${totalGuardado}`;
    }
});