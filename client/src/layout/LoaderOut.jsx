import { IoMdUnlock } from 'react-icons/io'
import { CenterAbosolute, DivFlex, Text, Title } from '../styled components/Darth-theme'
import { LoaderSpace } from '../styled components/Loader-theme'

export default function LoaderOut () {
  return (
    <LoaderSpace $black>
      <CenterAbosolute>
        <DivFlex $col $aiCenter>
          <IoMdUnlock size='4rem' color='#d7dde7' />
          <Title $isDark $small>Cerrando sesión</Title>
          <Text $isDark>Esta saliendo de la aplicación de forma segura.</Text>
        </DivFlex>
      </CenterAbosolute>
    </LoaderSpace>
  )
}
