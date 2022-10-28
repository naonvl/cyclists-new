import cn from 'clsx'
import { ChangeEvent, useEffect, useRef, useState } from 'react'
import InputNumber from '@/components/dom/InputNumber'
import canvasToSVG from '@/helpers/canvasToSVG'
import generateTag from '@/helpers/generateTag'
import useStore, { setState } from '@/helpers/store'
import { ICanvas } from '@/interfaces'

interface FormOrderProps extends ICanvas {
  componentLoading?: boolean
  cid: number | string
}

type FormDataType = {
  quantity: number
  size: string
  variantID: number
}

const FormOrder: React.FC<FormOrderProps> = ({
  componentLoading,
  canvasRef,
  cid,
}) => {
  const [variants] = useStore((state) => [state.variants])
  const tagRef = useRef<string>(generateTag())

  const [formData, setFormData] = useState<FormDataType>({
    quantity: 1,
    size: 'S',
    variantID: 42808925978823,
  })
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    setIsLoading(true)
    const encodedData = canvasToSVG(canvasRef.current)

    const requestCreateOrder = await fetch('/api/createorder', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...formData,
        userId: cid,
        attachment: encodedData,
      }),
    })
    const responseOrder = await requestCreateOrder.json()

    if (responseOrder && responseOrder.success) {
      return setIsLoading(false)
    }

    return setIsLoading(false)
  }

  const handleChangeForm = (
    e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLSelectElement>
  ) => {
    if (e.target.name === 'id') {
      setFormData({
        ...formData,
        size: variants[
          variants.map((e: any) => e.id).indexOf(Number(e.target.value))
        ].option2,
      })
      setState({
        price: Number(
          variants[variants.map((e) => e.id).indexOf(Number(e.target.value))]
            .price
        ),
      })
    }

    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const decrementAction = () => {
    if (formData.quantity == 1) {
      return setFormData({ ...formData, quantity: 1 })
    }

    setState({
      quantity: formData.quantity - 1,
    })
    return setFormData({ ...formData, quantity: formData.quantity - 1 })
  }

  const incrementAction = () => {
    setState({
      quantity: formData.quantity + 1,
    })
    return setFormData({ ...formData, quantity: formData.quantity + 1 })
  }

  return componentLoading ? (
    <div>
      <div className='flex flex-col w-full mb-2 mt-7 md:flex-row md:gap-4'>
        <div className='bg-gray-300 animate-pulse w-[120px] h-[45px]' />
        <div className='bg-gray-300 animate-pulse w-[120px] h-[45px]' />
        <div className='bg-gray-300 animate-pulse w-[366px] h-[45px]' />
      </div>
    </div>
  ) : (
    <form
      action='https://cyclists.com/cart/add'
      method='POST'
      target='_blank'
      onSubmit={handleSubmit}
    >
      <div className='flex flex-col w-full mb-2 mt-7 md:flex-row md:gap-4'>
        <div className='flex w-full gap-2'>
          <InputNumber
            rootClass='w-full lg:w-auto'
            id='totalOrder'
            name='quantity'
            type='number'
            onChange={handleChangeForm}
            value={formData.quantity}
            min={1}
            decrementAction={decrementAction}
            incrementAction={incrementAction}
            count={formData.quantity}
          />
          <select
            defaultValue={42808925978823}
            onChange={handleChangeForm}
            name='id'
            className='relative flex items-stretch w-full h-auto text-black bg-white border lg:w-auto py-[0.65rem] border-1 rounded-[0.10rem] md:items-center md:my-auto border-[#666]'
          >
            {variants.map((variant, index) => (
              <option value={variant.id} key={index}>
                {variant.option2}
              </option>
            ))}
          </select>
        </div>
        <button
          type='submit'
          className={cn(
            'w-full px-4 text-center py-3 text-sm uppercase',
            {
              ['cursor-not-allowed bg-white text-black border border-black']:
                isLoading,
            },
            {
              ['bg-pink-600 border border-pink-600 text-white my-2 hover:border hover:border-black hover:bg-white hover:text-black']:
                !isLoading,
            }
          )}
          disabled={isLoading}
        >
          {isLoading ? 'Loading...' : 'add to cart'}
        </button>
      </div>
    </form>
  )
}

export default FormOrder
