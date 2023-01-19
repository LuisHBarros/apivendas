import FakeUsersRepository from '../domain/repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '../providers/fakes/FakeHashProvider';
import CreateUserService from '../services/CreateUserService';
import CreateSessionService from '../services/CreateSessionService';
import AppError from '@shared/errors/AppError';

let fakeUsersRepository: FakeUsersRepository;
let createUser: CreateUserService;
let createSessionService: CreateSessionService;
let hashProvider: FakeHashProvider;

describe('CreateSession', () => {
	beforeEach(() => {
		fakeUsersRepository = new FakeUsersRepository();
		hashProvider = new FakeHashProvider();
		createUser = new CreateUserService(fakeUsersRepository, hashProvider);
		createSessionService = new CreateSessionService(
			fakeUsersRepository,
			hashProvider,
		);
	});

	it('should create a session with a registered user', async () => {
		await createUser.execute({
			name: 'John Doe',
			email: 'john@doe.com',
			password: 'Abcd1234',
		});
		const user = await createSessionService.execute({
			email: 'john@doe.com',
			password: 'Abcd1234',
		});
		expect(user).toHaveProperty('token');
	});
	it('should not create a session with a invalid email', async () => {
		expect(
			createSessionService.execute({
				email: 'johndoe@invalid.com',
				password: 'Abcd1234',
			}),
		).rejects.toBeInstanceOf(AppError);
	});
	it('should not create a session with a invalid password', async () => {
		await createUser.execute({
			name: 'John Doe',
			email: 'john@doe.com',
			password: 'Abcd1234',
		});
		expect(
			createSessionService.execute({
				email: 'john@doe.com',
				password: 'invalid',
			}),
		).rejects.toBeInstanceOf(AppError);
	});
});
