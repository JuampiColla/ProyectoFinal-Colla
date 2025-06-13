let productos = [];

function estrellas(valoracion) {
    const llenas = Math.floor(valoracion);
    const media = valoracion % 1 >= 0.5 ? 1 : 0;
    let html = '';
    for (let i = 0; i < llenas; i++) html += '★';
    if (media) html += '½';
    for (let i = llenas + media; i < 5; i++) html += '☆';
    return html + ` (${valoracion})`;
}

function mostrarProductos(lista = productos) {
    const contenedor = document.getElementById('productos');
    contenedor.innerHTML = '';
    lista.forEach(prod => {
        const div = document.createElement('div');
        div.className = 'producto';
        div.innerHTML = `
            <img src="${prod.imagen}" alt="${prod.nombre}" width="150" style="cursor:pointer" onclick="mostrarDetalleProducto(${prod.id})"><br>
            <strong style="cursor:pointer" onclick="mostrarDetalleProducto(${prod.id})">${prod.nombre}</strong><br>
            Precio: $${prod.precio}<br>
            <button onclick="agregarAlCarrito(${prod.id})">Agregar al carrito</button>
        `;
        contenedor.appendChild(div);
    });
}

function mostrarDetalleProducto(id) {
    const prod = productos.find(p => p.id === id);
    Swal.fire({
        title: prod.nombre,
        html: `
            <img src="${prod.imagen}" alt="${prod.nombre}" width="250"><br>
            <strong>Precio:</strong> $${prod.precio}<br>
            <strong>Categoría:</strong> ${prod.categoria}<br>
            <strong>Stock disponible:</strong> ${prod.stock}<br>
            <strong>Valoración:</strong> ${estrellas(prod.valoracion)}<br>
            <p>${prod.descripcion}</p>
        `,
        showCancelButton: true,
        confirmButtonText: 'Agregar al carrito',
        cancelButtonText: 'Cerrar'
    }).then((result) => {
        if (result.isConfirmed) {
            agregarAlCarrito(prod.id);
        }
    });
}

fetch('productos.json')
    .then(response => response.json())
    .then(data => {
        productos = data;
        mostrarProductos();
        if (typeof actualizarCarrito === "function") actualizarCarrito();
    })
    .catch(error => {
        Swal.fire('Error', 'No se pudieron cargar los productos.', 'error');
        console.error(error);
    });