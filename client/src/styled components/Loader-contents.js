import styled, { keyframes } from 'styled-components'
import { DivFlex } from './Darth-theme'

const swept = keyframes`
0% {
    background-position: -400px 0;
  }

  100% {
    background-position: 400px 0;
  }
`

export const LoaderSense = styled(DivFlex)`
  overflow: hidden;
  position: relative;
  background: #3a3a3a;
  background-image: linear-gradient(to right, #3a3a3a 0%, #3f3f3f 10%, #4a4a4a 20%, #3f3f3f 30%, #3a3a3a 50%, #3a3a3a 100%);
  background-repeat: no-repeat;
  background-size: 800px 200px;
  animation-duration: 1s;
  animation-fill-mode: forwards;
  animation-iteration-count: infinite;
  animation-name: ${swept};
  animation-timing-function: ease-in-out;
  -webkit-animation-duration: 1s;
  -webkit-animation-fill-mode: forwards;
  -webkit-animation-iteration-count: infinite;
  -webkit-animation-name: ${swept};
  -webkit-animation-timing-function: ease-in-out;
`

export const LoaderText = styled(LoaderSense)`
  border-radius: 9px;
`
