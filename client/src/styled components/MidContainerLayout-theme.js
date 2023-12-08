import styled from 'styled-components'
import { Div } from './Darth-theme'

export const MidContainerWrap = styled(Div)`
  padding-top: 14vh;
  margin: 0 auto;
  width: 70vw;
  max-width: 700px;
  min-width: 300px;
  overflow: hidden;
  background-color: darkgray;

  @media screen and (width < 500px){
    width: 97vw;
    background-color: red;
  }
`
