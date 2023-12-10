import { usePosts } from '../../hooks/usePosts.js'
import { useTheme } from '../../hooks/useTheme'
import { Subtitle, Text } from '../../styled components/Darth-theme'
import { RenderPosts } from './RenderPosts.jsx'

export function HomePosts () {
  // Theme
  const { isDark } = useTheme()

  // Redux
  const homePosts = usePosts()

  return (
    <>
      <Subtitle $isDark={isDark}>Feed</Subtitle>
      {
        homePosts && homePosts?.loading
          ? <Subtitle $medium $isDark>Cargando</Subtitle>
          : homePosts?.resuts === 0
            ? <Text $isDark={isDark}>No tienes post para ver.</Text>
            : <RenderPosts />
      }
    </>
  )
}
