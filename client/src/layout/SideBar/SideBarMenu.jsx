import { useState } from 'react'
import { VscMenu } from 'react-icons/vsc'
import { IconContext } from '../../components/IconContext.jsx'
import { useTheme } from '../../hooks/useTheme.js'
import {
  SideBarContainer,
  SideBarWrapActivateButton
} from '../../styled components/SideBarMenu-theme.js'
import { SideBarMenuCardView } from '../SideBar/SideBarMenuCardView.jsx'
import { SideBarMenuItemView } from '../SideBar/SideBarMenuItemView.jsx'
import { LogOutItem, sectionItems } from './SideBarMenuItems.js'
import { SideBarMenuLogoutItemView } from './SideBarMenuLogoutItemView .jsx'

export function SideBarMenu () {
  // Redux
  const { isDark } = useTheme()

  // For wrap
  const [isOpen, setIsOpen] = useState(false)

  // Wrap control
  const handleClick = () => {
    setIsOpen(!isOpen)
  }

  return (
    <SideBarContainer
      $isOpen={isOpen}
      $isDark={isDark}
      $absolute
      $disableBlockBorder
      $dissableLeftBorder
    >
      <SideBarWrapActivateButton onClick={handleClick}>
        <IconContext size='1.7rem' icon={VscMenu} />
      </SideBarWrapActivateButton>

      <SideBarMenuCardView
        isOpen={isOpen}
      />
      {
        sectionItems.map(
          (sectionItem) => (
            <SideBarMenuItemView
              key={sectionItem.label}
              sectionItem={sectionItem}
              isOpen={isOpen}
            />))
      }
      <SideBarMenuLogoutItemView
        actionItem={LogOutItem}
        isOpen={isOpen}
        setColor
      />
    </SideBarContainer>
  )
}
