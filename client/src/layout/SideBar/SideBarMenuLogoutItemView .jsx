import PropTypes from 'prop-types'
import { useDispatch } from 'react-redux'
import { IconContext } from '../../components/IconContext.jsx'
import { useTheme } from '../../hooks/useTheme.js'
import { logout } from '../../redux/actions/authActions.js'
import {
  LiFlex,
  MicroSubtitle,
  SmallText
} from '../../styled components/Darth-theme.js'
import {
  SideBarActionItemButton,
  SideBarItemOpenFade,
  SideBarMenuItemCollapse,
  SideBarTooltip
} from '../../styled components/SideBarMenu-theme.js'

export function SideBarMenuLogoutItemView ({ actionItem, isOpen, setColor }) {
  // Theme
  const { isDark } = useTheme()
  // Redux dispatcher
  const dispatch = useDispatch()

  // Sections data
  const {
    name,
    shortName,
    label,
    Icon,
    color
  } = actionItem

  return (
    <LiFlex
      aria-label={label}
      $aiCenter
    >
      <SideBarActionItemButton onClick={() => dispatch(logout())}>
        <SideBarMenuItemCollapse $isOpen={isOpen}>
          <IconContext
            icon={Icon}
            style={{ color: setColor && color }}
          />
          {
            isOpen
              ? (
                <SideBarItemOpenFade>
                  <MicroSubtitle $isDark={isDark}>{name}</MicroSubtitle>
                </SideBarItemOpenFade>
                )
              : <SmallText $isDark={isDark}>{shortName}</SmallText>
          }
        </SideBarMenuItemCollapse>
      </SideBarActionItemButton>
      {
        isOpen || <SideBarTooltip>{label}</SideBarTooltip>
      }
    </LiFlex>
  )
}

SideBarMenuLogoutItemView.propTypes = {
  actionItem: PropTypes.object.isRequired,
  isOpen: PropTypes.bool.isRequired,
  setColor: PropTypes.bool
}
