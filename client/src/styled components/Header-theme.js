import styled, { css } from 'styled-components'
import { Div, HeaderFlex, Input } from './Darth-theme'

export const HeaderContainerWrapper = styled(HeaderFlex)`
  position: absolute;
  right: 0;
  z-index: 7;
`

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

// Header Search bar results
export const SearchResultsWrapper = styled(Div)`
  position: absolute;
  z-index: -1;
  top: 0;
  left: 0;
  right: 0;
  background-color: #26222b;
  padding: 3.5rem 0.5rem 0.5rem;
  border-radius: 18px;
`

export const SearchResultsItemAvatarWrap = styled.picture`
  display: block;
  overflow: hidden;
  max-width: 57px;
  border-radius: 50%;
`
export const SearchResultsItemAvatarImg = styled.img`
  width: 100%;
  object-fit: cover;
  scale: 1.1;
`
