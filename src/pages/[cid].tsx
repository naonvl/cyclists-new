import { GetStaticPaths, GetStaticProps } from 'next'
import dynamic from 'next/dynamic'
import { useState, useRef, useEffect } from 'react'
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
import FlipControls from '@/components/dom/FlipControls'
import PriceTag from '@/components/dom/PriceTag'
import Features from '@/components/dom/PriceTag'

import Link from 'next/link'
import loadSvg from '@/helpers/loadSvg'
import { fabric } from 'fabric'
import { initFabricCanvas } from '@/util/fabric'

interface SVGData extends fabric.Object {
  id: string
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
              <Features componentLoading={isLoading} />
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

          <FormOrder
            canvasRef={canvasRef}
            cid={props.cid}
            componentLoading={isLoading}
          />
        </div>

        <div className='block my-2 lg:hidden'>
          <PriceTag componentLoading={isLoading} />
        </div>

        <div className='hidden mx-5 lg:w-1/2 lg:block'>
          <div className='relative'>
            <DropdownControls componentLoading={isLoading} />
          </div>
          <div className='relative'>
            <Features componentLoading={isLoading} />

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
