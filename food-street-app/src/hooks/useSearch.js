import { useState, useEffect, useRef } from 'react'

export const useVoiceSearch = (onResult, onError) => {
  const [isListening, setIsListening] = useState(false)
  const [isSupported, setIsSupported] = useState(false)
  const recognitionRef = useRef(null)

  useEffect(() => {
    // Check if Speech Recognition is supported
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    
    if (SpeechRecognition) {
      setIsSupported(true)
      recognitionRef.current = new SpeechRecognition()
      
      const recognition = recognitionRef.current
      recognition.continuous = false
      recognition.interimResults = false
      recognition.lang = 'en-US'
      
      recognition.onstart = () => {
        setIsListening(true)
        // Haptic feedback
        if (navigator.vibrate) {
          navigator.vibrate(50)
        }
      }
      
      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript
        onResult?.(transcript)
        // Success haptic feedback
        if (navigator.vibrate) {
          navigator.vibrate([25, 25, 25])
        }
      }
      
      recognition.onerror = (event) => {
        onError?.(event.error)
        // Error haptic feedback
        if (navigator.vibrate) {
          navigator.vibrate([100, 50, 100])
        }
      }
      
      recognition.onend = () => {
        setIsListening(false)
      }
    }
    
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort()
      }
    }
  }, [onResult, onError])

  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      recognitionRef.current.start()
    }
  }

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop()
    }
  }

  return {
    isListening,
    isSupported,
    startListening,
    stopListening
  }
}

export const useAutocomplete = (searchTerm, options = []) => {
  const [suggestions, setSuggestions] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (!searchTerm || searchTerm.length < 2) {
      setSuggestions([])
      return
    }

    setIsLoading(true)
    
    // Simulate API delay
    const timeoutId = setTimeout(() => {
      const filtered = options.filter(option => 
        option.toLowerCase().includes(searchTerm.toLowerCase())
      ).slice(0, 8) // Limit to 8 suggestions
      
      setSuggestions(filtered)
      setIsLoading(false)
    }, 150)

    return () => clearTimeout(timeoutId)
  }, [searchTerm, options])

  return { suggestions, isLoading }
}