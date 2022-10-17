import { fabric } from 'fabric'
import { MutableRefObject } from 'react'

interface AddTextProps {
  text: string
  canvasRef: MutableRefObject<fabric.Canvas | null>
  left: number
  top: number
}

const addText = ({ text, canvasRef, left, top }: AddTextProps) => {
  const jerseyText = new fabric.IText('Test', {
    fontSize: 40,
    textAlign: 'center',
    fontWeight: 'bold',
    left: left,
    top: top,
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
    return jerseyText
  }
}

export default addText
