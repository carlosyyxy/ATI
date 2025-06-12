from flask import Flask, request, jsonify, render_template_string, send_from_directory
import os
import json

PORT = 8080
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

app = Flask(__name__, static_folder='.')

@app.route('/index', methods=['GET'])
def index():
    lan = request.args.get('lan', 'ES').upper()
    if lan not in ['ES', 'EN', 'PT']:
        lan = 'ES'
    
    try:
        config_path = os.path.join(BASE_DIR, f'conf/config{lan}.json')
        index_path = os.path.join(BASE_DIR, 'datos/index.json')
        
        with open(config_path, 'r', encoding='utf-8') as f:
            config = json.load(f)
        
        with open(index_path, 'r', encoding='utf-8') as f:
            estudiantes = json.load(f)
        
        html = generate_index_html(config, estudiantes, lan)
        return render_template_string(html)
    
    except FileNotFoundError as e:
        return f"Error: {str(e)}", 404
    except Exception as e:
        return f"Error interno: {str(e)}", 500

@app.route('/perfil', methods=['GET'])
def perfil():
    ci = request.args.get('ci')
    lan = request.args.get('lan', 'ES').upper()
    if lan not in ['ES', 'EN', 'PT']:
        lan = 'ES'
    
    if not ci:
        return "CI no proporcionado", 400
    
    try:
        config_path = os.path.join(BASE_DIR, f'conf/config{lan}.json')
        perfil_path = os.path.join(BASE_DIR, f'{ci}/perfil.json')
        
        with open(config_path, 'r', encoding='utf-8') as f:
            config = json.load(f)
        
        with open(perfil_path, 'r', encoding='utf-8') as f:
            datos = json.load(f)
        
        html = generate_perfil_html(config, datos, ci)
        return render_template_string(html)
    
    except FileNotFoundError as e:
        return f"Error: {str(e)}", 404
    except Exception as e:
        return f"Error interno: {str(e)}", 500

@app.route('/<path:filename>')
def static_files(filename):
    return send_from_directory(BASE_DIR, filename)

def generate_index_html(config, estudiantes, lan):
    estudiantes_html = ""
    for estudiante in estudiantes:
        estudiantes_html += f"""
            <li>
                <a href="/perfil?lan={lan}&ci={estudiante['ci']}" style="text-decoration: none; color: inherit; display: block;">
                    <img src="{estudiante['imagen']}" alt="Foto {estudiante['nombre']}">
                    <div>{estudiante['nombre']}</div>
                </a>
            </li>
        """
    
    return f"""
<!DOCTYPE html>
<html lang="{lan.lower()}">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{config['sitio'][0]} {config['sitio'][1]} {config['sitio'][2]}</title>
    <link rel="stylesheet" href="/css/style.css">
</head>
<body class="index-body">
    <header class="header-index">
        <nav class="menu-header">
            <ul>
                <li class="titulo-principal">{config['sitio'][0]}<span class="ucv">{config['sitio'][1]}</span> {config['sitio'][2]}</li>
            </ul>
            <ul>
                <li class="Saludo">{config['saludo']}</li>
            </ul>
            <form class="busqueda">
                <input class="buscarNombre" type="text" placeholder="{config['nombre']}">
                <input class="botonBuscar" type="submit" value="{config['buscar']}">
            </form>
        </nav>
    </header>

    <section class="section-index">
        <ul class="estudiantes">
            {estudiantes_html}
        </ul>
    </section>
    <footer class="footer-index">
        {config['copyRight']}
    </footer>
</body>
</html>
"""

def generate_perfil_html(config, datos, ci):
    campos = [
        {'id': 'P1', 'valor': config['color']},
        {'id': 'R1', 'valor': datos['color']},
        {'id': 'P2', 'valor': config['libro']},
        {'id': 'R2', 'valor': datos['libro']},
        {'id': 'P3', 'valor': config['musica']},
        {'id': 'R3', 'valor': datos['musica']},
        {'id': 'P4', 'valor': config['video_juego']},
        {'id': 'R4', 'valor': datos['video_juego']},
        {'id': 'P6', 'valor': config['genero']},
        {'id': 'R6', 'valor': datos['genero']},
        {'id': 'P7', 'valor': config['fecha_nacimiento']},
        {'id': 'R7', 'valor': datos['fecha_nacimiento']}
    ]
    
    table_rows = []
    for i in range(0, len(campos), 2):
        p = campos[i]
        r = campos[i+1]
        table_rows.append(f"""
            <tr>
                <td id="{p['id']}">{p['valor']}</td>
                <td id="{r['id']}">{r['valor']}</td>
            </tr>
        """)
    
    table_rows.append(f"""
        <tr>
            <td id="P5"><strong>{config['lenguajes']}</strong></td>
            <td id="R5"><strong>{' '.join(datos['lenguajes'])}</strong></td>
        </tr>
    """)
    
    return f"""
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title class="titulo">{datos['nombre']}</title>
    <link rel="icon" href="/css/favicon.ico">
    <link rel="stylesheet" href="/css/style.css">
</head>
<body class="perfil-body">
    <div class="container">
        <div class="foto">
            <img class="foto-perfil" src="/{ci}/{ci}.jpg" onerror="this.onerror=null;this.src='/{ci}/{ci}.png'" alt="Foto de perfil">
        </div>
        <div class="info">
            <div class="nombre">{datos['nombre']}</div>
            <div class="descripcion">{datos['descripcion']}</div>
            <table class="detalle">
                {"".join(table_rows)}
            </table>            
            <div class="email">
                {config['email']} <a href="mailto:{datos['email']}" class="correo-link">{datos['email']}</a>
            </div>
        </div>
    </div>
</body>
</html>
"""

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=PORT)