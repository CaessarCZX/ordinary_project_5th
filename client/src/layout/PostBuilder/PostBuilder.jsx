import { useEffect, useState } from 'react'
import { CiCamera } from 'react-icons/ci'
import { FaRedoAlt } from 'react-icons/fa'
import { MdSend } from 'react-icons/md'
import { useDispatch } from 'react-redux'
import defaultUserImg from '../../assets/defaultUserImg.svg'
import { IconContext } from '../../components/IconContext'
import { useAuth } from '../../hooks/useAuth'
import { useStatus } from '../../hooks/useStatus.js'
import { useTheme } from '../../hooks/useTheme'
import { ALERT_TYPES } from '../../redux/actions/alertActions'
import { createPost, updatePost } from '../../redux/actions/postActions.js'
import { maxPostValues as max } from '../../services/post-values/postValues.js'
import { JumpItem, RotableItem } from '../../styled components/Animation-containers'
import { ArticleGrid, Div, DivFlex, LiFlex, SmallText, Subtitle, TextAlert, Title, UlFlex } from '../../styled components/Darth-theme'
import { DropShadowOutset } from '../../styled components/IluminationShadows-containers'
import {
  PostBuilderAvatarImg,
  PostBuilderAvatarWrap,
  PostBuilderCounterTextArea,
  PostBuilderDeleteImageBtn,
  PostBuilderDiscartBtn,
  PostBuilderPostBtn,
  PostBuilderTextArea,
  // PostBuilderUpdateBtn,
  PostBuilderUploadImageWrap,
  PostBuilderWrap
} from '../../styled components/PostBuilder-theme'
import { StringFormatedBytesToKiloBytes } from '../../utils/getValues.js'
import { checkImage } from '../../utils/imageUpload'

