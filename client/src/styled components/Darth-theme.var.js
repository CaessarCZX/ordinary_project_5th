export const TRANSPARENCIES = Object.freeze({
  primary: 'rgba(255, 255, 255, 0.02)',
  secondary: 'rgba(255, 255, 255, 0.06)',
  terciary: 'rgba(255, 255, 255, 0.1)'
})

export const DARTH_THEME_LIGHT_MODE = {
  backgroundPrimary: '#f4f1f9',
  backgroundContainerStrong: '#fff',
  titlePrimary: '#0e0915',
  backgroundContainer: 'rgba(255, 255, 255, 0.27)',
  boxShadowInsetPrim: 'inset 0 1px 0 0 rgba(0, 0, 0, 0.03)',
  boxShadowInsetSec: 'inset 0 0 0 1px rgba(0, 0, 0, 0.03)',
  boxShadowButtonDefault: 'inset 0 0.7px 0 0.2px rgba(0, 0, 0, 0.3), inset 0 0px 0 1px rgba(0, 0, 0, 0.012)',
  borderPrimary: 'solid 0.0625rem rgba(0, 1, 0, 0.12)',
  borderSettings: {
    style: 'solid',
    weight: '0.0625rem'
  },
  blurBoxDefault: 'blur(5px)',
  borderRadiusDefault: '1.5rem',
  transitionDuration: {
    short: '0.3s',
    normal: '0.7s',
    medium: '1.3s',
    large: '2s'
  }
}

export const DARTH_THEME_DARK_MODE = Object.freeze({
  backgroundPrimary: '#0e0915',
  backgroundSecundary: '#0f172a',
  titlePrimary: '#d7dde7',
  subtitlePrimary: '#a856f7',
  textPrimary: '#94a3b8',
  textSeconday: '#64748b',
  textHighlight: '#f8fafc',
  choosenElement: '#a855f7',
  choosenElementActive: '#e9d5ff',
  choosenElementBtn: '#9333ea',
  disableActiveBtn: '#62229d',
  boxShadowInsetPrim: `inset 0 1px 0 0 ${TRANSPARENCIES.terciary}`,
  boxShadowInsetSec: `inset 0 0 0 1px ${TRANSPARENCIES.terciary}`,
  boxShadowButtonDefault: `inset 0 0.7px 0 0.2px rgba(255, 255, 255, 0.33), inset 0 0px 0 1px ${TRANSPARENCIES.terciary}`,
  borderPrimary: `solid 0.0625rem ${TRANSPARENCIES.primary}`,
  borderSettings: {
    style: 'solid',
    weight: '0.0625rem'
  },
  blurBoxDefault: 'blur(5px)',
  borderRadiusDefault: '1.5rem',
  transitionDuration: {
    short: '0.3s',
    normal: '0.7s',
    medium: '1.3s',
    large: '2s'
  }
})

export const FONT_SETTINGS = Object.freeze({
  titleLarge: {
    size: '56px',
    weight: '700',
    element: 'h1',
    lineHeight: '1.5'
  },
  titleMedium: {
    size: '44px',
    weight: '700',
    element: 'h2',
    lineHeight: '1.5'
  },
  titleSmall: {
    size: '36px',
    weight: '700',
    element: 'h2',
    lineHeight: '1.5'
  },
  titleDegree: {
    light: 'none',
    dark: {
      color: 'transparent',
      backgroundImage: 'radial-gradient(circle, #d7dde7 0%, rgba(148,163,184,1) 100%);',
      backgroundClip: 'text',
      webkitBackgroundClip: 'text',
      webkitTextFillColor: 'transparent'
    }
  },
  subtitleHighlight: {
    size: '16px',
    weight: '500',
    element: 'div',
    gradient: {
      color: 'transparent',
      backgroundImage: `linear-gradient(to right, ${DARTH_THEME_DARK_MODE.choosenElement}, ${DARTH_THEME_DARK_MODE.choosenElementActive} )`,
      backgroundClip: 'text',
      webkitBackgroundClip: 'text',
      webkitTextFillColor: 'transparent'
    },
    lineHeight: '1.5',
    medium: {
      size: '14px'
    }
  },
  subtitleLarge: {
    size: '20px',
    weight: '700',
    element: 'h3',
    lineHeight: '1.5'
  },
  subtitleMedium: {
    size: '18px',
    weight: '700',
    element: 'h3',
    lineHeight: '1.5'
  },
  subtitleSmall: {
    size: '16px',
    weight: '500',
    element: 'h4',
    lineHeight: '1.5'
  },
  subtitleMicro: {
    size: '14px',
    weight: '700',
    element: 'h3',
    lineHeight: '1.5'
  },
  textLarge: {
    size: '18px',
    weight: '300',
    element: 'p',
    lineHeight: '1.5'
  },
  textMedium: {
    size: '14px',
    weight: '300',
    element: [
      'p',
      'span'
    ],
    lineHeight: '1.5'
  },
  textMediumAlert: {
    color: 'red',
    size: '14px',
    weight: '300',
    element: [
      'p',
      'span'
    ],
    lineHeight: '1.5'
  },
  txtSmall: {
    size: '12px',
    weight: '300',
    element: 'span',
    lineHeight: '1.5',
    display: 'inline-block'
  },
  txtSmallBold: {
    size: '12px',
    weight: '700',
    element: 'span',
    lineHeight: '1.5'
  }
})

