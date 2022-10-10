import nodemailer from 'nodemailer'

/**
 *
 * @param {Object} config
 */
const sendEmail = async (provider, config) => {
  if (typeof config !== 'object') {
    return new Error('config must be object!')
  }

  try {
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: 'cyclists.developer@gmail.com',
        pass: 'ywtvrzfrlcpdcmjx',
      },
    })

    const info = await transporter.sendMail(config)

    return info
  } catch (err) {
    console.log(err)
    throw err
  }
}

export default sendEmail
