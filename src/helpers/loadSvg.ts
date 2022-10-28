import { fabric } from 'fabric'
import { getState, setState } from './store'
import { Texture } from 'three/src/textures/Texture'
import { ICanvas, ITexture } from '@/interfaces'

interface SVGData extends fabric.Object {
  id: string
}

interface Props extends ICanvas, ITexture {
  texturePath: number
}

const loadSvg = ({ canvasRef, textureRef, texturePath }: Props) => {
  console.log('RUNNING LOAD SVG')
  const path: string = getState().isMobileVersion
    ? `/textures/Jersey_COLOR${texturePath}-mobile.svg`
    : `/textures/Jersey_COLOR${texturePath}.svg`

  let svgData: fabric.Object | fabric.Group = null
  let currentColors: Array<{ id: any; fill: any }> = []

  fabric.loadSVGFromURL(path, (objects: SVGData[]) => {
    svgData = fabric.util.groupSVGElements(objects, {
      width: getState().dimensions.width,
      height: getState().dimensions.height,
      selectable: false,
      crossOrigin: 'anonymous',
    })

    svgData.top = 0
    svgData.left = 0
    svgData.name = `Jersey_COLOR${texturePath}`

    for (let i = 0; i < objects.length; i++) {
      currentColors.push({
        id: objects[i].id,
        fill: objects[i].fill,
      })
    }

    // if (getState().colors.length == 0) {
    //   for (let i = 0; i < objects.length; i++) {
    //     currentColors.push({
    //       id: objects[i].id,
    //       fill: objects[i].fill,
    //     })
    //   }
    // } else {
    //   currentColors = getState().colors
    // }

    // console.log(currentColors)

    if (canvasRef.current && canvasRef.current._objects.length > 0) {
      canvasRef.current.remove(canvasRef.current._objects[0])
    }

    if (canvasRef.current && objects && objects.length > 0) {
      canvasRef.current.add(svgData)
      canvasRef.current.sendToBack(svgData)
      canvasRef.current.renderAll()

      textureRef.current = new Texture(canvasRef.current.getElement())
      textureRef.current.flipY = false
      textureRef.current.needsUpdate = true

      setState({
        changed: true,
        svgGroup: svgData,
        colors: currentColors,
      })
    }
  })
}
export default loadSvg
