import { useCallback, useEffect } from 'react'
import getWindowDimensions from '@/helpers/getWindowDimensions'
import { getState, setState } from '@/helpers/store'
import loadSvg from '@/helpers/loadSvg'
import { initFabricCanvas } from '@/util/fabric'
import { Texture } from 'three/src/textures/Texture'

const useFirstRender = () => {
  const setupInitialLoad = useCallback(() => {
    const { canvasWidth, canvasHeight, isMobileVersion } = getWindowDimensions()

    setState({
      dimensions: { width: canvasWidth, height: canvasHeight },
      isMobileVersion,
      texturePath: 1,
    })

    loadSvg()

    const fabricCanvas = initFabricCanvas({
      width: getState().dimensions.width,
      height: getState().dimensions.height,
    })

    setState({
      canvas: fabricCanvas,
    })
  }, [])

  useEffect(() => {
    if (!getState().texture) {
      console.log('[DOM]: ONLY RENDER ON FIRST TIME!')
      setupInitialLoad()
    }
  }, [setupInitialLoad])
}

export default useFirstRender
