import Text from '@/components/dom/Text'
import { getState } from '@/helpers/store'

const PriceTag = () => {
  return (
    <Text className='text-lg font-bold text-center'>
      £ {getState().price * getState().quantity} |{' '}
      <span className='text-sm'>save £13.00</span>{' '}
      <span className='text-red-500'>(25% off)</span>
    </Text>
  )
}

export default PriceTag
