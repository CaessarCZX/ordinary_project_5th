import PropTypes from 'prop-types'
import { useEffect, useState } from 'react'
import { useAuth } from '../../hooks/useAuth.js'
import { useTheme } from '../../hooks/useTheme'
import { ContainerArticle } from '../../styled components/Darth-theme'
import { PostBody } from './PostBody.jsx'
import { PostFooter } from './PostFooter.jsx'
import { PostHeader } from './PostHeader.jsx'

export function Post ({ postContent }) {
  // Theme
  const { isDark } = useTheme()

  // Redux
  const auth = useAuth()

  // Destructuring post
  const ownerPost = postContent.user
  const lastModification = postContent.updatedAt
  const content = postContent.content
  const postImages = postContent.images
  const { likes, comments } = postContent

  // Check if post owner is self auth user
  const [isSelfUser, setIsSelfUser] = useState(false)
  useEffect(
    () => {
      if (auth && auth.user && ownerPost._id === auth.user._id) {
        setIsSelfUser(true)
      }
    }, [auth, ownerPost._id]
  )
  return (
    <ContainerArticle
      $isDark={isDark}
      $borderRadius='1.25rem'
      $padding='1rem 0'
      $width='100%'
    >

      <PostHeader
        theme={isDark}
        firstname={ownerPost.firstname}
        lastname={ownerPost.lastname}
        avatar={ownerPost.avatar}
        lastMondification={lastModification}
        _id={ownerPost._id}
        isSelfUser={isSelfUser}
        postInfo={postContent}
      />

      <PostBody
        theme={isDark}
        content={content}
        images={postImages}
      />

      <PostFooter
        theme={isDark}
        likes={likes}
        comments={comments}
        postInfo={postContent}
      />

    </ContainerArticle>
  )
}

Post.propTypes = {
  postContent: PropTypes.object.isRequired
}
