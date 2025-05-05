document.addEventListener('DOMContentLoaded', () => {

    const urlParams = new URLSearchParams(window.location.search);
    const lang = (urlParams.get('lan') || 'ES').toUpperCase();
    const validLanguages = ['ES', 'EN', 'PT'];
    const selectedLang = validLanguages.includes(lang) ? lang : 'ES';



    fetch(`../conf/config${selectedLang}.json`)
        .then(response => {
            if (!response.ok) throw new Error(`Error al cargar configuración de ${selectedLang}`);
            return response.json();
        })
        .then(config => {
            adaptarHTML(config, selectedLang);
        })
        .catch(error => {
            console.error('Error:', error);
        });
});

async function adaptarHTML(config, selectedLang) {

    document.querySelector('.titulo-principal').innerHTML = `${config.sitio[0]}<span class="ucv">${config.sitio[1]}</span> ${config.sitio[2]}`;
 
    document.querySelector('.header-index .Saludo').textContent = config.saludo;
    document.querySelector('.busqueda .buscarNombre').placeholder = config.nombre;
    document.querySelector('.busqueda .botonBuscar').value = config.buscar;

        try {
            const response = await fetch('../datos/index.json');
            if (!response.ok) throw new Error('Error al cargar estudiantes');
            const estudiantes = await response.json();
            
            const listaEstudiantes = document.querySelector('.section-index .estudiantes');
            listaEstudiantes.innerHTML = ''; // Limpiar lista existente
    
            estudiantes.forEach(estudiante => {
                const estudianteHTML = `
                    <li>
                        <a href="perfil.html?lan=${selectedLang}&ci=${estudiante.ci}" style="text-decoration: none; color: inherit; display: block;">
                            <img src="${estudiante.imagen}" alt="Foto ${estudiante.nombre}">
                            <div>${estudiante.nombre}</div>
                        </a>
                    </li>
                `;
                listaEstudiantes.insertAdjacentHTML('beforeend', estudianteHTML);
            });
    
        } catch (error) {
            console.error('Error al cargar estudiantes:', error);
        }

    document.querySelector('.footer-index').textContent = config.copyRight;
    
    console.log('Configuración cargada:', config);
}