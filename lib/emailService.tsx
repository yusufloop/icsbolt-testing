interface EmailConfig {
  smtp_host: string
  smtp_port: number
  smtp_user: string
  smtp_pass: string
  from_email: string
}

export class EmailService {
  private config: EmailConfig

  constructor() {
    this.config = {
      smtp_host: process.env.SMTP_HOST!,
      smtp_port: parseInt(process.env.SMTP_PORT!),
      smtp_user: process.env.SMTP_USER!,
      smtp_pass: process.env.SMTP_PASS!,
      from_email: process.env.FROM_EMAIL!,
    }
  }

  async sendVerificationEmail(email: string, code: string, name?: string) {
    const subject = 'Verify Your Email Address'
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Email Verification</h2>
        <p>Hello ${name || 'there'},</p>
        <p>Please use the following code to verify your email address:</p>
        <div style="background: #f5f5f5; padding: 20px; text-align: center; font-size: 24px; font-weight: bold; margin: 20px 0;">
          ${code}
        </div>
        <p>This code will expire in 15 minutes.</p>
        <p>If you didn't request this verification, please ignore this email.</p>
      </div>
    `

    return await this.sendEmail(email, subject, html)
  }

  async sendPasswordResetEmail(email: string, code: string, name?: string) {
    const subject = 'Reset Your Password'
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Password Reset</h2>
        <p>Hello ${name || 'there'},</p>
        <p>Please use the following code to reset your password:</p>
        <div style="background: #f5f5f5; padding: 20px; text-align: center; font-size: 24px; font-weight: bold; margin: 20px 0;">
          ${code}
        </div>
        <p>This code will expire in 1 hour.</p>
        <p>If you didn't request this reset, please ignore this email.</p>
      </div>
    `

    return await this.sendEmail(email, subject, html)
  }

  private async sendEmail(to: string, subject: string, html: string) {
    try {
      // Call your backend API endpoint that handles SMTP
      const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/send-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.EXPO_PUBLIC_API_KEY}`,
        },
        body: JSON.stringify({
          to,
          subject,
          html,
          from: this.config.from_email,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to send email')
      }

      return { success: true }
    } catch (error) {
      console.error('Email sending failed:', error)
      return { success: false, error: error.message }
    }
  }
}

export const emailService = new EmailService()