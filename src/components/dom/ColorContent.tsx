import Dropdowns from '@/components/dom/Dropdowns'
import Text from '@/components/dom/Text'
import Color from '@/components/dom/Color'
import useStore, { setState } from '@/helpers/store'
import { ICanvas, ITexture } from '@/interfaces'

interface Props extends ICanvas, ITexture {}

const ColorContent: React.FC<Props> = ({ canvasRef, textureRef }) => {
  const [dropdownStepOpen, colors, svgGroup, changeColor] = useStore(
    (state) => [
      state.dropdownStepOpen,
      state.colors,
      state.svgGroup,
      state.changeColor,
    ]
  )

  const handleSetColor = (e: string, index: number) => {
    svgGroup._objects[index].set('fill', e)
    changeColor(index, e)
    setState({
      svgGroup: svgGroup,
      colorChanged: true,
    })
    canvasRef.current
      .remove(canvasRef.current._objects[0])
      .add(svgGroup)
      .sendToBack(svgGroup)
    textureRef.current.needsUpdate = true
    canvasRef.current.renderAll()
    // getState().flipCamera(getState().camera.position.z + 0.001)
  }

  return (
    <Dropdowns
      onClick={() => setState({ dropdownStepOpen: 2 })}
      open={dropdownStepOpen === 2}
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
