import cn from 'clsx'
import Image from '@/components/dom/Image'
import Text from '@/components/dom/Text'
import useStore, { setState } from '@/helpers/store'

interface Props {
  componentLoading?: boolean
  isMobileVersion: boolean
}

const Helpers: React.FC<Props> = ({ componentLoading, isMobileVersion }) => {
  const isAutoRotate = useStore((state) => state.isAutoRotate)

  return componentLoading ? (
    <div
      className={cn(
        'items-center justify-center w-full my-2 ml-auto gap-3',
        {
          ['hidden lg:flex']: !isMobileVersion,
        },
        {
          ['flex lg:hidden']: isMobileVersion,
        }
      )}
    >
      <div className='relative inline-flex'>
        <div className='bg-gray-300 animate-pulse h-[40px] w-[40px]' />
      </div>
      <div className='relative inline-flex gap-2'>
        <div className='bg-gray-300 animate-pulse h-[40px] w-[40px]' />
        <div className='bg-gray-300 animate-pulse h-[40px] w-[208px]' />
      </div>
    </div>
  ) : (
    <div
      className={cn(
        'items-center  w-full my-2 ml-auto gap-3',
        {
          ['hidden justify-start lg:flex']: !isMobileVersion,
        },
        {
          ['flex justify-center lg:hidden']: isMobileVersion,
        }
      )}
    >
      <div
        className='relative inline-flex hover:cursor-pointer'
        onClick={() => setState({ isAutoRotate: !isAutoRotate })}
      >
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
  )
}

export default Helpers
