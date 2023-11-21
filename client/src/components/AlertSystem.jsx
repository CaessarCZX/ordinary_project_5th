import { useDispatch, useSelector } from 'react-redux'
import { Loader } from '../layout/Loader'
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
      {alert.error && <Toast msg={{ title: 'Algo salio mal', bodyTxt: alert.error }} handleShow={closeToast} />}
      {alert.success && <Toast msg={{ title: 'Inicio exitoso', bodyTxt: alert.success }} handleShow={closeToast} />}
    </div>
  )
}
