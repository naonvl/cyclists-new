import { Canvas } from 'fabric/fabric-impl'

const canvasToSVG = (canvas: Canvas): string => {
  let image = `data:image/svg+xml;utf8,${encodeURIComponent(canvas.toSVG())}`
  let imageTemp = document.createElement('img')
  imageTemp.src = image
  let s = new XMLSerializer().serializeToString(imageTemp)
  let encodedData = window.btoa(s)
  return encodedData
}

export default canvasToSVG
