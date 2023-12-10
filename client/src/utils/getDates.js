export const extractDateFromString = (stringDate) => {
  const dateFragment = stringDate.slice(0, 10)

  if (dateFragment) {
    return dateFragment
  } else {
    return null
  }
}

export const getTimeFromStringDate = (dateString) => {
  const dateFromString = new Date(dateString)
  const currentDate = new Date()
  const milisecondsDiff = currentDate - dateFromString

  if (typeof Intl === 'object' && typeof Intl.RelativeTimeFormat === 'function') {
    const rtf = new Intl.RelativeTimeFormat('es', { numeric: 'auto' })
    const seconds = Math.round(milisecondsDiff / 1000)

    if (seconds < 60) {
      return rtf.format(-seconds, 'second')
    }

    const minutes = Math.round(seconds / 60)

    if (minutes < 60) {
      return rtf.format(-minutes, 'minute')
    }

    const hours = Math.round(minutes / 60)

    return rtf.format(-hours, 'hour')
  } else {
    // Realizar cálculos manualmente si Intl.RelativeTimeFormat no está disponible
    const seconds = Math.round(milisecondsDiff / 1000)
    const minutes = Math.round(seconds / 60)
    const hours = Math.round(minutes / 60)

    if (seconds < 60) {
      return `Hace ${seconds} segundos`
    } else if (minutes < 60) {
      return `Hace ${minutes} minutos`
    } else {
      return `Hace ${hours} horas`
    }
  }
}
