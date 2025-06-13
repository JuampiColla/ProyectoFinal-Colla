function mostrarRegistroUsuario() {
    Swal.fire({
        title: 'Registro de Usuario',
        html:
            '<input id="swal-input-nombre" class="swal2-input" placeholder="Nombre">' +
            '<input id="swal-input-email" class="swal2-input" placeholder="Email" type="email">' +
            '<input id="swal-input-pass" class="swal2-input" placeholder="Contraseña" type="password">',
        focusConfirm: false,
        showCancelButton: true,
        confirmButtonText: 'Registrar',
        cancelButtonText: 'Cancelar',
        preConfirm: () => {
            const nombre = document.getElementById('swal-input-nombre').value;
            const email = document.getElementById('swal-input-email').value;
            const pass = document.getElementById('swal-input-pass').value;
            if (!nombre || !email || !pass) {
                Swal.showValidationMessage('Completa todos los campos');
                return false;
            }
            if (!email.includes('@')) {
                Swal.showValidationMessage('El email debe contener un @');
                return false;
            }
            if (pass.length < 6) {
                Swal.showValidationMessage('La contraseña debe tener al menos 6 caracteres');
                return false;
            }
            return { nombre, email, pass };
        }
    }).then((result) => {
        if (result.isConfirmed && result.value) {
            let usuarios = JSON.parse(localStorage.getItem('usuarios')) || {};
            if (usuarios[result.value.email]) {
                Swal.fire('Error', 'El email ya está registrado.', 'error');
                return;
            }
            usuarios[result.value.email] = result.value;
            localStorage.setItem('usuarios', JSON.stringify(usuarios));
            Swal.fire('¡Registro exitoso!', 'Ahora puedes iniciar sesión.', 'success');
        }
    });
}

function mostrarLoginUsuario() {
    Swal.fire({
        title: 'Iniciar Sesión',
        html:
            '<input id="swal-input-email-login" class="swal2-input" placeholder="Email" type="email">' +
            '<input id="swal-input-pass-login" class="swal2-input" placeholder="Contraseña" type="password">',
        focusConfirm: false,
        showCancelButton: true,
        confirmButtonText: 'Ingresar',
        cancelButtonText: 'Cancelar',
        preConfirm: () => {
            const email = document.getElementById('swal-input-email-login').value;
            const pass = document.getElementById('swal-input-pass-login').value;
            if (!email || !pass) {
                Swal.showValidationMessage('Completa todos los campos');
                return false;
            }
            return { email, pass };
        }
    }).then((result) => {
        if (result.isConfirmed && result.value) {
            let usuarios = JSON.parse(localStorage.getItem('usuarios')) || {};
            let usuario = usuarios[result.value.email];
            if (usuario && usuario.pass === result.value.pass) {
                localStorage.setItem('usuarioActivo', JSON.stringify(usuario));
                Swal.fire('¡Bienvenido!', 'Hola, ' + usuario.nombre, 'success');
                actualizarEstadoSesion();
            } else {
                Swal.fire('Error', 'Usuario o contraseña incorrectos', 'error');
            }
        }
    });
}

function cerrarSesion() {
    localStorage.removeItem('usuarioActivo');
    Swal.fire('Sesión cerrada', '', 'info');
    actualizarEstadoSesion();
}

function mostrarHistorialCompras() {
    const usuario = JSON.parse(localStorage.getItem('usuarioActivo'));
    if (!usuario) {
        Swal.fire('Debes iniciar sesión para ver tu historial.', '', 'warning');
        return;
    }
    const historial = JSON.parse(localStorage.getItem('historialCompras')) || {};
    const compras = historial[usuario.email] || [];
    if (compras.length === 0) {
        Swal.fire('No tienes compras registradas.', '', 'info');
        return;
    }
    let html = '';
    compras.forEach((compra, idx) => {
        html += `<b>Compra ${idx + 1} - ${compra.fecha}</b><ul>`;
        compra.productos.forEach(prod => {
            html += `<li>${prod.nombre} - $${prod.precio}</li>`;
        });
        html += '</ul><hr>';
    });
    Swal.fire({
        title: 'Historial de compras',
        html: html,
        width: 600,
        scrollbarPadding: false
    });
}

function actualizarEstadoSesion() {
    const usuario = JSON.parse(localStorage.getItem('usuarioActivo'));
    document.getElementById('btn-login').style.display = usuario ? 'none' : '';
    document.getElementById('btn-registro').style.display = usuario ? 'none' : '';
    document.getElementById('btn-logout').style.display = usuario ? '' : 'none';
    document.getElementById('btn-historial').style.display = usuario ? '' : 'none';
    // Cambia el texto del botón de login por el nombre del usuario
    if (usuario) {
        document.getElementById('btn-login').textContent = usuario.nombre;
    } else {
        document.getElementById('btn-login').textContent = 'Iniciar sesión';
    }
}

// Llama al cargar la página
document.addEventListener('DOMContentLoaded', actualizarEstadoSesion);