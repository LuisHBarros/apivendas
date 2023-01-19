import FakeUsersRepository from '../domain/repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '../providers/fakes/FakeHashProvider';
import CreateUserService from '../services/CreateUserService';
import User from '../infra/typeorm/entities/User';
import ShowProfileService from '../services/ShowProfileService';
import AppError from '@shared/errors/AppError';

let fakeUsersRepository: FakeUsersRepository;
let createUser: CreateUserService;
let showProfileService: ShowProfileService;
let hashProvider: FakeHashProvider;

describe('ShowProfile', () => {
	beforeEach(() => {
		fakeUsersRepository = new FakeUsersRepository();
		hashProvider = new FakeHashProvider();
		createUser = new CreateUserService(fakeUsersRepository, hashProvider);
		showProfileService = new ShowProfileService(fakeUsersRepository);
	});
	it('should show a registered profile', async () => {
		const user = await createUser.execute({
			name: 'John Doe',
			email: 'john.doe@example.com',
			password: 'Abcd123456',
		});
		const user_id = user.id;
		const profile = await showProfileService.execute({ user_id });
		expect(profile).toBeInstanceOf(User);
	});
	it('should not show a unregistered profile', async () => {
		const user_id = 'not_an_id';
		expect(showProfileService.execute({ user_id })).rejects.toBeInstanceOf(
			AppError,
		);
	});
});
