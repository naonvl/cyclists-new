import { fabric } from 'fabric'
import { getState, setState } from '@/helpers/store'

const addText = ({
  activeText,
  ray,
  dimensions,
  canvas,
  allText,
  insertText,
  camera,
}) => {
  console.log(activeText)
  const jerseyText = new fabric.IText(insertText, {
    ...activeText,
    textAlign: 'center',
    fontWeight: 'bold',
    left: ray.x * dimensions.width,
    top: ray.y * dimensions.height,
    originX: 'center',
    originY: 'center',
    hasRotatingPoint: false,
    selectable: true,
    editable: true,
    centeredScaling: true,
  })

  if (canvas) {
    jerseyText.setControlsVisibility({
      mt: false,
      mb: false,
      ml: false,
      mr: false,
      mtr: false,
    })
    canvas.add(jerseyText)
    canvas.setActiveObject(jerseyText)
    canvas.renderAll()
    setState({
      allText: [...allText, insertText],
      editText: true,
      isAddText: false,
    })
    getState().updateTexture()
    // getState().flipCamera(camera.position.z + 0.001)
  }
}

export default addText
