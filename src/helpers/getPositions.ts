import { Vector2 } from 'three/src/math/Vector2'
import { Raycaster } from 'three/src/core/Raycaster'
import { Scene } from 'three/src/scenes/Scene'
import { OrthographicCamera } from 'three/src/cameras/OrthographicCamera'
import { PerspectiveCamera } from 'three/src/cameras/PerspectiveCamera'
import { getState, setState } from './store'
import { MouseEvent } from 'react'

export const getPositionPointer = (
  e: MouseEvent<HTMLDivElement, globalThis.MouseEvent>,
  rect: DOMRect,
  pointer: Vector2,
  mouse: Vector2,
  raycaster: Raycaster,
  scene: Scene,
  camera: (OrthographicCamera | PerspectiveCamera) & {
    manual?: boolean
  }
) => {
  const array = [
    (e.clientX - rect.left) / rect.width,
    (e.clientY - rect.top) / rect.height,
  ]
  pointer.fromArray(array)
  // Get intersects
  mouse.set(pointer.x * 2 - 1, -(pointer.y * 2) + 1)
  raycaster.setFromCamera(mouse, camera)
  const intersects = raycaster.intersectObjects(scene.children)
  // getState().updateTexture()

  if (intersects.length > 0 && intersects[0].uv) {
    let uv = intersects[0].uv
    setState({
      ray: {
        x: uv.x,
        y: uv.y,
        z: 0,
      },
    })
    return {
      x: Math.round(uv.x * getState().dimensions.width) - 4.5,
      y: Math.round(uv.y * getState().dimensions.height) - 5.5,
    }
  }
  return null
}

export const getPositionTouch = (
  e: TouchEvent,
  rect: DOMRect,
  pointer: Vector2,
  mouse: Vector2,
  raycaster: Raycaster,
  scene: Scene,
  camera: (OrthographicCamera | PerspectiveCamera) & {
    manual?: boolean
  }
) => {
  const array = [
    (e.changedTouches[0].clientX - rect.left) / rect.width,
    (e.changedTouches[0].clientY - rect.top) / rect.height,
  ]
  pointer.fromArray(array)
  // Get intersects
  mouse.set(pointer.x * 2 - 1, -(pointer.y * 2) + 1)
  raycaster.setFromCamera(mouse, camera)
  const intersects = raycaster.intersectObjects(scene.children)
  // getState().updateTexture()

  if (intersects.length > 0 && intersects[0].uv) {
    let uv = intersects[0].uv
    setState({
      ray: {
        x: uv.x,
        y: uv.y,
        z: 0,
      },
    })
    return {
      x: Math.round(uv.x * getState().dimensions.width) - 4.5,
      y: Math.round(uv.y * getState().dimensions.height) - 5.5,
    }
  }
  return null
}
