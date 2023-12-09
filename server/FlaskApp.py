from flask import Flask, request, jsonify, session
from flask_cors import CORS
import os
import io
import jwt
import secrets
import re
import random
import bcrypt
from datetime import datetime, timedelta
from PIL import Image
from DataBaseConnection import DB
from ImageHandler import process_profile_image
from Mails import send_mail

app = Flask(__name__)
app.config['SECRET_KEY'] = secrets.token_hex(32)
cors = CORS(app, resources={r"/api/*": {"origins": "http://localhost:5173"}}, supports_credentials=True)

# Crear una instancia de la clase DB para verificar y crear la base de datos y las tablas
db = DB()

# Lista de usuarios y sus contraseñas (esto debería ser una base de datos en un entorno real)
failed_attempts = 0

# Ruta de registro
@app.route('/api/register', methods=['POST'])
def registro():
    data = request.json

    # Obtener datos del formulario de registro
    id_user = ''.join([str(random.randint(0, 9)) for _ in range(9)])
    first_name = data.get('firstname')
    last_name = data.get('lastname')
    username = data.get('username')
    mail = data.get('email')
    password = data.get('password')
    password = password.encode('utf-8')
    sal = bcrypt.gensalt()
    hashed_password = bcrypt.hashpw(password, sal)

    # Validar nombre y apellido
    if not re.match("^[A-Za-z]+(?: [A-Za-z]+)?$", first_name) or not re.match("^[A-Za-z]+(?: [A-Za-z]+)?$", last_name):
        return jsonify({'msg': 'El nombre y apellido no deben contener números o símbolos'}), 400

    # Validar correo electrónico
    if not re.match("[^@]+@[^@]+\.[^@]+", mail):
        return jsonify({'msg': 'El correo electrónico debe tener un formato válido'}), 400
    # Conectar a la base de datos
    newConnection = db.connect_and_execute(["SELECT * FROM usuarios"])

    # Crear un cursor para ejecutar consultas
    cursor = newConnection.cursor()

    # Verificar que el correo no existe en la base de datos
    cursor.execute("SELECT * FROM usuarios WHERE correo_electronico = %s", (mail,))
    if cursor.fetchone():
        cursor.close()
        newConnection.close()
        return jsonify({'msg': 'El correo ya está registrado'}), 400

    # Verificar que el nombre de usuario no se repita
    cursor.execute("SELECT * FROM usuarios WHERE username = %s", (username,))
    if cursor.fetchone():
        cursor.close()
        newConnection.close()
        return jsonify({'msg': 'El nombre de usuario ya está en uso'}), 400
    
    # Verificar que la contraseña tenga al menos 6 caracteres
    if len(password) < 8:
        cursor.close()
        newConnection.close()
        return jsonify({'msg': 'La contraseña debe tener al menos 8 caracteres'}), 400

    # Ejecutar el INSERT INTO en la tabla de usuarios
    cursor.execute(
        "INSERT INTO usuarios (id_usuario, username, nombre, apellido, correo_electronico, contrasena_hash, foto_perfil, telefono, biografia, sexo) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)",
        (id_user, username, first_name, last_name, mail, hashed_password, ' ', ' ', ' ', ' ')
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
        'avatar': ' ',
        'phone': ' ',
        'story': ' ',
        'sex': ' ',
        'friends': [],
        'follows': [],
        'posts': [],
        'likes': []
    }
    session['user'] = userinfo
    payload = {
        'user_id': id_user,
        'exp': datetime.utcnow() + timedelta(hours=1)  # El token expira en 1 hora
    }
    token = jwt.encode(payload, 'SECRET_KEY', algorithm='HS256')
    response = jsonify({'msg': '¡Registro exitoso!', 'accesToken': token, 'user': userinfo})
    return response

