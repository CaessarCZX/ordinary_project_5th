import { useEffect, useState } from 'react'
import { BiDirections } from 'react-icons/bi'
import { IoCloudUpload } from 'react-icons/io5'
import {
  LuArrowDownZA,
  LuArrowUpAZ,
  LuDna,
  LuPencil,
  LuPhone,
  LuX
} from 'react-icons/lu'
import { MdMonochromePhotos } from 'react-icons/md'
import { TbSocial } from 'react-icons/tb'

import { RxUpdate } from 'react-icons/rx'
import { useDispatch } from 'react-redux'
import { useParams } from 'react-router-dom'
import defaultUserImg from '../assets/defaultUserImg.svg'
import { IconContext } from '../components/IconContext.jsx'
import { useAuth } from '../hooks/useAuth.js'
import { useDataUser } from '../hooks/useDataUser.js'
import { useTheme } from '../hooks/useTheme.js'
import { ALERT_TYPES } from '../redux/actions/alertActions.js'
import { updateProfile } from '../redux/actions/profileActions.js'
import { maxUserDataValues as maxVal } from '../services/user-values/userValues.js'
import { ButtonLink } from '../styled components/Darth-theme-Router-Links.js'
import { Button, Div, DivFlex, Input, Label, Page, SmallText, Text, TextAlert, Title } from '../styled components/Darth-theme.js'
import {
  AvatarImg,
  EditStatsCardWrapper,
  EditStatsItem,
  EditStatsSection,
  ProfileContainerInfoWrapper,
  ProfileEditAvatarWrap,
  ProfileTitle,
  UploadInputForAvatarLabel,
  UploadInputForAvatarWrap
} from '../styled components/Profile-theme.js'
import { checkImage } from '../utils/imageUpload.js'

