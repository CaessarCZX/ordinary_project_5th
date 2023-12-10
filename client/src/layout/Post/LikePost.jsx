import PropTypes from 'prop-types'
import { IoMdHeart, IoMdHeartEmpty } from 'react-icons/io'
import { IconContext } from '../../components/IconContext'
import { DropShadowOutset } from '../../styled components/IluminationShadows-containers'

export function LikePost ({ stateLike, likeFunc, unlikeFunc }) {
  return (
    <>
      {
        stateLike
          ? (
            <DropShadowOutset onClick={unlikeFunc}>
              <IconContext color='red' size='1.7rem' icon={IoMdHeart} />
            </DropShadowOutset>
            )
          : (
            <DropShadowOutset onClick={likeFunc}>
              <IconContext size='1.7rem' icon={IoMdHeartEmpty} />
            </DropShadowOutset>
            )
      }
    </>
  )
}

LikePost.propTypes = {
  stateLike: PropTypes.bool.isRequired,
  likeFunc: PropTypes.func.isRequired,
  unlikeFunc: PropTypes.func.isRequired
}
