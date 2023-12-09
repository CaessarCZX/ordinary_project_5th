import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

def send_mail(correo_destino):
    servidor_smtp = 'smtp-mail.outlook.com'
    puerto_smtp = 587
    usuario_smtp = 'sami_cayetano@hotmail.com'
    contrasena_smtp = 'venusaur10'

    mensaje = MIMEMultipart()
    mensaje['From'] = usuario_smtp
    mensaje['To'] = correo_destino
    mensaje['Subject'] = 'Notificación de intento fallido'

    cuerpo_mensaje = MIMEText('Se ha detectado un intento fallido de acceso a tu cuenta.', 'plain')
    mensaje.attach(cuerpo_mensaje)

    with smtplib.SMTP(servidor_smtp, puerto_smtp) as servidor:
        servidor.starttls()
        servidor.login(usuario_smtp, contrasena_smtp)
        servidor.sendmail(usuario_smtp, correo_destino, mensaje.as_string())