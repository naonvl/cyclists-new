import cn from 'clsx'
import useStore, { getState, setState } from '@/helpers/store'

const StepNavigation = () => {
  const dropdownStepOpen = useStore((state) => state.dropdownStepOpen)

  const handlePrev = () => {
    if (dropdownStepOpen == 1) {
      return setState({ dropdownStepOpen: 1 })
    }

    setState({ dropdownStepOpen: dropdownStepOpen - 1 })
  }

  const handleNext = () => {
    if (dropdownStepOpen == 3) {
      return setState({ dropdownStepOpen: 3 })
    }

    setState({ dropdownStepOpen: dropdownStepOpen + 1 })
  }

  return (
    <div className='flex justify-between'>
      <button
        type='button'
        className={cn(
          'text-center py-3 px-6 lg:py-2 lg:px-8 uppercase text-sm hover:border hover:border-black hover:bg-white hover:text-black',
          {
            ['border border-black bg-white text-black']: dropdownStepOpen === 1,
          },
          {
            ['bg-pink-600 border border-pink-600 text-white']:
              dropdownStepOpen !== 1,
          }
        )}
        onClick={handlePrev}
      >
        prev
      </button>
      <button
        type='button'
        className={cn(
          'text-center py-3 px-6 lg:py-2 lg:px-8 uppercase text-sm hover:border hover:border-black hover:bg-white hover:text-black',
          {
            ['border border-black bg-white text-black']: dropdownStepOpen === 3,
          },
          {
            ['bg-pink-600 border border-pink-600 text-white']:
              dropdownStepOpen !== 3,
          }
        )}
        onClick={handleNext}
      >
        next
      </button>
    </div>
  )
}

export default StepNavigation
