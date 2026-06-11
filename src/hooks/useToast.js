import { useState, useCallback, useRef } from 'react'

let idCounter = 0

/**
 * Hook for managing toast notifications.
 * @returns {{ toasts: Array, addToast: Function }}
 */
export default function useToast() {
  const [toasts, setToasts] = useState([])
  const timers = useRef({})

  const addToast = useCallback((message, type = 'success', duration = 3000) => {
    const id = `toast-${++idCounter}`
    setToasts((prev) => [...prev, { id, message, type }])

    timers.current[id] = setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
      delete timers.current[id]
    }, duration)
  }, [])

  return { toasts, addToast }
}
