import 'reflect-metadata';
import CreateCustomerService from '../services/CreateCustomerService';
import { FakeCustomersRepository } from '../domain/repositories/fakes/fakeCustomersRepository';
import AppError from '@shared/errors/AppError';

let fakeCustomersRepository: FakeCustomersRepository;
let createCustomer: CreateCustomerService;

describe('CreateCustomer', () => {
	beforeEach(() => {
		fakeCustomersRepository = new FakeCustomersRepository();
		createCustomer = new CreateCustomerService(fakeCustomersRepository);
	});
	it('should be able to create a new customer', async () => {
		const customer = await createCustomer.execute({
			name: 'John Doe',
			email: 'john@doe.com',
		});
		expect(customer).toHaveProperty('id');
	});
	it('should not be able to create a customer with email that already exists', async () => {
		await createCustomer.execute({
			name: 'John Doe',
			email: 'john@doe.com',
		});

		expect(
			createCustomer.execute({
				name: 'John Doe',
				email: 'john@doe.com',
			}),
		).rejects.toBeInstanceOf(AppError);
	});
});
