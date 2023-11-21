import styled, { css } from 'styled-components'
import { Input } from './Darth-theme'

export const HeaderSearchBar = styled(Input)`
  border-radius: 100vh;
  padding-left: 3rem;
  padding-block: 10px;
  width: 60vw;
  max-width: 600px;
  letter-spacing: 1px;

  ${(props) => props.$isDark && css`
    background-color: rgba(255, 255, 245, 0.1);
  `}
`

export const SearchBarPositionInnnerIcon = styled.div`
  position: absolute;
  transform: translate(17px, 12px);
`

export const HeaderWrapButton = styled.button`
  background-color: transparent;
  border: none;
`
