import { useEffect, useState } from 'react'
import { BsSearch } from 'react-icons/bs'
import { useDispatch } from 'react-redux'
import { IconContext } from '../../components/IconContext.jsx'
import { useAuth } from '../../hooks/useAuth.js'
import { useTheme } from '../../hooks/useTheme.js'
import { ALERT_TYPES } from '../../redux/actions/alertActions.js'
import {
  LiFlex,
  UlFlex
} from '../../styled components/Darth-theme'
import { DefaultLink } from '../../styled components/Darth-theme-Router-Links.js'
import {
  HeaderContainerWrapper,
  HeaderSearchBar,
  SearchBarPositionInnnerIcon
} from '../../styled components/Header-theme.js'
import { getDataApi } from '../../utils/fetchDataApi.js'
import { LogoPage } from '../Logo/LogoPage.jsx'
import { HeaderSearchResults } from './HeaderSearchResults.jsx'

export function Header () {
  // Theme
  const { isDark } = useTheme()

  // For searchbar
  const [search, setSearch] = useState('')
  const [getUsers, setGetUsers] = useState([])
  const [showResults, setShowResults] = useState(false)

  // Redux
  const dispatch = useDispatch()
  const auth = useAuth()

  // To clean and hidden results
  useEffect(
    () => {
      const handleClickOutside = (event) => {
        const searchBar = document.getElementById('header-search-bar')
        if (searchBar && !searchBar.contains(event.target)) {
          setSearch('')
          setShowResults(false)
          setGetUsers([])
        }
      }

      window.document.addEventListener('click', handleClickOutside)

      return () => {
        window.document.removeEventListener('click', handleClickOutside)
      }
    }, []
  )

  // To search users
  useEffect(
    () => {
      if (search && auth.token) {
        getDataApi(`search?username=${search}`, auth.token)
          .then(res => setGetUsers(res.data.users))
          .catch(err => {
            dispatch({
              type: ALERT_TYPES.ALERT,
              payload: {
                error: err.response.data.msg
              }
            })
          })
      } else {
        setGetUsers([])
      }
    }, [search, auth.token, dispatch]
  )

  return (
    <HeaderContainerWrapper $jEnd>
      <UlFlex
        $aiCenter
        $margin='0 1rem 0'
      >
        <LiFlex
          $relative
          $margin='0 1rem 0 0'
        >
          <form>
            <HeaderSearchBar
              id='header-search-bar'
              placeholder='Buscar en GeekNet'
              autoComplete='off'
              $isDark={isDark}
              value={search}
              onChange={
                (e) => {
                  setSearch(e.target.value)
                  setShowResults(true)
                }
              }
            />
          </form>
          <SearchBarPositionInnnerIcon>
            <IconContext size='1.1rem' icon={BsSearch} />
          </SearchBarPositionInnnerIcon>
          {
            showResults && search && (<HeaderSearchResults idElement='header-search-results-container' userArray={getUsers} />)
          }
        </LiFlex>
        {/* TODO: To habilite in future versions */}
        {/*
        <LiFlex>
          <HeaderWrapButton>
            <IconContext size='1.7rem' icon={IoNotificationsOutline} />
          </HeaderWrapButton>
        </LiFlex> */}

        <LiFlex>
          <DefaultLink to='/home'>
            <LogoPage />
          </DefaultLink>
        </LiFlex>

      </UlFlex>
    </HeaderContainerWrapper>
  )
}