# Ruta de login
@app.route('/api/login', methods=['POST'])
def login():
    data = request.json
    
    # Obtener datos del formulario de login
    mail = data.get('email')
    password = data.get('password')

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
        print(userinfo["contrasena_hash"])
        if bcrypt.checkpw(password.encode('utf-8'), hasedpassword.encode('utf-8')):
            
            # Si las credenciales son válidas, almacenar el usuario en sesión
            userinfo = {
                'iduser': userinfo['id_usuario'],
                'username': userinfo['username'],
                'firstName': userinfo['nombre'],
                'lastName': userinfo['apellido'],
                'mail': userinfo['correo_electronico'],
                'password': '',
                'avatar': userinfo['foto_perfil'],
                'phone': userinfo['telefono'],
                'story': userinfo['biografia'],
                'sex': userinfo['sexo'],
                'friends': [],
                'follows': [],
                'posts': [],
                'likes': []
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
            response = jsonify({'msg': '¡Inicio de sesión exitoso!', 'accesToken': token, 'user': userinfo})
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
        response = jsonify({'msg': 'Demasiados intentos fallidos. El token ha sido bloqueado por un tiempo.', 'blocked_token': blocked_token})
        response.set_cookie('accesToken', blocked_token)
        return response
    else:
        return jsonify({'msg': 'Credenciales incorrectas. Intento fallido.'}), 401

# Ruta para mantener la sesión activa
@app.route('/api/refresh_token', methods=['GET'])
def refresh_token():
    token = request.cookies.get('token')

    if token:
        try:
            # Decodifica el token
            payload = jwt.decode(token, app.config['SECRET_KEY'], algorithms=['HS256'])
            userToken = payload['user_id']

            # Genera un nuevo token y actualiza la cookie
            newtoken = jwt.encode({'user': userToken, 'exp': datetime.utcnow() + timedelta(hours=1)}, app.config['SECRET_KEY'], algorithm='HS256')
            response = jsonify({'msg': '¡Sesión actualizada!', 'accesToken': newtoken, 'user': userToken})
            response.set_cookie('token', newtoken)

            return response

        except jwt.ExpiredSignatureError:
            return jsonify({'msg': 'Token expirado'}), 401
        except jwt.InvalidTokenError:
            return jsonify({'msg': 'Token inválido'}), 401

    return jsonify({'msg': 'Token no proporcionado'}), 401

# Ruta para cerrar sesión
@app.route('/api/logout', methods=['POST'])
def logout():
    session.pop('user', None)
    response = jsonify({'msg': '¡Sesión cerrada exitosamente!'})
    response.delete_cookie('token')
    return response

#Ruta para buscar usuarios
@app.route('/api/search_users/<string:username>', methods=['GET'])
def search_users(username):
    search_query = username  # Obtener la cadena de búsqueda

    # Conectar a la base de datos
    new_connection = db.connect_and_execute(["SELECT * FROM usuario"])

    # Crear un cursor para ejecutar consultas
    cursor = new_connection.cursor(dictionary=True)

    # Buscar usuarios por nombre de usuario o primer nombre
    cursor.execute("SELECT * FROM usuarios WHERE username LIKE %s OR nombre LIKE %s",
        (f'%{search_query}%', f'%{search_query}%'))

    users = cursor.fetchall()

    usersFormatted = []

    # Obtener la información necesaria de los usuarios encontrados
    for user in users:
        userinfo = {
            'iduser': user['id_usuario'],
            'username': user['username'],
            'firstname': user['nombre'],
            'lastname': user['apellido'],
            'avatar': user['foto_perfil']
        }
        usersFormatted.append(userinfo)

    # Cerrar el cursor y la conexión
    cursor.close()
    new_connection.close()

    return jsonify({'users': usersFormatted}), 200
    
@app.route('/api/profile/<string:id_user>', methods=['GET'])
def view_user(id_user):
    # Conectar a la base de datos
    newConnection = db.connect_and_execute(["SELECT * FROM usuario"])

    # Crear un cursor para ejecutar consultas
    cursor = newConnection.cursor(dictionary=True, buffered=True)

    # Buscar el usuario por su id
    cursor.execute("SELECT * FROM usuarios WHERE id_usuario = %s", (id_user,))
    user = cursor.fetchone()

    #Oculta contraseña
    user['contrasena_hash'] = ' '

    userinfo = {
        'iduser': user['id_usuario'],
        'username': user['username'],
        'firstName': user['nombre'],
        'lastName': user['apellido'],
        'mail': user['correo_electronico'],
        'password': user['contrasena_hash'],
        'avatar': user['foto_perfil'],
        'phone': user['telefono'],
        'story': user['biografia'],
        'sex': user['sexo'],
        'friends': [],
        'follows': [],
        'posts': [],
        'likes': []
    }

    # Obtener contador de amigos
    cursor.execute("SELECT * FROM amistades WHERE id_usuariob = %s", (userinfo['iduser'],))
    friends = cursor.fetchall()

    friendsFormatted = []

    for friend in friends:
        # Formatear la amistad
        friendshipinfo = {
            'idfrienduser': friend["id_usuarioa"],
        }

        # Agregar la amistad formateada a la lista
        friendsFormatted.append(friendshipinfo)

    userinfo['friends'] = friendsFormatted

    # Obtener contador de seguidores
    cursor.execute("SELECT * FROM amistades WHERE id_usuarioa = %s", (userinfo['iduser'],))
    follows = cursor.fetchall()

    followsFormatted = []

    for follow in follows:
        # Formatear el seguidor
        followinginfo = {
            'idfollowuser': follow["id_usuariob"],
        }

        # Agregar el seguidor formateada a la lista
        followsFormatted.append(followinginfo)

    userinfo['follows'] = followsFormatted

    # Obtener contador de publicaciones
    cursor.execute("SELECT * FROM publicaciones WHERE id_usuario = %s", (userinfo['iduser'],))
    posts = cursor.fetchall()

    postsFormatted = []

    for post in posts:
        #Formatear las publicaciones
        postinfo = {
            'idpost': post["id_publicacion"],
            'iduser': post["id_usuario"],
            'text': post["contenido_publicacion"],
            'datepost': post["fecha_depublicacion"].strftime("%Y-%m-%d %H:%M:%S"),
            'image': post["imagen"],
            'reactions': post["reaccion"]
        }

        # Agregar la publicación formateada a la lista
        postsFormatted.append(postinfo)

    userinfo['posts'] = postsFormatted

    # Obtener contador de likes
    cursor.execute("SELECT * FROM likes WHERE id_usuario = %s", (userinfo['iduser'],))
    likes = cursor.fetchall()

    likesFormatted = []

    for like in likes:
         #Formatear los likes
        likeinfo = {
            'idlike': like[0],
            'iduser': like[1],
            'idpost': like[2],
            'status': like[3],
        }

         # Agregar el like formateada a la lista
        likesFormatted.append(likeinfo)

    userinfo['likes'] = likesFormatted

    # Cerrar el cursor y la conexión
    cursor.close()
    newConnection.close()

    if userinfo:
        return jsonify({'msg': 'Usuario encontrado', 'user': userinfo}), 200
    else:
        return jsonify({'msg': 'Usuario no encontrado'}), 404
    
@app.route('/api/edit_user', methods=['POST'])
def edit_user():
    data = request.json

    # Obtener datos del formulario de editar
    first_name = data.get('firstname')
    last_name = data.get('lastname')
    username = data.get('username')
    mail = data.get('email')
    password = data.get('password')
    profile = data.get('avatar')
    phone = data.get('phone')
    biography = data.get('story')
    sex = data.get('sex')

    if first_name != "" and last_name  != "":
        # Validar nombre y apellido
        if not re.match("^[A-Za-z]+$", first_name) or not re.match("^[A-Za-z]+$", last_name):
            return jsonify({'msg': 'El nombre y apellido no deben contener números o símbolos'}), 400
    else:
        first_name = session['user']['firstName']
        last_name = session['user']['lastName']
    
    # Conectar a la base de datos
    newConnection = db.connect_and_execute(["SELECT * FROM usuarios"])

    # Crear un cursor para ejecutar consultas
    cursor = newConnection.cursor(dictionary=True)

    if username != None:
        # Verificar si el nuevo nombre de usuario ya existe
        cursor.execute("SELECT * FROM usuarios WHERE username = %s", (username,))
        if cursor.fetchone():
            cursor.close()
            newConnection.close()
            return jsonify({'msg': 'El nombre de usuario ya está en uso'}), 400
    else:
        username = session['user']['username']

    if mail != None:
        # Validar correo electrónico
        if not re.match("[^@]+@[^@]+\.[^@]+", mail):
            return jsonify({'msg': 'El correo electrónico debe tener un formato válido'}), 400
        
        cursor.execute("SELECT * FROM usuarios WHERE username = %s", (username,))
        if cursor.fetchone():
            cursor.close()
            newConnection.close()
            return jsonify({'msg': 'El nombre de usuario ya está en uso'}), 400
    else:
        mail = session['user']['mail']

    # Verificar si se proporcionó una nueva contraseña
    if password != None:
        sal = bcrypt.gensalt()
        hashedpassword = bcrypt.hashpw(password, sal)
        password = password.encode('utf-8')
        hashedpassword = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
    else:
        hashedpassword = session['user']['password']
    
    # Verificar si se proporcionó una nueva foto de perfil
    if profile != None:
        profile_path = process_profile_image(profile, session['user']['iduser'], "profiles", 200, 200)
        if profile_path is None:
            return jsonify({'msg': 'Error al procesar la imagen'}), 500
    else:
        profile_path = session['user']['profile']

    # Verificar si se proporcionó un telefono
    if phone == "":
        phone = session['user']['phone']

    # Verificar si se proporcionó una biografia
    if biography == "":
        biography = session['user']['story']

    # Verificar si se proporcionó un sexo
    if sex == "":
        sex = session['user']['sex']

    # Actualizar la información del usuario
    cursor.execute(
        "UPDATE usuarios SET username = %s, nombre = %s, apellido = %s, correo_electronico = %s, contrasena_hash = %s, foto_perfil = %s, telefono = %s, biografia = %s, sexo = %s WHERE id_usuario = %s",
        (username, first_name, last_name, mail, hashedpassword, profile_path, phone, biography, sex, session['user']['iduser'])
    )

    # Confirmar la transacción
    newConnection.commit()

    # Actualizar la información en la sesión
    session['user']['firstName'] = first_name if first_name != "" else session['user']['firstName']
    session['user']['lastName'] = last_name if last_name != "" else session['user']['lastName']
    session['user']['username'] = username if username != "" else session['user']['username']
    session['user']['mail'] = mail if mail != "" else session['user']['mail']
    session['user']['avatar'] = profile_path if profile != "" else session['user']['avatar']
    session['user']['phone'] = phone if phone != "" else session['user']['phone']
    session['user']['story'] = biography if biography != "" else session['user']['story']
    session['user']['sex'] = sex if sex != "" else session['user']['sex']

    # Cerrar el cursor y la conexión
    cursor.close()
    newConnection.close()

    return jsonify({'msg': 'Perfil actualizado con éxito', 'user': session['user']}), 200

# Ruta para crear publicaciones
@app.route('/api/create_post', methods=['POST'])
def create_post():
    data = request.json
    
    # Obtener datos del formulario de la creacion de publicacion
    id_post = ''.join([str(random.randint(0, 9)) for _ in range(9)])
    id_user = session['user']['iduser']
    post_date = f"{datetime.today().year}-{datetime.today().month}-{datetime.today().day}"
    text = data.get('text')
    image = data.get('image')

    # Verifica que el texto tenga menos de 150 caracteres
    if len(text) > 150:
        return jsonify({'msg': 'El texto debe tener menos de 150 caracteres'}), 400

    # Verificar si se proporciono una imagen
    if image != None:
        image_path = process_profile_image(image, id_post, "images", 500, 450)
        if image_path is None:
            return jsonify({'msg': 'Error al procesar la imagen'}), 500

    # Conectar a la base de datos
    newConnection = db.connect_and_execute(["SELECT * FROM publicaciones"])

    # Crear un cursor para ejecutar consultas
    cursor = newConnection.cursor()

    # Ejecutar el INSERT INTO en la tabla de publicaciones
    cursor.execute(
         "INSERT INTO publicaciones (id_publicacion, id_usuario, contenido_publicacion, fecha_depublicacion, imagen, reaccion) VALUES (%s, %s, %s, %s, %s, %s)",
        (id_post, id_user, text, post_date, image_path, 0)
    )

    # Confirmar la transacción
    newConnection.commit()

    # Cerrar el cursor y la conexión
    cursor.close()
    newConnection.close()

    # Retornar los datos proporcionados
    postinfo = {
        'idpost': id_post,
        'iduser': id_user,
        'datepost': post_date,
        'text': text,
        'image': image_path,
        'reactions': 0
    }

    # Actualizar la sesión del usuario con la nueva publicación
    user = session['user']
    if 'posts' in user:
        user['posts'].append(postinfo)
    else:
        user['posts'] = [postinfo]
    session['user'] = user

    response = jsonify({'msg': '¡Publicación creada con éxito!', 'post': postinfo})
    return response

#Ruta para crear comentarios
@app.route('/api/likes', methods=['POST'])
def likes():
    data = request.json
    
    # Obtener datos del formulario de la creacion de publicacion
    id_likes = ''.join([str(random.randint(0, 9)) for _ in range(9)])
    id_user = session['user']['iduser']
    id_post = data.get('idpost')  # Este sería el identificador de la publicación respectivo
    status = 0

    # Conectar a la base de datos
    newConnection = db.connect_and_execute(["SELECT * FROM likes"])

    # Crear un cursor para ejecutar consultas
    cursor = newConnection.cursor(buffered=True)

    # Obtener el estado de likes
    cursor.execute("SELECT estado FROM likes WHERE id_publicacion = %s", (id_post,))
    laststatus = cursor.fetchone()

    # Obtener el contador de reacciones de la publicacion
    cursor.execute("SELECT reaccion FROM publicaciones WHERE id_publicacion = %s", (id_post,))
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
        (id_likes, id_user, id_post, status))
    else:
        cursor.execute("UPDATE likes SET estado = %s WHERE id_publicacion = %s", 
        (status, id_post))

    # Confirmar la transacción
    newConnection.commit()

    # Cerrar el cursor y la conexión
    cursor.close()
    newConnection.close()

    # Retornar los datos proporcionados
    likeinfo = {
        'idlike': id_likes,
        'iduser': id_user,
        'idpost': id_post,
        'likestatus': status
    }

    # Actualizar la sesión del usuario con la nueva publicación
    user = session['user']
    if 'like' in user:
        user['like'].append(likeinfo)
    else:
        user['like'] = [likeinfo]
    session['like'] = user

    response = jsonify({'msg': '¡Like cambiado con éxito!', 'comentario': likeinfo})
    return response

