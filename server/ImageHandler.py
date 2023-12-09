from PIL import Image
import io
import os

def process_profile_image(image, name, folder, widthMax, heightMax):
    try:
        with Image.open(image) as image:
            width, height = image.size
            target_width = widthMax
            target_height = heightMax
                
            # Calcula las proporciones de redimensionamiento
            width_ratio = target_width / width
            height_ratio = target_height / height

            # Escoger el ratio más pequeño para no distorsionar la imagen
            ratio = min(width_ratio, height_ratio)

            # Calcular las nuevas dimensiones para la imagen redimensionada
            new_width = int(width * ratio)
            new_height = int(height * ratio)

            # Redimensionar manteniendo la proporción original
            image = image.resize((new_width, new_height), Image.LANCZOS)

            # Calcular las coordenadas para el recorte centrado
            left = (new_width - target_width) / 2
            top = (new_height - target_height) / 2
            right = (new_width + target_width) / 2
            bottom = (new_height + target_height) / 2

            # Aplicar el recorte
            image = image.crop((left, top, right, bottom))
            
            # Guardar la imagen en una subcarpeta del proyecto
            image = image.convert('RGB')
            output = io.BytesIO()
            output = io.BytesIO()
            image.save(output, format='JPEG', quality=60)
                
            # Guardar la imagen en una subcarpeta del proyecto
            profile_folder = f'./server/{folder}'
            if not os.path.exists(profile_folder):
                os.makedirs(profile_folder)
                
            image.save(os.path.join(profile_folder, f"{name}.jpg"))

            profile_path = os.path.join(profile_folder, f"{name}.jpg")
            with open(profile_path, 'wb') as f:
                f.write(output.getvalue())
            return profile_path
    except Exception as e:
        return None, str(e)