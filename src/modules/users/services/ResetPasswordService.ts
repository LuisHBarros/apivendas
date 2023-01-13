import AppError from "@shared/errors/AppError";
import { getCustomRepository } from "typeorm"
import { hash } from 'bcryptjs'
import { isAfter, addHours } from 'date-fns'
import UsersRepository from "../typeorm/repositories/UsersRepository";
import UserTokensRepository from "../typeorm/repositories/UserTokensRepository";
import UserToken from "../typeorm/entities/UserToken";

interface IRequest{
	token: string,
	password: string
}


class ResetPasswordService {
	private regex = /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})/;
	public async execute({ token, password }: IRequest): Promise<void> {
		const usersRepository = getCustomRepository(UsersRepository);
		const userTokensRepository = getCustomRepository(UserTokensRepository);

		const userToken = await userTokensRepository.findByToken(token);

		if (!userToken) {
			throw new AppError('User-Token does not exists');
		}
		const user = await usersRepository.findById(userToken.user_id);

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

		await usersRepository.save(user)

		await userTokensRepository.delete(userToken.id);
	}
}

export default ResetPasswordService