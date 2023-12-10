import styled, { css } from 'styled-components'

export const DropShadowOutset = styled.div`
  filter:drop-shadow(0);
  transition-property: filter;
  ${(props) => props.$timingFunc && css`transition-timing-function: ${props.$timingFunc};`}
  ${(props) => props.$duration && css`transition-duration: ${props.$duration};`}
  
  &:hover {
    filter:drop-shadow(-1px 0 4px rgb(70, 209, 237));
  }
`
