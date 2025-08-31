import { useState, useEffect, useRef } from 'react'

export const usePullToRefresh = (onRefresh, threshold = 80) => {
  const [isPulling, setIsPulling] = useState(false)
  const [pullDistance, setPullDistance] = useState(0)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const containerRef = useRef(null)
  const startY = useRef(0)
  const currentY = useRef(0)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const handleTouchStart = (e) => {
      const scrollTop = container.scrollTop
      if (scrollTop === 0) {
        startY.current = e.touches[0].clientY
        setIsPulling(true)
      }
    }

    const handleTouchMove = (e) => {
      if (!isPulling) return

      currentY.current = e.touches[0].clientY
      const distance = currentY.current - startY.current

      if (distance > 0) {
        e.preventDefault()
        setPullDistance(Math.min(distance, threshold * 1.5))
      }
    }

    const handleTouchEnd = async () => {
      if (!isPulling) return

      setIsPulling(false)

      if (pullDistance >= threshold && onRefresh) {
        setIsRefreshing(true)
        // Add haptic feedback
        if (navigator.vibrate) {
          navigator.vibrate(50)
        }
        
        try {
          await onRefresh()
        } finally {
          setIsRefreshing(false)
        }
      }

      setPullDistance(0)
    }

    container.addEventListener('touchstart', handleTouchStart, { passive: false })
    container.addEventListener('touchmove', handleTouchMove, { passive: false })
    container.addEventListener('touchend', handleTouchEnd)

    return () => {
      container.removeEventListener('touchstart', handleTouchStart)
      container.removeEventListener('touchmove', handleTouchMove)
      container.removeEventListener('touchend', handleTouchEnd)
    }
  }, [isPulling, pullDistance, threshold, onRefresh])

  const pullProgress = Math.min(pullDistance / threshold, 1)
  const shouldRefresh = pullDistance >= threshold

  return {
    containerRef,
    isPulling,
    isRefreshing,
    pullDistance,
    pullProgress,
    shouldRefresh
  }
}