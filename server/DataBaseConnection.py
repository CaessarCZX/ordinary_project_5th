import mysql.connector

class DB:
    def __init__(self):
        self.__host = 'localhost'
        self.__user = 'root'
        # self.__password = 'arieljavier' #Contraseña de Gibran
        self.__db = 'db_proyectofinal'
        self.__password = '10102003' #Contraseña de Samuel
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
                foto_perfil BLOB,
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
                imagen BLOB,
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
        self.connect_and_execute(tables_queries)

    def connect_and_execute(self, queries):
        connection = mysql.connector.connect(
            user=self.__user,
            password=self.__password,
            host=self.__host,
            database=self.__db,
            port=self.__port
        )

        #Quitar o comentar desde el cursor hasta el connection.close() si ya tienes creada la base de datos.

        if not self.tables_exist():
            cursor = connection.cursor()

            if queries != None:
                for q in queries:
                    cursor.execute(q)

            connection.commit()
            cursor.close()
            connection.close()

        return connection
    
    def tables_exist(self):
        connection = mysql.connector.connect(
            user=self.__user,
            password=self.__password,
            host=self.__host,
            database=self.__db,
            port=self.__port
        )
        cursor = connection.cursor()

        cursor.execute("SHOW TABLES")
        tables = cursor.fetchall()

        cursor.close()
        connection.close()

        return len(tables) > 0

db = DB()