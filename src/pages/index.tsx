import cn from 'clsx'
import { GetStaticProps } from 'next'
import dynamic from 'next/dynamic'
import { useState, useRef, useEffect, useCallback, ChangeEvent } from 'react'
import ArrowDownTrayIcon from '@heroicons/react/24/outline/ArrowDownTrayIcon'
import useStore, { getState } from '@/helpers/store'

import Text from '@/components/dom/Text'
import Image from '@/components/dom/Image'
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
const Page = (props) => {
  const isAddText = useStore((state) => state.isAddText)
  const width = useStore((state) => state.width)
  const cancelModalTextRef = useRef(null)
  const [openTextModal, setOpenTextModal] = useState(false)

  useFirstRender()

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
            {Page?.r3f && props.width <= 768 ? (
              <LCanvas
                width={width}
                style={{
                  height: '303px',
                  zIndex: isAddText ? '99' : '20',
                }}
              >
                {Page.r3f()}
              </LCanvas>
            ) : null}
          </div>
          <div className='flex items-center justify-center w-full my-2 ml-auto lg:hidden gap-3'>
            <div className='relative inline-flex'>
              <Image
                alt='360'
                src='/icons/360.png'
                objectFit='contain'
                layout='fill'
                width={40}
                height={40}
                quality={80}
              />
            </div>
            <div className='relative inline-flex gap-2'>
              <Image
                alt='FAQ'
                src='/icons/FAQ.png'
                objectFit='contain'
                layout='fill'
                width={25}
                height={25}
                quality={80}
              />
              <Text>Do you have any questions?</Text>
            </div>
          </div>
          <div className='mt-5 mb-3'>
            <StepControls />
          </div>

          <div className='mt-4 mb-1'>
            <TextureContent />
            <ColorContent />
            <AddTextContent />
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

          <FormOrder />
        </div>

        <div className='block my-2 lg:hidden'>
          <PriceTag />
        </div>

        <div className='hidden mx-5 lg:w-1/2 lg:block'>
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
              <div className='absolute w-[45%] top-[24rem] left-3 z-[100]'>
                <Text className='px-3 py-4 text-white bg-pink-500'>
                  Place the text by clicking on the model
                </Text>
              </div>
            ) : null}
          </div>
          {Page?.r3f && props.width > 768 ? (
            <LCanvas
              width={width}
              style={{
                width: '596px',
                height: '543px',
                zIndex: isAddText ? '99' : '20',
              }}
            >
              {Page.r3f()}
            </LCanvas>
          ) : null}
          <div className='items-center justify-center hidden w-full my-2 ml-auto lg:flex gap-3'>
            <div className='relative inline-flex'>
              <Image
                alt='360'
                src='/icons/360.png'
                objectFit='contain'
                layout='fill'
                width={40}
                height={40}
                quality={80}
              />
            </div>
            <div className='relative inline-flex gap-2'>
              <Image
                alt='FAQ'
                src='/icons/FAQ.png'
                objectFit='contain'
                layout='fill'
                width={25}
                height={25}
                quality={80}
              />
              <Text>Do you have any questions?</Text>
            </div>
          </div>
          <div className='hidden my-2 lg:block'>
            <PriceTag />
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
// It will receive same props as Page component (from getStaticProps, etc.)
Page.r3f = () => (
  <>
    <Shirt />
  </>
)

export const getStaticProps: GetStaticProps = async (ctx) => {
  return {
    props: {
      title:
        'Cyclists | Jersey Customiser. Your jersey just the way you want it.',
      userId: 321321,
    },
  }
}

export default Page
