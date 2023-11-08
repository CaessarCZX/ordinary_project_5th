from flask import Flask, request, jsonify, session
import io
import jwt
import secrets
import random
import bcrypt
import base64
from datetime import datetime, timedelta
from PIL import Image
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
    iduser = ''.join([str(random.randint(0, 9)) for _ in range(9)])
    firstname = request.form.get('firstname')
    lastname = request.form.get('lastname')
    username = request.form.get('username')
    username =  username.lower().strip()
    mail = request.form.get('mail')
    password = request.form.get('password')
    password = password.encode('utf-8')
    sal = bcrypt.gensalt()
    hashedpassword = bcrypt.hashpw(password, sal)
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
            "INSERT INTO usuarios (id_usuario, username, nombre, apellido, correo_electronico, contrasena_hash, fecha_nacimiento, foto_perfil, biografia, sexo) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)",
            (iduser, username, firstname, lastname, mail, hashedpassword, f"{year}-{month}-{day}", None, None, None)
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
    mail = request.form.get('mail')
    password = request.form.get('password')

    # Conectar a la base de datos
    newConnection = db.connect_and_execute(["SELECT * FROM usuarios"])

    # Crear un cursor para ejecutar consultas
    cursor = newConnection.cursor(dictionary=True)

    # Buscar al usuario por correo y contraseña
    consulta = "SELECT * FROM usuarios WHERE correo_electronico = %s"
    cursor.execute(consulta, (mail,))
    userinfo = cursor.fetchone()

    if userinfo:
        hasedpassword = userinfo['contrasena_hash']
        if bcrypt.checkpw(password.encode('utf-8'), hasedpassword.encode('utf-8')):
            # Si las credenciales son válidas, almacenar el usuario en sesión
            userinfo = {
                'iduser': userinfo['id_usuario'],
                'username': userinfo['username'],
                'firstName': userinfo['nombre'],
                'lastName': userinfo['apellido'],
                'mail': userinfo['correo_electronico'],
                'password': userinfo['contrasena_hash'],
                'birthDate': userinfo['fecha_nacimiento'],
                'profile': userinfo['foto_perfil'],
                'biography': userinfo['biografia'],
                'sex': userinfo['sexo']
            }
            session['user'] = userinfo

            # Cerrar el cursor y la conexión
            cursor.close()
            newConnection.close()

            payload = {
                'user_id': userinfo['iduser'],
                'exp': datetime.utcnow() + timedelta(hours=1)  # El token expira en 1 hora
            }
            token = jwt.encode(payload, app.config['SECRET_KEY'], algorithm='HS256')
            response = jsonify({'mensaje': '¡Inicio de sesión exitoso!', 'token': token, 'usuario': userinfo})
            response.set_cookie('token', token)
            return response

    # Si las credenciales no son válidas
    cursor.close()
    newConnection.close()
    return jsonify({'mensaje': 'Credenciales incorrectas'}), 401

# Ruta para mantener la sesión activa
@app.route('/keep_session', methods=['GET'])
def keep_session():
    token = request.cookies.get('token')

    if token:
        try:
            # Decodifica el token
            payload = jwt.decode(token, app.config['SECRET_KEY'], algorithms=['HS256'])
            print(payload)
            userToken = payload['userToken']

            # Genera un nuevo token y actualiza la cookie
            newtoken = jwt.encode({'userToken': userToken, 'exp': datetime.utcnow() + timedelta(hours=1)}, app.config['SECRET_KEY'], algorithm='HS256')
            response = jsonify({'mensaje': '¡Sesión actualizada!', 'token': newtoken})
            response.set_cookie('token', newtoken)

            # También puedes devolver información del usuario si lo necesitas
            userinfo = session.get('user')
            if userinfo:
                response['user'] = userinfo

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
    response = jsonify({'mensaje': '¡Sesión cerrada exitosamente!'})
    response.delete_cookie('token')
    return response

@app.route('/get_posts', methods=['GET'])
def get_posts():
    offset = request.args.get('offset', 0, type=int)  # Obtiene el offset de la consulta
    
    # Conectar a la base de datos
    newConnection = db.connect_and_execute(["SELECT * FROM publicaciones"])
    cursor = newConnection.cursor()

    # Obtener todas las publicaciones
    cursor.execute("SELECT * FROM publicaciones ORDER BY fecha_depublicacion DESC LIMIT 10 OFFSET {offset}")
    posts = cursor.fetchall()

    # Lista para almacenar las publicaciones formateadas
    postsformatted = []

    for post in posts:
        # Obtener el nombre del usuario
        cursor.execute("SELECT username FROM usuarios WHERE id_usuario = %s", (post[1],))
        username = cursor.fetchone()[0]

        # Obtener la foto de perfil del usuario
        cursor.execute("SELECT username FROM usuarios WHERE foto_perfil = %s", (post[1],))
        profile = cursor.fetchone()[0]

        # Decodificar la imagen
        imagen_bytes = post[3]
        imagen_decoded = imagen_bytes.decode('utf-8') if imagen_bytes else None

        # Formatear la publicación
        publicacion_formateada = {
            'nombre_usuario': username,
            'nombre_usuario': profile,
            'fecha_depublicacion': post[2].strftime("%Y-%m-%d %H:%M:%S"),
            'descripcion': post[4],
            'imagen': imagen_decoded
        }

        # Agregar la publicación formateada a la lista
        postsformatted.append(publicacion_formateada)

    # Cerrar el cursor y la conexión
    cursor.close()
    newConnection.close()

    return jsonify(postsformatted)

# Ruta para crear publicaciones
@app.route('/create_post', methods=['POST'])
def create_post():
    # Obtener datos del formulario de la creacion de publicacion
    idpost = ''.join([str(random.randint(0, 9)) for _ in range(9)])
    iduser = session['user']['iduser']
    postdate = f"{datetime.today().year}-{datetime.today().month}-{datetime.today().day}"
    text = request.form.get('text')
    image = request.files.get('image')

    # Verifica que el texto tenga menos de 150 caracteres
    if len(text) > 150:
        return jsonify({'mensaje': 'El texto debe tener menos de 150 caracteres'}), 400

    # Asumiendo que la imagen es opcional y solo se almacena si se proporciona
    imagebytes = None
    if image:
        if image:
            # Cargar la imagen y comprimirla
            with Image.open(image) as img:
                # Reducir el tamaño y guardar en un nuevo objeto BytesIO
                img = img.resize((800, 800))
                output = io.BytesIO()
                img.save(output, format='JPEG', quality=70)

        # Convertir a Base64
        imagebytes = base64.b64encode(output.getvalue()).decode('utf-8')

    # Conectar a la base de datos
    newConnection = db.connect_and_execute(["SELECT * FROM publicaciones"])

    # Crear un cursor para ejecutar consultas
    cursor = newConnection.cursor()

    # Ejecutar el INSERT INTO en la tabla de publicaciones
    cursor.execute(
         "INSERT INTO publicaciones (id_publicacion, id_usuario, contenido_publicacion, fecha_depublicacion, imagen, reaccion) VALUES (%s, %s, %s, %s, %s, %s)",
        (idpost, iduser, text, f"{datetime.today().year}-{datetime.today().month}-{datetime.today().day}", imagebytes, 0)
    )

    # Confirmar la transacción
    newConnection.commit()

    # Cerrar el cursor y la conexión
    cursor.close()
    newConnection.close()

    # Retornar los datos proporcionados
    postinfo = {
        'idpost': idpost,
        'iduser': iduser,
        'datepost': postdate,
        'text': text,
        'image': imagebytes,
        'reactions': 0
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