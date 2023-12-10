import { useTheme } from '../hooks/useTheme.js'
import { LogoPage } from '../layout/Logo/LogoPage.jsx'
import { LinkS } from '../styled components/Darth-theme-Router-Links.js'
import {
  Article,
  CenterAbosolute,
  ContainerArticle,
  DivFlex,
  HugeTitle,
  LateralAbsolute,
  Page,
  SpacerContainer,
  Text,
  Title
} from '../styled components/Darth-theme.js'

export function NotFound () {
  const { isDark } = useTheme()

  return (
    <Page $height='100vh'>
      <SpacerContainer $isDark={isDark}>
        <LateralAbsolute>
          <LogoPage />
        </LateralAbsolute>
        <CenterAbosolute $maxWidth='500px'>
          <Article $txtCenter>
            <ContainerArticle $isDark={isDark} $enableRadius>
              <HugeTitle $isDark={isDark}>404</HugeTitle>
            </ContainerArticle>
            <Title $isDark={isDark}>Not Found</Title>
            <Text $isDark={isDark}>La página que intentas buscar no existe</Text>
            <DivFlex $gap='0.3rem' $jCenter $margin='1.2rem 0 0'>
              <Text $medium $isDark={isDark}>Haz click </Text>
              <LinkS to='/' $medium $action>aquí</LinkS>
              <Text $medium $isDark={isDark}>para regresar al</Text>
              <LinkS to='/' $medium $action>Home</LinkS>
            </DivFlex>
          </Article>
        </CenterAbosolute>
      </SpacerContainer>
    </Page>
  )
}
