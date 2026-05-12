import re

def validar_datos_registro(data):
    errores = []

    usuario = data.get('username', '').strip()
    nombre = data.get('nombre', '').strip()
    email = data.get('email', '').strip()
    telefono = data.get('telefono', '').strip()
    rut = data.get('rut', '').strip().replace(".", "")
    password = data.get('password', '')
    confirm_password = data.get('confirm-password', '')
    
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

    return errores