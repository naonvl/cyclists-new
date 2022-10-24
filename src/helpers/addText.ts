import { fabric } from 'fabric'
import { getState, setState } from '@/helpers/store'

const addText = () => {
  const jerseyText = new fabric.IText(getState().insertText, {
    text: getState().insertText,
    fontFamily: 'Arial',
    fill: '#000000',
    fontSize: getState().isMobileVersion ? 30 : 40,
    angle: 0,
    stroke: '#000000',
    strokeWidth: 0,
    textAlign: 'center',
    fontWeight: 'bold',
    left: getState().ray.x * getState().dimensions.width,
    top: getState().ray.y * getState().dimensions.height,
    originX: 'center',
    originY: 'center',
    hasRotatingPoint: false,
    selectable: true,
    editable: true,
    centeredScaling: true,
  })

  if (getState().canvas) {
    jerseyText.setControlsVisibility({
      mt: false,
      mb: false,
      ml: false,
      mr: false,
      mtr: false,
    })
    getState().canvas.add(jerseyText)
    getState().canvas.setActiveObject(jerseyText)
    getState().canvas.renderAll()
    setState({
      allText: [...getState().allText, getState().insertText],
      activeText: getState().canvas.getActiveObject(),
      editText: true,
      isAddText: false,
    })
    getState().updateTexture()
    // getState().flipCamera(camera.position.z + 0.001)
  }
}

export default addText
