// Disabled swipe gestures to prevent interference with normal scrolling
// These were causing pull-to-refresh and other mobile UX issues

export function useSwipeGesture() {
  return { current: null }
}

export function useEdgeSwipe() {
  return null
}

export function useLongPress() {
  return {
    elementRef: { current: null },
    isLongPress: false
  }
}