import AppError from '@shared/errors/AppError';
import { inject, injectable } from 'tsyringe';
import { IUpdateProfile } from '../domain/models/IUpdateProfile';
import { IUser } from '../domain/models/IUser';
import { IUsersRepository } from '../domain/repositories/IUsersRepository';
import { IHashProvider } from '../providers/models/IHashProvider';

@injectable()
class UpdateProfileService {
	private regex = /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})/;
	constructor(
		@inject('UsersRepository')
		private usersRepository: IUsersRepository,
		@inject('HashProvider')
		private hashProvider: IHashProvider,
	) {}
	public async execute({
		user_id,
		name,
		email,
		password,
		old_password,
	}: IUpdateProfile): Promise<IUser> {
		const user = await this.usersRepository.findById(user_id);

		if (!user) {
			throw new AppError('User not found', 404);
		}

		const userUpdateEmail = await this.usersRepository.findByEmail(email);

		if (userUpdateEmail && email !== user.email) {
			throw new AppError('Email already registered', 400);
		}
		if (password && old_password) {
			if (!(await this.hashProvider.compareHash(old_password, user.password))) {
				throw new AppError('Old password is not correct', 400);
			}
			if (!this.regex.test(password))
				throw new AppError('Invalid password', 400);
			user.password = await this.hashProvider.generateHash(password);
		}

		user.name = name;
		user.email = email;
		await this.usersRepository.save(user);

		return user;
	}
}

export default UpdateProfileService;
