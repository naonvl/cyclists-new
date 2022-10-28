import { GetStaticPaths, GetStaticProps } from 'next'
import dynamic from 'next/dynamic'
import { useState, useRef, useEffect, ChangeEvent } from 'react'
import ArrowDownTrayIcon from '@heroicons/react/24/outline/ArrowDownTrayIcon'
import useStore, { getState, setState } from '@/helpers/store'

import Image from '@/components/dom/Image'
import type { Canvas } from 'fabric/fabric-impl'
import { Texture } from 'three/src/textures/Texture'
import type { OrbitControls } from 'three-stdlib'
import type { Group } from 'three/src/objects/Group'

import Text from '@/components/dom/Text'
import Helpers from '@/components/dom/Helpers'
import DropdownControls from '@/components/dom/DropdownControls'
import ModalText from '@/components/dom/ModalText'
import AddTextContent from '@/components/dom/AddTextContent'
import ColorContent from '@/components/dom/ColorContent'
import TextureContent from '@/components/dom/TextureContent'
import StepControls from '@/components/dom/StepControls'
import StepNavigation from '@/components/dom/StepNavigation'
import useFirstRender from '@/components/hooks/useFirstRender'
import FormOrder from '@/components/dom/FormOrder'
import Overlay from '@/components/dom/Overlay'
import FlipControls from '@/components/canvas/FlipControls'
import PriceTag from '@/components/dom/PriceTag'
import cn from 'clsx'
import InputNumber from '@/components/dom/InputNumber'
import canvasToSVG from '@/helpers/canvasToSVG'
import generateTag from '@/helpers/generateTag'
import { ICanvas } from '@/interfaces'

import Link from 'next/link'
import loadSvg from '@/helpers/loadSvg'
import { fabric } from 'fabric'
import { initFabricCanvas } from '@/util/fabric'

interface SVGData extends fabric.Object {
  id: string
}

type FormDataType = {
  quantity: number
  size: string
  variantID: number
}

// Dynamic import is used to prevent a payload when the website start that will include threejs r3f etc..
// WARNING ! errors might get obfuscated by using dynamic import.
// If something goes wrong go back to a static import to show the error.
// https://github.com/pmndrs/react-three-next/issues/49
const Shirt = dynamic(() => import('@/components/canvas/Shirt'), {
  ssr: false,
})
const LCanvas = dynamic(() => import('@/components/layout/canvas'), {
  ssr: true,
})