export const TOGGLE = Object.freeze({
  generaLabel: {
    width: '2.8rem',
    position: 'relative',
    height: '1.5rem',
    borderRadius: '100vh',
    boxShadow: 'inset 0 0 4px 2px rgba(0, 0, 0, 0.3)',
    transition: `background-color ${DARTH_THEME_DARK_MODE.transitionDuration.short} ease-out`,
    cursor: 'pointer',
    before: {
      content: '""',
      position: 'absolute',
      inset: '0',
      width: '1.5rem',
      height: '1.5rem',
      borderRadius: '100vh',
      backgroundColor: '#fff',
      transform: 'scale(0.85)',
      transition: `transform  ${DARTH_THEME_DARK_MODE.transitionDuration.short} ease-in-out`
    }
  },
  dark: {
    backgroundColor: DARTH_THEME_DARK_MODE.choosenElement
  },
  light: {
    backgroundColor: DARTH_THEME_DARK_MODE.choosenElement
  },
  ganeralInput: {
    display: 'none',
    selfElmenteCheckedAndSibligLabel: 'scale(0.85) translate(25px);' // Just for transform property
  }
})

export const INPUTS = Object.freeze({
  general: {
    width: '100%',
    fontSize: '0.875rem',
    lineHeight: '1.5',
    backgroundDefault: TRANSPARENCIES.secondary,
    borderRadius: '0.25rem',
    borderStyle: 'solid',
    borderColor: 'transparent',
    borderWidth: '1px',
    padding: '6px 12px',
    fontFamily: 'inherit',
    focus: {
      outline: `1px solid ${DARTH_THEME_DARK_MODE.choosenElement}`
    },
    active: {
      outline: `1px solid ${DARTH_THEME_DARK_MODE.choosenElementActive}`
    }
  },
  label: {
    display: 'block',
    width: '100%',
    lineHeight: '1.5',
    margin: '0 0 4px'
  }
})

export const BUTTONS = Object.freeze({
  general: {
    display: 'inline-flex',
    padding: '6px 16px',
    flex: '1',
    fontFamily: 'inherit',
    fontSize: '14px',
    fontWeight: '500',
    justifyContent: 'center',
    alignItems: 'center',
    lineHeight: '1.5',
    borderStyle: 'none',
    borderRadius: '100vh',
    borderColor: 'transparent',
    borderWidth: '0.0625rem',
    transition:
      `background-color
    ${DARTH_THEME_DARK_MODE.transitionDuration.short}
    ease-in`,
    cursor: 'pointer'
  },
  defaultBtn: {
    backgroundColor: 'transparent',
    borderColor: TRANSPARENCIES.terciary,
    boxShadow: DARTH_THEME_DARK_MODE.boxShadowButtonDefault,
    hover: {
      backgroundColor: TRANSPARENCIES.primary
    }
  },
  actionBtn: {
    backgroundColor: DARTH_THEME_DARK_MODE.choosenElement,
    color: DARTH_THEME_DARK_MODE.titlePrimary,
    boxShadow: 'none',
    hover: {
      backgroundColor: DARTH_THEME_DARK_MODE.choosenElementBtn
    },
    disbledState: {
      backgroundColor: DARTH_THEME_DARK_MODE.disableActiveBtn,
      color: 'gray',
      hover: {
        disableHover: 'none'
      }
    }
  }

})
