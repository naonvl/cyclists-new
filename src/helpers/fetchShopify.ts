import { SHOPIFY_ACCESS_TOKEN, SHOPIFY_API_URL } from '@/constants'
interface IFetchShopify {
  endpoint: string
  method: 'GET' | 'POST'
}

const fetchShopify = async ({ endpoint, method }: IFetchShopify) => {
  const req = await fetch(`${SHOPIFY_API_URL}${endpoint}`, {
    method: method,
    headers: {
      'X-Shopify-Access-Token': `${SHOPIFY_ACCESS_TOKEN}`,
    },
  })

  return req.json()
}

export default fetchShopify
