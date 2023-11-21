export const isEmptyObject = (userData) => {
  const isEmpty = Object.values(userData).every(x => x === null || x === '')
  return isEmpty
}

export const undefinedToBoolean = (value) => {
  const valueMiddleware = value !== undefined
  return valueMiddleware
}
