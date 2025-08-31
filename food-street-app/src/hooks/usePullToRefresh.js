import { useState, useEffect, useRef, useCallback } from 'react'

export const usePullToRefresh = (onRefresh, threshold = 80) => {
  const [isPulling, setIsPulling] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [pullDistance, setPullDistance] = useState(0)
  const [pullProgress, setPullProgress] = useState(0)
  const [shouldRefresh, setShouldRefresh] = useState(false)
  
  const containerRef = useRef(null)
  const startY = useRef(0)
  const currentY = useRef(0)
  const isAtTop = useRef(false)

  // Check if user is at the very top of the page
  const checkIfAtTop = useCallback(() => {
    if (containerRef.current) {
      const scrollTop = containerRef.current.scrollTop || window.pageYOffset
      isAtTop.current = scrollTop <= 0
    }
  }, [])

  // Handle touch start
  const handleTouchStart = useCallback((e) => {
    checkIfAtTop()
    
    // Only allow pull-to-refresh if at the very top
    if (!isAtTop.current) return
    
    startY.current = e.touches[0].clientY
    currentY.current = e.touches[0].clientY
    setIsPulling(true)
  }, [checkIfAtTop])

  // Handle touch move
  const handleTouchMove = useCallback((e) => {
    if (!isPulling || !isAtTop.current) return
    
    currentY.current = e.touches[0].clientY
    const distance = Math.max(0, currentY.current - startY.current)
    
    // Only allow downward pull (positive distance)
    if (distance > 0) {
      setPullDistance(distance)
      setPullProgress(Math.min(distance / threshold, 1))
      setShouldRefresh(distance >= threshold)
      
      // Prevent default scrolling when pulling down
      if (distance > 10) {
        e.preventDefault()
      }
    }
  }, [isPulling, threshold])

  // Handle touch end
  const handleTouchEnd = useCallback(async () => {
    if (!isPulling) return
    
    setIsPulling(false)
    
    if (shouldRefresh && onRefresh) {
      setIsRefreshing(true)
      try {
        await onRefresh()
      } catch (error) {
        console.error('Pull-to-refresh error:', error)
      } finally {
        setIsRefreshing(false)
      }
    }
    
    // Reset states
    setPullDistance(0)
    setPullProgress(0)
    setShouldRefresh(false)
  }, [isPulling, shouldRefresh, onRefresh])

  // Add event listeners
  useEffect(() => {
    const container = containerRef.current || document.documentElement
    
    // Add touch event listeners
    container.addEventListener('touchstart', handleTouchStart, { passive: false })
    container.addEventListener('touchmove', handleTouchMove, { passive: false })
    container.addEventListener('touchend', handleTouchEnd, { passive: true })
    
    // Add scroll listener to check position
    const handleScroll = () => checkIfAtTop()
    container.addEventListener('scroll', handleScroll, { passive: true })
    
    return () => {
      container.removeEventListener('touchstart', handleTouchStart)
      container.removeEventListener('touchmove', handleTouchMove)
      container.removeEventListener('touchend', handleTouchEnd)
      container.removeEventListener('scroll', handleScroll)
    }
  }, [handleTouchStart, handleTouchMove, handleTouchEnd, checkIfAtTop])

  return {
    containerRef,
    isPulling,
    isRefreshing,
    pullDistance,
    pullProgress,
    shouldRefresh
  }
}