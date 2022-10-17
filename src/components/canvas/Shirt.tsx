/* eslint-disable no-var */
import type { Mesh } from 'three/src/objects/Mesh'
import type { MeshStandardMaterial } from 'three/src/materials/MeshStandardMaterial'
import { Texture } from 'three/src/textures/Texture'
import type { ThreeEvent, Vector3 } from '@react-three/fiber'
import { useFrame, useLoader, useThree } from '@react-three/fiber'
import { TextureLoader } from 'three/src/loaders/TextureLoader'
import { GLTF, OrbitControls as OrbitControlsImpl } from 'three-stdlib'
import { fabric } from 'fabric'
import useStore from '@/helpers/store'
import {
  useState,
  useRef,
  Suspense,
  MutableRefObject,
  useEffect,
  useCallback,
} from 'react'
import {
  useGLTF,
  Environment,
  OrbitControls,
  AdaptiveDpr,
  Stats,
  Preload,
  BakeShadows,
  AdaptiveEvents,
} from '@react-three/drei'
import React from 'react'
import addText from '@/helpers/addText'
import { getPositionOnScene } from '@/util/fabric'

type GLTFResult = GLTF & {
  nodes: {
    M740158_mesh_band: Mesh
    M740158_mesh_in: Mesh
    M740158_mesh_out: Mesh
    M740158_mesh_zipp: Mesh
    M740158_mesh_zipper: Mesh
  }
  materials: {
    ['Material.008']: MeshStandardMaterial
    ['Material.009']: MeshStandardMaterial
    ['Material.010']: MeshStandardMaterial
    ['Material.011']: MeshStandardMaterial
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
  const textRef = useRef<fabric.IText>()
  // const textureRef = useRef<THREE.CanvasTexture>()
  const texture = useStore((state) => state.texture)
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
  const isAddText = useStore((state) => state.isAddText)
  const setIsLoading = useStore((state) => state.setIsLoading)
  const setIsAddText = useStore((state) => state.setIsAddText)
  const setTextureChanged = useStore((state) => state.setTextureChanged)
  const setSvgGroup = useStore((state) => state.setSvgGroup)
  const setColors = useStore((state) => state.setColors)
  const colors = useStore((state) => state.colors)
  const dimensions = useStore((state) => state.dimensions)
  const isMobileVersion = useStore((state) => state.isMobileVersion)
  // var raycaster = new THREE.Raycaster()
  // var mouse = new THREE.Vector2()
  const [localIntersections, setLocalIntersections] = useState<Vector3>()
  const [localDistance, setLocalDistance] = useState(90)
  const [event, setEvent] = useState<'touchstart' | 'mousedown'>('touchstart')
  const [getUv, setGetUv] = useState() as any
  const [allText, setAllText] = useState([])
  const [text, setText] = useState('')

  // const inputRef = React.useRef(null)
  var raycastContainer =
    document.getElementById('rendered').children[0].childNodes[0]
  // Textures
  const [normalMap] = useLoader(TextureLoader, ['/textures/Jersey_NORMAL.png'])
  const [aoMapout] = useLoader(TextureLoader, ['/textures/ao_out.png'])
  const [aoMapzipp] = useLoader(TextureLoader, ['/textures/ao_zip.png'])
  const [bump] = useLoader(TextureLoader, ['/textures/DisplacementMap.jpg'])

  const [hovered, setHovered] = useState(false)
  const [clicked, setClicked] = useState(false)

  useEffect(() => {
    if (width < 800) {
      setEvent('touchstart')
    } else {
      setEvent('mousedown')
    }

    if (canvasRef.current) {
      console.log(`Re-render canvasRef`)
      canvasRenderedRef.current = document.getElementsByTagName('canvas')[0]
      textureRef.current = new Texture(canvasRef.current.getElement())
      textureRef.current.anisotropy = gl.capabilities.getMaxAnisotropy()
      textureRef.current.flipY = false
      textureRef.current.needsUpdate = true
    }
  }, [canvasRef, gl.capabilities, textureRef, width])

  const getPosition = (e) => {
    const rect = canvasRenderedRef.current.getBoundingClientRect()
    const array = [
      (e.clientX - rect.left) / rect.width,
      (e.clientY - rect.top) / rect.height,
    ]
    pointer.fromArray(array)
    // Get intersects
    mouse.set(pointer.x * 2 - 1, -(pointer.y * 2) + 1)
    raycaster.setFromCamera(mouse, camera)
    const intersects = raycaster.intersectObjects(scene.children)
    // textureRef.current = new Texture(canvasRef.current.getElement())
    // textureRef.current.anisotropy = gl.capabilities.getMaxAnisotropy()
    // textureRef.current.flipY = false
    textureRef.current.needsUpdate = true

    if (intersects.length > 0 && intersects[0].uv) {
      let uv = intersects[0].uv
      setRay(uv)
      return {
        x: Math.round(uv.x * 2048) - 4.5,
        y: Math.round(uv.y * 2048) - 5.5,
      }
    }
    return null
  }

  const initPatch = () => {
    fabric.Object.prototype.transparentCorners = false
    fabric.Object.prototype.cornerColor = 'blue'
    fabric.Object.prototype.cornerStyle = 'circle'
    if (width < 800) {
      fabric.Object.prototype.cornerSize = 20
    } else {
      fabric.Object.prototype.cornerSize = 18
    }
    fabric.Canvas.prototype.getPointer = (e, ignoreZoom) => {
      var simEvt
      if (e.touches != undefined) {
        simEvt = new MouseEvent(
          {
            touchstart: 'mousedown',
            touchmove: 'mousemove',
            touchend: 'mouseup',
          }[e.type],
          {
            bubbles: true,
            cancelable: true,
            view: window,
            detail: 1,
            screenX: Math.round(e.changedTouches[0].screenX),
            screenY: Math.round(e.changedTouches[0].screenY),
            clientX: Math.round(e.changedTouches[0].clientX),
            clientY: Math.round(e.changedTouches[0].clientY),
            ctrlKey: false,
            altKey: false,
            shiftKey: false,
            metaKey: false,
            button: 0,
            relatedTarget: null,
          }
        )
        var pointer = fabric.util.getPointer(
          simEvt,
          canvasRef.current.getSelectionElement()
        ),
          upperCanvasEl = canvasRef.current.getSelectionElement(),
          bounds = upperCanvasEl.getBoundingClientRect(),
          boundsWidth = bounds.width || 0,
          boundsHeight = bounds.height || 0,
          cssScale
      } else {
        var pointer = fabric.util.getPointer(
          e,
          canvasRef.current.getSelectionElement()
        ),
          upperCanvasEl = canvasRef.current.getSelectionElement(),
          bounds = upperCanvasEl.getBoundingClientRect(),
          boundsWidth = bounds.width || 0,
          boundsHeight = bounds.height || 0,
          cssScale
      }
      if (!boundsWidth || !boundsHeight) {
        if ('top' in bounds && 'bottom' in bounds) {
          boundsHeight = Math.abs(bounds.top - bounds.bottom)
        }
        if ('right' in bounds && 'left' in bounds) {
          boundsWidth = Math.abs(bounds.right - bounds.left)
        }
      }
      canvasRef.current.calcOffset()
      pointer.x = Math.round(pointer.x) - canvasRef.current.getCenter().left
      pointer.y = Math.round(pointer.y) - canvasRef.current.getCenter().top
      /* BEGIN PATCH CODE */
      if (e.target !== canvasRef.current.getSelectionElement()) {
        var positionOnScene
        if (width < 800) {
          positionOnScene = getPosition(simEvt)
          if (positionOnScene) {
            // console.log(simEvt.type);
            pointer.x = positionOnScene.x
            pointer.y = positionOnScene.y
          }
        } else {
          positionOnScene = getPosition(e)

          if (positionOnScene) {
            // console.log(e.type);
            pointer.x = positionOnScene.x
            pointer.y = positionOnScene.y
          }
        }
      }
      /* END PATCH CODE */
      if (!ignoreZoom) {
        pointer = canvasRef.current.restorePointerVpt(pointer)
      }

      if (boundsWidth === 0 || boundsHeight === 0) {
        cssScale = { width: 1, height: 1 }
      } else {
        cssScale = {
          width: upperCanvasEl.width / boundsWidth,
          height: upperCanvasEl.height / boundsHeight,
        }
      }

      return {
        x: pointer.x * cssScale.width,
        y: pointer.y * cssScale.height,
      }
    }

    // canvasRef.current.on('mouse:down', (e) => {
    //   console.log(e)
    // })
  }
  const handleClick = (e) => {
    const positionOnScene = getPosition(e)
    if (positionOnScene) {
      const canvasRect = canvasRef.current.getCenter()
      const simEvt = new MouseEvent(e.type, {
        clientX: canvasRect.left + positionOnScene.x,
        clientY: canvasRect.top + positionOnScene.y,
      })

      canvasRef.current.getSelectionElement().dispatchEvent(simEvt)
    }
  }

  const inputRef = React.useRef(null)

  useEffect(() => {
    initPatch()
    // document
    //   .getElementsByTagName('canvas')[0]
    //   .addEventListener('mousedown', (e) => {
    //     textureRef.current.needsUpdate = true
    //   })
    document
      .getElementsByTagName('canvas')[0]
      .addEventListener('mousedown', handleClick)
    canvasRef.current.on('mouse:down', (e: any) => {
      setActiveText(canvasRef.current.getObjects().indexOf(e.target))
      if (e.target.text) {
        setEditText(true)
        controlsRef.current.enabled = false
      } else {
        setEditText(false)
        controlsRef.current.enabled = true
      }
    })
    if (textChanged) {
      setTextChanged(false)
    }
  })

  const handleTextPosition = (e) => {
    if (isAddText) {
      addText({
        text,
        canvasRef,
        left: e.intersections[0].uv.x * dimensions.width,
        top: e.intersections[0].uv.y * dimensions.height,
      })
      // textRef.current = jerseyText
      // textureRef.current = new Texture(canvasRef.current.getElement())
      // textureRef.current.anisotropy = gl.capabilities.getMaxAnisotropy()
      // textureRef.current.flipY = false
      // textureRef.current.needsUpdate = true
      // gl.domElement.style.cursor = 'auto'
      return setIsAddText(false)
    }
  }

  // Return the view, these are regular Threejs elements expressed in JSX
  return (
    <>
      <group
        ref={groupRef}
        dispose={null}
        // onClick={(e) => {
        //   if (isAddText) {
        //     handleTextPosition(e)
        //   }
        // }}
        onPointerMove={(e) => {
          if (isAddText) {
            // gl.domElement.style.cursor = 'crosshair'
          }
        }}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        onPointerDown={() => setClicked(true)}
        onPointerUp={() => setClicked(false)}
        {...props}
      >
        <mesh
          geometry={nodes.M740158_mesh_zipp.geometry}
          material={materials['Material.008']}
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
          material={materials['Material.009']}
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
          ref={inputRef}
          // onWheel={(e) => setLocalIntersections(e.intersections[0].point)}
          geometry={nodes.M740158_mesh_out.geometry}
          material={materials['Material.010']}
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
          geometry={nodes.M740158_mesh_in.geometry}
          material={materials['Material.011']}
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
