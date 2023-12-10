import { useEffect, useState } from 'react'

export const useCloseOnClickOutside = (id) => {
  const [activeElement, setActiveElement] = useState(false)

  useEffect(
    () => {
      const handleClickOutside = (event) => {
        const ele = window.document.querySelector(id)
        if (ele && !ele.contains(event.target)) {
          setActiveElement(false)
        }
      }

      window.document.addEventListener('click', handleClickOutside)

      return () => {
        window.document.removeEventListener('click', handleClickOutside)
      }
    }, [id]
  )

  return { activeElement, setActiveElement }
}
