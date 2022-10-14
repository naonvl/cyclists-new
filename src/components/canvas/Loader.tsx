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
          width={600}
          height={599}
          objectFit='cover'
          rootClass='z-30 top-[22rem] -right-[56.5rem] md:-right-[66.5rem] lg:-right-[64rem]'
          style={{
            position: 'absolute',
          }}
          quality={60}
          priority={true}
        />
      </div>
    </Html>
  )
}

export default Loader
