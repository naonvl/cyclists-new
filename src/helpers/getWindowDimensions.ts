const getWindowDimensions = () => {
  const innerWidth =
    typeof window !== 'undefined' ? window.innerWidth : undefined

  if (innerWidth < 800) {
    return {
      canvasWidth: 1024,
      canvasHeight: 1024,
      isMobileVersion: true,
    }
  } else {
    return {
      canvasWidth: 2048,
      canvasHeight: 2048,
      isMobileVersion: false,
    }
  }
}

export default getWindowDimensions
