import { MutableRefObject, useCallback, useEffect, useState } from 'react'
import { fabric } from 'fabric'
import * as THREE from 'three'

interface LoadTextureProps {
  canvas: MutableRefObject<fabric.Canvas>
  textureRef: MutableRefObject<THREE.CanvasTexture>
  setTextureChanged: (param: boolean) => void
  setIsLoading: (param: boolean) => void
  setSvgGroup: (data: any) => void
  setColors: (data: any) => void
  setWidth: (param: number) => void
  width: number
  colors: Array<{ id: any; fill: any }>
  texture: {
    path: number
    width: number
    height: number
  }
}
interface SVGData extends fabric.Object {
  id: string
}

const useLoadTexture = ({
  canvas,
  textureRef,
  setIsLoading,
  setSvgGroup,
  setColors,
  setTextureChanged,
  setWidth,
  width,
  colors,
  texture,
}: LoadTextureProps) => {
  const [mobile, setMobile] = useState(false)
  const path: string = mobile
    ? `/textures/Jersey_COLOR${texture.path}-mobile.svg`
    : `/textures/Jersey_COLOR${texture.path}.svg`

  const loadSVG = useCallback(() => {
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

      if (canvas.current && objects.length > 0) {
        canvas.current.add(svgData)
        canvas.current.sendToBack(svgData)
        canvas.current.renderAll()
        textureRef.current = new THREE.CanvasTexture(
          canvas.current.getElement()
        )
        canvas.current.renderAll()
        setIsLoading(false)
        setTextureChanged(false)
      }
    })
  }, [
    canvas,
    colors.length,
    path,
    setColors,
    setIsLoading,
    setSvgGroup,
    setTextureChanged,
    texture.height,
    texture.width,
    textureRef,
  ])

  useEffect(() => {
    if (window.innerWidth < 800) {
      setWidth(1024)
      setMobile(() => true)
    } else {
      setWidth(2048)
      setMobile(() => false)
    }

    canvas.current = new fabric.Canvas('canvas', {
      preserveObjectStacking: true,
      imageSmoothingEnabled: true,
      selection: false,
      width: width,
      height: width,
    })

    loadSVG()

    return () => {
      canvas.current?.dispose()
      canvas.current = null
    }
  }, [canvas, loadSVG, setWidth, width])
}

export default useLoadTexture
