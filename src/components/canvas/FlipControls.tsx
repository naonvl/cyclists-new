import { useCallback, useState } from 'react'
import { Html } from '@react-three/drei'
import { useFrame, useThree } from '@react-three/fiber'

const FlipControls = ({ controlsRef }: { controlsRef: any }) => {
  const [view, setView] = useState('front')
  const camera = useThree((state) => state.camera)

  const flipStatus = useCallback((param: string) => {
    setView(param)
  }, [])

  useFrame((state) => {
    if (state.camera.position.z > -1) {
      flipStatus('front')
    } else {
      flipStatus('back')
    }
  })

  const handleflipCamera = () => {
    if (view == 'front') {
      camera.position.z = -90
      controlsRef.current.update()
    }
    if (view == 'back') {
      camera.position.z = 90
      controlsRef.current.update()
    }
  }

  return (
    <Html>
      <button
        type='button'
        className='absolute z-30 px-3 text-sm font-bold text-gray-800 uppercase bg-white cursor-pointer top-[1rem] left-[4rem]'
        onClick={handleflipCamera}
      >
        view {view == 'front' ? 'back' : 'front'}
      </button>
    </Html>
  )
}

export default FlipControls
