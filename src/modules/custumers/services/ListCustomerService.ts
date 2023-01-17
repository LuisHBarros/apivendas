import { inject, injectable } from 'tsyringe';
import { ICustomer } from '../domain/models/ICustomer';
import {ICustomersRepository} from '../domain/repositories/ICustomersRepository';

@injectable()
class ListCustomerService{
constructor(
		@inject("CustomersRepository")
	private customersRepository: ICustomersRepository) { }


	public async execute(): Promise<Array<ICustomer>> {

		return await this.customersRepository.findAll();
	}
}

export default ListCustomerService;
