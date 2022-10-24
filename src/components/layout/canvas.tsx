import {
  CSSProperties,
  Suspense,
  useState,
  FC,
  useRef,
  useMemo,
  useCallback,
  MouseEvent,
} from 'react'
import { Canvas } from '@react-three/fiber'
import { Environment, Preload } from '@react-three/drei'
import useStore, { setState } from '@/helpers/store'
import Loader from '@/components/canvas/Loader'
import { initPatch } from '@/helpers/patch'
import addText from '@/helpers/addText'
import { getPositionPointer } from '@/helpers/getPositions'

interface CanvasProps {
  children?: React.ReactNode
  style: CSSProperties
  width: number
  props?: React.RefAttributes<HTMLCanvasElement>
}

const LCanvas: FC<CanvasProps> = ({ children, style, width, ...props }) => {
  const canvasRenderedRef = useRef<HTMLCanvasElement>()
  const isAddText = useStore((state) => state.isAddText)
  const canvas = useStore((state) => state.canvas)
  const dimensions = useStore((state) => state.dimensions)
  const activeText = useStore((state) => state.activeText)
  const ray = useStore((state) => state.ray)
  const allText = useStore((state) => state.allText)
  const insertText = useStore((state) => state.insertText)
  const camera = useStore((state) => state.camera)
  const [threeProps, setThreeProps] = useState({
    camera: null,
    pointer: null,
    scene: null,
    raycaster: null,
    mouse: null,
    gl: null,
  })
  const memoizedInitPatch = useMemo(() => {
    initPatch(threeProps, canvasRenderedRef)
  }, [threeProps])

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
        setState({
          ray: {
            x: uv.x,
            y: uv.y,
            z: 0,
          },
        })
        const positionOnScene = {
          x: Math.round(uv.x * dimensions.width) - 4.5,
          y: Math.round(uv.y * dimensions.height) - 5.5,
        }

        const canvasRect = canvas.getCenter()
        // console.log(e.clientX, e.clientY)
        // console.log({
        //   clientX: canvasRect.left + positionOnScene.x,
        //   clientY: canvasRect.top + positionOnScene.y,
        // })
        const simEvt = new globalThis.MouseEvent(e.type, {
          clientX: canvasRect.left + positionOnScene.x,
          clientY: canvasRect.top + positionOnScene.y,
        })

        canvas.getSelectionElement().dispatchEvent(simEvt)
      }
    },
    [
      canvas,
      dimensions.height,
      dimensions.width,
      threeProps.camera,
      threeProps.mouse,
      threeProps.pointer,
      threeProps.raycaster,
      threeProps.scene,
    ]
  )

  return (
    <Canvas
      ref={canvasRenderedRef}
      frameloop='demand'
      performance={{ min: 0.1, max: 0.3 }}
      camera={{ position: [0, 0, 500], fov: 30 }}
      style={style}
      gl={{ preserveDrawingBuffer: true }}
      onClick={(e) => {
        if (isAddText) {
          addText({
            activeText,
            ray,
            dimensions,
            canvas,
            allText,
            insertText,
            camera: threeProps.camera,
          })
        }
      }}
      // onTouchStart={() => memoizedInitPatch}
      onMouseDown={(e) => {
        memoizedInitPatch
        handleClick(e)
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
