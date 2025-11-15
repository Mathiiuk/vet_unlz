document.addEventListener('DOMContentLoaded', () => {
    
    // Busca el botón de menú en la página
    const menuToggle = document.querySelector('.menu-toggle');
    
    // Busca la barra lateral
    const sidebar = document.querySelector('.sidebar');

    // Si ambos existen...
    if (menuToggle && sidebar) {
        
        // ...al hacer clic en el botón...
        menuToggle.addEventListener('click', () => {
            
            // ...añade o quita la clase 'is-open' a la barra lateral.
            sidebar.classList.toggle('is-open');
        });
    }
});