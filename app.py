from flask import Flask, request, render_template, redirect, url_for, session
from database import models
from database import db
from werkzeug.utils import secure_filename
import hashlib
import filetype
import os
import uuid

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

@app.route('/usuarios', methods = ['GET'])
def usuarios():
    return render_template('usuarios.html')

@app.route('/estadisticas', methods = ['GET'])
def estadisticas():
    return render_template('estadisticas.html')

if __name__ == "__main__":
    app.run(debug=True)
