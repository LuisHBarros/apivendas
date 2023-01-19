import AppError from '@shared/errors/AppError';
import path from 'path';
import { IMail } from '@config/mail/Interfaces';
import { inject, injectable } from 'tsyringe';
import { IUsersRepository } from '../domain/repositories/IUsersRepository';
import { IUserTokensRepository } from '../domain/repositories/IUserTokenRepository';
import { ISendForgotPasswordEmail } from '../domain/models/ISendForgotPasswordEmail';
import { IUserToken } from '../domain/models/IUserToken';

@injectable()
class SendForgotPasswordEmailService {
	constructor(
		@inject('UsersRepository')
		private usersRepository: IUsersRepository,

		@inject('UserTokensRepository')
		private userTokensRepository: IUserTokensRepository,

		@inject('MailService')
		private userMail: IMail,
	) {}
	public async execute({
		email,
	}: ISendForgotPasswordEmail): Promise<IUserToken> {
		const user = await this.usersRepository.findByEmail(email);

		if (!user) {
			throw new AppError('User does not exists');
		}

		const token = await this.userTokensRepository.generate(user.id);

		const forgotPasswordTemplate = path.resolve(
			__dirname,
			'../views/forgot_password.hbs',
		);

		await this.userMail.sendEmail({
			to: {
				name: user.name,
				email: email,
			},
			subject: 'Recuperação de senha',
			template_data: {
				file: forgotPasswordTemplate,
				variables: {
					name: user.name,
					link: `${process.env.WEB_URL}/reset_password?token=${token}`,
				},
			},
			from: {
				name: 'Equipe API Vendas',
				email: 'equipe@apivendas.com.br',
			},
		});
		return token;
	}
}

export default SendForgotPasswordEmailService;
