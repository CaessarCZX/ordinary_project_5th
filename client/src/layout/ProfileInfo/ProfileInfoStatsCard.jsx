// import { LuUserCheck } from 'react-icons/lu'
import PropTypes from 'prop-types'
import { BsFilePost } from 'react-icons/bs'
import { LuUsers2 } from 'react-icons/lu'
import { RiUserFollowLine } from 'react-icons/ri'
import { useParams } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth.js'
import { useTheme } from '../../hooks/useTheme'
import { Div, DivFlex, Text, Title } from '../../styled components/Darth-theme'
import { StatsCardWrapper } from '../../styled components/Profile-theme'
import { TitleCase } from '../../utils/getStrings'
import { ManageFollowButtons } from './ManageFollowButtons.jsx'
import { ProfileInfoStatsCardItem } from './ProfileInfoStatsCardItem'

export function ProfileInfoStatsCard (
  {
    firstname,
    lastname,
    counterYourFollowers,
    counterFollowed,
    currentUser: user,
    isSelfUser,
    contentActivator
  }
) {
  // Theme
  const { isDark } = useTheme()
  // Redux
  const auth = useAuth()
  // User id
  const { id } = useParams()

  const fullName = `${firstname} ${lastname}`

  // Items
  const StatsItem = [
    {
      id: 'stats-item-your-followers',
      name: isSelfUser ? 'Te siguen' : 'Lo siguen',
      counter: counterYourFollowers,
      Icon: RiUserFollowLine,
      contentActivator,
      activeSpaceName: 'followers'
    },
    {
      id: 'stats-item-posts',
      name: 'Publicaciones',
      counter: '2',
      Icon: BsFilePost,
      contentActivator,
      activeSpaceName: 'post'
    },
    {
      id: 'stats-item-follow',
      name: isSelfUser ? 'Tus seguidos' : 'Sus seguidos',
      counter: counterFollowed,
      Icon: LuUsers2,
      contentActivator,
      activeSpaceName: 'followed'
    }
  ]

  return (
    <StatsCardWrapper
      $isDark={isDark}
      $padding='1.5rem'
    >
      <DivFlex $jBetween>

        <Div>
          <Text $isDark={isDark}>Bienvenido de nuevo!!</Text>
          <Title $small $isDark={isDark}>{TitleCase(fullName)}</Title>
        </Div>

        {/* TODO: check the issue with ._id property when page is reload and cache is cleaded */}
        <Div>
          {
            auth && auth.user?._id && auth.user._id !== id && <ManageFollowButtons currentUser={user} />
          }
        </Div>

      </DivFlex>
      <DivFlex $gap='1rem' $wrap $jBetween>
        {
          StatsItem.map(
            (item) => (
              <ProfileInfoStatsCardItem
                key={item.id}
                name={item.name}
                counter={item.counter}
                icon={item.Icon}
                functionActivation={item.contentActivator}
                activeSpaceName={item?.activeSpaceName}
              />
            )
          )
        }
      </DivFlex>
    </StatsCardWrapper>
  )
}

ProfileInfoStatsCard.propTypes = {
  firstname: PropTypes.string.isRequired,
  lastname: PropTypes.string.isRequired,
  counterYourFollowers: PropTypes.string.isRequired,
  counterFollowed: PropTypes.string.isRequired,
  currentUser: PropTypes.object.isRequired,
  isSelfUser: PropTypes.bool.isRequired,
  contentActivator: PropTypes.func.isRequired
}
