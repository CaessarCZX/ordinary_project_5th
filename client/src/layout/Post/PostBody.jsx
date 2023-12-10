import PropTypes from 'prop-types'
import { DivFlex, Text } from '../../styled components/Darth-theme'

export function PostBody ({ theme: isDark, content, images }) {
  const image = images[0]

  return (
    <>
      {
        image && (
          <DivFlex $margin='0.5rem 0 0' $height='370px'>
            <img src={image.secure_url} style={{ width: '100%', objectFit: 'cover' }} alt='image' />
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
          {content}
        </Text>
      </DivFlex>
    </>
  )
}

PostBody.propTypes = {
  theme: PropTypes.bool.isRequired,
  content: PropTypes.string.isRequired,
  images: PropTypes.array.isRequired
}
