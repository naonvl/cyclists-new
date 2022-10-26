import Text from '@/components/dom/Text'
import useStore, { getState, subscribe } from '@/helpers/store'

interface Props {
  componentLoading: boolean
}

const PriceTag: React.FC<Props> = ({ componentLoading }) => {
  const [price, quantity] = useStore((state) => [state.price, state.quantity])

  return componentLoading && price === 0 ? (
    <div className='mx-auto bg-gray-300 h-[24px] w-[200px]' />
  ) : (
    <Text className='text-lg font-bold text-center'>
      £ {price * quantity} | <span className='text-sm'>save £13.00</span>{' '}
      <span className='text-red-500'>(25% off)</span>
    </Text>
  )
}

export default PriceTag
