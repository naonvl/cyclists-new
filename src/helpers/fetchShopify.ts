interface IFetchShopify {
  endpoint: string
  method: 'GET' | 'POST'
}

const fetchShopify = async ({ endpoint, method }: IFetchShopify) => {
  if (!process.env.SHOPIFY_API_URL || !process.env.SHOPIFY_ACCESSS_TOKEN) {
    throw Error('Undefined Shopify API URL')
  }

  const req = await fetch(`${process.env.SHOPIFY_API_URL}${endpoint}`, {
    method: method,
    headers: {
      'X-Shopify-Access-Token': `${process.env.SHOPIFY_ACCESSS_TOKEN}`,
    },
  })

  return req.json()
}

export default fetchShopify
