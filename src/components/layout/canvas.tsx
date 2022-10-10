import { Canvas } from '@react-three/fiber'
import { Environment, Preload } from '@react-three/drei'

const LCanvas = ({ children, style, onClick }) => {
  return (
    <Canvas
      frameloop='demand'
      performance={{ min: 0.1, max: 0.3 }}
      camera={{ position: [0, 0, 500], fov: 30 }}
      style={style}
      gl={{ preserveDrawingBuffer: true }}
      onClick={onClick}
      id='rendered'
    >
      {/* <LControl /> */}
      <spotLight
        intensity={0.5}
        angle={0.3}
        penumbra={1}
        position={[10, 50, 50]}
        castShadow
      />
      {/* <spotLight
        intensity={0.5}
        angle={0.3}
        penumbra={1}
        position={[10, 50, -50]}
        castShadow
      /> */}
      <ambientLight intensity={0.4} />
      <Environment preset='city' />
      <Preload all />
      {children}
    </Canvas>
  )
}

export default LCanvas
