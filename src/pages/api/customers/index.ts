import type { NextApiRequest, NextApiResponse } from 'next'
import { getCurrentUser } from '@/util/shopify'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'GET') {
    return res.status(405).send('Method Not Allowed')
  }

  const { cid } = req.body
  try {
    const result = await getCurrentUser(cid)

    if (!result) {
      return res.status(404).json({
        success: false,
        message: `Customer: ${cid} doesn't exists`,
      })
    }

    return res.status(200).json({
      success: true,
      user: result,
    })
  } catch (err) {
    return res.status(500).json(err)
  }
}

export default handler
