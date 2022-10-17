import { useState, useEffect, useCallback, MutableRefObject } from 'react'
import useStore from '@/helpers/store'

const useWindowDimensions = (): boolean => {
  const hasWindow = typeof window !== 'undefined'
  const setDimensions = useStore((state) => state.setDimensions)
  const setTexture = useStore((state) => state.setTexture)

  const getWindowDimensions = useCallback(() => {
    const width = hasWindow ? window.innerWidth : undefined

    if (width < 800) {
      setDimensions({ width: 1024, height: 1024 })
      setTexture({
        path: 1,
        width: 1024,
        height: 1024,
      })
      return true
    }

    setTexture({
      path: 1,
      width: 2048,
      height: 2048,
    })
    return false
  }, [hasWindow, setDimensions, setTexture])

  const [windowDimensions, setWindowDimensions] = useState(
    getWindowDimensions()
  )

  useEffect(() => {
    if (hasWindow) {
      setWindowDimensions(getWindowDimensions())
    }
  }, [getWindowDimensions, hasWindow])

  return windowDimensions
}

export default useWindowDimensions
