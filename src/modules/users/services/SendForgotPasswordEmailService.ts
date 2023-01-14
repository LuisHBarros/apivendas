import AppError from "@shared/errors/AppError";
import { getCustomRepository } from "typeorm"
import path from "path";
import UsersRepository from "../typeorm/repositories/UsersRepository";
import UserTokensRepository from "../typeorm/repositories/UserTokensRepository";
import EtherialMail from "@config/mail/EtherialMail";

interface IRequest{
	email: string,
}

interface ISendMail{
	to: string;
  from: string;
	subject: string;
	body: string;
}


class SendForgotPasswordEmailService {
	public async execute({ email }: IRequest ):Promise<void> {
		const usersRepository = getCustomRepository(UsersRepository);
		const userTokensRepository = getCustomRepository(UserTokensRepository);

		const user = await usersRepository.findByEmail(email);

		if (!user) {
			throw new AppError('User does not exists');
		}

		const token = await userTokensRepository.generate(user.id);

		const forgotPasswordTemplate = path.resolve(__dirname, '../views/forgot_password.hbs');

		await EtherialMail.sendEmail({
			to: {
				name: user.name,
        email: email,
			},
			subject: 'Recuperação de senha',
			template_data: {
				file: forgotPasswordTemplate,
				variables: {name: user.name, link: `http://localhost:3000/reset_password?token=${token}`},
			},
			from: {
				name: 'Equipe API Vendas',
				email: 'equipe@apivendas.com.br',
			}
});

	}
}

export default SendForgotPasswordEmailService
