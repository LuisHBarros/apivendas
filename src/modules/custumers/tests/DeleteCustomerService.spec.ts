import { FakeCustomersRepository } from '../domain/repositories/fakes/fakeCustomersRepository';
import CreateCustomerService from '../services/CreateCustomerService';
import ListCustomerService from '../services/ListCustomerService';
import { ICustomer } from '../domain/models/ICustomer';
import DeleteCustomerService from '../services/DeleteCustomerService';
import AppError from '@shared/errors/AppError';

let fakeCustomersRepository: FakeCustomersRepository;
let createCustomer: CreateCustomerService;
let listCustomers: ListCustomerService;
let deleteCustomers: DeleteCustomerService;

describe('Delete', () => {
	beforeEach(() => {
		fakeCustomersRepository = new FakeCustomersRepository();
		createCustomer = new CreateCustomerService(fakeCustomersRepository);
		listCustomers = new ListCustomerService(fakeCustomersRepository);
		deleteCustomers = new DeleteCustomerService(fakeCustomersRepository);
	});
	it('should be able to delete customers', async () => {
		const customer = await createCustomer.execute({
			name: 'John Doe',
			email: 'john@doe.com',
		});
		await deleteCustomers.execute({ id: customer.id });
		let list_of_customers: ICustomer[];
		list_of_customers = await listCustomers.execute();
		expect(list_of_customers[0]).toBe(undefined);
	});
	it('should not be able to delete a unregistered customer', async () => {
		expect(deleteCustomers.execute({ id: 'not a id' })).rejects.toBeInstanceOf(
			AppError,
		);
	});
});
