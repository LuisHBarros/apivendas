import { FakeCustomersRepository } from '../domain/repositories/fakes/fakeCustomersRepository';
import AppError from '@shared/errors/AppError';
import CreateCustomerService from '../services/CreateCustomerService';
import { create } from 'domain';
import ListCustomerService from '../services/ListCustomerService';
import Customer from '../infra/typeorm/entities/Customer';
import { ICustomer } from '../domain/models/ICustomer';

let fakeCustomersRepository: FakeCustomersRepository;
let createCustomer: CreateCustomerService;
let listCustomers: ListCustomerService;

describe('ListCustomers', () => {
	beforeEach(() => {
		fakeCustomersRepository = new FakeCustomersRepository();
		createCustomer = new CreateCustomerService(fakeCustomersRepository);
		listCustomers = new ListCustomerService(fakeCustomersRepository);
	});
	it('should be able to list customers', async () => {
		const customers = await createCustomer.execute({
			name: 'John Doe',
			email: 'john@doe.com',
		});
		let list_of_customers: ICustomer[];
		list_of_customers = await listCustomers.execute();
		expect(list_of_customers[0].name).toBe('John Doe');
	});
});
