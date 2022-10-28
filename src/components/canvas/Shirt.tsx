import React, { MutableRefObject, useMemo } from 'react'
import { Texture } from 'three/src/textures/Texture'
import type { Canvas } from 'fabric/fabric-impl'
import { useFrame, useLoader, useThree } from '@react-three/fiber'
import { TextureLoader } from 'three/src/loaders/TextureLoader'
import { GLTF, OrbitControls as OrbitControlsImpl } from 'three-stdlib'
import useStore, { getState, setState, subscribe } from '@/helpers/store'
import { useRef, useEffect, useCallback } from 'react'
import { getPositionPointer, getPositionTouch } from '@/helpers/getPositions'
import useFirstRenderModel from '@/components/hooks/useFirstRenderModel'
import type { Group } from 'three/src/objects/Group'
import { Vector, Vector2 } from 'three/src/math/Vector2'
import type { MeshStandardMaterial } from 'three/src/materials/MeshStandardMaterial'
import FlipControls from '@/components/canvas/FlipControls'
import { fabric } from 'fabric'

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
  props?: JSX.IntrinsicElements['group']
}

const ShirtComponent = ({
  canvasRef,
  groupRef,
  textureRef,
  controlsRef,
  props,
}: ShirtProps) => {
  const { nodes, materials } = useGLTF(
    '/model/n-cycling-jersey.drc.glb'
  ) as unknown as GLTFResult
  const { camera, gl, raycaster, scene } = useThree()

  const inputRef = React.useRef(null)
  const ray = useRef<Vector>()
  const canvasRenderedRef = useRef<HTMLCanvasElement>(
    document.getElementsByTagName('canvas')[0]
  )
  const changed = useStore((state) => state.changed)
  const isAddText = useStore((state) => state.isAddText)
  const dimensions = useStore((state) => state.dimensions)

  // Textures
  const [normalMap] = useLoader(TextureLoader, ['/textures/Jersey_NORMAL.png'])
  const [aoMapout] = useLoader(TextureLoader, ['/textures/ao_out.png'])
  const [aoMapzipp] = useLoader(TextureLoader, ['/textures/ao_zip.png'])
  const [bump] = useLoader(TextureLoader, ['/textures/DisplacementMap.jpg'])

  useFirstRenderModel({
    // onTouch: handleTouch,
    controlsRef,
    groupRef,
    canvasRef,
    textureRef,
  })

  useEffect(() => {
    if (changed) {
      console.log(changed)
      camera.position.setZ(camera.position.z + 0.001)
      setState({ changed: false })
    }

    canvasRef.current.on('mouse:down', (e: any) => {
      const indexObject = canvasRef.current.getObjects().indexOf(e.target)
      const activeObject = canvasRef.current.getActiveObject()
      if (e.target && e.target.text) {
        console.log(e.target.text)
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
  }, [camera.position, canvasRef, changed, controlsRef])

  useFrame((state) => {
    controlsRef.current.update()

    // setZoom(Math.floor(state.camera.position.z))
  })

  // Return the view, these are regular Threejs elements expressed in JSX
  return (
    <>
      <group
        ref={groupRef}
        dispose={null}
        onBeforeRender={(e) => {}}
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
