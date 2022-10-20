import create from 'zustand'
import shallow from 'zustand/shallow'

import type { NextRouter } from 'next/router'
import type { MutableRefObject } from 'react'
import { defaultDimensions } from './constants'

interface State {
  isMobileVersion: boolean
  setIsMobileVersion: (param: boolean) => void
  dimensions: { width: number; height: number }
  setDimensions: (data: { width: number; height: number }) => void
  texturePath: number
  setTexturePath: (index: number) => void
  progress: boolean
  setProgress: (param: boolean) => void
  isLoading: boolean
  setIsLoading: (param: boolean) => void
  dropdownOpen: {
    stepOne: boolean
    stepTwo: boolean
    stepThree: boolean
  }
  zoom: number
  setZoom: (value: number) => void
  zoomIn: boolean
  zoomOut: boolean
  changeZoomIn: (param: boolean) => void
  changeZoomOut: (param: boolean) => void
  rotate: number
  setRotate: (value: number) => void
  rotateRight: boolean
  rotateLeft: boolean
  changeRotateRight: (param: boolean) => void
  changeRotateLeft: (param: boolean) => void
  isObjectFront: boolean
  setIsObjectFront: () => void
  cameraChanged: boolean
  setCameraChange: (param: boolean) => void
  width: number
  setWidth: (param: number) => void
  svgGroup: Array<any>
  setSvgGroup: (data: any) => void
  colors: Array<{ id: any; fill: any }>
  setColors: (data: any) => void
  colorChanged: boolean
  textureChanged: boolean
  setTextureChanged: (param: boolean) => void
  setColorChanged: (param: boolean) => void
  textChanged: boolean
  setTextChanged: (param: boolean) => void
  textActive: boolean
  setTextActive: (param: boolean) => void
  texture: {
    path: number
    width: number
    height: number
  }
  editText: boolean
  setEditText: (param: boolean) => void
  setTexture: (data: { path: number; width: number; height: number }) => void
  isAddText: boolean
  setIsAddText: (param: boolean) => void
  router: NextRouter
  dom: MutableRefObject<any>
}

const useStoreImpl = create<State>()((set) => ({
  editText: false,
  setEditText: (param) => set(() => ({ editText: param })),
  isMobileVersion: false,
  setIsMobileVersion: (param) => set(() => ({ isMobileVersion: param })),
  dimensions: {
    width: defaultDimensions.width,
    height: defaultDimensions.height,
  },
  setDimensions: ({ width, height }) =>
    set(() => ({ dimensions: { width: width, height: height } })),
  isAddText: false,
  setIsAddText: (param) => set(() => ({ isAddText: param })),
  texture: {
    path: 1,
    width: 2048,
    height: 2048,
  },
  setTexture: (data: { path: number; width: number; height: number }) =>
    set(() => ({
      texture: { path: data.path, width: data.width, height: data.height },
    })),
  colorChanged: false,
  textureChanged: false,
  setTextureChanged: (param) => set(() => ({ textureChanged: param })),
  setColorChanged: (param) => set(() => ({ colorChanged: param })),
  textChanged: false,
  setTextChanged: (param) => set(() => ({ textChanged: param })),
  width: 1400,
  setWidth: (param) => set(() => ({ width: param })),
  textActive: false,
  setTextActive: (param) => set(() => ({ textActive: param })),
  texturePath: 1,
  setTexturePath: (index) => set(() => ({ texturePath: index + 1 })),
  colors: [],
  setColors: (data: any) => set(() => ({ colors: data })),
  svgGroup: [],
  setSvgGroup: (data: any) => set(() => ({ svgGroup: data })),
  progress: true,
  setProgress: (param: boolean) => set(() => ({ progress: param })),
  isLoading: true,
  setIsLoading: (param: boolean) => set((state) => ({ isLoading: param })),
  dropdownOpen: {
    stepOne: false,
    stepTwo: false,
    stepThree: false,
  },
  zoom: 1,
  setZoom: (value) => set(() => ({ zoom: value })),
  zoomIn: false,
  changeZoomIn: (param) => set(() => ({ zoomIn: param })),
  zoomOut: false,
  changeZoomOut: (param) => set(() => ({ zoomOut: param })),
  rotate: 0,
  setRotate: (value) => set(() => ({ rotate: value })),
  rotateRight: false,
  rotateLeft: false,
  changeRotateRight: (param) => set(() => ({ rotateRight: param })),
  changeRotateLeft: (param) => set(() => ({ rotateLeft: param })),
  isObjectFront: true,
  setIsObjectFront: () =>
    set((state) => ({ isObjectFront: !state.isObjectFront })),
  cameraChanged: false,
  setCameraChange: (param) => set(() => ({ cameraChanged: param })),

  router: null,
  dom: null,
}))

const useStore = (sel: { (state: any): any }) => useStoreImpl(sel, shallow)
Object.assign(useStore, useStoreImpl)

const { getState, setState } = useStoreImpl

export { getState, setState }
export default useStore
