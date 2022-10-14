import cn from 'clsx'
import { GetStaticProps } from 'next'
import dynamic from 'next/dynamic'
import {
  useState,
  useRef,
  useEffect,
  useLayoutEffect,
  useCallback,
} from 'react'
import { fabric } from 'fabric'
import ArrowDownTrayIcon from '@heroicons/react/24/outline/ArrowDownTrayIcon'
import useStore from '@/helpers/store'

import Text from '@/components/dom/Text'
import Navbar from '@/components/dom/Navbar'
import Dropdowns from '@/components/dom/Dropdowns'
import Image from '@/components/dom/Image'
import { jerseyStyles } from '@/constants'
import InputNumber from '@/components/dom/InputNumber'
import DropdownControls from '@/components/dom/DropdownControls'
import loadSvg from '@/helpers/loadSvg'
import addText from '@/helpers/addText'
import ModalText from '@/components/dom/ModalText'
import Color from '@/components/dom/Color'
import { getPositionOnScene } from '@/util/fabric'

// Dynamic import is used to prevent a payload when the website start that will include threejs r3f etc..
// WARNING ! errors might get obfuscated by using dynamic import.
// If something goes wrong go back to a static import to show the error.
// https://github.com/pmndrs/react-three-next/issues/49
const Shirt = dynamic(() => import('@/components/canvas/Shirt'), {
  ssr: false,
})
const LCanvas = dynamic(() => import('@/components/layout/canvas'), {
  ssr: true,
})

