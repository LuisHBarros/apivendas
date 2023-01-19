import { inject, injectable } from 'tsyringe';
import AppError from '@shared/errors/AppError';
import authConfig from '@config/auth';
import { sign } from 'jsonwebtoken';
import { IUserAuthenticated } from '../domain/models/IUserAuthenticated';
import { IUsersRepository } from '../domain/repositories/IUsersRepository';
import { ICreateSession } from '../domain/models/ICreateSession';
import { IHashProvider } from '../providers/models/IHashProvider';

@injectable()
class CreateSessionsService {
	constructor(
		@inject('UsersRepository')
		private usersRepository: IUsersRepository,
		@inject('HashProvider')
		private hashProvider: IHashProvider,
	) {}
	public async execute({
		email,
		password,
	}: ICreateSession): Promise<IUserAuthenticated> {
		const user = await this.usersRepository.findByEmail(email);

		if (!user) {
			throw new AppError('Incorrect email!', 401);
		}

		const passwordConfirmed = await this.hashProvider.compareHash(
			password,
			user.password,
		);

		if (!passwordConfirmed) {
			throw new AppError('Incorrect password!', 401);
		}
		const token = sign({}, authConfig.jwt.secret, {
			subject: user.id,
			expiresIn: authConfig.jwt.expiresIn,
		});

		return {
			user,
			token,
		};
	}
}

export default CreateSessionsService;
