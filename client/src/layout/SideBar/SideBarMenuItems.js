import { CiUser } from 'react-icons/ci'
import { FaPowerOff } from 'react-icons/fa'
import { PiHouseSimpleLight } from 'react-icons/pi'

export const sectionItems = [
  {
    id: 1,
    name: 'Inicio',
    shortName: 'Inicio',
    label: 'Inicio',
    Icon: PiHouseSimpleLight,
    url: '/home'
  },
  {
    id: 2,
    name: 'Perfil',
    shortName: 'Perfil',
    label: 'Perfil',
    Icon: CiUser,
    url: '/profile/'
  }
  // {
  //   id: 3,
  //   name: 'Configuración',
  //   shortName: 'Config.',
  //   label: 'Configuración',
  //   Icon: CiSettings,
  //   url: '/settings'
  // }
]

// Be careful with 'color' attribute, it should be an empty string('') if no color available
export const LogOutItem = {
  id: 1,
  name: 'Cerrar sesión',
  shortName: 'Salir',
  label: 'Cerrar sesión',
  Icon: FaPowerOff,
  color: 'yellowgreen'
}