#Ruta para crear comentarios
@app.route('/api/create_comment', methods=['POST'])
def create_comment():
    data = request.json
    
    # Obtener datos del formulario de la creacion de publicacion
    idcomment = ''.join([str(random.randint(0, 9)) for _ in range(9)])
    iduser = session['user']['iduser']
    idpost = data.get('idpost')  # Este sería el identificador de la publicación respectivo
    commentdate = f"{datetime.today().year}-{datetime.today().month}-{datetime.today().day}"
    text = data.get('text')

    # Verifica que el texto del comentario tenga menos de 100 caracteres
    if len(text) > 100:
        return jsonify({'msg': 'El comentario debe tener menos de 100 caracteres'}), 400

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

    response = jsonify({'msg': '¡Comentario creado con éxito!', 'comment': commentinfo})
    return response

# Ruta para obtener la lista de publicaciones
@app.route('/api/get_posts', methods=['GET'])
def get_posts():
    data = request.json
    
    offset = data.get('offset')  # Obtiene el offset de la consulta
    
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

        # Formatear la publicación
        postinfo = {
            'username': username,
            'avatar': profile,
            'text': post[2],
            'datepost': post[3].strftime("%Y-%m-%d %H:%M:%S"),
            'image': post[4],
            'reactions': post[5]
        }

        # Agregar la publicación formateada a la lista
        postsFormatted.append(postinfo)

    # Cerrar el cursor y la conexión
    cursor.close()
    newConnection.close()

    return jsonify(postsFormatted)

