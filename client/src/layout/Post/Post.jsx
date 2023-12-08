import PropTypes from 'prop-types'
import { IoMdHeartEmpty } from 'react-icons/io'
import { IoShareSocialOutline } from 'react-icons/io5'
import { TbMessageCircle } from 'react-icons/tb'
import defaultUserImg from '../../assets/defaultUserImg.svg'
import { IconContext } from '../../components/IconContext'
import { useTheme } from '../../hooks/useTheme'
import { ContainerArticle, DivFlex, SmallText, Subtitle, Text } from '../../styled components/Darth-theme'
import { TitleCase } from '../../utils/getStrings'
import { undefinedToBoolean } from '../../utils/getValues'

export function Post ({
  firstname,
  lastname,
  date,
  avatar,
  postBody,
  postImg
}) {
  // Theme
  const { isDark } = useTheme()

  // Normalize and verify
  const isImg = undefinedToBoolean(postImg)
  const fullname = TitleCase(`${firstname} ${lastname}`)

  return (
    <ContainerArticle
      $overHidden
      $isDark
      $borderRadius='1.25rem'
      $padding='1rem 0'
      $height={isImg ? '700px' : '250px'}
      $width='100vw'
      $maxWidth='700px'
    >

      <DivFlex $margin='0 1rem'>
        <div>
          <img src={defaultUserImg || avatar} style={{ maxWidth: '70px' }} alt='image' />
        </div>
        <DivFlex $col $jCenter $margin='0 0 0 0.5rem'>
          <Subtitle $isDark={isDark}>{fullname}</Subtitle>
          <SmallText $isDark={isDark}>{date}</SmallText>
        </DivFlex>
      </DivFlex>

      {
        isImg && (
          <DivFlex $margin='0.5rem 0 0' $height='450px'>
            <img src={postImg} style={{ width: '100%', objectFit: 'cover' }} alt='image' />
          </DivFlex>)
      }

      <DivFlex
        $overHidden
        $padding='1.5rem'
        $height='7rem'
        $maxHeight='7rem'
        $col
      >
        <Text style={{ display: '-webkit-box', WebkitLineClamp: '2', WebkitBoxOrient: 'vertical', overflow: 'hidden', textOverflow: 'ellipsis' }} $medium $isDark={isDark}>
          {postBody || ''}
        </Text>
      </DivFlex>

      <DivFlex
        $padding='0 1.5rem'
        $gap='1rem'
        $height='35px'
      >
        <IconContext size='1.7rem' icon={IoMdHeartEmpty} />
        <IconContext size='1.7rem' icon={IoShareSocialOutline} />
        <IconContext size='1.7rem' icon={TbMessageCircle} />
      </DivFlex>

    </ContainerArticle>
  )
}

Post.propTypes = {
  firstname: PropTypes.string,
  lastname: PropTypes.string,
  date: PropTypes.string,
  avatar: PropTypes.string,
  postBody: PropTypes.string,
  postImg: PropTypes.any
}
