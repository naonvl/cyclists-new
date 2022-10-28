import { getState, setState } from '@/helpers/store'
import { MutableRefObject, useCallback, useLayoutEffect } from 'react'
import type { OrbitControls } from 'three-stdlib'
import { Texture } from 'three/src/textures/Texture'
import type { Group } from 'three/src/objects/Group'
import type { MeshStandardMaterial } from 'three/src/materials/MeshStandardMaterial'
import type { Canvas } from 'fabric/fabric-impl'

interface Props {
  onClick?: (e: MouseEvent) => void
  onTouch?: (e: TouchEvent) => void
  controlsRef: MutableRefObject<OrbitControls>
  groupRef: MutableRefObject<Group>
  textureRef: MutableRefObject<Texture>
  canvasRef: MutableRefObject<Canvas>
}

const useFirstRenderModel = ({
  controlsRef,
  groupRef,
  canvasRef,
  textureRef,
}: Props) => {
  const setupInitialLoad = useCallback(async () => {
    const reqVariants = await fetch('/api/products', { method: 'GET' })
    const resVariants = await reqVariants.json()
    const defaultPrice = resVariants.variants[0].price

    setState({
      variants: resVariants.variants,
      price: Number(defaultPrice),
    })

    textureRef.current = new Texture(canvasRef.current.getElement())
    textureRef.current.flipY = false
    textureRef.current.needsUpdate = true
    canvasRef.current.renderAll()

    setState({ isLoading: false, firstLoadCanvas: false })
  }, [canvasRef, textureRef])
  useLayoutEffect(() => {
    if (
      canvasRef.current &&
      !getState().firstLoadTexture &&
      getState().isLoading
    ) {
      console.log('[MODEL] First render!')
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
  }, [canvasRef, controlsRef, groupRef, setupInitialLoad])
}

export default useFirstRenderModel
