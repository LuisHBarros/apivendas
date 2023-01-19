import FakeUsersRepository from '../domain/repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '../providers/fakes/FakeHashProvider';
import CreateUserService from '../services/CreateUserService';
import UpdateUserAvatarService from '../services/UpdateUserAvatarService';
import fs from 'mz/fs';
import AppError from '@shared/errors/AppError';

let fakeUsersRepository: FakeUsersRepository;
let createUserService: CreateUserService;
let hashProvider: FakeHashProvider;
let updateUserAvatarService: UpdateUserAvatarService;
const filePath = `${__dirname}/testFiles/1.jpg`;
fs.exists(filePath).then(exists => {
	if (!exists) throw new Error('files does not exists');
});

describe('CreateUser', () => {
	beforeEach(() => {
		fakeUsersRepository = new FakeUsersRepository();
		hashProvider = new FakeHashProvider();
		createUserService = new CreateUserService(
			fakeUsersRepository,
			hashProvider,
		);
		updateUserAvatarService = new UpdateUserAvatarService(fakeUsersRepository);
	});
	it('should update user avatar', async () => {
		const user = await createUserService.execute({
			name: 'John Doe',
			email: 'john@doe.com',
			password: 'John123456',
		});
		const avatar = await updateUserAvatarService.execute({
			user_id: user.id,
			avatarFilename: filePath,
		});
		expect(avatar.name).toBe('John Doe');
	});
	it('should not be able to update avatar from a user that does not exist', () => {
		expect(
			updateUserAvatarService.execute({
				user_id: 'false_id',
				avatarFilename: filePath,
			}),
		).rejects.toBeInstanceOf(AppError);
	});
});
