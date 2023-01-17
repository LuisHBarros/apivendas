import AppError from "@shared/errors/AppError";
import path from "path";
import EtherialMail from "@config/mail/EtherialMail";
import { inject, injectable } from "tsyringe";
import { IUsersRepository } from "../domain/repositories/IUsersRepository";
import { IUserTokensRepository } from "../domain/repositories/IUserTokenRepository";
import { ISendForgotPasswordEmail } from "../domain/models/ISendForgotPasswordEmail";


@injectable()
class SendForgotPasswordEmailService {
	  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('UserTokensRepository')
    private userTokensRepository: IUserTokensRepository,
  ) {}
	public async execute({ email }: ISendForgotPasswordEmail ):Promise<void> {

		const user = await this.usersRepository.findByEmail(email);

		if (!user) {
			throw new AppError('User does not exists');
		}

		const token = await this.userTokensRepository.generate(user.id);

		const forgotPasswordTemplate = path.resolve(__dirname, '../views/forgot_password.hbs');

		await EtherialMail.sendEmail({
			to: {
				name: user.name,
        email: email,
			},
			subject: 'Recuperação de senha',
			template_data: {
				file: forgotPasswordTemplate,
				variables: {name: user.name, link: `${process.env.WEB_URL}/reset_password?token=${token}`},
			},
			from: {
				name: 'Equipe API Vendas',
				email: 'equipe@apivendas.com.br',
			}
});

	}
}

export default SendForgotPasswordEmailService
