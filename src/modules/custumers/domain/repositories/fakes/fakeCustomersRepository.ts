import { v4 as uuidv4 } from 'uuid';
import { ICreateCustomer } from '@modules/custumers/domain/models/ICreateCustomer';
import { ICustomersRepository } from '../ICustomersRepository';
import Customer from '@modules/custumers/infra/typeorm/entities/Customer';
import { ICustomer } from '../../models/ICustomer';

export class FakeCustomersRepository implements ICustomersRepository {
	private customers: Customer[] = [];

	public async create({ name, email }: ICreateCustomer): Promise<Customer> {
		const customer = new Customer();
		customer.id = uuidv4();
		customer.name = name;
		customer.email = email;
		this.customers.push(customer);

		return customer;
	}
	public async save(customer: Customer): Promise<Customer> {
		const findIndex = this.customers.findIndex(
			findCustomer => findCustomer.id === customer.id,
		);
		this.customers[findIndex] = customer;
		return customer;
	}

	public async findByName(name: string): Promise<Customer | undefined> {
		return this.customers.find(customer => customer.name === name);
	}

	public async findById(id: string): Promise<Customer | undefined> {
		return this.customers.find(customer => customer.id === id);
	}

	public async findByEmail(email: string): Promise<Customer | undefined> {
		return this.customers.find(customer => customer.email === email);
	}

	public async findAll(): Promise<Customer[]> {
		return this.customers;
	}

	public async delete(customer: ICustomer): Promise<void> {
		const findIndex = this.customers.findIndex(
			findCustomer => findCustomer.id === customer.id,
		);
		this.customers.splice(findIndex, 1);
	}
}
