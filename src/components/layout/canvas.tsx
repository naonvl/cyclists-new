import {
  CSSProperties,
  MutableRefObject,
  Suspense,
  MouseEvent,
  useState,
  FC,
  useRef,
  useEffect,
} from 'react'
import { Camera, Canvas } from '@react-three/fiber'
import { Environment, Preload, OrbitControls } from '@react-three/drei'
import useStore from '@/helpers/store'
import {
  getMousePosition,
  getIntersects,
  getRealPosition,
  getPositionOnScene,
} from '@/util/fabric'
import Loader from '@/components/canvas/Loader'
import { fabric } from 'fabric'

interface CanvasProps {
  children?: React.ReactNode
  style: CSSProperties
  onClick?: () => void
  canvasRef: MutableRefObject<fabric.Canvas>
  width: number
  props?: React.RefAttributes<HTMLCanvasElement>
}

const LCanvas: FC<CanvasProps> = ({
  children,
  style,
  onClick,
  canvasRef,
  width,
  ...props
}) => {
  const canvasRenderedRef = useRef<HTMLCanvasElement>()
  const isLoading = useStore((state) => state.isLoading)
  const isMobileVersion = useStore((state) => state.isMobileVersion)
  const [threeProps, setThreeProps] = useState({
    camera: null,
    pointer: null,
    scene: null,
    raycaster: null,
    gl: null,
  })

  // const initPatch = (
  //   event: MouseEvent<HTMLDivElement, globalThis.MouseEvent>
  // ) => {
  //   const { camera, pointer, scene, raycaster } = threeProps
  //   if (!camera || !pointer || !scene || !raycaster) {
  //     return
  //   }

  //   fabric.Object.prototype.transparentCorners = false
  //   fabric.Object.prototype.cornerColor = 'blue'
  //   fabric.Object.prototype.cornerStyle = 'circle'
  //   fabric.Object.prototype.width = 150
  //   if (isMobileVersion) {
  //     fabric.Object.prototype.cornerSize = 20
  //   } else {
  //     fabric.Object.prototype.cornerSize = 18
  //   }

  //   if (event.type === 'mousedown') {
  //     event.target.addEventListener('mousedown', (e) => {
  //       const positionOnScene = getPositionOnScene(
  //         scene,
  //         pointer,
  //         raycaster,
  //         camera,
  //         canvasRenderedRef.current.getBoundingClientRect,
  //         e
  //       )

  //       if (positionOnScene) {
  //         const canvasRect = canvasRef.current.getCenter()
  //         const simEvt = new globalThis.MouseEvent(event.type, {
  //           clientX: canvasRect.left + positionOnScene.x,
  //           clientY: canvasRect.left + positionOnScene.y,
  //         })

  //         canvasRef.current.getSelectionElement().dispatchEvent(simEvt)
  //       }
  //     })
  //   }

  //   const simEvt = new globalThis.MouseEvent(event.type, {
  //     bubbles: true,
  //     cancelable: true,
  //     view: window,
  //     detail: 1,
  //     screenX: Math.round(event.screenX),
  //     screenY: Math.round(event.screenY),
  //     clientX: Math.round(event.clientX),
  //     clientY: Math.round(event.clientY),
  //     ctrlKey: false,
  //     altKey: false,
  //     shiftKey: false,
  //     metaKey: false,
  //     button: 0,
  //     relatedTarget: null,
  //   })
  //   canvasRef.current.getElement().dispatchEvent(simEvt)
  //   event.target.addEventListener('mousedown', (e) => {
  //     return handleMouseDown(simEvt)
  //   })

  //   fabric.Canvas.prototype.getPointer = (e, ignoreZoom) => {
  //     let pointerFabric = fabric.util.getPointer(
  //       e,
  //       canvasRef.current.getSelectionElement()
  //     )
  //     const upperCanvasEl = canvasRef.current.getSelectionElement()
  //     const bounds = upperCanvasEl.getBoundingClientRect()
  //     let boundsWidth = bounds.width || 0
  //     let boundsHeight = bounds.height || 0
  //     let cssScale = {
  //       width: upperCanvasEl.width / boundsWidth,
  //       height: upperCanvasEl.height / boundsHeight,
  //     }

  //     if (!boundsWidth || !boundsHeight) {
  //       if ('top' in bounds && 'bottom' in bounds) {
  //         boundsHeight = Math.abs(bounds.top - bounds.bottom)
  //       }

  //       if ('right' in bounds && 'left' in bounds) {
  //         boundsWidth = Math.abs(bounds.right - bounds.left)
  //       }
  //     }

  //     // canvasRef.current.calcOffset()
  //     pointerFabric.x = pointerFabric.x - canvasRef.current.getCenter().left
  //     pointerFabric.x = pointerFabric.y - canvasRef.current.getCenter().top

  //     if (boundsWidth === 0 || boundsHeight === 0) {
  //       cssScale = { width: 1, height: 1 }
  //     }

  //     return {
  //       x: pointerFabric.x * cssScale.width,
  //       y: pointerFabric.y * cssScale.height,
  //     }
  //   }
  // }

  // const handleMouseDown = (e: globalThis.MouseEvent) => {
  //   const { camera, pointer, scene, raycaster } = threeProps
  //   if (!camera || !pointer || !scene || !raycaster) {
  //     return
  //   }

  //   const arrayMousePosition = getMousePosition(
  //     canvasRenderedRef.current.getBoundingClientRect(),
  //     e.clientX,
  //     e.clientY
  //   )

  //   pointer.fromArray(arrayMousePosition)

  //   const intersects = getIntersects(raycaster, camera, pointer, scene.children)

  //   if (intersects.length <= 0) {
  //     return
  //   }

  //   const uv = intersects[0].uv
  //   const positionOnScene = {
  //     x: getRealPosition('x', uv.x),
  //     y: getRealPosition('y', uv.y),
  //   }

  //   const canvasRect = canvasRef.current.getCenter()
  //   const simEvt = new globalThis.MouseEvent('mousedown', {
  //     clientX: canvasRect.left + positionOnScene.x,
  //     clientY: canvasRect.top + positionOnScene.y,
  //   })

  //   return canvasRef.current.getSelectionElement().dispatchEvent(simEvt)
  // }

  return (
    <Canvas
      ref={canvasRenderedRef}
      frameloop='demand'
      performance={{ min: 0.1, max: 0.3 }}
      camera={{ position: [0, 0, 500], fov: 30 }}
      style={style}
      gl={{ preserveDrawingBuffer: true }}
      onClick={onClick}
      // onMouseMove={(e) => initPatch(e)}
      onCreated={({ camera, pointer, scene, raycaster, gl }) =>
        setThreeProps({ camera, pointer, scene, raycaster, gl })
      }
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
        <Preload all />
        {/* {isLoading ? <Loader /> : children} */}
        {children}
      </Suspense>
    </Canvas>
  )
}

export default LCanvas
