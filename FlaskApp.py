from flask import Flask, request, jsonify, session
import jwt
from datetime import datetime, timedelta
from DataBaseConnection import connect

app = Flask(__name__)
app.config['SECRET_KEY'] = 'ClaveSecreta'

# Ruta de registro
@app.route('/register', methods=['POST'])
def registro():
    # Obtener datos del formulario de registro
    first_name = request.form.get('first_name')
    last_name = request.form.get('last_name')
    username = request.form.get('username')
    mail = request.form.get('mail')
    password = request.form.get('password')
    year = request.form.get('year')
    month = request.form.get('month')
    day = request.form.get('day')   
    # Conectar a la base de datos
    newConnection = connect()

    # Crear un cursor para ejecutar consultas
    cursor = newConnection.cursor()

    # Verificar que el correo no existe en la base de datos
    cursor.execute("SELECT * FROM usuario WHERE correo = %s", (mail,))
    if cursor.fetchone():
        cursor.close()
        newConnection.close()
        return jsonify({'mensaje': 'El correo ya está registrado'}), 400

    # Verificar que el nombre de usuario no se repita
    cursor.execute("SELECT * FROM usuario WHERE usuario = %s", (username,))
    if cursor.fetchone():
        cursor.close()
        newConnection.close()
        return jsonify({'mensaje': 'El nombre de usuario ya está en uso'}), 400
    
    # Verificar que la contraseña tenga al menos 6 caracteres
    if len(password) < 6:
        cursor.close()
        newConnection.close()
        return jsonify({'mensaje': 'La contraseña debe tener al menos 6 caracteres'}), 400

    # Verificar que el usuario sea mayor de 15 años
    from datetime import date
    today = date.today()
    edad = today.year - year - ((today.month, today.day) < (month, day))
    if edad < 15:
        cursor.close()
        newConnection.close()
        return jsonify({'mensaje': 'Debes tener al menos 15 años para registrarte'}), 400

    # Ejecutar el INSERT INTO en la tabla de usuarios
    cursor.execute(
        "INSERT INTO usuario (nombre, apellido, usuario, correo, contraseña, year, month, day) VALUES (%s, %s, %s, %s, %s, %s, %s, %s)",
        (first_name, last_name, username, mail, password, year, month, day)
    )

    # Confirmar la transacción
    newConnection.commit()

    # Cerrar el cursor y la conexión
    cursor.close()
    newConnection.close()


    # Simplemente almacenaremos los datos en sesión
    user_info = {
        'first_name': first_name, 
        'last_name': last_name, 
        'username': username, 
        'mail': mail,
        'password': password,
        'year': year,
        'month': month,
        'day': day
    }
    session['user'] = user_info

    token = jwt.encode({'userToken': user_info['username'], 'exp': datetime.utcnow() + timedelta(hours=1)}, app.config['ClaveSecreta'], algorithm='HS256')
    response = jsonify({'mensaje': '¡Registro exitoso!', 'token': token, 'user': user_info})
    response.set_cookie('token', token)
    return response

# Ruta de login
@app.route('/login', methods=['POST'])
def login():
    # Obtener datos del formulario de login
    mail = request.form.get('username')
    password = request.form.get('password')
    
    # Conectar a la base de datos
    newConnection = connect()

    # Crear un cursor para ejecutar consultas
    cursor = newConnection.cursor(dictionary=True)

    # Buscar al usuario por correo y contraseña
    consulta = "SELECT * FROM mail WHERE password = %s AND contraseña = %s"
    cursor.execute(consulta, (mail, password))

    user_info = cursor.fetchone()

    if user_info:
        # Si las credenciales son válidas, almacenar el usuario en sesión
        user_info = {
            'first_name': user_info[0],
            'last_name': user_info[1],
            'username': user_info[2],
            'mail': user_info[3],
            'password': user_info[4],
            'year': user_info[5],
            'month': user_info[6],
            'day': user_info[7]
        }
        session['user'] = user_info

        # Cerrar el cursor y la conexión
        cursor.close()
        newConnection.close()

        token = jwt.encode({'userToken': user_info[2], 'exp': datetime.utcnow() + timedelta(hours=1)}, app.config['ClaveSecreta'], algorithm='HS256')
        response = jsonify({'mensaje': '¡Inicio de sesión exitoso!', 'token': token, 'usuario': user_info})
        response.set_cookie('token', token)
        return response

    # Si las credenciales no son válidas
    cursor.close()
    newConnection.close()
    return jsonify({'mensaje': 'Credenciales incorrectas'}), 401

# Ruta para obtener el estado de sesión actual
@app.route('/keep_session', methods=['GET'])
def estado_sesion():
    user_info = session.get('user')
    if user_info:
        return jsonify({'logueado': True, 'usuario': user_info})
    else:
        return jsonify({'logueado': False})

# Ruta para cerrar sesión
@app.route('/logout', methods=['GET'])
def logout():
    session.pop('user', None)
    return jsonify({'mensaje': '¡Sesión cerrada exitosamente!'})

if __name__ == '__main__':
    app.run(port=8000)