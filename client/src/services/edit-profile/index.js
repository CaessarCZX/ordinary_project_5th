import { maxUserDataValues as maxVal, minUserDataValues as minVal } from '../user-values/userValues.js'

const validMessageEs = {
  existsFirstname: 'El perfil debe de tener almenos un nombre',
  firstnameMinLength: `El nombre debe contener almenos ${minVal.MIN_LENGTH_FIRSTNAME} caracteres`,
  firstnameMaxLength: `El nombre no debe sobrepasar ${maxVal.MAX_LENGTH_FIRSTNAME} caracter`,
  existsLastname: 'El perfil debe de tener almenos un apellido',
  lastnameMinLength: `El apellido debe contener almenos ${minVal.MIN_LENGTH_LASTNAME} caracteres`,
  lastanameMaxLength: `El apellido no debe sobrepasar ${maxVal.MAX_LENGTH_LASTNAME} caracteres`,
  addressMaxLength: `La dirección no debe sobrepasar ${maxVal.MAX_LENGTH_ADDRESS} caracteres`,
  websiteMaxLength: `Este campo no debe sobrepasar ${maxVal.MAX_LENGTH_WEBSITE} caracteres`,
  genderMaxLength: `Este campo no debe sobrepasar ${maxVal.MAX_LENGTH_GENDER} caracteres`,
  phoneMinLength: `Este campo debe contener almenos ${minVal.MIN_LENGTH_PHONE} caracteres`,
  phoneMaxLenght: `Este campo no debe sobrepasar ${maxVal.MAX_LENGTH_PHONE} caracteres`,
  biographyMaxLength: `La biografía no debe sobrepasar ${maxVal.MAX_LENGTH_STORY} caracteres`
}

export const validateDataToEdit = ({ editData }) => {
  const msg = { ...validMessageEs }

  const errorMsg = {}

  const {
    firstname,
    lastname,
    address,
    website,
    gender,
    phone,
    story
  } = editData

  if (!firstname) {
    errorMsg.firstname = msg.existsFirstname
  } else if (firstname.length < minVal.MIN_LENGTH_FIRSTNAME) {
    errorMsg.firstname = msg.firstnameMinLength
  } else if (firstname.length > maxVal.MAX_LENGTH_FIRSTNAME) {
    errorMsg.firstname = msg.firstnameMaxLength
  }

  if (!lastname) {
    errorMsg.lastname = msg.existsLastname
  } else if (lastname.length < minVal.MIN_LENGTH_LASTNAME) {
    errorMsg.lastname = msg.lastnameMinLength
  } else if (lastname.length > maxVal.MAX_LENGTH_LASTNAME) {
    errorMsg.lastname = msg.lastanameMaxLength
  }

  if (address.length > maxVal.MAX_LENGTH_ADDRESS) {
    errorMsg.address = msg.addressMaxLength
  }

  if (website.length > maxVal.MAX_LENGTH_WEBSITE) {
    errorMsg.website = msg.websiteMaxLength
  }

  if (gender.length > maxVal.MAX_LENGTH_GENDER) {
    errorMsg.gender = msg.genderMaxLength
  }

  if (phone.length > maxVal.MAX_LENGTH_PHONE) {
    errorMsg.phone = msg.phoneMaxLenght
  }

  if (story.length > maxVal.MAX_LENGTH_STORY) {
    errorMsg.story = msg.biographyMaxLength
  }

  return {
    errorMsg,
    errorLength: Object.keys(errorMsg).length
  }
}
