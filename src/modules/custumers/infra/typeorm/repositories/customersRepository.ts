import { Repository } from 'typeorm';
import Customer from '../entities/Customer';
import { getRepository } from 'typeorm';
import { ICreateCustomer } from '@modules/custumers/domain/models/ICreateCustomer';
import { ICustomer } from '@modules/custumers/domain/models/ICustomer';
import { ICustomersRepository } from '@modules/custumers/domain/repositories/ICustomersRepository';

class CustomersRepository implements ICustomersRepository {
	private ormRepository: Repository<Customer>;
	constructor() {
		this.ormRepository = getRepository(Customer);
	}

	public async findAll(): Promise<Array<Customer>> {
		return this.ormRepository.find();
	}

	public async create({ name, email }: ICreateCustomer): Promise<Customer> {
		const customer = this.ormRepository.create({ name, email });
		return await this.ormRepository.save(customer);
	}
	public async save(customer: Customer): Promise<Customer> {
		await this.ormRepository.save(customer);
		return customer;
	}

	public async findByName(name: string): Promise<Customer | undefined> {
		const customer = await this.ormRepository.findOne({
			where: {
				name,
			},
		});

		return customer;
	}

	public async findById(id: string): Promise<Customer | undefined> {
		const customer = await this.ormRepository.findOne({
			where: {
				id,
			},
		});

		return customer;
	}

	public async findByEmail(email: string): Promise<Customer | undefined> {
		const customer = await this.ormRepository.findOne({
			where: {
				email,
			},
		});

		return customer;
	}
	public async delete(customer: ICustomer): Promise<void> {
		this.ormRepository.remove(customer);
	}
}

export default CustomersRepository;
