import { fabric } from 'fabric'
import { getState, setState } from '@/helpers/store'
import { ICanvas, ITexture } from '@/interfaces'

interface Props extends ICanvas, ITexture {}

const addText = ({ canvasRef, textureRef }: Props) => {
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

  if (canvasRef.current) {
    jerseyText.setControlsVisibility({
      mt: false,
      mb: false,
      ml: false,
      mr: false,
      mtr: false,
    })
    canvasRef.current.add(jerseyText)
    canvasRef.current.setActiveObject(jerseyText)
    canvasRef.current.renderAll()
    setState({
      allText: [...getState().allText, getState().insertText],
      activeText: canvasRef.current.getActiveObject(),
      editText: true,
      isAddText: false,
    })
    textureRef.current.needsUpdate = true
    canvasRef.current.renderAll()
    // getState().flipCamera(camera.position.z + 0.001)
  }
}

export default addText
