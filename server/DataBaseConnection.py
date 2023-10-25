import mysql.connector

class DB:
    def __init__(self):
        self.__host = 'localhost'
        self.__user = 'root'
        self.__password = 'arieljavier'  # Reemplaza con tu contraseña
        self.__db = 'db_proyectofinal'  # Reemplaza con el nombre de tu base de datos
        self.__port = '3306'

        # Conectar a la base de datos o crearla si no existe
        self.__create_database()

        # Define las tablas y créalas si no existen
        self.__create_tables()

    def __create_database(self):
        connection = mysql.connector.connect(
            host=self.__host,
            user=self.__user,
            password=self.__password
        )
        cursor = connection.cursor()
       
        # Crea la base de datos si no existe
        cursor.execute(f"CREATE DATABASE IF NOT EXISTS {self.__db}")

        cursor.close()
        connection.close()

    def __create_tables(self):
        # Define las consultas SQL para crear las tablas
        tables_queries = [
            """
            CREATE TABLE IF NOT EXISTS usuarios (
                id_usuario INT PRIMARY KEY NOT NULL,
                username VARCHAR(35) UNIQUE,
                nombre VARCHAR(35),
                apellido VARCHAR(30),
                correo_electronico VARCHAR(80) UNIQUE,
                contrasena_hash VARCHAR(128),
                fecha_nacimiento DATE,
                biografia TEXT,
                sexo VARCHAR(30)
            )
            """,
            """
            CREATE TABLE IF NOT EXISTS publicaciones (
                id_publicacion INT PRIMARY KEY NOT NULL,
                id_usuario INT,
                FOREIGN KEY(id_usuario) REFERENCES usuarios(id_usuario) ON UPDATE CASCADE ON DELETE CASCADE,
                contenido_publicacion TEXT,
                fecha_depublicacion DATETIME DEFAULT CURRENT_TIMESTAMP,
                titulo VARCHAR(50) NOT NULL,
                imagen VARCHAR(90),
                reaccion INT
            )
            """,
            """
            CREATE TABLE IF NOT EXISTS likes (
                id_likes INT PRIMARY KEY NOT NULL,
                id_usuario INT,
                FOREIGN KEY(id_usuario) REFERENCES usuarios(id_usuario) ON UPDATE CASCADE ON DELETE CASCADE,
                id_publicacion INT,
                FOREIGN KEY(id_publicacion) REFERENCES publicaciones(id_publicacion) ON UPDATE CASCADE ON DELETE CASCADE
            )
            """,
            """
            CREATE TABLE IF NOT EXISTS comentarios (
                id_comentario INT PRIMARY KEY NOT NULL,
                id_usuario INT,
                FOREIGN KEY(id_usuario) REFERENCES usuarios(id_usuario) ON UPDATE CASCADE ON DELETE CASCADE,
                id_publicacion INT,
                FOREIGN KEY(id_publicacion) REFERENCES publicaciones(id_publicacion) ON UPDATE CASCADE ON DELETE CASCADE,
                contenidocomentario TEXT,
                fecha_depublicacioncomentario DATETIME DEFAULT CURRENT_TIMESTAMP
            )
            """,
            """
            CREATE TABLE IF NOT EXISTS amistades (
                id_amistad INT PRIMARY KEY NOT NULL,
                id_usuarioa INT,
                id_usuariob INT,
                fecha_amistad DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (id_usuarioa) REFERENCES usuarios(id_usuario) ON UPDATE CASCADE ON DELETE CASCADE,
                FOREIGN KEY (id_usuariob) REFERENCES usuarios(id_usuario) ON UPDATE CASCADE ON DELETE CASCADE
            )
            """
        ]

        # Conectar y ejecutar las consultas
        self.__connect_and_execute(tables_queries)

    def __connect_and_execute(self, queries):
        connection = mysql.connector.connect(
            user=self.__user,
            password=self.__password,
            host=self.__host,
            database=self.__db,
            port=self.__port
        )

        cursor = connection.cursor()

        for q in queries:
            cursor.execute(q)

        connection.commit()
        cursor.close()
        connection.close()

# Crear una instancia de la clase DB para verificar y crear la base de datos y las tablas
db = DB()
