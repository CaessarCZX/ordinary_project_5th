import { useTheme } from '../hooks/useTheme.js'
import { ProfileInfo } from '../layout/ProfileInfo/ProfileInfo.jsx'
import { Page } from '../styled components/Darth-theme.js'

export function Profile () {
  // Theme
  const { isDark } = useTheme()

  return (
    <Page
      $isDark={isDark}
      $absolute
      $heigth='100vh'
      $enableBg
    >
      <ProfileInfo />
    </Page>
  )
}
