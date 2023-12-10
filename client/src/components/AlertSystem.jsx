import { useDispatch, useSelector } from 'react-redux'
import BadConnection from '../layout/BadConnection'
import { Loader } from '../layout/Loader'
import LoaderOut from '../layout/LoaderOut'
import { Toast } from '../layout/Toast'
import { ALERT_TYPES } from '../redux/actions/alertActions'

export function AlertSystem () {
  // Redux store states
  // const auth = useSelector(state => state.auth)
  const alert = useSelector(state => state.alert)
  const dispatch = useDispatch()

  const closeToast = () => {
    dispatch({
      type: ALERT_TYPES.ALERT,
      payload: {}
    })
  }
  return (
    <div>
      {alert.loading && <Loader />}
      {alert.loaderOut && <LoaderOut />}
      {alert.error && <Toast msg={{ title: 'Algo salio mal', bodyTxt: alert.error }} handleShow={closeToast} />}
      {alert.success && <Toast msg={{ title: 'Enhorabuena!', bodyTxt: alert.success }} handleShow={closeToast} />}
      {alert.badConnection && <BadConnection />}
    </div>
  )
}
