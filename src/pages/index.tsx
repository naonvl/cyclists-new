import { GetStaticProps } from 'next'
import Image from '@/components/dom/Image'

// dom components goes here
const Page = () => {
  return (
    <div className='flex items-center justify-center w-full h-screen'>
      <Image
        className='animate-pulse'
        alt='Cyclists'
        layout='fill'
        src='/img/cyclists-logo.webp'
        width={300}
        height={100}
        objectFit='contain'
        quality={90}
      />
    </div>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  return {
    redirect: {
      destination: '/6173971775687',
    },
    props: {},
  }
}

export default Page
