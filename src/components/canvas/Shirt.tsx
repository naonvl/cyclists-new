import React, {
  MutableRefObject,
  useLayoutEffect,
  useMemo,
  useState,
} from 'react'
import { Texture } from 'three/src/textures/Texture'
import type { Canvas } from 'fabric/fabric-impl'
import { useFrame, useLoader, useThree } from '@react-three/fiber'
import { TextureLoader } from 'three/src/loaders/TextureLoader'
import { GLTF, OrbitControls as OrbitControlsImpl } from 'three-stdlib'
import useStore, { setState } from '@/helpers/store'
import { useRef, useEffect } from 'react'
import useFirstRenderModel from '@/components/hooks/useFirstRenderModel'
import type { Group } from 'three/src/objects/Group'
import { Vector2 } from 'three/src/math/Vector2'

import { animated } from '@react-spring/three'

import {
  useGLTF,
  OrbitControls,
  AdaptiveDpr,
  BakeShadows,
  AdaptiveEvents,
  Stats,
} from '@react-three/drei'
import addText from '@/helpers/addText'

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
  canvasRef: MutableRefObject<Canvas>
  groupRef: MutableRefObject<Group>
  controlsRef: MutableRefObject<OrbitControlsImpl>
  textureRef: MutableRefObject<Texture>
  rotation: any
  position: any
  props?: JSX.IntrinsicElements['group']
}

const ShirtComponent = ({
  canvasRef,
  groupRef,
  textureRef,
  controlsRef,
  rotation,
  position,
  props,
}: ShirtProps) => {
  const { nodes, materials } = useGLTF(
    '/model/n-cycling-jersey.drc.glb'
  ) as unknown as GLTFResult
  const { camera, gl, raycaster, scene } = useThree()

  const inputRef = React.useRef(null)
  const ray = useRef<Vector2>()
  const changed = useStore((state) => state.changed)
  const isAddText = useStore((state) => state.isAddText)
  const flipChanged = useStore((state) => state.flipChanged)
  const flipStatus = useStore((state) => state.flipStatus)
  const isAutoRotate = useStore((state) => state.isAutoRotate)
  const isSpringActive = useStore((state) => state.isSpringActive)
  const cameraControls = useStore((state) => state.cameraControls)

  // Textures
  const [normalMap] = useLoader(TextureLoader, ['/textures/Jersey_NORMAL.png'])
  const [aoMapout] = useLoader(TextureLoader, ['/textures/ao_out.png'])
  const [aoMapzipp] = useLoader(TextureLoader, ['/textures/ao_zip.png'])
  const [bump] = useLoader(TextureLoader, ['/textures/DisplacementMap.jpg'])

  useLayoutEffect(() => {
    textureRef.current = new Texture(canvasRef.current.getElement())
    textureRef.current.flipY = false
    textureRef.current.needsUpdate = true
    canvasRef.current.renderAll()
  }, [canvasRef, textureRef])

  useFirstRenderModel({
    controlsRef,
    groupRef,
    canvasRef,
  })

  useEffect(() => {
    if (changed) {
      setState({ changed: false })
    }

    if (flipChanged && flipStatus == 'front') {
      camera.position.set(-1, 1, 90)
      setState({ flipChanged: false })
    }

    if (flipChanged && flipStatus == 'back') {
      camera.position.set(1, 1, -90)
      setState({ flipChanged: false })
    }

    if (cameraControls === 'zoom-out') {
      const positionX = camera.position.x
      const positionY = camera.position.y
      const positionZ = camera.position.z
      camera.position.set(positionX * 1.1, positionY * 1.1, positionZ * 1.1)
      setState({ cameraControls: null })
    }

    if (cameraControls === 'zoom-in') {
      const positionX = camera.position.x
      const positionY = camera.position.y
      const positionZ = camera.position.z
      camera.position.set(positionX * 0.9, positionY * 0.9, positionZ * 0.9)
      setState({ cameraControls: null })
    }

    if (cameraControls === 'rotate-right') {
      const rotationX = groupRef.current.rotation.x
      const rotationY = groupRef.current.rotation.y
      const rotationZ = groupRef.current.rotation.z
      groupRef.current.rotation.set(
        rotationX,
        rotationY + -Math.PI / 4,
        rotationZ
      )
      setState({ cameraControls: null })
    }

    if (cameraControls === 'rotate-left') {
      const rotationX = groupRef.current.rotation.x
      const rotationY = groupRef.current.rotation.y
      const rotationZ = groupRef.current.rotation.z
      groupRef.current.rotation.set(
        rotationX,
        rotationY + Math.PI / 4,
        rotationZ
      )
      setState({ cameraControls: null })
    }

    canvasRef.current.on('mouse:down', (e: any) => {
      const indexObject = canvasRef.current.getObjects().indexOf(e.target)
      const activeObject = canvasRef.current.getActiveObject()
      if (e.target && e.target.text) {
        setState({
          indexActiveText: indexObject,
          activeText: activeObject,
          editText: true,
        })
        controlsRef.current.enabled = false
      } else {
        setState({
          editText: false,
          indexActiveText: 0,
        })
        canvasRef.current.discardActiveObject(e)
        // getState().resetActiveText()
        controlsRef.current.enabled = true
      }
    })
  }, [
    camera,
    cameraControls,
    canvasRef,
    changed,
    controlsRef,
    flipChanged,
    flipStatus,
    groupRef,
    isAutoRotate,
    isSpringActive,
  ])

  useFrame((state) => {
    controlsRef.current.update()
    // groupRef.current.rotation.set(state.camera.position)

    if (state.camera.position.z < 0) {
      setState({ flipStatus: 'front' })
    }
    if (state.camera.position.z > 0) {
      setState({ flipStatus: 'back' })
    }

    // setZoom(Math.floor(state.camera.position.z))
  })

  // Return the view, these are regular Threejs elements expressed in JSX
  return (
    <>
      <animated.group
        ref={groupRef}
        dispose={null}
        rotation={rotation as any}
        position={position as any}
        onPointerDown={(e) => {
          e.stopPropagation()
          // setIsClicked(true)
          // console.log(e.intersections[0].point)
          // console.log(camera.position)

          ray.current = e.intersections[0].uv
          if (isAddText) {
            addText({ canvasRef, textureRef, ray: e.intersections[0].uv })
          }
        }}
        {...props}
      >
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
      </animated.group>
      <OrbitControls
        ref={controlsRef}
        autoRotate={isAutoRotate}
        autoRotateSpeed={10}
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
