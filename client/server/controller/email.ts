
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
		const lessActivityApi = "http://192.168.100.30:5275/api/Users/lessActivity"
		const moreActivityApi = "http://192.168.100.30:5275/api/Users/moreActivity"
		let emails = []

switch (framework) {
			case "todos":
				emails = await fetch(api).then((res) => res.json());
				console.log(`enviando correo a ${emails}`);
				break;
			case "lessActivity":
				emails = await fetch(lessActivityApi).then((res) => res.json());
				console.log(`enviando correo a ${emails}`);
				
				break;
				case "MoreActivity":
					emails = await fetch(moreActivityApi).then((res) => res.json());
					console.log(`enviando correo a ${emails}`);
				break;
			default:
				emails = [];
}

		return emails;
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
			htmlBody: `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333;">
    <div style="background-color: #f4f4f4; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
      <img src="https://example.com/path/to/logo.png" alt="Heaven Logo" style="max-width: 120px; margin-bottom: 10px;">
      <h1 style="color: #333; font-size: 24px; margin: 0;">Heaven</h1>
    </div>
    <div style="padding: 20px; background-color: #fff; border: 1px solid #ddd; border-top: none;">
      <p style="font-size: 16px; line-height: 1.5;">
        ${message}
      </p>
    </div>
    <div style="background-color: #f4f4f4; padding: 10px; text-align: center; border-radius: 0 0 8px 8px;">
      <p style="font-size: 12px; color: #777;">
        © 2024 Heaven. All rights reserved.
      </p>
    </div>
  </div>
`

		};

		return await this.sendEmail(emailConfig);
	}

}