from flask import Flask, request, jsonify, session
from flask_cors import CORS, cross_origin
import io
import jwt
import secrets
import re
import random
import bcrypt
import base64
from datetime import datetime, timedelta
from PIL import Image
from DataBaseConnection import DB
from Mails import send_mail

app = Flask(__name__)
app.config['SECRET_KEY'] = secrets.token_hex(32)
cors = CORS(app, resources={r"/api/*": {"origins": "http://localhost:5173"}}, supports_credentials=True)

# Crear una instancia de la clase DB para verificar y crear la base de datos y las tablas
db = DB()

# Lista de usuarios y sus contraseñas (esto debería ser una base de datos en un entorno real)
failed_attempts = 0

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
@app.route('/api/register', methods=['POST'])
@cross_origin
def registro():
    #Ejemplo de registro: http://127.0.0.1:8000/register?firstname=Samuel Antonio&lastname=Cayetano Pérez&username=Darstick&mail=sami_cayetano@hotmail.com&password=1234567&year=2003&month=10&day=10
    
    # Obtener datos del formulario de registro
    id_user = ''.join([str(random.randint(0, 9)) for _ in range(9)])
    first_name = request.form.get('firstname')
    last_name = request.form.get('lastname')
    username = request.form.get('username')
    username =  username.lower().strip()
    mail = request.form.get('mail')
    password = request.form.get('password')
    password = password.encode('utf-8')
    sal = bcrypt.gensalt()
    hashed_password = bcrypt.hashpw(password, sal)
    year = request.form.get('year')
    month = request.form.get('month')
    day = request.form.get('day')

    # Validar nombre y apellido
    if not re.match("^[A-Za-z]+$", first_name) or not re.match("^[A-Za-z]+$", last_name):
        return jsonify({'error': 'El nombre y apellido no deben contener números o símbolos'}), 400

    # Validar correo electrónico
    if not re.match("[^@]+@[^@]+\.[^@]+", mail):
        return jsonify({'error': 'El correo electrónico debe tener un formato válido'}), 400

    # Crear instancia de Usuario
    newUser = User(id_user, first_name, last_name, username, mail, password, year, month, day, None, None, None)

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
        (id_user, username, first_name, last_name, mail, hashed_password, f"{year}-{month}-{day}", ' ', ' ', ' ')
    )

    # Confirmar la transacción
    newConnection.commit()

    # Cerrar el cursor y la conexión
    cursor.close()
    newConnection.close()

    # Almacenar los datos en sesión
    userinfo = {
        'iduser': id_user,
        'firstname': first_name,
        'lastname': last_name, 
        'username': username, 
        'mail': mail,
        'password': ' ',
        'year': year,
        'month': month,
        'day': day,
        'profile': ' ',
        'biography': ' ',
        'sex': ' '
    }
    session['user'] = userinfo
    payload = {
        'user_id': id_user,
        'exp': datetime.utcnow() + timedelta(hours=1)  # El token expira en 1 hora
    }
    token = jwt.encode(payload, 'SECRET_KEY', algorithm='HS256')
    response = jsonify({'mensaje': '¡Registro exitoso!', 'token': token, 'user': userinfo})
    return response

