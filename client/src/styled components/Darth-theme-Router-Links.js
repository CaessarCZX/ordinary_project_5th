import { Link } from 'react-router-dom'
import styled, { css } from 'styled-components'
import { Margins } from './Darth-theme.js'
import { BUTTONS as btn, DARTH_THEME_DARK_MODE as dark } from './Darth-theme.var.js'

export const LinkS = styled(Link)`
  font-family: inherit;
  line-height: 1.5;
  text-decoration: none;
  color: ${(props) => props.$isDark ? dark.textSeconday : dark.choosenElement};

  ${(props) => props.$action && css`
    color: ${dark.choosenElementBtn};
  `}

  ${(props) => props.$medium && css`
    font-size: 14px;
    font-weight: 300;
  `}
`

export const ButtonLink = styled(Link)`
  ${Margins}

  display: ${btn.general.display};
  padding: ${btn.general.padding};
  flex: ${btn.general.flex};
  font-family: ${btn.general.fontFamily};
  font-size: ${btn.general.fontSize};
  font-weight: ${btn.general.fontWeight};
  justify-content: ${btn.general.justifyContent};
  line-height: ${btn.general.lineHeight};
  border-style: ${btn.general.borderStyle};
  border-radius: ${btn.general.borderRadius};
  border-color: ${btn.defaultBtn.borderColor};
  border-width: ${btn.general.borderWidth};
  background-color: ${btn.defaultBtn.backgroundColor};
  box-shadow: ${btn.defaultBtn.boxShadow};
  transition: ${btn.general.transition};
  cursor: ${btn.general.cursor};
  color: ${(props) => (props.$isDark ? dark.titlePrimary : '#0e0e0e')};
  text-decoration: none;

  &:hover {
    background-color: ${btn.defaultBtn.hover.backgroundColor};
  }

  ${(props) => props.$action && css`
    background-color: ${btn.actionBtn.backgroundColor};
    color: ${btn.actionBtn.color};
    box-shadow: ${btn.actionBtn.boxShadow};

    &:hover {
      background-color: ${btn.actionBtn.hover.backgroundColor};
    }
  `}
`
