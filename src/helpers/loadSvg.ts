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
  const path: string = getState().isMobileVersion
    ? `/textures/Jersey_COLOR${texturePath}-mobile.svg`
    : `/textures/Jersey_COLOR${texturePath}.svg`

  let svgData: any = null
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

    // First render
    if (getState().colors.length === 0) {
      for (let i = 0; i < objects.length; i++) {
        currentColors.push({
          id: objects[i].id,
          fill: objects[i].fill,
        })
      }
    }

    // If user not change any color
    if (getState().colors.length > 0 && !getState().colorChanged) {
      for (let i = 0; i < objects.length; i++) {
        currentColors.push({
          id: objects[i].id,
          fill: objects[i].fill,
        })
      }
    }

    // If user had change colors and new texture have same length
    if (
      getState().colors.length > 0 &&
      getState().colorChanged &&
      objects.length === getState().colors.length
    ) {
      for (let i = 0; i < objects.length; i++) {
        currentColors.push({
          id: getState().colors[i].id,
          fill: getState().colors[i].fill,
        })

        svgData._objects[i].set('fill', getState().colors[i].fill)
      }
    }

    // If user had change colors and new texture different same colors length
    if (
      getState().colors.length > 0 &&
      getState().colorChanged &&
      objects.length !== getState().colors.length
    ) {
      for (let i = 0; i < objects.length; i++) {
        if (getState().colors[i] && getState().colors[i].id === objects[i].id) {
          currentColors.push({
            id: getState().colors[i].id,
            fill: getState().colors[i].fill,
          })

          svgData._objects[i].set('fill', getState().colors[i].fill)
        } else {
          currentColors.push({
            id: objects[i].id,
            fill: objects[i].fill,
          })

          svgData._objects[i].set('fill', objects[i].fill)
        }
      }
    }

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
