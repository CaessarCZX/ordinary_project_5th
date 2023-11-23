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
    username =  username.lower().strip()
    mail = data.get('email')
    password = data.get('password')
    password = password.encode('utf-8')
    sal = bcrypt.gensalt()
    hashed_password = bcrypt.hashpw(password, sal)
    year = data.get('year')
    month = data.get('month')
    day = data.get('day')

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

    # Verificar que el usuario sea mayor de 15 años
    today = datetime.today()
        
    edad = today.year - int(year) - ((today.month, today.day) < (int(month), int(day)))
    if edad < 15:
        cursor.close()
        newConnection.close()
        return jsonify({'msg': 'Debes tener al menos 15 años para registrarte'}), 400

    # Ejecutar el INSERT INTO en la tabla de usuarios
    cursor.execute(
        "INSERT INTO usuarios (id_usuario, username, nombre, apellido, correo_electronico, contrasena_hash, fecha_nacimiento, foto_perfil, telefono, biografia, sexo) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)",
        (id_user, username, first_name, last_name, mail, hashed_password, f"{year}-{month}-{day}", ' ', ' ', ' ', ' ')
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
        'phone': ' ',
        'biography': ' ',
        'sex': ' '
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
                'birthDate': userinfo['telefono'],
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
            response = jsonify({'msg': '¡Inicio de sesión exitoso!', 'accesToken': token, 'usuario': userinfo})
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
@app.route('/api/keep_session', methods=['GET'])
def keep_session():
    token = request.cookies.get('token')

    if token:
        try:
            # Decodifica el token
            payload = jwt.decode(token, app.config['SECRET_KEY'], algorithms=['HS256'])
            userToken = payload['user_id']

            # Genera un nuevo token y actualiza la cookie
            newtoken = jwt.encode({'user': userToken, 'exp': datetime.utcnow() + timedelta(hours=1)}, app.config['SECRET_KEY'], algorithm='HS256')
            response = jsonify({'msg': '¡Sesión actualizada!', 'accesToken': newtoken})
            response.set_cookie('token', newtoken)

            return response

        except jwt.ExpiredSignatureError:
            return jsonify({'msg': 'Token expirado'}), 401
        except jwt.InvalidTokenError:
            return jsonify({'msg': 'Token inválido'}), 401

    return jsonify({'msg': 'Token no proporcionado'}), 401

# Ruta para cerrar sesión
@app.route('/api/logout', methods=['GET'])
def logout():
    session.pop('user', None)
    response = jsonify({'msg': '¡Sesión cerrada exitosamente!'})
    response.delete_cookie('token')
    return response

@app.route('/api/profile', methods=['GET'])
def profile():
    userinfo = session.get('user')

    if userinfo:
        # Decodificar la contraseña hasheada a la original
        userinfo['password'] = bcrypt.checkpw(session['user']['password'].encode('utf-8'), userinfo['password'].encode('utf-8'))

        return jsonify({'msg': 'Usuario recuperado', 'user': userinfo})
    else:
        return jsonify({'msg': 'Usuario no autenticado'}), 401
    
@app.route('/api/user/<string:username>', methods=['GET'])
def view_user(username):
    # Conectar a la base de datos
    newConnection = db.connect_and_execute(["SELECT * FROM usuario"])

    # Crear un cursor para ejecutar consultas
    cursor = newConnection.cursor(dictionary=True)

    # Buscar el usuario por su ID
    cursor.execute("SELECT * FROM usuarios WHERE username = %s", (username,))
    userinfo = cursor.fetchone()

    #Oculta contraseña
    userinfo['contrasena_hash'] = ' '

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
    profile = data.get('profile')
    phone = data.get('phone')
    biography = data.get('biography')
    sex = data.get('sex')

    if first_name or last_name:
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

    # Verificar si el nuevo nombre de usuario ya existe
    if username:
        username =  username.lower().strip()

        cursor.execute("SELECT * FROM usuarios WHERE username = %s", (username,))
        if cursor.fetchone():
            cursor.close()
            newConnection.close()
            return jsonify({'msg': 'El nombre de usuario ya está en uso'}), 400
    else:
        username = session['user']['username']

    # Verificar que el nombre de usuario no se repita
    if mail:
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
    if password:
        sal = bcrypt.gensalt()
        hashedpassword = bcrypt.hashpw(password, sal)
        password = password.encode('utf-8')
        hashedpassword = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
    else:
        hashedpassword = session['user']['password']
    
    # Verificar si se proporcionó una nueva foto de perfil
    if profile:
        try:
            # Cargar la imagen y comprimirla
            with Image.open(profile) as profile:
                width, height = profile.size
                target_width = 200
                target_height = 200
                
                # Calcula las proporciones de redimensionamiento
                width_ratio = target_width / width
                height_ratio = target_height / height

                # Escoger el ratio más pequeño para no distorsionar la imagen
                ratio = min(width_ratio, height_ratio)

                # Calcular las nuevas dimensiones para la imagen redimensionada
                new_width = int(width * ratio)
                new_height = int(height * ratio)

                # Redimensionar manteniendo la proporción original
                profile = profile.resize((new_width, new_height), Image.LANCZOS)

                # Calcular las coordenadas para el recorte centrado
                left = (new_width - target_width) / 2
                top = (new_height - target_height) / 2
                right = (new_width + target_width) / 2
                bottom = (new_height + target_height) / 2

                # Aplicar el recorte
                profile = profile.crop((left, top, right, bottom))

                # Guardar la imagen en una subcarpeta del proyecto
                profile = profile.convert('RGB')
                output = io.BytesIO()
                profile.save(output, format='JPEG', quality=60)
                
                # Guardar la imagen en una subcarpeta del proyecto
                profile_folder = './server/profiles'
                if not os.path.exists(profile_folder):
                    os.makedirs(profile_folder)
                
                profile.save(os.path.join(profile_folder, f"{session['user']['iduser']}.jpg"))

                profile_path = os.path.join(profile_folder, f"{session['user']['iduser']}.jpg")
                with open(profile_path, 'wb') as f:
                    f.write(output.getvalue())
        except Exception as e:
            return jsonify({'msg': 'Error al procesar la imagen', 'error': str(e)}), 500
    else:
        profile_path = session['user']['profile']

    # Verificar si se proporcionó un telefono
    if phone == None:
        phone = session['user']['phone']

    # Verificar si se proporcionó una biografia
    if biography == None:
        biography = session['user']['biography']

    # Verificar si se proporcionó un sexo
    if sex == None:
        sex = session['user']['sex']

    # Actualizar la información del usuario
    cursor.execute(
        "UPDATE usuarios SET username = %s, nombre = %s, apellido = %s, correo_electronico = %s, contrasena_hash = %s, foto_perfil = %s, telefono = %s, biografia = %s, sexo = %s WHERE id_usuario = %s",
        (username, first_name, last_name, mail, hashedpassword, profile_path, phone, biography, sex, session['user']['iduser'])
    )

    # Confirmar la transacción
    newConnection.commit()

    # Actualizar la información en la sesión
    session['user']['firstname'] = first_name if first_name else session['user']['firstName']
    session['user']['lastName'] = last_name if last_name else session['user']['lastName']
    session['user']['username'] = username if username else session['user']['username']
    session['user']['mail'] = mail if mail else session['user']['mail']
    session['user']['profile'] = profile_path if profile_path else session['user']['profile']
    session['user']['phone'] = phone if phone else session['user']['phone']
    session['user']['biography'] = biography if biography else session['user']['biography']
    session['user']['sex'] = sex if sex else session['user']['sex']

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
    if image:
        try:
            # Cargar la imagen y comprimirla
            with Image.open(image) as img:
                width, height = img.size
                target_width = 500
                target_height = 450
                
                # Calcula las proporciones de redimensionamiento
                width_ratio = target_width / width
                height_ratio = target_height / height

                # Escoger el ratio más pequeño para no distorsionar la imagen
                ratio = min(width_ratio, height_ratio)

                # Calcular las nuevas dimensiones para la imagen redimensionada
                new_width = int(width * ratio)
                new_height = int(height * ratio)

                # Redimensionar manteniendo la proporción original
                img = img.resize((new_width, new_height), Image.ANTIALIAS)

                # Calcular las coordenadas para el recorte centrado
                left = (new_width - target_width) / 2
                top = (new_height - target_height) / 2
                right = (new_width + target_width) / 2
                bottom = (new_height + target_height) / 2

                # Aplicar el recorte
                img = img.crop((left, top, right, bottom))

                # Guardar la imagen en una subcarpeta del proyecto
                img = img.convert('RGB')
                output = io.BytesIO()
                img.save(output, format='JPEG', quality=60)
                
                # Guardar la imagen en una subcarpeta del proyecto
                image_folder = './server/images'
                if not os.path.exists(image_folder):
                    os.makedirs(image_folder)
                
                image_path = os.path.join(image_folder, f"{id_post}.jpg")
                with open(image_path, 'wb') as f:
                    f.write(output.getvalue())
        except Exception as e:
            return jsonify({'msg': 'Error al procesar la imagen', 'error': str(e)}), 500

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
    
    cursor.execute("UPDATE publicaciones SET reaccion = %s WHERE id_publicacion = %s",
    (reaccion, id_post))

    # Confirmar la transacción
    newConnection.commit()

    # Cerrar el cursor y la conexión
    cursor.close()
    newConnection.close()

    # Por ahora, simplemente retornamos los datos proporcionados
    likeinfo = {
        'idlike': id_likes,
        'iduser': id_user,
        'idpost': id_post,
        'likestatus': status
    }

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
        publicacion_formateada = {
            'username': username,
            'profile': profile,
            'text': post[2],
            'datepost': post[3].strftime("%Y-%m-%d %H:%M:%S"),
            'image': post[4],
            'reactions': post[5]
        }

        # Agregar la publicación formateada a la lista
        postsFormatted.append(publicacion_formateada)

    # Cerrar el cursor y la conexión
    cursor.close()
    newConnection.close()

    return jsonify(postsFormatted)

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
            'profile': profile,
            'text': post[2],
            'datepost': post[3].strftime("%Y-%m-%d %H:%M:%S"),
            'image': post[4],
            'reactions': post[5]
        }

        return jsonify({'msg': 'Publicación encontrada exitosamente', 'post': postinfo}), 200
    else:
        return jsonify({'msg': 'Publicación no encontrada'}), 404
    
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
        publicacion_formateada = {
            'username': username,
            'profile': profile,
            'text': comment[3],
            'datepost': comment[4].strftime("%Y-%m-%d %H:%M:%S"),
        }

        # Agregar la publicación formateada a la lista
        commentsFormatted.append(publicacion_formateada)

    # Cerrar el cursor y la conexión
    cursor.close()
    newConnection.close()

    return jsonify(commentsFormatted)
    
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

    response = jsonify({'msg': '¡Amigo creado con éxito!', 'user a': id_user, 'user b': id_user_friend})
    return response

if __name__ == '__main__':
    app.run(port=8000)