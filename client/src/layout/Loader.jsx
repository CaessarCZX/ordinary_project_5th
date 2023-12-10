import {
  LoaderRing,
  LoaderSpace,
  LoaderWrapp
} from '../styled components/Loader-theme.js'

export function Loader () {
  return (
    <LoaderSpace>
      <LoaderWrapp viewBox='0 0 240 240' height='240' width='240'>
        <LoaderRing
          $ringA
          strokeLinecap='round'
          strokeDashoffset='-330'
          strokeDasharray='0 660'
          strokeWidth='20'
          stroke='#000'
          fill='none'
          r='105'
          cy='120'
          cx='120'
        />
        <LoaderRing
          $ringB
          strokeLinecap='round'
          strokeDashoffset='-110'
          strokeDasharray='0 220'
          strokeWidth='20'
          stroke='#000'
          fill='none'
          r='35'
          cy='120'
          cx='120'
        />
        <LoaderRing
          $ringC
          strokeLinecap='round'
          strokeDasharray='0 440'
          strokeWidth='20'
          stroke='#000'
          fill='none'
          r='70'
          cy='120'
          cx='85'
        />
        <LoaderRing
          $ringD
          strokeLinecap='round'
          strokeDasharray='0 440'
          strokeWidth='20'
          stroke='#000'
          fill='none'
          r='70'
          cy='120'
          cx='155'
        />
      </LoaderWrapp>
    </LoaderSpace>
  )
}
