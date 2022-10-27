import type { NextApiRequest, NextApiResponse } from 'next'
import sendEMail from '@/config/email-sender'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    return res.status(405).send('Method Not Allowed')
  }

  const { userId, quantity, size, variantID, attachment } = req.body
  const date = new Date()

  try {
    const maillits =
      process.env.NODE_ENV == 'development'
        ? 'delvieronigel@gmail.com'
        : [
            'delvieronigel@gmail.com',
            'ndl0901@gmail.com',
            'marcus@cyclists.com',
            'marcus@ibooking.com',
          ]
    await sendEMail({
      from: 'cyclists.developer@gmail.com',
      // to: receipent,
      to: maillits,
      subject: `Custom Jersey (${userId})`,
      html: `<p><b>UserID</b>: ${userId}</p>
      <p><b>Variant ID</b>: ${variantID}</p>
      <p><b>Size</b>: ${size}</p>
      <p><b>Quantity</b>: ${quantity}</p>
      <p>Created at: ${date.toString()}</p>`,
      attachments: {
        // encoded string as an attachment
        filename: `${userId}_${date.getFullYear()}${date.getMonth()}${date.getDate()}.svg`,
        content: attachment,
        encoding: 'base64',
      },
    })

    return res.status(200).json({ success: true })
  } catch (err) {
    return res.status(500).json(err)
  }
}

export default handler
