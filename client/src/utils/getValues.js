export const isEmptyObject = (userData) => {
  const isEmpty = Object.values(userData).every(x => x === null || x === '')
  return isEmpty
}

export const undefinedToBoolean = (value) => {
  const valueMiddleware = value !== undefined
  return valueMiddleware
}

export const FormatRightPlacesOfDecimal = (decimal, placesToShow) => {
  return (Math.round(decimal * 100) / 100).toFixed(placesToShow)
}

export const ConvertBytesToKiloBytes = (byteNumber) => byteNumber / 1024

export const StringFormatedBytesToKiloBytes = (byteNumber) => {
  const convertion = ConvertBytesToKiloBytes(byteNumber)
  const FormatingNumber = FormatRightPlacesOfDecimal(convertion)
  return `${FormatingNumber} kb`
}
