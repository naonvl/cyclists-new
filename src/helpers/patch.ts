import { MutableRefObject, TouchEvent } from 'react'
import { fabric } from 'fabric'
import { Texture } from 'three/src/textures/Texture'

export const initPatch = (
  threeProps: {
    camera: any
    pointer: any
    scene: any
    raycaster: any
    mouse: any
    gl: any
  },
  canvasRef: MutableRefObject<fabric.Canvas>,
  canvasRenderedRef: MutableRefObject<HTMLCanvasElement>,
  textureRef: MutableRefObject<Texture>,
  setRay: any
) => {
  const { camera, pointer, scene, raycaster, mouse } = threeProps
  if (!camera || !pointer || !scene || !raycaster || !mouse) {
    return
  }

  fabric.Object.prototype.transparentCorners = false
  fabric.Object.prototype.cornerColor = 'blue'
  fabric.Object.prototype.cornerStyle = 'circle'
  fabric.Object.prototype.cornerSize = 18
  fabric.Canvas.prototype.getPointer = (e, ignoreZoom) => {
    const upperCanvasEl = canvasRef.current.getSelectionElement()
    const bounds = canvasRef.current
      .getSelectionElement()
      .getBoundingClientRect()
    const boundsWidth = bounds.width || 0
    const boundsHeight = bounds.height || 0
    const pointerFabric = fabric.util.getPointer(
      e,
      canvasRef.current.getSelectionElement()
    )
    pointerFabric.x =
      Math.round(pointerFabric.x) - canvasRef.current.getCenter().left
    pointerFabric.y =
      Math.round(pointerFabric.y) - canvasRef.current.getCenter().top

    // /* BEGIN PATCH CODE */
    if (e.target !== canvasRef.current.getSelectionElement()) {
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
      textureRef.current.needsUpdate = true

      if (intersects.length > 0 && intersects[0].uv) {
        let uv = intersects[0].uv
        setRay(uv)

        pointerFabric.x = Math.round(uv.x * 2048) - 4.5
        pointerFabric.y = Math.round(uv.y * 2048) - 5.5
      }
    }

    let cssScale = null
    if (boundsWidth === 0 || boundsHeight === 0) {
      cssScale = { width: 1, height: 1 }
    } else {
      cssScale = {
        width: upperCanvasEl.width / boundsWidth,
        height: upperCanvasEl.height / boundsHeight,
      }
    }

    return {
      x: pointerFabric.x * cssScale.width,
      y: pointerFabric.y * cssScale.height,
    }
  }
}

export const initMobilePatch = (
  event: any,
  threeProps: {
    camera: any
    pointer: any
    scene: any
    raycaster: any
    mouse: any
    gl: any
  },
  canvasRef: MutableRefObject<fabric.Canvas>,
  canvasRenderedRef: MutableRefObject<HTMLCanvasElement>,
  textureRef: MutableRefObject<Texture>,
  setRay: any
) => {
  const { camera, pointer, scene, raycaster, mouse } = threeProps
  if (!camera || !pointer || !scene || !raycaster || !mouse) {
    return
  }

  fabric.Object.prototype.transparentCorners = false
  fabric.Object.prototype.cornerColor = 'blue'
  fabric.Object.prototype.cornerStyle = 'circle'
  fabric.Object.prototype.cornerSize = 18
  fabric.Canvas.prototype.getPointer = (e, ignoreZoom) => {
    const upperCanvasEl = canvasRef.current.getSelectionElement()
    const bounds = canvasRef.current
      .getSelectionElement()
      .getBoundingClientRect()
    const boundsWidth = bounds.width || 0
    const boundsHeight = bounds.height || 0
    const pointerFabric = fabric.util.getPointer(
      e,
      canvasRef.current.getSelectionElement()
    )

    canvasRef.current.calcOffset()
    pointerFabric.x =
      Math.round(pointerFabric.x) - canvasRef.current.getCenter().left
    pointerFabric.y =
      Math.round(pointerFabric.y) - canvasRef.current.getCenter().top

    // /* BEGIN PATCH CODE */
    if (e.target !== canvasRef.current.getSelectionElement()) {
      scene.updateMatrixWorld()
      const rect = canvasRenderedRef.current.getBoundingClientRect()
      const array = [
        (e.changedTouches[0].clientX - rect.left) / rect.width,
        (e.changedTouches[0].clientY - rect.top) / rect.height,
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

        pointerFabric.x = Math.round(uv.x * 1024) - 4.5
        pointerFabric.y = Math.round(uv.y * 1024) - 5.5
      }
    }

    let cssScale = null
    if (boundsWidth === 0 || boundsHeight === 0) {
      cssScale = { width: 1, height: 1 }
    } else {
      cssScale = {
        width: upperCanvasEl.width / boundsWidth,
        height: upperCanvasEl.height / boundsHeight,
      }
    }

    return {
      x: pointerFabric.x * cssScale.width,
      y: pointerFabric.y * cssScale.height,
    }
  }
}
