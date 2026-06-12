import re
import filetype
from database import db, models

extensiones_permitidas = {'png', 'jpg', 'jpeg', 'gif'}

def validar_datos_registro(data):
    errores = []

    usuario = data.get('username', '').strip()
    nombre = data.get('nombre', '').strip()
    email = data.get('email', '').strip()
    telefono = data.get('telefono', '').strip()
    rut = data.get('rut', '').strip().replace(".", "")
    password = data.get('password', '')
    confirm_password = data.get('confirm-password', '')
    region = data.get('id_region', '').strip()
    comuna = data.get('id_comuna', '').strip()
    
    if not re.match(r"^[a-zA-Z0-9_]{3,20}$", usuario):
        errores.append("El nombre de usuario debe tener entre 3 y 20 caracteres (letras, números o guion bajo).")

    if not re.match(r"^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$", nombre):
        errores.append("El nombre completo solo puede contener letras y espacios.")

    if not re.match(r"^[a-z0-9.]+@[a-z0-9.-]+\.[a-z]{2,}$", email):
        errores.append("El correo electrónico no es válido.")

    if not re.match(r"^\+?[1-9]\d{1,14}$", telefono):
        errores.append("El número de teléfono no es válido.")

    if "-" not in rut:
        errores.append("El RUT debe incluir guion.")
    else:
        try:
            cuerpo, dv_ingresado = rut.split("-")
            dv_ingresado = dv_ingresado.lower()
            
            suma = 0
            multiplicador = 2
            for c in reversed(cuerpo):
                suma += int(c) * multiplicador
                multiplicador = multiplicador + 1 if multiplicador < 7 else 2
            
            dv_esperado = 11 - (suma % 11)
            if dv_esperado == 11: dv_esperado = '0'
            elif dv_esperado == 10: dv_esperado = 'k'
            else: dv_esperado = str(dv_esperado)

            if dv_ingresado != dv_esperado:
                errores.append("El RUT ingresado no es válido.")
        except:
            errores.append("Formato de RUT incorrecto.")

    
    if len(password) < 6:
        errores.append("La contraseña debe tener al menos 6 caracteres.")
    if not any(c.isupper() for c in password):
        errores.append("La contraseña debe tener al menos una mayúscula.")
    if not any(c.islower() for c in password):
        errores.append("La contraseña debe tener al menos una minúscula.")
    if not any(c.isdigit() for c in password):
        errores.append("La contraseña debe tener al menos un número.")
    
    if password != confirm_password:
        errores.append("Las contraseñas no coinciden.")

    if not region.isdigit() or not comuna.isdigit():
        errores.append("Región o comuna inválida.")
    else:
        region_id = int(region)
        comuna_id = int(comuna)
        region_exists = db.get_list_by(models.Region, 1, {'id': region_id})
        comuna_exists = db.get_list_by(models.Comuna, 1, {'id': comuna_id})

        if not region_exists:
            errores.append("La región seleccionada no existe.")
        if not comuna_exists:
            errores.append("La comuna seleccionada no existe.")
        elif comuna_exists[0].region_id != region_id:
            errores.append("La comuna no corresponde a la región seleccionada.")

    return errores

def validar_datos_actividad(form_data, archivos):
    errores = []
    categoria = form_data.get('categoria', '').strip()
    titulo = form_data.get('titulo-actividad', '').strip()
    descripcion = form_data.get('descripcion', '').strip()
    hora = form_data.get('hora', '').strip()
    duracion = form_data.get('duracion', '').strip()
    lugar = form_data.get('lugar', '').strip()
    imagen = archivos.get('imagen')
    dias_seleccionados = form_data.getlist('dia')

    categorias_validas = ['deporte', 'arte', 'tecnologia', 'otra']
    if categoria not in categorias_validas:
        errores.append("Debes seleccionar una categoría válida.")

    if not titulo or len(titulo) < 3:
        errores.append("El título de la actividad debe tener al menos 3 caracteres.")

    if not descripcion or len(descripcion) < 10:
        errores.append("La descripción de la actividad debe ser más detallada (mínimo 10 caracteres).")

    dias_validos = ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo']
    if not dias_seleccionados:
        errores.append("Debes seleccionar al menos un día de la semana.")

    if not re.match(r"^([01]?[0-9]|2[0-3]):[0-5][0-9]$", hora):
        errores.append("La hora debe tener un formato válido (Ej: 18:00 o 09:30).")

    try:
        duracion_num = float(duracion)
        if duracion_num <= 0:
            errores.append("La duración debe ser mayor a 0.")
    except ValueError:
        errores.append("La duración debe ser un número válido.")

    if not lugar:
        errores.append("El lugar de la actividad no puede estar vacío.")

    state = validar_imagen(imagen)

    if not state:
        errores.append("El archivo debe ser una imagen válida (PNG, JPG, JPEG, GIF).")

    return errores

def validar_imagen(archivo_flask):
    head = archivo_flask.read(2048) 
    archivo_flask.seek(0)
    
    tipo = filetype.guess(head)
    
    if tipo is None:
        return False
    
    if tipo.extension in extensiones_permitidas:
        return True
    else:
        return False
    
def validar_datos_comentario(form_data):
    errores = []
    comentarista = form_data.get('comentador', '').strip()
    texto_comentario = form_data.get('texto-comentario', '').strip()

    if not comentarista or len(comentarista) < 5:
        errores.append("El comentario debe tener un comentarista de al menos 5 caracteres.")

    return errores