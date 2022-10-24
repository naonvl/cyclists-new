import useStore from '@/helpers/store'

const Overlay = () => {
  const isAddText = useStore((state) => state.isAddText)

  return isAddText ? (
    <div className='fixed top-0 bottom-0 left-0 right-0 z-50 bg-black opacity-50' />
  ) : null
}

export default Overlay
