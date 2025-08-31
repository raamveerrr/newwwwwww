import { useState, useEffect, useRef } from 'react'

export const usePullToRefresh = (onRefresh, threshold = 80) => {
  // Pull-to-refresh functionality is disabled
  // Return disabled states and refs without event listeners
  const containerRef = useRef(null)

  // No useEffect for touch events - functionality is disabled
  
  // Return consistent disabled states
  return {
    containerRef,
    isPulling: false,
    isRefreshing: false,
    pullDistance: 0,
    pullProgress: 0,
    shouldRefresh: false
  }
}