// dom components goes here
let price = 51.99
const Page = (props) => {
  const canvasRef = useRef<fabric.Canvas>()

  const isAddText = useStore((state) => state.isAddText)
  const setIsAddText = useStore((state) => state.setIsAddText)
  const changeZoomIn = useStore((state) => state.changeZoomIn)
  const changeZoomOut = useStore((state) => state.changeZoomOut)
  const texture = useStore((state) => state.texture)
  const textureChanged = useStore((state) => state.textureChanged)
  const setTextureChanged = useStore((state) => state.setTextureChanged)
  const setTexture = useStore((state) => state.setTexture)
  const changeRotateRight = useStore((state) => state.changeRotateRight)
  const changeRotateLeft = useStore((state) => state.changeRotateLeft)
  const setIsObjectFront = useStore((state) => state.setIsObjectFront)
  const isObjectFront = useStore((state) => state.isObjectFront)
  const setCameraChange = useStore((state) => state.setCameraChange)
  const isLoading = useStore((state) => state.isLoading)
  const setIsLoading = useStore((state) => state.setIsLoading)
  const svgGroup = useStore((state) => state.svgGroup)
  const setColorChanged = useStore((state) => state.setColorChanged)
  const setWidth = useStore((state) => state.setWidth)
  const width = useStore((state) => state.width)
  const setTextChanged = useStore((state) => state.setTextChanged)
  const setTextActive = useStore((state) => state.setTextActive)
  const colors = useStore((state) => state.colors)
  const setColors = useStore((state) => state.setColors)
  const setSvgGroup = useStore((state) => state.setSvgGroup)
  const inputNumberRef = useRef<HTMLInputElement>(null)
  const [text, setText] = useState('')
  const cancelModalTextRef = useRef(null)
  const [openTextModal, setOpenTextModal] = useState(false)
  const [ray, setRay] = useState({ x: 1, y: 1, z: 1 })
  const [step, setStep] = useState(1)

  const [allText, setAllText] = useState([])
  const [activeText, setActiveText] = useState(0)
  const [currentFont, setCurrentFont] = useState('')
  const [fontSize, setFontSize] = useState(30)
  const [editText, setEditText] = useState(false)
  const [mobile, setMobile] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState({
    stepOne: false,
    stepTwo: false,
    stepThree: false,
  })

  const [addStep, setAddStep] = useState({
    name: '',
    fontSize: 16,
    fontFamily: 'Roboto',
  })
  const [formData, setFormData] = useState({
    id: null,
    quantity: 1,
  })

  const [uid, setUid] = useState('')
  const [submitLoading, setSubmitLoading] = useState(false)
  const handleSubmit = async () => {
    setSubmitLoading(true)
    let image = `data:image/svg+xml;utf8,${encodeURIComponent(
      canvasRef.current.toSVG()
    )}`
    let imageTemp = document.createElement('img')
    imageTemp.src = image
    let s = new XMLSerializer().serializeToString(imageTemp)
    let encodedData = window.btoa(s)

    await fetch('/api/createorder', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        attachment: encodedData,
        userId: undefined,
        id: formData.id,
        quantity: formData.quantity,
      }),
    })

    setSubmitLoading(false)
  }

  // const getCurrentUser = (id) => {
  //   fetch('https://39e4-180-244-130-245.ap.ngrok.io/api/getuser', {
  //     method: 'GET',
  //     body: JSON.stringify(id),
  //   }).then((data) => {
  //     console.log(data)
  //   })
  // }

  useEffect(() => {
    if (window.innerWidth < 800) {
      setWidth(1024)
      setMobile(true)
    } else {
      setWidth(2048)
      setMobile(false)
    }

    canvasRef.current = new fabric.Canvas('canvas', {
      preserveObjectStacking: true,
      imageSmoothingEnabled: true,
      selection: false,
      width: width,
      height: width,
    })

    loadSvg({
      mobile: mobile,
      texture: texture,
      canvas: canvasRef,
      setSvgGroup,
      setColors,
      isLoading,
      setIsLoading,
      setTextureChanged,
    })

    // console.log(svgGroup)

    // cleanup
    return () => {
      canvasRef.current?.dispose()
      canvasRef.current = null
    }
  }, [
    isLoading,
    mobile,
    setColors,
    setIsLoading,
    setSvgGroup,
    setTextureChanged,
    setWidth,
    texture,
    width,
  ])

  useEffect(() => {
    switch (step) {
      case 1:
        return setDropdownOpen({
          stepOne: true,
          stepTwo: false,
          stepThree: false,
        })
      case 2:
        return setDropdownOpen({
          stepOne: false,
          stepTwo: true,
          stepThree: false,
        })
      case 3:
        return setDropdownOpen({
          stepOne: false,
          stepTwo: false,
          stepThree: true,
        })

      default:
        return setDropdownOpen({
          stepOne: true,
          stepTwo: false,
          stepThree: false,
        })
    }
  }, [step])

  const handleFlipCamera = () => {
    setIsObjectFront()
    setCameraChange(true)
  }

  const handleChangeTexture = (index: number) => {
    setIsLoading(true)
    setTextureChanged(true)
    if (width < 800) {
      setTexture({
        path: index + 1,
        width: 1024,
        height: 1024,
      })
    } else {
      setTexture({
        path: index + 1,
        width: 2048,
        height: 2048,
      })
    }
  }

  const decrementAction = () => {
    if (formData.quantity == 1) {
      return setFormData({ ...formData, quantity: 1 })
    }

    return setFormData({ ...formData, quantity: formData.quantity - 1 })
  }

  const incrementAction = () => {
    return setFormData({ ...formData, quantity: formData.quantity + 1 })
  }

  const handleChange = (e: any) => {
    setAddStep({ ...addStep, [e.target.name]: e.target.value })
  }

  const handleChangeForm = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handlePrev = () => {
    if (step == 1) {
      return setStep(1)
    }

    setStep(step - 1)
  }

  const handleNext = () => {
    if (step == 3) {
      return setStep(3)
    }

    setStep(step + 1)
  }
  let fonts = [
    'Arial',
    'Arial Black',
    'Comic Sans MS',
    'Courier',
    'Didot',
    'Georgia',
    'Helvetica',
    'Impact',
    'Lucida Console',
    'MMA-Champ',
    'Tahoma',
    'Times New Roman',
    'Trebuchet MS',
    'Verdana ',
  ]
  const handleChangeText = (e, index) => {
    // canvasRef.current.getActiveObject().text = e.target.value
    let newData = [...allText]
    newData[index] = e.target.value
    setAllText(newData)
    canvasRef.current.renderAll()
    setTextChanged(true)
  }
  const handleOpen = (e: any) => {
    const label: string | null = e.currentTarget.ariaLabel

    if (label === null) return null

    switch (label) {
      case 'stepOne':
        return setStep(1)
      case 'stepTwo':
        return setStep(2)
      case 'stepThree':
        return setStep(3)
      default:
        return setStep(1)
    }
  }
  const handleClickCanvas = () => {
    setIsAddText(false)
    if (isAddText) {
      setTextChanged(true)
      setTimeout(() => {
        setTextChanged(false)
      }, 300)
      setAllText((allText) => [...allText, text])
      if (width < 800) {
        addText({
          text: text,
          canvasRef: canvasRef,
          left: ray.x * 1024,
          top: ray.y * 1024,
        })
      } else {
        addText({
          text: text,
          canvasRef: canvasRef,
          left: ray.x * 2048,
          top: ray.y * 2048,
        })
      }
    }
  }

  return (
    <>
      {/* <Navbar /> */}

      {/* <div className='px-4 py-2 bg-[#f9f9f9] lg:px-16 lg:py-4'>
        <Text className='text-xs'>
          Home | Jersey Customiser. Your jersey just the way you want it.
        </Text>
      </div> */}

      <div className='flex flex-col px-4 mx-auto lg:px-16 lg:flex-row max-w-[1400px]'>
        {isAddText ? (
          <div className='fixed top-0 bottom-0 left-0 right-0 z-50 bg-black opacity-50' />
        ) : null}
        <div className='lg:w-1/2'>
          <div className='my-5 lg:hidden'>
            <div className='relative'>
              <DropdownControls
                zoomInClick={() => changeZoomIn(true)}
                zoomOutClick={() => changeZoomOut(true)}
                rotateRightClick={() => changeRotateRight(true)}
                rotateLeftClick={() => changeRotateLeft(true)}
              />
            </div>
            <div className='relative'>
              <button
                type='button'
                className='absolute z-30 px-3 text-sm font-bold text-gray-800 uppercase bg-white cursor-pointer top-[1rem] left-[4rem]'
                onClick={handleFlipCamera}
              >
                view {isObjectFront ? 'back' : 'front'}
              </button>

              <button
                type='button'
                className='absolute z-30 inline-flex text-sm font-bold text-gray-800 uppercase bg-white cursor-pointer gap-1 top-[1rem] right-[4rem]'
              >
                <ArrowDownTrayIcon className='w-5 h-5 text-gray-800' />
                <span>save</span>
              </button>
              {isAddText ? (
                <div className='absolute w-[60%] top-[24rem] left-3 z-[100]'>
                  <Text className='px-3 py-4 text-white bg-pink-500'>
                    Place the text by clicking on the model
                  </Text>
                </div>
              ) : null}
            </div>
            {Page?.r3f && props.width <= 768 ? (
              <LCanvas
                onClick={handleClickCanvas}
                canvasRef={canvasRef}
                width={width}
                style={{
                  height: '543px',
                  zIndex: isAddText ? '99' : '20',
                }}
              >
                {Page.r3f({ canvasRef, setRay, setActiveText, setEditText })}
              </LCanvas>
            ) : null}
          </div>
          <div className='flex items-center justify-center w-full my-2 ml-auto lg:hidden gap-3'>
            <div className='relative inline-flex'>
              <Image
                alt='360'
                src='/icons/360.png'
                objectFit='contain'
                layout='fill'
                width={40}
                height={40}
                quality={80}
              />
            </div>
            <div className='relative inline-flex gap-2'>
              <Image
                alt='FAQ'
                src='/icons/FAQ.png'
                objectFit='contain'
                layout='fill'
                width={25}
                height={25}
                quality={80}
              />
              <Text>Do you have any questions?</Text>
            </div>
          </div>
          <div className='mt-5 mb-3'>
            <div className='flex justify-between overflow-hidden md:justify-between'>
              <div
                className='inline-flex flex-col items-center cursor-pointer'
                onClick={() => setStep(1)}
              >
                <Text
                  className={cn(
                    'text-2xl lg:text-3xl font-bold w-full mr-auto',
                    {
                      ['text-pink-600']: step == 1,
                    }
                  )}
                >
                  Step 1
                </Text>
                <Text
                  className={cn('text-xs uppercase', {
                    ['text-pink-600']: step == 1,
                  })}
                >
                  choose your style
                </Text>
              </div>
              <div
                className='inline-flex flex-col items-center cursor-pointer'
                onClick={() => setStep(2)}
              >
                <Text
                  className={cn(
                    'text-2xl lg:text-3xl font-bold w-full mr-auto',
                    {
                      ['text-pink-600']: step == 2,
                    }
                  )}
                >
                  Step 2
                </Text>
                <Text
                  className={cn('text-xs uppercase', {
                    ['text-pink-600']: step == 2,
                  })}
                >
                  choose your colours
                </Text>
              </div>
              <div
                className='inline-flex flex-col items-center cursor-pointer'
                onClick={() => setStep(3)}
              >
                <Text
                  className={cn(
                    'text-2xl lg:text-3xl font-bold w-full mr-auto',
                    {
                      ['text-pink-600']: step == 3,
                    }
                  )}
                >
                  Step 3
                </Text>
                <Text
                  className={cn('text-xs uppercase', {
                    ['text-pink-600']: step == 3,
                  })}
                >
                  add text [If you want]
                </Text>
              </div>
            </div>
          </div>

          <div className='mt-4 mb-1'>
            <Dropdowns
              onClick={(e: any) => handleOpen(e)}
              open={dropdownOpen.stepOne}
              buttonName='Choose your style'
              rootClass='w-full mb-2 z-0'
              menuClass='w-full'
              label='stepOne'
            >
              <div className='flex flex-row overflow-hidden'>
                {jerseyStyles.map(({ text, image }, index) => (
                  <div
                    className={cn(
                      'flex flex-col items-center justify-center w-full cursor-pointer hover:border hover:border-pink-600 pt-3 my-2',
                      {
                        ['border border-pink-600']: texture.path === index + 1,
                      }
                    )}
                    onClick={() => handleChangeTexture(index)}
                    key={index}
                  >
                    <Image
                      alt={text}
                      src={image}
                      objectFit='contain'
                      layout='fill'
                      width='100%'
                      height={95}
                      quality={80}
                      style={{
                        maxWidth: '177px',
                      }}
                    />
                    <button
                      type='button'
                      className={cn(
                        'w-full h-[3.5rem] px-3 text-sm font-bold text-center py-2 uppercase text-black'
                      )}
                    >
                      {text}
                    </button>
                  </div>
                ))}
              </div>
            </Dropdowns>

            <Dropdowns
              onClick={(e: any) => handleOpen(e)}
              open={dropdownOpen.stepTwo}
              buttonName='Choose your colours'
              rootClass='w-full mb-2 z-40'
              menuClass='w-full'
              menuBackground='bg-[#e5e5e5]'
              label='stepTwo'
            >
              <div className='grid grid-cols-3 gap-3'>
                {colors.map((data, index) => (
                  <div
                    key={index}
                    className='inline-flex flex-col items-center justify-between w-full'
                  >
                    <Text className='mr-auto text-xs text-gray-600'>
                      {data.id == 'base'
                        ? `Choose the base colour`
                        : `Choose accent colour ${data.id}`}
                    </Text>
                    <div className='relative'>
                      <Color
                        color={data.fill}
                        setCurrentColor={(e: string) => {
                          let newArrColors = [...colors]
                          newArrColors[index].fill = e
                          svgGroup._objects[index].set('fill', e)
                          canvasRef.current.renderAll()
                          setColorChanged(true)
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </Dropdowns>

            <Dropdowns
              onClick={(e: any) => handleOpen(e)}
              open={dropdownOpen.stepThree}
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
                        onClick={() => setOpenTextModal(true)}
                        type='button'
                        className="px-4 py-3 text-sm text-white uppercase bg-pink-500 before:content-[' '] before:w-[25%] md:before:w-[30%] before:h-[3px] before:bg-pink-300 before:absolute before:left-6 before:top-7 after:content-[' after:w-[25%] md:after:w-[30%] after:h-[3px] after:bg-pink-300 after:absolute after:right-6 after:top-7 hover:bg-pink-600"
                      >
                        create text
                      </button>
                    </div>
                  </div>
                  <div>
                    {allText.map((data, index) => (
                      <>
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
                                  setActiveText(index + 1)
                                  // console.log(canvasRef.current.getObjects())
                                  // canvasRef.current.setActiveObject(
                                  //   canvasRef.current.item(index + 1)
                                  // )
                                  setEditText(true)
                                }}
                              >
                                edit
                              </button>
                              <button
                                onClick={() => {
                                  // canvasRef.current.remove(
                                  //   canvasRef.current.item(index + 1)
                                  // )
                                  canvasRef.current.renderAll()
                                  // console.log(canvasRef.current._objects)
                                  setAllText(
                                    allText.filter((item) => item !== data)
                                  )
                                }}
                                style={{ marginLeft: '10px' }}
                              >
                                delete
                              </button>
                            </div>
                          </div>
                        </div>
                      </>
                    ))}
                  </div>
                </>
              ) : (
                <>
                  <div
                    className='p-3'
                    style={{ background: '#F9F9F9', color: '#3D3D3D' }}
                  >
                    <div key={activeText}>
                      <div
                        className='p-3'
                        style={{
                          borderBottom: '1px solid grey',
                          width: '100%',
                        }}
                      >
                        <input
                          type='text'
                          placeholder='Enter text here'
                          className='w-full border-gray-400'
                          name='customText'
                          value={allText[activeText - 1]}
                          onChange={(e) => {
                            handleChangeText(e, activeText - 1)
                          }}
                        />
                      </div>
                      <div
                        className='flex p-3'
                        style={{
                          borderBottom: '1px solid grey',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                        }}
                      >
                        <div>
                          <label htmlFor='select'>Font</label>
                          <select
                            onChange={(e) => {
                              if (canvasRef.current) {
                                // canvasRef.current.getActiveObject().fontFamily =
                                //   e.target.value
                                setTextChanged(true)
                                setCurrentFont(e.target.value)
                              }
                            }}
                            className='form-control'
                            style={{ marginLeft: '10px' }}
                            name=''
                            id='select'
                          >
                            {fonts.map((font, index) => (
                              <option
                                key={index}
                                value={font}
                                style={{ textTransform: 'capitalize' }}
                              >
                                {font}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label htmlFor='color'>Font Color</label>
                          <input
                            type='color'
                            style={{ marginLeft: '10px' }}
                            name=''
                            id='color'
                            onChange={(e) => {
                              // console.log(e.target.value)
                              canvasRef.current
                                .getActiveObject()
                                .set('fill', e.target.value)
                              setTextChanged(true)
                              canvasRef.current.renderAll()
                            }}
                          />
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                          <label htmlFor='size'>Font Size</label>
                          <div style={{ marginLeft: '10px', display: 'flex' }}>
                            <button
                              style={{
                                padding: '0px 20px',
                                background: 'F6F6F6',
                                margin: '3px',
                                border: '1px solid #D4D4D4',
                              }}
                              onClick={() => {
                                // setFontSize(
                                //   canvasRef.current.getActiveObject().fontSize -
                                //     1
                                // )
                                // canvasRef.current
                                //   .getActiveObject()
                                //   .set('fontSize', fontSize)
                                // setTextChanged(true)
                              }}
                            >
                              -
                            </button>
                            <button
                              style={{
                                padding: '0px 20px',
                                background: 'F6F6F6',
                                margin: '3px',
                                border: '1px solid #D4D4D4',
                              }}
                              onClick={() => {
                                // setFontSize(
                                //   canvasRef.current.getActiveObject().fontSize +
                                //     1
                                // )
                                // canvasRef.current
                                //   .getActiveObject()
                                //   .set('fontSize', fontSize)
                                // setTextChanged(true)
                              }}
                            >
                              +
                            </button>
                          </div>
                        </div>
                      </div>
                      <div
                        className='p-3'
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'flex-end',
                          borderBottom: '1px solid grey',
                        }}
                      >
                        <label htmlFor='rotation'>Text Rotation</label>
                        <div style={{ marginLeft: '10px', display: 'flex' }}>
                          <button
                            style={{
                              padding: '0px 20px',
                              background: 'F6F6F6',
                              margin: '3px',
                              border: '1px solid #D4D4D4',
                            }}
                          >
                            -
                          </button>
                          <button
                            style={{
                              padding: '0px 20px',
                              background: 'F6F6F6',
                              margin: '3px',
                              border: '1px solid #D4D4D4',
                            }}
                          >
                            +
                          </button>
                        </div>
                      </div>
                      <div
                        className='p-3'
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'flex-end',
                          borderBottom: '1px solid grey',
                        }}
                      >
                        <label htmlFor='outlineColor'>Outline Color</label>
                        <input
                          type='color'
                          style={{ marginLeft: '10px' }}
                          name=''
                          id='outlineColor'
                        />
                      </div>
                      <div
                        className='p-3'
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'flex-end',
                          borderBottom: '1px solid grey',
                        }}
                      >
                        <label htmlFor='color'>Outline Thickness</label>
                        <div style={{ marginLeft: '10px', display: 'flex' }}>
                          <button
                            style={{
                              padding: '0px 20px',
                              background: 'F6F6F6',
                              margin: '3px',
                              border: '1px solid #D4D4D4',
                            }}
                          >
                            -
                          </button>
                          <button
                            style={{
                              padding: '0px 20px',
                              background: 'F6F6F6',
                              margin: '3px',
                              border: '1px solid #D4D4D4',
                            }}
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
          </div>

          <div className='mb-3'>
            <div className='p-3 bg-pink-200'>
              <Text className='text-xs font-bold text-black uppercase'>
                Need a custom design for your club, company or team? we can give
                you exactly what you need with no minimum order and quick
                turnaround time.{' '}
                <span className='text-pink-500'>just contact us</span>.
              </Text>
            </div>
          </div>

          <div className='my-2'>
            <div className='flex justify-between'>
              <button
                type='button'
                className={cn(
                  'text-center py-3 px-6 lg:py-2 lg:px-8 uppercase text-sm hover:border hover:border-black hover:bg-white hover:text-black',
                  {
                    ['border border-black bg-white text-black']:
                      dropdownOpen.stepOne,
                  },
                  {
                    ['bg-pink-600 border border-pink-600 text-white']:
                      dropdownOpen.stepTwo || dropdownOpen.stepThree,
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
                    ['border border-black bg-white text-black']:
                      dropdownOpen.stepThree,
                  },
                  {
                    ['bg-pink-600 border border-pink-600 text-white']:
                      dropdownOpen.stepOne || dropdownOpen.stepTwo,
                  }
                )}
                onClick={handleNext}
              >
                next
              </button>
            </div>
          </div>

          <form
            action='https://cyclists.com/cart/add'
            method='POST'
            onSubmit={handleSubmit}
          >
            <div className='flex flex-col w-full mb-2 mt-7 md:flex-row md:gap-4'>
              {/* <input
                type='text'
                hidden
                name='id'
                value={42778299957447}
                readOnly
              /> */}
              <input
                type='text'
                hidden
                name='note'
                value='JERSEY-CUSTOM'
                readOnly
              />
              <InputNumber
                id='totalOrder'
                name='quantity'
                onChange={handleChangeForm}
                value={formData.quantity}
                min={1}
                decrementAction={decrementAction}
                incrementAction={incrementAction}
                count={formData.quantity}
                ref={inputNumberRef}
              />
              <select
                onChange={handleChangeForm}
                name='id'
                className='relative flex items-stretch h-auto text-black bg-white border py-[0.65rem] border-1 rounded-[0.25rem] md:items-center md:my-auto border-[#666]'
              >
                <option value={42778299957447}>XS</option>
                <option value={42778299957447}>S</option>
                <option value={42778299957447}>M</option>
                <option value={42778299957447}>L</option>
                <option value={42778299957447}>XL</option>
                <option value={42778299957447}>2XL</option>
                <option value={42778299957447}>3XL</option>
              </select>
              <button
                // onClick={handleSubmit}
                type='submit'
                className={cn(
                  'w-full px-4 text-center py-3 text-sm uppercase',
                  {
                    ['cursor-not-allowed bg-white text-black border border-black']:
                      submitLoading,
                  },
                  {
                    ['bg-pink-600 border border-pink-600 text-white my-2 hover:border hover:border-black hover:bg-white hover:text-black']:
                      !submitLoading,
                  }
                )}
                disabled={submitLoading}
              >
                {submitLoading ? 'Loading...' : 'add to cart'}
              </button>
            </div>
          </form>
        </div>

        <div className='block my-2 lg:hidden'>
          <Text className='text-lg font-bold text-center'>
            £ {price * formData.quantity} | <span className='text-sm'>save £13.00</span>{' '}
            <span className='text-red-500'>(25% off)</span>
          </Text>
        </div>

        <div className='hidden mx-5 lg:w-1/2 lg:block'>
          <div className='relative'>
            <DropdownControls
              zoomInClick={() => changeZoomIn(true)}
              zoomOutClick={() => changeZoomOut(true)}
              rotateRightClick={() => changeRotateRight(true)}
              rotateLeftClick={() => changeRotateLeft(true)}
            />
          </div>
          <div className='relative'>
            <button
              type='button'
              className='absolute z-30 px-3 text-sm font-bold text-gray-800 uppercase bg-white cursor-pointer top-[1rem] left-[4rem]'
              onClick={handleFlipCamera}
            >
              view {isObjectFront ? 'back' : 'front'}
            </button>

            <button
              type='button'
              className='absolute z-30 inline-flex text-sm font-bold text-gray-800 uppercase bg-white cursor-pointer gap-1 top-[1rem] right-[4rem]'
            >
              <ArrowDownTrayIcon className='w-5 h-5 text-gray-800' />
              <span>save</span>
            </button>
            {isAddText ? (
              <div className='absolute w-[45%] top-[24rem] left-3 z-[100]'>
                <Text className='px-3 py-4 text-white bg-pink-500'>
                  Place the text by clicking on the model
                </Text>
              </div>
            ) : null}
          </div>
          {Page?.r3f && props.width > 768 ? (
            <LCanvas
              onClick={handleClickCanvas}
              canvasRef={canvasRef}
              width={width}
              style={{
                width: '596px',
                height: '543px',
                zIndex: isAddText ? '99' : '20',
              }}
            >
              {Page.r3f({ canvasRef, setRay, setActiveText, setEditText })}
            </LCanvas>
          ) : null}
          <div className='items-center justify-center hidden w-full my-2 ml-auto lg:flex gap-3'>
            <div className='relative inline-flex'>
              <Image
                alt='360'
                src='/icons/360.png'
                objectFit='contain'
                layout='fill'
                width={40}
                height={40}
                quality={80}
              />
            </div>
            <div className='relative inline-flex gap-2'>
              <Image
                alt='FAQ'
                src='/icons/FAQ.png'
                objectFit='contain'
                layout='fill'
                width={25}
                height={25}
                quality={80}
              />
              <Text>Do you have any questions?</Text>
            </div>
          </div>
          <div className='hidden my-2 lg:block'>
            <Text className='text-lg font-bold text-center'>
              £ {price * formData.quantity} | <span className='text-sm'>save £13.00</span>{' '}
              <span className='text-red-500'>(25% off)</span>
            </Text>
          </div>
        </div>
      </div>

      <canvas id='canvas' style={{ display: 'none' }} />
      <ModalText
        open={openTextModal}
        setOpen={setOpenTextModal}
        cancelButtonRef={cancelModalTextRef}
        text={text}
        setText={setText}
      />
    </>
  )
}

// canvas components goes here
// It will receive same props as Page component (from getStaticProps, etc.)
Page.r3f = ({ canvasRef, setRay, setActiveText, setEditText }) => (
  <>
    <Shirt
      canvasRef={canvasRef}
      setRay={setRay}
      setActiveText={setActiveText}
      setEditText={setEditText}
    />
  </>
)

export const getStaticProps: GetStaticProps = async () => {
  return {
    props: {
      title:
        'Cyclists | Jersey Customiser. Your jersey just the way you want it.',
    },
  }
}

export default Page
