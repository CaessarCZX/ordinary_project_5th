import { useSelector } from 'react-redux'

export const usePosts = () => {
  const homePosts = useSelector(state => state.homePost)

  return homePosts
}
