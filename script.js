/* =================================================== */
/* SCRIPT ÚNICO Y COMBINADO PARA VETSAFE         */
/* =================================================== */

// Esta función se ejecutará cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. LÓGICA DEL MENÚ MÓVIL (Funciona en AMBOS portales) ---
    const menuToggle = document.querySelector('.menu-toggle');
    const sidebar = document.querySelector('.sidebar');

    if (menuToggle && sidebar) {
        menuToggle.addEventListener('click', () => {
            sidebar.classList.toggle('is-open');
        });
    }

    /* * A partir de aquí, el script detectará en qué
     * página está y ejecutará solo el código necesario.
     */

    // --- 2. LÓGICA DEL PORTAL DEL CLIENTE ---
    const addPetForm = document.querySelector('#form-agregar-mascota');
    
    // Si existe el formulario, estamos en 'perfil-cliente.html'
    if (addPetForm) {
        addPetForm.addEventListener('submit', handleAddPetSubmit);
    }
    
    // Si estamos en CUALQUIER página del portal de cliente...
    if (document.querySelector('#sidebar-pets-list')) {
        cargarMascotasSidebar();
    }
    if (document.querySelector('#dashboard-pet-list')) {
        cargarDashboardMascotas();
    }


    // --- 3. LÓGICA DEL PANEL INTERNO (ADMIN) ---
    const openModalButtons = document.querySelectorAll('.open-modal-btn');
    const modal = document.getElementById('history-modal');
    
    // Si existen los botones y el modal, estamos en 'pacientes.html'
    if (modal && openModalButtons.length > 0) {
        const closeModalButton = document.getElementById('modal-close-btn');
        const modalPatientName = document.getElementById('modal-patient-name');
        
        // Abrir el modal
        openModalButtons.forEach(button => {
            button.addEventListener('click', () => {
                const patientName = button.getAttribute('data-patient-name');
                modalPatientName.textContent = `Historial de ${patientName}`;
                modal.classList.add('is-visible');
            });
        });

        // Función para cerrar el modal
        const closeModal = () => modal.classList.remove('is-visible');

        closeModalButton.addEventListener('click', closeModal);
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal();
        });
    }
    
}); // --- FIN DEL 'DOMContentLoaded' ---


/* =================================================== */
/* FUNCIONES DEL PORTAL CLIENTE              */
/* =================================================== */

function handleAddPetSubmit(e) {
    // Prevenimos que la página se recargue
    e.preventDefault(); 
    
    // Obtenemos los valores del formulario
    const nombre = document.querySelector('#pet-nombre').value;
    const especie = document.querySelector('#pet-especie option:checked').text;
    const raza = document.querySelector('#pet-raza').value;
    const genero = document.querySelector('#pet-genero option:checked').text;
    const nacimiento = document.querySelector('#pet-nacimiento').value;

    if (!nombre || !especie) {
        alert('Por favor, completa al menos el nombre y la especie.');
        return;
    }

    // Creamos un objeto para la nueva mascota
    const nuevaMascota = {
        id: Date.now(), // ID único simple
        nombre: nombre,
        especie: especie,
        raza: raza,
        genero: genero,
        fechaNacimiento: nacimiento,
        estado: 'Saludable' // Estado por defecto
    };

    guardarMascotaEnStorage(nuevaMascota);
    e.target.reset(); // Limpia el formulario
    cargarMascotasSidebar(); // Actualiza el sidebar
    
    alert('¡Mascota agregada con éxito!');
}

function getMascotas() {
    let mascotas = JSON.parse(localStorage.getItem('vetSafeMascotas'));
    if (mascotas === null) {
        mascotas = [
            { id: 3, nombre: "Luna", especie: "Canino", raza: "Bulldog Francés", estado: "En Tratamiento" },
            { id: 1, nombre: "Fido", especie: "Canino", raza: "Labrador", estado: "Saludable" } 
        ];
        localStorage.setItem('vetSafeMascotas', JSON.stringify(mascotas));
    }
    return mascotas;
}

function guardarMascotaEnStorage(mascota) {
    const mascotas = getMascotas();
    mascotas.push(mascota);
    localStorage.setItem('vetSafeMascotas', JSON.stringify(mascotas));
}

function cargarMascotasSidebar() {
    const petsList = document.querySelector('#sidebar-pets-list');
    if (!petsList) return; 

    const mascotas = getMascotas();
    petsList.innerHTML = ''; 

    mascotas.forEach(mascota => {
        const initial = mascota.nombre ? mascota.nombre[0].toUpperCase() : '?';
        const html = `
            <li>
                <a href="#">
                    <span class="pet-avatar" title="${mascota.nombre}">${initial}</span>
                    <span class="pet-name">${mascota.nombre}</span>
                </a>
            </li>`;
        petsList.innerHTML += html;
    });
}

function cargarDashboardMascotas() {
    const dashboardList = document.querySelector('#dashboard-pet-list');
    if (!dashboardList) return;

    const mascotas = getMascotas();
    dashboardList.innerHTML = '';

    mascotas.forEach(mascota => {
        const estadoClass = mascota.estado === 'En Tratamiento' ? 'status-treatment' : 'status-healthy';
        const html = `
            <div class="pet-card">
                <div class="pet-info">
                    <h4>${mascota.nombre} (ID: ${mascota.id})</h4>
                    <p>${mascota.especie} - ${mascota.raza || 'Raza no especificada'}</p>
                </div>
                <span class="status ${estadoClass}">${mascota.estado}</span>
            </div>`;
        dashboardList.innerHTML += html;
    });
}