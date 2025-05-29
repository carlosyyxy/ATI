document.addEventListener('DOMContentLoaded', () => {
    const parametroURL = new URLSearchParams(window.location.search);
    const lenguaje = (parametroURL.get('lan') || 'ES').toUpperCase();
    const lenguajeActual = ['ES', 'EN', 'PT'].includes(lenguaje) ? lenguaje : 'ES';
    const ci = parametroURL.get('ci');

    if (!ci) {
        console.error('CI no proporcionado en URL');
        return;
    }
    Promise.all([
        fetch(`../conf/config${lenguajeActual}.json`),
        fetch(`../${ci}/perfil.json`)
    ])
    .then(async ([configRes, perfilRes]) => {
        if (!configRes.ok) throw new Error(`Error config (${configRes.status})`);
        if (!perfilRes.ok) throw new Error(`Error perfil (${perfilRes.status})`);
        
        const [config, datos] = await Promise.all([
            configRes.json(),
            perfilRes.json()
        ]);
        
        actualizarDOM(config, datos, ci);
    })
    .catch(error => console.error('Error:', error));
});

function actualizarDOM(config, datos, ci) {
    const domCache = {
        fotoPerfil: document.querySelector('.foto-perfil'),
        titulo: document.querySelector('.titulo'),
        nombre: document.querySelector('.nombre'),
        descripcion: document.querySelector('.descripcion'),
        correoLink: document.querySelector('.correo-link'),
        emailContainer: document.querySelector('.email')
    };

    domCache.titulo.textContent = datos.nombre;
    domCache.nombre.textContent = datos.nombre;
    domCache.descripcion.textContent = datos.descripcion;
    domCache.correoLink.href = `mailto:${datos.email}`;
    domCache.correoLink.textContent = datos.email;
    domCache.emailContainer.insertAdjacentText('afterbegin', config.email + ' ');

    const campos = [
        { id: 'P1', valor: config.color },
        { id: 'R1', valor: datos.color },
        { id: 'P2', valor: config.libro },
        { id: 'R2', valor: datos.libro },
        { id: 'P3', valor: config.musica },
        { id: 'R3', valor: datos.musica },
        { id: 'P4', valor: config.video_juego },
        { id: 'R4', valor: datos.video_juego },
        { id: 'P6', valor: config.genero },
        { id: 'R6', valor: datos.genero },
        { id: 'P7', valor: config.fecha_nacimiento },
        { id: 'R7', valor: datos.fecha_nacimiento }
    ];

    campos.forEach(campo => {
        const elemento = document.getElementById(campo.id);
        if (elemento) elemento.textContent = campo.valor;
    });

    const p5 = document.getElementById('P5');
    const r5 = document.getElementById('R5');
    if (p5) p5.innerHTML = `<strong>${config.lenguajes}</strong>`;
    if (r5) r5.innerHTML = `<strong>${datos.lenguajes.join(' ')}</strong>`;

    domCache.fotoPerfil.src = `../${ci}/${ci}.jpg`;
    domCache.fotoPerfil.onerror = function() {
        this.onerror = null; 
        this.src = `../${ci}/${ci}.png`;
    };
}