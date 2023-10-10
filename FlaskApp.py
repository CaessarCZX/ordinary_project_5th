from flask import Flask, request, jsonify, session

app = Flask(__name__)
app.config['SECRET_KEY'] = 'tu_clave_secreta'  # Cambia esto por una clave segura

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

    # Aquí deberías realizar validaciones de los datos (por ejemplo, si el usuario ya existe)

    # Simplemente almacenaremos los datos en sesión para este ejemplo
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
    session['usuario'] = user_info

    return jsonify({'mensaje': '¡Registro exitoso!', 'user': user_info})

# Ruta de login
@app.route('/login', methods=['POST'])
def login():
    # Obtener datos del formulario de login
    username = request.form.get('username')
    password = request.form.get('password')

    # Aquí deberías verificar las credenciales (por ejemplo, comparar con la base de datos)
    # Si las credenciales son válidas, almacenar el usuario en sesión

    # Para este ejemplo, asumimos que el login es exitoso
    session['user'] = username

    return jsonify({'mensaje': '¡Inicio de sesión exitoso!', 'usuario': username})

# Ruta para obtener el estado de sesión actual
@app.route('/estado_sesion', methods=['GET'])
def estado_sesion():
    usuario = session.get('usuario')
    if usuario:
        return jsonify({'logueado': True, 'usuario': usuario})
    else:
        return jsonify({'logueado': False})

# Ruta para cerrar sesión
@app.route('/logout', methods=['GET'])
def logout():
    session.pop('usuario', None)
    return jsonify({'mensaje': '¡Sesión cerrada exitosamente!'})

if __name__ == '__main__':
    app.run(port=8000)