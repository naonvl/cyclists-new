import ArrowDownTrayIcon from '@heroicons/react/24/outline/ArrowDownTrayIcon'
import FlipControls from '@/components/dom/FlipControls'

interface FeaturesProps {
  componentLoading: boolean
}

const Features: React.FC<FeaturesProps> = ({ componentLoading }) => {
  return componentLoading ? (
    <>
      <div className='w-6 h-4 bg-gray-300 animate-pulse' />
      <div className='w-6 h-4 bg-gray-300 animate-pulse' />
    </>
  ) : (
    <>
      <FlipControls />

      <button
        type='button'
        className='absolute z-30 inline-flex px-2 text-sm font-bold text-gray-800 uppercase bg-white cursor-pointer gap-1 top-[1rem] right-[4rem]'
      >
        <ArrowDownTrayIcon className='w-5 h-5 text-gray-800' />
        <span>save</span>
      </button>
    </>
  )
}

export default Features
