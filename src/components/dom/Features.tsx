import ArrowDownTrayIcon from '@heroicons/react/24/outline/ArrowDownTrayIcon'
import FlipControls from '@/components/dom/FlipControls'

interface FeaturesProps {
  componentLoading: boolean
}

const Features: React.FC<FeaturesProps> = ({ componentLoading }) => {
  return componentLoading ? (
    <>
      <div className='absolute z-30 inline-flex h-4 px-2 text-sm font-bold text-gray-800 uppercase bg-gray-300 cursor-pointer w-[53px] animate-pulse gap-1 top-[2rem] left-[6rem]' />
      <div className='absolute z-30 inline-flex h-4 px-2 text-sm font-bold text-gray-800 uppercase bg-gray-300 cursor-pointer w-[53px] animate-pulse gap-1 top-[2rem] right-[6rem]' />
    </>
  ) : (
    <>
      <FlipControls />

      <button
        type='button'
        className='absolute z-30 inline-flex px-2 text-sm font-bold text-gray-800 uppercase bg-white cursor-pointer gap-1 top-[1rem] right-[2rem]'
      >
        <ArrowDownTrayIcon className='w-5 h-5 text-gray-800' />
        <span>save</span>
      </button>
    </>
  )
}

export default Features
