import { getCustomRepository } from 'typeorm';
import Customer from '../typeorm/entities/Customer';
import CustomersRepository from '../typeorm/repositories/customersRepository';

class ListCustomerService{
	public async execute(): Promise<Array<Customer>> {
		const customersRepository = getCustomRepository(CustomersRepository);


		return await customersRepository.find();
	}
}

export default ListCustomerService;
