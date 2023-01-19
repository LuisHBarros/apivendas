import 'reflect-metadata';
import CreateCustomerService from '../services/CreateCustomerService';
import { FakeCustomersRepository } from '../domain/repositories/fakes/fakeCustomersRepository';
import AppError from '@shared/errors/AppError';
import customersRouter from '../infra/http/routes/customer.routes';
import UpdateCustomerService from '../services/UpdateCustomerService';

let fakeCustomersRepository: FakeCustomersRepository;
let createCustomerService: CreateCustomerService;
let updateCustomerService: UpdateCustomerService;

describe('UpdateCustomer', () => {
	beforeEach(() => {
		fakeCustomersRepository = new FakeCustomersRepository();
		createCustomerService = new CreateCustomerService(fakeCustomersRepository);
		updateCustomerService = new UpdateCustomerService(fakeCustomersRepository);
	});
	it('should be able to update a customer', async () => {
		const customer = await createCustomerService.execute({
			name: 'John Doe',
			email: 'johndoe@example.com',
		});
		const customer_updated = await updateCustomerService.execute({
			id: customer.id,
			name: 'John Doe2',
			email: 'johndoe@example.com',
		});
		expect(customer_updated.name).toBe('John Doe2');
	});
	it('should not be able to update a unregistered customer', async () => {
		expect(
			updateCustomerService.execute({
				id: 'unregistered',
				name: 'John Doe',
				email: 'johndoe@example.com',
			}),
		).rejects.toBeInstanceOf(AppError);
	});
	it('should not be able to update a customer with a email that already registered', async () => {
		await createCustomerService.execute({
			name: 'John Doe',
			email: 'johndoe@example.com',
		});
		const customer = await createCustomerService.execute({
			name: 'John Doe',
			email: 'johndoe2@example.com',
		});
		expect(
			updateCustomerService.execute({
				id: customer.id,
				name: 'John Doe',
				email: 'johndoe@example.com',
			}),
		).rejects.toBeInstanceOf(AppError);
	});
});
