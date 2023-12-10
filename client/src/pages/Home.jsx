import { useTheme } from '../hooks/useTheme.js'
import { HomePosts } from '../layout/HomePosts/HomePosts.jsx'
import { PostBuilder } from '../layout/PostBuilder/PostBuilder.jsx'
import { DivFlex, Page, Subtitle, Title } from '../styled components/Darth-theme.js'
import {
  HomeContainerGridLayout,
  HomeContainerInfoWrapper,
  HomeTitle
} from '../styled components/Home-thme.js'

export function Home () {
  // Theme
  const { isDark } = useTheme()

  return (
    <Page
      $isDark={isDark}
      $absolute
      $enableBg
    >
      <HomeContainerInfoWrapper>
        <HomeTitle>
          <Title $medium $isDark={isDark}>Publicaciones</Title>
        </HomeTitle>

        <HomeContainerGridLayout>
          <DivFlex $gap='1rem' $col $margin='1.5rem 0 0'>
            <Subtitle $isDark={isDark}>Crea un nuevo post.</Subtitle>
            <PostBuilder />
          </DivFlex>

          <HomePosts />
        </HomeContainerGridLayout>

      </HomeContainerInfoWrapper>
    </Page>
  )
}
