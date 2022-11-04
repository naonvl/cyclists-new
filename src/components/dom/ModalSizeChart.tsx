import {
  Fragment,
  Dispatch,
  SetStateAction,
  MutableRefObject,
  ChangeEvent,
  MouseEvent,
  useRef,
  useState,
} from 'react'
import { Dialog, Transition } from '@headlessui/react'
import CloseIcon from '@heroicons/react/24/outline/XMarkIcon'
import Text from '@/components/dom/Text'
import useStore, { getState, setState } from '@/helpers/store'

interface ModalProps {
  open: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
  cancelButtonRef: MutableRefObject<any>
}

const ModalSizeChart = ({ open, setOpen, cancelButtonRef }: ModalProps) => {
  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog
        as='div'
        className='relative z-[999]'
        initialFocus={cancelButtonRef}
        onClose={() => setOpen(false)}
      >
        <Transition.Child
          as={Fragment}
          enter='ease-out duration-300'
          enterFrom='opacity-0'
          enterTo='opacity-100'
          leave='ease-in duration-200'
          leaveFrom='opacity-100'
          leaveTo='opacity-0'
        >
          <div className='fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity' />
        </Transition.Child>

        <div className='fixed inset-0 z-10 overflow-y-auto'>
          <div className='flex items-center justify-center min-h-full p-4 text-center sm:items-center sm:p-0'>
            <Transition.Child
              as={Fragment}
              enter='ease-out duration-300'
              enterFrom='opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'
              enterTo='opacity-100 translate-y-0 sm:scale-100'
              leave='ease-in duration-200'
              leaveFrom='opacity-100 translate-y-0 sm:scale-100'
              leaveTo='opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'
            >
              <Dialog.Panel className='relative overflow-hidden text-left bg-white border-2 border-gray-400 shadow-xl transform transition-all sm:my-8 sm:w-full sm:max-w-lg'>
                <div className='px-4 pt-5 pb-4 bg-white sm:p-6 sm:pb-4'>
                  <div className='flex items-start w-full'>
                    <div className='w-full mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left'>
                      <Dialog.Title
                        as='h3'
                        className='text-base font-bold text-gray-900 leading-6'
                      >
                        Enter text, name, number or slogan here
                      </Dialog.Title>
                      <div></div>
                    </div>
                  </div>
                </div>
                <div
                  className='absolute right-0 flex items-center justify-center flex-shrink-0 w-12 h-12 mt-1 mb-3 mr-3 rounded-full cursor-pointer -top-1 md:top-0 md:mb-0'
                  onClick={() => setOpen(false)}
                >
                  <CloseIcon
                    className='w-6 h-6 text-black'
                    aria-hidden='true'
                  />
                </div>
                <div className='flex flex-row justify-between px-6 mb-2 lg:py-3'></div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  )
}

export default ModalSizeChart
