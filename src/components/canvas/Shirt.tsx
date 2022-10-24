import React from 'react'
import { Texture } from 'three/src/textures/Texture'
import { Canvas } from 'fabric/fabric-impl'
import { useFrame, useLoader, useThree } from '@react-three/fiber'
import { TextureLoader } from 'three/src/loaders/TextureLoader'
import { GLTF, OrbitControls as OrbitControlsImpl } from 'three-stdlib'
import { getState, setState } from '@/helpers/store'
import { useRef, useEffect, useCallback } from 'react'
import { getPositionPointer, getPositionTouch } from '@/helpers/getPositions'
import useFirstRenderModel from '@/components/hooks/useFirstRenderModel'
import { subscribe } from '@/helpers/store'
import type { Group } from 'three/src/objects/Group'
import FlipControls from '@/components/canvas/FlipControls'
import {
  useGLTF,
  OrbitControls,
  AdaptiveDpr,
  BakeShadows,
  AdaptiveEvents,
  Stats,
} from '@react-three/drei'

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
}

const ShirtComponent = ({ props }: ShirtProps) => {
  const { nodes, materials } = useGLTF(
    '/model/n-cycling-jersey.drc.glb'
  ) as unknown as GLTFResult
  const { camera, gl, pointer, mouse, raycaster, scene } = useThree()
  const groupRef = useRef<Group>(null)
  const canvasRef = useRef<Canvas>(getState().canvas)
  const textureRef = useRef<Texture>(getState().texture) // default: null
  const controlsRef = useRef<OrbitControlsImpl>(null)
  const canvasRenderedRef = useRef<HTMLCanvasElement>(
    document.getElementsByTagName('canvas')[0]
  )
  const inputRef = React.useRef(null)

  // Textures
  const [normalMap] = useLoader(TextureLoader, ['/textures/Jersey_NORMAL.png'])
  const [aoMapout] = useLoader(TextureLoader, ['/textures/ao_out.png'])
  const [aoMapzipp] = useLoader(TextureLoader, ['/textures/ao_zip.png'])
  const [bump] = useLoader(TextureLoader, ['/textures/DisplacementMap.jpg'])

  // const handleClick = useCallback(
  //   (e: MouseEvent) => {
  //     const rect = canvasRenderedRef.current.getBoundingClientRect()
  //     const positionOnScene = getPositionPointer(
  //       e,
  //       rect,
  //       pointer,
  //       mouse,
  //       raycaster,
  //       scene,
  //       camera
  //     )
  //     if (positionOnScene) {
  //       const canvasRect = canvasRef.current.getCenter()
  //       const simEvt = new globalThis.MouseEvent(e.type, {
  //         clientX: canvasRect.left + positionOnScene.x,
  //         clientY: canvasRect.top + positionOnScene.y,
  //       })

  //       canvasRef.current.getSelectionElement().dispatchEvent(simEvt)
  //     }
  //   },
  //   [camera, mouse, pointer, raycaster, scene]
  // )

  // const handleTouch = useCallback(
  //   (e: TouchEvent) => {
  //     const rect = canvasRenderedRef.current.getBoundingClientRect()
  //     const positionOnScene = getPositionTouch(
  //       e,
  //       rect,
  //       pointer,
  //       mouse,
  //       raycaster,
  //       scene,
  //       camera
  //     )
  //     if (positionOnScene) {
  //       const canvasRect = canvasRef.current.getCenter()
  //       const simEvt = new globalThis.MouseEvent(e.type, {
  //         clientX: canvasRect.left + positionOnScene.x,
  //         clientY: canvasRect.top + positionOnScene.y,
  //       })

  //       canvasRef.current.getSelectionElement().dispatchEvent(simEvt)
  //     }
  //   },
  //   [camera, mouse, pointer, raycaster, scene]
  // )

  useFirstRenderModel({
    // onClick: handleClick,
    // onTouch: handleTouch,
    canvasRef,
    textureRef,
    gl,
  })

  useEffect(
    () =>
      subscribe((state) => {
        canvasRef.current = state.canvas
        textureRef.current = state.texture
        // canvasRef.current.on('mouse:down', (e: any) => {
        //   const indexActiveObject = canvasRef.current
        //     .getObjects()
        //     .indexOf(e.target)

        //   if (
        //     state.canvas._iTextInstances &&
        //     state.canvas._iTextInstances.length > 0
        //   ) {
        //     state.canvas.setActiveObject(
        //       state.canvas._iTextInstances[indexActiveObject]
        //     )
        //   }

        //   if (e.target && e.target.text) {
        //     state.activeText = state.canvas.getActiveObject()
        //     state.editText = true
        //     // setState({
        //     //   activeText: state.canvas.getActiveObject(),
        //     //   editText: true,
        //     // })
        //     controlsRef.current.enabled = false
        //   } else {
        //     setState({
        //       editText: false,
        //     })
        //     state.resetActiveText()
        //     controlsRef.current.enabled = true
        //   }
        // })
      }),
    []
  )

  // useEffect(() => {
  //   setState({ camera: camera })
  // }, [camera])

  useEffect(() => {
    if (canvasRef.current) {
      textureRef.current = new Texture(canvasRef.current.getElement())
      // textureRef.current.anisotropy = gl.capabilities.getMaxAnisotropy()
      textureRef.current.flipY = false
      textureRef.current.needsUpdate = true
      canvasRef.current.renderAll()
    }
    // if (textureChanged && isLoading) {
    //   setIsLoading(false)
    //   setTextureChanged(false)
    // }
    // if (colorChanged) {
    //   textureRef.current = new Texture(canvasRef.current.getElement())
    //   textureRef.current.anisotropy = gl.capabilities.getMaxAnisotropy()
    //   textureRef.current.flipY = false
    //   textureRef.current.needsUpdate = true
    //   canvasRef.current.renderAll()
    //   setColorChanged(false)
    // }
    // if (textChanged) {
    //   setTextChanged(false)
    // }
  }, [])

  // useFrame(() => {
  //   controlsRef.current.update()
  //   // setZoom(Math.floor(state.camera.position.z))
  // })

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
      <Stats showPanel={0} />
    </>
  )
}

export default ShirtComponent
