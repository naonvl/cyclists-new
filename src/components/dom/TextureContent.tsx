import cn from 'clsx'
import Dropdowns from '@/components/dom/Dropdowns'
import Image from '@/components/dom/Image'
import useStore, { setState } from '@/helpers/store'
import { jerseyStyles } from '@/constants'
import loadSvg from '@/helpers/loadSvg'
import { Texture } from 'three/src/textures/Texture'
import { ICanvas, ITexture } from '@/interfaces'

interface Props extends ICanvas, ITexture {}

const TextureContent = ({ canvasRef, textureRef }: Props) => {
  const [
    dropdownStepOpen,
    texturePath,
    isLoading,
    isMobileVersion,
    dimensions,
  ] = useStore((state) => [
    state.dropdownStepOpen,
    state.texturePath,
    state.isLoading,
    state.isMobileVersion,
    state.dimensions,
  ])

  const handleChangeTexture = (index: number) => {
    setState({
      texturePath: index + 1,
    })
    loadSvg({ canvasRef, textureRef })
  }

  return (
    <Dropdowns
      onClick={() => setState({ dropdownStepOpen: 1 })}
      open={dropdownStepOpen === 1}
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
