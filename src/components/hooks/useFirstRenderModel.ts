import { getState, setState } from '@/helpers/store'
import { Canvas } from 'fabric/fabric-impl'
import { MutableRefObject, useCallback, useEffect } from 'react'
import { Texture } from 'three/src/textures/Texture'
import { WebGLRenderer } from 'three/src/renderers/WebGLRenderer'

interface Props {
  onClick?: (e: MouseEvent) => void
  onTouch?: (e: TouchEvent) => void
  canvasRef: MutableRefObject<Canvas>
  textureRef: MutableRefObject<Texture>
  gl: WebGLRenderer
}

const useFirstRenderModel = ({
  onClick,
  onTouch,
  canvasRef,
  textureRef,
  gl,
}: Props) => {
  const setupInitialLoad = useCallback(() => {
    canvasRef.current = getState().canvas

    setState({ texture: new Texture(canvasRef.current.getElement()) })
    textureRef.current = getState().texture
    textureRef.current.anisotropy = gl.capabilities.getMaxAnisotropy()
    textureRef.current.flipY = false
    textureRef.current.needsUpdate = true
  }, [canvasRef, gl.capabilities, textureRef])

  useEffect(() => {
    if (getState().canvas && !getState().texture) {
      console.log('[MODEL]: ONLY RENDER ON FIRST TIME!')

      // if (!getState().isMobileVersion) {
      //   document
      //     .getElementsByTagName('canvas')[0]
      //     .addEventListener('mousedown', (e) => {
      //       onClick(e)
      //     })
      // }

      // if (getState().isMobileVersion) {
      //   document
      //     .getElementsByTagName('canvas')[0]
      //     .addEventListener('touchstart', (e) => {
      //       onTouch(e)
      //     })
      // }
      setupInitialLoad()
    }
  }, [onClick, onTouch, setupInitialLoad])
}

export default useFirstRenderModel
