import { Link } from 'react-router-dom'
import styled, { css, keyframes } from 'styled-components'
import { ContainerAside, PreventSelectionInMobile } from './Darth-theme'

// Feeling UX Components
const trasition = (props) => css`
  transition: ${(props)} 0.2s ease-in-out;
`
const fadeIn = keyframes`
  from {
    opacity: 0
  }
  to {
    opacity: 1
  }
`

// Tooltip for component
export const SideBarTooltip = styled.span`
  color: #fff;
  border-radius: 7px;
  font-size: 0.8752rem;
  padding: 0.4rem 0.7rem;
  background-color: #444857;
  position: absolute;
  transform: translate(77px, 0px);
  display: none;

  animation-duration: 0.2s;
  animation-name: ${fadeIn};
`

export const SideBarContainer = styled(ContainerAside)`
  display: flex;
  position: fixed;
  z-index: 7;
  flex-direction: column;
  left: 0;
  top: 0;
  height: 100vh;
  width: 68px;

  /* REMOVE INNER SHADOW FOR CONTAINER ASIDE */
  box-shadow: none;
  box-shadow:  0 0 0 1px rgba(255, 255, 255, 0.1);
  
  ${trasition('width')}
  ${PreventSelectionInMobile}
  
  ${(props) => props.$isOpen && css`
  width: 300px;
  `}

  /* Rsponsive Container behavior in mobile divices */
  @media screen and (width < 500px){
    left: initial;
    top: initial;
    bottom: 0;
    height: 68px;
    width: 100vw;
    flex-direction: row;
    justify-content: space-evenly;
  }
`

export const SideBarWrapActivateButton = styled.button`
  align-self: self-end;
  padding: 0.3rem 1.2rem;
  background-color: transparent;
  border: 0;
  cursor: pointer;
  ${trasition('background-color')}

  &:hover {
    background-color: rgba(168, 86, 247, 0.25);
  }
  
  /* Responve UX Button for mobile devices */
  @media screen and (width < 500px){
    display: none;

    /* For hidden Card Container */
    & + article {
      display: none;
    }
  }
`

export const SideBarActionItemButton = styled.button`
  text-decoration: none;
  background-color: transparent;
  border: none;
  color: inherit;
  padding: 0.9rem 1rem;
  width: 100%;
  position: relative;

  &:hover {

    /* Tooltip behavior */
    & + span {
      display: block;
    }
  }
`

export const SideBarWrapProfileImg = styled.picture`
  display: block;
  margin: 0 auto;
  max-width: 150px;
  max-height: 150px;
  overflow: hidden;
  border-radius: 50%;
    /* Responve UX Button for mobile devices */
  @media screen and (width < 500px){
    display: none;
  }
`

export const SideBarProfileImg = styled.img`
  width: 100%;
  transform: scale(1.1);
  object-fit: cover;
`

export const SideBarProfileData = styled.div`
  display: none;
  text-align: center;
  margin-top: 1.2rem;
  animation-duration: 2s;
  animation-name: ${fadeIn};

  ${(props) => props.$isOpen && css`
    display: block;
  `}
`

export const WrapLink = styled(Link)`
  text-decoration: none;
  color: inherit;
  padding: 0.9rem 1rem;
  width: 100%;
  position: relative;
  ${trasition('background-color')}
  ${PreventSelectionInMobile}

  &:hover {
    background-color: rgba(168, 86, 247, 0.25);

    /* Tooltip behavior */
    & + span {
      display: block;
    }
  }

  /* Responve UX Link for mobile devices */
  @media screen and (width < 500px){
    
    &:hover {
      background-color: transparent;
    }
    
    &:active {
      background-color: rgba(168, 86, 247, 0.25);
    }
  }
`

export const SideBarMenuItemCollapse = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  animation-duration: 2s;
  animation-name: ${fadeIn};

  ${(props) => props.$isOpen && css`
    flex-direction: row;
    gap: 1.5rem;
  `}
`

export const SideBarItemOpenFade = styled.div`
  animation-duration: 2s;
  animation-name: ${fadeIn};
`
