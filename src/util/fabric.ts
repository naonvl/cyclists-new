import { Camera } from '@react-three/fiber'
import { fabric } from 'fabric'
import { Dispatch, MutableRefObject, SetStateAction } from 'react'

const deleteIcon =
  "data:image/svg+xml,%3C%3Fxml version='1.0' encoding='utf-8'%3F%3E%3C!DOCTYPE svg PUBLIC '-//W3C//DTD SVG 1.1//EN' 'http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd'%3E%3Csvg version='1.1' id='Ebene_1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' x='0px' y='0px' width='595.275px' height='595.275px' viewBox='200 215 230 470' xml:space='preserve'%3E%3Ccircle style='fill:%23F44336;' cx='299.76' cy='439.067' r='218.516'/%3E%3Cg%3E%3Crect x='267.162' y='307.978' transform='matrix(0.7071 -0.7071 0.7071 0.7071 -222.6202 340.6915)' style='fill:white;' width='65.545' height='262.18'/%3E%3Crect x='266.988' y='308.153' transform='matrix(0.7071 0.7071 -0.7071 0.7071 398.3889 -83.3116)' style='fill:white;' width='65.544' height='262.179'/%3E%3C/g%3E%3C/svg%3E"

export const renderIcon = (ctx, left, top, styleOverride, fabricObject) => {
  const img = document.createElement('img')
  img.src = deleteIcon
  let size = 24
  ctx.save()
  ctx.translate(left, top)
  ctx.rotate(fabric.util.degreesToRadians(fabricObject.angle))
  ctx.drawImage(img, -size / 2, -size / 2, size, size)
  ctx.restore()
}

export const deleteObject = (eventData, transform) => {
  let target = transform.target
  let canvas = target.canvas
  canvas.remove(target)
  canvas.requestRenderAll()
}

export const getIntersects = (raycaster, camera, pointer, objects) => {
  pointer.set(pointer.x * 2 - 1, -(pointer.y * 2) + 1)
  raycaster.setFromCamera(pointer, camera)
  return raycaster.intersectObjects(objects)
}

export const getRealPosition = (axis, value) => {
  let CORRECTION_VALUE = axis === 'x' ? 4.5 : 5.5
  // if (width < 800) {
  //   return Math.round(value * 1024) - CORRECTION_VALUE
  // }

  return Math.round(value * 2048) - CORRECTION_VALUE
}

export const getMousePosition = (rect: DOMRect, x: number, y: number) => {
  return [(x - rect.left) / rect.width, (y - rect.top) / rect.height]

  // let rect = dom.getBoundingClientRect()
  // return [(x - rect.left) / rect.width, (y - rect.top) / rect.height]
}

// export const getPositionOnSceneTouch = (
//   setRay,
//   sceneContainer,
//   evt,
//   pointer,
//   raycaster,
//   camera,
//   scene,
//   width
// ) => {
//   let array = getMousePosition(
//     sceneContainer,
//     evt.changedTouches[0].clientX,
//     evt.changedTouches[0].clientY
//   )
//   pointer.fromArray(array)
//   let intersects = getIntersects(raycaster, camera, pointer, scene.children)
//   if (intersects.length > 0 && intersects[0].uv) {
//     let uv = intersects[0].uv
//     setRay(uv)
//     // intersects[0].object.material.map.transformUv(uv);
//     let circle = new fabric.Circle({
//       radius: 3,
//       left: getRealPosition(width, 'x', uv.x),
//       top: getRealPosition(width, 'y', uv.y),
//       fill: 'white',
//     })
//     // canvas.add(circle);
//     return {
//       x: getRealPosition(width, 'x', uv.x),
//       y: getRealPosition(width, 'y', uv.y),
//     }
//   }
//   return null
// }

export const getPositionOnScene = (
  // width: number,
  scene: THREE.Scene,
  pointer: THREE.Vector2,
  raycaster: THREE.Raycaster,
  camera: Camera & {
    manual?: boolean
  },
  // setRay: Dispatch<
  //   SetStateAction<{
  //     x: number
  //     y: number
  //     z: number
  //   }>
  // >,
  sceneContainer,
  evt
) => {
  let array = getMousePosition(sceneContainer, evt.clientX, evt.clientY)
  // if (width < 800) {
  //   array = getMousePosition(
  //     sceneContainer,
  //     evt.changedTouches[0].clientX,
  //     evt.changedTouches[0].clientY
  //   )
  // } else {
  //   array = getMousePosition(sceneContainer, evt.clientX, evt.clientY)
  // }
  pointer.fromArray(array)
  let intersects: any = getIntersects(
    raycaster,
    camera,
    pointer,
    scene.children
  )
  if (intersects.length > 0 && intersects[0].uv) {
    let uv = intersects[0].uv
    // setRay(uv)
    // if (intersects[0].object.material.map) {
    //   intersects[0].object.material.map.transformUv(uv)
    // }
    // let circle = new fabric.Circle({
    //   radius: 20,
    //   left: getRealPosition(width, 'x', uv.x),
    //   top: getRealPosition(width, 'y', uv.y),
    //   fill: 'red',
    // })
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

interface InitCanvasProps {
  canvasRef: MutableRefObject<fabric.Canvas>
  width: number
  height: number
}
export const initFabricCanvas = ({
  canvasRef,
  width,
  height,
}: InitCanvasProps) => {
  canvasRef.current = new fabric.Canvas('canvas', {
    preserveObjectStacking: true,
    imageSmoothingEnabled: true,
    selection: false,
    width: width,
    height: height,
  })
}
