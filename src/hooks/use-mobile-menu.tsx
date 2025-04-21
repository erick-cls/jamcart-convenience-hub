
import * as React from "react"

export function useMobileMenu() {
  const [isOpen, setIsOpen] = React.useState(false)
  
  const toggle = React.useCallback(() => {
    setIsOpen(prev => !prev)
  }, [])
  
  const close = React.useCallback(() => {
    setIsOpen(false)
  }, [])
  
  return {
    isOpen,
    toggle,
    close
  }
}
