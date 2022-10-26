import cn from 'clsx'
import Dropdowns from '@/components/dom/Dropdowns'
import Image from '@/components/dom/Image'
import useStore, { setState } from '@/helpers/store'
import { jerseyStyles } from '@/constants'
import loadSvg from '@/helpers/loadSvg'

const TextureContent = () => {
  const dropdownSetOpen = useStore((state) => state.dropdownStepOpen)
  const texturePath = useStore((state) => state.texturePath)
  const isLoading = useStore((state) => state.isLoading)

  const handleChangeTexture = (index: number) => {
    setState({
      loadingModel: true,
      textureChanged: true,
      texturePath: index + 1,
    })
    // canvasRef.current.clear()
    // canvasRef.current.dispose()
    return loadSvg()

    // initFabricCanvas({
    //   canvasRef,
    //   width: dimensions.width,
    //   height: dimensions.height,
    // })
  }

  return (
    <Dropdowns
      onClick={() => setState({ dropdownStepOpen: 1 })}
      open={dropdownSetOpen === 1}
      buttonName='Choose your style'
      rootClass='w-full mb-2 z-0'
      menuClass='w-full'
      label='stepOne'
    >
      <div className={cn('flex flex-row overflow-hidden gap-2')}>
        {isLoading
          ? jerseyStyles.map((_, index) => (
              <div
                className={cn(
                  'flex flex-col items-center justify-center w-full cursor-not-allowed pt-3 my-2 bg-gray-300 animate-pulse h-[200px]'
                )}
                key={index}
              />
            ))
          : jerseyStyles.map(({ text, image }, index) => (
              <div
                className={cn(
                  'flex flex-col items-center justify-center w-full cursor-pointer hover:border hover:border-pink-600 pt-3 my-2',
                  {
                    ['border border-pink-600']: texturePath === index + 1,
                  },
                  {
                    ['bg-gray-300 animate-pulse cursor-not-allowed']: isLoading,
                  }
                )}
                onClick={() => handleChangeTexture(index)}
                key={index}
              >
                <Image
                  alt={text}
                  src={image}
                  objectFit='contain'
                  layout='fill'
                  width='100%'
                  height={95}
                  quality={80}
                  style={{
                    maxWidth: '177px',
                  }}
                />
                <button
                  type='button'
                  className={cn(
                    'w-full h-[3.5rem] px-3 text-sm font-bold text-center py-2 uppercase text-black'
                  )}
                >
                  {text}
                </button>
              </div>
            ))}
      </div>
    </Dropdowns>
  )
}

export default TextureContent
