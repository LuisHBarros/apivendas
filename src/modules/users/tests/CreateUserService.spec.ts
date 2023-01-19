import AppError from '@shared/errors/AppError';
import 'reflect-metadata';
import FakeUsersRepository from '../domain/repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '../providers/fakes/FakeHashProvider';
import CreateUserService from '../services/CreateUserService';

let fakeUsersRepository: FakeUsersRepository;
let createUser: CreateUserService;
let hashProvider: FakeHashProvider;

describe('CreateUser', () => {
	beforeEach(() => {
		fakeUsersRepository = new FakeUsersRepository();
		hashProvider = new FakeHashProvider();
		createUser = new CreateUserService(fakeUsersRepository, hashProvider);
	});
	it('should be able to create a new user', async () => {
		const user = await createUser.execute({
			name: 'John Doe',
			email: 'john@doe.com',
			password: 'Abcd12345',
		});
		expect(user).toHaveProperty('id');
	});
	it('should not be able to create a new user with a email in use', async () => {
		await createUser.execute({
			name: 'John Doe',
			email: 'john@doe.com',
			password: 'Abcd12345',
		});
		expect(
			createUser.execute({
				name: 'John Doe',
				email: 'john@doe.com',
				password: 'Abcd12345',
			}),
		).rejects.toBeInstanceOf(AppError);
	});
	it('should not be able to create a new user with an invalid password', async () => {
		expect(
			createUser.execute({
				name: 'John Doe',
				email: 'john@doe.com',
				password: '123456',
			}),
		).rejects.toBeInstanceOf(AppError);
	});
});
