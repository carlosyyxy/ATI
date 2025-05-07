document.addEventListener('DOMContentLoaded', () => {
    const parametroURL = new URLSearchParams(window.location.search);
    const lenguaje = (parametroURL.get('lan') || 'ES').toUpperCase();
    const lenguajesValidos = ['ES', 'EN', 'PT'];
    const lenguajeActual = lenguajesValidos.includes(lenguaje) ? lenguaje : 'ES';

    fetch(`../conf/config${lenguajeActual}.json`)
        .then(response => {
            if (!response.ok) throw new Error(`Error al cargar configuración de ${lenguajeActual}`);
            return response.json();
        })
        .then(config => {
            adaptarHTML(config, lenguajeActual);
        })
        .catch(error => {
            console.error('Error:', error);
        });
});

async function adaptarHTML(config, lenguajeActual) {
    let estudiantesData = []; 

    document.querySelector('.titulo-principal').innerHTML = `${config.sitio[0]}<span class="ucv">${config.sitio[1]}</span> ${config.sitio[2]}`;
    document.querySelector('.header-index .Saludo').textContent = config.saludo;
    document.querySelector('.busqueda .buscarNombre').placeholder = config.nombre;
    document.querySelector('.busqueda .botonBuscar').value = config.buscar;

    try {
        const response = await fetch('../datos/index.json');
        if (!response.ok) throw new Error('Error al cargar estudiantes');
        estudiantesData = await response.json();
        
        const listaEstudiantes = document.querySelector('.section-index .estudiantes');
        const buscarNombreInput = document.querySelector('.busqueda .buscarNombre');
        const filtrarEstudiantes = (query) => {
        const filtered = estudiantesData.filter(est => 
                est.nombre.toLowerCase().includes(query.toLowerCase())
            );
            
            listaEstudiantes.innerHTML = '';
            
            if (filtered.length === 0) {
                document.querySelector('.section-index').innerHTML = 
                `<h1 class="no-estudiantes">${config.noResults || config.error_busqueda} ${query}
                </h1>`;
            } else {
                filtered.forEach(estudiante => {
                    const estudianteHTML = `
                        <li>
                            <a href="perfil.html?lan=${lenguajeActual}&ci=${estudiante.ci}" style="text-decoration: none; color: inherit; display: block;">
                                <img src="${estudiante.imagen}" alt="Foto ${estudiante.nombre}">
                                <div>${estudiante.nombre}</div>
                            </a>
                        </li>
                    `;
                    listaEstudiantes.insertAdjacentHTML('beforeend', estudianteHTML);
                });
            }
        };

        buscarNombreInput.addEventListener('input', (e) => {
            const query = e.target.value.trim();
            filtrarEstudiantes(query);
        });

        filtrarEstudiantes('');

    } catch (error) {
        console.error('Error al cargar estudiantes:', error);
    }

    document.querySelector('.footer-index').textContent = config.copyRight;
}