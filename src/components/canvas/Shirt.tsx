/* eslint-disable no-var */
import { Texture } from 'three/src/textures/Texture'
import { useFrame, useLoader, useThree } from '@react-three/fiber'
import { TextureLoader } from 'three/src/loaders/TextureLoader'
import { GLTF, OrbitControls as OrbitControlsImpl } from 'three-stdlib'
import { fabric } from 'fabric'
import useStore from '@/helpers/store'
import { useRef, MutableRefObject, useEffect, useCallback } from 'react'
import {
  useGLTF,
  OrbitControls,
  AdaptiveDpr,
  BakeShadows,
  AdaptiveEvents,
} from '@react-three/drei'
import React from 'react'

type GLTFResult = GLTF & {
  nodes: {
    M740158_mesh_in: THREE.Mesh
    M740158_mesh_out: THREE.Mesh
    M740158_mesh_zipp: THREE.Mesh
    M740158_mesh_zipper: THREE.Mesh
  }
  materials: {
    ['Material.016']: THREE.MeshStandardMaterial
    ['Material.015']: THREE.MeshStandardMaterial
    ['Material.013']: THREE.MeshStandardMaterial
    ['Material.014']: THREE.MeshStandardMaterial
  }
}

interface ShirtProps {
  props?: JSX.IntrinsicElements['group']
  canvasRef: MutableRefObject<fabric.Canvas | null>
  setRay: any
  setActiveText: any
  setEditText: any
  textureRef: MutableRefObject<THREE.Texture>
}

