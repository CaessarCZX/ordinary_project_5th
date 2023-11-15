import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useTheme } from '../hooks/useTheme.js'
import { LogoPage } from '../layout/Logo/LogoPage.jsx'
// import { manageDataForm } from '../services/login/index.js'
import { AlertIntoForm } from '../components/AlertIntoForm.jsx'
import { useAlert } from '../hooks/useAlert.js'
import { useLoginRedirect } from '../hooks/useLoginRedirect.js'
import { register } from '../redux/actions/authActions.js'
import { LinkS } from '../styled components/Darth-theme-Router-Links.js'
import {
  Article,
  Button,
  CenterAbosolute,
  Div, DivFlex, Input, Label, LateralAbsolute,
  SmallText,
  SpacerContainer,
  Text,
  Title
} from '../styled components/Darth-theme.js'
import { isEmptyObject, undefinedToBoolean } from '../utils/getValues.js'

export function Register () {
  // Theme
  const { isDark } = useTheme()
  // Redux
  const dispatch = useDispatch()
  const alert = useAlert()

  // password matching
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isMatchPass, setIsMatchPass] = useState(true)

  // Show pass feature
  const [showpass, setShowpass] = useState(false)
  const [showOfPass, setShowOfPass] = useState(false)

  // Verify if the user is autenticated
  useLoginRedirect()

  // Verify if password is matching
  const handleConfirmPassword = (value) => {
    setConfirmPassword(value)
    const enableBtn = value === password
    setIsMatchPass(enableBtn)
  }

  // Subtit form data
  const handleSubmit = (event) => {
    event.preventDefault()
    const entries = new window.FormData(event.target)
    const inputForm = Object.fromEntries(entries)
    const userData = { ...inputForm, password, confirmPassword }
    dispatch(register(userData))
  }

  return (
    <Div $height={isEmptyObject(alert) ? '120vh' : '130vh'}>{/* < ==== < ====  TODO: REMOVE THIS TAG, IT'S JSUT FOR DEVELOPMENT */}
      <SpacerContainer $isDark={isDark}>
        <LateralAbsolute $margin='1.5rem'>
          <LinkS to='/' $isDark={isDark}>Ir a inicio</LinkS>
        </LateralAbsolute>
        <CenterAbosolute $mBlock='4rem' $width='100%' $maxWidth='400px'>
          <Article $pInline='1rem'>
            <Div $txtCenter>
              <picture>
                <LogoPage $large />
              </picture>
              <Title $small $isDark={isDark}>Crea tu cuenta gratis</Title>
            </Div>
            <form onSubmit={handleSubmit}>
              <DivFlex $mBlock='1rem' $gap='1.5rem'>
                <Div>
                  <Label $required $isDark={isDark}>Nombre</Label>
                  <Input
                    type='text'
                    name='firstname'
                    placeholder={undefinedToBoolean(alert.firstname) ? alert.firstname : 'Ej: Tony...'}
                    $alertPlaceholder={undefinedToBoolean(alert.firstname)}
                    minLength='5'
                    maxLength='50'
                    $isDark={isDark}
                  />
                </Div>
                <Div>
                  <Label $required $isDark={isDark}>Apellidos</Label>
                  <Input
                    type='text'
                    name='lastname'
                    placeholder={undefinedToBoolean(alert.lastname) ? alert.lastname : 'Ej: Cayetano...'}
                    $alertPlaceholder={undefinedToBoolean(alert.lastname)}
                    minLength='5'
                    maxLength='50'
                    $isDark={isDark}
                  />
                </Div>
              </DivFlex>
              <Div $mBlock='1rem'>
                <Label $required $isDark={isDark}>Nombre de usuario</Label>
                <Input
                  type='text'
                  name='username'
                  placeholder={undefinedToBoolean(alert.username) ? alert.lastname : 'Ej: inSamuel77'}
                  $alertPlaceholder={undefinedToBoolean(alert.username)}
                  minLength='5'
                  maxLength='25'
                  $isDark={isDark}
                />
              </Div>
              <Div $mBlock='1rem'>
                <Label $required $isDark={isDark}>Email</Label>
                <Input
                  type='text'
                  name='email'
                  placeholder={undefinedToBoolean(alert.email) ? alert.email : 'alguien@mail.com'}
                  $alertPlaceholder={undefinedToBoolean(alert.email)}
                  minLength='10'
                  maxLength='50'
                  $isDark={isDark}
                />
              </Div>
              <Div $mBlock='1rem'>
                <DivFlex>
                  <Label $required $isDark={isDark}>Contraseña</Label>
                  <SmallText
                    $bold={showpass}
                    $clickable
                    $width={showpass ? '160px' : '155px'}
                    $isDark={isDark}
                    onClick={() => setShowpass(!showpass)}
                  >
                    {showpass ? 'Ocultar Contraseña' : 'Mostrar Contraseña'}
                  </SmallText>
                </DivFlex>
                <Input
                  type={showpass ? 'type' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={undefinedToBoolean(alert.password) ? alert.password : 'Ej: miContraseña'}
                  $alertPlaceholder={undefinedToBoolean(alert.password)}
                  minLength='8'
                  maxLength='25'
                  $isDark={isDark}
                />
              </Div>
              <Div $mBlock='1rem'>
                <DivFlex>
                  <Label $required $isDark={isDark}>Confirmar contraseña</Label>
                  <SmallText
                    $bold={showOfPass}
                    $clickable
                    $width={showOfPass ? '160px' : '155px'}
                    $isDark={isDark}
                    onClick={() => setShowOfPass(!showOfPass)}
                  >
                    {showOfPass ? 'Ocultar Contraseña' : 'Mostrar Contraseña'}
                  </SmallText>
                </DivFlex>
                <Input
                  type={showOfPass ? 'type' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => handleConfirmPassword(e.target.value)}
                  placeholder='Ej: miContraseña'
                  minLength='8'
                  maxLength='25'
                  $isDark={isDark}
                />
              </Div>
              {/* Show password match error message */}
              <AlertIntoForm value={!isMatchPass}>
                {
                  (confirmPassword === ''
                    ? 'Ingrese nuevamente la contraseña'
                    : 'Las contreseñas no coinciden')
                }
              </AlertIntoForm>
              <DivFlex $mBlock='1.2rem'>
                <Button type='submit' disabled={!isMatchPass} $action>Registrate</Button>
              </DivFlex>
            </form>
            <DivFlex $gap='0.5rem' $jCenter>
              <Text $medium $isDark={isDark}>¿Ya tienes una cuenta?</Text>
              <LinkS to='/login' $medium $action>Inicia sesión aquí</LinkS>
            </DivFlex>
          </Article>
        </CenterAbosolute>
      </SpacerContainer>
    </Div>
  )
}
