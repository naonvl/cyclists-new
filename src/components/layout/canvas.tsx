import {
  CSSProperties,
  Suspense,
  useState,
  FC,
  useRef,
  useMemo,
  MutableRefObject,
  useCallback,
  MouseEvent,
  useEffect,
} from 'react'
import { Environment, Preload } from '@react-three/drei'
import Loader from '@/components/canvas/Loader'
import { initPatch } from '@/helpers/patch'
import { Canvas } from '@react-three/fiber'
import useStore, { setState } from '@/helpers/store'
import type { Canvas as FabriCanvas } from 'fabric/fabric-impl'
import { Texture } from 'three/src/textures/Texture'

interface CanvasProps {
  children?: React.ReactNode
  style: CSSProperties
  canvasRef: MutableRefObject<FabriCanvas>
  textureRef: MutableRefObject<Texture>
  props?: React.RefAttributes<HTMLCanvasElement>
}

const LCanvas: FC<CanvasProps> = ({
  children,
  style,
  canvasRef,
  textureRef,
  ...props
}) => {
  const canvasRenderedRef = useRef<HTMLCanvasElement>()
  const dimensions = useStore((state) => state.dimensions)
  const [threeProps, setThreeProps] = useState({
    camera: null,
    pointer: null,
    scene: null,
    raycaster: null,
    mouse: null,
    gl: null,
  })

  const memoizedInitPatch = useMemo(() => {
    initPatch({ threeProps, canvasRenderedRef, canvasRef, textureRef })
  }, [canvasRef, textureRef, threeProps])

  const handleClick = useCallback(
    (e: MouseEvent<HTMLDivElement, globalThis.MouseEvent>) => {
      const rect = canvasRenderedRef.current.getBoundingClientRect()
      const array = [
        (e.clientX - rect.left) / rect.width,
        (e.clientY - rect.top) / rect.height,
      ]
      threeProps.pointer.fromArray(array)
      // Get intersects
      threeProps.mouse.set(
        threeProps.pointer.x * 2 - 1,
        -(threeProps.pointer.y * 2) + 1
      )
      threeProps.raycaster.setFromCamera(threeProps.mouse, threeProps.camera)
      const intersects = threeProps.raycaster.intersectObjects(
        threeProps.scene.children
      )
      // getState().updateTexture()

      if (intersects.length > 0 && intersects[0].uv) {
        let uv = intersects[0].uv
        canvasRef.current.renderAll()
        textureRef.current = new Texture(canvasRef.current.getElement())
        textureRef.current.flipY = false
        textureRef.current.needsUpdate = true
        setState({ changed: true })
        const positionOnScene = {
          x: Math.round(uv.x * dimensions.width) - 4.5,
          y: Math.round(uv.y * dimensions.height) - 5.5,
        }

        const canvasRect = canvasRef.current.getCenter()
        // console.log(e.clientX, e.clientY)
        // console.log({
        //   clientX: canvasRect.left + positionOnScene.x,
        //   clientY: canvasRect.top + positionOnScene.y,
        // })
        const simEvt = new globalThis.MouseEvent(e.type, {
          clientX: canvasRect.left + positionOnScene.x,
          clientY: canvasRect.top + positionOnScene.y,
        })

        canvasRef.current.getSelectionElement().dispatchEvent(simEvt)
      }
    },
    [canvasRef, dimensions, textureRef, threeProps]
  )

  return (
    <Canvas
      ref={canvasRenderedRef}
      frameloop='demand'
      performance={{ min: 0.1, max: 0.3 }}
      camera={{ position: [0, 0, 500], fov: 30 }}
      style={style}
      gl={{
        antialias: true,
      }}
      onMouseDown={(e) => {
        e.stopPropagation()
        memoizedInitPatch
      }}
      onCreated={({ camera, pointer, scene, raycaster, gl, mouse }) => {
        setThreeProps({ camera, pointer, scene, raycaster, gl, mouse })
      }}
      id='rendered'
      {...props}
    >
      <Suspense fallback={<Loader />}>
        <spotLight
          intensity={0.5}
          angle={0.3}
          penumbra={1}
          position={[10, 50, 50]}
          castShadow
        />
        <ambientLight intensity={0.4} />
        <Environment preset='city' />
        {children}
        <Preload all />
      </Suspense>
    </Canvas>
  )
}

export default LCanvas
