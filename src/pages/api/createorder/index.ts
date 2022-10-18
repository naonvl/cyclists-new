import type { NextApiRequest, NextApiResponse } from 'next'
import sendEMail from '@/config/email-sender'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    return res.status(405).send('Method Not Allowed')
  }

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
    const subject =
      process.env.NODE_ENV == 'development'
        ? `[DEVELOPMENT] Custom Jersey ID: ${req.body.userId}`
        : `Custom Jersey ID: ${req.body.userId}`
    await sendEMail({
      from: 'cyclists.developer@gmail.com',
      // to: receipent,
      to: maillits,
      subject: subject,
      html: `<p><b>UserID</b>: ${req.body.userId}</p>
      <p><b>Variant ID</b>: ${req.body.id}</p>
      <p><b>Quantity</b>: ${req.body.quantity}</p>
      <p>Created at: ${new Date().toString()}</p>`,
      attachments: {
        // encoded string as an attachment
        filename: `${req.body.userId}.svg`,
        content: req.body.attachment,
        encoding: 'base64',
      },
    })

    return res.status(200).json({ success: true })
  } catch (err) {
    return res.status(500).json(err)
  }
}

export default handler
