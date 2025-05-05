document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const lang = (urlParams.get('lan') || 'ES').toUpperCase();
    const validLanguages = ['ES', 'EN', 'PT'];
    const selectedLang = validLanguages.includes(lang) ? lang : 'ES';

    const ci = urlParams.get('ci');
    
    if (!ci) {
        console.error('No se proporcionó CI en la URL');
        return;
    }

    fetch(`../conf/config${selectedLang}.json`)
        .then(response => {
            if (!response.ok) throw new Error(`Error al cargar configuración de ${selectedLang}`);
            return response.json();
        })
        .then(config => {
            cargarDatos(ci)
                .then(datos => {
                    adaptarHTML(config, datos);
                })
                .catch(error => {
                    console.error('Error al cargar datos del perfil:', error);
                });
        })
        .catch(error => {
            console.error('Error:', error);
        });
});

async function cargarDatos(ci) {
    const response = await fetch(`../${ci}/perfil.json`);
    if (!response.ok) throw new Error('Error al cargar datos del perfil');
    return await response.json();
}

async function adaptarHTML(config, datos) {

    document.querySelector('.foto-perfil').src = `${`../${datos.ci}/${datos.ci}`}.jpg`;
    document.querySelector('.foto-perfil').onerror = () => {
        document.querySelector('.foto-perfil').src = `${`../${datos.ci}/${datos.ci}`}.png`;
    };

    document.querySelector('.titulo').textContent = datos.nombre;
    document.querySelector('.nombre').textContent = datos.nombre;
    document.querySelector('.descripcion').textContent = datos.descripcion;
    document.querySelector('#P1').textContent = config.color;
    document.querySelector('#R1').textContent = datos.color;
    document.querySelector('#P2').textContent = config.libro;
    document.querySelector('#R2').textContent = datos.libro;
    document.querySelector('#P3').textContent = config.musica;
    document.querySelector('#R3').textContent = datos.musica;
    document.querySelector('#P4').textContent = config.video_juego;
    document.querySelector('#R4').textContent = datos.video_juego;
    document.querySelector('#P5').innerHTML = `<strong>${config.lenguajes}</strong>`;
    document.querySelector('#R5').innerHTML = `<strong>${datos.lenguajes.join(' ')}</strong>`;

    document.querySelector('.email').insertAdjacentText('afterbegin', config.email + ' '); 
    document.querySelector('.email').querySelector('.correo-link').href = `mailto:${datos.email}`;
    document.querySelector('.email').querySelector('.correo-link').textContent = datos.email;e

    console.log('Datos del perfil:', datos);
    console.log('Configuración:', config);
}