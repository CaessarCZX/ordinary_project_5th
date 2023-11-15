export const TitleCase = (string) => {
  const splitString = string.toLowerCase().split(' ')
  const newTitleCase = splitString.map(
    (word) => {
      return word.charAt(0).toUpperCase() + word.substring(1)
    }
  ).join(' ')

  return newTitleCase
}
