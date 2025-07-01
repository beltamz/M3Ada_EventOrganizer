const API_URL_USERS = '/users' //url base para las solis de usuarios
const API_URL_EVENTS = '/events' //url base para las solis de events

document.getElementById('message').textContent = 'Welcome, Stranger! 😶‍🌫️';
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

let editingEventId = null;
// renderizamos los eventos de la tabla
function renderEvents(events) {
    const tbody = document.getElementById('events-tbody');
    tbody.innerHTML = ''; // Limpia la tabla
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
        tbody.appendChild(tr); // <--- ¡Aquí el cambio!
    });

    tbody.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = btn.getAttribute('data-id');
            deleteEvent(id);
        });
    });

    tbody.querySelectorAll('.edit-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const id = btn.getAttribute('data-id');
            const event = events.find(ev => ev.id === id);
            if (event) {
                document.getElementById('name').value = event.name;
                document.getElementById('place').value = event.place;
                document.getElementById('date').value = event.date;
                document.getElementById('hour').value = event.hour;
                editingEventId = id;
                document.querySelector('#create-events-form button[type="submit"]').textContent = 'Confirm Edit';
            }
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

    if (editingEventId) {
        // Si estamos editando, hace un PUT
        await fetch(`${API_URL_EVENTS}/${editingEventId}`, {
            method: 'PATCH',
            headers: { 
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id:editingEventId,name, place, date, hour })
        });
        editingEventId = null; // Limpia el estado de edición
    } else {
        // Si no, crea un nuevo evento
        await fetch(API_URL_EVENTS, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
            },
            body: JSON.stringify({ id: Date.now().toString(), name, place, date, hour })
        });
    }
    form.reset();
    editingEventId = null;
    document.querySelector('#create-events-form button[type="submit"]').textContent = 'Add Event';
    fetchEvents();
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
        const username = data.user.email.split('@')[0];
        messageDiv.textContent = `Welcome, ${username} 😎!`;
    } else {
        localStorage.removeItem('token');
        messageDiv.textContent = 'Session finished. Please, log in again.';
    }
}

// Llamadas iniciales
fetchEvents();
fetchProfile();