// Esta función se ejecutará cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    
    // 1. LÓGICA DEL MENÚ MÓVIL (Sin cambios)
    const menuToggle = document.querySelector('.menu-toggle');
    const sidebar = document.querySelector('.sidebar');

    if (menuToggle && sidebar) {
        menuToggle.addEventListener('click', () => {
            sidebar.classList.toggle('is-open');
        });
    }

    // 2. LÓGICA DE CARGAR MASCOTAS (¡Nueva!)
    // Cargamos las mascotas en el sidebar CADA VEZ que se carga una página del portal
    cargarMascotasSidebar();
    
    // También cargamos las mascotas en el dashboard (si estamos en esa página)
    cargarDashboardMascotas();


    // 3. LÓGICA DE AGREGAR MASCOTA (¡Nueva!)
    // Buscamos el formulario de agregar mascota
    const addPetForm = document.querySelector('#form-agregar-mascota');
    
    // Si el formulario existe (solo en perfil-cliente.html)...
    if (addPetForm) {
        addPetForm.addEventListener('submit', (e) => {
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

            // Guardamos la mascota en localStorage
            guardarMascotaEnStorage(nuevaMascota);

            // Limpiamos el formulario
            addPetForm.reset();

            // Actualizamos el sidebar INMEDIATAMENTE
            cargarMascotasSidebar();
            
            alert('¡Mascota agregada con éxito!');
        });
    }
});


/* --- FUNCIONES DE MASCOTAS --- */

// Función para obtener la lista de mascotas de localStorage
function getMascotas() {
    let mascotas = JSON.parse(localStorage.getItem('vetSafeMascotas'));
    
    // Si no hay nada, inicializamos con la data estática por primera vez
    if (mascotas === null) {
        mascotas = [
            { id: 3, nombre: "Luna", especie: "Canino", raza: "Bulldog Francés", estado: "En Tratamiento" },
            { id: 1, nombre: "Fido", especie: "Canino", raza: "Labrador", estado: "Saludable" } 
        ];
        localStorage.setItem('vetSafeMascotas', JSON.stringify(mascotas));
    }
    return mascotas;
}

// Función para guardar una nueva mascota
function guardarMascotaEnStorage(mascota) {
    const mascotas = getMascotas(); // Obtenemos la lista actual
    mascotas.push(mascota); // Añadimos la nueva
    localStorage.setItem('vetSafeMascotas', JSON.stringify(mascotas)); // Guardamos
}

// Función para DIBUJAR las mascotas en el sidebar
function cargarMascotasSidebar() {
    const petsList = document.querySelector('#sidebar-pets-list');
    if (!petsList) return; // Si no está el elemento, no hacemos nada

    const mascotas = getMascotas();
    petsList.innerHTML = ''; // Limpiamos la lista

    mascotas.forEach(mascota => {
        // Obtenemos la inicial del nombre
        const initial = mascota.nombre ? mascota.nombre[0].toUpperCase() : '?';
        
        // Creamos el HTML para el "círculo"
        const html = `
            <li>
                <a href="#"> <span class="pet-avatar" title="${mascota.nombre}">${initial}</span>
                    <span class="pet-name">${mascota.nombre}</span>
                </a>
            </li>`;
        petsList.innerHTML += html;
    });
}

// Función para DIBUJAR las mascotas en el dashboard
function cargarDashboardMascotas() {
    const dashboardList = document.querySelector('#dashboard-pet-list');
    if (!dashboardList) return; // Solo se ejecuta en dashboard-cliente.html

    const mascotas = getMascotas();
    dashboardList.innerHTML = ''; // Limpiamos la lista estática

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
/* ============================================= */
/* AÑADE ESTE CÓDIGO A TU ARCHIVO script.js      */
/* ============================================= */

document.addEventListener('DOMContentLoaded', () => {
    
    // --- Lógica del Menú Móvil (EXISTENTE) ---
    const menuToggle = document.querySelector('.menu-toggle');
    const sidebar = document.querySelector('.sidebar');

    if (menuToggle && sidebar) {
        menuToggle.addEventListener('click', () => {
            sidebar.classList.toggle('is-open');
        });
    }

    
    // --- Lógica del Modal de Historial (NUEVA) ---
    const openModalButtons = document.querySelectorAll('.open-modal-btn');
    const closeModalButton = document.getElementById('modal-close-btn');
    const modal = document.getElementById('history-modal');
    const modalPatientName = document.getElementById('modal-patient-name');

    // Si encontramos el modal en la página...
    if (modal) {
        
        // Abrir el modal
        openModalButtons.forEach(button => {
            button.addEventListener('click', () => {
                // Obtenemos el nombre del paciente del atributo 'data-patient-name'
                const patientName = button.getAttribute('data-patient-name');
                
                // Actualizamos el título del modal
                modalPatientName.textContent = `Historial de ${patientName}`;
                
                // Mostramos el modal
                modal.classList.add('is-visible');
            });
        });

        // Función para cerrar el modal
        const closeModal = () => {
            modal.classList.remove('is-visible');
        };

        // Cerrar al hacer clic en el botón 'X'
        closeModalButton.addEventListener('click', closeModal);

        // Cerrar al hacer clic FUERA del modal (en el fondo oscuro)
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal();
            }
        });
    }
    
});

/* NOTA: Si ya tenías el 'document.addEventListener', simplemente
   copia la sección "Lógica del Modal de Historial (NUEVA)"
   y pégala DENTRO de tu 'addEventListener' existente.
*/