import create from 'zustand'
import shallow from 'zustand/shallow'
import produce from 'immer'
import { initFabricCanvas } from '@/util/fabric'
import { defaultDimensions } from './constants'

import type { NextRouter } from 'next/router'
import type { Canvas } from 'fabric/fabric-impl'
import type { MutableRefObject } from 'react'
import { Texture } from 'three/src/textures/Texture'
import type { OrthographicCamera } from 'three/src/cameras/OrthographicCamera'
import type { PerspectiveCamera } from 'three/src/cameras/PerspectiveCamera'
import type { Group } from 'three/src/objects/Group'
import type { OrbitControls } from 'three-stdlib'
import type { MeshStandardMaterial } from 'three/src/materials/MeshStandardMaterial'
import { ICustomer, IVariants } from '@/interfaces'

interface State {
  isMobileVersion: boolean
  setIsMobileVersion: (param: boolean) => void
  dimensions: { width: number; height: number }
  setDimensions: (data: { width: number; height: number }) => void
  texturePath: number
  progress: boolean
  setProgress: (param: boolean) => void
  isLoading: boolean
  setIsLoading: (param: boolean) => void
  dropdownStepOpen: number
  width: number
  setWidth: (param: number) => void
  svgGroup: fabric.Object | fabric.Group
  colors: Array<{ id: any; fill: any }>
  setColors: (data: any) => void
  colorChanged: boolean
  textureChanged: boolean
  setTextureChanged: (param: boolean) => void
  textChanged: boolean
  textActive: boolean
  variants: Array<IVariants>
  ray: {
    x: number
    y: number
    z: number
  }
  setTextActive: (param: boolean) => void
  router: NextRouter
  dom: MutableRefObject<any>
  insertText: string
  resetInsertText: () => void
  resetFabricCanvas: () => void
  material: MeshStandardMaterial
  openTextModal: boolean
  allText: Array<string>
  editText: boolean
  activeText: {
    text: string
    fontFamily: string
    fill: string
    fontSize: number
    angle: number
    stroke: string
    strokeWidth: number
  }
  resetActiveText: () => void
  loadingModel: boolean
  canvas: Canvas
  texture: Texture
  camera: (OrthographicCamera | PerspectiveCamera) & {
    manual?: boolean
  }
  group: Group
  controls: OrbitControls
  flipCamera: (param: number) => void
  zoomCamera: (param: 'in' | 'out') => void
  rotateControl: (param: 'toRight' | 'toLeft') => void
  updateTexture: () => void
  changeActiveText: (param: {
    text: string
    fontFamily: string
    fill: string
    fontSize: number
    angle: number
    stroke: string
    strokeWidth: number
  }) => void
  quantity: number
  price: number
  isAddText: boolean
  indexActiveText: number
  changeColor: (index: number, newColor: string) => void
  user: ICustomer
}

const useStoreImpl = create<State>()((set, get) => ({
  indexActiveText: 0,
  isAddText: false,
  canvas: null,
  group: null,
  controls: null,
  material: null,
  insertText: '',
  user: null,
  variants: [],
  resetInsertText: () => set(() => ({ insertText: '', openTextModal: true })),
  resetFabricCanvas: () =>
    set((state) => ({
      canvas: initFabricCanvas({
        width: state.dimensions.width,
        height: state.dimensions.height,
      }),
    })),
  openTextModal: false,
  allText: [],
  editText: false,
  activeText: {
    text: '',
    fontFamily: 'Arial',
    fill: '#000000',
    fontSize: 0,
    angle: 0,
    stroke: '#000000',
    strokeWidth: 0,
  },
  changeActiveText: (param) =>
    set(() => ({
      activeText: {
        ...get().activeText,
        param,
      },
    })),
  ray: {
    x: 1,
    y: 1,
    z: 1,
  },
  resetActiveText: () =>
    set(() => ({
      activeText: {
        text: '',
        fontFamily: 'Arial',
        fill: '#000000',
        fontSize: 0,
        angle: 0,
        stroke: '#000000',
        strokeWidth: 0,
      },
      editText: false,
    })),
  dropdownStepOpen: 1,
  isMobileVersion: false,
  loadingModel: false,
  quantity: 1,
  price: 0,
  zoomCamera: (param) =>
    set(
      produce((state) => {
        if (param === 'in' && state.camera) {
          state.camera.position.x *= 0.9
          state.camera.position.y *= 0.9
          state.camera.position.z *= 0.9
        }

        if (param === 'out' && state.camera) {
          state.camera.position.x *= 1.1
          state.camera.position.y *= 1.1
          state.camera.position.z *= 1.1
        }
      })
    ),
  rotateControl: (param) =>
    set(
      produce((state) => {
        if (param === 'toRight' && state.group) {
          state.group.rotation.y += -Math.PI / 4
        }

        if (param === 'toLeft' && state.group) {
          state.group.rotation.y += Math.PI / 4
        }
      })
    ),
  setIsMobileVersion: (param) => set(() => ({ isMobileVersion: param })),
  dimensions: {
    width: defaultDimensions.width,
    height: defaultDimensions.height,
  },
  setDimensions: ({ width, height }) =>
    set(() => ({ dimensions: { width: width, height: height } })),
  texture: null,
  updateTexture: () =>
    set(
      produce((state) => {
        if (state.canvas) {
          // state.texture = new Texture(state.canvas.getElement())
          // state.texture.flipY = false
          state.texture.needsUpdate = true
          state.canvas.renderAll()
        }
      })
    ),
  colorChanged: false,
  textureChanged: false,
  setTextureChanged: (param) => set(() => ({ textureChanged: param })),
  textChanged: false,
  width: 1400,
  setWidth: (param) => set(() => ({ width: param })),
  textActive: false,
  setTextActive: (param) => set(() => ({ textActive: param })),
  texturePath: 1,
  colors: [],
  changeColor: (index, newColor) =>
    set(
      produce((state) => {
        state.colors[index].fill = newColor
      })
    ),
  setColors: (data: any) => set(() => ({ colors: data })),
  svgGroup: null,
  progress: true,
  setProgress: (param: boolean) => set(() => ({ progress: param })),
  isLoading: true,
  setIsLoading: (param: boolean) => set(() => ({ isLoading: param })),
  flipCamera: (param) =>
    set(
      produce((state) => {
        state.camera.position.z = param
      })
    ),
  router: null,
  dom: null,
  camera: null,
}))

const useStore = (sel: { (state: any): any }) => useStoreImpl(sel, shallow)
Object.assign(useStore, useStoreImpl)

const { getState, setState, subscribe } = useStoreImpl

export { getState, setState, subscribe }
export default useStore
