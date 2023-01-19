import FakeUsersRepository from '../domain/repositories/fakes/FakeUsersRepository';
import { FakeUserTokensRepository } from '../domain/repositories/fakes/FakeUserTokensRepository';
import UserToken from '../infra/typeorm/entities/UserToken';
import FakeHashProvider from '../providers/fakes/FakeHashProvider';
import CreateUserService from '../services/CreateUserService';
import ResetPasswordService from '../services/ResetPasswordService';
import SendForgotPasswordEmailService from '../services/SendForgotPasswordEmailService';
import { v4 as uuidv4 } from 'uuid';
import AppError from '@shared/errors/AppError';

let fakeUserTokensRepository: FakeUserTokensRepository;
let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let createUserService: CreateUserService;
let sendForgotPasswordEmailService: SendForgotPasswordEmailService;
let resetPasswordService: ResetPasswordService;

describe('ResetPassword', () => {
	beforeEach(() => {
		fakeUsersRepository = new FakeUsersRepository();
		fakeUserTokensRepository = new FakeUserTokensRepository();
		fakeHashProvider = new FakeHashProvider();
		createUserService = new CreateUserService(
			fakeUsersRepository,
			fakeHashProvider,
		);
		sendForgotPasswordEmailService = new SendForgotPasswordEmailService(
			fakeUsersRepository,
			fakeUserTokensRepository,
		);
		resetPasswordService = new ResetPasswordService(
			fakeUsersRepository,
			fakeUserTokensRepository,
			fakeHashProvider,
		);
	});
	it('should be able to reset password', async () => {
		const user = await createUserService.execute({
			name: 'John Doe',
			email: 'john@example.com',
			password: 'John123456',
		});
		const userToken = await sendForgotPasswordEmailService.execute({
			email: user.email,
		});
		const userReseted = await resetPasswordService.execute({
			token: userToken.token,
			password: 'John12345678910',
		});
		expect(userReseted.password).toBe('John12345678910');
	});
	it('should not be able to reset password with wrong token', async () => {
		const user = await createUserService.execute({
			name: 'John Doe',
			email: 'john@example.com',
			password: 'John123456',
		});
		const userToken = generateFakeUserToken(user.id);
		expect(
			resetPasswordService.execute({
				token: userToken.token,
				password: 'John12345678910',
			}),
		).rejects.toBeInstanceOf(AppError);
	});
	it('should not be able to create a session with an expired token', async () => {
		const user = await createUserService.execute({
			name: 'John Doe',
			email: 'john@doe.com',
			password: 'Abcd1234',
		});
		let userToken = await sendForgotPasswordEmailService.execute({
			email: user.email,
		});
		userToken = fakeUserTokensRepository.add5Hours(userToken);
		expect(
			resetPasswordService.execute({
				token: userToken.token,
				password: 'John12345678910',
			}),
		).rejects.toBeInstanceOf(AppError);
	});
	it('should not be able to reset the password with an invalid pass', async () => {
		const user = await createUserService.execute({
			name: 'John Doe',
			email: 'john@example.com',
			password: 'John123456',
		});
		const userToken = await sendForgotPasswordEmailService.execute({
			email: user.email,
		});

		expect(
			resetPasswordService.execute({
				token: userToken.token,
				password: '123456',
			}),
		).rejects.toBeInstanceOf(AppError);
	});
	it('should not be able to reset the password of an unregistered user', async () => {
		expect(
			sendForgotPasswordEmailService.execute({
				email: 'john@example.com',
			}),
		).rejects.toBeInstanceOf(AppError);
	});
});

function generateFakeUserToken(user_id: string): UserToken {
	const userToken = new UserToken();
	userToken.id = uuidv4();
	userToken.user_id = user_id;
	userToken.token = uuidv4();
	return userToken;
}
