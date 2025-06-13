let carrito = [];

function agregarAlCarrito(id) {
    const prod = productos.find(p => p.id === id);
    carrito.push(prod);
    actualizarCarrito();
    Swal.fire({
        icon: 'success',
        title: '¡Agregado!',
        text: `${prod.nombre} fue agregado al carrito.`
    });
}

function actualizarCarrito() {
    const lista = document.getElementById('carrito-lista');
    lista.innerHTML = '';
    carrito.forEach((prod, idx) => {
        const li = document.createElement('li');
        li.textContent = `${prod.nombre} - $${prod.precio}`;
        const btn = document.createElement('button');
        btn.textContent = 'Eliminar';
        btn.onclick = () => eliminarDelCarrito(idx);
        li.appendChild(btn);
        lista.appendChild(li);
    });
    document.getElementById('total').textContent =
        'Total: $' + carrito.reduce((acc, prod) => acc + prod.precio, 0);
}

function eliminarDelCarrito(idx) {
    carrito.splice(idx, 1);
    actualizarCarrito();
}

function finalizarCompra() {
    if (carrito.length === 0) {
        Swal.fire('El carrito está vacío', '', 'warning');
        return;
    }
    // Guardar historial de compras por usuario
    const usuario = JSON.parse(localStorage.getItem('usuarioActivo'));
    if (usuario) {
        let historial = JSON.parse(localStorage.getItem('historialCompras')) || {};
        if (!historial[usuario.email]) historial[usuario.email] = [];
        historial[usuario.email].push({
            fecha: new Date().toLocaleString(),
            productos: [...carrito]
        });
        localStorage.setItem('historialCompras', JSON.stringify(historial));
    }
    Swal.fire({
        title: '¡Compra realizada!',
        text: 'Gracias por tu compra.',
        icon: 'success'
    });
    carrito = [];
    actualizarCarrito();
}