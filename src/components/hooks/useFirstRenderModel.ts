import { getState, setState } from '@/helpers/store'
import { MutableRefObject, useCallback, useEffect } from 'react'
import type { OrbitControls } from 'three-stdlib'
import { Texture } from 'three/src/textures/Texture'
import type { Group } from 'three/src/objects/Group'
import type { MeshStandardMaterial } from 'three/src/materials/MeshStandardMaterial'
import type { Canvas } from 'fabric/fabric-impl'

interface Props {
  onClick?: (e: MouseEvent) => void
  onTouch?: (e: TouchEvent) => void
  textureRef: MutableRefObject<Texture>
  controlsRef: MutableRefObject<OrbitControls>
  groupRef: MutableRefObject<Group>
  canvasRef: MutableRefObject<Canvas>
  materialRef: MutableRefObject<MeshStandardMaterial>
}

const useFirstRenderModel = ({
  onClick,
  onTouch,
  textureRef,
  controlsRef,
  groupRef,
  canvasRef,
  materialRef,
}: Props) => {
  const setupInitialLoad = useCallback(async () => {
    const reqVariants = await fetch('/api/products', { method: 'GET' })
    const resVariants = await reqVariants.json()
    const defaultPrice = resVariants.variants[0].price

    setState({
      variants: resVariants.variants,
      price: Number(defaultPrice),
    })

    setState({
      texture: new Texture(canvasRef.current.getElement()),
    })
    textureRef.current = getState().texture
    textureRef.current.flipY = false
    textureRef.current.needsUpdate = true

    setState({ isLoading: false })
  }, [canvasRef, textureRef])

  const setupRefs = useCallback(() => {
    setState({
      controls: controlsRef.current,
      group: groupRef.current,
      material: materialRef.current,
    })
  }, [controlsRef, groupRef, materialRef])

  useEffect(() => {
    if (getState().canvas && !getState().texture) {
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

    if (!getState().controls && !getState().group && !getState().material) {
      console.log('[SCENE] First Render only!')
      setupRefs()
    }
  }, [onClick, onTouch, setupInitialLoad, setupRefs])
}

export default useFirstRenderModel
