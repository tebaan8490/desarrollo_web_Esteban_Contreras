# desarrollo_web_Esteban_Contreras

El desarrollo de esta página web fue desarrollado como prototipo de un proyecto más grande, esto implicó en las siguientes consideraciones:

-Hay validaciones hechas para el fomulario de registro de usuarios pero no son absolutas, ya que las validaciones de correo electrónico y de teléfono son verificables solo enviando algún tipo de mensaje a estos medios.

## Recordar instalar las dependencias

pip install -r requirements.txt

## Configurar la base de datos

- Dirigirse a la carpeta 'database':

cd database

- Ejecutar las querys del archivo `create_user.sql`

- Entrar a mysql:

mysql -u cc5002 -p

- Ingresar contraseña

- Ejecutar `source create_db.sql`
- Ejectutar `source data.sql`

- Salir de mysql con `exit`

- Revisar el chcp de la terminal donde se ejecuta, si es distinto de 65001 ejecutar `chcp 65001`

- Desplegar la app con `python app.py`