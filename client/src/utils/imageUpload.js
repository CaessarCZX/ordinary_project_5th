const cloudinaryAPI = import.meta.env.VITE_COUDINARY_API_URL
const uploadPreset = import.meta.env.VITE_CLOUDINARY_API_UPLOAD_PRESET
const cloudName = import.meta.env.VITE_CLOUDINARY_API_CLOUD_NAME

export const checkImage = (file) => {
  let err = ''

  if (!file) {
    err = 'Imagen no encontrada'
    return err
  }

  if (file.size > 1024 * 1024) {
    err = 'El archivo es demasiado grande, debe de ser menor a 1mb.'
    return err
  }

  if (file.type !== 'image/jpeg' && file.type !== 'image/png') {
    err = 'El tipo de archivo no es soportado'
    return err
  }
}

export const imageUpload = async (images) => {
  const ENDPOINT = `${cloudinaryAPI}/image/upload`

  const imageCollection = []
  for (const items of images) {
    const formData = new FormData()
    formData.append('file', items)

    formData.append('upload_preset', uploadPreset)
    formData.append('cloud_name', cloudName)

    try {
      const res = await fetch(ENDPOINT, {
        method: 'POST',
        body: formData
      })

      const data = await res.json()

      imageCollection.push({
        public_id: data.public_id,
        secure_url: data.secure_url
      })
    } catch (err) {
      console.error(err)
      return null
    }
  }

  return imageCollection
}
