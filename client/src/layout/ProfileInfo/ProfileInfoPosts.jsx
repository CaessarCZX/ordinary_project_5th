import PropTypes from 'prop-types'
import { useTheme } from '../../hooks/useTheme'
import { DivFlex, Subtitle } from '../../styled components/Darth-theme'
import { PostBuilder } from '../PostBuilder/PostBuilder'

export function ProfileInfoPosts ({ isSelfUser, userData }) {
  // Theme
  const { isDark } = useTheme()
  const currentUser = userData[0]
  return (
    <>
      <DivFlex $col $gap='1.5rem' $width='100%'>
        {
          isSelfUser && (
            <>
              <Subtitle $isDark={isDark}>Crea un nuevo post</Subtitle>
              <PostBuilder />
            </>
          )
        }
        <Subtitle $isDark={isDark}>{isSelfUser ? 'Tus posts' : `Los Posts de ${currentUser.username}`}</Subtitle>
        <DivFlex $col $gap='1.5rem' />
      </DivFlex>
    </>
  )
}

ProfileInfoPosts.propTypes = {
  isSelfUser: PropTypes.bool.isRequired,
  userData: PropTypes.array.isRequired
}
