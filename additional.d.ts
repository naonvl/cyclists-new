import { Canvas, Object } from 'fabric/fabric-impl'

declare module 'fabric/fabric-impl' {
  interface IActiveObject extends Object {
    text: string
    fontFamily: string
    fontSize: number
    fill: string
    angle: number
    stroke: string
    strokeWidth: number
  }

  interface Canvas {
    _iTextInstances?: Array<any>
    getActiveObject(): IActiveObject
  }
}
