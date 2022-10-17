import { MutableRefObject } from 'react'
import { fabric } from 'fabric'

interface SVGData extends fabric.Object {
  id: string
}
interface LoadSVGProps {
  canvas: MutableRefObject<fabric.Canvas>
  textureRef: MutableRefObject<THREE.Texture>
  setTextureChanged: (param: boolean) => void
  setIsLoading: (param: boolean) => void
  setSvgGroup: (data: any) => void
  setColors: (data: any) => void
  colors: Array<{ id: any; fill: any }>
  texture: {
    path: number
    width: number
    height: number
  }
}

const loadSvg = ({
  canvas,
  textureRef,
  setIsLoading,
  setSvgGroup,
  setColors,
  setTextureChanged,
  colors,
  texture,
}: LoadSVGProps) => {
  const path: string =
    window.innerWidth < 800
      ? `/textures/Jersey_COLOR${texture.path}-mobile.svg`
      : `/textures/Jersey_COLOR${texture.path}.svg`

  return fabric.loadSVGFromURL(path, (objects: SVGData[]) => {
    const svgData = fabric.util.groupSVGElements(objects, {
      width: texture.width,
      height: texture.height,
      selectable: false,
      crossOrigin: 'anonymous',
    })

    svgData.top = 0
    svgData.left = 0
    setSvgGroup(svgData)

    if (colors.length == 0) {
      let currentColors: Array<{ id: any; fill: any }> = []

      for (let i = 0; i < objects.length; i++) {
        currentColors.push({
          id: objects[i].id,
          fill: objects[i].fill,
        })
      }
      setColors(currentColors)
    }

    if (canvas.current && canvas.current._objects[0] == undefined) {
      canvas.current.remove(canvas.current._objects[0])
    }

    if (canvas.current && objects && objects.length > 0) {
      canvas.current.add(svgData)
      canvas.current.sendToBack(svgData)
      canvas.current.renderAll()
      setIsLoading(false)
      setTextureChanged(false)
    }
  })
}
export default loadSvg
