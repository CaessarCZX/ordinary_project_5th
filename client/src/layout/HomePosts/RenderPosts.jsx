import { usePosts } from '../../hooks/usePosts.js'
import { Post } from '../Post/Post.jsx'

export function RenderPosts () {
  // Get post from state
  const homePost = usePosts()
  return (
    <>
      {
        homePost && homePost?.posts.length > 0 && homePost.posts.map(post => (
          <Post postContent={post} key={post._id} />
        ))
      }
      <p>post</p>
    </>
  )
}
