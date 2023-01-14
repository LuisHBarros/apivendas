import nodemailer from 'nodemailer';
import {HandlebarsMailTemplate} from './HandlebarsMailTemplate'
import { ISendMail } from './Interfaces';


export default class EtherialMail{
	static async sendEmail({ to, subject, template_data, from }: ISendMail): Promise<void> {
		const account = await nodemailer.createTestAccount();
		const mailTemplate = new HandlebarsMailTemplate();
			const transporter = nodemailer.createTransport({
				host: account.smtp.host,
				port: account.smtp.port,
				secure: account.smtp.secure,
				auth: {
					user: account.user,
					pass: account.pass,
				}
			});
			const message = await transporter.sendMail({
				from: {
					name: from?.name || "Equipe API Vendas",
					address: from?.email || "no-reply@equipe.io",
				},
				to: {
					name: to.name,
          address: to.email,
				},
				subject,
				html: await mailTemplate.parse(template_data)
			});

			console.log('Message sent: ' + message.messageId);
			console.log('Preview URL: ' + nodemailer.getTestMessageUrl(message));
	}
}


