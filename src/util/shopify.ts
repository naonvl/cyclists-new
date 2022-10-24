import fetchShopify from '@/helpers/fetchShopify'
import { ResponseVariantsShopify, ResponseCustomerShopify } from '@/interfaces'

export const getCurrentUser = async (
  cid: string
): Promise<ResponseCustomerShopify> | null => {
  const response = await fetchShopify({
    endpoint: `/admin/api/2022-10/customers/${cid}.json`,
    method: 'GET',
  })

  if (response.errors) {
    return null
  }

  const user = response.customer

  return user
}

export const getVariants =
  async (): Promise<ResponseVariantsShopify> | null => {
    if (!process.env.PRODUCT_ID) {
      throw Error('Undefined PRODUCT_ID .env')
    }

    const response = await fetchShopify({
      endpoint: `/admin/api/2022-10/products/${process.env.PRODUCT_ID}.json`,
      method: 'GET',
    })

    if (response.errors) {
      return null
    }

    const variants: ResponseVariantsShopify = response.product.variants

    return variants
  }
