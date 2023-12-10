import styled from 'styled-components'
import { fadeIn } from '../styled components/Animation-containers.js'
import { Div } from './Darth-theme'

export const PostCardAvatarWrap = styled.picture`
  display: block;
  overflow: hidden;
  max-width: 50px;
  border-radius: 50%;
`
export const PostCardAvatarImg = styled.img`
  width: 100%;
  object-fit: cover;
  scale: 1.4;
  transform: translateY(1px);
`

export const PostCardDropdownWrap = styled(Div)`
      position: absolute;
    z-index: 4;
    top: 32px;
    left: -50px;
    background-color: #26222b;
    padding-block: 0.3rem;
    border-radius: 9px;
    display: flex;
    flex-direction: column;
    animation-duration: 0.2s;
  animation-name: ${fadeIn};
`

export const PostCardDropdownCloseBtn = styled.button`
  border: 0;
  position: relative;
`

export const PostCardDropdownOpcion = styled.p`
  color: #f0f0f0;
  font-size: 0.872rem;
  padding: 0.2rem 0.7rem;
  cursor: pointer;

  &:hover {
    background-color: rgba(255, 255, 255, 0.07);
  }
`
