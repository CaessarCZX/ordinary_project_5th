// const validMessagesEN = {
//   firstnameExists: 'Please add your firstname',
//   firstnameLength: 'Length should be less than 90 characters',
//   lastnameExists: 'Please add your lastname',
//   lastnameLength: 'Length should be less than 90 characters',
//   usernameExists: 'Please add your username',
//   usernameLength: 'Length should be less tha 30 characters',
//   emailExists: 'Please add your email',
//   emailValid: 'Email is not valid',
//   passwordExists: 'Please add your password',
//   passwordLength: 'Length should be greater than 8 characters',
//   passwordMatch: 'The password should be match'
// }

const validMessagesEs = {
  firstnameExists: 'Porfavor agregue un nombre',
  firstnameLength: 'El nombre no puede superar más de 90 caracteres',
  lastnameExists: 'Porfavor agregue un apellido apellidos',
  lastnameLength: 'Los apellidos no pueden superar más de 90 caracteres',
  usernameExists: 'Porfavor agregue un nombre de usuario',
  usernameLength: 'El nombre de usuario no puede superar más de 30 caracteres',
  emailExists: 'Porfavor agregue un email',
  emailValid: 'Ingrese un email válido',
  passwordExists: 'Porfavor agregue una contraseña',
  passwordLength: 'La contraseña debe tener al menos 8 caracteres',
  passwordMatch: 'Las contraseñas deben coincidir'
}

export const validateRegisterData = (inputUserData) => {
  // Rules
  const MAX_LENGTH_FIRSTNAME = 90
  const MAX_LENGTH_LASTNAME = 90
  const MAX_LENGTH_USERNAME = 30
  const MIN_LENGTH_PASSWORD = 8
  // Get user data
  const { firstname, lastname, username, email, password, confirmPassword } = inputUserData

  const msg = { ...validMessagesEs }

  const errorMsg = {}

  if (!firstname) {
    errorMsg.firstname = msg.firstnameExists
  } else if (firstname.length > MAX_LENGTH_FIRSTNAME) {
    errorMsg.firstname = msg.firstnameLength
  }

  if (!lastname) {
    errorMsg.lastname = msg.lastnameExists
  } else if (lastname.length > MAX_LENGTH_LASTNAME) {
    errorMsg.lastname = msg.lastnameLength
  }

  const normalizeUserName = username.toLowerCase().replace(/ /g, '')

  if (!normalizeUserName) {
    errorMsg.username = msg.usernameExists
  } else if (normalizeUserName.length > MAX_LENGTH_USERNAME) {
    errorMsg.username = msg.usernameLength
  }

  if (!email) {
    errorMsg.email = msg.emailExists
  } else if (!validateEmail(email)) {
    errorMsg.email = msg.emailValid
  }

  if (!password) {
    errorMsg.password = msg.passwordExists
  } else if (password.length < MIN_LENGTH_PASSWORD) {
    errorMsg.password = msg.passwordLength
  }

  if (password !== confirmPassword) {
    errorMsg.confirmPassword = msg.passwordMatch
  }

  return {
    errorMsg,
    errorLength: Object.keys(errorMsg).length
  }
}

const validateEmail = (email) => {
  const normalizeEmail = String(email).toLowerCase()
  const regexPattern = /^(([^<>()[\],;:\s@"]+(\.[^<>()[\],;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|([a-zA-Z0-9.-]+\.[a-zA-Z]{2,}))$/
  const regex = new RegExp(regexPattern)
  return regex.test(normalizeEmail)
}
