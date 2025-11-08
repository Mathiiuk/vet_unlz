// Función para verificar login hardcodeado
document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const errorMessage = document.getElementById('errorMessage');
    const logoutButton = document.getElementById('logout');
    const petForm = document.getElementById('petForm');
    const petTableBody = document.querySelector('#petTable tbody');

    // Credenciales hardcodeadas
    const validUser = 'admin';
    const validPass = '1234';

    // Manejar login
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            if (username === validUser && password === validPass) {
                localStorage.setItem('loggedIn', 'true');
                window.location.href = 'dashboard.html';
            } else {
                errorMessage.style.display = 'block';
            }
        });
    }

    // Verificar si está logueado en dashboard
    if (window.location.pathname.includes('dashboard.html')) {
        if (localStorage.getItem('loggedIn') !== 'true') {
            window.location.href = 'login.html';
        }
    }

    // Manejar logout
    if (logoutButton) {
        logoutButton.addEventListener('click', function() {
            localStorage.removeItem('loggedIn');
            window.location.href = 'index.html';
        });
    }

    // Manejar formulario de mascotas en dashboard
    if (petForm) {
        // Cargar mascotas desde localStorage
        loadPets();

        petForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const petName = document.getElementById('petName').value;
            const petOwner = document.getElementById('petOwner').value;
            addPet(petName, petOwner);
            petForm.reset();
        });
    }

    function addPet(name, owner) {
        const pets = JSON.parse(localStorage.getItem('pets')) || [];
        pets.push({ name, owner });
        localStorage.setItem('pets', JSON.stringify(pets));
        loadPets();
    }

    function loadPets() {
        const pets = JSON.parse(localStorage.getItem('pets')) || [];
        petTableBody.innerHTML = '';
        pets.forEach(pet => {
            const row = document.createElement('tr');
            row.innerHTML = `<td>${pet.name}</td><td>${pet.owner}</td>`;
            petTableBody.appendChild(row);
        });
    }
});