// dom components goes here
const CustomerPage = (props) => {
  const canvasRef = useRef<Canvas>(null)
  const textureRef = useRef<Texture>(null)
  const controlsRef = useRef<OrbitControls>(null)
  const groupRef = useRef<Group>(null)

  const [isAddText, isLoading, isMobileVersion, dimensions] = useStore(
    (state) => [
      state.isAddText,
      state.isLoading,
      state.isMobileVersion,
      state.dimensions,
    ]
  )
  const cancelModalTextRef = useRef(null)
  const [openTextModal, setOpenTextModal] = useState(false)
  const [variants] = useStore((state) => [state.variants])
  const tagRef = useRef<string>(generateTag())

  const [formData, setFormData] = useState<FormDataType>({
    quantity: 1,
    size: 'S',
    variantID: 42808925978823,
  })
  const [formLoading, setIsLoading] = useState<boolean>(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    setIsLoading(true)
    const encodedData = canvasToSVG(canvasRef.current)

    const requestCreateOrder = await fetch('/api/createorder', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...formData,
        userId: props.cid,
        attachment: encodedData,
      }),
    })
    const responseOrder = await requestCreateOrder.json()

    if (responseOrder && responseOrder.success) {
      return setIsLoading(false)
    }

    return setIsLoading(false)
  }

  const handleChangeForm = (
    e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLSelectElement>
  ) => {
    if (e.target.name === 'id') {
      setFormData({
        ...formData,
        size: variants[
          variants.map((e: any) => e.id).indexOf(Number(e.target.value))
        ].option2,
      })
      setState({
        price: Number(
          variants[variants.map((e) => e.id).indexOf(Number(e.target.value))]
            .price
        ),
      })
    }

    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const decrementAction = () => {
    if (formData.quantity == 1) {
      return setFormData({ ...formData, quantity: 1 })
    }

    setState({
      quantity: formData.quantity - 1,
    })
    return setFormData({ ...formData, quantity: formData.quantity - 1 })
  }

  const incrementAction = () => {
    setState({
      quantity: formData.quantity + 1,
    })
    return setFormData({ ...formData, quantity: formData.quantity + 1 })
  }

  useFirstRender({ canvasRef, textureRef })

  return (
    <>
      <div className='flex flex-col px-4 mx-auto lg:px-16 lg:flex-row max-w-[1400px]'>
        <Overlay />
        <div className='lg:w-1/2'>
          <div className='my-5 lg:hidden'>
            <div className='relative'>
              <DropdownControls />
            </div>
            <div className='relative'>
              {/* <FlipControls /> */}

              <button
                type='button'
                className='absolute z-30 inline-flex text-sm font-bold text-gray-800 uppercase bg-white cursor-pointer gap-1 top-[1rem] right-[4rem]'
              >
                <ArrowDownTrayIcon className='w-5 h-5 text-gray-800' />
                <span>save</span>
              </button>
              {isAddText ? (
                <div className='absolute w-[60%] top-[24rem] left-3 z-[100]'>
                  <Text className='px-3 py-4 text-white bg-pink-500'>
                    Place the text by clicking on the model
                  </Text>
                </div>
              ) : null}
            </div>
            {CustomerPage?.r3f && isMobileVersion ? (
              <LCanvas
                style={{
                  height: '303px',
                  zIndex: isAddText ? '99' : '20',
                }}
                canvasRef={canvasRef}
                textureRef={textureRef}
              >
                {CustomerPage.r3f({
                  canvasRef,
                  textureRef,
                  controlsRef,
                  groupRef,
                })}
              </LCanvas>
            ) : null}
          </div>
          <Helpers componentLoading={isLoading} isMobileVersion={true} />
          <div className='mt-5 mb-3'>
            <StepControls />
          </div>
          <div className='mt-4 mb-1'>
            <TextureContent canvasRef={canvasRef} textureRef={textureRef} />
            <ColorContent canvasRef={canvasRef} textureRef={textureRef} />
            <AddTextContent canvasRef={canvasRef} textureRef={textureRef} />
          </div>
          <div className='mb-3'>
            <div className='p-3 bg-pink-200'>
              <Text className='text-xs font-bold text-black uppercase'>
                Need a custom design for your club, company or team? we can give
                you exactly what you need with no minimum order and quick
                turnaround time.{' '}
                <span className='text-pink-500'>just contact us</span>.
              </Text>
            </div>
          </div>
          <div className='my-2'>
            <StepNavigation />
          </div>
          {isLoading ? (
            <div>
              <div className='flex flex-col w-full mb-2 mt-7 md:flex-row md:gap-4'>
                <div className='bg-gray-300 animate-pulse w-[120px] h-[45px]' />
                <div className='bg-gray-300 animate-pulse w-[120px] h-[45px]' />
                <div className='bg-gray-300 animate-pulse w-[366px] h-[45px]' />
              </div>
            </div>
          ) : (
            <form
              action='https://cyclists.com/cart/add'
              method='POST'
              target='_blank'
              onSubmit={handleSubmit}
            >
              <div className='flex flex-col w-full mb-2 mt-7 md:flex-row md:gap-4'>
                <div className='flex w-full gap-2'>
                  <InputNumber
                    rootClass='w-full lg:w-auto'
                    id='totalOrder'
                    name='quantity'
                    type='number'
                    onChange={handleChangeForm}
                    value={formData.quantity}
                    min={1}
                    decrementAction={decrementAction}
                    incrementAction={incrementAction}
                    count={formData.quantity}
                  />
                  <select
                    defaultValue={42808925978823}
                    onChange={handleChangeForm}
                    name='id'
                    className='relative flex items-stretch w-full h-auto text-black bg-white border lg:w-auto py-[0.65rem] border-1 rounded-[0.10rem] md:items-center md:my-auto border-[#666]'
                  >
                    {variants.map((variant, index) => (
                      <option value={variant.id} key={index}>
                        {variant.option2}
                      </option>
                    ))}
                  </select>
                </div>
                <button
                  type='submit'
                  className={cn(
                    'w-full px-4 text-center py-3 text-sm uppercase',
                    {
                      ['cursor-not-allowed bg-white text-black border border-black']:
                        formLoading,
                    },
                    {
                      ['bg-pink-600 border border-pink-600 text-white my-2 hover:border hover:border-black hover:bg-white hover:text-black']:
                        !formLoading,
                    }
                  )}
                  disabled={formLoading}
                >
                  {formLoading ? 'Loading...' : 'add to cart'}
                </button>
              </div>
            </form>
          )}
        </div>

        <div className='block my-2 lg:hidden'>
          <PriceTag componentLoading={isLoading} />
        </div>

        <div className='hidden mx-5 lg:w-1/2 lg:block'>
          <div className='relative'>
            <DropdownControls componentLoading={isLoading} />
          </div>
          <div className='relative'>
            {/* <FlipControls /> */}

            <button
              type='button'
              className='absolute z-30 inline-flex text-sm font-bold text-gray-800 uppercase bg-white cursor-pointer gap-1 top-[1rem] right-[4rem]'
            >
              <ArrowDownTrayIcon className='w-5 h-5 text-gray-800' />
              <span>save</span>
            </button>
            {isAddText ? (
              <div className='absolute w-[45%] top-[24rem] left-3 z-[100]'>
                <Text className='px-3 py-4 text-white bg-pink-500'>
                  Place the text by clicking on the model
                </Text>
              </div>
            ) : null}
          </div>
          {CustomerPage?.r3f && !isMobileVersion ? (
            <LCanvas
              style={{
                width: '596px',
                height: '543px',
                zIndex: isAddText ? '99' : '20',
              }}
              canvasRef={canvasRef}
              textureRef={textureRef}
            >
              {CustomerPage.r3f({
                canvasRef,
                textureRef,
                controlsRef,
                groupRef,
              })}
            </LCanvas>
          ) : null}
          <Helpers componentLoading={isLoading} isMobileVersion={false} />
          <div className='hidden my-2 lg:block'>
            <PriceTag componentLoading={isLoading} />
          </div>
        </div>
      </div>

      <canvas id='canvas' style={{ display: 'none' }} />
      <ModalText
        open={openTextModal}
        setOpen={setOpenTextModal}
        cancelButtonRef={cancelModalTextRef}
      />
    </>
  )
}

// canvas components goes here
// It will receive same props as CustomerPage component (from getStaticProps, etc.)
CustomerPage.r3f = ({ canvasRef, textureRef, controlsRef, groupRef }) => (
  <>
    <Shirt
      canvasRef={canvasRef}
      controlsRef={controlsRef}
      groupRef={groupRef}
      textureRef={textureRef}
    />
  </>
)

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: true,
  }
}

export const getStaticProps: GetStaticProps = async (ctx) => {
  const { params } = ctx
  const cid = params.cid

  return {
    props: {
      title:
        'Cyclists | Jersey Customiser. Your jersey just the way you want it.',
      cid: cid,
    },
  }
}

export default CustomerPage
