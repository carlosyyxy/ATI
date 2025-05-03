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

function renderizarConfig(config) {

    document.querySelector('.titulo-principal').innerHTML = `${config.sitio[0]}<span class="ucv">${config.sitio[1]}</span> ${config.sitio[2]}`;
 
    document.querySelector('.header-index .Saludo').textContent = config.saludo;
    document.querySelector('.busqueda .buscarNombre').placeholder = config.nombre;
    document.querySelector('.busqueda .botonBuscar').value = config.buscar;




    // Llenar el footer
    document.querySelector('.footer-index').textContent = config.copyRight;

    

    // Llenar otros elementos según sea necesario
    console.log('Configuración cargada:', config);
}