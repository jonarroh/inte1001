
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

	public async getEmailsByFramework(framework: string): Promise<string[]> {
		const api = "http://192.168.100.30:5275/api/Users/getEmails"

		const resp = await fetch(api);


		return await resp.json();
	}

	async sendEmailTo({
		message,
		framework,
	}: {
		message: string;
		framework: string;
	}): Promise<boolean> {
		const emails = await this.getEmailsByFramework(framework);

		if (!emails.length) {
			return false;
		}

		const emailConfig = {
			to: emails,
			subject: "Mensaje de la aplicación",
			htmlBody: `<p>${message}</p>`,
		};

		return await this.sendEmail(emailConfig);
	}

}