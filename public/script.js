const API_URL_USERS = '/users' //url base para las solis de usuarios
const API_URL_EVENTS = '/events' //url base para las solis de events

const form = document.getElementById('create-events-form') // formulario para agregar eventos
const formLogin=document.getElementById('loginForm')
const formRegister=document.getElementById('registerForm')
const eventTable = document.getElementById('events-table') // tabla donde se muestran los eventos
const messageDiv = document.getElementById('message')

//? ----------------------------Manejo eventos------------------------------------
//funcion para obtener los eventos desde el back
async function fetchEvents() {
    const res = await fetch(API_URL_EVENTS) // realizo una soli get al back
    const events = await res.json() // convierte la respuesta en un array de eventos
    renderEvents(events) // muestra los eventos de la table
}

// renderizamos los eventos de la tabla
function renderEvents(events) {
    const table = document.getElementById('events-table');
    table.innerHTML = ''; // Limpia la tabla
    events.forEach(event => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${event.id}</td>
            <td>${event.name}</td>
            <td>${event.place}</td>
            <td>${event.date}</td>
            <td>${event.hour}</td>
            <td>
                <button class="edit-btn" data-id="${event.id}">Edit</button>
                <button class="delete-btn" data-id="${event.id}">Delete</button>
            </td>
        `;
        table.appendChild(tr);
    });

    table.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = btn.getAttribute('data-id');
            deleteEvent(id);
        });
    });
}

// manejo del evento de enviar el formulario para agregar el evento
form.addEventListener('submit', async (e) => {
    e.preventDefault() // evitar que la pag se recargue
    const name = document.getElementById('name').value
    const place = document.getElementById('place').value
    const date = document.getElementById('date').value
    const hour = document.getElementById('hour').value

    //enviar una soli post al backend con el nuevo evento
    await fetch(API_URL_EVENTS, {
        method: 'POST',
        headers: { 
            'content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
        },
        body: JSON.stringify({ id: Date.now().toString(), name, place, date, hour })
    })
    form.reset() //limpiar el form
    fetchEvents() // actualizar la tabla de eventos
})

// eliminar un evento
async function deleteEvent(id) {
    await fetch(`${API_URL_EVENTS}/${id}`, { method: 'DELETE' }) //Realiza una soli delete al backend
    fetchEvents() // actualizar la tabla de eventos
}


//? ----------------------------Manejo usuarios------------------------------------
// Registro de usuario
formRegister.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = formRegister.querySelector('input[type="email"]').value;
    const password = formRegister.querySelector('input[type="password"]').value;

    const res = await fetch(`${API_URL_USERS}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (res.ok) {
        alert('Usuario registrado correctamente');
        formRegister.reset();
    } else {
        alert(data.error || 'Error al registrar');
    }
});

// Login de usuario
formLogin.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = formLogin.querySelector('input[type="email"]').value;
    const password = formLogin.querySelector('input[type="password"]').value;

    const res = await fetch(`${API_URL_USERS}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (res.ok && data.token) {
        localStorage.setItem('token', data.token);
        alert('Login exitoso');
        formLogin.reset();
        fetchProfile(); // Mostrar perfil tras login
    } else {
        alert(data.error || 'Error al iniciar sesión');
    }
});

/* Mostrar el usuario registrado */
async function fetchProfile() {
    const token = localStorage.getItem('token');
    if (!token) return;

    const res = await fetch(`${API_URL_USERS}/profile`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    if (res.ok) {
        const data = await res.json();
        messageDiv.textContent = `Welcome, ${data.user.email}`;
    } else {
        localStorage.removeItem('token');
        messageDiv.textContent = 'Session finished. Please, log in again.';
    }
}

// Llamadas iniciales
fetchEvents();
fetchProfile();