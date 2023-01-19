import FakeUsersRepository from '../domain/repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '../providers/fakes/FakeHashProvider';
import CreateUserService from '../services/CreateUserService';
import ListUserService from '../services/ListUserService';
import User from '../infra/typeorm/entities/User';

let fakeUsersRepository: FakeUsersRepository;
let createUser: CreateUserService;
let listUsersService: ListUserService;
let hashProvider: FakeHashProvider;

describe('ListUser', () => {
	beforeEach(() => {
		fakeUsersRepository = new FakeUsersRepository();
		hashProvider = new FakeHashProvider();
		createUser = new CreateUserService(fakeUsersRepository, hashProvider);
		listUsersService = new ListUserService(fakeUsersRepository);
	});
	it('should list registered users', async () => {
		await createUser.execute({
			name: 'John Doe',
			email: 'john.doe@example.com',
			password: 'Abcd123456',
		});
		const userList = await listUsersService.execute();
		const userInList = userList.find(
			user => user.email === 'john.doe@example.com',
		);
		expect(userInList).toBeInstanceOf(User);
	});
});
