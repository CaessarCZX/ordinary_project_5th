import { useTheme } from '../hooks/useTheme.js'
import { Div, DivFlex, Page, Title } from '../styled components/Darth-theme.js'

import examplePostImg1 from '../assets/examplePostImg1.jpg'
import { Post } from '../layout/Post/Post.jsx'

const ExamplePost = [
  {
    firstname: 'Raul Esteban',
    lastname: 'Valencia Marquez',
    date: '15 nov 2023',
    avatar: '',
    postBody: 'De camino al Oxxo que me toman esta',
    postImg: examplePostImg1
  },
  {
    firstname: 'Jose',
    lastname: 'Gomez Pitalua',
    date: '15 nov 2023',
    avatar: '',
    postBody: 'Jaja el otro vato robo mi foto xd',
    postImg: examplePostImg1
  }
]

export function Home () {
  // Theme
  const { isDark } = useTheme()

  return (
    <Page
      $isDark={isDark}
      $absolute
      $enableBg
    >
      <Div $padding='14vh 0 0' $margin='0 auto' $maxWidth='700px'>
        <Title $medium $isDark={isDark}>Publicaciones</Title>
        <DivFlex $col $aiCenter $gap='1.5rem' $padding='0 1rem'>
          {
            ExamplePost.map(
              (post) => (
                <Post
                  key={post.firstname}
                  firstname={post.firstname}
                  lastname={post.lastname}
                  date={post.date}
                  avatar={post.avatar}
                  postBody={post.postBody}
                  postImg={post.postImg}
                />
              )
            )
          }
        </DivFlex>
      </Div>
    </Page>
  )
}
