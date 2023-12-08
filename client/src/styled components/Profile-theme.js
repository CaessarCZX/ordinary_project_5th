import styled, { css } from 'styled-components'
import { ContainerArticle, Div, DivFlex } from './Darth-theme'
import { DefaultLink } from './Darth-theme-Router-Links'

export const ProfileContainerInfoWrapper = styled(Div)`
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

export const ProfileTitle = styled.div`
  position: absolute;
  top: -7vh;
  left: 0;

  @media screen and (width < 800px) {
    left: 17px;
  }
`
// For profileLayout

export const ProfileContainerGridLayout = styled.div`
  padding: 1rem;
  display: grid;
  grid-template-columns: 1fr minmax(150px, 300px); 
  grid-template-rows: auto;
  grid-template-areas: 
    "info card "
    "content card";
  gap: 1rem;

  @media screen and (width < 1000px){
    grid-template-columns: 1fr; 
    grid-template-areas:
      "info"
      "card"
      "content";
  }
`

// For mini card
export const MiniCardWrap = styled(ContainerArticle)`
  border-radius: 25px;
  max-height: 567px;

  /* Layout Position */
  grid-area: card;
`

export const ProfileAvatarWrap = styled.picture`
display: block;
overflow: hidden;
border-radius: 50%;
max-width: 150px;
max-height: 150px;
margin: 0 auto;

  ${(props) => props.$large && css`
    max-width: 200px;
    max-height: 200px;
  `}
`

// Avatar
export const AvatarImg = styled.img`
  width: 100%;
  transform: scale(1.2);
  object-fit: cover;
`

// For stats card
export const StatsCardWrapper = styled(ContainerArticle)`
  width: 100%;
  border-radius: 25px;

  /* Layout Position */
  grid-area: info;
`

export const StatsCardItem = styled(ContainerArticle)`
  border-radius: 15px;
  flex: 1;
  max-width: 177px;
  padding: 0.5rem 1rem;
  transition: box-shadow 0.2s ease-out;

  &:hover {
    box-shadow: inset 0 1px 0 0 rgba(168, 85, 247, 0.3),
    inset 0 0 0 1px rgba(168, 85, 247, 0.3);
  }
`

// Buttons => ADD FRIEND
export const AddFriendButton = styled(StatsCardItem)`
  cursor: pointer;
  border-radius: 100vh;
  box-shadow: inset 0 1px 0 0 rgba(168, 85, 247, 0.3),
  inset 0 0 0 1px rgba(168, 85, 247, 0.3);
  transition: background-color 0.14s ease-out; 
  
  &:hover {
    background-color: rgba(168, 85, 247, 0.2) ;
  }
  `
// Buttons => REMOVE FRIEND
export const RemoveFriendButton = styled(StatsCardItem)`
  cursor: pointer;
  border-radius: 100vh;
  box-shadow: inset 0 1px 0 0 rgba(209, 64, 71, 0.3),
  inset 0 0 0 1px rgba(209, 64, 71, 0.3);
  transition: background-color 0.14s ease-out; 
  
  &:hover {
    background-color: rgba(209, 64, 71, 0.2) ;
  }
`

// EditProfile
export const EditStatsCardWrapper = styled(ContainerArticle)`
  width: 100%;
  border-radius: 25px;
  display: flex;
  flex-wrap: wrap;
`

export const EditStatsSection = styled(Div)`
  flex: 1;
  min-width: 390px;
`

export const EditStatsItem = styled(ContainerArticle)`
  border-radius: 15px;
  flex: 1;
  padding: 0.5rem 1.3rem;
`

export const ProfileEditAvatarWrap = styled(ProfileAvatarWrap)`
  position: relative;
  width: 200px;
  height: 200px;
  
    &:hover > span {
      opacity: 1;
    }
`

export const UploadInputForAvatarWrap = styled.span`
  display: block;
  position: absolute;
  text-align: center;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: rgba(0, 0, 0, 0.57);
  padding: 0.7rem;
  border-radius: 14px;
  width: 90px;
  opacity: 0;
  
  /* For input type 'file' */
  & > input {
    display: none;
  }
  
`

export const UploadInputForAvatarLabel = styled.p`
  font-size: 0.67rem;
  font-weight: 700;
  color: #cbd2de;
`

// Main container
export const ProfileMainContainer = styled(DivFlex)`
    /* Layout Position */
    grid-area: content;
`
// For WOLLOWER CARDS
export const FollowerCardWrapper = styled(DivFlex)`
  background-image: linear-gradient(110.1deg,rgba(46,29,99,.4),#3d0f34);
`
export const FollowerCardAvatarWrap = styled.picture`
  display: block;
  overflow: hidden;
  max-width: 50px;
  border-radius: 50%;
  border: solid 3px purple;
`
export const FollowerCardAvatarImg = styled.img`
  width: 100%;
  object-fit: cover;
  scale: 1.4;
  transform: translateY(1px);
`

export const FollowerCardProfileAccessBtn = styled(DefaultLink)`
  padding: 0.3rem 1rem;
  border-radius: 100vh;
  box-shadow: inset 0 1px 0 0 rgba(255, 255, 255, 0.4),
  inset 0 0 0 1px rgba(255, 255, 255, 0.4);

  /* For 'RotableItem' component by Animation-containers */
  &:hover > div > article {
    transform: rotate(90deg);
  }

  /* TODO: Enable mobile propertys */
`

export const FollowerCardAddFriendBtnWrap = styled.button`
  border: 0;
  padding: 0.3rem 1rem;
  border-radius: 100vh;
  box-shadow: inset 0 1px 0 0 rgba(75, 173, 128, 0.3),
  inset 0 0 0 1px rgba(75, 173, 128, 0.3);
  background-color: #2b6148;

  /* For 'RotableItem' component by Animation-containers */
  &:hover > div > article {
    transform: rotate(-180deg);
  }

  /* TODO: Enable mobile propertys */
`

export const FollowerCardRemoveFriendBtnWrap = styled.button`
  border: 0;
  padding: 0.3rem 1rem;
  border-radius: 100vh;
  box-shadow: inset 0 1px 0 0 rgba(219, 19, 59, 0.3),
  inset 0 0 0 1px rgba(219, 19, 59, 0.3);
  background-color: #8f0d27;

  /* For 'RotableItem' component by Animation-containers */
  &:hover > div > article {
    transform: rotate(-180deg);
  }

  /* TODO: Enable mobile propertys */
`
