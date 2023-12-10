import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useParams } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { useProfile } from '../../hooks/useProfile.js'
import { useTheme } from '../../hooks/useTheme.js'
import { getProfileUsers } from '../../redux/actions/profileActions.js'
import { Title } from '../../styled components/Darth-theme.js'
import {
  ProfileContainerGridLayout,
  ProfileContainerInfoWrapper, ProfileMainContainer, ProfileTitle
} from '../../styled components/Profile-theme'
import { ProfileInfoFollowed } from './ProfileInfoFollowed.jsx'
import { ProfileInfoFollowers } from './ProfileInfoFollowers.jsx'
import { ProfileInfoMiniCard } from './ProfileInfoMiniCard.jsx'
import { ProfileInfoPosts } from './ProfileInfoPosts.jsx'
import { ProfileInfoStatsCard } from './ProfileInfoStatsCard.jsx'

/*
  Development note.
  TODO: Change the profile state to prevent duplicity
*/

export function ProfileInfo () {
  // Theme
  const { isDark } = useTheme()

  // Redux
  const auth = useAuth()
  const profile = useProfile()
  const dispatch = useDispatch()

  // to fetch user info
  const { id } = useParams()

  // user profile data
  const [userData, setUserData] = useState([])
  const [isSelfUser, setIsSelfUser] = useState(false)

  // get user data
  useEffect(
    () => {
      if (auth && auth.user && id === auth.user._id) {
        setUserData([auth.user])
        setIsSelfUser(true)
      } else {
        dispatch(
          getProfileUsers({
            users: profile.users,
            id,
            auth
          })
        )

        const newData = profile.users.filter(
          (user) => user._id === id)

        if (newData[0]?._id !== auth.user?._id) {
          setUserData(newData) // It's already an array
          setIsSelfUser(false)
        }
      }
    }, [id, auth, dispatch, profile.users]
  )

  // Type of content
  const [showFollowers, setShowFollowers] = useState(false)
  const [showFollowed, setShowFollowed] = useState(false)
  const [showPosts, setShowPosts] = useState(true)

  const handleSetContent = (key) => {
    const changeSet = {
      followers: [true, false, false],
      followed: [false, true, false],
      post: [false, false, true]
    }

    setShowFollowers(changeSet[key][0])
    setShowFollowed(changeSet[key][1])
    setShowPosts(changeSet[key][2])
  }

  // Reestart the profile content
  const checkIDcurrentData = userData[0]?._id
  useEffect(
    () => {
      handleSetContent('post')
    }, [checkIDcurrentData]
  )

  return (
    <ProfileContainerInfoWrapper>
      <ProfileTitle>
        <Title $small $isDark={isDark}>Mi perfil</Title>
      </ProfileTitle>
      {
        userData.length > 0 && userData.map(
          (user) => (
            <ProfileContainerGridLayout
              key={user._id}
            >
              <ProfileInfoStatsCard
                currentUser={user}
                isSelfUser={isSelfUser}
                firstname={user.firstname}
                lastname={user.lastname}
                counterYourFollowers={`${user.friends.length}`}
                counterFollowed={`${user.following.length}`}
                contentActivator={handleSetContent}
              />
              <ProfileInfoMiniCard
                story={user.story}
                username={user.username}
                avatar={user.avatar}
                gender={user.gender}
                email={user.email}
                phone={user.phone}
                website={user.website}
                id={id}
              />
              <ProfileMainContainer
                $width='100%'
                $minHeight='300px'
                $padding='1rem'
              >
                {
                  showPosts && <ProfileInfoPosts isSelfUser={isSelfUser} userData={userData} auth={auth} />
                }
                {
                  showFollowers && <ProfileInfoFollowers isSelfUser={isSelfUser} userData={userData} auth={auth} />
                }
                {
                  showFollowed && <ProfileInfoFollowed isSelfUser={isSelfUser} userData={userData} auth={auth} />
                }
              </ProfileMainContainer>
            </ProfileContainerGridLayout>
          )
        )
      }
    </ProfileContainerInfoWrapper>
  )
}