# Ruta para acceder a una publicacion en especifico
@app.route('/api/post/<int:id_publicacion>', methods=['GET'])
def view_post(id_publicacion):
    # Conectar a la base de datos
    newConnection = db.connect_and_execute(["SELECT * FROM publicaciones"])

    # Crear un cursor para ejecutar consultas
    cursor = newConnection.cursor(dictionary=True)

    # Buscar el post por su ID
    cursor.execute("SELECT * FROM publicaciones WHERE id_publicacion = %s", (id_publicacion,))
    post = cursor.fetchone()

    # Obtener el nombre del usuario
    cursor.execute("SELECT username FROM usuarios WHERE id_usuario = %s", (post[1],))
    username = cursor.fetchone()[0]

    # Obtener la foto de perfil del usuario
    cursor.execute("SELECT foto_perfil FROM usuarios WHERE id_usuario = %s", (post[1],))
    profile = cursor.fetchone()[0]

    # Cerrar el cursor y la conexión
    cursor.close()
    newConnection.close()

    if post:
        # Formatear la publicación
        postinfo = {
            'username': username,
            'avatar': profile,
            'text': post[2],
            'datepost': post[3].strftime("%Y-%m-%d %H:%M:%S"),
            'image': post[4],
            'reactions': post[5]
        }

        return jsonify({'msg': 'Publicación encontrada exitosamente', 'post': postinfo}), 200
    else:
        return jsonify({'msg': 'Publicación no encontrada'}), 404

