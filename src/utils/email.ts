import nodemailer from 'nodemailer'
import handlebars from 'handlebars'
import fs from 'fs'
import path from 'path'
import { Constant, logger } from '@constants'

export const sendEmail = async (
  email: string,
  subject: string,
  payload: object,
  template: string
) => {
  try {
    // create reusable transporter object using the default SMTP transport
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: Constant.EMAIL_FROM,
        pass: Constant.EMAIL_PASSWORD
      }
    })

    logger.info(path.join(__dirname, template))

    const source = fs.readFileSync(path.join(__dirname, template), 'utf8')
    const compiledTemplate = handlebars.compile(source)
    const html = compiledTemplate(payload)

    const options = () => {
      return {
        from: Constant.EMAIL_FROM,
        to: email,
        subject,
        html
      }
    }

    // Send email
    const info = await transporter.sendMail(options())
    logger.info(`Email sent successfully with id ${info.messageId}`)
    return info
  } catch (error) {
    logger.error(error)
    return error
  }
}
