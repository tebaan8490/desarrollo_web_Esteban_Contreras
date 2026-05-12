from flask import Flask, request, render_template, redirect, url_for, session
from sqlalchemy.orm import sessionmaker
from database import models
from database import db
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

@app.route('/', methods = ['GET'])
def index():
    return render_template("index.html")

@app.route('/registro', methods = ['GET', 'POST'])
def registro():
    if request.method == 'POST':
        error = ''
        status, msg = db.register_user(request.form.to_dict)
        if status:
            session['user'] = request.form.get('nombre_usuario')
            return redirect(url_for('index'))
        
        error += str(msg)
        return render_template('registro.html', error=error)
    
    elif request.method == "GET" and session.get("user", None):
        return redirect(url_for("index"))
    
    return render_template("registro.html")
        
@app.route('/login', methods = ['GET', 'POST'])
def login():
    if request.method == 'POST':
        error = ''
        user = request.form.get('nombre_usuario')
        password = request.form.get('contrasena')
        status, msg = db.try_login(user, password)
            
        if status:
            session['user'] = user
            return redirect(url_for('index'))
        
        error += str(msg)
        return render_template('login', error=error)
        
    return render_template('login.html')

@app.route('/actividades', methods = ['GET', 'POST'])
def actividades():
    
    return render_template('actividades.html')

@app.route('/usuarios', methods=['GET'])
def usuarios():
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

@app.route('/estadisticas', methods = ['GET'])
def estadisticas():
    return render_template('estadisticas.html')

if __name__ == "__main__":
    app.run(debug=True)
