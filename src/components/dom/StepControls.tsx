import cn from 'clsx'
import Text from '@/components/dom/Text'
import useStore, { setState } from '@/helpers/store'

const contents = {
  stepOne: {
    step: 'Step 1',
    title: 'choose your style',
  },
  stepTwo: {
    step: 'Step 2',
    title: 'choose your colours',
  },
  stepThree: {
    step: 'Step 3',
    title: 'add text [If you want]',
  },
}

const StepControls = () => {
  const dropdownStepOpen = useStore((state) => state.dropdownStepOpen)
  const isLoading = useStore((state) => state.isLoading)

  return isLoading ? (
    <div className='flex justify-between overflow-hidden md:justify-between'>
      {[0, 1, 2].map((_, index) => (
        <div
          className='inline-flex flex-col items-start cursor-pointer gap-1 animate-pulse'
          key={index}
        >
          <div className='bg-gray-300 w-[95px] h-[20px]' />
          <div className='bg-gray-300 w-[140px] h-[20px]' />
        </div>
      ))}
    </div>
  ) : (
    <div className='flex justify-between overflow-hidden md:justify-between'>
      <div
        className='inline-flex flex-col items-center cursor-pointer'
        onClick={() => setState({ dropdownStepOpen: 1 })}
      >
        <Text
          className={cn('text-2xl lg:text-3xl font-bold w-full mr-auto', {
            ['text-pink-600']: dropdownStepOpen == 1,
          })}
        >
          {contents.stepOne.step}
        </Text>
        <Text
          className={cn('text-xs uppercase', {
            ['text-pink-600']: dropdownStepOpen == 1,
          })}
        >
          {contents.stepOne.title}
        </Text>
      </div>
      <div
        className='inline-flex flex-col items-center cursor-pointer'
        onClick={() => setState({ dropdownStepOpen: 2 })}
      >
        <Text
          className={cn('text-2xl lg:text-3xl font-bold w-full mr-auto', {
            ['text-pink-600']: dropdownStepOpen == 2,
          })}
        >
          {contents.stepTwo.step}
        </Text>
        <Text
          className={cn('text-xs uppercase', {
            ['text-pink-600']: dropdownStepOpen == 2,
          })}
        >
          {contents.stepTwo.title}
        </Text>
      </div>
      <div
        className='inline-flex flex-col items-center cursor-pointer'
        onClick={() => setState({ dropdownStepOpen: 3 })}
      >
        <Text
          className={cn('text-2xl lg:text-3xl font-bold w-full mr-auto', {
            ['text-pink-600']: dropdownStepOpen == 3,
          })}
        >
          {contents.stepThree.step}
        </Text>
        <Text
          className={cn('text-xs uppercase', {
            ['text-pink-600']: dropdownStepOpen == 3,
          })}
        >
          {contents.stepThree.title}
        </Text>
      </div>
    </div>
  )
}

export default StepControls