export function PostBuilder () {
  // Theme
  const { isDark } = useTheme()

  // Redux
  const auth = useAuth()
  const dispatch = useDispatch()

  // Post controls
  const [enablePost, setEnablePost] = useState(false)

  // Post content
  const [postBody, setPostBody] = useState('')
  const [postImages, setPostImages] = useState('')
  // const [isNewImage, setIsNewImage] = useState(false)

  // useEffect(
  //   () => {
  //     if (!postImages) {
  //       setIsNewImage(true)
  //     }
  //   }, [postImages]
  // )

  // TODO: Try to update to accept multiple images for collection post
  // For images
  const uploadImages = (event) => {
    const files = event.target.files[0]
    const err = checkImage(files)
    if (err) return dispatch({ type: ALERT_TYPES.ALERT, payload: { error: err } })
    setPostImages(files)
  }

  const handleFileInput = () => {
    const fileUploadInput = window.document.querySelector('#postupload')
    fileUploadInput.click()
  }

  // EnableButton
  useEffect(
    () => {
      setEnablePost(postBody.length === 0)
    }, [postBody.length]
  )

  // Edit post
  const status = useStatus()
  const [enableEdit, setEnableEdit] = useState(false)
  useEffect(
    () => {
      if (status.edit) {
        setEnableEdit(status.edit)
        setPostBody(status.content)
        setPostImages(status.images[0])
      }
    }, [status]
  )

  // DiscartChanges
  const handleDiscart = () => {
    setPostBody('')
    setPostImages('')
    dispatch({
      type: ALERT_TYPES.STATUS,
      payload: false
    })
    setEnableEdit(false)
  }

  // Submit post
  const handleSubmit = (event) => {
    event.preventDefault()

    if (postBody.length === 0) {
      return dispatch({
        type: ALERT_TYPES.ALERT,
        payload: {
          error: 'El post no tiene contenido'
        }
      })
    }

    if (enableEdit) {
      dispatch(updatePost({
        content: postBody,
        images: postImages,
        status,
        auth
      }
      ))
      dispatch({
        type: ALERT_TYPES.STATUS,
        payload: false
      })
    } else {
      dispatch(createPost({
        content: postBody,
        images: postImages,
        auth
      }
      ))
    }

    handleDiscart()
  }

  return (
    <PostBuilderWrap $width='100%' $padding='0.7rem' $enableEdit={enableEdit} $isDark={isDark}>
      {
        enableEdit && <Title $medium $isDark>Editar Publicación</Title>
      }
      <form onSubmit={handleSubmit}>

        <DivFlex $aiStart $gap='1.5rem'>

          <PostBuilderAvatarWrap>
            {
              auth && auth.user && auth?.user?.avatar && <PostBuilderAvatarImg src={auth.user.avatar || defaultUserImg} alt={`imagen de perfil de ${auth.user.firstname}`} />
            }
          </PostBuilderAvatarWrap>

          <Div
            $margin='0.7rem 1.5rem 0.9rem 0'
            $relative
          >
            <PostBuilderTextArea
              type='text'
              rows='4'
              cols='1000'
              placeholder={postImages ? 'Ingresa una descripción a la imagen' : '¿En qué estas pesando?'}
              $isDark={isDark}
              value={postBody}
              maxLength={152}
              onChange={(event) => setPostBody(event.target.value)}
            />
            <PostBuilderCounterTextArea>
              {
                postBody.length >= max.MAX_CONTENT_POST
                  ? <TextAlert>MAX</TextAlert>
                  : <SmallText $isDark={isDark}>{`${postBody.length}/${max.MAX_CONTENT_POST}`}</SmallText>
              }
            </PostBuilderCounterTextArea>
          </Div>

        </DivFlex>
        {
          postImages && (
            <DivFlex $col>
              <DivFlex $jBetween>
                <SmallText $isDark={isDark}>Imágenes cargadas:</SmallText>
                <PostBuilderDeleteImageBtn
                  onClick={() => setPostImages('')}
                >Eliminar imagen
                </PostBuilderDeleteImageBtn>
              </DivFlex>
              <UlFlex $gap='1rem' $pBlock='0.7rem'>
                <LiFlex $maxWidth='50px' $maxHeight='50px' $overHidden>
                  <img style={{ width: '100%', objectFit: 'cover' }} src={status.edit ? postImages?.secure_url : URL.createObjectURL(postImages)} alt='nueva imagen para post' />
                </LiFlex>
                <LiFlex $col>
                  {
                    enableEdit
                      ? (<SmallText $bold $isDark={isDark}>Imagen actual</SmallText>)
                      : (
                        <>
                          <SmallText $bold $isDark={isDark}>{`nombre de la imagen: ${postImages?.name}`}</SmallText>
                          <SmallText $bold $isDark={isDark}>{`Peso: ${StringFormatedBytesToKiloBytes(postImages?.size)}`}</SmallText>
                          <SmallText $bold $isDark={isDark}>{`Tipo: ${postImages?.type.split('/')[1]}`}</SmallText>
                        </>)
                    }
                </LiFlex>
              </UlFlex>
            </DivFlex>
          )
        }
        <DivFlex $aiCenter $jBetween>

          <Div $mInline='0.5rem'>
            <PostBuilderUploadImageWrap onClick={handleFileInput}>
              <JumpItem $duration='0.2s' $timingFunc='ease-out'>
                <DropShadowOutset $duration='0.3s' $timingFunc='ease'>
                  <IconContext size='1.5rem' icon={CiCamera} />
                </DropShadowOutset>
              </JumpItem>
              <input type='file' id='postupload' multiple accept='image/*' onChange={uploadImages} />
            </PostBuilderUploadImageWrap>
          </Div>

          <Div $margin='0 0 0.2rem'>
            <DivFlex $gap='1rem'>
              {
                (postBody.length > 0 || postImages !== '') && (
                  <PostBuilderDiscartBtn onClick={handleDiscart}>
                    <DivFlex $aiCenter $gap='0.5rem'>
                      <RotableItem>
                        <FaRedoAlt color='#fff' />
                      </RotableItem>
                      <Subtitle $micro $isDark>{enableEdit ? 'Descartar edición' : 'Descartar post'}</Subtitle>
                    </DivFlex>
                  </PostBuilderDiscartBtn>
                )
              }
              <PostBuilderPostBtn disabled={enablePost} type='submit'>
                <DivFlex $aiCenter $gap='0.5rem'>
                  <Subtitle $micro $isDark>{enableEdit ? 'Actualizar Publición' : 'Publicar'}</Subtitle>
                  <ArticleGrid>
                    <MdSend color='#fff' />
                  </ArticleGrid>
                </DivFlex>
              </PostBuilderPostBtn>
              {/* {
                enableEdit
                  ? (
                    <PostBuilderUpdateBtn disabled={enablePost}>
                      <DivFlex $aiCenter $gap='0.5rem'>
                        <Subtitle $micro $isDark>Actualizar post</Subtitle>
                        <ArticleGrid>
                          <MdSend color='#fff' />
                        </ArticleGrid>
                      </DivFlex>
                    </PostBuilderUpdateBtn>)
                  : (
                    <PostBuilderPostBtn disabled={enablePost} type='submit'>
                      <DivFlex $aiCenter $gap='0.5rem'>
                        <Subtitle $micro $isDark>Publicar</Subtitle>
                        <ArticleGrid>
                          <MdSend color='#fff' />
                        </ArticleGrid>
                      </DivFlex>
                    </PostBuilderPostBtn>
                    )
              } */}

            </DivFlex>
          </Div>
        </DivFlex>

      </form>
    </PostBuilderWrap>
  )
}
