from flask import Flask, request, render_template, redirect, url_for, session
from sqlalchemy.orm import sessionmaker
from database import models, db, validaciones
from werkzeug.utils import secure_filename
import hashlib
import filetype
import os
import uuid
import math

UPLOAD_FOLDER = 'static/uploads'

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['SECRET_KEY'] = 'S3cR3t_k3Y'
app.config['MAX_CONTENT_LENGTH'] = 16*1024*1024 # 16Mb

@app.route('/', methods = ['GET', 'POST'])
def index():
    if session.get('user'):
        session.pop("user", None)
        session.pop("id", None)
    
    sessionq = db.SessionLocal()
    try:
        miembros = sessionq.query(models.Miembro).order_by(models.Miembro.fecha_registro.desc()).limit(5).all()
    except Exception as e:
        print(e)
        raise e
    finally:
        sessionq.close()

    if request.method == 'POST':
        error = ''
        user = request.form.get('nombre_usuario')
        password = request.form.get('contrasena')
        status, msg = db.try_login(user, password)
        
        sessionq = db.SessionLocal()

        if status:
            session['user'] = user
            session['id'] = sessionq.query(models.Miembro.id).filter(models.Miembro.nombre_usuario == user).scalar()
            sessionq.close()
            return redirect(url_for('inicio'))
        
        error += str(msg)
        return render_template('index.html', usuarios=miembros, error=error)
        
    return render_template('index.html', usuarios=miembros)

@app.get('/inicio')
def inicio():
    if not session.get('user'):
        return redirect(url_for('index'))
    return render_template('inicio.html')

@app.route('/registro', methods=['GET', 'POST'])
def registro():
    regiones = db.get_all(models.Region)
    comunas = db.get_all(models.Comuna)
    if request.method == 'POST':
        datos_formulario = request.form.to_dict()
        
        for llave, valor in datos_formulario.items():
            print(f"Campo: {llave} | Valor: {valor}")
        
        errores_validacion = validaciones.validar_datos_registro(datos_formulario)
        
        if errores_validacion:
            error_msg = "\n".join(errores_validacion)
            return render_template('registro.html', comunas=comunas, regiones=regiones, error=error_msg)

        status, msg = db.register_user(datos_formulario)
        
        if status:
            session['user'] = datos_formulario.get('username') 
            return redirect(url_for('inicio'))
        
        return render_template('registro.html', comunas=comunas, regiones=regiones, error=str(msg))
    
    if session.get("user"):
        return redirect(url_for("inicio"))
    
    return render_template("registro.html", comunas=comunas, regiones=regiones)

@app.route('/actividades', methods = ['GET', 'POST'])
def actividades():
    if not session.get('user'):
        return redirect(url_for('index'))
    
    filtro = request.args.get('filtro', '')
    actividades_filtradas = db.get_actividades(filtro)

    if request.method == 'POST':
        error = validaciones.validar_datos_actividad(request.form, request.files)

        if error != []:
            return render_template('actividades.html', actividades=actividades_filtradas, error=error)
        
        datos_actividad = request.form
        miembro_id = session.get('id')
        resultado = db.create_actividad(datos_actividad, request.files, miembro_id)

        if resultado:
            return redirect(url_for('actividades'))
        else:
            return render_template('actividades.html', actividades=actividades_filtradas, error=["Error al guardar en base de datos"])

    return render_template('actividades.html', actividades=actividades_filtradas)

@app.route('/usuarios', methods=['GET'])
def usuarios():
    if not session.get('user'):
        return redirect(url_for('index'))
    rol = request.args.get('rol', 'todos')
    orden = request.args.get('orden', 'nombre-asc')
    pagina = request.args.get('page', 1, type=int)
    
    usuarios, total_resultados = db.get_miembros_paginados(pagina, orden, rol)

    total_paginas = math.ceil(total_resultados / 5)

    return render_template('usuarios.html', 
                           usuarios=usuarios,   
                           pagina_actual=pagina,
                           total_paginas = total_resultados,
                           rol_actual=rol,
                           orden_actual=orden)

@app.get('/perfil_usuario/<int:miembro_id>')
def perfil_usuario(miembro_id):
    perfil = db.get_list_by(models.Miembro, 1, {'id': miembro_id})

    if not perfil:
        return redirect(url_for('inicio'))
    
    session = db.SessionLocal()
    try:
        actividades = session.query(models.Actividad, models.Foto).outerjoin(models.Foto, models.Actividad.id == models.Foto.actividad_id).filter(models.Actividad.miembro_id == miembro_id).all()
    except Exception as e:
        return render_template('perfil_usuario.html', error='No se pudo obtener el perfil del usuario')
    finally:
        session.close()

    return render_template('perfil_usuario.html', perfil=perfil[0], actividades=actividades)

@app.route('/estadisticas', methods = ['GET'])
def estadisticas():
    if not session.get('user'):
        return redirect(url_for('index'))
    return render_template('estadisticas.html')

if __name__ == "__main__":
    app.run(debug=True)
