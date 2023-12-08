import bg from '../assets/bg-dark-bicolor-01.svg'

// Only Styled Components compatible, Object with type string values =>
export const TEST_STYLE_CONTAINER = {
  display: 'flex',
  width: '100%',
  height: '100vh',
  placeContent: 'center',
  alignItems: 'center',
  backgroundColor: '#0e0915',
  padding: '1.5rem',
  backgroundImage: `url(${bg})`,
  backgroundPosition: 'center',
  backgroundAttachment: 'fixed',
  backgroundSize: 'cover',
  backgroundRepeat: 'no-repeat'
}
