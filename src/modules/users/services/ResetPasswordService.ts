import AppError from "@shared/errors/AppError";
import { hash } from 'bcryptjs'
import { isAfter, addHours } from 'date-fns'
import { inject, injectable } from "tsyringe";
import { IUsersRepository } from "../domain/repositories/IUsersRepository";
import { IUserTokensRepository } from "../domain/repositories/IUserTokenRepository";
import { IResetPassword } from "../domain/models/IResetPassword";


@injectable()
class ResetPasswordService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('UserTokensRepository')
    private userTokensRepository: IUserTokensRepository,
  ) {}
	private regex = /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})/;
	public async execute({ token, password }: IResetPassword): Promise<void> {
		const userToken = await this.userTokensRepository.findByToken(token);

		if (!userToken) {
			throw new AppError('User-Token does not exists');
		}
		const user = await this.usersRepository.findById(userToken.user_id);

		if (!user) {
			throw new AppError('User does not exists')
		}

		const tokenCreatedAt = userToken.created_at;
		const compareDate = addHours(tokenCreatedAt, 2)

		if (isAfter(Date.now(), compareDate)) {
			throw new AppError('Token expired.');
		}

		if(!this.regex.test(password)){
            throw new AppError("a password needs at least 8 characters, between letters(uppercases and lowercases) and numbers");
		}

		user.password = await hash(password, 8)

		await this.usersRepository.save(user)

		await this.userTokensRepository.delete(userToken);
	}
}

export default ResetPasswordService
