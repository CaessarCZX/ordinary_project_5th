import styled, { css, keyframes } from 'styled-components'

// For tr insider elements
export const TransitionInsiderItem = styled.article`
  display: grid;
  ${(props) => props.$property && css`transition-property: ${props.$property};`}
  ${(props) => props.$timingFunc && css`transition-timing-function: ${props.$timingFunc};`}
  ${(props) => props.$duration && css`transition-duration: ${props.$duration};`}
`
export const AnimationInsiderItem = styled.article`
  display: grid;
  ${(props) => props.$property && css`transition-property: ${props.$property};`}
  ${(props) => props.$timingFunc && css`transition-timing-function: ${props.$timingFunc};`}
  ${(props) => props.$duration && css`transition-duration: ${props.$duration};`}
`

// Rotable item for insider elements
export const RotableItem = styled.article`
  display: grid;
  transition: transform 1s ease;
`

// self rotable item
export const RotableItemSelf = styled.article`
  display: grid;
  transition-property: transform;
  ${(props) => props.$timingFunc && css`transition-timing-function: ${props.$timingFunc};`}
  ${(props) => props.$duration && css`transition-duration: ${props.$duration};`}
  
  &:hover {
    ${(props) => props.$angle && css`transform: rotate(${props.$angle});`}
  }
`

export const JumpItem = styled.article`
  display: grid;
  transition-property: transform;
  ${(props) => props.$timingFunc && css`transition-timing-function: ${props.$timingFunc};`}
  ${(props) => props.$duration && css`transition-duration: ${props.$duration};`}
  
  &:hover {
    transform: scale(1.1);
  }
`

export const trasition = (props) => css`
  transition: ${(props)} 0.2s ease-in-out;
`
export const fadeIn = keyframes`
  from {
    opacity: 0
  }
  to {
    opacity: 1
  }
`

export const PickRight = keyframes`
  0%, 100% {
    transform: translateX(0);
  }
  50% {
    transform: translateX(5px);
  }
`
