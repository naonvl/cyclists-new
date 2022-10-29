import { getState, setState } from '@/helpers/store'
import { MutableRefObject, useCallback, useEffect } from 'react'
import type { OrbitControls } from 'three-stdlib'
import { Texture } from 'three/src/textures/Texture'
import type { Group } from 'three/src/objects/Group'
import type { MeshStandardMaterial } from 'three/src/materials/MeshStandardMaterial'
import type { Canvas } from 'fabric/fabric-impl'

interface Props {
  handleClick?: (e: MouseEvent | TouchEvent) => void
  onTouch?: (e: TouchEvent) => void
  controlsRef: MutableRefObject<OrbitControls>
  textureRef: MutableRefObject<Texture>
  groupRef: MutableRefObject<Group>
  canvasRef: MutableRefObject<Canvas>
}

const useFirstRenderModel = ({
  controlsRef,
  groupRef,
  canvasRef,
  textureRef,
  handleClick,
}: Props) => {
  const setupInitialLoad = useCallback(async () => {
    const reqVariants = await fetch('/api/products', { method: 'GET' })
    const resVariants = await reqVariants.json()
    const defaultPrice = resVariants.variants[0].price

    setState({
      variants: resVariants.variants,
      price: Number(defaultPrice),
    })
    setState({ isLoading: false, firstLoadTexture: true })
  }, [])

  useEffect(() => {
    if (
      canvasRef.current &&
      !getState().firstLoadTexture &&
      getState().isLoading
    ) {
      if (canvasRef.current && !textureRef.current) {
        if (!getState().isMobileVersion) {
          document
            .getElementsByTagName('canvas')[0]
            .addEventListener('mousedown', (e) => {
              handleClick(e)
            })
        }

        if (getState().isMobileVersion) {
          document
            .getElementsByTagName('canvas')[0]
            .addEventListener('touchstart', (e) => {
              handleClick(e)
            })
        }
      }
      setupInitialLoad()
    }
  }, [
    canvasRef,
    controlsRef,
    groupRef,
    handleClick,
    setupInitialLoad,
    textureRef,
  ])
}

export default useFirstRenderModel
