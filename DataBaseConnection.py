import mysql.connector
from FlaskApp import User

def connect():
    # Configura la conexión a la base de datos
    conexion = mysql.connector.connect(
        host='localhost',
        user='room',
        password='******',
        database='DB Classic'
    )

    return conexion