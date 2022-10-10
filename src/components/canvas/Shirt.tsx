/* eslint-disable no-var */
import * as THREE from 'three'
import { useFrame, useLoader, useThree } from '@react-three/fiber'
import { TextureLoader } from 'three/src/loaders/TextureLoader'
import { GLTF, OrbitControls as OrbitControlsImpl } from 'three-stdlib'
import { fabric } from 'fabric'
import Loader from '@/components/canvas/Loader'
import useStore from '@/helpers/store'
import { useState, useRef, Suspense, MutableRefObject, useEffect } from 'react'
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

type GLTFResult = GLTF & {
  nodes: {
    M740158_mesh_band: THREE.Mesh
    M740158_mesh_in: THREE.Mesh
    M740158_mesh_out: THREE.Mesh
    M740158_mesh_zipp: THREE.Mesh
    M740158_mesh_zipper: THREE.Mesh
  }
  materials: {}
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
  const { camera, gl } = useThree()
  const groupRef = useRef<THREE.Group>(null)
  const controlsRef = useRef<OrbitControlsImpl>(null)
  const textureRef = useRef<THREE.Texture | null>(null)
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
  const setTextureChanged = useStore((state) => state.setTextureChanged)
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
  var raycaster = new THREE.Raycaster()
  var mouse = new THREE.Vector2()
  const [getUv, setGetUv] = useState() as any
  var raycastContainer =
    document.getElementById('rendered').children[0].childNodes[0]
  var onClickPosition = new THREE.Vector2()
  // Textures
  const [normalMap] = useLoader(TextureLoader, ['/textures/Jersey_NORMAL.png'])
  const [aoMapout] = useLoader(TextureLoader, ['/textures/ao_out.png'])
  const [aoMapzipp] = useLoader(TextureLoader, ['/textures/ao_zip.png'])
  const [bump] = useLoader(TextureLoader, ['/textures/DisplacementMap.jpg'])

  const [hovered, setHovered] = useState(false)
  const [clicked, setClicked] = useState(false)
  var isMobile = false
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
      if (canvasRef.current._absolutePointer && !ignoreZoom) {
        return canvasRef.current._absolutePointer
      }
      if (canvasRef.current._pointer && ignoreZoom) {
        return canvasRef.current._pointer
      }
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
        var pointer = fabric.util.getPointer(simEvt),
          upperCanvasEl = canvasRef.current.upperCanvasEl,
          bounds = upperCanvasEl.getBoundingClientRect(),
          boundsWidth = bounds.width || 0,
          boundsHeight = bounds.height || 0,
          cssScale
      } else {
        var pointer = fabric.util.getPointer(e),
          upperCanvasEl = canvasRef.current.upperCanvasEl,
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
      pointer.x = Math.round(pointer.x) - canvasRef.current._offset.left
      pointer.y = Math.round(pointer.y) - canvasRef.current._offset.top
      /* BEGIN PATCH CODE */
      if (e.target !== canvasRef.current.upperCanvasEl) {
        var positionOnScene
        if (width < 800) {
          positionOnScene = getPositionOnScene(raycastContainer, simEvt)
          if (positionOnScene) {
            // console.log(simEvt.type);
            pointer.x = positionOnScene.x
            pointer.y = positionOnScene.y
          }
        } else {
          positionOnScene = getPositionOnScene(raycastContainer, e)

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
  const inputRef = React.useRef(null)

  const handleClick = (e) => {
    console.log(e)

    const positionOnScene = getPositionOnScene(raycastContainer, e)
    if (positionOnScene) {
      const canvasRect = canvasRef.current._offset
      const simEvt = new MouseEvent(e.type, {
        clientX: canvasRect.left + positionOnScene.x,
        clientY: canvasRect.top + positionOnScene.y,
      })

      canvasRef.current.upperCanvasEl.dispatchEvent(simEvt)
    }
  }
  useEffect(() => {
    // addDeleteControl()
    initPatch()
    let event
    if (width < 800) {
      event = 'touchstart'
    } else {
      event = 'mousedown'
    }
    raycastContainer.addEventListener('mousedown', handleClick)
    canvasRef.current.on('object:rotating', function (options) {
      options.target.snapAngle = 15
    })
    canvasRef.current.on('mouse:down', (e, index) => {
      setActiveText(canvasRef.current.getObjects().indexOf(e.target))
      if (e.target.text) {
        setEditText(true)
        controlsRef.current.enabled = false
      } else {
        setEditText(false)
        controlsRef.current.enabled = true
      }
    })
  }, [])
  const onTouch = (evt) => {
    evt.preventDefault()
    const positionOnScene = getPositionOnSceneTouch(raycastContainer, evt)
    if (positionOnScene) {
      const canvasRect = canvasRef.current._offset
      const simEvt = new MouseEvent(evt.type, {
        clientX: canvasRect.left + positionOnScene.x,
        clientY: canvasRect.top + positionOnScene.y,
      })
      canvasRef.current.upperCanvasEl.dispatchEvent(simEvt)
    }
  }
  const { nodes } = useGLTF('/model/n-cycling-jersey.drc.glb') as any
  var deleteIcon =
    "data:image/svg+xml,%3C%3Fxml version='1.0' encoding='utf-8'%3F%3E%3C!DOCTYPE svg PUBLIC '-//W3C//DTD SVG 1.1//EN' 'http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd'%3E%3Csvg version='1.1' id='Ebene_1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' x='0px' y='0px' width='595.275px' height='595.275px' viewBox='200 215 230 470' xml:space='preserve'%3E%3Ccircle style='fill:%23F44336;' cx='299.76' cy='439.067' r='218.516'/%3E%3Cg%3E%3Crect x='267.162' y='307.978' transform='matrix(0.7071 -0.7071 0.7071 0.7071 -222.6202 340.6915)' style='fill:white;' width='65.545' height='262.18'/%3E%3Crect x='266.988' y='308.153' transform='matrix(0.7071 0.7071 -0.7071 0.7071 398.3889 -83.3116)' style='fill:white;' width='65.544' height='262.179'/%3E%3C/g%3E%3C/svg%3E"

  const addDeleteControl = () => {
    fabric.Object.prototype.controls.deleteControl = new fabric.Control({
      x: 0.5,
      y: 0.5,
      offsetY: 0,
      cursorStyle: 'pointer',
      mouseUpHandler: deleteObject,
      render: renderIcon,
      cornerSize: 24,
    })
  }
  var img = document.createElement('img')
  img.src = deleteIcon
  const renderIcon = (ctx, left, top, styleOverride, fabricObject) => {
    var size = 24
    ctx.save()
    ctx.translate(left, top)
    ctx.rotate(fabric.util.degreesToRadians(fabricObject.angle))
    ctx.drawImage(img, -size / 2, -size / 2, size, size)
    ctx.restore()
  }
  const deleteObject = (eventData, transform) => {
    var target = transform.target
    var canvas = target.canvas
    canvas.remove(target)
    canvas.requestRenderAll()
  }
  const getIntersects = (point, objects) => {
    mouse.set(point.x * 2 - 1, -(point.y * 2) + 1)
    raycaster.setFromCamera(mouse, camera)
    return raycaster.intersectObjects(objects)
  }
  const getRealPosition = (axis, value) => {
    let CORRECTION_VALUE = axis === 'x' ? 4.5 : 5.5
    if (width < 800) {
      return Math.round(value * 1024) - CORRECTION_VALUE
    } else {
      return Math.round(value * 2048) - CORRECTION_VALUE
    }
  }
  const getMousePosition = (dom, x, y) => {
    let rect = dom.getBoundingClientRect()
    return [(x - rect.left) / rect.width, (y - rect.top) / rect.height]
  }
  const getPositionOnSceneTouch = (sceneContainer, evt) => {
    var array = getMousePosition(
      sceneContainer,
      evt.changedTouches[0].clientX,
      evt.changedTouches[0].clientY
    )
    onClickPosition.fromArray(array)
    var intersects = getIntersects(onClickPosition, scene.children)
    if (intersects.length > 0 && intersects[0].uv) {
      var uv = intersects[0].uv
      setRay(uv)
      // intersects[0].object.material.map.transformUv(uv);
      var circle = new fabric.Circle({
        radius: 3,
        left: getRealPosition('x', uv.x),
        top: getRealPosition('y', uv.y),
        fill: 'white',
      })
      // canvas.add(circle);
      return {
        x: getRealPosition('x', uv.x),
        y: getRealPosition('y', uv.y),
      }
    }
    return null
  }
  const getPositionOnScene = (sceneContainer, evt) => {
    let array
    if (width < 800) {
      array = getMousePosition(
        sceneContainer,
        evt.changedTouches[0].clientX,
        evt.changedTouches[0].clientY
      )
    } else {
      array = getMousePosition(sceneContainer, evt.clientX, evt.clientY)
    }
    onClickPosition.fromArray(array)
    let intersects: any = getIntersects(onClickPosition, scene.children)
    if (intersects.length > 0 && intersects[0].uv) {
      let uv = intersects[0].uv
      setRay(uv)
      // if (intersects[0].object.material.map) {
      //   intersects[0].object.material.map.transformUv(uv)
      // }
      let circle = new fabric.Circle({
        radius: 20,
        left: getRealPosition('x', uv.x),
        top: getRealPosition('y', uv.y),
        fill: 'red',
      })
      // canvasRef.current.add(circle)
      // canvasRef.current.renderAll()
      // canvasRef.current.setActiveObject(circle)
      // console.log(canvasRef.current._objects)

      return {
        x: getRealPosition('x', uv.x),
        y: getRealPosition('y', uv.y),
      }
    }
    return null
  }
  // Subscribe canvasRef.current component to the render-loop, rotate the mesh every frame
  const setFrameLoop = () => {
    textureRef.current = new THREE.Texture(canvasRef.current.getElement())
    textureRef.current.anisotropy = gl.capabilities.getMaxAnisotropy()
    textureRef.current.needsUpdate = true
    textureRef.current.flipY = false
  }
  useFrame((state, delta) => {
    controlsRef.current.update()
    setZoom(Math.floor(state.camera.position.z))
    if (canvasRef.current) {
      // textureRef.current = new THREE.Texture(canvasRef.current.getElement())
      // textureRef.current.anisotropy = gl.capabilities.getMaxAnisotropy()
      // textureRef.current.needsUpdate = true
      // textureRef.current.flipY = false
      canvasRef.current.renderAll()
    }
    if (setTextureChanged) {
      setFrameLoop()
    }
    if (colorChanged) {
      setFrameLoop()
      state.camera.position.z = state.camera.position.z + 0.001
      setColorChanged(false)
    }
    if (textChanged) {
      setFrameLoop()
      state.camera.position.z = state.camera.position.z + 0.001
      setTextChanged(false)
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
    }

    if (!isAddText) {
      state.gl.domElement.style.cursor = hovered ? 'grab' : 'auto'
      state.gl.domElement.style.cursor = clicked ? 'grabbing' : 'grab'
    }
  })
  // Return the view, these are regular Threejs elements expressed in JSX
  return (
    <>
      <Suspense fallback={<Loader />}>
        <group
          ref={groupRef}
          dispose={null}
          onPointerOver={() => setHovered(true)}
          onPointerOut={() => setHovered(false)}
          onPointerDown={() => setClicked(true)}
          onPointerUp={() => setClicked(false)}
          {...props}
        >
          {/* <mesh
            geometry={nodes.M740158_mesh_band.geometry}
            material={nodes.M740158_mesh_band.material}
            scale={100}
          >
            <meshStandardMaterial
              attach='material'
              normalMap={normalMap}
              normalMap-flipY={false}
              map={textureRef.current}
            >
              <texture attach='map' image={canvasRef} />
            </meshStandardMaterial>
          </mesh> */}
          <mesh
            geometry={nodes.M740158_mesh_in.geometry}
            material={nodes.M740158_mesh_in.material}
            scale={100}
          >
            <meshStandardMaterial
              attach='material'
              roughness={1}
              emissive={1}
              bumpMap={bump}
              bumpScale={0.03}
              map={textureRef.current}
              color='#ccc'
            />
          </mesh>
          <mesh
            ref={inputRef}
            // onClick={(e: any) => {
            //   handleClick(e)
            // }}
            geometry={nodes.M740158_mesh_out.geometry}
            material={nodes.M740158_mesh_out.material}
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
              <texture attach='map' image={canvasRef} ref={textureRef} />
            </meshStandardMaterial>
          </mesh>
          <mesh
            geometry={nodes.M740158_mesh_zipp.geometry}
            material={nodes.M740158_mesh_zipp.material}
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
              <texture attach='map' image={canvasRef} />
            </meshStandardMaterial>
          </mesh>
          <mesh
            geometry={nodes.M740158_mesh_zipper.geometry}
            material={nodes.M740158_mesh_zipper.material}
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
              <texture attach='map' image={canvasRef} />
            </meshStandardMaterial>
          </mesh>
        </group>
        <Preload all />
        <BakeShadows />
      </Suspense>
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
      <Stats showPanel={0} />
    </>
  )
}

export default ShirtComponent
