import AppError from "@shared/errors/AppError";
import { inject, injectable } from "tsyringe";
import { ICustomer } from "../domain/models/ICustomer";
import { IShowCustomer } from "../domain/models/IShowCustomer";
import {ICustomersRepository} from "../domain/repositories/ICustomersRepository";

@injectable()
class ShowCustomerService {
	constructor(
		@inject("CustomersRepository")
	private customerRepository: ICustomersRepository) { }
	public async execute({ id: user_id }: IShowCustomer): Promise<ICustomer> {


		const customer = await this.customerRepository.findById(user_id)

		if (!customer) {
			throw new AppError("Customer not found", 404)
    }

		return customer;
	}
}

export default ShowCustomerService