export function EditProfile () {
  // Theme
  const { isDark } = useTheme()

  // Redux
  const dispatch = useDispatch()
  const currentUser = useDataUser()
  const auth = useAuth()

  // Avatar and user data context
  const { id } = useParams()
  const [currentAvatar, setCurrentAvatar] = useState('')

  // Data on change
  const initialState = {
    firstname: '',
    lastname: '',
    address: '',
    website: '',
    gender: '',
    phone: '',
    story: ''
  }
  const [editData, setEditData] = useState(initialState)
  const {
    firstname,
    lastname,
    address,
    website,
    gender,
    phone,
    story
  } = editData
  const [newAvatar, setNewAvatar] = useState('')

  useEffect(
    () => {
      if (currentUser) {
        setCurrentAvatar(currentUser.avatar || defaultUserImg)
        setEditData({ ...currentUser })
      }
    }, [currentUser]
  )

  // To get input changes
  const handleChangeInput = (event) => {
    const { name, value } = event.target
    setEditData({
      ...editData,
      [name]: value
    })
  }

  // To change current avatar
  const changeAvatar = (event) => {
    const file = event.target.files[0]
    const err = checkImage(file)
    if (err) return dispatch({ type: ALERT_TYPES.ALERT, payload: { error: err } })
    setNewAvatar(file)
  }

  // To active input for upload
  const handleFileInput = () => {
    const fileUploadInput = window.document.querySelector('#file-upload')
    fileUploadInput.click()
  }

  // To upload changes
  const handleSubmit = (event) => {
    event.preventDefault()
    dispatch(
      updateProfile({
        editData,
        newAvatar,
        auth
      })
    )
  }

  return (
    <Page
      $isDark={isDark}
      $absolute
      $heigth='100vh'
      $enableBg
    >
      <ProfileContainerInfoWrapper>
        <ProfileTitle>
          <Title $small $isDark={isDark}>Editar Perfil</Title>
        </ProfileTitle>

        <DivFlex $padding='1rem'>
          <form onSubmit={handleSubmit}>
            <EditStatsCardWrapper
              $isDark={isDark}
              $padding='1.5rem'
            >
              <EditStatsSection
                $padding='1rem'
              >
                <DivFlex
                  $col
                  $aiCenter
                  $padding='0 0 2rem'
                  $txtCenter
                >
                  <DivFlex $aiCenter $gap='0.7rem'>
                    <Title $small $isDark={isDark}>Actualiza tu perfil</Title>
                    <Div $padding='0 0 1rem'>
                      <IconContext size='2.3rem' color='#a855f7' icon={RxUpdate} />
                    </Div>
                  </DivFlex>
                  <Text $isDark={isDark}>Puedes modificar tus datos principales</Text>
                </DivFlex>

                <DivFlex $gap='1.2rem' $margin='0 0 1.2rem'>

                  <EditStatsItem $isDark={isDark}>
                    <DivFlex $flex $col>
                      <DivFlex
                        $gap='1rem'
                        $aiCenter
                      >
                        <IconContext size='1.15rem' icon={LuArrowDownZA} />
                        <Label htmlFor='update-firstname' $isDark={isDark}>Edita tu Nombre</Label>
                        {
                          firstname.length < maxVal.MAX_LENGTH_FIRSTNAME
                            ? (<SmallText $isDark={isDark}>{`${firstname.length}/${maxVal.MAX_LENGTH_FIRSTNAME}`}</SmallText>)
                            : (<TextAlert>Max</TextAlert>)
                        }
                      </DivFlex>
                      <Input
                        $margin='0 0 1rem'
                        $isDark={isDark}
                        placeholder='Teclea un nuevo nombre'
                        name='firstname'
                        type='text'
                        id='update-firstname'
                        value={firstname}
                        onChange={handleChangeInput}
                        maxLength={maxVal.MAX_LENGTH_FIRSTNAME}
                      />
                    </DivFlex>
                  </EditStatsItem>

                  <EditStatsItem $isDark={isDark}>
                    <DivFlex $flex $col>
                      <DivFlex
                        $gap='1rem'
                        $aiCenter
                      >
                        <IconContext size='1.15rem' icon={LuArrowUpAZ} />
                        <Label htmlFor='update-lastname' $isDark={isDark}>Edita tus Apellidos</Label>
                        {
                          lastname.length < maxVal.MAX_LENGTH_LASTNAME
                            ? (<SmallText $isDark={isDark}>{`${lastname.length}/${maxVal.MAX_LENGTH_LASTNAME}`}</SmallText>)
                            : (<TextAlert>Max</TextAlert>)
                        }
                      </DivFlex>
                      <Input
                        $margin='0 0 1rem'
                        $isDark={isDark}
                        placeholder='Teclea un nuevo apellido'
                        name='lastname'
                        type='text'
                        id='update-lastname'
                        value={lastname}
                        onChange={handleChangeInput}
                        maxLength={maxVal.MAX_LENGTH_LASTNAME}
                      />
                    </DivFlex>
                  </EditStatsItem>

                </DivFlex>

                <EditStatsItem $isDark={isDark} $margin='0 0 1.2rem'>
                  <DivFlex
                    $gap='1rem'
                    $aiCenter
                  >
                    <IconContext size='1.15rem' icon={BiDirections} />
                    <Label htmlFor='update-address' $isDark={isDark}>Edita tu Dirección</Label>
                    {
                      address.length < maxVal.MAX_LENGTH_ADDRESS
                        ? (<SmallText $isDark={isDark}>{`${address.length}/${maxVal.MAX_LENGTH_ADDRESS}`}</SmallText>)
                        : (<TextAlert>Max</TextAlert>)
                    }
                  </DivFlex>
                  <Input
                    $margin='0 0 1rem'
                    $isDark={isDark}
                    placeholder='Teclea una nueva dirección'
                    name='address'
                    type='text'
                    id='update-address'
                    value={address}
                    onChange={handleChangeInput}
                    maxLength={maxVal.MAX_LENGTH_ADDRESS}
                  />
                </EditStatsItem>

                <EditStatsItem $isDark={isDark}>
                  <DivFlex
                    $gap='1rem'
                    $aiCenter
                  >
                    <IconContext size='1.15rem' icon={TbSocial} />
                    <Label htmlFor='update-website' $isDark={isDark}>Edita tus redes</Label>
                    {
                      website.length < maxVal.MAX_LENGTH_WEBSITE
                        ? (<SmallText $isDark={isDark}>{`${website.length}/${maxVal.MAX_LENGTH_WEBSITE}`}</SmallText>)
                        : (<TextAlert>Max</TextAlert>)
                    }
                  </DivFlex>
                  <Input
                    $margin='0 0 1rem'
                    $isDark={isDark}
                    placeholder='Teclea tus redes'
                    name='website'
                    type='text'
                    id='update-website'
                    value={website}
                    onChange={handleChangeInput}
                    maxLength={maxVal.MAX_LENGTH_WEBSITE}
                  />
                </EditStatsItem>

              </EditStatsSection>

              <EditStatsSection $padding='1rem'>

                <DivFlex $jCenter $padding='0 0 1.5rem'>

                  <EditStatsItem $isDark={isDark}>
                    <Div $padding='1.5rem'>
                      <ProfileEditAvatarWrap>
                        {
                          currentUser &&
                          currentAvatar &&
                          (
                            <>
                              <AvatarImg
                                src={newAvatar ? URL.createObjectURL(newAvatar) : currentAvatar}
                                alt='Imagen de perfil'
                              />
                              <UploadInputForAvatarWrap onClick={handleFileInput}>
                                <MdMonochromePhotos size='2rem' color='#cbd2de' />
                                <UploadInputForAvatarLabel>Cambiar foto de perfil</UploadInputForAvatarLabel>
                                <input type='file' id='file-upload' accept='image/*' onChange={changeAvatar} />
                              </UploadInputForAvatarWrap>
                            </>
                          )
                        }
                      </ProfileEditAvatarWrap>
                    </Div>
                  </EditStatsItem>

                </DivFlex>

                <DivFlex $gap='1.2rem' $margin='0 0 1.2rem'>

                  <EditStatsItem $isDark={isDark}>
                    <DivFlex $col $flex>
                      <DivFlex
                        $gap='1rem'
                        $aiCenter
                      >
                        <IconContext size='1.15rem' icon={LuDna} />
                        <Label htmlFor='update-gender' $isDark={isDark}>Edita tu Género</Label>
                        {
                          gender.length < maxVal.MAX_LENGTH_GENDER
                            ? (<SmallText $isDark={isDark}>{`${gender.length}/${maxVal.MAX_LENGTH_GENDER}`}</SmallText>)
                            : (<TextAlert>Max</TextAlert>)
                        }
                      </DivFlex>
                      <Input
                        $margin='0 0 1rem'
                        $isDark={isDark}
                        placeholder='Teclea un género'
                        name='gender'
                        type='text'
                        id='update-gender'
                        value={gender}
                        onChange={handleChangeInput}
                        maxLength={maxVal.MAX_LENGTH_GENDER}
                      />
                    </DivFlex>
                  </EditStatsItem>

                  <EditStatsItem $isDark={isDark}>
                    <DivFlex $col $flex>
                      <DivFlex
                        $gap='1rem'
                        $aiCenter
                      >
                        <IconContext size='1.15rem' icon={LuPhone} />
                        <Label htmlFor='update-phone' $isDark={isDark}>Edita tu Teléfono</Label>
                        {
                          phone.length < maxVal.MAX_LENGTH_PHONE
                            ? (<SmallText $isDark={isDark}>{`${phone.length}/${maxVal.MAX_LENGTH_PHONE}`}</SmallText>)
                            : (<TextAlert>Max</TextAlert>)
                        }
                      </DivFlex>
                      <Input
                        $margin='0 0 1rem'
                        $isDark={isDark}
                        placeholder='Teclea tu número de telefono'
                        name='phone'
                        type='tel'
                        id='update-phone'
                        value={phone}
                        onChange={handleChangeInput}
                        maxLength={maxVal.MAX_LENGTH_PHONE}
                      />
                    </DivFlex>
                  </EditStatsItem>

                </DivFlex>

                <EditStatsItem $isDark={isDark}>
                  <DivFlex
                    $gap='1rem'
                    $aiCenter
                  >
                    <IconContext size='1.15rem' icon={LuPencil} />
                    <Label htmlFor='update-story' $isDark={isDark}>Edita tu Biografia</Label>
                    {
                      story.length < maxVal.MAX_LENGTH_STORY
                        ? (<SmallText $isDark={isDark}>{`${story.length}/${maxVal.MAX_LENGTH_STORY}`}</SmallText>)
                        : (<TextAlert>Max</TextAlert>)
                    }
                  </DivFlex>
                  <Input
                    $margin='0 0 1rem'
                    $isDark={isDark}
                    placeholder='Escribe tu historia'
                    name='story'
                    type='text'
                    id='update-story'
                    value={story}
                    onChange={handleChangeInput}
                    maxLength={maxVal.MAX_LENGTH_STORY}
                  />
                </EditStatsItem>

                <DivFlex $gap='1.5rem' $padding='1.5rem 0 0'>

                  <ButtonLink
                    $isDark={isDark}
                    to={`/profile/${id}`}
                  >
                    <DivFlex $gap='0.5rem'>
                      <p>Cancelar</p>
                      <IconContext size='1.15rem' icon={LuX} />
                    </DivFlex>
                  </ButtonLink>

                  <Button
                    $action
                    type='submit'
                  >
                    <DivFlex $gap='0.5rem'>
                      <p>Subir cambios</p>
                      <IconContext size='1.15rem' icon={IoCloudUpload} />
                    </DivFlex>
                  </Button>
                </DivFlex>

              </EditStatsSection>
            </EditStatsCardWrapper>
          </form>
        </DivFlex>

      </ProfileContainerInfoWrapper>
    </Page>
  )
}
