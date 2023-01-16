import { getCustomRepository } from 'typeorm';
import Customer from '../typeorm/entities/Customer';
import CustomersRepository from '../typeorm/repositories/customersRepository';

class ListCustomerService{
	public async execute(): Promise<Customer[]> {
		const customerRepository = getCustomRepository(CustomersRepository);

		return await customerRepository.find();
	}
}

export default ListCustomerService;
