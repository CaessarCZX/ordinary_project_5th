import PropTypes from 'prop-types'
import { IconContext } from '../../components/IconContext.jsx'
import { useTheme } from '../../hooks/useTheme.js'
import { DivFlex, Subtitle, Text } from '../../styled components/Darth-theme'
import { StatsCardItem } from '../../styled components/Profile-theme.js'

export function ProfileInfoStatsCardItem ({ name, counter, icon: Icon, functionActivation, activeSpaceName }) {
  // Theme
  const { isDark } = useTheme()
  return (
    <StatsCardItem
      $isDark={isDark}
      onClick={() => functionActivation(activeSpaceName)}
    >
      <DivFlex $aiCenter $gap='1rem'>
        <IconContext
          icon={Icon}
        />
        <div>
          <Subtitle $isDark={isDark}>{counter}</Subtitle>
          <Text $medium $isDark={isDark}>{name}</Text>
        </div>
      </DivFlex>
    </StatsCardItem>
  )
}

ProfileInfoStatsCardItem.propTypes = {
  name: PropTypes.string.isRequired,
  counter: PropTypes.string.isRequired,
  icon: PropTypes.func.isRequired,
  functionActivation: PropTypes.func.isRequired,
  activeSpaceName: PropTypes.string.isRequired
}
