from flask import Flask, request, jsonify, session
import jwt
import secrets
import random
import bcrypt
from datetime import datetime, timedelta
from DataBaseConnection import DB

app = Flask(__name__)
app.config['SECRET_KEY'] = secrets.token_hex(32)

# Crear una instancia de la clase DB para verificar y crear la base de datos y las tablas
db = DB()

#Modelo del usuario
class User:
    def __init__(self, iduser, firstname, lastname, username, mail, password, year, month, day, profile, biography, sex):
        self.iduser = iduser
        self.firstname = firstname
        self.lastname = lastname
        self.username = username
        self.mail = mail
        self.password = password
        self.year = year
        self.month = month
        self.day = day
        self.profile = profile
        self.biography = biography
        self.sex = sex
    
    def print_info(self):
        print(f"Usuario ID: {self.iduser}")
        print(f"Nombre: {self.firstname} {self.lastname}")
        print(f"Correo: {self.mail}")
        print(f"Password: {self.password}")
        print(f"Fecha de nacimiento: {self.year}/{self.month}/{self.day}")
    
    def edit_profile(self, newUsername, newPassword, newProfile, newBiography, newSex):
        self.username = newUsername
        self.password = newPassword
        self.profile = newProfile
        self.biography = newBiography
        self.sex = newSex

    #Ejemplos de posibles metodos
    def add_social(self, networksocial):
        self.networksocials.append(networksocial)

    def remove_social(self, networksocial):
        if networksocial in self.networksocial:
            self.networksocials.remove(networksocial)

# Ruta de registro
@app.route('/register', methods=['POST'])
def registro():
    #Ejemplo de registro: http://127.0.0.1:8000/register?firstname=Samuel Antonio&lastname=Cayetano Pérez&username=Darstick&mail=sami_cayetano@hotmail.com&password=1234567&year=2003&month=10&day=10
    
    # Obtener datos del formulario de registro
    iduser = ''.join([str(random.randint(0, 9)) for _ in range(4)])
    firstname = request.form.get('firstname')
    lastname = request.form.get('lastname')
    username = request.form.get('username')
    username =  username.lower().strip()
    mail = request.form.get('mail')
    password = request.form.get('password')
    hashedpassword = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
    year = request.form.get('year')
    month = request.form.get('month')
    day = request.form.get('day')
    dataBaseConnection = True

    # Crear instancia de Usuario
    newUser = User(iduser, firstname, lastname, username, mail, password, year, month, day, None, None, None)

    if (dataBaseConnection == True):
        # Conectar a la base de datos
        newConnection = db.connect_and_execute(["SELECT * FROM usuarios"])

        # Crear un cursor para ejecutar consultas
        cursor = newConnection.cursor()

        # Verificar que el correo no existe en la base de datos
        cursor.execute("SELECT * FROM usuarios WHERE correo_electronico = %s", (mail,))
        if cursor.fetchone():
            cursor.close()
            newConnection.close()
            return jsonify({'mensaje': 'El correo ya está registrado'}), 400

        # Verificar que el nombre de usuario no se repita
        cursor.execute("SELECT * FROM usuarios WHERE username = %s", (username,))
        if cursor.fetchone():
            cursor.close()
            newConnection.close()
            return jsonify({'mensaje': 'El nombre de usuario ya está en uso'}), 400
    
        # Verificar que la contraseña tenga al menos 6 caracteres
        if len(password) < 8:
            cursor.close()
            newConnection.close()
            return jsonify({'mensaje': 'La contraseña debe tener al menos 8 caracteres'}), 400

        # Verificar que el usuario sea mayor de 15 años
        today = datetime.today()
        
        edad = today.year - int(year) - ((today.month, today.day) < (int(month), int(day)))
        if edad < 15:
            cursor.close()
            newConnection.close()
            return jsonify({'mensaje': 'Debes tener al menos 15 años para registrarte'}), 400

        # Ejecutar el INSERT INTO en la tabla de usuarios
        cursor.execute(
            "INSERT INTO usuarios (id_usuario, username, nombre, apellido, correo_electronico, contrasena_hash, fecha_nacimiento, biografia, sexo) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)",
            (iduser, username, firstname, lastname, mail, hashedpassword, f"{year}-{month}-{day}", None, None)
        )

        # Confirmar la transacción
        newConnection.commit()

        # Cerrar el cursor y la conexión
        cursor.close()
        newConnection.close()

    # Almacenar los datos en sesión
    userinfo = {
        'idUser': iduser,
        'firstName': firstname,
        'lastName': lastname, 
        'username': username, 
        'mail': mail,
        'password': ' ',
        'year': year,
        'month': month,
        'day': day
    }
    session['user'] = userinfo
    payload = {
        'user_id': iduser,
        'exp': datetime.utcnow() + timedelta(hours=1)  # El token expira en 1 hora
    }
    token = jwt.encode(payload, 'SECRET_KEY', algorithm='HS256')
    response = jsonify({'mensaje': '¡Registro exitoso!', 'token': token, 'user': userinfo})
    return response

