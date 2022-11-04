import cn from 'clsx'
import Text from '@/components/dom/Text'
import useStore, { getState, subscribe } from '@/helpers/store'

interface Props {
  componentLoading: boolean
  isMobileVersion: boolean
}

const PriceTag: React.FC<Props> = ({ componentLoading, isMobileVersion }) => {
  const [price, quantity] = useStore((state) => [state.price, state.quantity])

  return componentLoading && price === 0 ? (
    <div className='mx-auto bg-gray-300 h-[24px] w-[200px]' />
  ) : (
    <Text
      className={cn(
        'text-lg font-bold',
        {
          ['text-left']: !isMobileVersion,
        },
        {
          ['text-center']: isMobileVersion,
        }
      )}
    >
      £ {price * quantity} | <span className='text-sm'>save £13.00</span>{' '}
      <span className='text-red-500'>(25% off)</span>
    </Text>
  )
}

export default PriceTag
