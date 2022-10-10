import type { NextApiRequest, NextApiResponse } from 'next'
import sendEMail from '@/config/email-sender'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    return res.status(405).send('Method Not Allowed')
  }

  try {
    const receipent =
      process.env.NODE_ENV === 'development'
        ? 'delvieronigel@gmail.com'
        : 'ndl0901@gmail.com'

    const maillits = [
      'delvieronigel@gmail.com',
      'ndl0901@gmail.com',
      'marcus@cyclists.com',
      'marcus@ibooking.com',
    ]
    await sendEMail('CANADA', {
      from: 'cyclists.developer@gmail.com',
      // to: receipent,
      to: maillits,
      subject: `Custom Jersey ID: ${req.body.userId}`,
      html: `<p>UserID: ${
        req.body.userId
      }</p><br><p>Created at: ${new Date().toString()}</p>`,
      attachments: {
        // encoded string as an attachment
        filename: `${req.body.userId}.svg`,
        content: req.body.attachment,
        encoding: 'base64',
      },
    })

    // const reqCreateOrder = await fetch(
    //   'https://cyclists-com.myshopify.com/admin/api/2022-10/products/42778299957447/images.json',
    //   {
    //     method: 'POST',
    //     headers: {
    //       'Content-Type': 'application/json',
    //       'X-Shopify-Access-Token': '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',
    //     },
    //     body: JSON.stringify(req.body),
    //   }
    // )

    // const reqCreateOrder = await fetch(
    //   'https://cyclists-com.myshopify.com/admin/api/2022-10/checkouts.json',
    //   {
    //     method: 'POST',
    //     headers: {
    //       'Content-Type': 'application/json',
    //       'X-Shopify-Access-Token': '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',
    //     },
    //     body: JSON.stringify(req.body),
    //   }
    // )
    // const data = await reqCreateOrder.json()

    return res.status(200).json({ success: true })
  } catch (err) {
    return res.status(500).json(err)
  }
}

export default handler
