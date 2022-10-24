import { fabric } from 'fabric'
import { getState, setState } from './store'

interface SVGData extends fabric.Object {
  id: string
}

const loadSvg = () => {
  const path: string =
    window.innerWidth < 800
      ? `/textures/Jersey_COLOR${getState().texturePath}-mobile.svg`
      : `/textures/Jersey_COLOR${getState().texturePath}.svg`

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

    if (getState().colors.length == 0) {
      for (let i = 0; i < objects.length; i++) {
        currentColors.push({
          id: objects[i].id,
          fill: objects[i].fill,
        })
      }
    } else {
      currentColors = getState().colors
    }

    if (getState().canvas && getState().canvas._objects[0] == undefined) {
      getState().canvas.remove(getState().canvas._objects[0])
    }

    if (getState().canvas && objects && objects.length > 0) {
      getState().canvas.add(svgData)
      getState().canvas.sendToBack(svgData)
      getState().canvas.renderAll()
      setState({ svgGroup: svgData, colors: currentColors })
    }
  })
}
export default loadSvg
