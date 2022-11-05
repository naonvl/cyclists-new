import { Html } from '@react-three/drei'
import Image from '@/components/dom/Image'

function Loader() {
  return (
    <Html as='div' transform={false} wrapperClass='loader' prepend>
      <div className='relative w-full h-auto ml-auto'>
        <Image
          alt='Cyclists Logo'
          src='/img/loader.gif'
          layout='fill'
          width={100}
          height={100}
          objectFit='cover'
          rootClass='z-30 top-[15rem] -right-[56.5rem] md:-right-[66.5rem] lg:top-[22rem] lg:-right-[64rem]'
          style={{
            position: 'absolute',
            transform: 'translate(-250px, 250px)'
          }}
          quality={100}
          priority={true}
        />
      </div>
    </Html>
  )
}

export default Loader
