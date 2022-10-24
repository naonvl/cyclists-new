import { MutableRefObject, useCallback } from 'react'
import { fabric } from 'fabric'
import { getState, setState } from '@/helpers/store'

export const initPatch = (
  threeProps: {
    camera: any
    pointer: any
    scene: any
    raycaster: any
    mouse: any
    gl: any
  },
  canvasRenderedRef: MutableRefObject<HTMLCanvasElement>
) => {
  const { camera, pointer, scene, raycaster, mouse } = threeProps
  if (!camera || !pointer || !scene || !raycaster || !mouse) {
    return
  }

  fabric.Object.prototype.transparentCorners = false
  fabric.Object.prototype.cornerColor = 'blue'
  fabric.Object.prototype.cornerStyle = 'circle'
  fabric.Object.prototype.cornerSize = 18

  // if (editText || isAddText) {
  fabric.Canvas.prototype.getPointer = (e, ignoreZoom) => {
    const upperCanvasEl = getState().canvas.getSelectionElement()
    const bounds = getState()
      .canvas.getSelectionElement()
      .getBoundingClientRect()
    const boundsWidth = bounds.width || 0
    const boundsHeight = bounds.height || 0
    const pointerFabric = fabric.util.getPointer(
      e,
      getState().canvas.getSelectionElement()
    )
    pointerFabric.x =
      Math.round(pointerFabric.x) - getState().canvas.getCenter().left
    pointerFabric.y =
      Math.round(pointerFabric.y) - getState().canvas.getCenter().top

    // /* BEGIN PATCH CODE */
    if (e.target !== getState().canvas.getSelectionElement()) {
      const rect = canvasRenderedRef.current.getBoundingClientRect()
      let array = []
      if (e.changedTouches) {
        array = [
          (e.changedTouches[0].clientX - rect.left) / rect.width,
          (e.changedTouches[0].clientY - rect.top) / rect.height,
        ]
      } else {
        array = [
          (e.clientX - rect.left) / rect.width,
          (e.clientY - rect.top) / rect.height,
        ]
      }
      pointer.fromArray(array)
      // Get intersects
      mouse.set(pointer.x * 2 - 1, -(pointer.y * 2) + 1)
      raycaster.setFromCamera(mouse, camera)

      const intersects = raycaster.intersectObjects(scene.children)
      if (intersects.length > 0 && intersects[0].uv) {
        let uv = intersects[0].uv
        setState({ ray: uv })
        getState().updateTexture()

        pointerFabric.x = Math.round(uv.x * getState().dimensions.width) - 4.5
        pointerFabric.y = Math.round(uv.y * getState().dimensions.height) - 5.5
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
  threeProps: {
    camera: any
    pointer: any
    scene: any
    raycaster: any
    mouse: any
    gl: any
  },
  canvasRenderedRef: MutableRefObject<HTMLCanvasElement>
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
    const upperCanvasEl = getState().canvas.getSelectionElement()
    const bounds = getState()
      .canvas.getSelectionElement()
      .getBoundingClientRect()
    const boundsWidth = bounds.width || 0
    const boundsHeight = bounds.height || 0
    const pointerFabric = fabric.util.getPointer(
      e,
      getState().canvas.getSelectionElement()
    )

    pointerFabric.x =
      Math.round(pointerFabric.x) - getState().canvas.getCenter().left
    pointerFabric.y =
      Math.round(pointerFabric.y) - getState().canvas.getCenter().top

    // /* BEGIN PATCH CODE */
    if (e.target !== getState().canvas.getSelectionElement()) {
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
      if (intersects.length > 0 && intersects[0].uv) {
        let uv = intersects[0].uv
        setState({ ray: uv })

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
