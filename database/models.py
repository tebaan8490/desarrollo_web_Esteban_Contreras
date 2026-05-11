from sqlalchemy import DateTime, Column, Integer, BigInteger, String, Enum, ForeignKey, Text
from sqlalchemy.orm import declarative_base, relationship

Base = declarative_base()

class Region(Base):
    __tablename__ = 'region'

    id = Column(Integer, primary_key=True, autoincrement=True)
    nombre = Column(String(200), nullable=False)

    # Relación con Comuna
    comunas = relationship('Comuna', back_populates='region')


class Comuna(Base):
    __tablename__ = 'comuna'

    id = Column(Integer, primary_key=True, autoincrement=True)
    nombre = Column(String(200), nullable=False)
    region_id = Column(Integer, ForeignKey('region.id'), nullable=False)

    # Relaciones
    region = relationship('Region', back_populates='comunas')
    miembros = relationship('Miembro', back_populates='comuna')


class Miembro(Base):
    __tablename__ = 'miembro'

    id = Column(BigInteger, primary_key=True, autoincrement=True)
    nombre_usuario = Column(String(255), nullable=False)
    nombre = Column(String(255), nullable=False)
    email = Column(String(80), nullable=False)
    telefono = Column(String(15), nullable=False)
    rut = Column(String(12), nullable=False)
    rol = Column(Enum('estudiante', 'funcionario', 'docente', name='rol_enum'), nullable=False)
    fecha_registro = Column(DateTime, nullable=False)
    comuna_id = Column(Integer, ForeignKey('comuna.id'), nullable=False)
    region_id = Column(Integer, nullable=False) # Se mantiene sin ForeignKey porque el SQL no declara el CONSTRAINT
    contraseña = Column(String(255), nullable=False)

    # Relaciones
    comuna = relationship('Comuna', back_populates='miembros')
    actividades = relationship('Actividad', back_populates='miembro')


class Actividad(Base):
    __tablename__ = 'actividad'

    id = Column(Integer, primary_key=True, autoincrement=True)
    miembro_id = Column(BigInteger, ForeignKey('miembro.id'), nullable=False)
    dia = Column(Enum('lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado', 'domingo', name='dia_enum'), nullable=False)
    hora_inicio = Column(String(5), nullable=False)
    duracion = Column(String(5), nullable=False)
    tipo = Column(Enum('arte', 'deporte', 'tecnología', 'social', 'recreación', 'otra', name='tipo_enum'), nullable=False)
    nombre = Column(String(45), nullable=False)
    descripcion = Column(Text, nullable=True)

    # Relaciones
    miembro = relationship('Miembro', back_populates='actividades')
    fotos = relationship('Foto', back_populates='actividad')


class Foto(Base):
    __tablename__ = 'foto'

    id = Column(Integer, primary_key=True, autoincrement=True)
    ruta_archivo = Column(String(300), nullable=False)
    nombre_archivo = Column(String(300), nullable=False)
    actividad_id = Column(Integer, ForeignKey('actividad.id'), nullable=False)

    # Relación
    actividad = relationship('Actividad', back_populates='fotos')