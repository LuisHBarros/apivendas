import FakeUsersRepository from '../domain/repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '../providers/fakes/FakeHashProvider';
import CreateUserService from '../services/CreateUserService';
import AppError from '@shared/errors/AppError';
import UpdateProfileService from '../services/UpdateProfileService';

let fakeUsersRepository: FakeUsersRepository;
let createUser: CreateUserService;
let updateProfileService: UpdateProfileService;
let hashProvider: FakeHashProvider;

describe('UpdateProfileService', () => {
	beforeEach(() => {
		fakeUsersRepository = new FakeUsersRepository();
		hashProvider = new FakeHashProvider();
		createUser = new CreateUserService(fakeUsersRepository, hashProvider);
		updateProfileService = new UpdateProfileService(
			fakeUsersRepository,
			hashProvider,
		);
	});
	it('should update the profile', async () => {
		const user = await createUser.execute({
			name: 'John Doe',
			email: 'john@doe.com',
			password: 'Abcd123456',
		});
		const updatedProfile = await updateProfileService.execute({
			user_id: user.id,
			name: 'John Do2',
			email: 'john2@doe.com',
			password: 'Abcd123456',
		});
		expect(updatedProfile.name).toBe('John Do2');
	});
	it('should not update the profile if the user_id isn`t registered', async () => {
		expect(
			updateProfileService.execute({
				user_id: 'not_an_id',
				name: 'John Doe',
				email: 'john@doe.com',
				password: 'Abcd123456',
			}),
		).rejects.toBeInstanceOf(AppError);
	});
	it('should not update if the email is already registered in another profile', async () => {
		await createUser.execute({
			name: 'John Doe',
			email: 'john@doe2.com',
			password: 'Abcd123456',
		});
		const user = await createUser.execute({
			name: 'John Doe',
			email: 'john@doe.com',
			password: 'Abcd123456',
		});
		expect(
			updateProfileService.execute({
				user_id: user.id,
				name: 'John Doe',
				email: 'john@doe2.com',
			}),
		).rejects.toBeInstanceOf(AppError);
	});
	it('should not update the profile if the password is invalid', async () => {
		const user = await createUser.execute({
			name: 'John Doe',
			email: 'john@doe.com',
			password: 'Abcd123456',
		});
		expect(
			updateProfileService.execute({
				user_id: user.id,
				name: 'John Doe',
				email: 'john@doe.com',
				password: 'invalid',
				old_password: 'Abcd1234561',
			}),
		).rejects.toBeInstanceOf(AppError);
	});
	it('should not update the password if its not in regex', async () => {
		const user = await createUser.execute({
			name: 'John Doe',
			email: 'john@doe.com',
			password: 'Abcd123456',
		});
		expect(
			updateProfileService.execute({
				user_id: user.id,
				name: 'John Doe',
				email: 'john@doe.com',
				password: 'invalid',
				old_password: 'Abcd123456',
			}),
		).rejects.toBeInstanceOf(AppError);
	});
	it('should update the password', async () => {
		const user = await createUser.execute({
			name: 'John Doe',
			email: 'john@doe.com',
			password: 'John123456',
		});
		const updated_user = await updateProfileService.execute({
			user_id: user.id,
			name: 'John Doe',
			email: 'john@doe.com',
			password: 'Abcd1234567890',
			old_password: 'John123456',
		});
		expect(updated_user.password).toEqual('Abcd1234567890');
	});
});
