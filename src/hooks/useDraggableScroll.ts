import { useEffect, useRef } from 'react'

export function useDraggableScroll() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    let isDown = false
    let startX: number
    let scrollLeft: number

    const onMouseDown = (e: MouseEvent) => {
      isDown = true
      startX = e.pageX
      scrollLeft = element.scrollLeft
      element.style.cursor = 'grabbing'
      element.style.userSelect = 'none'
    }

    const onMouseLeave = () => {
      isDown = false
      element.style.cursor = 'grab'
      element.style.removeProperty('user-select')
    }

    const onMouseUp = () => {
      isDown = false
      element.style.cursor = 'grab'
      element.style.removeProperty('user-select')
    }

    const onMouseMove = (e: MouseEvent) => {
      if (!isDown) return
      e.preventDefault()
      const x = e.pageX
      const walk = (x - startX) * 2 // Scroll speed multiplier
      element.scrollLeft = scrollLeft - walk
    }

    element.addEventListener('mousedown', onMouseDown)
    element.addEventListener('mouseleave', onMouseLeave)
    element.addEventListener('mouseup', onMouseUp)
    element.addEventListener('mousemove', onMouseMove)

    // Initial cursor style
    element.style.cursor = 'grab'

    return () => {
      element.removeEventListener('mousedown', onMouseDown)
      element.removeEventListener('mouseleave', onMouseLeave)
      element.removeEventListener('mouseup', onMouseUp)
      element.removeEventListener('mousemove', onMouseMove)

      // Cleanup styles
      if (element) {
        element.style.cursor = ''
        element.style.removeProperty('user-select')
      }
    }
  }, [])

  return { ref }
}
