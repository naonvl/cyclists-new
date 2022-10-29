import React, {
  MutableRefObject,
  useCallback,
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
import { fabricControls } from '@/util/fabric'
import { initPatch } from '@/helpers/patch'

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
  const { camera, gl, raycaster, scene, mouse, pointer } = useThree()

  const inputRef = React.useRef(null)
  const ray = useRef<Vector2>()
  const canvasRenderedRef = useRef<HTMLCanvasElement>()
  const changed = useStore((state) => state.changed)
  const isAddText = useStore((state) => state.isAddText)
  const flipStatus = useStore((state) => state.flipStatus)
  const dimensions = useStore((state) => state.dimensions)
  const flipChanged = useStore((state) => state.flipChanged)
  const isAutoRotate = useStore((state) => state.isAutoRotate)
  const isSpringActive = useStore((state) => state.isSpringActive)
  const cameraControls = useStore((state) => state.cameraControls)
  const isMobileVersion = useStore((state) => state.isMobileVersion)

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

  useLayoutEffect(() => {
    textureRef.current = new Texture(canvasRef.current.getElement())
    textureRef.current.flipY = false
    textureRef.current.needsUpdate = true
    canvasRef.current.renderAll()
    canvasRenderedRef.current = document.getElementsByTagName('canvas')[0]
  }, [canvasRef, handleClick, isMobileVersion, textureRef])

  useFirstRenderModel({
    controlsRef,
    groupRef,
    canvasRef,
    handleClick,
    textureRef,
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
  }, [
    camera.position,
    cameraControls,
    changed,
    flipChanged,
    flipStatus,
    groupRef,
  ])

  useFrame((state) => {
    controlsRef.current.update()

    if (state.camera.position.z < 0) {
      setState({ flipStatus: 'front' })
    }
    if (state.camera.position.z > 0) {
      setState({ flipStatus: 'back' })
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
        controlsRef.current.enabled = true
      }
    })
  })

  // Return the view, these are regular Threejs elements expressed in JSX
  return (
    <>
      {!isMobileVersion ? (
        <animated.group
          ref={groupRef}
          dispose={null}
          rotation={rotation as any}
          position={position as any}
          onPointerDown={(e) => {
            e.stopPropagation()
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
      ) : (
        <group
          ref={groupRef}
          dispose={null}
          onPointerDown={(e) => {
            e.stopPropagation()
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
        </group>
      )}

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
      {/* <Stats showPanel={0} /> */}
    </>
  )
}

export default ShirtComponent
