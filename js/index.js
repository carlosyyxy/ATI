document.addEventListener('DOMContentLoaded', () => {
    fetch('../conf/configES.json')
        .then(response => {
            if (!response.ok) throw new Error('Error al cargar el JSON');
            return response.json();
        })
        .then(config => {
            renderizarConfig(config);
        })
        .catch(error => {
            console.error('Error:', error);
        });
});

async function renderizarConfig(config) {

    document.querySelector('.titulo-principal').innerHTML = `${config.sitio[0]}<span class="ucv">${config.sitio[1]}</span> ${config.sitio[2]}`;
 
    document.querySelector('.header-index .Saludo').textContent = config.saludo;
    document.querySelector('.busqueda .buscarNombre').placeholder = config.nombre;
    document.querySelector('.busqueda .botonBuscar').value = config.buscar;

        // Cargar lista de estudiantes desde datos/index.json
        try {
            const response = await fetch('../datos/index.json');
            if (!response.ok) throw new Error('Error al cargar estudiantes');
            const estudiantes = await response.json();
            
            const listaEstudiantes = document.querySelector('.section-index .estudiantes');
            listaEstudiantes.innerHTML = ''; // Limpiar lista existente
    
            // Generar HTML para cada estudiante
            estudiantes.forEach(estudiante => {
                const estudianteHTML = `
                    <li>
                        <img src="${estudiante.imagen}" alt="Foto ${estudiante.nombre}">
                        <div>${estudiante.nombre}</div>
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