import styled from 'styled-components'
import {
  DARTH_THEME_DARK_MODE as dark,
  DARTH_THEME_LIGHT_MODE as light
} from '../styled components/Darth-theme.var'

export const ToastWrapp = styled.article`
  display: flex;
  flex-direction: column;
  position: fixed;
  right: 0;
  z-index: 12;
  width: 50vw;
  max-width: 270px;
  min-height: 97px;
  background-color: ${(props) => (props.$isDark ? dark.backgroundPrimary : light.backgroundPrimary)};
  overflow: hidden;
  border-radius: 1rem;
  padding: 1rem 1.2rem;
  margin: 1rem 1rem 0 0;
  border: solid 1.3px #a855f7;
`
export const ToastHeader = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  overflow: hidden;
  max-height: 20px;
`
export const ToastCloseBtn = styled.button`
  background-color: transparent;
  border: none;
  font-size: 25px;
  font-weight: 500;
  cursor: pointer;
  color: ${(props) => (props.$isDark ? dark.choosenElement : '#000000')};
`
export const ToastBody = styled.main`
  padding-top: 0.7rem;
  max-height: 80px;
  overflow: hidden;
`
