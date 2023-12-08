import { FaPlugCircleXmark } from 'react-icons/fa6'
import { CenterAbosolute, DivFlex, Text, Title } from '../styled components/Darth-theme'
import { LoaderSpace } from '../styled components/Loader-theme'

export default function BadConnection () {
  return (
    <LoaderSpace>
      <CenterAbosolute>
        <DivFlex $col $aiCenter>
          <FaPlugCircleXmark size='4rem' color='#d7dde7' />
          <Title $isDark $small>No tienes conexión</Title>
          <Text $isDark>Intenta recargar la página de nuevo.</Text>
        </DivFlex>
      </CenterAbosolute>
    </LoaderSpace>
  )
}
