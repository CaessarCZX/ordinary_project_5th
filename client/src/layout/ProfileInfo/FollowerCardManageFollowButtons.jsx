import PropTypes from 'prop-types'
import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useAuth } from '../../hooks/useAuth.js'
import { useProfile } from '../../hooks/useProfile.js'
import { Follow, Unfollow } from '../../redux/actions/profileActions.js'
import { FollowerCardFollowBtn } from './FollowerCardFollowBtn.jsx'
import { FollowerCardUnfollowBtn } from './FollowerCardUnfollowBtn.jsx'

export function FollowerCardManageFollowButtons ({ currentUser }) {
  // Redux
  const auth = useAuth()
  const profile = useProfile()
  const dispatch = useDispatch()

  const [isFriend, setIsFriend] = useState(false)

  // Check if they are a current friend
  useEffect(
    () => {
      if (auth.user.following.find(user => user._id === currentUser._id)) {
        setIsFriend(true)
      }
    }, [auth.user.following, currentUser._id]
  )

  const addFriend = () => {
    setIsFriend(true)
    dispatch(
      Follow({
        users: profile.users,
        currentUser,
        auth
      })
    )
  }

  const removeFriend = () => {
    setIsFriend(false)
    dispatch(
      Unfollow({
        users: profile.users,
        currentUser,
        auth
      })
    )
  }

  // Only change the component button
  return (
    <>
      {
        isFriend
          ? <FollowerCardUnfollowBtn removeAction={removeFriend} />
          : <FollowerCardFollowBtn addAction={addFriend} />
      }
    </>
  )
}

FollowerCardManageFollowButtons.propTypes = {
  currentUser: PropTypes.object.isRequired
}