# Ruta de login
@app.route('/api/login', methods=['POST'])
@cross_origin()
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
            if userinfo['foto_perfil']:
                imagen_bytes = userinfo['foto_perfil']
                decoded_image = imagen_bytes.decode('utf-8') if imagen_bytes else None
            
            # Si las credenciales son válidas, almacenar el usuario en sesión
            userinfo = {
                'iduser': userinfo['id_usuario'],
                'username': userinfo['username'],
                'firstName': userinfo['nombre'],
                'lastName': userinfo['apellido'],
                'mail': userinfo['correo_electronico'],
                'password': userinfo['contrasena_hash'],
                'birthDate': userinfo['fecha_nacimiento'],
                'profile': decoded_image,
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
    global failed_attempts  # Declarar la variable como global
    failed_attempts += 1

    if failed_attempts >= 3:
        send_mail(mail)
        # Bloquear el Token por 1 hora
        payload = {
            'exp': datetime.utcnow() + timedelta(minutes=1)  # El token expira en 1 minuto
        }
        blocked_token = jwt.encode(payload, app.config['SECRET_KEY'], algorithm='HS256')
        response = jsonify({'error': 'Demasiados intentos fallidos. El token ha sido bloqueado por un tiempo.', 'blocked_token': blocked_token})
        response.set_cookie('blocked_token', blocked_token)
        return response
    else:
        return jsonify({'error': 'Credenciales incorrectas. Intento fallido'}), 401

# Ruta para mantener la sesión activa
@app.route('/api/keep_session', methods=['GET'])
@cross_origin()
def keep_session():
    token = request.cookies.get('token')

    if token:
        try:
            # Decodifica el token
            payload = jwt.decode(token, app.config['SECRET_KEY'], algorithms=['HS256'])
            userToken = payload['user_id']

            # Genera un nuevo token y actualiza la cookie
            newtoken = jwt.encode({'user': userToken, 'exp': datetime.utcnow() + timedelta(hours=1)}, app.config['SECRET_KEY'], algorithm='HS256')
            response = jsonify({'mensaje': '¡Sesión actualizada!', 'token': newtoken})
            response.set_cookie('token', newtoken)

            # También puedes devolver información del usuario si lo necesitas
            # userinfo = session.get('user')
            # if userinfo:
                #response['user'] = userinfo

            return response

        except jwt.ExpiredSignatureError:
            return jsonify({'mensaje': 'Token expirado'}), 401
        except jwt.InvalidTokenError:
            return jsonify({'mensaje': 'Token inválido'}), 401

    return jsonify({'mensaje': 'Token no proporcionado'}), 401

# Ruta para cerrar sesión
@app.route('/api/logout', methods=['GET'])
def logout():
    session.pop('user', None)
    response = jsonify({'mensaje': '¡Sesión cerrada exitosamente!'})
    response.delete_cookie('token')
    return response

@app.route('/profile', methods=['GET'])
@cross_origin()
def profile():
    userinfo = session.get('user')

    if userinfo:
        # Decodificar la contraseña hasheada a la original
        userinfo['password'] = bcrypt.checkpw(session['user']['password'].encode('utf-8'), userinfo['password'].encode('utf-8'))

        # Decodificar la imagen de perfil
        if userinfo['profile']:
            userinfo['profile'] = base64.b64decode(userinfo['profile'])

        return jsonify({'user_info': userinfo})
    else:
        return jsonify({'mensaje': 'Usuario no autenticado'}), 401
    
@app.route('/user/<int:id_user>', methods=['GET'])
@cross_origin()
def view_user(id_user):
    # Conectar a la base de datos
    newConnection = db.connect_and_execute(["SELECT * FROM usuario"])

    # Crear un cursor para ejecutar consultas
    cursor = newConnection.cursor(dictionary=True)

    # Buscar el usuario por su ID
    cursor.execute("SELECT * FROM usuarios WHERE id_usuario = %s", (id_user,))
    userinfo = cursor.fetchone()

    #Oculta contraseña
    userinfo['contrasena_hash'] = ' '

    # Decodificar la imagen
    if userinfo['foto_perfil']:
        imagen_bytes = userinfo['foto_perfil']
        imagen_decoded = imagen_bytes.decode('utf-8') if imagen_bytes else None
        userinfo['foto_perfil'] = imagen_decoded

    # Cerrar el cursor y la conexión
    cursor.close()
    newConnection.close()

    if userinfo:
        return jsonify({'user': userinfo}), 200
    else:
        return jsonify({'mensaje': 'Usuario no encontrado'}), 404
    
@app.route('/edit_user', methods=['POST'])
def edit_user():
    # Obtener datos del formulario de editar
    # firstname = request.form.get('firstname')
    # lastname = request.form.get('lastname')
    username = request.form.get('username')
    username =  username.lower().strip()
    # mail = request.form.get('mail')
    password = request.form.get('password')
    password = password.encode('utf-8')
    sal = bcrypt.gensalt()
    hashedpassword = bcrypt.hashpw(password, sal)
    # year = request.form.get('year')
    # month = request.form.get('month')
    # day = request.form.get('day')
    profile = request.files.get('profile')
    biography = request.form.get('biography')
    sex = request.form.get('sex')
    
    # Conectar a la base de datos
    newConnection = db.connect_and_execute(["SELECT * FROM usuarios"])

    # Crear un cursor para ejecutar consultas
    cursor = newConnection.cursor(dictionary=True)

    # Verificar si el nuevo nombre de usuario ya existe
    if username:
        cursor.execute("SELECT * FROM usuarios WHERE username = %s", (username,))
        if cursor.fetchone():
            cursor.close()
            newConnection.close()
            return jsonify({'mensaje': 'El nombre de usuario ya está en uso'}), 400
    else:
        username = session['user']['username']
    
    # Verificar si se proporcionó una nueva contraseña
    if password:
        hashedpassword = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
    else:
        hashedpassword = session['user']['password']
    
    # Verificar si se proporcionó una nueva foto de perfil
    if profile:
        # Cargar la imagen y comprimirla
        with Image.open(profile) as img:
            # Reducir el tamaño y guardar en un nuevo objeto BytesIO
            img = img.resize((300, 300))
            img = img.convert('RGB')
            output = io.BytesIO()
            img.save(output, format='JPEG', quality=60)

        # Convertir a Base64
        profilebytes = base64.b64encode(output.getvalue()).decode('utf-8')
    else:
        profilebytes = session['user']['profile']

    # Verificar si se proporcionó una biografia
    if biography == None:
        biography = session['user']['biography']

    # Verificar si se proporcionó un sexo
    if sex == None:
        sex = session['user']['sex']

    # Actualizar la información del usuario
    cursor.execute(
        "UPDATE usuarios SET username = %s, nombre = %s, apellido = %s, correo_electronico = %s, contrasena_hash = %s, foto_perfil = %s, biografia = %s, sexo = %s WHERE id_usuario = %s",
        (username, session['user']['firstName'], session['user']['lastName'], session['user']['mail'], hashedpassword, profilebytes, biography, sex, session['user']['iduser'])
    )

    # Confirmar la transacción
    newConnection.commit()

    # Actualizar la información en la sesión
    session['user']['username'] = username if username else session['user']['username']
    session['user']['profile'] = profilebytes if profilebytes else session['user']['profile']
    session['user']['biography'] = biography if biography else session['user']['biography']
    session['user']['sex'] = sex if sex else session['user']['sex']

    # Cerrar el cursor y la conexión
    cursor.close()
    newConnection.close()

    return jsonify({'mensaje': 'Perfil actualizado con éxito', 'user': session['user']}), 200

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
    if image:
        if image:
            # Cargar la imagen y comprimirla
            with Image.open(image) as img:
                # Reducir el tamaño y guardar en un nuevo objeto BytesIO
                # img = img.resize((800, 800))
                img = img.convert('RGB')
                output = io.BytesIO()
                img.save(output, format='JPEG', quality=60)

        # Convertir a Base64
        imagebytes = base64.b64encode(output.getvalue()).decode('utf-8')

    # Conectar a la base de datos
    newConnection = db.connect_and_execute(["SELECT * FROM publicaciones"])

    # Crear un cursor para ejecutar consultas
    cursor = newConnection.cursor()

    # Ejecutar el INSERT INTO en la tabla de publicaciones
    cursor.execute(
         "INSERT INTO publicaciones (id_publicacion, id_usuario, contenido_publicacion, fecha_depublicacion, imagen, reaccion) VALUES (%s, %s, %s, %s, %s, %s)",
        (idpost, iduser, text, postdate, imagebytes, 0)
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
@app.route('/likes', methods=['POST'])
def likes():
    # Obtener datos del formulario de la creacion de publicacion
    idlikes = ''.join([str(random.randint(0, 9)) for _ in range(9)])
    iduser = session['user']['iduser']
    idpost = request.form.get('id_post')  # Este sería el identificador de la publicación respectivo
    status = 0

    # Conectar a la base de datos
    newConnection = db.connect_and_execute(["SELECT * FROM likes"])

    # Crear un cursor para ejecutar consultas
    cursor = newConnection.cursor(buffered=True)

    # Obtener el estado de likes
    cursor.execute("SELECT estado FROM likes WHERE id_publicacion = %s", (idpost,))
    laststatus = cursor.fetchone()

    # Obtener el contador de reacciones de la publicacion
    cursor.execute("SELECT reaccion FROM publicaciones WHERE id_publicacion = %s", (idpost,))
    reaccion = cursor.fetchone()
    reaccion = int(''.join(map(str, reaccion)))

    # Activar o desactivar el like segun el estado
    if (laststatus == None or int(''.join(map(str, laststatus))) == 0):
        status = 1
        reaccion+=1
    else:
        status = 0
        reaccion-=1

    if (laststatus == None):
        # Ejecutar el INSERT INTO en la tabla de likes
        cursor.execute("INSERT INTO likes (id_likes, id_usuario, id_publicacion, estado) VALUES (%s, %s, %s, %s)",
        (idlikes, iduser, idpost, status))
    else:
        cursor.execute("UPDATE likes SET estado = %s WHERE id_publicacion = %s", 
        (status, idpost))
    
    cursor.execute("UPDATE publicaciones SET reaccion = %s WHERE id_publicacion = %s",
    (reaccion, idpost))

    # Confirmar la transacción
    newConnection.commit()

    # Cerrar el cursor y la conexión
    cursor.close()
    newConnection.close()

    # Por ahora, simplemente retornamos los datos proporcionados
    likeinfo = {
        'idlike': idlikes,
        'iduser': iduser,
        'idpost': idpost,
        'likestatus': status
    }

    response = jsonify({'mensaje': '¡Like cambiado con éxito!', 'comentario': likeinfo})
    return response

#Ruta para crear comentarios
@app.route('/create_comment', methods=['POST'])
def create_comment():
    # Obtener datos del formulario de la creacion de publicacion
    idcomment = ''.join([str(random.randint(0, 9)) for _ in range(9)])
    iduser = session['user']['iduser']
    idpost = request.form.get('id_post')  # Este sería el identificador de la publicación respectivo
    commentdate = f"{datetime.today().year}-{datetime.today().month}-{datetime.today().day}"
    text = request.form.get('text')

    # Verifica que el texto del comentario tenga menos de 100 caracteres
    if len(text) > 100:
        return jsonify({'mensaje': 'El comentario debe tener menos de 100 caracteres'}), 400

    # Conectar a la base de datos
    newConnection = db.connect_and_execute(["SELECT * FROM comentarios"])

    # Crear un cursor para ejecutar consultas
    cursor = newConnection.cursor()

    # Ejecutar el INSERT INTO en la tabla de comentarios
    cursor.execute(
        "INSERT INTO comentarios (id_comentario, id_usuario, id_publicacion, contenidocomentario, fecha_depublicacioncomentario) VALUES (%s, %s, %s, %s, %s)",
        (idcomment, iduser, idpost, text, commentdate)
    )

    # Confirmar la transacción
    newConnection.commit()

    # Cerrar el cursor y la conexión
    cursor.close()
    newConnection.close()

    # Retornar los datos proporcionados
    commentinfo = {
        'idcomment': idcomment,
        'iduser': iduser,
        'idpost': idpost,
        'datecomment': commentdate,
        'text': text
    }

    response = jsonify({'mensaje': '¡Comentario creado con éxito!', 'comentario': commentinfo})
    return response

@app.route('/get_posts', methods=['GET'])
def get_posts():
    offset = request.args.get('offset', 0, type=int)  # Obtiene el offset de la consulta
    
    # Conectar a la base de datos
    newConnection = db.connect_and_execute(["SELECT * FROM publicaciones"])
    cursor = newConnection.cursor()

    # Obtener todas las publicaciones
    cursor.execute("SELECT * FROM publicaciones ORDER BY fecha_depublicacion DESC LIMIT 10 OFFSET %s", (offset,))
    posts = cursor.fetchall()

    # Lista para almacenar las publicaciones formateadas
    postsFormatted = []

    for post in posts:
        # Obtener el nombre del usuario
        cursor.execute("SELECT username FROM usuarios WHERE id_usuario = %s", (post[1],))
        username = cursor.fetchone()[0]

        # Obtener la foto de perfil del usuario
        cursor.execute("SELECT foto_perfil FROM usuarios WHERE id_usuario = %s", (post[1],))
        profile = cursor.fetchone()[0]
        if profile:
            profile_bytes = profile
            profile_decoded =  profile_bytes.decode('utf-8') if profile_bytes else None

        # Decodificar la imagen
        if post[4]:
            image_bytes = post[4]
            image_decoded = image_bytes.decode('utf-8') if image_bytes else None

        # Formatear la publicación
        publicacion_formateada = {
            'username': username,
            'profile': profile_decoded,
            'text': post[2],
            'datepost': post[3].strftime("%Y-%m-%d %H:%M:%S"),
            'image': image_decoded,
            'reactions': post[5]
        }

        # Agregar la publicación formateada a la lista
        postsFormatted.append(publicacion_formateada)

    # Cerrar el cursor y la conexión
    cursor.close()
    newConnection.close()

    return jsonify(postsFormatted)

@app.route('/post/<int:id_publicacion>', methods=['GET'])
def view_post(id_publicacion):
    # Conectar a la base de datos
    newConnection = db.connect_and_execute(["SELECT * FROM publicaciones"])

    # Crear un cursor para ejecutar consultas
    cursor = newConnection.cursor(dictionary=True)

    # Buscar el post por su ID
    cursor.execute("SELECT * FROM publicaciones WHERE id_publicacion = %s", (id_publicacion,))
    post = cursor.fetchone()

    # Decodificar la imagen
    if post['imagen']:
        imagen_bytes = post['imagen']
        imagen_decoded = imagen_bytes.decode('utf-8') if imagen_bytes else None
        post['imagen'] = imagen_decoded

    # Cerrar el cursor y la conexión
    cursor.close()
    newConnection.close()

    if post:
        return jsonify({'post': post}), 200
    else:
        return jsonify({'mensaje': 'Publicación no encontrada'}), 404
    
@app.route('/get_comments', methods=['GET'])
def get_comments():
    offset = request.args.get('offset', 0, type=int)  # Obtiene el offset de la consulta
    
    # Conectar a la base de datos
    newConnection = db.connect_and_execute(["SELECT * FROM comentarios"])
    cursor = newConnection.cursor()

    # Obtener todas los comentarios
    cursor.execute("SELECT * FROM comentarios ORDER BY fecha_depublicacioncomentario DESC LIMIT 10 OFFSET %s", (offset,))
    comments = cursor.fetchall()

    # Lista para almacenar las comentarios formateadas
    commentsFormatted = []

    for comment in comments:
        # Obtener el nombre del usuario
        cursor.execute("SELECT username FROM usuarios WHERE id_usuario = %s", (comment[1],))
        username = cursor.fetchone()[0]

        # Obtener la foto de perfil del usuario
        cursor.execute("SELECT foto_perfil FROM usuarios WHERE id_usuario = %s", (comment[1],))
        profile = cursor.fetchone()[0]
        if profile:
            profile_bytes = profile
            profile_decoded =  profile_bytes.decode('utf-8') if profile_bytes else None
        
        # Formatear la publicación
        publicacion_formateada = {
            'username': username,
            'profile': profile_decoded,
            'text': comment[3],
            'datepost': comment[4].strftime("%Y-%m-%d %H:%M:%S"),
        }

        # Agregar la publicación formateada a la lista
        commentsFormatted.append(publicacion_formateada)

    # Cerrar el cursor y la conexión
    cursor.close()
    newConnection.close()

    return jsonify(commentsFormatted)
    
@app.route('/add_friend', methods=['POST'])
def add_friend():
    # Obtener datos del formulario de la adicion de amigos
    id_friendship = ''.join([str(random.randint(0, 9)) for _ in range(9)])
    id_user = session['user']['iduser']
    id_user_friend = request.form.get('id_user_friend')
    
    # Conectar a la base de datos
    newConnection = db.connect_and_execute(["SELECT * FROM amistades"])

    # Crear un cursor para ejecutar consultas
    cursor = newConnection.cursor(buffered=True, dictionary=True)

    # Verificar que el amigo existe
    cursor.execute("SELECT * FROM usuarios WHERE id_usuario = %s", (id_user_friend,))
    friend = cursor.fetchone()
    if not friend:
        # Cerrar el cursor y la conexión
        cursor.close()
        newConnection.close()
        return jsonify({'mensaje': 'El usuario no existe'}), 404
    
    # Verificar que el usuario no esté intentando agregarse a sí mismo como amigo
    if friend == id_user:
        return jsonify({'mensaje': 'No puedes agregarte a ti mismo como amigo'}), 400
    
    # Verificar que no exista ya una amistad entre ellos
    cursor.execute("SELECT * FROM amistades WHERE (id_usuarioa = %s AND id_usuarioa = %s) OR (id_usuarioa = %s AND id_usuariob = %s)", (id_user, id_user_friend, id_user_friend, id_user))
    friendLiked = cursor.fetchone()
    if friendLiked:
        # Cerrar el cursor y la conexión
        cursor.close()
        newConnection.close()
        return jsonify({'mensaje': 'Ya están enlazados como amigos'}), 400

    # Ejecutar el INSERT INTO en la tabla de amistades
    cursor.execute(
        "INSERT INTO amistades (id_amistad, id_usuarioa, id_usuariob) VALUES (%s, %s, %s)",
        (id_friendship, id_user, id_user_friend)
    )

    # Confirmar la transacción
    newConnection.commit()

    # Cerrar el cursor y la conexión
    cursor.close()
    newConnection.close()

    response = jsonify({'mensaje': '¡Amigo creado con éxito!', 'usuario a': id_user, 'usuario b': id_user_friend})
    return response

if __name__ == '__main__':
    app.run(port=8000)