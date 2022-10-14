/* eslint-disable no-var */
import * as THREE from 'three'
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
import {
  getPositionOnScene,
  getPositionOnSceneTouch,
  deleteObject,
  renderIcon,
} from '@/util/fabric'

type GLTFResult = GLTF & {
  nodes: {
    M740158_mesh_band: THREE.Mesh
    M740158_mesh_in: THREE.Mesh
    M740158_mesh_out: THREE.Mesh
    M740158_mesh_zipp: THREE.Mesh
    M740158_mesh_zipper: THREE.Mesh
  }
  materials: {
    ['Material.008']: THREE.MeshStandardMaterial
    ['Material.009']: THREE.MeshStandardMaterial
    ['Material.010']: THREE.MeshStandardMaterial
    ['Material.011']: THREE.MeshStandardMaterial
  }
}

interface ShirtProps {
  props?: JSX.IntrinsicElements['group']
  canvasRef: MutableRefObject<fabric.Canvas | null>
  setRay: any
  setActiveText: any
  setEditText: any
}

const ShirtComponent = ({
  props,
  canvasRef,
  setRay,
  setActiveText,
  setEditText,
}: ShirtProps) => {
  const { nodes, materials } = useGLTF(
    '/model/n-cycling-jersey.drc.glb'
  ) as unknown as GLTFResult
  const { camera, gl, raycaster, pointer } = useThree()
  const groupRef = useRef<THREE.Group>(null)
  const controlsRef = useRef<OrbitControlsImpl>(null)
  const textureRef = useRef<THREE.CanvasTexture>()
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
  // var raycaster = new THREE.Raycaster()
  // var mouse = new THREE.Vector2()
  const [event, setEvent] = useState<'touchstart' | 'mousedown'>('touchstart')
  const [getUv, setGetUv] = useState() as any

  const inputRef = React.useRef(null)
  let raycastContainer =
    document.getElementById('rendered').children[0].childNodes[0]
  let onClickPosition = new THREE.Vector2()
  // Textures
  const [normalMap] = useLoader(TextureLoader, ['/textures/Jersey_NORMAL.png'])
  const [aoMapout] = useLoader(TextureLoader, ['/textures/ao_out.png'])
  const [aoMapzipp] = useLoader(TextureLoader, ['/textures/ao_zip.png'])
  const [bump] = useLoader(TextureLoader, ['/textures/DisplacementMap.jpg'])

  const [hovered, setHovered] = useState(false)
  const [clicked, setClicked] = useState(false)
  let isMobile = false

  const setFrameLoop = () => {
    textureRef.current = new THREE.CanvasTexture(canvasRef.current.getElement())
    textureRef.current.anisotropy = gl.capabilities.getMaxAnisotropy()
    textureRef.current.flipY = false
    textureRef.current.needsUpdate = true
    canvasRef.current.renderAll()
  }

  // const initPatch = useCallback(() => {
  //   fabric.Object.prototype.transparentCorners = false
  //   fabric.Object.prototype.cornerColor = 'blue'
  //   fabric.Object.prototype.cornerStyle = 'circle'
  //   if (width < 800) {
  //     fabric.Object.prototype.cornerSize = 20
  //   } else {
  //     fabric.Object.prototype.cornerSize = 18
  //   }

  //   fabric.Canvas.prototype.getPointer = (e, ignoreZoom) => {
  //     //  if (canvasRef.current._absolutePointer && !ignoreZoom) {
  //     //    return canvasRef.current._absolutePointer
  //     //  }
  //     //  if (canvasRef.current._pointer && ignoreZoom) {
  //     //    return canvasRef.current._pointer
  //     //  }
  //     let simEvt = null
  //     let pointer = null
  //     let upperCanvasEl = null
  //     let bounds = null
  //     let boundsWidth = null
  //     let boundsHeight = null
  //     let cssScale = null

  //     if (e.touches != undefined) {
  //       simEvt = new MouseEvent(
  //         {
  //           touchstart: 'mousedown',
  //           touchmove: 'mousemove',
  //           touchend: 'mouseup',
  //         }[e.type],
  //         {
  //           bubbles: true,
  //           cancelable: true,
  //           view: window,
  //           detail: 1,
  //           screenX: Math.round(e.changedTouches[0].screenX),
  //           screenY: Math.round(e.changedTouches[0].screenY),
  //           clientX: Math.round(e.changedTouches[0].clientX),
  //           clientY: Math.round(e.changedTouches[0].clientY),
  //           ctrlKey: false,
  //           altKey: false,
  //           shiftKey: false,
  //           metaKey: false,
  //           button: 0,
  //           relatedTarget: null,
  //         }
  //       )
  //       pointer = fabric.util.getPointer(
  //         simEvt,
  //         canvasRef.current.getSelectionElement()
  //       )
  //       upperCanvasEl = canvasRef.current.getSelectionElement()
  //       bounds = upperCanvasEl.getBoundingClientRect()
  //       boundsWidth = bounds.width || 0
  //       boundsHeight = bounds.height || 0
  //       cssScale
  //     } else {
  //       pointer = fabric.util.getPointer(
  //         e,
  //         canvasRef.current.getSelectionElement()
  //       )
  //       upperCanvasEl = canvasRef.current.getSelectionElement()
  //       bounds = upperCanvasEl.getBoundingClientRect()
  //       boundsWidth = bounds.width || 0
  //       boundsHeight = bounds.height || 0
  //       cssScale
  //     }

  //     if (!boundsWidth || !boundsHeight) {
  //       if ('top' in bounds && 'bottom' in bounds) {
  //         boundsHeight = Math.abs(bounds.top - bounds.bottom)
  //       }
  //       if ('right' in bounds && 'left' in bounds) {
  //         boundsWidth = Math.abs(bounds.right - bounds.left)
  //       }
  //     }
  //     canvasRef.current.calcOffset()
  //     pointer.x = Math.round(pointer.x) - canvasRef.current.getCenter().left
  //     pointer.y = Math.round(pointer.y) - canvasRef.current.getCenter().top
  //     /* BEGIN PATCH CODE */
  //     if (e.target !== upperCanvasEl) {
  //       var positionOnScene
  //       if (width < 800) {
  //         positionOnScene = getPositionOnScene(
  //           width,
  //           onClickPosition,
  //           scene,
  //           pointer,
  //           raycaster,
  //           camera,
  //           setRay,
  //           raycastContainer,
  //           simEvt
  //         )
  //         if (positionOnScene) {
  //           // console.log(simEvt.type);
  //           pointer.x = positionOnScene.x
  //           pointer.y = positionOnScene.y
  //         }
  //       } else {
  //         positionOnScene = getPositionOnScene(
  //           width,
  //           onClickPosition,
  //           scene,
  //           pointer,
  //           raycaster,
  //           camera,
  //           setRay,
  //           raycastContainer,
  //           e
  //         )

  //         if (positionOnScene) {
  //           // console.log(e.type);
  //           pointer.x = positionOnScene.x
  //           pointer.y = positionOnScene.y
  //         }
  //       }
  //     }
  //     /* END PATCH CODE */
  //     if (!ignoreZoom) {
  //       pointer = canvasRef.current.restorePointerVpt(pointer)
  //     }

  //     if (boundsWidth === 0 || boundsHeight === 0) {
  //       cssScale = { width: 1, height: 1 }
  //     } else {
  //       cssScale = {
  //         width: upperCanvasEl.width / boundsWidth,
  //         height: upperCanvasEl.height / boundsHeight,
  //       }
  //     }

  //     return {
  //       x: pointer.x * cssScale.width,
  //       y: pointer.y * cssScale.height,
  //     }
  //   }
  // }, [
  //   camera,
  //   canvasRef,
  //   onClickPosition,
  //   raycastContainer,
  //   raycaster,
  //   scene,
  //   setRay,
  //   width,
  // ])

  // useEffect(() => {
  //   // addDeleteControl()
  //   initPatch()
  //   let event
  //   if (width < 800) {
  //     event = 'touchstart'
  //   } else {
  //     event = 'mousedown'
  //   }
  //   raycastContainer.addEventListener('mousedown', handleClick)
  //   canvasRef.current.on('object:rotating', function (options) {
  //     options.target.snapAngle = 15
  //   })
  //   canvasRef.current.on('mouse:down', (e, index) => {
  //     setActiveText(canvasRef.current.getObjects().indexOf(e.target))
  //     if (e.target.text) {
  //       setEditText(true)
  //       controlsRef.current.enabled = false
  //     } else {
  //       setEditText(false)
  //       controlsRef.current.enabled = true
  //     }
  //   })
  // }, [
  //   canvasRef,
  //   handleClick,
  //   initPatch,
  //   raycastContainer,
  //   setActiveText,
  //   setEditText,
  //   width,
  // ])

  useEffect(() => {
    if (width < 800) {
      setEvent('touchstart')
    } else {
      setEvent('mousedown')
    }

    if (canvasRef) {
      textureRef.current = new THREE.CanvasTexture(
        canvasRef.current.getElement()
      )
      textureRef.current.anisotropy = gl.capabilities.getMaxAnisotropy()
      textureRef.current.flipY = false
      textureRef.current.needsUpdate = true
      canvasRef.current.renderAll()
    }
  }, [
    canvasRef,
    gl.capabilities,
    setIsLoading,
    setTextureChanged,
    textureChanged,
    width,
  ])

  useEffect(() => {
    if (textureChanged) {
      setFrameLoop()
    }

    if (textChanged) {
      setFrameLoop()
      setTextChanged(false)
    }
  })

  // Subscribe canvasRef.current component to the render-loop, rotate the mesh every frame
  useFrame((state, delta) => {
    controlsRef.current.update()
    setZoom(Math.floor(state.camera.position.z))

    if (colorChanged) {
      setFrameLoop()
      state.camera.position.z = state.camera.position.z + 0.001

      setColorChanged(false)
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

    if (canvasRef.current && isAddText) {
      state.gl.domElement.style.cursor = 'crosshair'
      canvasRef.current.on('mouse:over', (opt) => {})
      setIsAddText(false)
    }

    // if (!isAddText) {
    //   state.gl.domElement.style.cursor = hovered ? 'grab' : 'auto'
    //   state.gl.domElement.style.cursor = clicked ? 'grabbing' : 'grab'
    // }
  })

  // const handleClick = useCallback(
  //   (e) => {
  //     const positionOnScene = getPositionOnScene(
  //       width,
  //       onClickPosition,
  //       scene,
  //       pointer,
  //       raycaster,
  //       camera,
  //       setRay,
  //       raycastContainer,
  //       e
  //     )
  //     if (positionOnScene) {
  //       const canvasRect = canvasRef.current.getCenter()
  //       const simEvt = new MouseEvent(e.type, {
  //         clientX: canvasRect.left + positionOnScene.x,
  //         clientY: canvasRect.top + positionOnScene.y,
  //       })
  //       canvasRef.current.getSelectionElement().dispatchEvent(simEvt)
  //     }
  //   },
  //   [
  //     camera,
  //     canvasRef,
  //     onClickPosition,
  //     pointer,
  //     raycastContainer,
  //     raycaster,
  //     scene,
  //     setRay,
  //     width,
  //   ]
  // )

  // const onTouch = (evt) => {
  //   evt.preventDefault()
  //   const positionOnScene = getPositionOnSceneTouch(
  //     setRay,
  //     raycastContainer,
  //     evt
  //     width,
  //     onClickPosition,
  //     scene,
  //     pointer,
  //     raycaster,
  //     camera,
  //   )
  //   if (positionOnScene) {
  //     const canvasRect = canvasRef.current.getCenter()
  //     const simEvt = new MouseEvent(evt.type, {
  //       clientX: canvasRect.left + positionOnScene.x,
  //       clientY: canvasRect.top + positionOnScene.y,
  //     })
  //     canvasRef.current.getSelectionElement().dispatchEvent(simEvt)
  //   }
  // }

  // const addDeleteControl = () => {
  //   fabric.Object.prototype.controls.deleteControl = new fabric.Control({
  //     x: 0.5,
  //     y: 0.5,
  //     offsetY: 0,
  //     cursorStyle: 'pointer',
  //     mouseUpHandler: (eventData, transferFormData, x, y) => {
  //         let target = transferFormData.target
  //         let canvas = target.canvas
  //         canvas.remove(target)
  //         canvas.requestRenderAll()
  //     },
  //     render: renderIcon,
  //     cornerSize: 24,
  //   })
  // }

  // Return the view, these are regular Threejs elements expressed in JSX
  return (
    <>
      <group
        ref={groupRef}
        dispose={null}
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
            <canvasTexture
              ref={textureRef}
              attach='map'
              image={canvasRef.current}
            />
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
            <canvasTexture
              ref={textureRef}
              attach='map'
              image={canvasRef.current}
            />
          </meshStandardMaterial>
        </mesh>
        <mesh
          ref={inputRef}
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
            <canvasTexture
              ref={textureRef}
              attach='map'
              image={canvasRef.current}
            />
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
      <BakeShadows />

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
      <AdaptiveDpr pixelated />
      <AdaptiveEvents />
      {/* <Stats showPanel={0} /> */}
    </>
  )
}

useGLTF.preload('/model/n-cycling-jersey.drc.glb')

export default ShirtComponent
