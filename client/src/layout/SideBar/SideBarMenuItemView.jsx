import PropTypes from 'prop-types'
import { IconContext } from '../../components/IconContext.jsx'
import { useDataUser } from '../../hooks/useDataUser.js'
import { useTheme } from '../../hooks/useTheme.js'
import {
  LiFlex,
  MicroSubtitle,
  SmallText
} from '../../styled components/Darth-theme.js'
import {
  SideBarItemOpenFade,
  SideBarMenuItemCollapse,
  SideBarTooltip,
  WrapLink
} from '../../styled components/SideBarMenu-theme.js'

export function SideBarMenuItemView ({ sectionItem, isOpen }) {
  // Theme
  const { isDark } = useTheme()
  // get User id
  const user = useDataUser()

  // Sections data
  const {
    name,
    shortName,
    label,
    url,
    Icon
  } = sectionItem

  return (
    <LiFlex
      aria-label={label}
      $aiCenter
    >
      <WrapLink to={
          name === 'Perfil'
            ? `${url}${user._id}`
            : url
        }
      >
        <SideBarMenuItemCollapse $isOpen={isOpen}>
          <IconContext icon={Icon} />
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
      </WrapLink>
      {
        isOpen || <SideBarTooltip>{label}</SideBarTooltip>
      }
    </LiFlex>
  )
}

SideBarMenuItemView.propTypes = {
  sectionItem: PropTypes.object.isRequired,
  isOpen: PropTypes.bool.isRequired
}
