
import { createTransport } from 'nodemailer'
import { ENVS } from '../../utils/Env'

export interface EmailConfig{
  to: string | string []
  subject: string
  htmlBody: string
}

export class EmailController {

  private readonly transporter = createTransport({
    service: ENVS.MAILER_SERVICE,
    auth: {
      user: ENVS.MAILER_USER,
      pass: ENVS.MAILER_PASS
    }
  });
  
  async sendEmail(emailConfig: EmailConfig): Promise<boolean> {
		const { to, subject, htmlBody } = emailConfig;

		try {
			await this.transporter.sendMail({
				from: ENVS.MAILER_USER,
				to,
				subject,
				html: htmlBody
			});

			return true;
		} catch (error) {
			console.error(error);
			return false;
		}
	}
}