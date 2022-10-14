import {
  CSSProperties,
  MutableRefObject,
  Suspense,
  MouseEvent,
  useState,
  FC,
} from 'react'
import { Camera, Canvas } from '@react-three/fiber'
import { Environment, Preload } from '@react-three/drei'
import useStore from '@/helpers/store'
import { getMousePosition, getIntersects, getRealPosition } from '@/util/fabric'
import Loader from '@/components/canvas/Loader'
import { fabric } from 'fabric'

interface CanvasProps {
  children?: React.ReactNode
  style: CSSProperties
  onClick: () => void
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
  const isLoading = useStore((state) => state.isLoading)
  const [threeProps, setThreeProps] = useState({
    camera: null,
    pointer: null,
    scene: null,
    raycaster: null,
  })

  const initPatch = (event: any) => {
    fabric.Object.prototype.transparentCorners = false
    fabric.Object.prototype.cornerColor = 'blue'
    fabric.Object.prototype.cornerStyle = 'circle'
    if (width < 800) {
      fabric.Object.prototype.cornerSize = 20
    } else {
      fabric.Object.prototype.cornerSize = 18
    }
  }

  const handleMouseDown = (
    e: MouseEvent<HTMLDivElement, globalThis.MouseEvent>
  ) => {
    const { camera, pointer, scene, raycaster } = threeProps
    if (!camera || !pointer || !scene || !raycaster) {
      return
    }

    const arrayMousePosition = getMousePosition(
      e.currentTarget.getBoundingClientRect(),
      e.clientX,
      e.clientY
    )

    pointer.fromArray(arrayMousePosition)

    const intersects = getIntersects(raycaster, camera, pointer, scene.children)

    if (intersects.length <= 0) {
      return
    }

    const uv = intersects[0].uv
    // setRay(uv)
    // if (intersects[0].object.material.map) {
    //   intersects[0].object.material.map.transformUv(uv)
    // }
    // const circle = new fabric.Circle({
    //   radius: 20,
    //   left: getRealPosition(width, 'x', uv.x),
    //   top: getRealPosition(width, 'y', uv.y),
    //   fill: 'red',
    // })
    // canvasRef.current.add(circle)
    // canvasRef.current.renderAll()
    // canvasRef.current.setActiveObject(circle)

    const positionOnScene = {
      x: getRealPosition(width, 'x', uv.x),
      y: getRealPosition(width, 'y', uv.y),
    }

    const canvasRect = canvasRef.current.getCenter()
    const simEvt = new globalThis.MouseEvent('mousedown', {
      clientX: canvasRect.left + positionOnScene.x,
      clientY: canvasRect.top + positionOnScene.y,
    })

    return canvasRef.current.getSelectionElement().dispatchEvent(simEvt)
  }

  return (
    <Canvas
      frameloop='demand'
      performance={{ min: 0.1, max: 0.3 }}
      camera={{ position: [0, 0, 500], fov: 30 }}
      style={style}
      gl={{ preserveDrawingBuffer: true }}
      onClick={onClick}
      // onMouseDown={(e) => handleMouseDown(e)}
      // onMouseMove={(e) => initPatch(e)}
      onCreated={({ camera, pointer, scene, raycaster }) =>
        setThreeProps({ camera, pointer, scene, raycaster })
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
        {isLoading ? <Loader /> : children}
      </Suspense>
    </Canvas>
  )
}

export default LCanvas