# Ruta para obtener la lista de comentarios
@app.route('/api/get_comments', methods=['GET'])
def get_comments():
    data = request.json
    
    id_post = data.get('idpost')
    offset = data.get('offset')  # Obtiene el offset de la consulta
    
    # Conectar a la base de datos
    newConnection = db.connect_and_execute(["SELECT * FROM comentarios"])
    cursor = newConnection.cursor()

    # Obtener todas los comentarios
    cursor.execute("SELECT * FROM comentarios WHERE id_publicacion = %s ORDER BY fecha_depublicacioncomentario DESC LIMIT 10 OFFSET %s", (id_post, offset,))
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
        
        # Formatear la publicación
        commentinfo = {
            'username': username,
            'avatar': profile,
            'text': comment[3],
            'datepost': comment[4].strftime("%Y-%m-%d %H:%M:%S"),
        }

        # Agregar la publicación formateada a la lista
        commentsFormatted.append(commentinfo)

    # Cerrar el cursor y la conexión
    cursor.close()
    newConnection.close()

    return jsonify(commentsFormatted)

# Ruta para añadir amigos
@app.route('/api/add_friend', methods=['POST'])
def add_friend():
    data = request.json
    
    # Obtener datos del formulario de la adicion de amigos
    id_friendship = ''.join([str(random.randint(0, 9)) for _ in range(9)])
    id_user = session['user']['iduser']
    id_user_friend = data.get('iduserfriend')
    
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
        return jsonify({'msg': 'El usuario no existe'}), 404
    
    # Verificar que el usuario no esté intentando agregarse a sí mismo como amigo
    if friend == id_user:
        return jsonify({'msg': 'No puedes agregarte a ti mismo como amigo'}), 400
    
    # Verificar que no exista ya una amistad entre ellos
    cursor.execute("SELECT * FROM amistades WHERE (id_usuarioa = %s AND id_usuarioa = %s) OR (id_usuarioa = %s AND id_usuariob = %s)", (id_user, id_user_friend, id_user_friend, id_user))
    friendLiked = cursor.fetchone()
    if friendLiked:
        # Cerrar el cursor y la conexión
        cursor.close()
        newConnection.close()
        return jsonify({'msg': 'Ya están enlazados como amigos'}), 400

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

    # Retornar los datos proporcionados (Quien agrega se refleja como following, el agregado es friends)
    followinginfo = {
        'idfollowuser': id_user_friend
    }

    # Actualizar la sesión del usuario actual
    user = session['user']
    if 'following' in user:
        user['following'].append(followinginfo)  # Agregar el ID del amigo
    else:
        user['following'] = [followinginfo]  # Si no tiene amigos, crear la lista
    session['user'] = user

    response = jsonify({'msg': '¡Amigo creado con éxito!', 'amistad': followinginfo})
    return response

