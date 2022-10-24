import cn from 'clsx'
import { ChangeEvent, useEffect, useRef, useState } from 'react'
import InputNumber from '@/components/dom/InputNumber'
import canvasToSVG from '@/helpers/canvasToSVG'
import generateTag from '@/helpers/generateTag'
import { setState, getState } from '@/helpers/store'

interface FormOrderProps {
  componentLoading?: boolean
}

type FormDataType = {
  userId: string
  quantity: number
  name: string
  variantID: number
}

const FormOrder: React.FC<FormOrderProps> = ({ componentLoading }) => {
  const [formData, setFormData] = useState<FormDataType>({
    userId: '2321321321321',
    quantity: 1,
    name: 'Delviero Nigel',
    variantID: 42808925978823,
  })
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    const encodedData = canvasToSVG(getState().canvas)

    const requestCreateOrder = await fetch('/api/createorder', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...formData,
        tag: generateTag,
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
    if (e.target.name === 'quantity') {
      setState({ quantity: Number(e.target.value) })
    }
    setFormData({ ...formData, [e.target.name]: e.target.value })
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

  return (
    <form
      action='https://cyclists.com/cart/add'
      method='POST'
      target='_blank'
      onSubmit={handleSubmit}
    >
      <div className='flex flex-col w-full mb-2 mt-7 md:flex-row md:gap-4'>
        <InputNumber
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
          className='relative flex items-stretch h-auto text-black bg-white border py-[0.65rem] border-1 rounded-[0.25rem] md:items-center md:my-auto border-[#666]'
        >
          <option value={42808925978823}>S</option>
          <option value={42808926011591}>M</option>
          <option value={42808926044359}>L</option>
          <option value={42808926077127}>XL</option>
          <option value={42808926109895}>2XL</option>
          <option value={42808926142663}>3XL</option>
        </select>
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
