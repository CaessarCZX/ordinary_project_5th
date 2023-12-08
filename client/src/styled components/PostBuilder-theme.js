import styled from 'styled-components'
import { fadeIn, PickRight } from './Animation-containers.js'
import { ContainerArticle } from './Darth-theme'

export const PostBuilderWrap = styled(ContainerArticle)`
  border-radius: 17px;
`
export const PostBuilderTextArea = styled.textarea`
  border: 0;
  resize: none;
  outline: none;
  width: 100%;
  font-family: inherit;
  font-size: 0.872rem;
  background-color: transparent;
  color: ${(props) => props.$isDark ? '#fff' : '#000'};
  position: relative;
`

export const PostBuilderCounterTextArea = styled.div`
  position: absolute;
  bottom: -8px;
  right: -19px;
`

export const PostBuilderUploadImageWrap = styled.span`
  display: block;

  /* For input type 'file' */
  & > input {
    display: none;
  }
`

export const PostBuilderDiscartBtn = styled.button`
  border: 0;
  padding: 0.3rem 1rem;
  border-radius: 100vh;
  box-shadow: inset 0 1px 0 0 rgba(219, 19, 59, 0.3),
  inset 0 0 0 1px rgba(219, 19, 59, 0.3);
  background-color: #8f0d27;
  transition: background-color 0.5s ease-out;
  animation-duration: 0.2s;
  animation-name: ${fadeIn};
  
  &:hover {
    background-color: rgb(181, 16, 49);
  }

  /* For 'RotableItem' component by Animation-containers */
  &:hover > div > article {
    transform: rotate(180deg);
  }
`

export const PostBuilderPostBtn = styled.button`
  
  border: 0;
  overflow: hidden;
  padding: 0.3rem 1rem;
  border-radius: 100vh;
  box-shadow: inset 0 1px 3px 2px rgba(77, 34, 101, 0.3),
  inset 2px 1px 9px 1px rgba(77, 34, 101, 0.3);
  background-color: #62229d;
  transition: background-color 0.5s ease-out;

  &:hover {
    background-color: #792ac3;
  }

  /* For 'RotableItem' component by Animation-containers */
  &:hover > div > article {
    animation-duration: 0.7s;
    animation-name: ${PickRight};
  }
`

export const PostBuilderAvatarWrap = styled.picture`
  display: block;
  overflow: hidden;
  max-width: 42px;
  border-radius: 50%;
  border: solid 1px #fff;
`

export const PostBuilderAvatarImg = styled.img`
  width: 100%;
  object-fit: cover;
  scale: 1.4;
  transform: translateY(1px);
`
export const PostBuilderDeleteImageBtn = styled.button`
  border: 0;
  color: #fff;
  font-weight: 700;
  font-family: inherit;
  font-size: 0.7rem;
  padding: 0.1rem 0.5rem;
  border-radius: 100vh;
  background-color: #8f0d27;
`