# Ruta de login
@app.route('/login', methods=['POST'])
def login():
    # Obtener datos del formulario de login
    mail = request.form.get('username')
    password = request.form.get('password')

    # Conectar a la base de datos
    newConnection = db.connect_and_execute()

    # Crear un cursor para ejecutar consultas
    cursor = newConnection.cursor(dictionary=True)

    # Buscar al usuario por correo y contraseña
    consulta = "SELECT * FROM usuarios WHERE password = %s AND contraseña = %s"
    cursor.execute(consulta, (mail, password))

    userinfo = cursor.fetchone()


    if userinfo:
        # Si las credenciales son válidas, almacenar el usuario en sesión
        userinfo = {
            'iduser': userinfo[0],
            'firstName': userinfo[1],
            'lastName': userinfo[2],
            'username': userinfo[3],
            'mail': userinfo[4],
            'password': userinfo[5],
            'year': userinfo[6],
            'month': userinfo[7],
            'day': userinfo[8]
        }
        session['user'] = userinfo

        # Cerrar el cursor y la conexión
        cursor.close()
        newConnection.close()

        payload = {
            'user_id': userinfo[0],
            'exp': datetime.utcnow() + timedelta(hours=1)  # El token expira en 1 hora
        }
        token = jwt.encode(payload, 'SECRET_KEY', algorithm='HS256')
        response = jsonify({'mensaje': '¡Inicio de sesión exitoso!', 'token': token, 'usuario': userinfo})
        response.set_cookie('token', token)
        return response

    # Si las credenciales no son válidas
    cursor.close()
    newConnection.close()
    return jsonify({'mensaje': 'Credenciales incorrectas'}), 401

# Ruta para obtener el estado de sesión actual
@app.route('/keep_session', methods=['GET'])
def keep_session():
    token = request.cookies.get('token')

    if token:
        try:
            # Decodifica el token
            payload = jwt.decode(token, 'SECRET_KEY', algorithms=['HS256'])
            userToken = payload['user_id']

            # Genera un nuevo token
            newtoken = jwt.encode({'userToken': userToken, 'exp': datetime.utcnow() + timedelta(hours=1)}, app.config['ClaveSecreta'], algorithm='HS256')

            # Actualiza la cookie con el nuevo token
            userinfo = session.get('user')
            response = jsonify({'mensaje': '¡Inicio de sesión exitoso!', 'token': newtoken, 'usuario': userinfo})
            response.set_cookie('token', newtoken)
            return response
        except jwt.ExpiredSignatureError:
            return jsonify({'mensaje': 'Token expirado'}), 401
        except jwt.InvalidTokenError:
            return jsonify({'mensaje': 'Token inválido'}), 401

    return jsonify({'mensaje': 'Token no proporcionado'}), 401

# Ruta para cerrar sesión
@app.route('/logout', methods=['GET'])
def logout():
    session.pop('user', None)
    return jsonify({'mensaje': '¡Sesión cerrada exitosamente!'})

# Ruta para crear publicaciones
@app.route('/create_post', methods=['POST'])
def crear_post():
    # Obtener datos del formulario de la creacion de publicacion
    idpost = secrets.token_hex(4)
    iduser = session.get('user')
    postdate = datetime.now
    text = request.form.get('text')
    image = request.files.get('image')

    # Verifica que el texto tenga menos de 150 caracteres
    if len(text) > 150:
        return jsonify({'mensaje': 'El texto debe tener menos de 150 caracteres'}), 400

    # Asumiendo que la imagen es opcional y solo se almacena si se proporciona
    imagename = None
    if image:
        imagename = f"{iduser}_{datetime.now().strftime('%Y%m%d%H%M%S')}.jpg"
        image.save(f"ruta/del/directorio/{imagename}")

    # Conectar a la base de datos
    newConnection = db.connect_and_execute()

    # Crear un cursor para ejecutar consultas
    cursor = newConnection.cursor()

    # Ejecutar el INSERT INTO en la tabla de publicaciones
    cursor.execute(
         "INSERT INTO usuario (id_publicacion, id_usuario, contenido_depublicacion, imagen, reaccion) VALUES (%s, %s, %s, %s, %s, %d)",
        (idpost, iduser, text, datetime.today(), image, 0)
    )

    # Retornar los datos proporcionados
    postinfo = {
        'idPublicacion': idpost,
        'usuario': iduser,
        'fechaPublicacion': postdate,
        'texto': text,
        'imagen': imagename,
        'reaccion': 0
    }

    response = jsonify({'mensaje': '¡Publicación creada con éxito!', 'publicacion': postinfo})
    return response

#Ruta para crear comentarios
@app.route('/create_comment', methods=['POST'])
def create_comment():
    idcomment = secrets.token_hex(4)
    username = request.form.get('username')
    text = request.form.get('text')
    idpost = request.form.get('id_post')  # Este sería el identificador de la publicación respectivo

    # Verifica que el texto del comentario tenga menos de 100 caracteres
    if len(text) > 100:
        return jsonify({'mensaje': 'El comentario debe tener menos de 100 caracteres'}), 400

    # Almacenar el comentario en la base de datos y asociarlo a la publicación y al usuario

    # Por ahora, simplemente retornamos los datos proporcionados
    commentinfo = {
        'idComentario': idcomment,
        'usuario': username,
        'texto': text,
        'idPublicacion': idpost
    }

    response = jsonify({'mensaje': '¡Comentario creado con éxito!', 'comentario': commentinfo})
    return response

if __name__ == '__main__':
    app.run(port=8000)