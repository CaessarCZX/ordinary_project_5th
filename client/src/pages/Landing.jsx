import { ToggleSliderTheme } from '../components/ToggleSliderTheme.jsx'
import { useLoginRedirect } from '../hooks/useLoginRedirect.js'
// import { useLoginRedirect } from '../hooks/useLoginRedirect.js'
import { useTheme } from '../hooks/useTheme.js'
import { LogoPage } from '../layout/Logo/LogoPage.jsx'
import { ButtonLink } from '../styled components/Darth-theme-Router-Links.js'
import {
  Div,
  Footer,
  HeaderFlex,
  ItemFlex,
  MainTitle,
  Page,
  SectionMain,
  Text,
  UlFlex
} from '../styled components/Darth-theme.js'

export function Landing () {
  // Theme
  const { isDark } = useTheme()

  // Redirect if user is autenticated
  useLoginRedirect()

  return (
    <>
      <Page $enableBg $isDark={isDark}>
        <HeaderFlex $padding='1rem' $jBetween>
          <picture>
            <LogoPage />
          </picture>
          <UlFlex $gap='1rem' $aiCenter $wrap>
            <ItemFlex $margin='0 1rem 0 0'>
              <ToggleSliderTheme id='theme-selector' />
            </ItemFlex>
          </UlFlex>
        </HeaderFlex>
        <main>
          <SectionMain $height='85vh'>
            <Div $maxWidth='700px' $contCenter $txtCenter $padding='17vh 0'>
              <MainTitle $isDark={isDark}>Conecta con los tuyos</MainTitle>
              <Text $isDark={isDark}>Unete a la resistencia, crea amistades y crece dentro de nuestra red</Text>
              <UlFlex $contCenter $padding='3rem 0 0' $maxWidth='300px'>
                <ButtonLink to='/register' $isDark={isDark}>Regístrate</ButtonLink>
                <ButtonLink to='/login' $action $margin='0 0 0 1rem' $isDark={isDark}>Inicia sesión</ButtonLink>
              </UlFlex>
            </Div>
          </SectionMain>
        </main>
      </Page>
      <Footer>
        <SectionMain>
          <ul>
            <li>Hola</li>
            <li>Como</li>
          </ul>
        </SectionMain>
      </Footer>
    </>
  )
}
