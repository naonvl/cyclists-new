import { MutableRefObject, useCallback, useEffect } from 'react'
import getWindowDimensions from '@/helpers/getWindowDimensions'
import { getState, setState } from '@/helpers/store'
import loadSvg from '@/helpers/loadSvg'
import { initFabricCanvas } from '@/util/fabric'
import { Canvas } from 'fabric/fabric-impl'

interface Props {
  canvasRef: MutableRefObject<Canvas>
  cid: string | number
}

const useFirstRender = ({ canvasRef, cid }: Props) => {
  const setupInitialLoad = useCallback(async () => {
    const reqUser = await fetch(`/api/customers/${cid}`)
    const resUser = await reqUser.json()
    const user = await resUser.user

    if (!user && getState().isLoading) {
      return setState({ isLoading: false })
    }

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
    canvasRef.current = fabricCanvas

    setState({
      canvas: fabricCanvas,
      user: user,
    })
  }, [canvasRef, cid])

  useEffect(() => {
    if (!getState().texture && cid && getState().isLoading) {
      console.log('[DOM] First render!')
      setupInitialLoad()
    }
  }, [cid, setupInitialLoad])
}

export default useFirstRender
