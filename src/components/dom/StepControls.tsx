import cn from 'clsx'
import Text from '@/components/dom/Text'
import useStore, { setState } from '@/helpers/store'

const contens = {
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

  return (
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
          {contens.stepOne.step}
        </Text>
        <Text
          className={cn('text-xs uppercase', {
            ['text-pink-600']: dropdownStepOpen == 1,
          })}
        >
          {contens.stepOne.title}
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
          {contens.stepTwo.step}
        </Text>
        <Text
          className={cn('text-xs uppercase', {
            ['text-pink-600']: dropdownStepOpen == 2,
          })}
        >
          {contens.stepTwo.title}
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
          {contens.stepThree.step}
        </Text>
        <Text
          className={cn('text-xs uppercase', {
            ['text-pink-600']: dropdownStepOpen == 3,
          })}
        >
          {contens.stepThree.title}
        </Text>
      </div>
    </div>
  )
}

export default StepControls
