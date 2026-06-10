from sqlalchemy import create_engine, Column, Integer, BigInteger, String, ForeignKey, select, asc, desc, func
from sqlalchemy.orm import sessionmaker, declarative_base, relationship
from database.models import Base, Miembro, Actividad, Foto, Comuna, Region, Comentario
from werkzeug.utils import secure_filename
import datetime
import os
from app import UPLOAD_FOLDER

DB_NAME = 'tarea2'
DB_USERNAME = 'cc5002'
DB_PASSWORD = 'programacionweb'
DB_HOST = 'localhost'
DB_PORT = '3306'

DATABASE_URL = f'mysql+pymysql://{DB_USERNAME}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}'

engine = create_engine(DATABASE_URL, echo=False, future=True)
SessionLocal = sessionmaker(bind=engine)

# funciones de la Base de Datos

def get_list_by(table, page_size, filters):
    """
    Busca un conjunto de elementos según los filtros, la cantidad y la tabla indicada

    Args:
        table: Tabla de MySQL
        page_size (int): Tamaño de resultados de la consulta
        filters (dict[str, any]): Diccionario con el nombre de las columnas y los valores que se buscan.

    Returns:
        list: Lista de objetos encontrados
    """

    session = SessionLocal()
    try:
        element = session.query(table).filter_by(**filters).limit(page_size).all()
    except Exception as e:
        raise e
    finally:
        session.close()
    return element

def make_dict(keys, values):
    """
    Crea un diccionario con las llaves y valores indicados.
    
    Args:
        keys (list[str]): Nombre de todas las llaves
        values (list[any]): Valores de cada llave
        
    Returns:
        dict[str, any]: Diccionario con todos los resultados
    """

    filters = {}
    for column_name, value in zip(keys, values):
        filters[column_name] = value
    return filters

def create_activity(data_formulario):
    session = SessionLocal()
    
    try:
        new_activity = Actividad(**data_formulario)
        session.add(new_activity)
        session.commit()
    finally:
        session.close()

def create_user(data_formulario):
    session = SessionLocal()
    try:
        new_user = Miembro(**data_formulario)
        session.add(new_user)
        session.commit()
    except Exception as e:
        raise e
    finally:
        session.close()
    

def register_user(data_formulario):
    try:
        if get_list_by(
            Miembro,
            1,
            {'nombre_usuario': data_formulario["username"]}
        ) != []:
            return False, 'El nombre de usuario ya está en uso.'
        elif get_list_by(
            Miembro,
            1,
            {'email': data_formulario['email']}
        ) != []:
            return False, 'El correo ya está en uso.'
        data_formulario = {
            'nombre_usuario': data_formulario['username'],
            'nombre_persona': data_formulario['nombre'],
            'email': data_formulario['email'],
            'telefono': data_formulario['telefono'],
            'rut': data_formulario['rut'],
            'rol': data_formulario['rol'],
            'comuna_id': data_formulario['id_comuna'],
            'region_id': data_formulario['id_region'],
            'contrasena': data_formulario['password']
        }
        create_user(data_formulario)
        return True, None
    except Exception as e:
        raise e
    
def try_login(nombre_usuario, contrasena):
    a_user = get_list_by(Miembro, 1, make_dict(['nombre_usuario', 'contrasena'], [nombre_usuario, contrasena]))
    if a_user == []:
        return False, "Usuario o contraseña incorrectos."
    
    if a_user[0].contrasena != contrasena:
        return False, "Usuario o contraseña incorrectos."
    
    return True, None

def get_miembros_paginados(pagina, orden, rol = 'todos'):
    session = SessionLocal()

    usuarios = []
    total_resultados = 0
    try:
        res = select(Miembro)

        if rol != 'todos':
            res = res.where(Miembro.rol == rol)
        
        if orden == 'nombre-asc':
            res = res.order_by(asc(Miembro.nombre_persona))
        elif orden == 'nombre-desc':
            res = res.order_by(desc(Miembro.nombre_persona))
        
        conteo = select(func.count()).select_from(res.subquery())
        total_resultados = session.scalar(conteo)

        if total_resultados is None:
            total_resultados = 0

        offset = (pagina -1) *5
        res = res.limit(5).offset(offset)

        usuarios = session.scalars(res).all()
        

    except Exception as e:
        raise e
    finally:
        session.close()

    return usuarios, total_resultados

def get_all(table):
    session = SessionLocal()
    try:
        elements = session.query(table).all()
    except Exception as e:
        raise e
    finally:
        session.close()
    return elements


def get_actividades(tipo_actividad):
    session = SessionLocal()
    try:
        if tipo_actividad == '':
            res = session.query(Actividad, Miembro, Foto).join(Miembro, Actividad.miembro_id == Miembro.id).join(Foto, Actividad.id == Foto.actividad_id).all()
        else:
            res = session.query(Actividad, Miembro, Foto).join(Miembro, Actividad.miembro_id == Miembro.id).join(Foto, Actividad.id == Foto.actividad_id).filter(Actividad.tipo == tipo_actividad).all()
    except Exception as e:
        raise e
    finally:
        session.close()
    return res

def create_actividad(datos_actividad, archivo_img, miembro_id):
    session = SessionLocal()
    try:
        dias_seleccionados = datos_actividad.getlist('dia')
        str_dias = ','.join(dias_seleccionados)

        nueva_actividad = Actividad(
            miembro_id=miembro_id,
            dia=str_dias,
            hora_inicio=datos_actividad.get('hora'),
            duracion=datos_actividad.get('duracion'),
            tipo=datos_actividad.get('categoria'),
            lugar=datos_actividad.get('lugar'),
            nombre_actividad=datos_actividad.get('titulo-actividad'),
            descripcion=datos_actividad.get('descripcion')
        )

        session.add(nueva_actividad)
        session.flush()

        imagen = archivo_img.get('imagen')
        nombre_archivo = secure_filename(imagen.filename)
        ruta_carpeta = UPLOAD_FOLDER
        if not os.path.exists(ruta_carpeta):
                os.makedirs(ruta_carpeta)
        ruta_final = os.path.join(ruta_carpeta, nombre_archivo)
        imagen.save(ruta_final)

        nueva_foto = Foto(
            ruta_archivo='uploads/',
            nombre_archivo=nombre_archivo,
            actividad_id=nueva_actividad.id
        )

        session.add(nueva_foto)
        session.commit()

        return True

    except Exception as e:
        session.rollback()
        print('Ha ocurrido el siguiente error: ' + str(e))
        return False
    finally:
        session.close()

def create_comentario(miembro_id, actividad_id, datos_comentario):
    session = SessionLocal()
    try:
        now = datetime.datetime.now()
        nuevo_comentario = Comentario(
            miembro_id=miembro_id,
            actividad_id=actividad_id,
            nombre=datos_comentario.get('comentador'),
            texto_comentario=datos_comentario.get('texto-comentario'),
            fecha_comentario=now,
        )

        session.add(nuevo_comentario)
        session.commit()

        return True

    except Exception as e:
        session.rollback()
        print('Ha ocurrido el siguiente error: ' + str(e))
        return False
    finally:
        session.close()