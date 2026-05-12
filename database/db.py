from sqlalchemy import create_engine, Column, Integer, BigInteger, String, ForeignKey
from sqlalchemy.orm import sessionmaker, declarative_base, relationship
from database.models import Base, Miembro, Actividad, Foto, Comuna, Region
import datetime

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
            {'nombre_usuario': data_formulario["nombre_usuario"]}
            ) is not None:
            return False, 'El nombre de usuario ya está en uso.'
        elif get_list_by(
            Miembro,
            1,
            {'email': data_formulario['email']}
        ):
            return False, 'El correo ya está en uso.'
        create_user(data_formulario)
        return True, None
    except Exception as e:
        raise e
    
def try_login(nombre_usuario, contraseña):
    a_user = get_list_by(Miembro, 1, make_dict(['nombre_usuario', 'contraseña'], [nombre_usuario, contraseña]))
    if a_user is None:
        return False, "Usuario o contraseña incorrectos."
    
    if a_user[0].contraseña != contraseña:
        return False, "Usuario o contraseña incorrectos."
    
    return True, None
