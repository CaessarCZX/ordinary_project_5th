import styled from 'styled-components'
import { Div } from './Darth-theme'

export const HomeContainerInfoWrapper = styled(Div)`
  width: 80vw;
  margin:14vh auto 0;
  position: relative;

  @media screen and (width < 1030px){
    margin: 20vh auto 0;
  }
  
  @media screen and (width < 500px) {
    width: 100vw;
    min-width: 300px;
  }
`
export const HomeTitle = styled.div`
  position: absolute;
  top: -7vh;
  left: 0;

  @media screen and (width < 800px) {
    left: 17px;
  }
`
// Provistionaly page layout
// TODO: to create a new grid layout for future updates
export const HomeContainerGridLayout = styled.div`
  padding: 1rem;
  display: grid;
  grid-template-columns: minmax(300px, 500px);
  width: fit-content;
  gap: 1rem;
  margin: 0 auto;
`
