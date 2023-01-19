import { FakeCustomersRepository } from '../domain/repositories/fakes/fakeCustomersRepository';
import AppError from '@shared/errors/AppError';
import CreateCustomerService from '../services/CreateCustomerService';
import ShowCustomerService from '../services/ShowCustomerService';

let fakeCustomersRepository: FakeCustomersRepository;
let createCustomer: CreateCustomerService;
let showCustomer: ShowCustomerService;

describe('ShowCustomers', () => {
	beforeEach(() => {
		fakeCustomersRepository = new FakeCustomersRepository();
		createCustomer = new CreateCustomerService(fakeCustomersRepository);
		showCustomer = new ShowCustomerService(fakeCustomersRepository);
	});
	it('should be able to show customers', async () => {
		const customer = await createCustomer.execute({
			name: 'John Doe',
			email: 'john@doe.com',
		});
		const customerProfile = await showCustomer.execute({ id: customer.id });
		expect(customerProfile.name).toBe('John Doe');
	});
	it('should not be able to show a unregistered customer', () => {
		expect(showCustomer.execute({ id: 'not an id' })).rejects.toBeInstanceOf(
			AppError,
		);
	});
});
