import fetchShopify from '@/helpers/fetchShopify'
import { ResponseVariantsShopify, ResponseCustomerShopify } from '@/interfaces'
import { PRODUCT_ID } from '@/constants'

export const getCurrentUser = async (
  cid: string | string[]
): Promise<ResponseCustomerShopify> | null => {
  const response = await fetchShopify({
    endpoint: `/admin/api/2022-10/customers/${cid}.json`,
    method: 'GET',
  })

  if (response.errors) {
    return null
  }

  const user = {
    id: response.customer.id,
    email: response.customer.email,
    accepts_marketing: response.customer.accepts_marketing,
    created_at: response.customer.created_at,
    updated_at: response.customer.updated_at,
    first_name: response.customer.first_name,
    last_name: response.customer.last_name,
    orders_count: response.customer.orders_count,
    state: response.customer.state,
    total_spent: response.customer.total_spent,
    last_order_id: response.customer.last_order_id,
    note: response.customer.note,
    verified_email: response.customer.verified_email,
    multipass_identifier: response.customer.multipass_identifier,
    tax_exempt: response.customer.tax_exempt,
    tags: response.customer.tags,
    last_order_name: response.customer.last_order_name,
    currency: response.customer.currency,
    phone: response.customer.phone,
  }

  return user
}

export const getVariants =
  async (): Promise<ResponseVariantsShopify> | null => {
    const response = await fetchShopify({
      endpoint: `/admin/api/2022-10/products/${PRODUCT_ID}.json`,
      method: 'GET',
    })

    if (response.errors) {
      return null
    }

    const variants: ResponseVariantsShopify = response.product.variants

    return variants
  }
