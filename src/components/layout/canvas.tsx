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
import THREE, { ACESFilmicToneMapping, NoToneMapping } from 'three'

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
  const isMobileVersion = useStore((state) => state.isMobileVersion)
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

  return (
    <Canvas
      ref={canvasRenderedRef}
      frameloop='demand'
      performance={{ min: 0.1, max: 0.3 }}
      camera={{ position: [0, 0, 500], fov: 30 }}
      style={style}
      gl={{
        antialias: true,
        toneMapping: NoToneMapping,
        physicallyCorrectLights: true
      }}
      onPointerDown={(e) => {
        e.stopPropagation()
        if (!isMobileVersion) {
          memoizedInitPatch
        }
      }}
      onCreated={({ camera, pointer, scene, raycaster, gl, mouse }) => {
        setThreeProps({ camera, pointer, scene, raycaster, gl, mouse })
      }}
      id='rendered'
      {...props}
    >
      <Suspense fallback={<Loader />}>
        <directionalLight
          intensity={1}
          position={[50, 50, 50]}
        />
        <directionalLight
          intensity={1}
          position={[-50, 50, -50]}
        />
        <ambientLight intensity={0.7} />
        {children}
        <Preload all />
      </Suspense>
    </Canvas>
  )
}

export default LCanvas
