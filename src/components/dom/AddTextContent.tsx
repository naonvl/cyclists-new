import cn from 'clsx'
import { ChangeEvent } from 'react'
import Dropdowns from '@/components/dom/Dropdowns'
import useStore, { setState, getState } from '@/helpers/store'
import { fonts } from '@/constants'
import { fabricControls } from '@/util/fabric'
import { Texture } from 'three/src/textures/Texture'
import { ICanvas, ITexture } from '@/interfaces'

interface Props extends ICanvas, ITexture {}

const AddTextContent: React.FC<Props> = ({ canvasRef, textureRef }) => {
  const editText = useStore((state) => state.editText)
  const allText = useStore((state) => state.allText)
  const activeText = useStore((state) => state.activeText)
  const dropdownStepOpen = useStore((state) => state.dropdownStepOpen)
  const indexActiveText = useStore((state) => state.indexActiveText)

  const handleCloseActiveText = () => {
    canvasRef.current.discardActiveObject()
    getState().resetActiveText()
    canvasRef.current.renderAll()
    textureRef.current = new Texture(canvasRef.current.getElement())
    textureRef.current.flipY = false
    textureRef.current.needsUpdate = true
    setState({ changed: true })
  }
  const handleChangeTextData = (
    e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLSelectElement>
  ) => {
    canvasRef.current.getActiveObject().set<any>(e.target.name, e.target.value)

    if (e.target.name == 'text') {
      let newAllText = [...allText]
      newAllText[indexActiveText - 1] = e.target.value
      setState({
        allText: newAllText,
      })
    }

    setState({
      activeText: {
        ...activeText,
        [e.target.name]: e.target.value,
      },
    })
    canvasRef.current.renderAll()
    textureRef.current = new Texture(canvasRef.current.getElement())
    textureRef.current.flipY = false
    textureRef.current.needsUpdate = true
    setState({ changed: true })
  }

  const handleDecrement = (name: string) => {
    const currentValue = activeText[name]
    const value = currentValue - 1
    canvasRef.current.getActiveObject().set<any>(name, value)

    setState({
      activeText: {
        ...activeText,
        [name]: value,
      },
      textChanged: true,
    })
    canvasRef.current.renderAll()
    textureRef.current = new Texture(canvasRef.current.getElement())
    textureRef.current.flipY = false
    textureRef.current.needsUpdate = true
    setState({ changed: true })
  }

  const handleIncrement = (name: string) => {
    const currentValue = activeText[name]
    const value = currentValue + 1
    canvasRef.current.getActiveObject().set<any>(name, value)

    setState({
      activeText: {
        ...activeText,
        [name]: value,
      },
      textChanged: true,
    })
    canvasRef.current.renderAll()
    textureRef.current = new Texture(canvasRef.current.getElement())
    textureRef.current.flipY = false
    textureRef.current.needsUpdate = true
    setState({ changed: true })
  }

  const { text, fontFamily, fill, fontSize, angle, stroke, strokeWidth } =
    activeText

  return (
    <Dropdowns
      onClick={() => setState({ dropdownStepOpen: 3 })}
      open={dropdownStepOpen === 3}
      buttonName='Add text'
      rootClass='w-full mb-2 z-0'
      menuClass='w-full'
      label='stepThree'
    >
      {!editText ? (
        <>
          <div className='flex flex-col w-full overflow-hidden'>
            <div className='mx-auto mb-2'>
              <button
                onClick={() => {
                  getState().resetInsertText()
                }}
                type='button'
                className="px-4 py-3 text-sm text-white uppercase bg-pink-500 before:content-[' '] before:w-[25%] md:before:w-[30%] before:h-[3px] before:bg-pink-300 before:absolute before:left-6 before:top-7 after:content-[' after:w-[25%] md:after:w-[30%] after:h-[3px] after:bg-pink-300 after:absolute after:right-6 after:top-7 hover:bg-pink-600"
              >
                create text
              </button>
            </div>
          </div>
          <div>
            {allText.map((data, index) => (
              <div
                key={index}
                className='flex p-3'
                style={{
                  flexDirection: 'column',
                  background: '#F9F9F9',
                }}
              >
                <div
                  className='flex'
                  style={{
                    borderBottom: '1px solid grey',
                    textAlign: 'left',
                    textTransform: 'capitalize',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <span>
                    {index + 1}. {data}
                  </span>
                  <div className='flex'>
                    <button
                      onClick={() => {
                        canvasRef.current.setActiveObject(
                          canvasRef.current._iTextInstances[index]
                        )
                        setState({
                          indexActiveText: index + 1,
                          activeText: canvasRef.current.getActiveObject(),
                          editText: true,
                        })
                        fabricControls()
                        textureRef.current.needsUpdate = false
                        canvasRef.current.renderAll()
                      }}
                    >
                      edit
                    </button>
                    <button
                      className='ml-[10px]'
                      onClick={() => {
                        canvasRef.current.remove(
                          canvasRef.current._iTextInstances[index]
                        )
                        canvasRef.current.renderAll()
                        canvasRef.current.renderAll()
                        textureRef.current = new Texture(
                          canvasRef.current.getElement()
                        )
                        textureRef.current.flipY = false
                        textureRef.current.needsUpdate = true
                        setState({
                          allText: allText.filter((item) => item !== data),
                          changed: true,
                        })
                        // getState().flipCamera(
                        //   getState().camera.position.z + 0.001
                        // )
                      }}
                    >
                      delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <>
          <div
            className='p-3'
            style={{ background: '#F9F9F9', color: '#3D3D3D' }}
          >
            <div className='flex justify-end ml-auto'>
              <button
                className='text-xs text-gray-500 underline'
                onClick={handleCloseActiveText}
              >
                Close
              </button>
            </div>
            <div>
              <div className='w-full p-3 border-b border-gray-500 border-solid'>
                <label htmlFor='changeText'>Text</label>
                <input
                  type='text'
                  placeholder='Enter text here'
                  className='w-full border-gray-400'
                  name='text'
                  value={text}
                  onChange={handleChangeTextData}
                />
              </div>
              <div className='flex flex-col p-3 border-b border-gray-500 border-solid lg:flex-row lg:justify-between lg:items-center'>
                <div>
                  <label htmlFor='changeFont'>Font</label>
                  <select
                    onChange={handleChangeTextData}
                    name='fontFamily'
                    className='ml-2 form-control'
                    value={fontFamily}
                    id='changeFont'
                  >
                    {fonts.map((font, index) => (
                      <option key={index} value={font} className='capitalize'>
                        {font}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor='color'>Font Color</label>
                  <input
                    type='color'
                    className='ml-[10px]'
                    name='fill'
                    value={fill}
                    id='color'
                    onChange={handleChangeTextData}
                  />
                </div>
                <div className='flex items-center'>
                  <label htmlFor='inputFontSize'>Font Size</label>
                  <div className='flex ml-[10px]'>
                    <input
                      id='inputFontSize'
                      hidden
                      readOnly
                      type='number'
                      name='fontSize'
                      value={fontSize}
                    />
                    <button
                      className='py-0 border px-[20px] m-[3px] border-[#d4d4d4]'
                      onClick={() => handleDecrement('fontSize')}
                    >
                      -
                    </button>
                    <button
                      className='py-0 border px-[20px] m-[3px] border-[#d4d4d4]'
                      onClick={() => handleIncrement('fontSize')}
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
              <div className='flex items-center p-3 border-b border-gray-500 border-solid lg:justify-end'>
                <label htmlFor='rotation'>Text Rotation</label>
                <div className='flex ml-[10px]'>
                  <input
                    id='inputAngle'
                    hidden
                    readOnly
                    type='number'
                    name='angle'
                    value={angle}
                  />
                  <button
                    className='py-0 border border-solid border-[#D4D4D4] m-[3px] bg-[#F6F6F6] px-[20px]'
                    onClick={() => handleDecrement('angle')}
                  >
                    -
                  </button>
                  <button
                    className='py-0 border border-solid border-[#D4D4D4] m-[3px] bg-[#F6F6F6] px-[20px]'
                    onClick={() => handleIncrement('angle')}
                  >
                    +
                  </button>
                </div>
              </div>
              <div className='flex items-center p-3 border-b border-gray-500 border-solid lg:justify-end'>
                <label htmlFor='outlineColor'>Outline Color</label>
                <input
                  type='color'
                  className='ml-[10px]'
                  value={stroke}
                  name='stroke'
                  id='outlineColor'
                  onChange={handleChangeTextData}
                />
              </div>
              <div className='flex items-center p-3 border-b border-gray-500 border-solid lg:justify-end'>
                <label htmlFor='color'>Outline Thickness</label>
                <div className='flex ml-[10px]'>
                  <input
                    id='inputStrokeWidth'
                    hidden
                    readOnly
                    type='number'
                    name='strokeWidth'
                    value={strokeWidth}
                  />
                  <button
                    disabled={strokeWidth == 0}
                    className={cn(
                      'py-0 border border-solid  m-[3px] px-[20px]',
                      {
                        ['bg-[#dfdfdf] text-[#a3a3a3]']: strokeWidth == 0,
                        ['bg-[#F6F6F6] border-[#D4D4D4]']: strokeWidth > 0,
                      }
                    )}
                    onClick={() => handleDecrement('strokeWidth')}
                  >
                    -
                  </button>
                  <button
                    className='py-0 border border-solid border-[#D4D4D4] m-[3px] bg-[#F6F6F6] px-[20px]'
                    onClick={() => handleIncrement('strokeWidth')}
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </Dropdowns>
  )
}

export default AddTextContent