# Ruta para eliminar amigos
@app.route('/api/remove_friend', methods=['POST'])
def remove_friend():
    data = request.json
    
    # Obtener datos para eliminar la amistad
    id_user = session['user']['iduser']
    id_user_friend = data.get('iduserfriend')
    
    # Conectar a la base de datos
    newConnection = db.connect_and_execute(["SELECT * FROM amistades"])

    # Crear un cursor para ejecutar consultas
    cursor = newConnection.cursor(buffered=True, dictionary=True)

    # Eliminar la amistad de la base de datos
    cursor.execute("DELETE FROM amistades WHERE (id_usuarioa = %s AND id_usuariob = %s) OR (id_usuarioa = %s AND id_usuariob = %s)", 
                   (id_user, id_user_friend, id_user_friend, id_user))

    # Confirmar la transacción
    newConnection.commit()

    # Cerrar el cursor y la conexión
    cursor.close()
    newConnection.close()

    # Retornar los datos proporcionados (Quien agrega se refleja como following, el agregado es friends)
    followinginfo = {
        'idfollowuser': id_user_friend
    }

    # Actualizar la sesión del usuario actual
    user = session['user']
    if 'following' in user:
        user['following'].remove(followinginfo)  # Eliminar el ID del amigo
    session['user'] = user

    # Retornar una respuesta indicando que la amistad ha sido eliminada
    response = jsonify({'msg': '¡Amistad eliminada exitosamente!'})
    return response

if __name__ == '__main__':
    app.run(host="0.0.0.0", port=8000)