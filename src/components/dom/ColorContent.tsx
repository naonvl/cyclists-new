import Dropdowns from '@/components/dom/Dropdowns'
import Text from '@/components/dom/Text'
import Color from '@/components/dom/Color'
import useStore, { setState, getState } from '@/helpers/store'

const ColorContent = () => {
  const dropdownSetOpen = useStore((state) => state.dropdownStepOpen)
  const colors = useStore((state) => state.colors)
  const svgGroup = useStore((state) => state.svgGroup)

  const handleSetColor = (e: string, index: number) => {
    let newArrColors = [...colors]
    newArrColors[index].fill = e
    svgGroup._objects[index].set('fill', e)
    getState().canvas.add(svgGroup)
    getState().canvas.sendToBack(svgGroup)
    getState().canvas.renderAll()
    setState({ svgGroup: svgGroup, colorChanged: true })
    getState().flipCamera(getState().camera.position.z + 0.001)
  }

  return (
    <Dropdowns
      onClick={() => setState({ dropdownStepOpen: 2 })}
      open={dropdownSetOpen === 2}
      buttonName='Choose your colours'
      rootClass='w-full mb-2 z-40'
      menuClass='w-full'
      menuBackground='bg-[#e5e5e5]'
      label='stepTwo'
    >
      <div className='px-2 grid grid-cols-3 gap-3'>
        {colors.map((data, index) => (
          <div
            key={index}
            className='inline-flex flex-col items-center justify-between w-full'
          >
            {data.id == 'base' ? (
              <Text className='mr-auto text-xs text-gray-600'>
                Choose the <b>Base</b> colour
              </Text>
            ) : (
              <Text className='mr-auto text-xs text-gray-600'>
                Choose the{' '}
                <b className='capitalize'>{data.id.replace('-', ' ')}</b> colour
              </Text>
            )}
            <div className='relative'>
              <Color
                color={data.fill}
                setCurrentColor={(e: string) => handleSetColor(e, index)}
              />
            </div>
          </div>
        ))}
      </div>
    </Dropdowns>
  )
}

export default ColorContent
