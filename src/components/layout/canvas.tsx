import {
  CSSProperties,
  MutableRefObject,
  Suspense,
  useState,
  FC,
  useRef,
} from 'react'
import { Canvas } from '@react-three/fiber'
import { Environment, Preload } from '@react-three/drei'
import useStore from '@/helpers/store'
import Loader from '@/components/canvas/Loader'
import { initPatch, initMobilePatch } from '@/helpers/patch'

interface CanvasProps {
  children?: React.ReactNode
  style: CSSProperties
  onClick?: () => void
  canvasRef: MutableRefObject<fabric.Canvas>
  width: number
  props?: React.RefAttributes<HTMLCanvasElement>
  setRay: any
  textureRef: MutableRefObject<THREE.Texture>
}

const LCanvas: FC<CanvasProps> = ({
  children,
  style,
  onClick,
  canvasRef,
  width,
  setRay,
  textureRef,
  ...props
}) => {
  const canvasRenderedRef = useRef<HTMLCanvasElement>()
  const isMobileVersion = useStore((state) => state.isMobileVersion)
  const [threeProps, setThreeProps] = useState({
    camera: null,
    pointer: null,
    scene: null,
    raycaster: null,
    mouse: null,
    gl: null,
  })

  return (
    <Canvas
      ref={canvasRenderedRef}
      frameloop='demand'
      performance={{ min: 0.1, max: 0.3 }}
      camera={{ position: [0, 0, 500], fov: 30 }}
      style={style}
      gl={{ preserveDrawingBuffer: true }}
      onClick={onClick}
      onTouchStart={(e) => {
        initMobilePatch(
          e,
          threeProps,
          canvasRef,
          canvasRenderedRef,
          textureRef,
          setRay
        )
      }}
      onMouseDown={(e) => {
        if (!isMobileVersion) {
          initPatch(
            threeProps,
            canvasRef,
            canvasRenderedRef,
            textureRef,
            setRay
          )
        }

        if (isMobileVersion) {
          initMobilePatch(
            e,
            threeProps,
            canvasRef,
            canvasRenderedRef,
            textureRef,
            setRay
          )
        }
      }}
      onCreated={({ camera, pointer, scene, raycaster, gl, mouse }) =>
        setThreeProps({ camera, pointer, scene, raycaster, gl, mouse })
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
