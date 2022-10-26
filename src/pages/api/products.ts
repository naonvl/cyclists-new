import type { NextApiRequest, NextApiResponse } from 'next'
import { getVariants } from '@/util/shopify'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'GET') {
    return res.status(405).send('Method Not Allowed')
  }

  try {
    const result = await getVariants()

    if (!result) {
      return res.status(404).json({
        success: false,
        message: `Product not found`,
      })
    }

    return res.status(200).json({
      success: true,
      variants: result,
    })
  } catch (err) {
    return res.status(500).json({
      code: 'internal_server_error',
      message: 'Something wrong with internal server',
    })
  }
}

export default handler
