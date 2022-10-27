import { useCallback, useEffect } from 'react'
import getWindowDimensions from '@/helpers/getWindowDimensions'
import { getState, setState } from '@/helpers/store'
import loadSvg from '@/helpers/loadSvg'
import { initFabricCanvas } from '@/util/fabric'
import { ICanvas, ITexture } from '@/interfaces'

interface Props extends ICanvas, ITexture {}

const useFirstRender = ({ canvasRef, textureRef }: Props) => {
  const setupInitialLoad = useCallback(async () => {
    const { canvasWidth, canvasHeight, isMobileVersion } = getWindowDimensions()

    setState({
      dimensions: { width: canvasWidth, height: canvasHeight },
      isMobileVersion,
      texturePath: 1,
    })

    const fabricCanvas = initFabricCanvas({
      width: getState().dimensions.width,
      height: getState().dimensions.height,
    })

    canvasRef.current = fabricCanvas

    loadSvg({ canvasRef, textureRef })

    setState({
      firstLoadCanvas: true,
    })
  }, [canvasRef, textureRef])

  useEffect(() => {
    if (!getState().firstLoadCanvas && getState().isLoading) {
      console.log('[DOM] First render!')
      setupInitialLoad()
    }
  }, [setupInitialLoad])
}

export default useFirstRender
