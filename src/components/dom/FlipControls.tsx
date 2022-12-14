import useStore, { setState } from '@/helpers/store'

const FlipControls = () => {
  const flipStatus = useStore((state) => state.flipStatus)

  const handleflipCamera = () => {
    setState({ flipChanged: true })
  }

  return (
    <button
      type='button'
      className='absolute z-30 px-2 text-sm font-bold text-gray-800 uppercase bg-white cursor-pointer top-[1rem] left-[2rem]'
      onClick={handleflipCamera}
    >
      view {flipStatus}
    </button>
  )
}

export default FlipControls
