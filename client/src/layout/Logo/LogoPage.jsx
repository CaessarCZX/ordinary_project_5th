import logoDark from '../../assets/logo-dark.svg'
import logoLight from '../../assets/logo-light.svg'
import { useTheme } from '../../hooks/useTheme.js'
import {
  LogoMain
} from '../../styled components/Darth-theme.js'

export function LogoPage ({ ...props }) {
  const { isDark } = useTheme()

  const handleLogo = isDark ? logoDark : logoLight

  return (
    <LogoMain
      {...props}
      src={handleLogo}
      alt='GeekNetwork log'
      title='GeekNetwork'
    />
  )
}
