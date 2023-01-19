import AppError from '@shared/errors/AppError';
import { inject, injectable } from 'tsyringe';
import { ICreateUser } from '../domain/models/ICreateUser';
import { IUser } from '../domain/models/IUser';
import { IUsersRepository } from '../domain/repositories/IUsersRepository';
import { IHashProvider } from '../providers/models/IHashProvider';

@injectable()
class CreateUserService {
	private regex = /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})/;
	constructor(
		@inject('UsersRepository')
		private usersRepository: IUsersRepository,
		@inject('HashProvider')
		private hashProvider: IHashProvider,
	) {}
	public async execute({ name, email, password }: ICreateUser): Promise<IUser> {
		const userExists = await this.usersRepository.findByEmail(email);

		if (userExists) {
			throw new AppError('There is already one account with this email');
		}
		if (!this.regex.test(password)) {
			throw new AppError(
				'a password needs at least 8 characters, between letters(uppercases and lowercases) and numbers',
			);
		}

		const hashPassword = await this.hashProvider.generateHash(password);

		return this.usersRepository.create({
			name,
			email,
			password: hashPassword,
		});
	}
}

export default CreateUserService;
