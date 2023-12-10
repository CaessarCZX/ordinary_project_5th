import PropTypes from 'prop-types'
import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useAuth } from '../../hooks/useAuth.js'
import { likePosts, unlikePosts } from '../../redux/actions/postActions.js'
import { DivFlex, MicroSubtitle } from '../../styled components/Darth-theme'
import { LikePost } from './LikePost.jsx'

export function PostFooter ({ theme: isDark, likes, comments, postInfo }) {
  const dispatch = useDispatch()
  const auth = useAuth()

  const [isLike, setIsLike] = useState(false)
  const [isLoad, setIsLoad] = useState(false)

  const handleLike = async () => {
    if (isLoad) return
    setIsLike(true)
    setIsLoad(true)
    dispatch(likePosts({ postInfo, auth }))
    setIsLoad(false)
  }
  const handleUnlike = async () => {
    if (isLoad) return
    setIsLike(false)
    setIsLoad(true)
    dispatch(unlikePosts({ postInfo, auth }))
    setIsLoad(false)
  }

  return (
    <DivFlex
      $padding='0 1.5rem'
      $gap='1rem'
      $height='35px'
    >
      <DivFlex $gap='0.3rem'>
        <LikePost stateLike={isLike} likeFunc={handleLike} unlikeFunc={handleUnlike} />
        <MicroSubtitle $isDark={isDark}>{likes.length}</MicroSubtitle>
      </DivFlex>
      {/* <IconContext size='1.7rem' icon={IoShareSocialOutline} /> */}
      {/* <DivFlex $gap='0.3rem'>
        <DropShadowOutset>
          <IconContext size='1.7rem' icon={TbMessageCircle} />
        </DropShadowOutset>
        <MicroSubtitle $isDark={isDark}>{comments.length}</MicroSubtitle>
      </DivFlex> */}
    </DivFlex>
  )
}

PostFooter.propTypes = {
  theme: PropTypes.bool.isRequired,
  likes: PropTypes.array.isRequired,
  comments: PropTypes.array.isRequired,
  postInfo: PropTypes.object.isRequired
}