const ShirtComponent = ({
  props,
  canvasRef,
  textureRef,
  setRay,
  setActiveText,
  setEditText,
}: ShirtProps) => {
  const { nodes, materials } = useGLTF(
    '/model/n-cycling-jersey.drc.glb'
  ) as unknown as GLTFResult
  const { camera, gl, pointer, mouse, raycaster } = useThree()
  const groupRef = useRef<THREE.Group>(null)
  const controlsRef = useRef<OrbitControlsImpl>(null)
  const canvasRenderedRef = useRef<HTMLCanvasElement>()
  const inputRef = React.useRef(null)

  // Loading state
  const isLoading = useStore((state) => state.isLoading)
  // Zoom state
  const zoomIn = useStore((state) => state.zoomIn)
  const changeZoomIn = useStore((state) => state.changeZoomIn)
  const zoomOut = useStore((state) => state.zoomOut)
  const changeZoomOut = useStore((state) => state.changeZoomOut)
  const setZoom = useStore((state) => state.setZoom)
  // Rotate state
  const rotateRight = useStore((state) => state.rotateRight)
  const changeRotateRight = useStore((state) => state.changeRotateRight)
  const rotateLeft = useStore((state) => state.rotateLeft)
  const textureChanged = useStore((state) => state.textureChanged)
  const changeRotateLeft = useStore((state) => state.changeRotateLeft)
  // Flip state
  const isObjectFront = useStore((state) => state.isObjectFront)
  const cameraChanged = useStore((state) => state.cameraChanged)
  const setCameraChange = useStore((state) => state.setCameraChange)
  const width = useStore((state) => state.width)
  const scene = useThree((state) => state.scene)
  const colorChanged = useStore((state) => state.colorChanged)
  const setColorChanged = useStore((state) => state.setColorChanged)
  const textChanged = useStore((state) => state.textChanged)
  const setTextChanged = useStore((state) => state.setTextChanged)
  const setIsLoading = useStore((state) => state.setIsLoading)
  const setTextureChanged = useStore((state) => state.setTextureChanged)
  const isMobileVersion = useStore((state) => state.isMobileVersion)
  const dimensions = useStore((state) => state.dimensions)
  // Textures
  const [normalMap] = useLoader(TextureLoader, ['/textures/Jersey_NORMAL.png'])
  const [aoMapout] = useLoader(TextureLoader, ['/textures/ao_out.png'])
  const [aoMapzipp] = useLoader(TextureLoader, ['/textures/ao_zip.png'])
  const [bump] = useLoader(TextureLoader, ['/textures/DisplacementMap.jpg'])

  const getPosition = useCallback(
    (e) => {
      const rect = canvasRenderedRef.current.getBoundingClientRect()
      let clientSize = {
        clientX: e.clientX,
        clientY: e.clientY,
      }
      if (e.changedTouches) {
        clientSize = {
          clientX: e.changedTouches[0].clientX,
          clientY: e.changedTouches[0].clientY,
        }
      }
      const array = [
        (clientSize.clientX - rect.left) / rect.width,
        (clientSize.clientY - rect.top) / rect.height,
      ]
      pointer.fromArray(array)
      // Get intersects
      mouse.set(pointer.x * 2 - 1, -(pointer.y * 2) + 1)
      raycaster.setFromCamera(mouse, camera)
      const intersects = raycaster.intersectObjects(scene.children)
      textureRef.current.needsUpdate = true

      if (intersects.length > 0 && intersects[0].uv) {
        let uv = intersects[0].uv
        setRay(uv)
        return {
          x: Math.round(uv.x * dimensions.width) - 4.5,
          y: Math.round(uv.y * dimensions.height) - 5.5,
        }
      }
      return null
    },
    [
      pointer,
      mouse,
      raycaster,
      camera,
      scene.children,
      textureRef,
      setRay,
      dimensions.width,
      dimensions.height,
    ]
  )

  const handleClick = useCallback(
    (e) => {
      const positionOnScene = getPosition(e)
      if (positionOnScene) {
        const canvasRect = canvasRef.current.getCenter()
        const simEvt = new globalThis.MouseEvent(e.type, {
          clientX: canvasRect.left + positionOnScene.x,
          clientY: canvasRect.top + positionOnScene.y,
        })

        canvasRef.current.getSelectionElement().dispatchEvent(simEvt)
      }
    },
    [canvasRef, getPosition]
  )

  useEffect(() => {
    if (canvasRef.current && !textureRef.current) {
      if (!isMobileVersion) {
        document
          .getElementsByTagName('canvas')[0]
          .addEventListener('mousedown', (e) => {
            handleClick(e)
          })
      }

      if (isMobileVersion) {
        document
          .getElementsByTagName('canvas')[0]
          .addEventListener('touchstart', (e) => {
            handleClick(e)
          })
      }
      canvasRenderedRef.current = document.getElementsByTagName('canvas')[0]
    }

    if (canvasRef.current) {
      textureRef.current = new Texture(canvasRef.current.getElement())
      textureRef.current.anisotropy = gl.capabilities.getMaxAnisotropy()
      textureRef.current.flipY = false
      textureRef.current.needsUpdate = true

      canvasRef.current.renderAll()
      setIsLoading(false)
      setTextureChanged(false)
    }

    if (textureChanged && isLoading) {
      setIsLoading(false)
      setTextureChanged(false)
    }

    if (colorChanged) {
      textureRef.current = new Texture(canvasRef.current.getElement())
      textureRef.current.anisotropy = gl.capabilities.getMaxAnisotropy()
      textureRef.current.flipY = false
      textureRef.current.needsUpdate = true

      canvasRef.current.renderAll()

      setColorChanged(false)
    }

    if (textChanged) {
      setTextChanged(false)
    }
  }, [
    canvasRef,
    colorChanged,
    gl.capabilities,
    handleClick,
    isLoading,
    isMobileVersion,
    setColorChanged,
    setIsLoading,
    setTextChanged,
    setTextureChanged,
    textChanged,
    textureChanged,
    textureRef,
    width,
  ])

  useEffect(() => {
    // if (isMobileVersion) {
    //   document
    //     .getElementsByTagName('canvas')[0]
    //     .addEventListener('touchstart', (e) => {
    //       const rect = canvasRenderedRef.current.getBoundingClientRect()
    //       const array = [
    //         (e.changedTouches[0].clientX - rect.left) / rect.width,
    //         (e.changedTouches[0].clientY - rect.top) / rect.height,
    //       ]
    //       pointer.fromArray(array)
    //       // Get intersects
    //       mouse.set(pointer.x * 2 - 1, -(pointer.y * 2) + 1)
    //       raycaster.setFromCamera(mouse, camera)
    //       const intersects = raycaster.intersectObjects(scene.children)
    //       textureRef.current.needsUpdate = true

    //       if (intersects.length > 0 && intersects[0].uv) {
    //         let uv = intersects[0].uv
    //         setRay(uv)
    //         const positionOnScene = {
    //           x: Math.round(uv.x * 1024) - 4.5,
    //           y: Math.round(uv.y * 1024) - 5.5,
    //         }

    //         const canvasRect = canvasRef.current.getCenter()
    //         const simEvt = new globalThis.MouseEvent(e.type, {
    //           clientX: canvasRect.left + positionOnScene.x,
    //           clientY: canvasRect.top + positionOnScene.y,
    //         })

    //         canvasRef.current.getSelectionElement().dispatchEvent(simEvt)
    //       }
    //       return
    //     })
    // }

    canvasRef.current.on('mouse:down', (e: any) => {
      setActiveText(canvasRef.current.getObjects().indexOf(e.target))
      if (e.target && e.target.text) {
        setEditText(true)
        controlsRef.current.enabled = false
      } else {
        setEditText(false)
        controlsRef.current.enabled = true
      }
    })
  })

  useFrame((state, delta) => {
    controlsRef.current.update()
    setZoom(Math.floor(state.camera.position.z))

    if (colorChanged) {
      state.camera.position.z = state.camera.position.z + 0.001
    }
    if (textChanged) {
      state.camera.position.z = state.camera.position.z + 0.001
    }

    if (!isObjectFront && cameraChanged) {
      state.camera.position.z = -90
      setCameraChange(false)
    }

    if (isObjectFront && cameraChanged) {
      state.camera.position.z = 90
      setCameraChange(false)
    }

    if (controlsRef.current && zoomOut) {
      state.camera.position.x *= 1.1
      state.camera.position.y *= 1.1
      state.camera.position.z *= 1.1
      changeZoomOut(false)
    }

    if (controlsRef.current && zoomIn) {
      state.camera.position.x *= 0.9
      state.camera.position.y *= 0.9
      state.camera.position.z *= 0.9
      changeZoomIn(false)
    }

    if (controlsRef.current && rotateRight) {
      groupRef.current.rotation.y += -Math.PI / 4
      changeRotateRight(false)
    }

    if (controlsRef.current && rotateLeft) {
      groupRef.current.rotation.y += Math.PI / 4
      changeRotateLeft(false)
    }
  })

  // Return the view, these are regular Threejs elements expressed in JSX
  return (
    <>
      <group ref={groupRef} dispose={null} {...props}>
        <mesh
          geometry={nodes.M740158_mesh_in.geometry}
          material={materials['Material.016']}
          scale={100}
        >
          <meshStandardMaterial
            attach='material'
            roughness={1}
            emissive={1}
            bumpMap={bump}
            bumpScale={0.03}
            color='#ccc'
          />
        </mesh>
        <mesh
          ref={inputRef}
          geometry={nodes.M740158_mesh_out.geometry}
          material={materials['Material.015']}
          scale={100}
        >
          <meshStandardMaterial
            attach='material'
            bumpMap={bump}
            bumpScale={0.03}
            roughness={0.7}
            emissive={1}
            map={textureRef.current}
            aoMap={aoMapout}
            aoMapIntensity={0.5}
          >
            <texture attach='map' image={canvasRef.current.getElement()} />
          </meshStandardMaterial>
        </mesh>
        <mesh
          geometry={nodes.M740158_mesh_zipp.geometry}
          material={materials['Material.013']}
          scale={100}
        >
          <meshStandardMaterial
            attach='material'
            normalMap={normalMap}
            normalMap-flipY={false}
            map={textureRef.current}
            aoMap={aoMapzipp}
            aoMapIntensity={0.7}
          >
            <texture attach='map' image={canvasRef.current.getElement()} />
          </meshStandardMaterial>
        </mesh>
        <mesh
          geometry={nodes.M740158_mesh_zipper.geometry}
          material={materials['Material.014']}
          scale={100}
        >
          <meshStandardMaterial
            attach='material'
            normalMap={normalMap}
            normalMap-flipY={false}
            map={textureRef.current}
            aoMap={aoMapzipp}
            aoMapIntensity={0.7}
          >
            <texture attach='map' image={canvasRef.current.getElement()} />
          </meshStandardMaterial>
        </mesh>
      </group>
      <OrbitControls
        ref={controlsRef}
        args={[camera, gl.domElement]}
        minPolarAngle={Math.PI / 2.5}
        maxPolarAngle={Math.PI / 1.9}
        minDistance={20}
        minZoom={20}
        maxDistance={90}
        maxZoom={90}
        enableZoom={true}
        enablePan={false}
        enableDamping={false}
      />
      <BakeShadows />
      <AdaptiveDpr pixelated />
      <AdaptiveEvents />
      {/* <Stats showPanel={0} /> */}
    </>
  )
}

export default ShirtComponent
